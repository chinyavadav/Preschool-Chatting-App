import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject, FileUploadOptions } from  '@ionic-native/file-transfer';
import { HomePage } from '../home/home';
import { GlobalProvider } from '../../providers/global/global';

/**
 * Generated class for the AddPupilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-pupil',
  templateUrl: 'add-pupil.html',
})
export class AddPupilPage {
  myphoto:any;
  defaultPhotoPath:string="assets/imgs/placeholder_home.jpg";
  imgPath=this.defaultPhotoPath;
	public formAddUser: FormGroup;
	constructor(public transfare: FileTransfer, public camera:Camera, public http:Http, public alertCtrl:AlertController ,public global:GlobalProvider ,public loadingCtrl:LoadingController , public toastCtrl: ToastController, public formBuilder:FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
    var validators={
      "name":[Validators.required,Validators.pattern("[A-Za-z\s]{2,50}")],
      "dob":[Validators.required],
    };
    this.formAddUser=this.formBuilder.group({
      firstname: ['',validators.name],
      surname: ['',validators.name],
      sex: [''],
      dob: ['',validators.dob],      
    });
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AddPupilPage');
	}

  returnHome(){
      this.navCtrl.setRoot(HomePage);
  }

  addUser() {
    if(this.formAddUser.valid && this.myphoto!=this.defaultPhotoPath){
      let loader = this.loadingCtrl.create({
        content: "Adding User...",
        spinner:"bubbles"
      });
      loader.present();
      let postData:any;
      postData=this.formAddUser.value;

      this.http.post(this.global.serverAddress+"api/add_pupil.php", JSON.stringify(postData))
        .subscribe(data => {
          console.log(data["_body"]);
          let response = JSON.parse(data["_body"]);
          if(response.response=="success"){
            loader.dismiss();
            this.uploadImage(response.accountno);
            let alert = this.alertCtrl.create({
              title: 'Add Pupil',
              subTitle: "Pupil's Account successfully created!",
              buttons: ['OK']
            });
            alert.present();
            this.returnHome();
          }else{
            loader.dismiss();
            let alert = this.alertCtrl.create({
                title: 'Add User',
                subTitle: "Pupil's Account could not be added!",
                buttons: ['OK']
            });
            alert.present();
         }
        }, error => {
          loader.dismiss();
          let toast = this.toastCtrl.create({
            message: 'Resolve Connectivity Issue!',
            duration: 3000,
            position: 'bottom',
            cssClass: 'dark-trans',
            closeButtonText: 'OK',
            showCloseButton: true
          });
          toast.present();
        }
      );
    }else{
      let toast = this.toastCtrl.create({
        message: 'Properly fill in all details!',
        duration: 3000,
        position: 'bottom',
        cssClass: 'dark-trans',
        closeButtonText: 'OK',
        showCloseButton: true
      });
      toast.present();
    }
  }

  //destinationType: this.camera.DestinationType.FILE_URI,
  takePhoto(){
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      //sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      allowEdit: false,
      targetWidth:  640,
      targetHeight: 480
    }

    this.camera.getPicture(options).then((imageData) => {
     this.myphoto = 'data:image/jpeg;base64,' + imageData;
     this.imgPath=this.myphoto;
    }, (err) => {
      this.imgPath=this.defaultPhotoPath;
      let toast = this.toastCtrl.create({
        message: 'Could not access camera!',
        duration: 3000,
        position: 'bottom',
        cssClass: 'dark-trans',
        closeButtonText: 'OK',
        showCloseButton: true
      });
      toast.present();
    });
  }

  uploadImage(accountno){
    //show loading
    let loader = this.loadingCtrl.create({
      content: "Uploading Image..."
    });
    loader.present();
    //create file transfare object
    if(this.myphoto!=this.defaultPhotoPath){
      const fileTransfare: FileTransferObject=this.transfare.create();
      //option transfare
      let options: FileUploadOptions={
        fileKey: 'photo',
        fileName: accountno+".jpg",
        chunkedMode: false,
        httpMethod: "post",
        mimeType: "image/jpeg",
        headers: {}
      }
      fileTransfare.upload(this.myphoto, this.global.serverAddress+"api/upload.php", options)
        .then((data) =>{
          loader.dismiss();       
        }, (err)=> {
          loader.dismiss();
          let toast = this.toastCtrl.create({
            message: 'Could not upload image!',
            duration: 3000,
            position: 'bottom',
            cssClass: 'dark-trans',
            closeButtonText: 'OK',
            showCloseButton: true
          });
          toast.present();
      });
    }else{
      loader.dismiss();
      let toast = this.toastCtrl.create({
          message: 'No image to upload seleted!',
          duration: 3000,
          position: 'bottom',
          cssClass: 'dark-trans',
          closeButtonText: 'OK',
          showCloseButton: true
        });
        toast.present();
    }
  }

  getPhoto(){
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit: true,
      targetWidth: 640,
      targetHeight: 480
    }

    this.camera.getPicture(options).then((imageData) => {
     this.myphoto = 'data:image/jpeg;base64,' + imageData;
     this.imgPath=this.myphoto;
    }, (err) => {
        this.imgPath=this.defaultPhotoPath;
        let toast = this.toastCtrl.create({
          message: 'Could not open Gallery!',
          duration: 3000,
          position: 'bottom',
          cssClass: 'dark-trans',
          closeButtonText: 'OK',
          showCloseButton: true
        });
        toast.present();
    });
  }
}
