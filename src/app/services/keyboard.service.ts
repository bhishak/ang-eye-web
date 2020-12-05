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

    return this.httpService.get('http://localhost:7000/autosuggest', {
      params: queryParams
    });
  }

  startReceivingData() {
    this.startHttpService();
  }

  // startSocketClient() {
  //   this.socket = io('http://localhost:8080');

  //   this.socket.on('data', (res) => {
  //     this.inputxy(res.data.x, res.data.y);
  //   });
  // }

  startHttpService() {
    setInterval(() => {
      this.httpService.get('http://localhost:7000/keyboard').subscribe(
        (res:any) => {
          console.log(res);
          if(!res || res.length < 2)
          {
              return;
          }
          const xvar = res[0]
          const ybar = res[1]
          const xint = parseInt(res[0],10);
          const yint = parseInt(res[1],10);
          this.inputxy(xint, yint);
        }
      )
    }, 100)
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
