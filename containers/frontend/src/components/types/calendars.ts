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
export type MonthCalendarProps = {
    date?: Date;
    dayStrings?: DayStringsProp;
    showHeader?: boolean;
    showOtherMonthDate?: boolean;
    width?: number | string;
    height?: number | string;
    style?: React.CSSProperties;
}