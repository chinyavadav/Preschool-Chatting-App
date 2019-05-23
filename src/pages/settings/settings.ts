import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from '../../providers/global/global';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
	address:string;
	loader:any;
	private settingsForm: FormGroup;
	constructor(public toastCtrl: ToastController , public global:GlobalProvider,  public storage:Storage, public formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.address=this.global.serverAddress;
    var address_validators=[Validators.required,Validators.minLength(8), Validators.pattern('(?:(?:(?:ht|f)tp)s?://)?[\\w_-]+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?')];
    this.settingsForm=this.formBuilder.group({
      address: ['',address_validators]
    });
	}

    ionViewDidLoad() {
      console.log('ionViewDidLoad SettingsPage');
    }

  	updateSettings(){
        if(this.settingsForm.valid){
          this.storage.set("serverAddress",this.address);
          this.global.serverAddress=this.address;

    		  let toast = this.toastCtrl.create({
                message: 'Settings have been updated',
                duration: 3000,
                position: 'bottom',
                cssClass: 'dark-trans',
                closeButtonText: 'OK',
                showCloseButton: true
            });
            toast.present();
        }
	}

}
