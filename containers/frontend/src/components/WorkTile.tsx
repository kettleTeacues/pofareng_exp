import { useEffect, useMemo, useState } from 'react';
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

export const Worktile = () => {
    const [Test, setTest] = useState<React.ComponentType<MonthCalendarProps> | null>(null);
    const [usedTiles, setUsedTiles] = useState<UsedTiles[]>([]);
    const [maxTileNum, setMaxTileNum] = useState(6);
    const emptyTileNum = useMemo(() => {
        let emptyTileNum = 0;
        usedTiles.forEach(rec => {
            emptyTileNum += rec.colLength * rec.rowLength;
        });
        return emptyTileNum;
    }, [usedTiles.length]);

    const loadComponent = async (colSta: number, colLength: number, rowSta: number, rowLength: number) => {
        const comp = await import('@/components/Calendars');
        setTest(() => comp.MonthCalendar);
        setUsedTiles([
            ...usedTiles,
            {
                colSta: colSta,
                colLength: rowLength,
                rowSta: rowSta,
                rowLength: rowLength,
            }
        ]);
    };

    useEffect(() => {
        loadComponent(1, 2, 1, 2);
    }, []);

    return <div className='worktile-wrapper'>
        {Test &&
            <div className='tile-cell' style={{
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
                gridRowStart: 1,
                gridRowEnd: 'span 2',
            }}>
                <Test
                    date={dispDate}
                />
            </div>
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