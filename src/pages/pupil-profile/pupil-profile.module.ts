import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PupilProfilePage } from './pupil-profile';

@NgModule({
  declarations: [
    PupilProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(PupilProfilePage),
  ],
})
export class ProfilePageModule {}
