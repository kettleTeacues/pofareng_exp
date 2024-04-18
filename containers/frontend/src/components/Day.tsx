'use client';

// import './styles/calendar.scss';
import type { DayProps } from './types/calendars';

export const DayCell = (props: DayProps) => {
    let className = `calendar-cell ${props.dayStrings[props.date.getDay()].default}`;
    if (props.isOtherMonth) {
        className += ' calendar-day-other-month';
    }
    return <div
        className={className}
    >
        {props.children}
    </div>;
}