'use client';

import { Height } from '@mui/icons-material';
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
    width = '100%',
    height = '100%',
}: MonthCalendarProps) => {
    let processDate = new Date(date.getFullYear(), date.getMonth(), 1);
    let nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    // 曜日文字列を生成、dayStringsがあればlocal文字列を設定
    let ds: DayStrings = JSON.parse(JSON.stringify(defaultDayStrings));
    if (dayStrings) {
        Object.keys(ds).forEach(num => ds[num].local = dayStrings[num]);
    }

    const genDayCell = (processDate: Date, today: Date) => {
        let dayCell = <td className={`calendar-day ${ds[processDate.getDay()].default}`} key={'d'+processDate.getDate()}>{processDate.getDate()}</td>; 
        if (processDate.getMonth() != today.getMonth()) {
            dayCell = <td className={`calendar-day calendar-day-other-month ${ds[processDate.getDay()].default}`} key={'d'+processDate.getDate()}>{
                showOtherMonthDate && processDate.getDate()
            }</td>;
        }
        return dayCell;
    }
    const CalendarUnderlay = () => {
        let rows = [];
        let row = [];

        // 直前の日曜日を取得
        while (processDate.getDay() != 0) {
            processDate.setDate(processDate.getDate() - 1);
        }
        // 直前の日曜日から当月末までループ
        while (processDate.getMonth() != nextMonth.getMonth()) {
            if (processDate.getDay() == 0 && row.length > 0) {
                // 前週の行をプッシュ
                rows.push(<tr className='calendar-week-row' key={'w'+processDate.getDate()}>{row}</tr>);
                // 今週の行を初期化
                row = [];
            }

            row.push(genDayCell(processDate, date));
            processDate.setDate(processDate.getDate() + 1);
        }
        // 当月末から次の日曜日までループ
        while (processDate.getDay() != 0) {
            row.push(genDayCell(processDate, date));
            processDate.setDate(processDate.getDate() + 1);
        }
        // 最後の行を追加
        rows.push(<tr className='calendar-week-row' key={'w'+processDate.getDate()}>{row}</tr>);
    
        return(
        <table
            className='calendar-table'
            style={{
                width: width,
                height: height
            }}
        >
            {showHeader && 
                <thead className='calendar-header'>
                    <tr>
                    {
                        // ヘッダーを生成
                        Object.keys(ds).map(num => {
                        return <th className={ ds[num].default } key={'h'+num}>{ ds[num].local || ds[num].default}</th>
                        })
                    }
                    </tr>
                </thead>
            }
            <tbody className='calendar-body'>
            {rows}
            </tbody>
        </table>);
    }

    return <CalendarUnderlay />;
}