import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController ,LoadingController, ItemSliding, AlertController} from 'ionic-angular';
import { Http } from '@angular/http';
import { AddPupilPage } from '../add-pupil/add-pupil';
import { PupilProfilePage } from '../pupil-profile/pupil-profile';
import { GlobalProvider } from "../../providers/global/global";
/**
 * Generated class for the pupilsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pupils',
  templateUrl: 'pupils.html',
})
export class PupilsPage {
	pupils=[];
	public total:number=0;
	public filterType:string;
	constructor(public toastCtrl: ToastController,public alertCtrl:AlertController, public global:GlobalProvider, public navCtrl: NavController,public loadingCtrl:LoadingController, public navParams: NavParams, public http: Http) {
		if(this.global.session==null){
			this.navCtrl.pop();
		}
	}

	profile(item: ItemSliding,pupilid:string){
		this.navCtrl.push(PupilProfilePage,{"pupilid":pupilid});
		item.close();
	}

	delete(item: ItemSliding,pupilid:string){
		this.http.get(this.global.serverAddress+'api/pupils.php?pupilid='+pupilid+"&delete")
		  .subscribe(data => {
		    let resp=JSON.parse(data["_body"]);
		    if(resp.response=="success"){
		    	let toast = this.toastCtrl.create({
		            message: 'Pupil successfully deleted!',
		            duration: 3000,
		            position: 'bottom',
		            cssClass: 'dark-trans',
		            closeButtonText: 'OK',
		            showCloseButton: true
		        });
		        toast.present();
		        this.initialisePupils();
		    }else{
			    let toast = this.toastCtrl.create({
		            message: 'Pupil could not be deleted!',
		            duration: 3000,
		            position: 'bottom',
		            cssClass: 'dark-trans',
		            closeButtonText: 'OK',
		            showCloseButton: true
		        });
		        toast.present();
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
		item.close();
	}

	filterPupils(ev: any) {
		this.http.get(this.global.serverAddress+'api/pupils.php')
		  .subscribe(data => {
		    this.pupils=JSON.parse(data["_body"]);
		   	let val = ev.target.value;
		    if (val && val.trim() !== '') {
		      this.pupils = this.pupils.filter((pupil) => {
		          return ((pupil.fldfirstname.toLowerCase().indexOf(val.toLowerCase()) > -1));
		      })
		    }
			this.getTotal();
		  }, error => {
		    console.log("failed");
		  }
		);
  	}

	isNetwork(network:any,phone:string){
		for(var i=0;i<network.length;i++){
			if(network[i].indexOf(phone.substr(0,2))>-1){
				return true;
			}		
		}
		return false;
	}

	ionViewDidEnter() {
		this.initialisePupils();
	}

	initialisePupils() {
		this.http.get(this.global.serverAddress+'api/pupils.php')
		  .subscribe(data => {
		    this.pupils=JSON.parse(data["_body"]);
			this.getTotal();
		  }, error => {
		    console.log("failed");
		  }
		);
	}

	showAddPupil(){
		this.navCtrl.push(AddPupilPage);
	}

	getTotal(){
		this.total=this.pupils.length;
	}
}
