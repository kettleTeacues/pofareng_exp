import { useEffect, useState, ComponentType, lazy, CSSProperties } from 'react';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { AddCircle, Close, ExpandMore } from '@mui/icons-material';

import '@/components/styles/worktile.scss';
import type { MonthCalendarProps, WeekCalendarProps, DayStrings, CalendarEvent } from './types/calendars';
import type { TileProps, HeaderProps } from './types/WorkTile';

const defaultTileNum = 6;
const defaultDayStrings: DayStrings = {
    '0': {default: 'sun'},
    '1': {default: 'mon'},
    '2': {default: 'tue'},
    '3': {default: 'wed'},
    '4': {default: 'thu'},
    '5': {default: 'fri'},
    '6': {default: 'sat'},
}
const dispDate = new Date();
const event: CalendarEvent[] = [];

let current = new Date();
const loadComponent = (moduleName: string | undefined, componentName: string | undefined) => {
    if (!moduleName || !componentName) { return; }
    const component = lazy(
        () => import(`@/components/${moduleName}`)
        .then(module => ({ default: module[componentName] }))
    );
    return component
};
const genDummyEvents = (setEvent: Function) => {
    console.log('sta genDummyEvents()');
    setEvent([
        ...[...Array(30)].map((_, i) => {
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
        }),
        ...[...Array(10)].map((_, i) => {
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
        }),
    ]);
    console.log('end genDummyEvents()');
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

const TileHeader = (props: HeaderProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return <div className='tile-header'>
        <span>{props.title}</span>
        <div onClick={handleClick} style={{height: '20px'}}>
            <ExpandMore className='icon-btn' />
        </div>
        <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >
            <MenuItem key={1} onClick={handleClose}>
                item1
            </MenuItem>
            <MenuItem key={2} onClick={handleClose}>
                item2
            </MenuItem>
            <MenuItem key={3} onClick={handleClose}>
                item3
            </MenuItem>
        </Menu>
        <Close className='icon-btn' />
    </div>;
}
const Tile = (props: TileProps) => {
    // 初期化
    let defaultClass = ['tile-cell'];
    if (!props.module) { defaultClass.push('empty'); }
    const [className, setClassName] = useState(defaultClass);

    let defaultStyle: CSSProperties = {}
    if (props.colSta) { defaultStyle.gridColumnStart = props.colSta; }
    if (props.colLength) { defaultStyle.gridColumnEnd = `span ${props.colLength}`; }
    if (props.rowSta) { defaultStyle.gridRowStart = props.rowSta; }
    if (props.rowLength) { defaultStyle.gridRowEnd = `span ${props.rowLength}`; }
    const [style, setStyle] = useState(defaultStyle);

    const [Component, setComponents] = useState<ComponentType<any>>();
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        setComponents(loadComponent(props.module, props.component));
        if (!props.dataSource) {
            genDummyEvents(setEvents);
        }
    }, []);

    return <div
        className={className.join(' ')}
        style={style}
    >
        <TileHeader
            title={props.title || props.component}
        />
        {Component?
            <>
            <div className='tile-content'>
                    <Component events={events} />
                </div>
            </>:
            <AddCircle className='add-circle' />
        }
    </div>
}
export const Worktile = () => {
    let tileParams = [
        {
            module: 'Calendars',
            component: 'MonthCalendar',
            colSta: 1,
            colLength: 2,
            rowSta: 1,
            rowLength: 2,
        },
        {
            module: 'Calendars',
            component: 'WeekCalendar',
            colSta: 3,
            colLength: 1,
            rowSta: 1,
            rowLength: 2,
        },
    ];

    const [maxTileNum, setMaxTileNum] = useState(defaultTileNum);
    let usedTileNum = 0;
    tileParams.forEach(param => {
        usedTileNum += param.colLength * param.rowLength
    });
    const [emptyTileNum, setEmptyTileNum] = useState(defaultTileNum - usedTileNum);

    const calcEmptyTileNum = () => {
        let usedTileNum = 0;
        tileParams.forEach(param => {
            usedTileNum += param.colLength * param.rowLength
        });
        setEmptyTileNum(maxTileNum - usedTileNum);
    }

    useEffect(calcEmptyTileNum, [JSON.stringify(tileParams)]);

    return <div className='worktile-wrapper'>
        {
            tileParams.map((param, i) => {
                return <Tile
                    key={'c'+i}
                    {...param}
                />
            })
        }
        {
            [...Array(emptyTileNum)].map((_, i) => {
                return <Tile
                    key={'e'+i}
                />
            })
        }
    </div>
}