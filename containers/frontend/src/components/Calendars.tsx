'use client';

import './styles/calendar.scss';
import type { MonthCalendarProps, DayStrings } from './types/calendars';

const defaultDayStrings: DayStrings = {
    '0': {default: 'sun'},
    '1': {default: 'mon'},
    '2': {default: 'tue'},
    '3': {default: 'wed'},
    '4': {default: 'thu'},
    '5': {default: 'fri'},
    '6': {default: 'sat'},
}

export const MonthCalendar = ({
    date = new Date,
    dayStrings,
    showHeader = true,
    showOtherMonthDate = true,
    width,
    height,
    style,
}: MonthCalendarProps) => {
    let processDate = new Date(date.getFullYear(), date.getMonth(), 1);
    let nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    // 曜日文字列を生成、dayStringsがあればlocal文字列を設定
    let ds: DayStrings = JSON.parse(JSON.stringify(defaultDayStrings));
    if (dayStrings) {
        Object.keys(ds).forEach(num => ds[num].local = dayStrings[num]);
    }

    const genDayCell = (processDate: Date, today: Date, dspStr?: boolean) => {
        let dayCell = <div
            className={`calendar-cell calendar-day ${ds[processDate.getDay()].default}`}
            key={processDate.getMonth().toString()+processDate.getDate().toString()}
        >{
                dspStr && processDate.getDate()
        }</div>; 
        if (processDate.getMonth() != today.getMonth()) {
            dayCell = <div
                className={`calendar-cell calendar-day calendar-day-other-month ${ds[processDate.getDay()].default}`}
                key={processDate.getMonth().toString()+processDate.getDate().toString()}
            >{
                dspStr && showOtherMonthDate && processDate.getDate()
            }</div>;
        }
        return dayCell;
    }
    const CalendarUnderlay = () => {
        let rows = [];
        // let row = [];

        // 直前の日曜日を取得
        while (processDate.getDay() != 0) {
            processDate.setDate(processDate.getDate() - 1);
        }
        // 直前の日曜日から当月末までループ
        while (processDate.getMonth() != nextMonth.getMonth()) {
            rows.push(genDayCell(processDate, date, true));
            processDate.setDate(processDate.getDate() + 1);
        }
        // 当月末から次の日曜日までループ
        while (processDate.getDay() != 0) {
            rows.push(genDayCell(processDate, date, true));
            processDate.setDate(processDate.getDate() + 1);
        }
    
        return(
        <div
            className='calendar-table'
            style={
                {...style , ...{width: width, height: height}}
            }
        >
            {showHeader && 
                <div className='calendar-header'>
                    {
                        // ヘッダーを生成
                        Object.keys(ds).map(num => {
                        return <div className={`calendar-cell ${ds[num].default}`} key={'h'+num}>{ ds[num].local || ds[num].default}</div>
                        })
                    }
                </div>
            }
            <div className='calendar-body'>
            {rows}
            </div>
        </div>);
    }

    return <>
        <CalendarUnderlay />
    </>;
}