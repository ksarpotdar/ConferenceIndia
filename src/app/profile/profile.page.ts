import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { LoadingController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import * as imagePicker from '@ionic-native/image-picker';
declare var window;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  displayName: string;
  profilePic: any;
  showInput = true;
  cropService: any;
  constructor(
    public global: GlobalService,
    public loadingController: LoadingController,
    public toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.presentLoading();
    setTimeout(() => {
      if (this.global.user.displayName) {
        this.showInput = false;
      } else {
        this.showInput = true;
      }
    }, 1000);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
  }

  setUserName() {
    if (this.displayName) {
      this.global.user.updateProfile({ displayName: this.displayName });
    }
  }

  uploadImage(imageURI: any) {
    return new Promise<any>((resolve, reject) => {
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child('image').child('imageName');
      this.encodeImageUri(imageURI, (image64: string) => {
        imageRef.putString(image64, 'data_url')
          .then(snapshot => {
            resolve(snapshot.downloadURL);
          }, err => {
            reject(err);
          });
      });
    });
  }

  // tslint:disable-next-line: unified-signatures
  encodeImageUri(imageUri: string, callback: { (image64: any): void; (arg0: string): void; }) {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const aux: any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      const dataURL = c.toDataURL('image/jpeg');
      callback(dataURL);
    };
    img.src = imageUri;
  }

  openImagePicker() {
    imagePicker.ImagePicker.hasReadPermission().then(
      (result) => {
        if (result === false) {
          // no callbacks required as this opens a popup which returns async
          imagePicker.ImagePicker.requestReadPermission();
        }
        else if (result === true) {
          imagePicker.ImagePicker.getPictures({
            maximumImagesCount: 1
          }).then(
            (results) => {
              for (let i = 0; i < results.length; i++) {
                this.uploadImageToFirebase(results[i]);
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  openImagePickerCrop() {
    imagePicker.ImagePicker.hasReadPermission().then(
      (result) => {
        if (result === false) {
          // no callbacks required as this opens a popup which returns async
          imagePicker.ImagePicker.requestReadPermission();
        }
        else if (result === true) {
          imagePicker.ImagePicker.getPictures({
            maximumImagesCount: 1
          }).then(
            (results) => {
              for (let i = 0; i < results.length; i++) {
                this.cropService.crop(results[i], { quality: 75 }).then(
                  newImage => {
                    this.uploadImageToFirebase(newImage);
                  },
                  error => console.error('Error cropping image', error)
                );
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  uploadImageToFirebase(image) {
    image = window.Ionic.WebView.convertFileSrc(image);

    // uploads img to firebase storage
    this.uploadImage(image)
      .then(async photoURL => {

        console.log('success');
      });
  }
}
