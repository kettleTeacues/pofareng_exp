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

const addEvent = (processDate: Date, calendarEvents: CalendarEvent[]) => {
    let processDateStr = processDate.getFullYear().toString() + processDate.getMonth().toString() + processDate.getDate().toString();

    // 当日のイベントを取得
    let todayEvents = calendarEvents.filter(event => {
        let startDateStr = event.startDate.getFullYear().toString() + event.startDate.getMonth().toString() + event.startDate.getDate().toString();
        let endDateStr = event.endDate.getFullYear().toString() + event.endDate.getMonth().toString() + event.endDate.getDate().toString();
        return startDateStr <= processDateStr && processDateStr <= endDateStr;
    })

    // エレメントを生成して返却
    return todayEvents.map((event, index) => {
        return <div
            className='calendar-event'
            key={index}
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

    // 曜日文字列を生成、dayStringsがあればlocal文字列を設定
    if (dayStrings) {
        Object.keys(ds).forEach(num => ds[num].local = dayStrings[num]);
    }
    const CalendarUnderlay = () => {
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