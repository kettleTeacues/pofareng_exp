'use client';

import { useState, useEffect } from 'react';
import '@/styles/global.scss';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Inbox, Mail, Menu, Add } from '@mui/icons-material';

import axiosClient from '@/plugins/axiosClient';
import WorkTile from '@/components/WorkTile';

import type { MonthCalendarProps, WeekCalendarProps, DayStrings, CalendarEvent } from '@/components/types/calendars';
import { TileProps } from '@/components/types/WorkTile';
const dispDate = new Date();
const current = new Date();
const event: CalendarEvent[] = [];
const genDummyWeekEvents = () => {
    return [...Array(30)].map((_, i) => {
        let addMinutes = Math.floor(Math.random()*50);
        let addDays = Math.floor(Math.random()*10);
        let color: number[] = [];
        while (color.length != 3) {
            let num = Math.floor(Math.random()*100);
            if (num < 55) {color.push(200 + num)}
        }
        addDays = addDays > 6 ? 2 :
                    addDays > 3 ? 1 : 0;
        if (i % 2 == 0) { addDays *= -1 }
        let startTime = new Date(current);
        startTime.setDate(startTime.getDate() + addDays);
        startTime.setHours(0, addMinutes*10);
        let endTime = new Date(startTime);
        endTime.setHours(startTime.getHours(), startTime.getMinutes() + addMinutes);
        return {
            startDate: startTime,
            endDate: endTime,
            title: `time ${i}`,
            color: `rgb(${color.join(',')})`
        }
    });
}
const addEvent = (setEvent: Function) => {
    let startDate = new Date(dispDate.getFullYear(), dispDate.getMonth(), Math.floor(Math.random()*30));
    let addDays = Math.floor(Math.random()*10);
    let endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + addDays);
    setEvent([...event, {
        startDate: startDate,
        endDate: endDate,
        title: `event${event.length+1}`,
    }]);
};

const getDashboard = async () => {
    const res = await axiosClient.get('/dashboard');
    console.log(res.data);
    return res.data;
}
const getRecords = async ({sta, end}: {sta?: string, end?: string}) => {
    let url = '/lifelog';
    const queryParam: string[] = [];
    if (sta) { queryParam.push(`sta=${sta}`) }
    if (end) { queryParam.push(`end=${end}`) }
    if (queryParam.length > 0) {
        url += `?${queryParam.join('&')}`;
    }
    const res = await axiosClient.get(url);
    console.log(res.data);
    return res.data;
}

const page = () => {
    const [open, setOpen] = useState(false);
    const [wt, setWt] = useState<WorkTile>();

    // useEffect
    useEffect(() => {
        getDashboard().then(async (res) => {
            const wt = new WorkTile({
                name: 'my work tile',
                tiles: res[0].json_data,
            });

            let weekDataset10 = wt.tiles[0].datasets?.find((ds) => ds.id === 'weekDataset10');
            if (weekDataset10 && weekDataset10.records) weekDataset10.records = genDummyWeekEvents();

            const monthData = await getRecords({});
            const monthDataRecords = monthData.map((data: any) => {
                return {
                    startDate: data.lifelog.start_datetime,
                    endDate: data.lifelog.end_datetime,
                    title: data.lifelog.event,
                    color: data.logColor?.color_code,
                }
            });
            let monthDataset10 = wt.tiles[0].datasets?.find((ds) => ds.id === 'monthDataset10');
            if (monthDataset10 && monthDataset10.records) monthDataset10.records = monthDataRecords;
            setWt(wt);
        });
    }, []);

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpen(!open)}>
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <Inbox /> : <Mail />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <Inbox /> : <Mail />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
    return <>
        <Box>
            <AppBar>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setOpen(!open)}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <span onClick={() => console.log(wt)}>{ wt?.name }</span>
                    </Typography>
                    <IconButton color="inherit" onClick={() => wt?.setOpenLauncher(true)}>
                        <Add />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
        <Drawer open={open} onClose={() => setOpen(!open)}>
            {DrawerList}
        </Drawer>

        {wt &&
            <wt.Worktile />
        }
    </>;
}
export default page;
