'use client';

import * as React from 'react';
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

import WorkTile from '@/components/WorkTile';

import type { MonthCalendarProps, WeekCalendarProps, DayStrings, CalendarEvent } from '@/components/types/calendars';
import { TileProps } from '@/components/types/WorkTile';
const dispDate = new Date();
const current = new Date();
const event: CalendarEvent[] = [];
const wt = new WorkTile({
    name: 'my work tile',
});
const genDummyDayEvents = () => {
    return [...Array(10)].map((_, i) => {
        let startDate = new Date(dispDate.getFullYear(), dispDate.getMonth(), Math.floor(Math.random()*30));
        let addDays = Math.floor(Math.random()*10);
        let color: number[] = [];
        while (color.length != 3) {
            let num = Math.floor(Math.random()*100);
            if (num < 55) {color.push(200 + num)}
        }
        addDays = addDays > 6 ? 2 :
                    addDays > 3 ? 1 : 0;
        let endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + addDays);
        return {
            startDate: startDate,
            endDate: endDate,
            title: `event ${i}`,
            color: `rgb(${color.join(',')})`
        }
    })
}
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
const tileParams: TileProps[] = [
    { id: 'MCal10', title: 'Month Calendar10', module: 'Calendars',   component: 'MonthCalendar',         colSta: 1, colLength: 2, rowSta: 1, rowLength: 2, datasets: [{dataSource: 'local', id: 'monthDataset10', records: genDummyDayEvents()}, {dataSource: 'local', id: 'weekDataset10', records: genDummyWeekEvents()}], },
    { id: 't-info', title: 'tile-info',        module: 'DataManager', component: 'TileInformation',     colSta: 1, colLength: 2, rowSta: 3, rowLength: 2, datasets: []},
    { id: 'dtable', title: 'data-table',       module: 'DataManager', component: 'DataTable',           colSta: 1, colLength: 2, rowSta: 3, rowLength: 2, datasets: []},
    { id: 'WCal10', title: 'Week Calendar10',  module: 'Calendars',   component: 'WeekCalendar',        colSta: 3, colLength: 2, rowSta: 1, rowLength: 2, datasets: [{dataSource: 'other-tile', refTileId: 'MCal10', refDatasetId: 'weekDataset10', records: []}], },
    { id: 'WCal20', title: 'Week Calendar20',  module: 'Calendars',   component: 'WeekCalendar',        colSta: 3, colLength: 2, rowSta: 3, rowLength: 2, datasets: [{dataSource: 'other-tile', refTileId: 'MCal10', refDatasetId: 'weekDataset10', records: []}], },
    { id: 'WCal30', title: 'Week Calendar30',  module: 'Calendars',   component: 'WeekCalendar',        colSta: 3, colLength: 2, rowSta: 5, rowLength: 2, datasets: [{dataSource: 'other-tile', refTileId: 'MCal10', refDatasetId: 'weekDataset10', records: []}], },
    { id: 'MCal20', title: 'Month Calendar20', module: 'Calendars',   component: 'MonthCalendar',       colSta: 5, colLength: 2, rowSta: 1, rowLength: 2, datasets: [{dataSource: 'other-tile', refTileId: 'MCal10', refDatasetId: 'monthDataset10', records: []}], },
    { id: 'wtinfo', title: 'worktile-info',    module: 'DataManager', component: 'WorktileInformation', colSta: 5, colLength: 2, rowSta: 3, rowLength: 4, datasets: []},
];
console.log(JSON.parse(JSON.stringify(tileParams[0].datasets)));
wt.addTile(tileParams);

export default function ButtonAppBar() {
    const [open, setOpen] = React.useState(false);

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
                        <span onClick={() => console.log(wt)}>{ wt.name }</span>
                    </Typography>
                    <IconButton color="inherit" onClick={() => wt.setOpenLauncher(true)}>
                        <Add />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
        <Drawer open={open} onClose={() => setOpen(!open)}>
            {DrawerList}
        </Drawer>

        <wt.worktile />
    </>;
}
