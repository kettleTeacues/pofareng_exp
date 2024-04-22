import './styles/calendar.scss';
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
const timescaleParams = {
    30 : {cells: 48,  ninutePerCell: 30},
    15 : {cells: 96,  ninutePerCell: 15},
    10 : {cells: 144, ninutePerCell: 10},
    5 : {cells: 288, ninutePerCell: 5},
}
let ds: DayStrings = JSON.parse(JSON.stringify(defaultDayStrings));

const initEnvent = (event: CalendarEvent[]) => {
    event.forEach((event) => {
        event.order = undefined;
        // 経過日数を取得
        let dayLength = Math.ceil((event.endDate.getTime() - event.startDate.getTime()) / (1000*60*60*24));
        // 経過日数+1日を設定（当日分）、経過0日の場合1日とみなす
        event.length = dayLength? dayLength + 1: 1;
    });
};
const addEvent = (processDate: Date, todayEvents: CalendarEvent[]) => {
    // 表示順を設定
    // すでに使われている表示順（行）を取得
    let usedOrder:number[] = [];
    todayEvents.forEach((event) => {
        if (event.order != undefined) {
            usedOrder.push(event.order);
        }
    });
    // 表示順が未定義のとき、未使用の表示順を設定
    todayEvents.forEach((event) => {
        if (event.order != undefined) {
            return;
        } else {
            let i = 0;
            while (usedOrder.includes(i)) { i++; }
            event.order = i;
            usedOrder.push(i);
        }
    });
    // 当日のイベントがないとき、ブランク用に-1を追加
    if (usedOrder.length == 0) { usedOrder.push(-1); }

    // イベントエレメントを生成
    let eventElements: JSX.Element[] = [];
    let i = 0;
    while (i <= Math.max(...usedOrder) + 1) {
        let event = todayEvents.find(event => event.order == i);

        if (event
        && (processDate.getDate() == event.startDate.getDate()
        ||  processDate.getDay() == 0)) {
            // イベントがある、かつ当日または日曜日のときイベントを生成

            // 当日から数えて今週の残り日数を取得
            let rhightLength = 7 - processDate.getDay();
            // 当日から数えてイベントの残り日数を取得
            let dspLength = Math.ceil((event.endDate.getTime() - processDate.getTime()) / (1000*60*60*24)) + 1;
            eventElements.push(<Events
                key={i}
                title={`${event.title} ${event.order}`}
                color = {event.color}
                width = {`${(100 * (dspLength <= rhightLength? dspLength: rhightLength)) - 6}%`}
                onClick={() => {console.log(event?.title)}}
                addClass={[`order-${i}`]}
            />);
        } else {
            // ブランクイベントを生成
            eventElements.push(<Events
                key={i}
                addClass={['blank', `order-${i}`]}
            />);
        }
        i++;
    };
    return eventElements;
}

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
                            return <div
                                key={'h'+num}
                                className={`calendar-day-cell ${ds[num].default}`}
                            >
                                { ds[num].local || ds[num].default}
                            </div>
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
                children={addEvent(processDate, todayEvents)}
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
                        return <div className={`calendar-day-cell ${ds[num].default}`} key={'h'+num}></div>
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
        className='calendar-wrapper calendar-month'
        style={
            {...style , ...{width: width, height: height}}
        }
    >
        <CalendarUnderlay />
        <CalendarOverlay />
    </div>;
}
export const WeekCalendar = ({
    date = new Date,
    dayStrings,
    showHeader = true,
    width,
    height,
    style,
    events = [],
    days = 7,
    timescale = 30,
}: WeekCalendarProps) => {
    initEnvent(events);
    // 曜日文字列を生成、dayStringsがあればlocal文字列を設定
    if (dayStrings) {
        Object.keys(ds).forEach(num => ds[num].local = dayStrings[num]);
    }
    const CalendarUnderlay = () => {
        let processDate = new Date(date.getFullYear(), date.getMonth(), 1);
        let row = [];

        // 直前の日曜日を取得
        while (processDate.getDay() != 0) {
            processDate.setDate(processDate.getDate() - 1);
        }
        let startDate = new Date(processDate);
        let lastDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + days);

        // 日付セルを生成
        processDate = new Date(startDate)
        while (processDate < lastDate) {
            row.push(<DayCell
                key={`${processDate.getMonth()}${processDate.getDate()}`}
                date={new Date(processDate)}
                dayStrings={ds}
                children={
                    [...Array(timescaleParams[timescale].cells)].map((_, i) => {
                        let time = new Date();
                        time.setHours(0, timescaleParams[timescale].ninutePerCell * i);
                        return <TimeCell
                            key={`${processDate.getMonth()}${processDate.getDate()}${i}`}
                            addClass={time.getMinutes() == 0? ['separator']: []}
                        />
                    })
                }
            />);
            processDate.setDate(processDate.getDate() + 1);
        }
    
        // CalendarUnderlayを返却
        return(<div className='calendar-underlay'>
            {showHeader && <>
                <div className='calendar-header'>
                <div className='calendar-sidebar' key={'sidebar'} />
                    {
                        // ヘッダーを生成
                        [...Array(days)].map((_, i) => {
                            let dayNum = i % 7;
                            return <div
                                key={i}
                                className={`calendar-day-cell ${ds[dayNum].default}`}
                            >
                                { ds[dayNum].local || ds[dayNum].default}
                            </div>
                        })
                    }
                </div>
            </>}
            <div className='calendar-body'>
                <div className='calendar-sidebar' key={'sidebar'} >{
                    [...Array(timescaleParams[timescale].cells)].map((_, i) => {
                        let time = new Date();
                        time.setHours(0, timescaleParams[timescale].ninutePerCell * i);
                        let timeStr = `${('0'+time.getHours()).slice(-2)}:${('0'+time.getMinutes()).slice(-2)}`;
                        return <TimeCell
                            key={`${processDate.getMonth()}${processDate.getDate()}${i}`}
                            children={<>{timeStr}</>}
                            addClass={time.getMinutes() == 0? ['separator']: []}
                        />
                    })
                }</div>
                {row}
            </div>
        </div>);
    }
    const CalendarOverlay = () => {
        let processDate = new Date(date.getFullYear(), date.getMonth(), 1);
        let row = [];

        // 直前の日曜日を取得
        while (processDate.getDay() != 0) {
            processDate.setDate(processDate.getDate() - 1);
        }
        let startDate = new Date(processDate);
        let lastDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + days);

        // 日付セルを生成
        processDate = new Date(startDate)
        while (processDate < lastDate) {
            row.push(<DayCell
                key={`${processDate.getMonth()}${processDate.getDate()}`}
                date={new Date(processDate)}
                dayStrings={ds}
                children={
                    [...Array(timescaleParams[timescale].cells)].map((_, i) => {
                        let time = new Date();
                        time.setHours(0, timescaleParams[timescale].ninutePerCell * i);
                        return <TimeCell
                            key={`${processDate.getMonth()}${processDate.getDate()}${i}`}
                            addClass={time.getMinutes() == 0? ['separator']: []}
                        />
                    })
                }
            />);
            processDate.setDate(processDate.getDate() + 1);
        }
    
        // CalendarOverlayを返却
        return(<div className='calendar-overlay'>
            {showHeader && <>
                <div className='calendar-header'>
                <div className='calendar-sidebar' key={'sidebar'} />
                    {
                        // ヘッダーを生成
                        [...Array(days)].map((_, i) => {
                            let dayNum = i % 7;
                            return <div
                                key={i}
                                className={`calendar-day-cell ${ds[dayNum].default}`}
                            >
                            </div>
                        })
                    }
                </div>
            </>}
            <div className='calendar-body'>
                <div className='calendar-sidebar' key={'sidebar'} >{
                    [...Array(timescaleParams[timescale].cells)].map((_, i) => {
                        let time = new Date();
                        time.setHours(0, timescaleParams[timescale].ninutePerCell * i);
                        return <TimeCell
                            key={`${processDate.getMonth()}${processDate.getDate()}${i}`}
                            addClass={time.getMinutes() == 0? ['separator']: []}
                        />
                    })
                }</div>
                {row}
            </div>
        </div>);
    }

    return <div
        className='calendar-wrapper calendar-week'
        style={
            {...style , ...{width: width, height: height}}
        }
    >
        <CalendarUnderlay />
        <CalendarOverlay />
    </div>;
}