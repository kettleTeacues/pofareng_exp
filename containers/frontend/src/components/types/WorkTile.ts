import { Dispatch, ComponentType, SetStateAction } from 'react';
import { CalendarEvent } from './calendars';

export const tileKeys = ['id', 'title', 'module', 'component', 'datasets', 'x', 'w', 'y', 'h', 'openDrawer', 'openLauncher', 'componentInstance', 'componentProps'];
export class BaseInnerComponent {
    Component: ComponentType<any> = () => null;
    AdditionalHeader: ComponentType<any> = () => null;
}

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
    x?: number,
    w?: number,
    y?: number,
    h?: number,
    datasets?: TileData[],
    componentProps?: {[key: string]: any},
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
    componentInstance: BaseInnerComponent,
    setTitle: Dispatch<string>,
    setModule: Dispatch<string>,
    setComponent: Dispatch<string>,
    setColSta: Dispatch<number>,
    setColLength: Dispatch<number>,
    setRowSta: Dispatch<number>,
    setRowLength: Dispatch<number>,
    setOpenLauncher: Dispatch<boolean>,
    setComponentInstance: Dispatch<Dispatch<SetStateAction<BaseInnerComponent>> | undefined>,
    setComponentProps: Dispatch<{[key: string]: any}>,

    datasets: InnerTileData[],
    setDatasets: Dispatch<{type: string, payload: InnerTileData}>,
}
