import { useState } from 'react';

import { Menu, MenuItem } from '@mui/material';

import './styles/calendar.scss';
import { DayCell, TimeCell } from './Cell';
import { Events } from './Event';
import { BaseInnerComponent, Datalog } from './types/WorkTile';
import type { MonthCalendarProps, WeekCalendarProps, DayStrings } from './types/calendars';

class CommonCalendar extends BaseInnerComponent {
    constructor() {
        super();
    }

    dyaStrings: DayStrings = {
        '0': {default: 'sun'},
        '1': {default: 'mon'},
        '2': {default: 'tue'},
        '3': {default: 'wed'},
        '4': {default: 'thu'},
        '5': {default: 'fri'},
        '6': {default: 'sat'},
    };
    timescaleParam = {
        30 : {cells: 48,  minutePerCell: 30},
        15 : {cells: 96,  minutePerCell: 15},
        10 : {cells: 144, minutePerCell: 10},
        5 : {cells: 288, minutePerCell: 5},
    };
    initEnvent = (event: Datalog[]) => {
        event.forEach((event) => {
            event.order = undefined;
            event.startDate = new Date(event.startDate);
            event.endDate = new Date(event.endDate);
            // 経過日数を取得
            let dayLength = Math.ceil((event.endDate.getTime() - event.startDate.getTime()) / (1000*60*60*24));
            // 経過日数+1日を設定（当日分）、経過0日の場合1日とみなす
            event.length = dayLength? dayLength + 1: 1;
            // 経過分数を取得
            let elapsedMinutes = Math.ceil((event.endDate.getTime() - event.startDate.getTime()) / (1000*60));
            event.minuteLength = elapsedMinutes;
        });
    };
    addMonthEvent = (processDate: Date, todayEvents: Datalog[]) => {
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
            if (event?.order == undefined) { break; }
    
            if (event.order < 4
            && (processDate.getDate() == event.startDate.getDate()
            ||  processDate.getDay() == 0)) {
                // イベントがある、かつ当日または日曜日のときイベントを生成
    
                // 当日から数えて今週の残り日数を取得
                let rhightLength = 7 - processDate.getDay();
                // 当日から数えてイベントの残り日数を取得
                let dspLength = Math.ceil((event.endDate.getTime() - processDate.getTime()) / (1000*60*60*24)) + 1;
                eventElements.push(<Events
                    key={i}
                    title={`${event.title}`}
                    color = {event.color}
                    width = {`calc(${(100 * (dspLength <= rhightLength? dspLength: rhightLength))}% - 6px)`}
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
    addWeekEvent = (startTime: Date, endTime: Date, timeEvents: Datalog[], timescale: number) => {
        let eventElements = timeEvents.map((event, i) => {
            if (startTime <= event.startDate && event.startDate <= endTime) {
                return <Events
                    key={i}
                    title={event.title}
                    color = {event.color}
                    onClick={() => {console.log(
                        event?.title,
                        `${('0'+event.startDate.getHours()).slice(-2)}:${('0'+event.startDate.getMinutes()).slice(-2)}:${('0'+event.startDate.getSeconds()).slice(-2)}`,
                        `${('0'+event.endDate.getHours()).slice(-2)}:${('0'+event.endDate.getMinutes()).slice(-2)}:${('0'+event.endDate.getSeconds()).slice(-2)}`,
                    )}}
                    addClass={[`order-${i}`]}
                    height={`${Math.floor((event.minuteLength || 0) / timescale)*100}%`}
                />
            } else {
                return <Events
                    key={i}
                    addClass={['blank', `order-${i}`]}
                />
            }
        });
        return eventElements;
    }
}
export class MonthCalendar extends CommonCalendar {
    constructor() {
        super();
        this.Component = this.Component.bind(this);
        this.AdditionalHeader = this.AdditionalHeader.bind(this);
    };

    Component = ({
        date = new Date,
        dayStrings,
        showHeader = true,
        width,
        height,
        style,
        events = [],
    }: MonthCalendarProps) => {
        this.initEnvent(events);
        // 曜日文字列を生成、dayStringsがあればlocal文字列を設定
        if (dayStrings) {
            Object.keys(this.dyaStrings).forEach(num => this.dyaStrings[num].local = dayStrings[num]);
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
                    dayStrings={this.dyaStrings}
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
                            Object.keys(this.dyaStrings).map(num => {
                                return <div
                                    key={'h'+num}
                                    className={`calendar-day-cell ${this.dyaStrings[num].default}`}
                                >
                                    { this.dyaStrings[num].local || this.dyaStrings[num].default}
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
            let dayCells: JSX.Element[] = [];
            processDate = new Date(startDate)
            while (processDate < lastDate) {
                // 当日のイベントを取得
                let startDate = new Date(processDate.getFullYear(), processDate.getMonth(), processDate.getDate());
                let endDate = new Date(processDate.getFullYear(), processDate.getMonth(), processDate.getDate()+1);
                let todayEvents = events.filter(event => {
                    return startDate <= event.endDate && event.startDate < endDate
                        && event.startDate.getHours() + event.startDate.getMinutes() == 0
                        && event.endDate.getHours() + event.endDate.getMinutes() == 0
                });
    
                // DayCellをプッシュ
                let eventCells: JSX.Element[] = [];
                dayCells.push(<DayCell
                    key={`${processDate.getMonth()}${processDate.getDate()}`}
                    date={new Date(processDate)}
                    dayStrings={this.dyaStrings}
                    isOtherMonth={processDate.getMonth() != thisMonth.getMonth()}
                    children={eventCells}
                />);
    
                // イベントをプッシュ
                eventCells.push(...this.addMonthEvent(processDate, todayEvents));
    
                processDate.setDate(processDate.getDate() + 1);
            }
    
            // CalendarOverlayを返却
            return <div className='calendar-overlay'>
                {showHeader && 
                    <div className='calendar-header'>
                        {
                            // ヘッダーを生成
                            Object.keys(this.dyaStrings).map(num => {
                            return <div className={`calendar-day-cell ${this.dyaStrings[num].default}`} key={'h'+num}></div>
                            })
                        }
                    </div>
                }
                <div className='calendar-body'>
                    {dayCells}
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
    };
    AdditionalHeader = () => {
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
        const openMenu = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
        };
        const closeMenu = () => {
            setAnchorEl(null);
        };

        return <>
            <div className='menu' onClick={openMenu}>
                addtional
            </div>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
            >
                <MenuItem key={'a0'}>
                    addtional1
                </MenuItem>
            </Menu>
        </>
    };
}
export class WeekCalendar extends CommonCalendar {
    constructor() {
        super();
        this.Component = this.Component.bind(this);
    };

    Component = ({
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
        this.initEnvent(events);
        // 曜日文字列を生成、dayStringsがあればlocal文字列を設定
        if (dayStrings) {
            Object.keys(this.dyaStrings).forEach(num => this.dyaStrings[num].local = dayStrings[num]);
        }
        const CalendarUnderlay = () => {
            let processDate = new Date(date);
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
                let timeCells: JSX.Element[] = [];
                row.push(<DayCell
                    key={`${processDate.getMonth()}${processDate.getDate()}`}
                    date={new Date(processDate)}
                    dayStrings={this.dyaStrings}
                    children={timeCells}
                />);
                timeCells.push(
                    ...[...Array(this.timescaleParam[timescale].cells)].map((_, i) => {
                        let time = new Date();
                        time.setHours(0, this.timescaleParam[timescale].minutePerCell * i);
                        return <TimeCell
                            key={`${processDate.getMonth()}${processDate.getDate()}${i}`}
                            addClass={time.getMinutes() == 0? ['separator']: []}
                        />
                    })
                )
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
                                    className={`calendar-day-cell ${this.dyaStrings[dayNum].default}`}
                                >
                                    { this.dyaStrings[dayNum].local || this.dyaStrings[dayNum].default}
                                </div>
                            })
                        }
                    </div>
                </>}
                <div className='calendar-body'>
                    <div className='calendar-sidebar' key={'sidebar'} >{
                        [...Array(this.timescaleParam[timescale].cells)].map((_, i) => {
                            let time = new Date();
                            time.setHours(0, this.timescaleParam[timescale].minutePerCell * i);
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
            let processDate = new Date(date);
            let dayCells = [];
    
            // 直前の日曜日を取得
            while (processDate.getDay() != 0) {
                processDate.setDate(processDate.getDate() - 1);
            }
            let startDate = new Date(processDate);
            let lastDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + days);
    
            // 日付セルを生成
            processDate = new Date(startDate)
            while (processDate < lastDate) {
                // 日付セルをプッシュ
                let timeCells: JSX.Element[] = [];
                dayCells.push(<DayCell
                    key={`${processDate.getMonth()}${processDate.getDate()}`}
                    date={new Date(processDate)}
                    dayStrings={this.dyaStrings}
                    children={timeCells}
                />);
    
                // 時間セルをプッシュ
                timeCells.push(
                    // タイムスケールのセル数をループ
                    ...[...Array(this.timescaleParam[timescale].cells)].map((_, i) => {
                        let time = new Date(processDate);
                        time.setHours(0, this.timescaleParam[timescale].minutePerCell * i);
    
                        // 時間セルを生成
                        let eventCells: JSX.Element[] = [];
                        let timeCell =  <TimeCell
                            key={i}
                            addClass={time.getMinutes() == 0? ['separator']: []}
                            children={eventCells}
                        />
                        // 現在時間のイベントを取得
                        let startTime = new Date(time);
                        startTime.setSeconds(0);
                        startTime.setMilliseconds(0);
                        let endTime = new Date(time);
                        endTime.setSeconds(0);
                        endTime.setMilliseconds(0);
                        endTime.setMinutes(endTime.getMinutes() + this.timescaleParam[timescale].minutePerCell);
                        let timeEvents = events.filter(event => {
                            return (startTime < event.endDate && event.startDate < endTime)
                                && event.startDate.toLocaleDateString() == time.toLocaleDateString()
                                && event.endDate.toLocaleDateString() == time.toLocaleDateString()
                        });
    
                        // イベントをプッシュ
                        eventCells.push(...this.addWeekEvent(startTime, endTime, timeEvents, timescale));
    
                        return timeCell;
                    })
                )
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
                                    className={`calendar-day-cell ${this.dyaStrings[dayNum].default}`}
                                >
                                </div>
                            })
                        }
                    </div>
                </>}
                <div className='calendar-body'>
                    <div className='calendar-sidebar' key={'sidebar'} >{
                        // サイドバーの時間セルを生成
                        [...Array(this.timescaleParam[timescale].cells)].map((_, i) => {
                            let time = new Date();
                            time.setHours(0, this.timescaleParam[timescale].minutePerCell * i);
                            return <TimeCell
                                key={`${processDate.getMonth()}${processDate.getDate()}${i}`}
                                addClass={time.getMinutes() == 0? ['separator']: []}
                            />
                        })
                    }</div>
    
                    {dayCells}
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
}
