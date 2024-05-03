import { useEffect, useState, ComponentType, lazy, CSSProperties } from 'react';

import { Menu, MenuItem } from '@mui/material';
import { Dialog, DialogActions, DialogContent, Autocomplete, DialogTitle, TextField, Button, IconButton } from '@mui/material';
import { Drawer, Input } from '@mui/material';
import { AddCircle, Close, ExpandMore } from '@mui/icons-material';

import '@/components/styles/worktile.scss';
import type { TileProps, InnerTileProps, HeaderProps } from './types/WorkTile';
import type { CalendarEvent } from './types/calendars';

const defaultTileNum = 6;
export default class WorkTile {
    name: string;
    props: TileProps[];
    worktile: ({ props }: {
        props?: InnerTileProps[] | undefined;
    }) => JSX.Element;

    handler: {
        addTile: (props: TileProps) => InnerTileProps;
        removeTile: (id: string | number) => void;
    }
    
    constructor(args: {
        name?: string,
        props?: TileProps[],
    }) {
        // init
        this.name = args.name || 'WorkTile';
        this.props = [];
        this.worktile = () => Worktile({props: this.props as InnerTileProps[], handler: this.handler});
        
        // methods
        this.handler = {
            addTile: (param) => {
                if (param.id && this.props.some(prop => prop.id == param.id)) {
                    throw new Error('Duplicate ID');
                }
                if (!param.id) {
                    param.id = Math.random().toString(36).slice(-10);
                    while (this.props.some(prop => prop.id == param.id)) {
                        param.id = Math.random().toString(36).slice(-10);
                    }
                }
                this.props.push(param as InnerTileProps);
                return param as InnerTileProps;
            },
            removeTile: (id) => {
                this.props = this.props.filter(prop => prop.id !== id);
            }
        }

        // init props by args
        if (args.props) {
            args.props.forEach(param => {
                this.handler.addTile(param);
            });
        }
    }
    set testProps(props: TileProps[]) {
        this.props = props;
    }
}
const loadComponent = (moduleName: string | undefined, componentName: string | undefined) => {
    if (!moduleName || !componentName) { return; }
    const component = lazy(
        () => import(`@/components/${moduleName}`)
        .then(module => ({ default: module[componentName] }))
    );
    return component
};
const TileHeader = ({props, handler}: {props: HeaderProps, handler: any}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
    };
    const relaunchModule = () => {
        props.launchHandler(true);
        setAnchorEl(null);
    }
    const openDrawer = () => {
        setAnchorEl(null);
        props.drawerHandler(true);
    }
    const closeTile = () => {
        props.componentHandler(undefined);
        handler.removeTile(props.id);
    }
    
    return <div className='tile-header'>
        <span>{props.title}</span>
        <div className='icon' onClick={openMenu}>
            <ExpandMore className='icon-btn' />
        </div>
        <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeMenu}
        >
            <MenuItem key={1} onClick={relaunchModule}>
                Relaunch
            </MenuItem>
            <MenuItem key={2} onClick={openDrawer}>
                Open Drawer
            </MenuItem>
            <MenuItem key={3} onClick={closeMenu}>
                item3
            </MenuItem>
        </Menu>
        <div className='icon close-btn' onClick={closeTile}>
            <Close />
        </div>
    </div>;
}
const DrawerContent = ({props, events, setEvents}: {props: InnerTileProps, events: any, setEvents: any}) => {
    const isEvents = (json: any): json is TileProps[] => {
        return json.every((event: any) => {
            let bool = false;
            if (event.startDate && event.startDate != 'Invalid Date'
            && event.endDate && event.endDate != 'Invalid Date'
            && event.title) {
                bool = true;
            } else {
                console.log(event);
            }
            return bool;
        });
    }
    const updateEvent = (jsonStr: string) => {
        let json;
        try {
            let isValidate = true;
            json = JSON.parse(jsonStr);
            if (json.length == undefined) {
                throw new Error('Invalid JSON format; not an array');
            }
            json.forEach((event: CalendarEvent) => {
                event.startDate = new Date(event.startDate);
                event.endDate = new Date(event.endDate);
            });
            if (!isEvents(json)) {
                throw new Error('Invalid JSON format');
            }

            setEvents(json);
        } catch (e) {
            console.error(e);
        }
    }

    return <div className='drawer-content' style={{width: 600}}>
        <pre>
            {JSON.stringify(props, null, 4)}
        </pre>
        {props.dataSource == 'local'&&
            <textarea
                placeholder='local data here, JSON format'
                onChange={(e) => updateEvent(e.target.value)}
                defaultValue={JSON.stringify(events, null, 4)}
            />
        }
    </div>
}
const Tile = ({props, handler}: {props: InnerTileProps, handler: any}) => {
    // 初期化
    let defaultClass = ['tile-cell'];
    if (!props.module) { defaultClass.push('empty'); }
    const [className, setClassName] = useState(defaultClass);

    let defaultStyle: CSSProperties = {}
    if (props.colSta) { defaultStyle.gridColumnStart = props.colSta; }
    if (props.colLength) { defaultStyle.gridColumnEnd = `span ${props.colLength}`; }
    if (props.rowSta) { defaultStyle.gridRowStart = props.rowSta; }
    if (props.rowLength) { defaultStyle.gridRowEnd = `span ${props.rowLength}`; }
    const [style, setStyle] = useState(defaultStyle);

    let defaultDataSource = 'local';
    if (props.dataSource) { defaultDataSource = props.dataSource; }
    const [dataSource, setDataSource] = useState('local');
    const [events, setEvents] = useState<[]>([]);

    const [launcherOpen, setlauncherOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [Component, setComponents] = useState<ComponentType<any>>();

    // useEffect
    useEffect(() => {
        setComponents(loadComponent(props.module, props.component));
    }, []);
    useEffect(() => {
        if (Component) {
            setClassName(className.filter(str => str != 'empty'));
        } else {
            setClassName([...className, 'empty']);
        }
    }, [Component]);

    return <div
        className={className.join(' ')}
        style={style}
    >
        {Component&& <>
            <TileHeader
                props={{
                    id: props.id,
                    title: props.title || props.component,
                    componentHandler: setComponents,
                    launchHandler: setlauncherOpen,
                    drawerHandler: setDrawerOpen,
                }}
                handler={handler}
            />
            <div className='tile-content'>
                <Component events={events} />
            </div>
        </>}
        {!Component&&
            <IconButton onClick={() => setlauncherOpen(true)}>
                <AddCircle className='add-circle' />
            </IconButton>
        }
        {launcherOpen&&
            // launcher dialog
            <Dialog
                open={launcherOpen}
                onClose={() => setlauncherOpen(false)}
                PaperProps={{
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData as any).entries());
                            console.log(formJson);
                            props.module = formJson.Module;
                            props.component = formJson.Component;
                            props.title = formJson.Component;
                            setComponents(loadComponent(formJson.Module, formJson.Component));
                            setlauncherOpen(false);
                        },
                }}
            >
                <DialogTitle>Launch Module</DialogTitle>
                <DialogContent style={{ padding: '4px 24px', }}>
                    <Autocomplete
                        id="module-select"
                        options={['Calendars']}
                        sx={{ width: 300}}
                        renderInput={(params) => <TextField {...params} label='Module' name='Module' />}
                    />
                    <Autocomplete
                        id="component-select"
                        options={['MonthCalendar', 'WeekCalendar']}
                        sx={{ width: 300, marginTop: '16px' }}
                        renderInput={(params) => <TextField {...params} label='Component' name='Component' />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setlauncherOpen(false)}>Cancel</Button>
                    <Button type='submit'>Launch</Button>
                </DialogActions>
            </Dialog>
        }
        {
            <Drawer open={drawerOpen} anchor='right' onClose={() => setDrawerOpen(!drawerOpen)}>
                <DrawerContent props={props} events={events} setEvents={setEvents} />
            </Drawer>
        }
    </div>
}
const Worktile = ({props, handler}: {props: InnerTileProps[], handler: Object}) => {
    const [maxTileNum, setMaxTileNum] = useState(defaultTileNum);
    let usedTileNum = 0;
    props.forEach(param => {
        usedTileNum += (param.colLength || 1) * (param.rowLength || 1);
    });
    const [emptyTileNum, setEmptyTileNum] = useState(defaultTileNum - usedTileNum);

    const calcEmptyTileNum = () => {
        let usedTileNum = 0;
        props.forEach(param => {
            usedTileNum += (param.colLength || 1) * (param.rowLength || 1);
        });
        setEmptyTileNum(maxTileNum - usedTileNum);
    }

    useEffect(calcEmptyTileNum, [JSON.stringify(props)]);

    return <div className='worktile-wrapper'>
        {
            props.map((param, i) => {
                return <Tile
                    key={'c'+i}
                    props={param}
                    handler={handler}
                />
            })
        }
        {
            [...Array(emptyTileNum)].map((_, i) => {
                return <Tile
                    key={'e'+i}
                    props={{id: 'empty'+i}}
                    handler={handler}
                />
            })
        }
    </div>
}