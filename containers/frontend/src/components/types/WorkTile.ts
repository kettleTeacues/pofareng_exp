import { Dispatch, SetStateAction, ComponentType } from 'react';

type DataSource = 'remote' | 'other-tile' | 'local';
interface TileData {
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
    setTitle: Dispatch<SetStateAction<string>>,
    setModule: Dispatch<SetStateAction<string>>,
    setComponent: Dispatch<SetStateAction<string>>,
    setColSta: Dispatch<SetStateAction<number>>,
    setColLength: Dispatch<SetStateAction<number>>,
    setRowSta: Dispatch<SetStateAction<number>>,
    setRowLength: Dispatch<SetStateAction<number>>,
    setDataSource: Dispatch<SetStateAction<'remote' | 'other-tile' | 'local'>>,
    setData: Dispatch<SetStateAction<TileData[]>>,
    setOpenDrawer: Dispatch<boolean>,
    setOpenLauncher: Dispatch<boolean>,
    setComponentEle: Dispatch<SetStateAction<ComponentType<any> | undefined>>,
}