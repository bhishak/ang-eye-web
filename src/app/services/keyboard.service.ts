import { Subject, Observable } from 'rxjs';
import { HostListener, Injectable } from '@angular/core';
import { throttle, throttleTime } from 'rxjs/operators';
import {io} from 'socket.io-client/build/index';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  pointerSub = new Subject<{ x: number, y: number }>();
  socket:any;

  inputxy(x: number, y: number) {
    this.pointerSub.next({ x, y });
  }

  startSocketClient() {
    this.socket = io('http://localhost:8080');

    this.socket.on('data', (res) => {
      this.inputxy(res.data.x, res.data.y);
    });
  }

  getPointerSubNonThrottle() {
    return this.pointerSub.asObservable();
  }

  getPointerSub() {
    return this.getPointerSubNonThrottle().pipe(
      throttleTime(100),
    );
  }

  constructor() {
  }
}
