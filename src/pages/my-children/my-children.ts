import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { GlobalProvider } from "../../providers/global/global";
import { Http } from '@angular/http';
import { PupilProfilePage } from '../pupil-profile/pupil-profile';

/**
 * Generated class for the MyChildrenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-children',
  templateUrl: 'my-children.html',
})
export class MyChildrenPage {
  children:any;
  total:number=0;
  constructor(public toastCtrl:ToastController, public http:Http, public global: GlobalProvider, public navCtrl: NavController, public navParams: NavParams) {
  	
  }

  	profile(item,pupilid){
		this.navCtrl.push(PupilProfilePage,{"pupilid":pupilid});
		item.close();
	}

    delete(apartmentid){
  		this.http.get(this.global.serverAddress+"api/my_children.php?acc="+this.global.session.fldaccountno+"&app="+apartmentid+"&delete")
		.subscribe(data => {
			let resp=JSON.parse(data["_body"]);
			if(resp.response=="success"){
				let toast = this.toastCtrl.create({
		          message: 'Child was successfully removed!',
		          duration: 3000,
		          position: 'bottom',
		          cssClass: 'dark-trans',
		          closeButtonText: 'OK',
		          showCloseButton: true
		        });
		        toast.present();
			}else{
				let toast = this.toastCtrl.create({
		          message: 'Child could not be removed!',
		          duration: 3000,
		          position: 'bottom',
		          cssClass: 'dark-trans',
		          closeButtonText: 'OK',
		          showCloseButton: true
		        });
		        toast.present();
			}
			this.getChildren();
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
  	}

	ionViewDidLoad() {
		this.getChildren();
		console.log('ionViewDidLoad MyChildrenPage');
	}

  	getChildren() {
		this.http.get(this.global.serverAddress+"api/my_children.php?acc="+this.global.session.fldaccountno)
		.subscribe(data => {
			this.children=JSON.parse(data["_body"]);
			this.getTotal();
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
  	}

  	getTotal(){
		this.total=this.children.length;
	}

}
