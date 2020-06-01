import { Component, OnInit } from '@angular/core';

import { Platform, MenuController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GlobalService } from './global.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    private nav: NavController,
    public global: GlobalService,
  ) {
    this.initializeApp();
  }
  openPage(pageName) {
    this.menu.close();
    switch (pageName) {
      case 'call':
        this.nav.navigateForward(['/call']);
        break;
      case 'conference':
        this.nav.navigateForward(['/conference']);
        break;
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.menu.enable(false, 'main-menu');
    });
  }

  ngOnInit() {
  }
}
