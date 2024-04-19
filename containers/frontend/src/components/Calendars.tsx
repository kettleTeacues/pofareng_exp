import './styles/calendar.scss';
import { DayCell } from './Day';
import { Events } from './Event';
import type { MonthCalendarProps, DayStrings, CalendarEvent } from './types/calendars';

const defaultDayStrings: DayStrings = {
    '0': {default: 'sun'},
    '1': {default: 'mon'},
    '2': {default: 'tue'},
    '3': {default: 'wed'},
    '4': {default: 'thu'},
    '5': {default: 'fri'},
    '6': {default: 'sat'},
}
let ds: DayStrings = JSON.parse(JSON.stringify(defaultDayStrings));

const initEnvent = (event: CalendarEvent[]) => {
    event.forEach((event) => {
        event.priority = undefined;
        // 経過日数を取得
        let dayLength = Math.ceil((event.endDate.getTime() - event.startDate.getTime()) / (1000*60*60*24));
        // 経過日数+1日を設定（当日分）、当日の場合1日
        event.length = dayLength? dayLength + 1: 1;
    });
    event.sort((a, b) => (b.length || 0) - (a.length || 0));
};

export const MonthCalendar = ({
    date = new Date,
    dayStrings,
    showHeader = true,
    width,
    height,
    style,
    events = [],
}: MonthCalendarProps) => {
    initEnvent(events);
    // 曜日文字列を生成、dayStringsがあればlocal文字列を設定
    if (dayStrings) {
        Object.keys(ds).forEach(num => ds[num].local = dayStrings[num]);
    }
    const CalendarUnderlay = () => {
        let processDate = new Date(date.getFullYear(), date.getMonth(), 1);
        let thisMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        let nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        let row = [];

        // 直前の日曜日を取得
        while (processDate.getDay() != 0) {
            processDate.setDate(processDate.getDate() - 1);
        }
        let startDate = new Date(processDate);
        // 直前の日曜日から当月末までループ
        while (processDate.getMonth() != nextMonth.getMonth()) {
            processDate.setDate(processDate.getDate() + 1);
        }
        // 当月末から次の日曜日までループ
        while (processDate.getDay() != 0) {
            processDate.setDate(processDate.getDate() + 1);
        }
        let lastDate = new Date(processDate);

        // 日付セルを生成
        processDate = new Date(startDate)
        while (processDate < lastDate) {
            row.push(<DayCell
                key={`${processDate.getMonth()}${processDate.getDate()}`}
                date={new Date(processDate)}
                dayStrings={ds}
                isOtherMonth={processDate.getMonth() != thisMonth.getMonth()}
                children={<>{processDate.getDate()}</>}
            />);
            processDate.setDate(processDate.getDate() + 1);
        }
    
        // CalendarUnderlayを返却
        return(<div className='calendar-underlay'>
            {showHeader && 
                <div className='calendar-header'>
                    {
                        // ヘッダーを生成
                        Object.keys(ds).map(num => {
                        return <div className={`calendar-cell ${ds[num].default}`} key={'h'+num}>{ ds[num].local || ds[num].default}</div>
                        })
                    }
                </div>
            }
            <div className='calendar-body'>
                {row}
            </div>
        </div>);
    }
    const CalendarOverlay = () => {
        let processDate = new Date(date.getFullYear(), date.getMonth(), 1);
        let thisMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        let nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        let row = [];

        // 直前の日曜日を取得
        while (processDate.getDay() != 0) {
            processDate.setDate(processDate.getDate() - 1);
        }
        let startDate = new Date(processDate);
        // 直前の日曜日から当月末までループ
        while (processDate.getMonth() != nextMonth.getMonth()) {
            processDate.setDate(processDate.getDate() + 1);
        }
        // 当月末から次の日曜日までループ
        while (processDate.getDay() != 0) {
            processDate.setDate(processDate.getDate() + 1);
        }
        let lastDate = new Date(processDate);

        // 日付セルを生成
        processDate = new Date(startDate)
        while (processDate < lastDate) {
            // 当日のイベントを取得
            let startDate = new Date(processDate.getFullYear(), processDate.getMonth(), processDate.getDate());
            let endDate = new Date(processDate.getFullYear(), processDate.getMonth(), processDate.getDate()+1);

            let todayEvents = events.filter(event => {
                return startDate <= event.endDate && event.startDate < endDate;
            });
            // イベントをプッシュ
            row.push(<DayCell
                key={`${processDate.getMonth()}${processDate.getDate()}`}
                date={new Date(processDate)}
                dayStrings={ds}
                isOtherMonth={processDate.getMonth() != thisMonth.getMonth()}
                children={todayEvents.length > 0 ?
                    <Events
                        date={new Date(processDate)}
                        events={todayEvents}
                    />: <></>
                }
            />);
            processDate.setDate(processDate.getDate() + 1);
        }

        // CalendarOverlayを返却
        return <div className='calendar-overlay'>
            {showHeader && 
                <div className='calendar-header'>
                    {
                        // ヘッダーを生成
                        Object.keys(ds).map(num => {
                        return <div className={`calendar-cell ${ds[num].default}`} key={'h'+num}></div>
                        })
                    }
                </div>
            }
            <div className='calendar-body'>
                {row}
            </div>
        </div>;
    }

    return <div
        className='calendar-wrapper'
        style={
            {...style , ...{width: width, height: height}}
        }
    >
        <CalendarUnderlay />
        <CalendarOverlay />
    </div>;
}