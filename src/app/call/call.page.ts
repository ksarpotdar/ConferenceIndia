import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { GlobalService } from '../global.service';
declare var apiRTC: any;
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Platform, AlertController, MenuController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


declare var iosrtc;
declare var apiRTC;
declare var apiCC;

const STATE_WAIT = 'wait';
const STATE_INCALL = 'incall';

const LABEL_CALL = 'Connect Call';
const LABEL_HANGOUT = 'End Call';

const COLOR_CALL = '#5cb85c';
const COLOR_HANGOUT = '#d9534f';


@Component({
  selector: 'app-call',
  templateUrl: './call.page.html',
  styleUrls: ['./call.page.scss'],
})
export class CallPage implements OnInit {

  distantNumber: any;
  webRTCClient: any;
  infoLabel: any;
  buttonLabel: any;
  buttonColor: any;
  state: any;
  remoteStreamAddedHandlerFlag = false;
  togglrFlag = true;
  remoteSize = {
    height: (this.platform.height() - 180).toString(),
    width: this.platform.width().toString()
  };
  user = {
    height: '96',
    width: '128'
  };
  conferenceName;
  constructor(
    public alertCtrl: AlertController,
    public platform: Platform,
    private androidPermissions: AndroidPermissions,
    private menu: MenuController,
  ) {
    this.incomingCallHandler = this.incomingCallHandler.bind(this);
    this.userMediaErrorHandler = this.userMediaErrorHandler.bind(this);
    this.remoteStreamAddedHandler = this.remoteStreamAddedHandler.bind(this);
    this.hangupHandler = this.hangupHandler.bind(this);
    this.refreshVideoView = this.refreshVideoView.bind(this);
    this.sessionReadyHandler = this.sessionReadyHandler.bind(this);
    this.userMediaSuccessHandler = this.userMediaSuccessHandler.bind(this);
    apiRTC.init({
      onReady: this.sessionReadyHandler,
      // apiCCId: 222,
      apiKey: 'Your key'
    });

    this.infoLabel = 'Registration Ongoing...';
    this.buttonLabel = LABEL_CALL;
    this.buttonColor = COLOR_CALL;
    this.state = STATE_WAIT;
  }

  ngOnInit() {
    this.menu.enable(true, 'main-menu');
    this.androidPermissions.requestPermissions(
      [
        this.androidPermissions.PERMISSION.CAMERA,
        this.androidPermissions.PERMISSION.RECORD_AUDIO,
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.READ_PHONE_STATE,
      ]
    );
  }

  pushCall(event) {
    console.log('Push, callState=' + this.state);
    if (this.distantNumber && this.state === STATE_WAIT) {
      setTimeout(this.refreshVideoView, 4000);
      this.webRTCClient.call(this.distantNumber);
    } else if (this.state === STATE_INCALL) {
      this.state = STATE_WAIT;
      this.buttonColor = COLOR_CALL;
      this.buttonLabel = LABEL_CALL;
      this.webRTCClient.hangUp();
      this.remoteStreamAddedHandlerFlag = false;
    }
  }

  sessionReadyHandler(e) {
    console.log('sessionReadyHandler');
    apiRTC.addEventListener('incomingCall', this.incomingCallHandler);
    apiRTC.addEventListener('userMediaError', this.userMediaErrorHandler);
    apiRTC.addEventListener('remoteStreamAdded', this.remoteStreamAddedHandler);
    apiRTC.addEventListener('userMediaSuccess', this.userMediaSuccessHandler);
    apiRTC.addEventListener('hangup', this.hangupHandler);
    this.webRTCClient = apiRTC.session.createWebRTCClient({ channelid: 123123 });
    this.infoLabel = 'Your local ID : ' + apiCC.session.apiCCId;
  }

  refreshVideoView() {
    if (this.platform.is('ios')) {
      console.log('REFRESH');
      iosrtc.refreshVideos();
    }
  }

  incomingCallHandler(e) {
    console.log('incomingCallHandler');
    this.state = STATE_INCALL;
    this.buttonColor = COLOR_HANGOUT;
    this.buttonLabel = LABEL_HANGOUT;
    setTimeout(this.refreshVideoView, 2000);
  }

  hangupHandler(e) {
    console.log('hangupHandler');
    this.state = STATE_WAIT;
    this.buttonColor = COLOR_CALL;
    this.buttonLabel = LABEL_CALL;
    this.remoteStreamAddedHandlerFlag = false;
    this.initMediaElementState(e.detail.callId);
  }

  userMediaSuccessHandler(e) {
    console.log('userMediaSuccessHandler', e);
    this.webRTCClient.addStreamInDiv(
      e.detail.stream,
      e.detail.callType,
      'mini',
      'miniElt-' + e.detail.callId,
      {},
      true
    );
    this.setUserSize('miniElt-' + e.detail.callId);
  }

  userMediaErrorHandler(e) {
    console.log(e);
  }

  remoteStreamAddedHandler(e) {
    console.log('remoteStreamAddedHandler', e);
    this.state = STATE_INCALL;
    this.buttonColor = COLOR_HANGOUT;
    this.buttonLabel = LABEL_HANGOUT;
    this.webRTCClient.addStreamInDiv(
      e.detail.stream,
      e.detail.callType,
      'remote',
      'remoteElt-' + e.detail.callId,
      false
    );
    this.setRemoteSize('remoteElt-' + e.detail.callId);
    this.remoteStreamAddedHandlerFlag = true;
    setTimeout(this.refreshVideoView, 1000);
  }

  setRemoteSize(id) {
    document.getElementById(id).setAttribute('width', this.remoteSize.width);
    document.getElementById(id).setAttribute('height', this.remoteSize.height);
  }

  setUserSize(id) {
    document.getElementById(id).setAttribute('width', this.user.width);
    document.getElementById(id).setAttribute('height', this.user.height);
  }

  toggleSize() {
    this.togglrFlag = !this.togglrFlag;
  }

  initMediaElementState(callId) {
    this.webRTCClient.removeElementFromDiv('mini', 'miniElt-' + callId);
    this.webRTCClient.removeElementFromDiv('remote', 'remoteElt-' + callId);
  }
}