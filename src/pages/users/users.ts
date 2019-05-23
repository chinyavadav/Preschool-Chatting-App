import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,LoadingController, ItemSliding, AlertController} from 'ionic-angular';
import { Http } from '@angular/http';
import { AddUserPage } from '../add-user/add-user';
import { ChatPage } from '../chat/chat';
import { ProfilePage } from '../profile/profile';
import { ChatServiceProvider } from "../../providers/chat-service/chat-service";
import { GlobalProvider } from "../../providers/global/global";
/**
 * Generated class for the UsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
	users=[];
	public total:number=0;
	public filterType:string;
	constructor(public toastCtrl: ToastController, public alertCtrl:AlertController, public chatService:ChatServiceProvider, public global:GlobalProvider, public navCtrl: NavController,public loadingCtrl:LoadingController, public navParams: NavParams, public http: Http) {
		if(this.global.session==null){
			this.navCtrl.pop();
		}else{
			this.filterType=navParams.get('type')
			console.log(this.filterType);
		}
	}

	profile(item: ItemSliding,accountno:string){
		this.navCtrl.push(ProfilePage,{"accountno":accountno});
		item.close();
	}

	add(item,title,accountno){
		let alert = this.alertCtrl.create({
	    title: 'Add '+title,
	    inputs: [
	      {
	        name: 'pupilid',
	        placeholder: 'Pupil ID',
	        type: 'text'
	      }
	    ],
	    buttons: [
	      {
	        text: 'Cancel',
	        role: 'cancel',
	        handler: data => {
	          console.log('Cancel clicked');
	        }
	      },
	      {
	        text: 'Add',
	        handler: data => {
	        	this.post(accountno,data.pupilid);
	        }
	      }
	    ]
	  });
	  alert.present();
	  item.close();
	}

	post(accountno,pupilid) {
      let loader = this.loadingCtrl.create({
        content: "Adding...",
        spinner:"bubbles"
      });
      loader.present();
      let postData={
        "pupilid":pupilid,
        "accountno":accountno,
      };
      console.log(postData);
      this.http.post(this.global.serverAddress+"api/addchild.php", JSON.stringify(postData))
        .subscribe(data => {
          console.log(data["_body"]);
          let response = JSON.parse(data["_body"]);
          if(response.response=="success"){
            let alert = this.alertCtrl.create({
              title: 'Add Child/Pupil',
              subTitle: 'Child/Pupil successfully added!',
              buttons: ['OK']
            });
            alert.present();
          }else{

            let alert = this.alertCtrl.create({
                  title: 'Add Child/Pupil',
                  subTitle: 'Pupil could not be added!',
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
        }
      );
      loader.dismiss();
  }

	delete(item: ItemSliding,accountno:string){
		this.http.get(this.global.serverAddress+'api/deletepeople.php?acc='+accountno)
		  .subscribe(data => {
		    let resp=JSON.parse(data["_body"]);
		    if(resp.response=="success"){
		    	let toast = this.toastCtrl.create({
		            message: this.filterType +' successfully deleted!',
		            duration: 3000,
		            position: 'bottom',
		            cssClass: 'dark-trans',
		            closeButtonText: 'OK',
		            showCloseButton: true
		        });
		        toast.present();
		        this.initialiseUsers();
		    }else{
			    let toast = this.toastCtrl.create({
		            message: this.filterType +' could not be deleted!',
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

	filterUsers(ev: any) {
		this.http.get(this.global.serverAddress+'api/people.php?acc='+this.global.session.fldaccountno+"&type="+this.filterType)
		  .subscribe(data => {
		    this.users=JSON.parse(data["_body"]);
		   	let val = ev.target.value;
		    if (val && val.trim() !== '') {
		      this.users = this.users.filter((user) => {
		          return ((user.fldfirstname.toLowerCase().indexOf(val.toLowerCase()) > -1));
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
		this.initialiseUsers();
	}

	initialiseUsers() {
		this.http.get(this.global.serverAddress+'api/people.php?acc='+this.global.session.fldaccountno+"&type="+this.filterType)
		  .subscribe(data => {
		    this.users=JSON.parse(data["_body"]);
			this.getTotal();
		  }, error => {
		    console.log("failed");
		  }
		);
		this.chatService.getMsg();
	}
	
	pushUser(user){
		this.navCtrl.push(ChatPage, {'accountno':user.accountno, 'fullname': user.fullname, 'phoneno': user.phoneno,'type':user.type});
	}

	showAddUser(){
		this.navCtrl.push(AddUserPage,{'type':this.filterType});
	}

	getTotal(){
		this.total=this.users.length;
	}
}
