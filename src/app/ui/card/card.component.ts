import { Component, Input, OnInit } from '@angular/core';

interface inputConfig {
  imageLink?: string,
  title?: string,
  text?: string,
  link?: string,
}
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent implements OnInit {
  _config: inputConfig;
  data: inputConfig = {};
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

  loadDataInit() {
    this.data = this.getConfig();
  }

  ngOnInit() {
  }

}
