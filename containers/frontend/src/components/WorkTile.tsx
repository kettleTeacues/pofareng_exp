import { useEffect, useState } from 'react';
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

export const Worktile = () => {
    const [Test, setTest] = useState<React.ComponentType<MonthCalendarProps> | null>(null);

    const loadComponent = async (colSta: number, colEnd: number, rowSta: number, rowEnd: number) => {
        const comp = await import('@/components/Calendars');
        setTest(() => comp.MonthCalendar);
    };

    useEffect(() => {
        loadComponent(1, 2, 1, 2);
    }, []);

    return <div className='worktile-wrapper'>
        <div className='tile-cell' style={{
            gridColumnStart: 1,
            gridColumnEnd: 'span 2',
            gridRowStart: 1,
            gridRowEnd: 'span 2',
        }}>{Test &&
            <Test
                date={dispDate}
            />
        }</div>
        <div className='tile-cell'>cell</div>
        <div className='tile-cell'>cell</div>
        <div className='tile-cell'>cell</div>
        <div className='tile-cell'>cell</div>
        <div className='tile-cell'>cell</div>
    </div>
}