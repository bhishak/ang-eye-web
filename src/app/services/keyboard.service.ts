import { Subject, Observable } from 'rxjs';
import { HostListener, Injectable } from '@angular/core';
import { throttle, throttleTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  pointerSub = new Subject<{ x: number, y: number }>();

  inputxy(x: number, y: number) {
    this.pointerSub.next({ x, y });
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
