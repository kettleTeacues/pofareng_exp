import { useEffect, useState, ComponentType, lazy } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { AddCircle } from '@mui/icons-material';

import '@/components/styles/worktile.scss';
import type { MonthCalendarProps, WeekCalendarProps, DayStrings, CalendarEvent } from './types/calendars';

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
interface UsedTiles {
    colSta: number,
    colLength: number,
    rowSta: number,
    rowLength: number,
}
interface Components {
    component: ComponentType<any>,
    tiles: UsedTiles,
    props?: any,
}

const Tile = () => {
    
}

export const Worktile = () => {
    let current = new Date();
    const [components, setComponents] = useState<Components[]>([]);
    const [maxTileNum, setMaxTileNum] = useState(defaultTileNum);
    const [emptyTileNum, setEmptyTileNum] = useState(defaultTileNum);
    const [dispDate, setDispMonth] = useState(new Date());
    const [dspDays, setDspDays] = useState(7);
    const [dsLocal, setDsLocal] = useState({'0': '日', '1': '月', '2': '火', '3': '水', '4': '木', '5': '金', '6': '土'});
    const [timescale, setTimescale] = useState<30 | 15 | 10 | 5>(30);
    const [event, setEvent] = useState<CalendarEvent[]>([]);
    let dateString = current.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' }).replaceAll('/', '-');
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
                addDays = addDays > 6 ? 2 :
                          addDays > 3 ? 1 : 0;
                let endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + addDays);
                return {
                    startDate: startDate,
                    endDate: endDate,
                    title: `event ${i}`,
                }
            }),
        ]);
        console.log('end genDummyEvents()');
    }
    const loadComponent = (moduleName: string, componentName: string) => {
        const component = lazy(
            () => import(`@/components/${moduleName}`)
            .then(module => ({ default: module[componentName] }))
        );
        return component
    };

    useEffect(() => {
        let usedTileNum = 0;
        components.forEach(comp => {
            usedTileNum += comp.tiles.colLength * comp.tiles.rowLength
        });
        setEmptyTileNum(maxTileNum - usedTileNum);
    }, [JSON.stringify(components)])

    useEffect(() => {
        let initParam = [
            {
                module: 'Calendars',
                component: 'MonthCalendar',
                tiles: {
                    colSta: 1,
                    colLength: 1,
                    rowSta: 1,
                    rowLength: 1,
                },
                props: {
                    date: dispDate,
                    events: event,
                    dayStrings: dsLocal,
                    showHeader: true,
                }
            },
            {
                module: 'Calendars',
                component: 'WeekCalendar',
                tiles: {
                    colSta: 3,
                    colLength: 1,
                    rowSta: 1,
                    rowLength: 2,
                }
            },

        ];
        let temp = initParam.map((param: any) => {
            let comp = loadComponent(param.module, param.component);
            return {
                component: comp,
                tiles: param.tiles,
                props: param.props
            }
        });
        genDummyEvents();
        console.log('setComponents()');
        setComponents(temp);
        console.log(components);
    }, []);

    return <div className='worktile-wrapper'>
        {
            components.map((comp, i) => {
                const Comp = comp;
                console.log(comp)
                return <div
                    key={i}
                    className='tile-cell'
                    style={{
                        gridColumnStart: Comp.tiles.colSta,
                        gridColumnEnd: `span ${Comp.tiles.colLength}`,
                        gridRowStart: Comp.tiles.rowSta,
                        gridRowEnd: `span ${Comp.tiles.rowLength}`,
                    }}
                >
                    <Comp.component events={event} />
                </div>
            })
        }

        {emptyTileNum >= 0 &&
        [...Array(emptyTileNum)].map((_, i) => {
            return <div
                key={i}
                className='tile-cell empty'
            >
                <AddCircle
                    style={{
                    }}
                    onClick={
                        () => {
                            addEvent();
                            console.log(event)
                        }
                    }
                />
            </div>
        })}
    </div>
}