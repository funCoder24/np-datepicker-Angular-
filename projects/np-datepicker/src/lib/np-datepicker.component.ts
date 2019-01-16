import { Component, OnInit, forwardRef, EventEmitter, Output, Input } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import { DMType, splitedDate } from './Models/types';
import { DateModel } from './Models/date-model';
import { NpDate } from './Controllers/np-date';
import { DateConverter } from './Controllers/date-converter';
import { DateHelper } from './Controllers/date-helper';

@Component({
  selector: 'np-datepicker',
  templateUrl : './np-datepicker.component.html',
  styleUrls : ['./np-datepicker.component.scss'],
  providers : [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NpDatepickerComponent),
      multi: true
    }
  ]
})
export class NpDatepickerComponent implements OnInit, ControlValueAccessor {

  onChange: (value: any) => void;
  onTouched: () => {
    onChange();
  };
  disabled: boolean;
  value: string = '';

  writeValue(value: string): void {
    this.value = value ? value : '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  //Properties Start

  private _selectedMonthId: number;
  public get selectedMonthId(): number {
    return this._selectedMonthId;
  }
  public set selectedMonthId(v: number) {
    this._selectedMonthId = v;
    this.setMonthCallander();
  }

  private _selectedMonth: DMType;
  public get selectedMonth(): DMType {
    return DateModel.monthDataNp.find(month => month.id == this.selectedMonthId);
  }
  public set selectedMonth(v: DMType) {
    this._selectedMonth = v;
    this.selectedMonthId = v.id;
  }

  private _selectedYear: string;
  public get selectedYear(): string {
    return this._selectedYear;
  }
  public set selectedYear(v: string) {
    this._selectedYear = v;
    this.setMonthCallander();
  }

  private monthCalanderData: any[] = [];
  private setMonthCallander() {
    let selectedYear: number;
    let selectedMonth: number;

    if (this.selectedYear) {
      selectedYear = parseInt(this.selectedYear);
    } else {
      selectedYear = 2000;
    }

    if (this.selectedMonth) {
      selectedMonth = this.selectedMonth.id;
    } else {
      selectedMonth = 1;
    }

    let startWeekDay = DateHelper.getNepaliWeekDay(selectedYear, selectedMonth, 1);
    let totalDays = DateModel.nepaliDateData[selectedYear % 2000][selectedMonth - 1];

    let daysData: any[] = [];
    for (let i = 1; i < startWeekDay; i++) {
      daysData.push({ day: "", dayOfWeek: "", enabled: false });
    }
    let weekTrack = startWeekDay;
    for (let i = 0; i < totalDays; i++) {
      let day = {
        day: (i + 1),
        dayOfWeek: weekTrack,
        enabled: true
      };
      if (weekTrack < 7) {
        weekTrack++;
      } else {
        weekTrack = 1;
      }
      daysData.push(day);
    }
    let lastRowCellCount = (daysData.length % 7);
    let remaningEmptyCells = 7 - (lastRowCellCount == 0
      ? 7
      : lastRowCellCount);
    for (let i = 0; i < remaningEmptyCells; i++) {
      daysData.push({ day: "", dayOfWeek: "", enabled: false });
    }
    this.monthCalanderData = daysData;
  }

  public get dayData(): any {
    if (this.monthCalanderData.length <= 0) {
      this.setMonthCallander();
    }
    return this.monthCalanderData;
  }

  public get weekData(): DMType[] {
    return DateModel.weekDataNp;
  }

  public get monthData(): DMType[] {
    return DateModel.monthDataNp;
  }

  @Input() inputClass: { [key: string]: boolean };
  @Input() inputStyle: { [key: string]: string };

  @Input() calenderClass: { [key: string]: boolean };
  @Input() calenderStyle: { [key: string]: string };


  @Output() change = new EventEmitter();

  public selectedDay: string;
  public selectedWeekDay: string;
  public className: any;
  private textBox: HTMLInputElement;
  public pickerCalenderStyle;

  //Properties End

  constructor() { }

  ngOnInit() {
    this.textBox = <HTMLInputElement>document.getElementById("npDatePicker");
    // this.textBox.autocomplete = "off";
    let textBoxValue = this.textBox.value;
    if (textBoxValue) {
      let splitedDate: splitedDate = DateHelper.splitDate(textBoxValue);
      this.selectedYear = splitedDate.year.toString();
      this.selectedMonthId = splitedDate.month;
      this.selectedDay = splitedDate.dayOfMonth.toString();
    } else {
      let enDateNow = new Date();
      let npDateNow: NpDate = DateConverter.ADtoBS(enDateNow);

      this.selectedYear = npDateNow.yearBs;
      this.selectedMonth = npDateNow.monthBs;
    }
    // this.setCalendersPosition();
    // this.showCalender = false;
    // document.getElementById("npDatePickerInput").onfocus = (e) => {
    //   this.setCalendersPosition(e);
    // }
    // this.selectedDay = npDateNow.dayBs.day.toString();
  }

  // setCalendersPosition(e) {
  //   debugger
  //   let npDPInput = e.target;
  //   this.pickerCalenderStyle = {
  //     'top': (npDPInput.offsetTop + npDPInput.offsetHeight) + 'px',
  //     'left': ((npDPInput.offsetLeft + npDPInput.offsetWidth / 2) - (93.5)) + 'px'
  //   };


  // }

  selectDay(day: string, weekDay: string) {
    if (day && weekDay) {
      this.selectedDay = day;
      this.selectedWeekDay = weekDay;


      let selectedDate = this.selectedYear + "/" + this.selectedMonth.id + "/" + this.selectedDay;

      this.value = selectedDate;
      if(this.onChange){
        this.onChange(selectedDate);
      }
      
      let ad = DateConverter.BStoAD(this.selectedYear + "/" + this.selectedMonth.id + "/" + this.selectedDay);
      // let bs = DateConverter.ADtoBS(ad);
      let bs = new NpDate({
        date: this.selectedYear + "/" + this.selectedMonth.id + "/" + this.selectedDay
      });
      this.change.emit(bs);
    }
  }

  incrementMonth() {
    if (this.selectedMonth && this.selectedYear && parseInt(this.selectedYear) <= 2099) {
      if (this.selectedMonth.id == 12) {
        if (parseInt(this.selectedYear) < 2099) {
          this.selectedYear = (parseInt(this.selectedYear) + 1).toString();
          this.selectedMonth = DateModel.monthDataNp.find(month => month.id == this.selectedMonth.id - 11);
        }
      } else {
        this.selectedMonth = DateModel.monthDataNp.find(month => month.id == this.selectedMonth.id + 1);
      }
      let totalDaysInMonth = DateModel.nepaliDateData[parseInt(this.selectedYear) % 2000][this.selectedMonth.id - 1];
      if (parseInt(this.selectedDay) > totalDaysInMonth) {
        this.selectedDay = totalDaysInMonth.toString();
      }
      // this.setMonthCallander();
      console.log(this.selectedMonth, DateModel.monthDataNp.find(month => month.id == this.selectedMonth.id));
    }
  }

  decrementMonth() {
    if (this.selectedMonth && this.selectedYear && parseInt(this.selectedYear) >= 2000) {
      if (this.selectedMonth.id == 1) {
        if (parseInt(this.selectedYear) > 2000) {
          this.selectedYear = (parseInt(this.selectedYear) - 1).toString();
          this.selectedMonth = DateModel.monthDataNp.find(month => month.id == this.selectedMonth.id + 11);
        }
      } else {
        this.selectedMonth = DateModel.monthDataNp.find(month => month.id == this.selectedMonth.id - 1);
      }
      let totalDaysInMonth = DateModel.nepaliDateData[parseInt(this.selectedYear) % 2000][this.selectedMonth.id - 1];
      if (parseInt(this.selectedDay) > totalDaysInMonth) {
        this.selectedDay = totalDaysInMonth.toString();
      }
      // this.setMonthCallander();
      console.log(this.selectedMonth, DateModel.monthDataNp.find(month => month.id == this.selectedMonth.id));
    }
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

}
