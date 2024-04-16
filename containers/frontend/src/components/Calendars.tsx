'use client';

import './styles/calendar.scss';
import type { MonthCalendarProps, DayStrings, CalendarEvent } from './types/calendars';

const defaultDayStrings: DayStrings = {
    '0': {default: 'sun'},
    '1': {default: 'mon'},
    '2': {default: 'tue'},
    '3': {default: 'wed'},
    '4': {default: 'thu'},
    '5': {default: 'fri'},
    '6': {default: 'sat'},
}
let ds: DayStrings = JSON.parse(JSON.stringify(defaultDayStrings));

const initEnvent = (event: CalendarEvent[]) => {
    event.forEach((event) => event.priority = undefined);
    event.sort((a, b) => {
        let aLength = a.endDate.getTime() - a.startDate.getTime();
        let bLength = b.endDate.getTime() - b.startDate.getTime();
        return bLength - aLength;
    });
};
const addEvent = (processDate: Date, calendarEvents: CalendarEvent[]) => {
    let processDateStr = `${processDate.getFullYear()}${('0'+(processDate.getMonth()+1)).slice(-2)}${('0'+processDate.getDate()).slice(-2)}`;

    // 当日のイベントを取得
    let todayEvents = calendarEvents.filter(event => {
        let startDateStr = `${event.startDate.getFullYear()}${('0'+(event.startDate.getMonth()+1)).slice(-2)}${('0'+event.startDate.getDate()).slice(-2)}`;
        let endDateStr = `${event.endDate.getFullYear()}${('0'+(event.endDate.getMonth()+1)).slice(-2)}${('0'+event.endDate.getDate()).slice(-2)}`;
        return startDateStr <= processDateStr && processDateStr <= endDateStr;
    })
    if (todayEvents.length == 0) { return; }

    // 表示順を設定
    // すでに使われている表示順（行）を取得
    let usedPriority:number[] = [];
    todayEvents.forEach((event) => {
        if (event.priority != undefined) {
            usedPriority.push(event.priority);
        }
    });
    // 表示順が未定義のとき、未使用の表示順を設定
    todayEvents.forEach((event) => {
        if (event.priority != undefined) {
            return;
        } else {
            let i = 0;
            while (usedPriority.includes(i)) { i++; }
            event.priority = i;
            usedPriority.push(i);
        }
    });
    // ソート
    todayEvents.sort((a, b) => (a.priority || 0)  - (b.priority || 0));

    // エレメントを生成して返却
    return todayEvents.map((event, i) => {
        return <div
            className='calendar-event'
            key={i}
            style={{background: event.color}}
        >
            {event.title}
        </div>
    });
}
const genDayCell = (processDate: Date, dspDate: Date, event: CalendarEvent[], showOtherMonthDate: boolean, isOverlay?: boolean) => {
    // 日付セルを生成
    let dayCell = <div
        className={`calendar-cell ${ds[processDate.getDay()].default}`}
        key={processDate.getMonth().toString()+processDate.getDate().toString()}
    >{
            // オーバーレイのときイベントを追加
            isOverlay? addEvent(processDate, event): processDate.getDate()
    }</div>; 
    if (processDate.getMonth() != dspDate.getMonth()) {
        dayCell = <div
            className={`calendar-cell calendar-day-other-month ${ds[processDate.getDay()].default}`}
            key={processDate.getMonth().toString()+processDate.getDate().toString()}
        >{
            // オーバーレイのときイベントを追加
            isOverlay? addEvent(processDate, event):
            // 他月の日付を表示するかどうか
            showOtherMonthDate? processDate.getDate():
            ''
        }</div>;
    }
    return dayCell;
}

export const MonthCalendar = ({
    date = new Date,
    dayStrings,
    showHeader = true,
    showOtherMonthDate = true,
    width,
    height,
    style,
    event=[],
}: MonthCalendarProps) => {
    console.log('Render MonthCalendar()');
    initEnvent(event);
    // 曜日文字列を生成、dayStringsがあればlocal文字列を設定
    if (dayStrings) {
        Object.keys(ds).forEach(num => ds[num].local = dayStrings[num]);
    }
    const CalendarUnderlay = () => {
        console.log('Render CalendarUnderlay()');

        let processDate = new Date(date.getFullYear(), date.getMonth(), 1);
        let nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        let row = [];

        // 直前の日曜日を取得
        while (processDate.getDay() != 0) {
            processDate.setDate(processDate.getDate() - 1);
        }
        // 直前の日曜日から当月末までループ
        while (processDate.getMonth() != nextMonth.getMonth()) {
            row.push(genDayCell(processDate, date, [], showOtherMonthDate, false));
            processDate.setDate(processDate.getDate() + 1);
        }
        // 当月末から次の日曜日までループ
        while (processDate.getDay() != 0) {
            row.push(genDayCell(processDate, date, [], showOtherMonthDate, false));
            processDate.setDate(processDate.getDate() + 1);
        }
    
        // CalendarUnderlayを返却
        return(<div className='calendar-underlay'>
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
                {row}
            </div>
        </div>);
    }
    const CalendarOverlay = () => {
        console.log('Render CalendarOverlay()');
        let processDate = new Date(date.getFullYear(), date.getMonth(), 1);
        let nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        let row = [];

        // 直前の日曜日を取得
        while (processDate.getDay() != 0) {
            processDate.setDate(processDate.getDate() - 1);
        }
        // 直前の日曜日から当月末までループ
        while (processDate.getMonth() != nextMonth.getMonth()) {
            row.push(genDayCell(processDate, date, event, showOtherMonthDate, true));
            processDate.setDate(processDate.getDate() + 1);
        }
        // 当月末から次の日曜日までループ
        while (processDate.getDay() != 0) {
            row.push(genDayCell(processDate, date, event, showOtherMonthDate, true));
            processDate.setDate(processDate.getDate() + 1);
        }

        // CalendarOverlayを返却
        return <div className='calendar-overlay'>
            {showHeader && 
                <div className='calendar-header'>
                    {
                        // ヘッダーを生成
                        Object.keys(ds).map(num => {
                        return <div className={`calendar-cell ${ds[num].default}`} key={'h'+num}></div>
                        })
                    }
                </div>
            }
            <div className='calendar-body'>
                {row}
            </div>
        </div>;
    }

    return <div
        className='calendar-wrapper'
        style={
            {...style , ...{width: width, height: height}}
        }
    >
        <CalendarUnderlay />
        <CalendarOverlay />
    </div>;
}