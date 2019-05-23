import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ItemSliding, AlertController} from 'ionic-angular';
import { Http } from '@angular/http';
import { ChatPage } from '../chat/chat';
import { ProfilePage } from '../profile/profile';
import { UserInfo, ChatServiceProvider } from "../../providers/chat-service/chat-service";
import { GlobalProvider } from "../../providers/global/global";
/**
 * Generated class for the ChatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
	chats=[];
	externalAccount :UserInfo;
	constructor(public alertCtrl:AlertController, public chatService:ChatServiceProvider, public global:GlobalProvider, public navCtrl: NavController,public loadingCtrl:LoadingController, public navParams: NavParams, public http: Http) {
		if(this.global.session==null){
			this.navCtrl.pop();
		}
	}

	profile(item: ItemSliding,accountno:string){
		this.navCtrl.push(ProfilePage,{"accountno":accountno});
		item.close();
	}

	filterChats(ev: any) {
		this.http.get(this.global.serverAddress+'api/chats.php?acc='+this.global.session.fldaccountno)
		  .subscribe(data => {
		    this.chats=JSON.parse(data["_body"]);
		   	let val = ev.target.value;
		    if (val && val.trim() !== '') {
		      this.chats = this.chats.filter((chat) => {
		          return ((chat.fullname.toLowerCase().indexOf(val.toLowerCase()) > -1));
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
		this.initializeChats();
	}

	initializeChats() {
		this.http.get(this.global.serverAddress+'api/chats.php?acc='+this.global.session.fldaccountno)
		  .subscribe(data => {
		    this.chats=JSON.parse(data["_body"]);
		  }, error => {
		    console.log("failed");
		  }
		);
		this.chatService.getMsg();
	}

	pushChat(chat){
		this.navCtrl.push(ChatPage, {'accountno':chat.accountno, 'fullname': chat.fullname, 'phoneno': chat.phoneno,'type':chat.type});
	}

	pushGroupChat(chat){
		this.navCtrl.push(ChatPage, {'accountno':chat.accountno, 'fullname': chat.fullname, 'phoneno': chat.phoneno,'type':chat.type});
	}
}
