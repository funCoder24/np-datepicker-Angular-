import { DateModel } from '../Models/date-model';
import { splitedDate } from '../Models/types';
import { NpDate } from './np-date';

export class DateConverter {
    public static ADtoBS(date: Date): NpDate;
    public static ADtoBS(date: string): NpDate;
    public static ADtoBS(date: Date | string): NpDate {
        let enDate: Date;
        let npDate: NpDate;
        if (typeof (date) == "string") {
            enDate = new Date(date);
        } else {
            enDate = date;
        }
        let daysCount: number = this.countTotalEngDays(enDate);//gives no of days between 1943/04/14 and enDate
        npDate = this.getNepaliDateByDays(daysCount);
        return npDate
    }

    public static BStoAD(date: NpDate): Date;
    public static BStoAD(date: string): Date;
    public static BStoAD(date: NpDate | string): Date {
        let enDate: Date;
        let npDate: NpDate;
        if (typeof date == "string") {
            npDate = new NpDate(date);
        } else if (date instanceof NpDate) {
            npDate = date;
        }
        let daysCount: number = this.countTotalNepaliDays(npDate);
        enDate = this.addDaysAD(DateModel.initialDateEn, daysCount);
        return enDate;
    }

    static countTotalNepaliDays(date: NpDate): number;
    static countTotalNepaliDays(date: string): number;
    static countTotalNepaliDays(date: splitedDate): number;
    static countTotalNepaliDays(date: NpDate | string | splitedDate): number {
        let splitedDate: splitedDate;
        if (typeof date == "string") {
            let npDt = new NpDate(date);
            splitedDate = this.splitDate(npDt);
        } else if (date instanceof NpDate) {
            splitedDate = this.splitDate(date);
        } else {
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

    private static splitDate(date : NpDate) : splitedDate {
        let splDate: splitedDate = {
            year: parseInt(date.yearBs),
            month: date.monthBs.id,
            dayOfMonth: date.dayBs.day
        };
        return splDate;
    }

    static getNepaliDateByDays(days: number): NpDate {
        let daysCount: number = 0;
        let yearIndex: number = 0;
        let monthIndex: number = 0;
        let year: number;
        let month: number;
        let dayOfMonth: number;
        while (days > 365) {
            DateModel.nepaliDateData[yearIndex].forEach((month, i) => {
                days -= month;
            });
            yearIndex++;
        }
        year = yearIndex + 2000;
        let curMonthsDays = DateModel.nepaliDateData[yearIndex][monthIndex];
        while (days > curMonthsDays) {
            curMonthsDays = DateModel.nepaliDateData[yearIndex][monthIndex];
            days -= curMonthsDays;

            monthIndex++;
        }
        month = monthIndex + 1;
        if (days > DateModel.nepaliDateData[yearIndex][monthIndex]) {
            month += 1;
        }
        dayOfMonth = days;
        return new NpDate({
            date: {
                year: year,
                month: month,
                dayOfMonth: dayOfMonth
            }
        });
    }

    static addDaysAD(date: Date, days: number): Date {
        // date.setDate(date.getDate() + days - 1);
        date.setDate(date.getDate() + days);
        return date;
    }
}
