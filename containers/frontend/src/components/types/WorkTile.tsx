import { Dispatch, SetStateAction } from 'react';
import { CalendarEvent } from './calendars';
import { Dataset } from '@mui/icons-material';

export const tileKeys = ['id', 'title', 'module', 'component', 'datasets', 'x', 'w', 'y', 'h', 'openDrawer', 'openLauncher', 'openDatasetsManager', 'openTileConfig', 'componentInstance', 'componentProps'];
export class BaseInnerComponent {
    Component: (...args: any[]) => JSX.Element = () => <div />;
    AdditionalHeader: (...args: any[]) => JSX.Element = () => <div />;
}

type DataSource = 'remote' | 'other-tile' | 'local';
export interface Dataset {
    id?: string;
    dataSource: DataSource;
    refTileId?: string;
    refDatasetId?: string;
    records: CalendarEvent[];
    [key: string]: any;
}
export interface InnerDataset extends Dataset{
    id: string;
}
interface CommonTileProps {
    title?: string;
    module?: string;
    component?: string;
    x?: number;
    w?: number;
    y?: number;
    h?: number;
    datasets?: Dataset[];
    componentProps?: {[key: string]: any};
    [key: string]: any;
}
export interface TileProps extends CommonTileProps {
    id?: string;
}
export interface InnerTileProps extends CommonTileProps {
    id: string;
}
export interface TileStates extends InnerTileProps {
    // 新しいプロパティを追加するときはtileKeysにも追加する
    openLauncher: boolean,
    openDatasetsManager: boolean,
    openTileConfig: boolean,
    componentInstance: BaseInnerComponent,

    // tileKeysに含まれるkeyを参照して、Tileコンポーネント初期化時にset関数を定義する。
    setTitle: Dispatch<string>;
    setModule: Dispatch<string>;
    setComponent: Dispatch<string>;
    setColSta: Dispatch<number>;
    setColLength: Dispatch<number>;
    setRowSta: Dispatch<number>;
    setRowLength: Dispatch<number>;
    setOpenLauncher: Dispatch<boolean>;
    setOpenDatasetsManager: Dispatch<boolean>;
    setOpenTileConfig: Dispatch<boolean>;
    setComponentInstance: Dispatch<Dispatch<SetStateAction<BaseInnerComponent>> | undefined>;
    setComponentProps: Dispatch<{[key: string]: any}>;

    datasets: InnerDataset[];
    setDatasets: Dispatch<{type: string, payload: InnerDataset}>;
}

export interface dashboardResponse {
    id: string;
    order: number;
    title: string;
    description: string;
    tiles: CommonTileProps[];
    datasets: Dataset[];
    updated_by_id: string;
    created_by_id: string;
}[]
export interface DatasetResponse {
    dataset: {
        id: string;
        name: string;
        description: string;
        created_by_id: string;
    };
    records: CalendarEvent[];
}
