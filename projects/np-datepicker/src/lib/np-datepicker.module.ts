import { NgModule } from '@angular/core';
import { NpDatepickerComponent } from './np-datepicker.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [NpDatepickerComponent],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    NpDatepickerComponent
  ]
})
export class NpDatepickerModule { }
