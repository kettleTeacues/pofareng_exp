'use client'

import { useState, useEffect, Suspense } from 'react';

import '@/styles/global.scss';

import axiosClient from '@/plugins/axiosClient';

const Dashboard = () => {
    const [dispDate, setDispMonth] = useState(new Date());
    
    const genCalender = () => {
        let tempDate = new Date(dispDate.getFullYear(), dispDate.getMonth(), 1);

        let dates = [];
        while (tempDate.getMonth() == dispDate.getMonth()) {
            dates.push(new Date(tempDate));
            tempDate.setDate(tempDate.getDate() + 1);
        }

        let table: JSX.Element[] = [];
        dates.forEach((date, i) => {
            table.push(<div key={i}>{
                `${date.getFullYear()}-${('0'+(date.getMonth() + 1)).slice(-2)}-${('0'+date.getDate()).slice(-2)}`
            }</div>);
        });
        return table
    }

    return (
        <div>
            <h1>Calender</h1>
            <button onClick={() => setDispMonth(new Date(dispDate.setMonth(dispDate.getMonth() - 1)))}>prevMonth</button>
            <button onClick={() => setDispMonth(new Date())}>current</button>
            <button onClick={() => setDispMonth(new Date(dispDate.setMonth(dispDate.getMonth() + 1)))}>nextMonth</button>
            <div>{`${dispDate.getFullYear()}年${dispDate.getMonth()+1}月`}</div>
            <div>
                {genCalender()}
            </div>
        </div>
    );
}

export default Dashboard;