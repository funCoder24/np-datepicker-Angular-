import { DateParams, DMType, DayType, splitedDate } from '../Models/types';
import { DateModel } from '../Models/date-model';
import { DateHelper } from './date-helper';
import { ThrowStmt } from '@angular/compiler';

export class NpDate {
    public pickerLang: string = 'np';
    public dateFormat: string = 'yyyy/MM/dd';
    public dateBs: string;
    public dateAd: string;
    public yearBs: string;
    public yearAd: string;
    public monthBs: DMType;
    public monthAd: DMType;
    public weekDayBs: DMType;
    public weekDayAd: DMType;
    public dayBs: DayType;
    public dayAd: DayType;

    constructor();
    constructor(date: string);
    constructor(date: DateParams);
    constructor(date?: string | DateParams) {
        if (date) {
            if (typeof date == "string") {
                this.dateFromString(date);
            } else {
                this.dateFromDateModel(date);
            }
        } else {
            //Code to write for constructor with no parameter
        }
        let enDate: Date = this.toDateAD();
        this.yearAd = enDate.getFullYear().toString();
        this.monthAd = DateModel.monthDataEn.find((month => month.id == enDate.getMonth()+1));
        this.dayAd = {
            day: enDate.getDate(),
            weekDay: DateModel.weekDataEn.find(week => week.id == enDate.getDay()+1)
        };
        
    }

    public toDateAD(){
        return DateHelper.toDateAD({ year: parseInt(this.yearBs), month: this.monthBs.id, dayOfMonth: this.dayBs.day });
    }

    public toString(format?: string): string {
        let formatArray: string[];
        let dateFormat: string;
        let dateSaperator: string;
        if (format) {
            dateFormat = format;
        } else {
            dateFormat = this.dateFormat;
        }

        if (dateFormat.indexOf('/') > 0) {
            dateSaperator = '/';
            formatArray = dateFormat.split('/');
        } else if (dateFormat.indexOf('-') > 0) {
            dateSaperator = '-';
            formatArray = dateFormat.split('-');
        } else {
            console.log("Date format '" + dateFormat + "' is not valid date format.");
            return;
        }
        let formattableDate = [];

        formatArray.forEach((fs, i) => {
            formattableDate.push({
                index: i,
                value: this.getFormatValue(fs)
            });
        });


        let formattedDate: string = "";
        for (let i = 0; i < formattableDate.length; i++) {
            formattedDate += formattableDate.find(fd => fd.index == i).value + ((i < 2) ? dateSaperator : '');
        }
        return formattedDate;

    }

    private dateFromString(date: string) {
        let dateArray: string[] = []
        if (date.indexOf('/') > 0) {
            dateArray = date.split('/');
        } else if (date.indexOf('-') > 0) {
            dateArray = date.split('-');
        }
        if (dateArray[0].length == 4) {
            this.yearBs = dateArray[0];
            this.monthBs = DateModel.monthDataNp.find((month => month.id == parseInt(dateArray[1])));
            let weekDay = DateHelper.getNepaliWeekDay(parseInt(this.yearBs), this.monthBs.id, parseInt(dateArray[2]));
            this.dayBs = {
                day: parseInt(dateArray[2]),
                weekDay: DateModel.weekDataNp.find(week => week.id == weekDay)
            }
        }
        else if (dateArray[2].length == 4) {
            this.yearBs = dateArray[2];
            this.monthBs = DateModel.monthDataNp.find((month => month.id == parseInt(dateArray[0])));
            let weekDay = DateHelper.getNepaliWeekDay(parseInt(this.yearBs), this.monthBs.id, parseInt(dateArray[1]));
            this.dayBs = {
                day: parseInt(dateArray[1]),
                weekDay: DateModel.weekDataNp.find(week => week.id == weekDay)
            }
        }
    }

    private dateFromDateModel(date: DateParams) {
        if (typeof date.date == "string") {
            this.dateFromString(date.date);
        } else {
            let splitedDate: splitedDate = date.date
            this.yearBs = splitedDate.year.toString();
            this.monthBs = DateModel.monthDataNp.find((month => month.id == splitedDate.month));
            let weekDay = DateHelper.getNepaliWeekDay(parseInt(this.yearBs), this.monthBs.id, splitedDate.dayOfMonth);
            this.dayBs = {
                day: splitedDate.dayOfMonth,
                weekDay: DateModel.weekDataNp.find(week => week.id == weekDay)
            }
        }
        let weekDay = DateHelper.getNepaliWeekDay(parseInt(this.yearBs), this.monthBs.id, this.dayBs.day);
        this.pickerLang = date.pickerLanguage || 'np';
        this.dateFormat = date.dateFormat || 'yyyy/MM/dd';
        this.weekDayBs = DateModel.weekDataNp.find(week => week.id == weekDay) || undefined;
    }

    private getFormatValue(formatText: string): string {
        switch (formatText) {
            case 'yyyy':
                return this.yearBs
                break;
            case 'MM':
                return this.monthBs.id.toString()
                break;
            case 'dd':
                return this.dayBs.day.toString()
            default:
                break;
        }
    }
}
