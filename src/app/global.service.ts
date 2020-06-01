import { Injectable } from '@angular/core';
declare var apiRTC: any;

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { NavController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public user: firebase.User;
  constructor(
    public afAuth: AngularFireAuth,
    private readonly navCtrl: NavController,
    private platform: Platform,
  ) {
    afAuth.authState.subscribe(user => {
      if (user) {
        localStorage.setItem('userInfo', JSON.stringify(user));
      }
      this.user = user;
    });
  }

  initAppRtc() {
    return new Promise((resolve, reject) => {
      apiRTC.init({
        apiKey: '2331bc11c6515ec0aeae3dad9066abaa',
        apiCCId: 123,
        onReady: (e) => {
          console.log(e);
          resolve(e);
        }
      });
    });
  }

  returnIsDesktop() {
    return (this.platform.is('desktop'));
  }


  login(credentials: { email: string; password: string; }) {
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
      credentials.password);
  }

  signup(credentials: { email: string; password: string; }) {
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email,
      credentials.password);
  }

  get authenticated(): boolean {
    return this.user !== null;
  }

  getEmail() {
    return this.user && this.user.email;
  }

  signOut(): Promise<void> {
    localStorage.clear();
    this.navCtrl.navigateRoot([`/login`]);
    return this.afAuth.auth.signOut();
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const localStorageUser = localStorage.getItem('userInfo');
    if (localStorageUser) {
      this.user = JSON.parse(localStorageUser);
    } else {
      this.navCtrl.navigateRoot([`/login`]);
    }
    return true;
  }
}
