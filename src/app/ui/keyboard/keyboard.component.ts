import { KeyboardService } from './../../services/keyboard.service';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { max } from 'rxjs/operators';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements OnInit, AfterViewInit {
  @ViewChild('pointer') private pointer: ElementRef;
  @ViewChild('topleftkey') private topleftkey: ElementRef;
  @ViewChild('bottomkey') private bottomkey: ElementRef;
  @ViewChild('rightkey') private rightkey: ElementRef;
  @ViewChild('allkey') private allkey: ElementRef;
  @HostListener('mousemove', ['$event']) onMouseMove(event) {
    // console.log(event.clientX, event.clientY);
    // this.keyboardService.inputxy(event.clientX, event.clientY);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.allkey.nativeElement) {
      this.resizeWindow();
    }
  }
  suggestions: any = [];

  valuesObject = { left: 0, right: 0, top: 0, bottom: 0 }
  firstLine = ['q','w','e','r','t','y','u','i','o','p']
  secondLine = ['a','s','d','f','g','h','j','k','l']
  thirdLine = ['z','x','c','v','b','n']
  extras = ['space', 'return', 'backspace']
  stringa = '';
  keyboardPointer = new Subject<{x: number, y: number}>();

  combinedArr = [...this.firstLine, ...this.secondLine, ...this.thirdLine, ... this.extras];

  click(key: string) {
    if (key === 'space') {
      this.stringa = this.stringa + ' ';
    } else if (key === 'backspace') {
      if (this.stringa.length > 0) {
        this.stringa = this.stringa.slice(0, -1)
      }
    } else if (key === 'return') {
      this.stringa = '';
    } else {
      this.stringa = this.stringa + key;
    }
    this.keyboardService.getSuggestions(this.stringa).subscribe((res: any) => {
      console.log(res);
      if (res.length === 0 ) {
        this.suggestions = [' ',' ',' '];
      } else if (res.length === 1) {
        this.suggestions = [res[0], ' ', ' '];
      } else if (res.length === 2) {
        this.suggestions = [res[0], res[1], ' '];
      } else {
        this.suggestions = [res[0], res[1], res[2]]
      }
    });
    this.reset.next(true);
  }

  clickSuggestion(key: string) {
    if (this.stringa === '', this.stringa.endsWith(' ')) {
      this.stringa = this.stringa + `${key} `;
    } else {
      const words = this.stringa.split(' ');
      words.pop();
      const lastwords = words.join(' ');
      this.stringa = lastwords + ` ${key} `;
    }
    this.keyboardService.getSuggestions(this.stringa).subscribe((res: any) => {
      console.log(res);
      if (res.length === 0 ) {
        this.suggestions = ['','',''];
      } else if (res.length === 1) {
        this.suggestions = [res[0], ' ', ' '];
      } else if (res.length === 2) {
        this.suggestions = [res[0], res[1], ' '];
      } else {
        this.suggestions = [res[0], res[1], res[2]]
      }
    });
    this.reset.next(true);
  }


  reset = new Subject<boolean>();
  constructor(private keyboardService: KeyboardService, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.reset.next(true);
  }

  resizeWindow() {
    this.valuesObject.top = this.allkey.nativeElement.getBoundingClientRect().top;
    this.valuesObject.left = this.allkey.nativeElement.getBoundingClientRect().left;
    this.valuesObject.right = this.allkey.nativeElement.getBoundingClientRect().right;
    this.valuesObject.bottom = this.allkey.nativeElement.getBoundingClientRect().bottom;
  }

  findCursorPosition(x: number, y: number) {
    const miny = 0;
    const minx = 0;
    const maxy = 1080;
    const maxx = 1920;
    let estimatedxPosition = 0;
    let estimatedyPosition = 0;

    const xtoAdd = this.retMod(((this.valuesObject.right - this.valuesObject.left)/(maxx - minx))*(x-minx));
    const ytoAdd = this.retMod(((this.valuesObject.bottom - this.valuesObject.top)/(maxy - miny))*(y-miny));

    if (x<minx) {
      estimatedxPosition = minx;
    } else if (x>maxx) {
      estimatedxPosition = maxx;
    } else {
      estimatedxPosition = this.valuesObject.left + xtoAdd;
    }

    if (y<miny) {
      estimatedyPosition = miny;
    } else if (y>maxy) {
      estimatedyPosition = maxy;
    } else {
      estimatedyPosition = this.valuesObject.top + ytoAdd;
    }

    console.log(x, y);
    // console.log(this.valuesObject.right, this.valuesObject.left);
    return {x: estimatedxPosition, y: estimatedyPosition};
  }

  retMod(x) {
    return x>=0? x : -x;
  }

  ngAfterViewInit() {
    this.keyboardService.getSuggestions(this.stringa).subscribe((res) => {
      console.log(res);
      this.suggestions = res;
    });
    this.resizeWindow();
    this.keyboardService.getPointerSub().subscribe((val) => {
      if (val) {
        // let positionCursor = this.findCursorPosition(val.x, val.y);
        let positionCursor = val;
        this.renderer.setStyle(this.pointer.nativeElement, 'top', `${positionCursor.y}px`);
        this.renderer.setStyle(this.pointer.nativeElement, 'left', `${positionCursor.x}px`);
        this.keyboardPointer.next(positionCursor);
      }
    });
    this.keyboardService.startSocketClient();
  }

}
