import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyChildrenPage } from './my-children';

@NgModule({
  declarations: [
    MyChildrenPage,
  ],
  imports: [
    IonicPageModule.forChild(MyChildrenPage),
  ],
})
export class MyChildrenPageModule {}
