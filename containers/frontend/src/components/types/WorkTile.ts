import { Dispatch, SetStateAction } from 'react';
import { Layout } from 'react-grid-layout'; 

interface CommonTileProps {
    title?: string,
    module?: string,
    component?: string,
    colSta?: number,
    colLength?: number,
    rowSta?: number,
    rowLength?: number,
    dataSource?: 'remote' | 'other-tile' | 'local',
    data?: {[key: string]: any}[],
    layout?: Layout,
    [key: string]: any,
}
export interface TileProps extends CommonTileProps {
    id?: string,
}
export interface InnerTileProps extends CommonTileProps {
    id: string,
}
export interface TileStates extends InnerTileProps {
    layout: Layout,
    setTitle: Dispatch<SetStateAction<string>>,
    setModule: Dispatch<SetStateAction<string>>,
    setComponent: Dispatch<SetStateAction<string>>,
    setColSta: Dispatch<SetStateAction<number>>,
    setColLength: Dispatch<SetStateAction<number>>,
    setRowSta: Dispatch<SetStateAction<number>>,
    setRowLength: Dispatch<SetStateAction<number>>,
    setDataSource: Dispatch<SetStateAction<'remote' | 'other-tile' | 'local'>>,
    setData: Dispatch<SetStateAction<{[key: string]: any}[]>>,
}
export interface HeaderProps {
    launchHandler: Dispatch<any>,
    componentHandler: Dispatch<any>,
    drawerHandler: Dispatch<any>,
}