import { Component, ElementRef, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events, Content } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { CallNumber } from '@ionic-native/call-number';
import { ChatServiceProvider, ChatMessage, UserInfo } from "../../providers/chat-service/chat-service";
import { GlobalProvider } from "../../providers/global/global";

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  //msgList: ChatMessage[] = [];
  externalAccount: UserInfo;
  editorMsg = '';
  showEmojiPicker = false;
  chat:any;
  constructor(public callNumber: CallNumber,public global:GlobalProvider, public navCtrl: NavController, public navParams: NavParams,private chatService: ChatServiceProvider ,private events: Events) {
    if(navParams.get('accountno')==null){
      this.externalAccount={
        accountno: '',
        phoneno: '',
        fullname: '',
        type: ''
      }
      this.navCtrl.pop();
    }else{
      this.externalAccount={
        accountno: navParams.get('accountno'),
        phoneno: navParams.get('phoneno'),
        fullname: navParams.get('fullname'),
        type: navParams.get('type'),
      }
    }
  }

  view(imgData){
    window.open(imgData, "_self");
  }

  call(){
    let number=this.externalAccount.phoneno;
    this.callNumber.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  viewProfile(accountno:string){
    this.navCtrl.push(ProfilePage,{"accountno":accountno});
  }

  ionViewWillLeave() {
    this.events.unsubscribe('chat:received');
  }

  ionViewDidEnter() {
    this.events.subscribe('chat:received', msg => {
      this.pushNewMsg(msg);
    });
    this.getMessages();
  }

  getMessages(){
    this.chatService.getMsg();
    if(this.externalAccount.accountno=='11111111' || this.externalAccount.accountno=='00000000'){
    this.chat=this.chatService.msgList.filter((message)=> (message.toUserId==this.externalAccount.accountno));
    }else{
      this.chat=this.chatService.msgList.filter((message)=> (message.toUserId==this.global.session.fldaccountno && message.userId==this.externalAccount.accountno) || (message.userId==this.global.session.fldaccountno && message.toUserId==this.externalAccount.accountno));
    }
    this.onFocus();
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.focus();
    } else {
      this.setTextareaScroll();}

        this.content.resize();
    this.scrollToBottom();
  }

  /**
   * @name sendMsg
   */
  sendMsg(msgtype) {
    if (!this.editorMsg.trim()) return;
    let newMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: this.global.session.fldaccountno,
      fromUserName: this.global.session.fldfirstname+' '+this.global.session.fldsurname,
      toUserName: this.externalAccount.fullname,
      toUserId: this.externalAccount.accountno,
      time: Date.now(),
      message: this.editorMsg,
      type: msgtype,
      status: 'success'
    };

    this.pushNewMsg(newMsg);
    this.editorMsg = '';

    if (!this.showEmojiPicker) {
      this.focus();
    }
    this.chatService.sendMsg(newMsg);
  }

  /**
   * @name pushNewMsg
   * @param msg
   */
  pushNewMsg(msg: ChatMessage) {
    const userId = this.externalAccount.accountno;
    const toUserId = this.global.session.fldaccountno;
    if (msg.userId === userId && msg.toUserId === toUserId) {
      this.chat.push(msg);
    } else if (msg.toUserId === userId && msg.userId === toUserId) {
      this.chat.push(msg);
    }
    this.scrollToBottom();
  }

  getMsgIndexById(id: string) {
    return this.chatService.msgList.findIndex(e => e.messageId === id)
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        try{
           this.content.scrollToBottom();
        }catch{

        }        
      }
    }, 400)
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea =this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }

}
