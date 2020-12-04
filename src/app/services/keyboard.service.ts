import { Subject, Observable } from 'rxjs';
import { HostListener, Injectable } from '@angular/core';
import { throttle, throttleTime } from 'rxjs/operators';
import {io} from 'socket.io-client/build/index';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  pointerSub = new Subject<{ x: number, y: number }>();
  socket:any;

  inputxy(x: number, y: number) {
    this.pointerSub.next({ x, y }); 
  }

  getSuggestions(sentence: string) {
    const queryParams = new HttpParams()
    .set('sentence', sentence);

    return this.httpService.get('http://localhost:5000', {
      params: queryParams
    });
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

  constructor(private httpService: HttpClient) {
  }
}
