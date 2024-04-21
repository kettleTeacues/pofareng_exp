'use client';

import * as React from 'react';

import '@/styles/global.scss';

import { MonthCalendar, WeekCalendar } from '@/components/Calendars';
import type { CalendarEvent } from '@/components/types/calendars';

const Dashboard = () => {
    const [dispDate, setDispMonth] = React.useState(new Date());
    const [dspDays, setDspDays] = React.useState(7);
    const [dsLocal, setDsLocal] = React.useState({'0': '日', '1': '月', '2': '火', '3': '水', '4': '木', '5': '金', '6': '土'});
    const [event, setEvent] = React.useState<CalendarEvent[]>([]);
    React.useEffect(() => {
        setEvent([
            {
                startDate: new Date(2024, 3, 7),
                endDate: new Date(2024, 3, 10),
                title: 'event1',
            },
            {
                startDate: new Date(2024, 3, 9),
                endDate: new Date(2024, 3, 9),
                title: 'event1a',
                color: 'orange',
            },
            {
                startDate: new Date(2024, 3, 10),
                endDate: new Date(2024, 3, 11),
                title: 'event1b',
                color: 'lightsalmon',
            },
            {
                startDate: new Date(2024, 4, 1),
                endDate: new Date(2024, 4, 3),
                title: 'event11',
            },
            {
                startDate: new Date(2024, 3, 25),
                endDate: new Date(2024, 3, 25),
                title: 'event20',
            },
            {
                startDate: new Date(2024, 3, 5),
                endDate: new Date(2024, 3, 7),
                title: 'event2',
            },
            {
                startDate: new Date(2024, 3, 26),
                endDate: new Date(2024, 3, 27),
                title: 'event3',
                color: '#CEF09D',
            },
            {
                startDate: new Date(2024, 3, 20),
                endDate: new Date(2024, 3, 25),
                title: 'event30',
                color: 'rgb(255, 128, 208)',
            },
            {
                startDate: new Date(2024, 3, 29),
                endDate: new Date(2024, 3, 29),
                title: 'event33',
                color: 'lightpink',
            },
            {
                startDate: new Date(2024, 3, 27),
                endDate: new Date(2024, 4, 1),
                title: 'event31',
                color: 'yellow',
            },
            {
                startDate: new Date(2024, 3, 15),
                endDate: new Date(2024, 3, 15),
                title: 'event4',
            },
            {
                startDate: new Date(2024, 3, 24),
                endDate: new Date(2024, 3, 26),
                title: 'event5',
                color: '#A1C7E0',
            },
            {
                startDate: new Date(2024, 4, 2),
                endDate: new Date(2024, 4, 2),
                title: 'event12',
                color: '#C7FFED',
            },
        ]);
    }, []);

    let dateStringJa =  {'0': '日', '1': '月', '2': '火', '3': '水', '4': '木', '5': '金', '6': '土'};
    let dateStringHIra =  {'0': 'にち', '1': 'げつ', '2': 'か', '3': 'すい', '4': 'もく', '5': 'きん', '6': 'ど'};

    const addEvent = () => {
        setEvent([...event, {
            startDate: new Date(2024, dispDate.getMonth(), 20),
            endDate: new Date(2024, dispDate.getMonth(), 20),
            title: 'event6',
        }])
    }

    return <>
        <button onClick={() => setDsLocal(dateStringJa)}>日本語</button>
        <button onClick={() => setDsLocal(dateStringHIra)}>ひらがな</button><br />
        <button onClick={addEvent}>add event</button><br />
        <br />
        <input type="number" value={dspDays} onChange={(e) => setDspDays(Number(e.target.value))}/>
        <button onClick={() => setDspDays(7)}>default(7)</button>
        <div>{`${dispDate.getFullYear()}年${dispDate.getMonth()+1}月`}</div>
        <WeekCalendar
            date={dispDate}
            events={event}
            dayStrings={dsLocal}
            showHeader={true}
            width={700}
            height={700}
            style={{margin: 10, width:400}}
            days={dspDays}
        />
        <button onClick={() => setDispMonth(new Date(dispDate.setMonth(dispDate.getMonth() - 1)))}>prevMonth</button>
        <button onClick={() => setDispMonth(new Date())}>current</button>
        <button onClick={() => setDispMonth(new Date(dispDate.setMonth(dispDate.getMonth() + 1)))}>nextMonth</button><br />
        <MonthCalendar
            date={dispDate}
            events={event}
            dayStrings={dsLocal}
            showHeader={true}
            width={700}
            height={700}
            style={{margin: 10, width:400}}
        />
    </>;
}

export default Dashboard;