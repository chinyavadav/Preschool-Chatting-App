import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import { ChatServiceProvider } from "../../providers/chat-service/chat-service";
import { PipesModule } from "../../pipes/pipes.module";
import { RelativeTimePipe } from "../../pipes/relative-time/relative-time";


@NgModule({
  declarations: [
    ChatPage,
    RelativeTimePipe,
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
    PipesModule
  ],
  exports: [
    ChatPage
  ],
  providers: [
    ChatServiceProvider,
  ]
})
export class ChatPageModule {}
