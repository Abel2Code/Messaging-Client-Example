import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import * as io from 'socket.io-client';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: any;
  connection: any;
  messages: any;
  isMentee = true;
  messageData: any;
  @ViewChild(Content) content: Content;
  socketHost: string = "http://localhost:3000/";
  socket: any;
  zone: any;
  headers: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.user = "Abel";
    this.messages = [];

    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');

    this.socket = io.connect(this.socketHost + "5aa09ad2f4084537c8a7d45f");
    console.log('tried');
    this.zone = new NgZone({
      enableLongStackTrace: false
    });

    this.socket.emit('add user', this.user)
    this.socket.on("new message", (msg) =>{
      this.zone.run(()=>{
        console.log(msg);
        this.messages.push(msg);
        this.content.scrollToBottom();
      })
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenteeMessagingMentorPage');
  }

  addMessage(){
    // let connectionId = this.connection._id;
    // let sender_id = this.user;
    // let message = this.messageData;
    // new Promise(resolve => {
    //         let toSend = JSON.stringify({
    // 						"message": {
    // 	            "sender_id": sender_id,
    //               "content": message
    // 	          }
    // 				});
    //         console.log("hi")
    //         this.http.put('http://localhost:3000/api/connection/sendMessage/' + connectionId, toSend, {headers: this.headers})
    //               .map(res => res.json())
    //               .subscribe(data => {
    //                   resolve(data);
    //               });
    //       });
    let newMessage = {
      "sender_id": this.user,
      "content": this.messageData
    };

    this.messages.push(newMessage);
    this.socket.emit('new message', newMessage);
    this.messageData = "";
  }
}
