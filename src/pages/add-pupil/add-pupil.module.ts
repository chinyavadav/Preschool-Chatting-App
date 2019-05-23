import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPupilPage } from './add-pupil';

@NgModule({
  declarations: [
    AddPupilPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPupilPage),
  ],
})
export class AddPupilPageModule {}
