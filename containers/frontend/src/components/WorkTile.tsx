import { useEffect, useMemo, useState, Suspense, lazy, ComponentType } from 'react';
import '@/components/styles/worktile.scss';
import { DayCell, TimeCell } from './Cell';
import { Events } from './Event';
import type { MonthCalendarProps, WeekCalendarProps, DayStrings, CalendarEvent } from './types/calendars';

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
    [key: string]: {
        component: ComponentType<any>,
        tiles: UsedTiles,
    }
}

export const Worktile = () => {
    const [components, setComponents] = useState<Components>({});
    const [maxTileNum, setMaxTileNum] = useState(6);
    const emptyTileNum = useMemo(() => {
        let emptyTileNum = 0;
        Object.keys(components).forEach(key => {
            emptyTileNum += components[key].tiles.colLength * components[key].tiles.rowLength
        });
        return emptyTileNum;
    }, [Object.keys(components).length]);

    const loadComponent = (str: string, colSta: number, colLength: number, rowSta: number, rowLength: number) => {
        const comp = lazy(() => import(`@/components/${str}`).then(module => ({ default: module.MonthCalendar })));
        setComponents({
            ...components,
            ...{
                [str]: {
                    component: comp,
                    tiles: {
                        colSta: colSta,
                        colLength: colLength,
                        rowSta: rowSta,
                        rowLength: rowLength,
                    }
                }
            }
        });
    };

    useEffect(() => {
        let str = 'Calendars';
        loadComponent(str, 1, 2, 1, 2);
    }, []);

    return <div className='worktile-wrapper'>
        {
            Object.keys(components).map((key, i) => {
                const Comp = components[key];
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
                    <Comp.component />
                </div>
            })
        }

        {maxTileNum - emptyTileNum >= 0 &&
        [...Array(maxTileNum - emptyTileNum)].map((_, i) => {
            return <div
                key={i}
                className='tile-cell'
            >
            </div>
        })}
    </div>
}