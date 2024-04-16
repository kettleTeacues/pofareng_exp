'use client';

import * as React from 'react';

import '@/styles/global.scss';

import { MonthCalendar } from '@/components/Calendars';
import type { CalendarEvent } from '@/components/types/calendars';

const Dashboard = () => {
    const [dispDate, setDispMonth] = React.useState(new Date());
    const [dsLocal, setDsLocal] = React.useState({'0': '日', '1': '月', '2': '火', '3': '水', '4': '木', '5': '金', '6': '土'});
    const [event, setEvent] = React.useState<CalendarEvent[]>([]);
    React.useEffect(() => {
        setEvent([
            {
                startDate: new Date(2024, 4, 1),
                endDate: new Date(2024, 4, 1),
                title: 'ev1',
            },
            {
                startDate: new Date(2024, 3, 5),
                endDate: new Date(2024, 3, 7),
                title: 'ev2',
            },
            {
                startDate: new Date(2024, 3, 26),
                endDate: new Date(2024, 3, 27),
                title: 'ev3',
                color: 'green',
            },
            {
                startDate: new Date(2024, 3, 20),
                endDate: new Date(2024, 3, 25),
                title: 'ev30',
                color: 'red',
            },
            {
                startDate: new Date(2024, 3, 27),
                endDate: new Date(2024, 4, 1),
                title: 'ev31',
                color: 'yellow',
            },
            {
                startDate: new Date(2024, 3, 15),
                endDate: new Date(2024, 3, 15),
                title: 'ev4',
            },
            {
                startDate: new Date(2024, 3, 24),
                endDate: new Date(2024, 3, 26),
                title: 'ev5',
                color: 'blue',
            },
        ]);
    }, []);

    let dateStringJa =  {'0': '日', '1': '月', '2': '火', '3': '水', '4': '木', '5': '金', '6': '土'};
    let dateStringHIra =  {'0': 'にち', '1': 'げつ', '2': 'か', '3': 'すい', '4': 'もく', '5': 'きん', '6': 'ど'};

    const addEvent = () => {
        setEvent([...event, {
            startDate: new Date(2024, dispDate.getMonth(), 20),
            endDate: new Date(2024, dispDate.getMonth(), 20),
            title: 'ev6',
        }])
    }

    return <>
        <button onClick={() => setDispMonth(new Date(dispDate.setMonth(dispDate.getMonth() - 1)))}>prevMonth</button>
        <button onClick={() => setDispMonth(new Date())}>current</button>
        <button onClick={() => setDispMonth(new Date(dispDate.setMonth(dispDate.getMonth() + 1)))}>nextMonth</button>
        <br />
        <button onClick={() => setDsLocal(dateStringJa)}>日本語</button>
        <button onClick={() => setDsLocal(dateStringHIra)}>ひらがな</button>
        <br />
        <button onClick={addEvent}>add event</button>
        <div>{`${dispDate.getFullYear()}年${dispDate.getMonth()+1}月`}</div>
        <MonthCalendar
            date={dispDate}
            event={event}
            dayStrings={dsLocal}
            showHeader={true}
            showOtherMonthDate={true}
            width={700}
            height={700}
            // style={{margin: 10, width:400}}
        />
    </>;
}

export default Dashboard;