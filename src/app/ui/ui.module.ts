import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { NavbarComponent } from './navbar/navbar.component';
import { KeyComponent } from './key/key.component';
import { KeyboardComponent } from './keyboard/keyboard.component';



@NgModule({
  declarations: [
    CardComponent,
    NavbarComponent,
    KeyComponent,
    KeyboardComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CardComponent,
    NavbarComponent,
    KeyComponent,
    KeyboardComponent,
  ]
})
export class UiModule { }
