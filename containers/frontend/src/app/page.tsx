'use client'

import * as React from 'react';
import { useState } from 'react';

import '@/styles/global.scss';

import axiosClient from '@/plugins/axiosClient';

const Dashboard = () => {
    const [data, setData] = useState({});

    const getHello = async () => {
        let res =  await axiosClient.get('/hello');
        if (res.status === 200) {
            setData(res.data);
        }
    }

    return (
        <div>
            <h1>react page</h1>
            <button onClick={getHello}>getHello</button>
            <button onClick={() => {setData({})}}>reset</button>
            <pre>{JSON.stringify(data, null, 4)}</pre>
        </div>
    );
}

export default Dashboard;