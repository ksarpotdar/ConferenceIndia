import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public userName: string;
  public password: any;
  constructor(
    public router: Router,
    public global: GlobalService,
    public alertController: AlertController,
    private readonly navCtrl: NavController,
  ) { }

  ngOnInit() {
    const localStorageUser = localStorage.getItem('userInfo');
    if (localStorageUser) {
      this.navCtrl.navigateRoot([`/dashboard`]);
    }
  }
  signup() { }

  login() {
    this.global.login({ email: this.userName, password: this.password }).then((user) => {
      localStorage.setItem('userInfo', JSON.stringify(user));
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      });
    }, (err) => {
      this.presentAlert(err);
    });
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      subHeader: msg.code,
      message: msg.message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Create User',
          handler: () => {
            this.global.signup({ email: this.userName, password: this.password }).then(() => {
              this.login();
            });
          }
        }
      ]
    });

    await alert.present();
  }

}
