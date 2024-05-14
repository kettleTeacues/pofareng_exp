import { Dispatch, SetStateAction, ComponentType } from 'react';
import { CalendarEvent } from './calendars';

export const tileKeys = ['id', 'title', 'module', 'component', 'datasets', 'colSta', 'colLength', 'rowSta', 'rowLength', 'openDrawer', 'openLauncher', 'componentEle'];
type DataSource = 'remote' | 'other-tile' | 'local';
export interface TileData {
    id?: string,
    dataSource: DataSource,
    refTileId?: string,
    refDatasetId?: string,
    records: CalendarEvent[],
    [key: string]: any,
}
export interface InnerTileData extends TileData{
    id: string;
}
interface CommonTileProps {
    title?: string,
    module?: string,
    component?: string,
    colSta?: number,
    colLength?: number,
    rowSta?: number,
    rowLength?: number,
    datasets?: TileData[],
    [key: string]: any,
}
export interface TileProps extends CommonTileProps {
    id?: string,
}
export interface InnerTileProps extends CommonTileProps {
    id: string,
}
export interface TileStates extends InnerTileProps {
    openLauncher: boolean,
    componentEle: ComponentType<any>,
    setTitle: Dispatch<string>,
    setModule: Dispatch<string>,
    setComponent: Dispatch<string>,
    setColSta: Dispatch<number>,
    setColLength: Dispatch<number>,
    setRowSta: Dispatch<number>,
    setRowLength: Dispatch<number>,
    setOpenLauncher: Dispatch<boolean>,
    setComponentEle: Dispatch<ComponentType<any> | undefined>,

    datasets: InnerTileData[],
    setDatasets: Dispatch<{type: string, payload: InnerTileData}>,
}
