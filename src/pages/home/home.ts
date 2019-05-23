import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatsPage } from '../chats/chats';
import { PeoplePage } from '../people/people';
import { GlobalProvider } from '../../providers/global/global';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
	chatsPage=ChatsPage;
	peoplePage=PeoplePage;
	constructor(public global:GlobalProvider, public navCtrl: NavController, public navParams: NavParams) {
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
