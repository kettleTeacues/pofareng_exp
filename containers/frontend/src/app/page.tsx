'use client';

import * as React from 'react';

import '@/styles/global.scss';

import { MonthCalendar, WeekCalendar } from '@/components/Calendars';
import type { CalendarEvent } from '@/components/types/calendars';

const Dashboard = () => {
    const [dispDate, setDispMonth] = React.useState(new Date());
    const [dspDays, setDspDays] = React.useState(7);
    const [dsLocal, setDsLocal] = React.useState({'0': '日', '1': '月', '2': '火', '3': '水', '4': '木', '5': '金', '6': '土'});
    const [timescale, setTimescale] = React.useState<30 | 15 | 10 | 5>(30);
    const [event, setEvent] = React.useState<CalendarEvent[]>([]);
    let current = new Date();
    current.setHours(0,0,0,0)

    // あとで書く
    let dateStringJa =  {'0': '日', '1': '月', '2': '火', '3': '水', '4': '木', '5': '金', '6': '土'};
    let dateStringHIra =  {'0': 'にち', '1': 'げつ', '2': 'か', '3': 'すい', '4': 'もく', '5': 'きん', '6': 'ど'};

    const addEvent = () => {
        let startDate = new Date(dispDate.getFullYear(), dispDate.getMonth(), Math.floor(Math.random()*30));
        let addDays = Math.floor(Math.random()*10);
        let endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + addDays);
        setEvent([...event, {
            startDate: startDate,
            endDate: endDate,
            title: `event${event.length+1}`,
        }])
    };
    const genDummyEvents = () => {
        setEvent([
            ...[...Array(30)].map((_, i) => {
                let addTime = Math.floor(Math.random()*10000000);
                let addDays = Math.floor(Math.random()*10);
                addDays = addDays > 6 ? 2 :
                          addDays > 3 ? 1 : 0;
                if (i % 2 == 0) { addDays *= -1 }
                let startTime = new Date(current.getTime() + addTime);
                startTime.setDate(startTime.getDate() + addDays);
                let endTime = new Date(current.getTime() + addTime);
                endTime.setDate(endTime.getDate() + addDays);
                return {
                    startDate: startTime,
                    endDate: endTime,
                    title: `time ${i}`,
                }
            }),
            ...[...Array(10)].map((_, i) => {
                let startDate = new Date(dispDate.getFullYear(), dispDate.getMonth(), Math.floor(Math.random()*30));
                let addDays = Math.floor(Math.random()*10);
                addDays = addDays > 6 ? 2 :
                          addDays > 3 ? 1 : 0;
                let endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + addDays);
                return {
                    startDate: startDate,
                    endDate: endDate,
                    title: `event1${i}`,
                }
            }),
        ]);

    }
    React.useEffect(genDummyEvents, []);

    return <>
        <div className='console' style={{marginLeft: 10, marginTop:10}}>
            <button onClick={() => setDsLocal(dateStringJa)}>日本語</button>
            <button onClick={() => setDsLocal(dateStringHIra)}>ひらがな</button><br />
            <button onClick={addEvent}>add event</button>
            <button onClick={genDummyEvents}>shuffle event</button><br />
            <div>{`${dispDate.getFullYear()}-${dispDate.getMonth()+1}-${dispDate.getDate()}`}</div>
            <br />
            <input type="number" value={dspDays} onChange={(e) => setDspDays(Number(e.target.value))}/>
            <button onClick={() => setDspDays(7)}>default(7)</button><br />
            timescale:
            <select onChange={(e) => setTimescale(Number(e.target.value) as 30 | 15 | 10 | 5)}>
                <option value="30">30</option>
                <option value="15">15</option>
                <option value="10">10</option>
                <option value="5">5</option>
            </select>
            min
        </div>
        <WeekCalendar
            date={dispDate}
            events={event}
            dayStrings={dsLocal}
            showHeader={true}
            width={700}
            height={700}
            style={{margin: 10, width:400}}
            days={dspDays}
            timescale={timescale}
        />
        <div className='console' style={{marginLeft: 10, marginTop:10}}>
            <button onClick={addEvent}>add event</button>
            <button onClick={genDummyEvents}>shuffle event</button><br />
            <button onClick={() => setDispMonth(new Date(dispDate.setMonth(dispDate.getMonth() - 1)))}>prevMonth</button>
            <button onClick={() => setDispMonth(new Date())}>current</button>
            <button onClick={() => setDispMonth(new Date(dispDate.setMonth(dispDate.getMonth() + 1)))}>nextMonth</button><br />
        </div>
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