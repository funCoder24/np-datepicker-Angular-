import { NpDate } from '../Controllers/np-date';

export interface DMType {
    id: number;
    name: string;
    abbr: string;
}

export interface DMTypeNp {
    id : number;
    name : string;
    shortName : string;
    abbr : string;
}
export interface DayType {
    day: number;
    weekDay: DMType;
}

export interface splitedDate {
    year: number,
    month: number,
    dayOfMonth: number,
}
export interface DateParams {
    date: string | splitedDate,
    pickerLanguage?: string,
    dateFormat?: string,
    todayButton?: boolean;
    placeHolderText?: string;
    className?: object;
    calanderClassName?: object;
    dayClassName?: object;
    minDate?: object;
    maxDate?: object;
    excludeDate?: number[];
    highlightDates?: { [Key: string]: NpDate[] }[];//[{'green':['']}];
}