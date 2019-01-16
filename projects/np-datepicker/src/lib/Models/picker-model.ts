import { DateHelper } from '../Controllers/date-helper';
import { DateModel } from './date-model';
import { DMType } from './types';

export class PickerModel {
    private static _selectedMonthId: number;
    public static get selectedMonthId(): number {
        return this._selectedMonthId;
    }
    public static set selectedMonthId(v: number) {
        this._selectedMonthId = v;
        this.setMonthCallander();
    }

    private static _selectedMonth: DMType;
    public static get selectedMonth(): DMType {
        return DateModel.monthData.find(month => month.id == this.selectedMonthId);
    }
    public static set selectedMonth(v: DMType) {
        this._selectedMonth = v;
        this.selectedMonthId = v.id;
    }

    private static _selectedYear: string;
    public static get selectedYear(): string {
        return this._selectedYear;
    }
    public static set selectedYear(v: string) {
        this._selectedYear = v;
        this.setMonthCallander();
    }

    private static monthCalanderData: any[] = [];
    private static setMonthCallander() {
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

    public static get dayData(): any {
        if (this.monthCalanderData.length <= 0) {
            this.setMonthCallander();
        }
        return this.monthCalanderData;
    }
}
