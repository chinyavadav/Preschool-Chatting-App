import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators/map';
import { Http } from "@angular/http";
import { Observable } from "rxjs/observable";
import { GlobalProvider } from '../global/global';

/*
  Generated class for the ChatServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export class ChatMessage {
  messageId: string;
  userId: string;
  fromUserName: string;
  toUserName: string;
  toUserId: string;
  time: number | string;
  message: string;
  type: string;
  status: string;
}

export class UserInfo {
  accountno: string;
  phoneno?: string;
  fullname?: string;
  type?: string;
}

@Injectable()
export class ChatServiceProvider {
	accountno:string;
  	msgList: ChatMessage[] = [];
	constructor(public global: GlobalProvider, private http: Http) {
		console.log('Hello ChatServiceProvider Provider');
	}
	
	getMsg() {
	    // Get mock message list
	    return this.getMsgList().subscribe(res => {
	      console.log(res);
	        this.msgList=res;//filter(item => (item.userId.indexOf(this.localAccount.accountno) !== -1 && item.toUserId.indexOf(this.externalAccount.accountno) !== -1) || (item.userId.indexOf(this.externalAccount.accountno) !== -1 && item.toUserId.indexOf(this.localAccount.accountno) !== -1)) ;
	    });
  	}

  getMsgList(): Observable<ChatMessage[]> {
    const msgListUrl = this.global.serverAddress+'api/messages.php?accountno='+this.global.session.fldaccountno; //msg-list.json
    return this.http.get(msgListUrl).pipe(map(response =>JSON.parse(response["_body"]).array));
  }

  sendMsg(msg: ChatMessage) {
    console.log(msg);
    this.http.get(this.global.serverAddress+'api/message.php?from='+msg.userId+'&to='+msg.toUserId+"&message="+msg.message+"&type="+msg.type)
      .subscribe(data => {
        let response=JSON.parse(data["_body"]);
        console.log(response);
        if(response.response=="success"){
          this.getMsg();
        }
      }, error => {
        console.log("failed to send");
      }
    );
  }

  getUserInfo(): Promise<UserInfo> {
    const userInfo: UserInfo = {
      accountno: this.accountno,
      phoneno: this.global.session.fldphoneno,
      fullname: this.global.session.fldfirstname+' '+this.global.session.fldsurname,
      type: this.global.session.fldtype
    };
    return new Promise(resolve => resolve(userInfo));
  }

}
