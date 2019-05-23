import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { GlobalProvider } from "../providers/global/global";
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MyChildrenPage } from '../pages/my-children/my-children';
import { PupilsPage } from '../pages/pupils/pupils';
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { UsersPage } from '../pages/users/users';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any;
  constructor(public platform: Platform,public global: GlobalProvider, public storage: Storage, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }

  initializeApp() {   
    this.platform.ready().then(() => {
      this.storage.ready().then(()=> {
        this.storage.get('serverAddress').then((val) =>{
          this.setServerAddress(val);
        });
        this.storage.get('session').then((val) =>{
          this.setAccount(val);
        });
      });
    });
  }

  setAccount(val){
    this.global.session=val;
    if(this.global.session==null){
      this.rootPage = LoginPage;   
    }else{
      this.global.accessLevel=this.global.session.fldtype;
      this.rootPage = HomePage;        
    }
  }

  setServerAddress(val){
    this.global.serverAddress=val;
    console.log(val);
  }

  logout(){
    this.storage.remove("session");    
    this.global.session=null;
    this.global.accessLevel=null;
    this.nav.setRoot(LoginPage);
  }

  openPage(index) {
    var pages=[MyChildrenPage,PupilsPage,ProfilePage,SettingsPage];
    this.nav.push(pages[index]);
  }

  openUsersPage(type) {
    this.nav.push(UsersPage,{'type':type});
  }
}
