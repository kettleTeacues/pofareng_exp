import type { DayProps, TimeProps } from './types/calendars';

export const DayCell = (props: DayProps) => {
    let className = `calendar-day-cell ${props.dayStrings[props.date.getDay()].default}`;
    if (props.isOtherMonth) {
        className += ' calendar-day-other-month';
    }
    return <div
        className={className}
        style={{...props.style}}
    >
        {props.children}
    </div>;
}

export const TimeCell = (props: TimeProps) => {
    let className = `calendar-time-cell ${props.addClass?.join(' ')}`;
    return <div
        className={className}
        style={{...props.style}}
    >
        {props.children}
    </div>;
}