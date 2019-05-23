import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule} from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { File } from  '@ionic-native/file';
import { FileTransfer } from  '@ionic-native/file-transfer';
import { CallNumber } from '@ionic-native/call-number';
import { RelativeTimePipe } from '../pipes/relative-time/relative-time';

import { MyApp } from './app.component';
import { AddUserPage } from '../pages/add-user/add-user';
import { AddPupilPage } from '../pages/add-pupil/add-pupil';
import { ChatPage } from '../pages/chat/chat';
import { ChatsPage } from '../pages/chats/chats';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MyChildrenPage } from '../pages/my-children/my-children';
import { PeoplePage } from '../pages/people/people';
import { ProfilePage } from '../pages/profile/profile';
import { PupilProfilePage } from '../pages/pupil-profile/pupil-profile';
import { PupilsPage } from '../pages/pupils/pupils';
import { SettingsPage } from '../pages/settings/settings';
import { UsersPage } from '../pages/users/users';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GlobalProvider } from '../providers/global/global';
import { ChatServiceProvider } from '../providers/chat-service/chat-service';

@NgModule({
  declarations: [
    MyApp,
    AddPupilPage,
    AddUserPage,
    ChatPage,
    ChatsPage,
    HomePage,
    LoginPage,
    MyChildrenPage,
    PeoplePage,
    PupilsPage,
    PupilProfilePage,
    ProfilePage,
    RelativeTimePipe,
    SettingsPage,
    UsersPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AddPupilPage,
    AddUserPage,
    ChatPage,
    ChatsPage,
    HomePage,
    LoginPage,
    MyChildrenPage,
    PeoplePage,
    PupilsPage,
    PupilProfilePage,
    ProfilePage,
    SettingsPage,
    UsersPage,    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File,
    FileTransfer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalProvider,
    CallNumber,
    ChatServiceProvider
  ]
})
export class AppModule {}
