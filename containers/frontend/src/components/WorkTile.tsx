import { useEffect, useState, useReducer, lazy, Dispatch } from 'react';
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { Menu, MenuItem } from '@mui/material';
import { Dialog, DialogActions, DialogContent, Autocomplete, DialogTitle, TextField, Button } from '@mui/material';
import { Drawer } from '@mui/material';
import { Close, ExpandMore } from '@mui/icons-material';

import '@/components/styles/worktile.scss';
import type { TileStates, TileProps, InnerTileProps, TileData, InnerTileData } from './types/WorkTile';
import type { CalendarEvent } from './types/calendars';
import { act } from 'react-dom/test-utils';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const tileKeys = ['id', 'title', 'module', 'component', 'datasets', 'colSta', 'colLength', 'rowSta', 'rowLength', 'openDrawer', 'openLauncher', 'componentEle'];
const genUniqueId = (array: any[], idKey: string) => {
    let id = Math.random().toString(36).slice(-10);
    while (array.some(data => {data[idKey] == id})) {
        id = Math.random().toString(36).slice(-10);
    }
    return id;
};
const datasetsReducer = (datasets: InnerTileData[], action: {type: string, payload: InnerTileData}) => {
    switch (action.type) {
        case 'add':
            return [...datasets, {
                ...action.payload
            }];
        case 'remove':
            return datasets.filter(data => data != action.payload);
        case 'update':
            const dataset = datasets.find(data => data.id == action.payload.id);
            if (dataset) {
                dataset.records = action.payload.records;
            }
            return [...datasets];
        default:
            return datasets;
    }
};

export default class WorkTile {
    name: string;
    tiles: TileStates[];
    maxRow = 2;
    maxCol = 3;
    worktile: () => JSX.Element;
    addTile: (tiles: TileProps | TileProps[]) => InnerTileProps[] | Error;
    removeTile: (id: string | number) => void;
    setTiles?: (tiles: TileStates[]) => void;
    
    constructor(args: {
        name?: string,
        tiles?: TileProps[],
    }) {
        // init
        this.name = args.name || 'WorkTile';
        this.tiles = [];
        this.worktile = () => Worktile({wt: this});
        
        // methods
        this.addTile = (tiles) => {
            // 初期化
            let tempTiles: TileProps[] = [];
            if (tiles instanceof Array) {
                tempTiles = tiles;
            } else {
                tempTiles = [tiles];
            }

            // paramを元にpropsとTilesを更新
            tempTiles.forEach(tile => {
                // idの重複禁止制御
                if (this.tiles.some(prop => prop.id == tile.id)) {
                    console.error(new Error('Duplicate ID'));
                }
                if (!tile.id) {
                    tile.id = genUniqueId(this.tiles, 'id');
                }

                // タイトルを付加
                if (!tile.title) {
                    tile.title = tile.component;
                }

                // タイルを追加
                if (this.setTiles) {
                    this.setTiles([...this.tiles, tile as TileStates]);
                } else {
                    this.tiles.push(tile as TileStates);
                }
            });
            return tempTiles as InnerTileProps[];
        }
        this.removeTile = (id) => {
            if (this.setTiles) {
                this.setTiles(this.tiles.filter(prop => prop.id !== id));
            } else {
                this.tiles = this.tiles.filter(prop => prop.id !== id);
            }
        }

        // tilesを初期化
        if (args.tiles) {
            args.tiles.forEach(tile => {
                this.addTile(tile);
            });
        }
    }

    get usedTiles() {
        let usedTiles = 0;
        this.tiles.forEach(tile => {
            usedTiles += (tile.colLength || 1) * (tile.rowLength || 1);
        });
        return usedTiles;
    }
    get tileLayout() {
        // tileLayoutを初期化
        let tileLayout: {isUsed: number, col: number, row: number}[] = [];
        
        for (let i = 1; i <= this.maxRow; i++) {
            for (let j = 1; j <= this.maxCol; j++) {
                tileLayout.push({isUsed: 0, col: j, row: i});
            }
        }
        
        this.tiles.forEach((param) => {
            for (let i = (param.rowSta || 1) - 1; i < (param.rowSta || 1) - 1 + (param.rowLength || 1); i++) {
                for (let j = (param.colSta || 1) - 1; j < (param.colSta || 1) - 1 + (param.colLength || 1); j++) {
                    let tile = tileLayout.find(tile => tile.row === i+1 && tile.col === j+1);
                    if (tile) {
                        tile.isUsed = 1;
                    }
                }
            }
        });
        return tileLayout;
    }
}
const loadComponent = (moduleName: string | undefined, componentName: string | undefined) => {
    if (!moduleName || !componentName) { return; }
    const component = lazy(
        () => import(`@/components/${moduleName}`)
        .then(module => ({ default: module[componentName] }))
    );
    return component
};
const TileHeader = ({wt, tile}: {wt: WorkTile, tile: TileStates}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
    };
    const relaunchModule = () => {
        tile.setOpenLauncher(true);
        setAnchorEl(null);
    }
    const openDrawer = () => {
        console.log(tile)
        setAnchorEl(null);
        tile.setOpenDrawer(true);
    }
    const closeTile = () => {
        console.log('close')
        tile.setComponentEle(undefined);
        wt.removeTile(tile.id);
    }
    
    return <div className='tile-header'>
        <span>{`${tile.title}(${tile.id})`}</span>
        <div className='icon' onClick={openMenu}>
            <ExpandMore className='icon-btn' />
        </div>
        <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeMenu}
        >
            <MenuItem key={1} onClick={relaunchModule}>
                Relaunch
            </MenuItem>
            <MenuItem key={2} onClick={openDrawer}>
                Open Drawer
            </MenuItem>
            <MenuItem key={3} onClick={closeMenu}>
                item3
            </MenuItem>
        </Menu>
        <div className='icon close-btn' onClick={closeTile}>
            <Close />
        </div>
    </div>;
}
const DrawerContent = ({wt, tile}: {wt: WorkTile, tile: TileStates}) => {
    const [refTileId, setRefTileId] = useState('');
    const isEvents = (json: any): json is TileProps[] => {
        // イベントが最低限のフィールドを持ち、かつ日付型であるか検証
        return json.every((event: any) => {
            let bool = false;
            if (event.startDate && event.startDate != 'Invalid Date'
            && event.endDate && event.endDate != 'Invalid Date'
            && event.title) {
                bool = true;
            } else {
                console.log(event);
            }
            return bool;
        });
    }
    const setLocalInputEvents = (jsonStr: string, dataset: InnerTileData) => {
        let json;
        try {
            // 入力されたJSONをパース
            json = JSON.parse(jsonStr) as CalendarEvent[];

            // JSONが配列でない場合はエラー
            if (json.length == undefined) {
                throw new Error('Invalid JSON format; not an array');
            }
            json.forEach((event: CalendarEvent) => {
                event.startDate = new Date(event.startDate);
                event.endDate = new Date(event.endDate);
            });

            // イベントの形式が正しくない場合はエラー
            if (!isEvents(json)) {
                throw new Error('Invalid JSON format');
            }

            // イベントをセット
            console.log('set data');
            tile.setDatasets({
                type: 'update',
                payload: {
                    id: dataset.id,
                    dataSource: dataset.dataSource,
                    records: json
                }
            });
        } catch (e) {
            console.error(e);
        }
    }
    const refOtherTileEvents = (val: {label: string | number, refTileId: string, datasetId: string} | null) => {
        console.log(val);
    }

    return <div className='drawer-content' style={{width: 600}}>
        <pre style={{maxHeight: '50vh', overflow: 'auto'}}>
            {JSON.stringify(tile, null, 4)}
        </pre>
        {
            tile.datasets.map((dataset, i) => {
                return <div key={i}>
                    <textarea
                        key={i}
                        placeholder='local data here, JSON format'
                        onChange={(e) => setLocalInputEvents(e.target.value, dataset)}
                        defaultValue={JSON.stringify(dataset.records, null, 4)}
                    />
                </div>
            })
        }
        {/* <Autocomplete
            id="dataSource-select"
            options={['data-set1', 'data-set2', 'data-set3']}
            renderInput={(params) => <TextField {...params} label='DataSource' />}
        /> */}
        {
            tile.datasets.filter(dataset => dataset.dataSource == 'other-tile').map((dataset, i) => {
                return <div key={i}>
                    <span>{dataset.dataSource}({dataset.id})</span>
                    <Autocomplete
                        id="tile-select"
                        options={
                            wt.tiles.filter(t => t.id != tile.id).map(t => {
                                return {
                                    label: t.title || t.id,
                                    id: t.id
                                }
                            })
                        }
                        isOptionEqualToValue={
                            // The value provided to Autocomplete is invalid の応急処置
                            () => true
                        }
                        renderInput={(params) => <TextField {...params} label='Tile' />}
                        onChange={(_, val) => setRefTileId(val?.id || '')}
                    />
                    <Autocomplete
                        id="dataset-select"
                        options={
                            wt.tiles.find(t => t.id == refTileId)?.datasets?.map((dataset, i) => {
                                return {
                                    label: `${dataset.dataSource}(${dataset.id})`,
                                    refTileId: refTileId,
                                    datasetId: dataset.id
                                }
                            }) || []
                        }
                        isOptionEqualToValue={
                            // The value provided to Autocomplete is invalid の応急処置
                            () => true
                        }
                        renderInput={(params) => <TextField {...params} label='Dataset' />}
                        onChange={(_, val) => refOtherTileEvents(val)}
                    />
                </div>
            })
        }
    </div>
}
const Tile = ({wt, tile}: {wt: WorkTile, tile: TileStates}) => {
    // 初期化
    let clone: TileStates = JSON.parse(JSON.stringify(tile));
    tileKeys.forEach(key => {
        delete tile[key];
        [tile[key], tile[`set${key.charAt(0).toUpperCase()}${key.slice(1)}`]] = useState(clone[key]);
    });
    // clone.datasetsにユニークなidを付与
    clone.datasets.forEach((dataset: InnerTileData) => {
        if (!dataset.id) {
            dataset.id = genUniqueId(clone.datasets, 'id');
        }
    });
    [tile.datasets, tile.setDatasets] = useReducer(datasetsReducer, clone.datasets || []);

    // useEffect
    useEffect(() => {
        tile.setComponentEle(loadComponent(tile.module, tile.component));
    }, []);
    useEffect(() => {
        tile.setComponentEle(loadComponent(tile.module, tile.component));
    }, [tile.module, tile.component]);
    
    // tile.dataが更新されたとき、このタイルを参照している他タイルのtile.dataを更新する。
    useEffect(() => {
        // 無限ループ検知
        let InfiniteLoopPath: {title: string, id: string}[] = [];
        const detectLoop = (originTileId: string, currentTile: TileStates, refPath: {title: string, id: string}[] = []): boolean => {
            if (refPath.length > 1
            &&  originTileId == currentTile.id) {
                InfiniteLoopPath = refPath;
                return true;
            }

            return wt.tiles.some(t => {
                return t.datasets?.some(data => {
                  if (data.dataSource == 'other-tile' && data.refTileId == currentTile.id) {
                    return detectLoop(originTileId, t, [...refPath, {title: t.title || t.id, id: t.id}]);
                  }
                  return false;
                });
              });
        }
        const isInfiniteLoop = detectLoop(tile.id, tile, [{title: tile.title || tile.id, id: tile.id}]);

        if (isInfiniteLoop) {
            // 無限ループを通知
            console.log(InfiniteLoopPath);
            console.error('Infinite loop detected');
            window.alert('Infinite loop detected');
        } else {
            // 他タイルのdataを更新
            wt.tiles.forEach(t => {
                t.datasets?.forEach(data => {
                    if (data.dataSource == 'other-tile'
                    &&  data.refTileId == tile.id
                    &&  tile.datasets.some(d => d.id == data.refDatasetId)) {
                        t.setDatasets({
                            type: 'update',
                            payload: {
                                id: data.id,
                                dataSource: data.dataSource,
                                refTileId: data.refTileId,
                                refDatasetId: data.refDatasetId,
                                records: tile.datasets.find(d => d.id == data.refDatasetId)?.records || []
                            }
                        });
                    }
                });
            });
        }
    }, [tile.datasets]);

    return <div
        className={'tile-cell'}
    >
        {tile.componentEle&& <>
            <TileHeader
                wt={wt}
                tile={tile}
            />
            <div className='tile-content'>
                <tile.componentEle
                    events={(() => {
                        let events: {[key: string]: any}[] = [];
                        tile.datasets?.forEach(data => {
                            events = events.concat(data.records);
                        });
                        return events;
                    })()}
                />
            </div>
        </>}
        {tile.openLauncher&&
            // launcher dialog
            <Dialog
                open={tile.openLauncher}
                onClose={() => tile.setOpenLauncher(false)}
                PaperProps={{
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData as any).entries());
                            console.log(formJson);
                            if (formJson.id) {
                                // relaunch
                                tile.setModule(formJson.Module);
                                tile.setComponent(formJson.Component);
                                tile.setTitle(formJson.Component);
                            } else {
                                // add new tile
                                wt.addTile({
                                    module: formJson.Module,
                                    component: formJson.Component,
                                    title: formJson.Component,
                                    colSta: tile.colSta,
                                    rowSta: tile.rowSta,
                                });
                            }
                            tile.setOpenLauncher(false);
                        },
                }}
            >
                <DialogTitle>Launch Module</DialogTitle>
                <DialogContent style={{ padding: '4px 24px', }}>
                    <Autocomplete
                        id="module-select"
                        options={['Calendars']}
                        sx={{ width: 300}}
                        renderInput={(params) => <TextField {...params} label='Module' name='Module' />}
                    />
                    <Autocomplete
                        id="component-select"
                        options={['MonthCalendar', 'WeekCalendar']}
                        sx={{ width: 300, marginTop: '16px' }}
                        renderInput={(params) => <TextField {...params} label='Component' name='Component' />}
                    />
                    <input type="text" name='id' value={tile.id} readOnly style={{display: 'none'}}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => tile.setOpenLauncher(false)}>Cancel</Button>
                    <Button type='submit'>Launch</Button>
                </DialogActions>
            </Dialog>
        }
        {
            <Drawer open={tile.openDrawer} anchor='right' onClose={() => tile.setOpenDrawer(!tile.openDrawer)}>
                <DrawerContent wt={wt} tile={tile} />
            </Drawer>
        }
    </div>
}
const Worktile = ({wt}: {wt: WorkTile}) => {
    [wt['tiles'], wt['setTiles']] = useState(wt.tiles);

    return <ResponsiveReactGridLayout
        className={"layout"}
        cols={{ lg: 6 }}
        layouts={{lg: wt.tiles.map(tile => {
            return {
                i: tile.id,
                x: (tile.colSta || 1) - 1,
                y: (tile.rowSta || 1) - 1,
                w: tile.colLength || 1,
                h: tile.rowLength || 1,
            }
        })}}
        draggableHandle=".tile-header"
    >
        {
            wt.tiles.map((tile) => {
                return <div key={tile.id}>
                    <Tile
                        wt={wt}
                        tile={tile}
                    />
                </div>
            })
        }
    </ResponsiveReactGridLayout>
}