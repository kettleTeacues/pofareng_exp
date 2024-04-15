'use client';

import * as React from 'react';

import '@/styles/global.scss';

import { MonthCalendar } from '@/components/Calendars';

const Dashboard = () => {
    const [dispDate, setDispMonth] = React.useState(new Date());
    const [dsLocal, setDsLocal] = React.useState({'0': '日', '1': '月', '2': '火', '3': '水', '4': '木', '5': '金', '6': '土'});

    let dateStringJa =  {'0': '日', '1': '月', '2': '火', '3': '水', '4': '木', '5': '金', '6': '土'};
    let dateStringHIra =  {'0': 'にち', '1': 'げつ', '2': 'か', '3': 'すい', '4': 'もく', '5': 'きん', '6': 'ど'};

    return <>
        <button onClick={() => setDispMonth(new Date(dispDate.setMonth(dispDate.getMonth() - 1)))}>prevMonth</button>
        <button onClick={() => setDispMonth(new Date())}>current</button>
        <button onClick={() => setDispMonth(new Date(dispDate.setMonth(dispDate.getMonth() + 1)))}>nextMonth</button>
        <br />
        <button onClick={() => setDsLocal(dateStringJa)}>日本語</button>
        <button onClick={() => setDsLocal(dateStringHIra)}>ひらがな</button>
        <div>{`${dispDate.getFullYear()}年${dispDate.getMonth()+1}月`}</div>
        <MonthCalendar
            date={dispDate}
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