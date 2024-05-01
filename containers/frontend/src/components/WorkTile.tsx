import { useEffect, useState, ComponentType, lazy, CSSProperties } from 'react';

import { Menu, MenuItem } from '@mui/material';
import { Dialog, DialogActions, DialogContent, Autocomplete, DialogTitle, TextField, Button, IconButton } from '@mui/material';
import { AddCircle, Close, ExpandMore } from '@mui/icons-material';

import '@/components/styles/worktile.scss';
import type { TileProps, HeaderProps } from './types/WorkTile';

const defaultTileNum = 6;
const loadComponent = (moduleName: string | undefined, componentName: string | undefined) => {
    if (!moduleName || !componentName) { return; }
    const component = lazy(
        () => import(`@/components/${moduleName}`)
        .then(module => ({ default: module[componentName] }))
    );
    return component
};
const TileHeader = (props: HeaderProps) => {
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
            <MenuItem key={1} onClick={closeMenu}>
                item2
            </MenuItem>
            <MenuItem key={1} onClick={closeMenu}>
                item3
            </MenuItem>
        </Menu>
        <div className='icon close-btn' onClick={() => props.componentHandler(undefined)}>
            <Close />
        </div>
    </div>;
}
const Tile = (props: TileProps) => {
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

    const [Component, setComponents] = useState<ComponentType<any>>();
    const [events, setEvents] = useState<[]>([]);

    const [launcherOpen, setlauncherOpen] = useState(false);

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
                title={props.title || props.component}
                componentHandler={setComponents}
                launchHandler={setlauncherOpen}
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
    </div>
}
export const Worktile = ({props=[]}: {props?: TileProps[]}) => {
    if (!props) { props = [] }
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
                console.log(param, i)
                return <Tile
                    key={'c'+i}
                    {...param}
                />
            })
        }
        {
            [...Array(emptyTileNum)].map((_, i) => {
                return <Tile
                    key={'e'+i}
                />
            })
        }
    </div>
}