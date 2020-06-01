import { Component, OnInit } from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';
import { GlobalService } from '../global.service';
declare var apiRTC: any;

@Component({
  selector: 'app-conference',
  templateUrl: './conference.page.html',
  styleUrls: ['./conference.page.scss'],
})
export class ConferencePage implements OnInit {
  conferenceName = '';
  conferenceEnabled = false;
  connectedConversation = null;
  constructor(
    public platform: Platform,
    private menu: MenuController,
    public global: GlobalService,
  ) { }

  ngOnInit() {
    this.menu.enable(true, 'main-menu');
  }

  leaceConference() {
    this.connectedConversation.leave().then(() => {
      this.conferenceEnabled = false;
      window.location.href = '/';
    });
  }

  joinConference(name: any) {
    this.conferenceEnabled = true;
    const cloudUrl = 'https://cloud.apizee.com';
    let connectedSession = null;
    let localStream = null;

    // ==============================
    // 1/ CREATE USER AGENT
    // ==============================
    const ua = new apiRTC.UserAgent({
      uri: 'apzkey:yourkey'
    });

    // ==============================
    // 2/ REGISTER
    // ==============================
    ua.register({
      cloudUrl
    }).then((session: any) => {
      // Save session
      connectedSession = session;

      connectedSession
        .on('contactListUpdate', (updatedContacts: any) => { // display a list of connected users
          console.log('MAIN - contactListUpdate', updatedContacts);
          if (this.connectedConversation !== null) {
            const contactList = this.connectedConversation.getContacts();
            // tslint:disable-next-line: no-console
            console.info('contactList  connectedConversation.getContacts() :', contactList);
          }
        });

      // ==============================
      // 3/ CREATE CONVERSATION
      // ==============================
      this.connectedConversation = connectedSession.getConversation(name);

      // ==========================================================
      // 4/ ADD EVENT LISTENER : WHEN NEW STREAM IS AVAILABLE IN CONVERSATION
      // ==========================================================
      this.connectedConversation.on('streamListChanged', (streamInfo: { listEventType: string; isRemote: boolean; streamId: any; }) => {

        console.log('streamListChanged :', streamInfo);

        if (streamInfo.listEventType === 'added') {
          if (streamInfo.isRemote === true) {

            this.connectedConversation.subscribeToMedia(streamInfo.streamId)
              .then((stream: any) => {
                console.log('subscribeToMedia success');
              }).catch((err: any) => {
                console.error('subscribeToMedia error', err);
              });
          }
        }
      });
      // =====================================================
      // 4 BIS/ ADD EVENT LISTENER : WHEN STREAM WAS REMOVED FROM THE CONVERSATION
      // =====================================================
      this.connectedConversation.on('streamAdded', (stream:
        { addInDiv: (arg0: string, arg1: string, arg2: {}, arg3: boolean) => void; streamId: string; }) => {
        stream.addInDiv('remote-container', 'remote-media-' + stream.streamId, {}, false);
        document.getElementById('remote-media-' + stream.streamId).setAttribute('width', (this.platform.width() / 4).toString());
        /*
        // Subscribed Stream is available for display
        // Get remote media container
        // tslint:disable-next-line: prefer-const
        let container = document.getElementById('remote-container');
        // Create media element
        // tslint:disable-next-line: prefer-const
        let mediaElement = document.createElement('video');
        mediaElement.id = 'remote-media-' + stream.streamId;
        mediaElement.autoplay = true;
        mediaElement.muted = false;
        // Add media element to media container
        container.appendChild(mediaElement);
        // Attach stream
        stream.attachToElement(mediaElement);
        */
      }).on('streamRemoved', (stream: { removeFromDiv: (arg0: string, arg1: string) => void; streamId: string; }) => {
        stream.removeFromDiv('remote-container', 'remote-media-' + stream.streamId);
        /*
                    document.getElementById('remote-media-' + stream.streamId).remove();
        */
      });

      // ==============================
      // 5/ CREATE LOCAL STREAM
      // ==============================
      const createStreamOptions: any = {};
      createStreamOptions.constraints = {
        audio: true,
        video: true
      };

      ua.createStream(createStreamOptions)
        .then((stream:
          {
            removeFromDiv: (arg0: string, arg1: string) => void;
            addInDiv: (arg0: string, arg1: string, arg2: {}, arg3: boolean) => void;
          }) => {

          console.log('createStream :', stream);

          // Save local stream
          localStream = stream;
          stream.removeFromDiv('local-container', 'local-media');
          stream.addInDiv('local-container', 'local-media', {}, true);
          document.getElementById('local-media').setAttribute('width', (this.platform.width() / 4).toString());
          /*
                    // Get media container
                    const container = document.getElementById('local-container');
                    // Create media element
                    const mediaElement = document.createElement('video');
                    mediaElement.id = 'local-media';
                    mediaElement.autoplay = true;
                    mediaElement.muted = true;
                    // Add media element to media container
                    container.appendChild(mediaElement);
                    // Attach stream
                    localStream.attachToElement(mediaElement);
          */
          // ==============================
          // 6/ JOIN CONVERSATION
          // ==============================
          this.connectedConversation.join()
            .then((response: any) => {
              // ==============================
              // 7/ PUBLISH OWN STREAM
              // ==============================
              this.connectedConversation.publish(localStream, null);
            }).catch((err: any) => {
              console.error('Conversation join error', err);
            });

        }).catch((err: any) => {
          console.error('create stream error', err);
        });
    });
  }
}
