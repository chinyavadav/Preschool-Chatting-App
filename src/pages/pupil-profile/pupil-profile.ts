import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { Http } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ChatServiceProvider } from "../../providers/chat-service/chat-service";

/**
 * Generated class for the PupilProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pupil-profile',
  templateUrl: 'pupil-profile.html',
})
export class PupilProfilePage {
	public profile:any={};
	constructor(public chatService:ChatServiceProvider, public camera:Camera, public http:Http, public toastCtrl: ToastController, public alertCtrl:AlertController, public global: GlobalProvider, public navCtrl: NavController, public navParams: NavParams) {
		if(this.navParams.get("pupilid")==null){
			this.navCtrl.pop();
		}else{
			this.getProfile(this.navParams.get("pupilid"));
		}
	}

	  //destinationType: this.camera.DestinationType.FILE_URI,
  	takePhoto(pupilid){
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
		    let myphoto = 'data:image/jpeg;base64,' + imageData;
	  		let data={
	  			'photo': myphoto,
	  			'pupilid': pupilid,
	  			'accountno': this.global.session.fldaccountno
	  		}
	  		this.http.post(this.global.serverAddress+"api/image_message.php",JSON.stringify(data))
			  .subscribe(data => {
			    let response=JSON.parse(data["_body"]);
			    if(response.response=="success"){
					let alert = this.alertCtrl.create({
						title: 'Report',
						subTitle: 'Report successfully sent!',
						buttons: ['OK']
					});
			      	alert.present();
			    }else{
					let alert = this.alertCtrl.create({
						title: 'Report',
						subTitle: 'Report could not be sent!',
						buttons: ['OK']
					});
			      	alert.present();
			    }  
			  }, error => {
		          let toast = this.toastCtrl.create({
		            message: 'Resolve Connectivity Issue!',
		            duration: 3000,
		            position: 'bottom',
		            cssClass: 'dark-trans',
		            closeButtonText: 'OK',
		            showCloseButton: true
		          });
		          toast.present();
			});
	    }, (err) => {
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

	ionViewDidLoad() {
		console.log('ionViewDidLoad PupilProfilePage');
	}

  	getProfile(pupilid) {
		this.http.get(this.global.serverAddress+"api/pupil_profile.php?pupilid="+pupilid)
		  .subscribe(data => {
		    let response=JSON.parse(data["_body"]);
		    console.log(response);
		    if(response.response=="success"){
		    	this.profile=response;
		    }else{
				let alert = this.alertCtrl.create({
					title: 'Profile',
					subTitle: 'Profile could not be found!',
					buttons: ['OK']
				});
		      	alert.present();
		    	this.navCtrl.pop();
		    }  
		  }, error => {
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
	}

}
