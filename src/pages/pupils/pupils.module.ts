import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PupilsPage } from './pupils';

@NgModule({
  declarations: [
    PupilsPage,
  ],
  imports: [
    IonicPageModule.forChild(PupilsPage),
  ],
})
export class PupilsPageModule {}
