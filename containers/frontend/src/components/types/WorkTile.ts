import { Dispatch, SetStateAction } from 'react';

interface CommonTileProps {
    title?: string,
    module?: string,
    component?: string,
    colSta?: number,
    colLength?: number,
    rowSta?: number,
    rowLength?: number,
    dataSource?: 'query' | 'other-tile' | 'local',
    data?: {[key: string]: any}[],
    [key: string]: any,
}
export interface TileProps extends CommonTileProps {
    id?: string | number,
}
export interface InnerTileProps extends CommonTileProps {
    id: string | number,
}
export interface TileStates extends InnerTileProps {
    setTitle?: Dispatch<SetStateAction<string>>,
    setModule?: Dispatch<SetStateAction<string>>,
    setComponent?: Dispatch<SetStateAction<string>>,
    setColSta?: Dispatch<SetStateAction<number>>,
    setColLength?: Dispatch<SetStateAction<number>>,
    setRowSta?: Dispatch<SetStateAction<number>>,
    setRowLength?: Dispatch<SetStateAction<number>>,
    setDataSource?: Dispatch<SetStateAction<'query' | 'other-tile' | 'local'>>,
    setData?: Dispatch<SetStateAction<{[key: string]: any}[]>>,
}
export interface HeaderProps {
    launchHandler: Dispatch<any>,
    componentHandler: Dispatch<any>,
    drawerHandler: Dispatch<any>,
}