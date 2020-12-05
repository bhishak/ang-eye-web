import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, AfterViewInit, Renderer2, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

// declare var $: any;
// declare var jQuery: any;

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss']
})
export class KeyComponent implements OnInit, OnDestroy, AfterViewInit {
  clickTimes = 10;
  currcount = 0;
  @ViewChild('key') private keyPosition: ElementRef;
  @Input() letter: string;
  @Input() classn: string;
  @Input() reset: Observable<boolean>;
  @Input() pixelInfo: Observable<{x: string, y: string}>;
  @Output() clicka = new EventEmitter();
  text: string = '';
  reset$: any;
  simulateHover$: any;
  keyPositionValues: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.keyPosition.nativeElement) {
      this.keyPositionValues = this.keyPosition.nativeElement.getBoundingClientRect();
    }
  }


  constructor(private renderer: Renderer2) {

  }

  ngOnInit(): void {
    this.reset$ = this.reset.pipe(
      filter(val => val === true)
    ).subscribe(() => {
      this.resetTimes();
    });

  }

  simulatehover() {
    this.currcount += 1;
    if (this.currcount > this.clickTimes) {
      this.emitClick(false);
    }
    this.renderer.setStyle(this.keyPosition.nativeElement, 'background', `rgba(255,0,0,${this.currcount/this.clickTimes}`);
  }

  ngAfterViewInit() {
    this.keyPositionValues = this.keyPosition.nativeElement.getBoundingClientRect();
    this.pixelInfo.subscribe(({x, y}) => {
      if (x> this.keyPositionValues.left && x< this.keyPositionValues.right) {
        if (y> this.keyPositionValues.top && y< this.keyPositionValues.bottom) {
          this.simulatehover();
        }
      } 
    });
  }

  emitClick(isMouseClick: boolean) {
    // this.text = JSON.stringify(this.keyPosition.nativeElement.getBoundingClientRect());
    // if (!isMouseClick) {
     this.clicka.emit(this.letter);
    // }
  }

  ngOnDestroy() {
    if (this.reset$) {
      this.reset$.unsubscribe();
    }
  }

  resetTimes() {
    this.currcount = 0;
    this.renderer.setStyle(this.keyPosition.nativeElement, 'background', `rgba(255,0,0,0`);
    // this.keyPositionValues = this.keyPosition.nativeElement.getBoundingClientRect();
  }

}
