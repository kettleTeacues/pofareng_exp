import { useEffect, useState, ComponentType, lazy } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { AddCircle } from '@mui/icons-material';

import '@/components/styles/worktile.scss';
import type { MonthCalendarProps, WeekCalendarProps, DayStrings, CalendarEvent } from './types/calendars';

const defaultTileNum = 6;
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
interface UsedTiles {
    colSta: number,
    colLength: number,
    rowSta: number,
    rowLength: number,
}
interface Components {
    component: ComponentType<any>,
    tiles: UsedTiles,
}

export const Worktile = () => {
    const [components, setComponents] = useState<Components[]>([]);
    const [maxTileNum, setMaxTileNum] = useState(defaultTileNum);
    const [emptyTileNum, setEmptyTileNum] = useState(defaultTileNum);

    const loadComponent = (moduleName: string, componentName: string) => {
        const component = lazy(
            () => import(`@/components/${moduleName}`)
            .then(module => ({ default: module[componentName] }))
        );
        return component
    };

    useEffect(() => {
        let usedTileNum = 0;
        components.forEach(comp => {
            usedTileNum += comp.tiles.colLength * comp.tiles.rowLength
        });
        setEmptyTileNum(maxTileNum - usedTileNum);
    }, [JSON.stringify(components)])

    useEffect(() => {
        let initParam = [
            {
                module: 'Calendars',
                component: 'MonthCalendar',
                tiles: {
                    colSta: 1,
                    colLength: 1,
                    rowSta: 1,
                    rowLength: 1,
                }
            },
            {
                module: 'Calendars',
                component: 'WeekCalendar',
                tiles: {
                    colSta: 3,
                    colLength: 1,
                    rowSta: 1,
                    rowLength: 2,
                }
            },

        ];
        let temp = initParam.map((param: any) => {
            let comp = loadComponent(param.module, param.component);
            return {
                component: comp,
                tiles: param.tiles
            }
        });
        setComponents(temp);
    }, []);

    return <div className='worktile-wrapper'>
        {
            components.map((comp, i) => {
                const Comp = comp;
                return <div
                    key={i}
                    className='tile-cell'
                    style={{
                        gridColumnStart: Comp.tiles.colSta,
                        gridColumnEnd: `span ${Comp.tiles.colLength}`,
                        gridRowStart: Comp.tiles.rowSta,
                        gridRowEnd: `span ${Comp.tiles.rowLength}`,
                    }}
                >
                    <Comp.component />
                </div>
            })
        }

        {emptyTileNum >= 0 &&
        [...Array(emptyTileNum)].map((_, i) => {
            return <div
                key={i}
                className='tile-cell empty'
            >
                <AddCircle
                    style={{
                    }}
                    onClick={
                        () => {
                            setComponents([
                                ...components,
                                {
                                    component: loadComponent('Calendars', 'MonthCalendar'),
                                    tiles: {
                                        colSta: 2,
                                        colLength: 1,
                                        rowSta: 1,
                                        rowLength: 1,
                                    }
                                }
                            ]);
                        }
                    }
                />
            </div>
        })}
    </div>
}