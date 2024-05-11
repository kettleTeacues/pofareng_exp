import { Dispatch, SetStateAction, ComponentType } from 'react';

type DataSource = 'remote' | 'other-tile' | 'local';
export interface TileData {
    dataSource: DataSource,
    tileId?: string,
    records: {[key: string]: any}[],
}
interface CommonTileProps {
    title?: string,
    module?: string,
    component?: string,
    colSta?: number,
    colLength?: number,
    rowSta?: number,
    rowLength?: number,
    data?: TileData[],
    [key: string]: any,
}
export interface TileProps extends CommonTileProps {
    id?: string,
}
export interface InnerTileProps extends CommonTileProps {
    id: string,
}
export interface TileStates extends InnerTileProps {
    openDrawer: boolean,
    openLauncher: boolean,
    componentEle: ComponentType<any>,
    setTitle: Dispatch<string>,
    setModule: Dispatch<string>,
    setComponent: Dispatch<string>,
    setColSta: Dispatch<number>,
    setColLength: Dispatch<number>,
    setRowSta: Dispatch<number>,
    setRowLength: Dispatch<number>,
    setDataSource: Dispatch<'remote' | 'other-tile' | 'local'>,
    setData: Dispatch<TileData[]>,
    setOpenDrawer: Dispatch<boolean>,
    setOpenLauncher: Dispatch<boolean>,
    setComponentEle: Dispatch<ComponentType<any> | undefined>,
}