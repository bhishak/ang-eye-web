import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements OnInit {
  firstLine = ['q','w','e','r','t','y','u','i','o','p']
  secondLine = ['a','s','d','f','g','h','j','k','l']
  thirdLine = ['z','x','c','v','b','n','m']
  extras = ['space', 'return', 'backspace']

  combinedArr = [...this.firstLine, ...this.secondLine, ...this.thirdLine, ... this.extras];
  CombinedObsObj = this.combinedArr.reduce((prev, curr) => {
    prev[`${curr}`] = new Subject<boolean>();
    return prev;
  }, {})

  reset = new Subject<boolean>();
  constructor() { }

  ngOnInit(): void {
    this.reset.next(true);
  }

}
