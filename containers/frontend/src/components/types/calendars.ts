import { CommonMouseEvent } from './common';
import { Datalog } from './WorkTile';

export type DayStrings = {
    [key: string]: {
        default: string;
        local?: string;
    }
}
interface DayStringsProps {
    '0': string;
    '1': string;
    '2': string;
    '3': string;
    '4': string;
    '5': string;
    '6': string;
    [key: string]: string;
}
export interface EventProps extends CommonMouseEvent {
    title?: string;
    color?: string;
    width?: number | string;
    height?: number | string;
    addClass?: string[];
    style?: React.CSSProperties;
}
interface CommonCalendarProps {
    date?: Date;
    events?: Datalog[];
    dayStrings?: DayStringsProps;
    showHeader?: boolean;
    width?: number | string;
    height?: number | string;
    style?: React.CSSProperties;
}
export interface MonthCalendarProps extends CommonCalendarProps {}
export interface WeekCalendarProps extends CommonCalendarProps {
    days?: number;
    timescale?: 30 | 15 | 10 | 5;
}

export interface DayProps {
    date: Date;
    dayStrings: DayStrings;
    isOtherMonth?: boolean;
    showOtherMonthDate?: boolean;
    children?: JSX.Element | JSX.Element[];
    style?: React.CSSProperties;
}
export interface TimeProps {
    isOtherMonth?: boolean;
    showOtherMonthDate?: boolean;
    children?: JSX.Element | JSX.Element[];
    style?: React.CSSProperties;
    addClass?: string[];
}
