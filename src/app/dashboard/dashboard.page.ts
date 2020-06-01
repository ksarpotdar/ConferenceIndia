import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { MenuController, Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  enableCallFlag = false;
  enableConferenceFlag = false;

  constructor(
    public global: GlobalService,
    private menu: MenuController,
    public platform: Platform,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.menu.enable(true, 'main-menu');
  }

  logout() {
    this.global.signOut();
  }

  enableConference() {
    this.enableCallFlag = false;
    this.enableConferenceFlag = true;
  }

  navigateTo(pageName) {
    switch (pageName) {
      case 'profile':
        this.navCtrl.navigateForward(['/profile']);
        break;
    }
  }

  enableCall() {
    this.enableCallFlag = true;
    this.enableConferenceFlag = false;
  }
}
