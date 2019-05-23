import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ItemSliding, AlertController} from 'ionic-angular';
import { Http } from '@angular/http';
import { ChatPage } from '../chat/chat';
import { ProfilePage } from '../profile/profile';
import { ChatServiceProvider } from "../../providers/chat-service/chat-service";
import { GlobalProvider } from "../../providers/global/global";
/**
 * Generated class for the PeoplePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-people',
  templateUrl: 'people.html',
})
export class PeoplePage {
	people=[];
	baseUrl=this.global.serverAddress+'api/people.php?acc='+this.global.session.fldaccountno
	constructor(public alertCtrl:AlertController, public chatService:ChatServiceProvider, public global:GlobalProvider, public navCtrl: NavController,public loadingCtrl:LoadingController, public navParams: NavParams, public http: Http) {
		if(this.global.session==null){
			this.navCtrl.pop();
		}
		if(this.global.session.fldtype=='Parent'){
			this.baseUrl=this.baseUrl+"&exclude"
		}
	}

	profile(item: ItemSliding,accountno:string){
		this.navCtrl.push(ProfilePage,{"accountno":accountno});
		item.close();
	}

	filterPeople(ev: any) {
		this.http.get(this.baseUrl)
		  .subscribe(data => {
		    this.people=JSON.parse(data["_body"]);
		   	let val = ev.target.value;
		    if (val && val.trim() !== '') {
		      this.people = this.people.filter((person) => {
		          return ((person.fullname.toLowerCase().indexOf(val.toLowerCase()) > -1));
		      })
		    }
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
		this.initializePeople();
	}

	initializePeople() {
		this.http.get(this.baseUrl)
		  .subscribe(data => {
		    this.people=JSON.parse(data["_body"]);
		  }, error => {
		    console.log("failed");
		  }
		);
		this.chatService.getMsg();
	}
	pushPerson(person){
		this.navCtrl.push(ChatPage, {'accountno':person.accountno, 'fullname': person.fullname, 'phoneno': person.phoneno,'type':person.type});
	}
}
