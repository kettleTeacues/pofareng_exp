import { Dispatch } from 'react';

interface CommonTileProps {
    title?: string,
    module?: string,
    component?: string,
    dataSource?: 'query' | 'other-tile' | 'local',
    colSta?: number,
    colLength?: number,
    rowSta?: number,
    rowLength?: number,
}
export interface TileProps extends CommonTileProps {
    id?: string | number,
}
export interface InnerTileProps extends CommonTileProps {
    id: string | number,
}
export interface HeaderProps {
    id: string | number,
    title?: string,
    launchHandler: Dispatch<any>,
    componentHandler: Dispatch<any>,
    drawerHandler: Dispatch<any>,
}