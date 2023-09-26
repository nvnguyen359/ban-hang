import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { map } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class SocketService {
  constructor(private socket: Socket) {}
  sendMessage(msg: any, key = "message") {
    this.socket.emit(key, msg);
  }
  getMessage(key: string = "message") {
    console.log("key:", key);
    return this.socket.fromEvent(key).pipe(map((data: any) => data));
  }
}
