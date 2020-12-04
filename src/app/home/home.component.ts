import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  cardData = [
    { text: 'Sample Text', title: 'Hi' },
    { text: 'Sample Text', title: 'Hi' },
    { text: 'Sample Text', title: 'Hi' },
    { text: 'Sample Text', title: 'Hi' },
    { text: 'Sample Text', title: 'Hi' },
    { text: 'Sample Text', title: 'Hi' },
  ]
  constructor() { }

  ngOnInit() {
  }

}
