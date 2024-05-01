import { useEffect, useState, ComponentType, lazy, CSSProperties } from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return <div className='tile-header'>
        <span>{props.title}</span>
        <div onClick={handleClick} style={{height: '20px'}}>
            <ExpandMore className='icon-btn' />
        </div>
        <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >
            <MenuItem key={1} onClick={handleClose}>
                item1
            </MenuItem>
            <MenuItem key={2} onClick={handleClose}>
                item2
            </MenuItem>
            <MenuItem key={3} onClick={handleClose}>
                item3
            </MenuItem>
        </Menu>
        <Close className='icon-btn' />
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

    useEffect(() => {
        setComponents(loadComponent(props.module, props.component));
    }, []);

    return <div
        className={className.join(' ')}
        style={style}
    >
        {Component?
            <>
            <TileHeader
                title={props.title || props.component}
            />
            <div className='tile-content'>
                    <Component events={events} />
                </div>
            </>:
            <AddCircle className='add-circle' />
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