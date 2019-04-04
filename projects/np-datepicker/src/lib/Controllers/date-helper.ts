import { DateModel } from '../Models/date-model';
import { splitedDate } from '../Models/types';

export class DateHelper {

    static toDateAD(date: splitedDate): Date {
        let enDate: Date;
        let daysCount: number = this.countTotalNepaliDays(date);
        enDate = this.addDaysAD(DateModel.initialDateEn, daysCount);
        return enDate;
    }

    static countTotalNepaliDays(date: string): number;
    static countTotalNepaliDays(date: splitedDate): number;
    static countTotalNepaliDays(date: string | splitedDate): number {
        let splitedDate: splitedDate;
        if (typeof date == "string") {
            splitedDate = this.splitDate(date);
        }else{
            splitedDate = date;
        }

        let yearIndex = splitedDate.year % 2000;
        let totalDays = 0;
        for (let i = 0; i < yearIndex; i++) {
            DateModel
                .nepaliDateData[i]
                .forEach(days => totalDays += days);
        }
        for (let i = 0; i < splitedDate.month - 1; i++) {
            totalDays += DateModel.nepaliDateData[yearIndex][i];
        }
        return totalDays += splitedDate.dayOfMonth;
    }

    static countTotalEngDays(date: Date);
    static countTotalEngDays(date: string);
    static countTotalEngDays(date: Date | string): number { //returns days between 1943/04/14 and "supplied Date"
        // let dt: Date;
        if (typeof date === "string") {
            date = new Date(date);
        }
        if (this.isEnglishDateInRange(date)) {
            let totalDays = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(DateModel.initialDateEn.getFullYear(), DateModel.initialDateEn.getMonth(), DateModel.initialDateEn.getDate())) / (1000 * 60 * 60 * 24));
            return totalDays;
        }
        console.log("Date is out of range. Date range must be between 1943 and 2042");
        return -1;
    }

    

    static getNepaliWeekDay(year: number, month: number, day: number): number {
        if (this.isNepaliDateInRange(year, month, day)) {
            let totalDays = this.countTotalNepaliDays({ year, month, dayOfMonth: day });
            let calculatedDay = (totalDays + 3) % 7;
            return calculatedDay == 0
                ? 7
                : calculatedDay;
        }
        return 1
    }

    static isNepaliDateInRange(year: number, month: number, day: number): boolean {
        if (year > 2099 || year < 2000) {
            return false;
        }
        if (month > 12 || month < 1) {
            return false;
        }
        let daysInThisYearMonth = DateModel.nepaliDateData[year % 2000][month - 1];
        if (day > daysInThisYearMonth || day < 1) {
            return false;
        }
        return true;
    }

    static isEnglishDateInRange(date: Date): boolean {
        if (date.getFullYear() >= 1943 && date.getFullYear() <= 2042) {
            if (date.getFullYear() == 1943 || date.getFullYear() == 2042) {
                if (date.getMonth() <= 3) {
                    if (date.getMonth() == 3) {
                        if (date.getDate() <= 14) {
                            return true;
                        }
                    }
                }
            } else {
                return true;
            }
            return false;
        }
    }

    public static splitDate(date: string): splitedDate{
        let dateArray: string[] = []
        if (date.indexOf('/') > 0) {
            dateArray = date.split('/');
        } else if (date.indexOf('-') > 0) {
            dateArray = date.split('-');
        }
        else{
            return;
        }
        if (dateArray[0].length == 4) {
            return {
                year: parseInt(dateArray[0]),
                month: dateArray[1] ? parseInt(dateArray[1]) : undefined,
                dayOfMonth : dateArray[2] ? parseInt(dateArray[2]): undefined
            }
        }
        else if (dateArray[2].length == 4) {
            return {
                year: parseInt(dateArray[2]),
                month: parseInt(dateArray[0]),
                dayOfMonth: parseInt(dateArray[1])
            }
        }
    }

    private static addDaysAD(date : Date, days : number) : Date {
        date.setDate(date.getDate() + days - 1);
        return date;
    }

    public static addDaysBs(date: splitedDate, days: number):splitedDate{
        let initialDays: number = days;
        let splitedDateToReturn: splitedDate = {
            year: 0,
            month: 0,
            dayOfMonth: 0
        };
        let yearIndex: number = date.year%2000;
        let monthIndex : number = 0;

        while(days > 365){
            DateModel.nepaliDateData[yearIndex].forEach((month, i) => {
                if(yearIndex == date.year%2000){
                    if(i == date.month-1){
                        days -= (month - date.dayOfMonth);
                    }
                    if(i > date.month-1){
                        days -= month;
                    }
                }else{
                    days -= month;
                }
            });
            yearIndex ++;
        }
        splitedDateToReturn.year = yearIndex > 0 ? yearIndex+2000 : 2000;
        if(yearIndex == date.year%2000){
            monthIndex = date.month-1;
        }
        let curMonthsDays = DateModel.nepaliDateData[yearIndex][monthIndex];
        while (days >= curMonthsDays) {
            curMonthsDays = DateModel.nepaliDateData[yearIndex][monthIndex];
            if(yearIndex == date.year%2000 && monthIndex == date.month-1){
                curMonthsDays -= date.dayOfMonth;
            }
            days -= curMonthsDays;

            monthIndex++;
        }
        splitedDateToReturn.month = monthIndex+1;
        // if (days > DateModel.nepaliDateData[yearIndex][monthIndex]) {            
        //     curMonthsDays = DateModel.nepaliDateData[yearIndex][monthIndex];
        //     if (yearIndex == date.year % 2000 && monthIndex == date.month - 1) {
        //         curMonthsDays -= date.dayOfMonth;
        //     }
        //     splitedDateToReturn.month += 1;
        //     days -= curMonthsDays;
        // }
        if(days == initialDays){
            days += date.dayOfMonth;
        }
        splitedDateToReturn.dayOfMonth = days;
        return splitedDateToReturn
    }

    public static subDaysBs(date: splitedDate, days: number):splitedDate{
        let totalDays = this.countTotalNepaliDays(date) - days;
        return this.addDaysBs({
            year: 2000,
            month: 1,
            dayOfMonth: 0
        }, totalDays)
    }
}
