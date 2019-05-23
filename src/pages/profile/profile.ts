import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { Http } from '@angular/http';
import { CallNumber } from '@ionic-native/call-number';
import { ChatPage } from '../chat/chat';
import { ChatServiceProvider } from "../../providers/chat-service/chat-service";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
	account:any={};
	constructor(public callNumber:CallNumber, public chatService:ChatServiceProvider, public http:Http, public toastCtrl: ToastController, public alertCtrl:AlertController, public global: GlobalProvider, public navCtrl: NavController, public navParams: NavParams) {
		if(this.navParams.get("accountno")==null){
			this.account=this.global.session;
		}else{
			this.getProfile(this.navParams.get("accountno"));
			this.chatService.getMsg();
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ProfilePage');
	}

	call(phoneno){
		this.callNumber.callNumber(phoneno, true)
		  .then(res => console.log('Launched dialer!', res))
		  .catch((err) =>{
		  	let alert = this.alertCtrl.create({
				title: 'Profile',
				subTitle: 'Dialer Error: '+err,
				buttons: ['OK']
			});
			alert.present();
		});
	}

	chat(accountno){
	    this.http.get(this.global.serverAddress+"api/profile.php?acc="+accountno)
	      .subscribe(data => {
	        let temp=JSON.parse(data["_body"]);
	        if(temp.response=="success"){
	          this.navCtrl.push(ChatPage,{'accountno':temp.fldaccountno,'phoneno':temp.fldphoneno, 'fullname':temp.fldfirstname+' '+temp.fldsurname, 'initials': temp.fldfirstname[0]+temp.fldsurname[0],'type':temp.fldtype});
	        }
	      }, error => {

	      }
	    );
	}

  	getProfile(accountno) {
		this.http.get(this.global.serverAddress+"api/profile.php?acc="+accountno)
		  .subscribe(data => {
		    let response=JSON.parse(data["_body"]);
		    if(response.response=="success"){
		    	this.account=response;
		    }else{
				let alert = this.alertCtrl.create({
					title: 'Profile',
					subTitle: 'Account could not be found!',
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
