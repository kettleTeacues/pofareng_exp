'use client'

import { useState } from 'react';

import '@/styles/calendar.scss';

export const MonthCalendar = () => {
    const [dispDate, setDispMonth] = useState(new Date());
    interface DayStrings {
        [key: number]: {
            [key: string]: string
        }
    }
    const dayStrings:DayStrings = {
        0: {en: 'sun', ja:'日', },
        1: {en: 'mon', ja:'月', },
        2: {en: 'tue', ja:'火', },
        3: {en: 'wed', ja:'水', },
        4: {en: 'thu', ja:'木', },
        5: {en: 'fri', ja:'金', },
        6: {en: 'sat', ja:'土', },
    }
    
    const CalendarUnderlay = () => {
        let rows = [];
        let row = [];
        let tempDate = new Date(dispDate.getFullYear(), dispDate.getMonth(), 1);
        let nextMonth = new Date(dispDate.getFullYear(), dispDate.getMonth() + 1, 1);

        // 直前の日曜日を取得
        while (tempDate.getDay() != 0) {
            tempDate.setDate(tempDate.getDate() - 1);
        }
        // 直前の日曜日から当月末までループ
        while (tempDate.getMonth() != nextMonth.getMonth()) {
            if (tempDate.getDay() == 0 && row.length > 0) {
                // 前週の行をプッシュ
                rows.push(<tr className='calendar-week-row' key={'w'+tempDate.getDate()}>{row}</tr>);
                // 今週の行を初期化
                row = [];
            }

            let day = <td className={`calendar-day ${dayStrings[tempDate.getDay()].en}`} key={'d'+tempDate.getDate()}>{tempDate.getDate()}</td>; 
            if (tempDate.getMonth() != dispDate.getMonth()) {
                day = <td className={`calendar-day calendar-day-other-month ${dayStrings[tempDate.getDay()].en}`} key={'d'+tempDate.getDate()}>{tempDate.getDate()}</td>;
            }
            row.push(day);
            tempDate.setDate(tempDate.getDate() + 1);
        }
        // 当月末から次の日曜日までループ
        while (tempDate.getDay() != 0) {
            let day = <td className={`calendar-day calendar-day-other-month ${dayStrings[tempDate.getDay()].en}`} key={'d'+tempDate.getDate()}>{tempDate.getDate()}</td>;
            row.push(day);
            tempDate.setDate(tempDate.getDate() + 1);
        }
        // 最後の行を追加
            rows.push(<tr className='calendar-week-row' key={'w'+tempDate.getDate()}>{row}</tr>);
    
        return (
            <table className='calendar-table'>
                <thead className='calendar-header'>
                    <tr>
                        <th className={ dayStrings[0].en }>{ dayStrings[0].ja }</th>
                        <th className={ dayStrings[1].en }>{ dayStrings[1].ja }</th>
                        <th className={ dayStrings[2].en }>{ dayStrings[2].ja }</th>
                        <th className={ dayStrings[3].en }>{ dayStrings[3].ja }</th>
                        <th className={ dayStrings[4].en }>{ dayStrings[4].ja }</th>
                        <th className={ dayStrings[5].en }>{ dayStrings[5].ja }</th>
                        <th className={ dayStrings[6].en }>{ dayStrings[6].ja }</th>
                    </tr>
                </thead>
                <tbody className='calendar-body'>
                    {rows}
                </tbody>
            </table>
        );
    }

    return (<>
        <div>
            <h1>Calender</h1>
            <button onClick={() => setDispMonth(new Date(dispDate.setMonth(dispDate.getMonth() - 1)))}>prevMonth</button>
            <button onClick={() => setDispMonth(new Date())}>current</button>
            <button onClick={() => setDispMonth(new Date(dispDate.setMonth(dispDate.getMonth() + 1)))}>nextMonth</button>
            <div>{`${dispDate.getFullYear()}年${dispDate.getMonth()+1}月`}</div>
            <CalendarUnderlay />
        </div>
    </>);
}