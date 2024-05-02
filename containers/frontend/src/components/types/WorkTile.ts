import { Dispatch } from 'react';

export interface TileProps {
    title?: string,
    module?: string,
    component?: string,
    dataSource?: 'query' | 'other-tile' | 'local',
    colSta?: number,
    colLength?: number,
    rowSta?: number,
    rowLength?: number,
}
export interface HeaderProps {
    title?: string,
    launchHandler: Dispatch<any>,
    componentHandler: Dispatch<any>,
    drawerHandler: Dispatch<any>,
}