export type DayStrings = {
    [key: string]: {
        default: string;
        local?: string;
    }
}
interface DayStringsProp {
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
    priority?: number;
    length?: number;
}
export interface EventProps {
    title: string;
    color?: string;
    marginLeft: number | string;
    marginBottom: number | string;
    marginTop: number | string;
    width: number | string;
}
export interface MonthCalendarProps {
    date?: Date;
    events?: CalendarEvent[];
    dayStrings?: DayStringsProp;
    showHeader?: boolean;
    width?: number | string;
    height?: number | string;
    style?: React.CSSProperties;
}

export interface DayProps {
    date: Date;
    dayStrings: DayStrings;
    isOtherMonth?: boolean;
    showOtherMonthDate?: boolean;
    children?: JSX.Element | JSX.Element[];
}