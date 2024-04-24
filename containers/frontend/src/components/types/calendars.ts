import { MonthCalendar } from "../Calendars"

interface InputMouseEvents {
    onClick?: (event: React.MouseEvent<HTMLElement>) => void
    onChange?: (event: React.ChangeEvent<HTMLElement>) => void
    onkeypress?: (event: React.KeyboardEvent<HTMLElement>) => void
    onBlur?: (event: React.FocusEvent<HTMLElement>) => void
    onFocus?: (event: React.FocusEvent<HTMLElement>) => void
    onSubmit?: (event: React.FormEvent<HTMLElement>) => void
}
interface CommonMouseEvent {
    onClick?: (event: React.MouseEvent<HTMLElement>) => void
    onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void
    onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void
    onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void
    onMouseUp?: (event: React.MouseEvent<HTMLElement>) => void
    onMouseOut?: (event: React.MouseEvent<HTMLElement>) => void
    onMouseOver?: (event: React.MouseEvent<HTMLElement>) => void
    onMouseMove?: (event: React.MouseEvent<HTMLElement>) => void
}
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
export interface CalendarEvent {
    startDate: Date;
    endDate: Date;
    title: string;
    color?: string;
    order?: number;
    length?: number;
    minuteLength?: number;
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
    events?: CalendarEvent[];
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