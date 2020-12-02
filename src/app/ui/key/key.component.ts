import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss']
})
export class KeyComponent implements OnInit, OnDestroy {
  clickTimes = 40;
  currcount = 0;

  @Input() letter: string;
  @Input() classn: string;
  @Input() reset: Observable<boolean>;
  @Input() simulateHover: Observable<boolean>;
  @Output() click = new EventEmitter();
  reset$: any;
  simulateHover$: any;

  constructor() { }

  ngOnInit(): void {
    this.reset$ = this.reset.pipe(
      filter(val => val === true)
    ).subscribe(() => {
      this.resetTimes();
    });

    this.simulateHover$ = this.simulateHover.pipe(
      filter(val => val === true)
    ).subscribe(() => {
      this.simulatehover();
    });
  }

  simulatehover() {
    
  }

  ngOnDestroy() {
    if (this.reset$) {
      this.reset$.unsubscribe();
    }
    if (this.simulateHover$) {
      this.simulateHover$.unsubscribe();
    }
  }

  resetTimes() {
    this.currcount = 0;
  }

}
