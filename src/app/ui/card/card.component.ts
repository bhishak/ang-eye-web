import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  _config: any;
  @Input('config') set config(value: any) {
    if (value) {
      this._config = value
      this.loadDataInit();
    }
  }
  constructor() { }

  getConfig() {
    return this._config;
  }

  loadDataInit() { }

  ngOnInit() {
  }

}
