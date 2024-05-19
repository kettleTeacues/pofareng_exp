import { useEffect, useState, useReducer, lazy, Dispatch } from 'react';
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { Menu, MenuItem } from '@mui/material';
import { Dialog, DialogActions, DialogContent, Autocomplete, DialogTitle, TextField, Button } from '@mui/material';
import { Close, ExpandMore, Store } from '@mui/icons-material';
import { MonthCalendarClass } from './Calendars';

import '@/components/styles/worktile.scss';
import { tileKeys } from './types/WorkTile';
import type { TileStates, TileProps, InnerTileProps, InnerTileData } from './types/WorkTile';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const ComponentsSelection: {[key: string]: string[]} = {
    'Calendars': ['MonthCalendar', 'WeekCalendar'],
    'DataManager': ['DataTable', 'TileInformation', 'WorktileInformation'],
}
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
    layout: Layout[] = [];
    tiles: TileStates[];
    activeTileId: string = '';
    maxRow = 2;
    maxCol = 3;
    openLauncher = false;
    worktile: () => JSX.Element;
    addTile: (tiles: TileProps | TileProps[]) => InnerTileProps[] | Error;
    removeTile: (id: string | number) => void;
    setTiles?: (tiles: TileStates[]) => void;
    toDateString: (date: string) => string = (date) => {
        const tmpDate = new Date(date);

        if (isNaN(tmpDate.getTime())) {
            return date;
        } else {
            return `${tmpDate.getFullYear()}-${('0' + (tmpDate.getMonth() + 1)).slice(-2)}-${('0' + tmpDate.getDate()).slice(-2)} ${('0' + tmpDate.getHours()).slice(-2)}:${('0' + tmpDate.getMinutes()).slice(-2)}:${('0' + tmpDate.getSeconds()).slice(-2)}.${('00' + tmpDate.getMilliseconds()).slice(-3)}`;
        }
    };

    // 最初は空の関数を入れておく、WorkTileを生成するときステート更新関数に上書きする
    setActiveTileId: (tileId: string) => void = () => {};
    setOpenLauncher: (bool: boolean) => void = () => {};
    setLayout: (layout: Layout[]) => void = () => {};
    
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
                if (!tile.title) { tile.title = tile.component; }

                // datasetsを付加
                if (!tile.datasets) { tile.datasets = []; }

                // タイルを追加
                if (this.setTiles) {
                    // ステート定義後の挙動
                    this.setTiles([...this.tiles, tile as TileStates]);
                } else {
                    // ステート定義前の挙動
                    this.tiles.push(tile as TileStates);
                    this.layout.push(
                        {
                            i: tile.id,
                            x: tile.x || 0,
                            y: tile.y || 0,
                            w: tile.w || 1,
                            h: tile.h || 1,
                        })
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
}
const loadComponent = (moduleName: string | undefined, componentName: string | undefined) => {
    if (!moduleName || !componentName) { return; }
    const component = lazy(
        () => import(`@/components/${moduleName}`)
        .then(module => ({ default: module[componentName] }))
    );
    return component
};
const ComponentLauncher = ({wt, id='', isOpen=false, setOpen}: {wt: WorkTile, id: string, isOpen: boolean, setOpen: Dispatch<boolean>}) => {
    const [selectedModule, setSelectedModule] = useState('');

    return <Dialog
        open={isOpen}
        onClose={() => setOpen(false)}
        PaperProps={{
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());
                    console.log(formJson);
                    if (formJson.id) {
                        // relaunch
                        const tile = wt.tiles.find(tile => tile.id == formJson.id);
                        tile?.setModule(formJson.Module);
                        tile?.setComponent(formJson.Component);
                        tile?.setTitle(formJson.Component);
                    } else {
                        // add new tile
                        wt.addTile({
                            module: formJson.Module,
                            component: formJson.Component,
                            title: formJson.Component,
                        });
                    }
                    setOpen(false);
                },
        }}
    >
        <DialogTitle>Launch Module</DialogTitle>
        <DialogContent style={{ padding: '4px 24px', }}>
            <Autocomplete
                id="module-select"
                options={Object.keys(ComponentsSelection)}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label='Module' name='Module' />}
                onChange={(_, value) => setSelectedModule(value || '')}
            />
            <Autocomplete
                id="component-select"
                options={ComponentsSelection[selectedModule] || []}
                sx={{ width: 300, marginTop: '16px' }}
                renderInput={(params) => <TextField {...params} label='Component' name='Component' />}
            />
            <input type="text" name='id' value={id} readOnly style={{display: 'none'}}/>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => wt.setOpenLauncher(false)}>Cancel</Button>
            <Button type='submit'>Launch</Button>
        </DialogActions>
    </Dialog>
}
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
            <MenuItem key={2} onClick={closeMenu}>
                Add Dataset
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

    // method
    const clickTile = (tile: TileStates) => {
        if (tile.module == 'DataManager') return;

        const tileEle = document.getElementById(tile.id);
        if (tileEle) {
            document.querySelectorAll('.active').forEach(ele => {
                ele.classList.remove('active');
            });
            tileEle.classList.add('active');
            wt.setActiveTileId(tile.id);
        }
    };

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
        id={tile.id}
        className={'tile-cell'}
        onClick={() => clickTile(tile)}
    >
        {tile.componentEle&& <>
            <TileHeader
                wt={wt}
                tile={tile}
            />
            <div className='tile-content'>
                <tile.componentEle
                    wt={wt}
                    tile={tile}
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
        <ComponentLauncher
            wt={wt}
            id={tile.id}
            isOpen={tile.openLauncher}
            setOpen={tile.setOpenLauncher}
        />
    </div>
}
const Worktile = ({wt}: {wt: WorkTile}) => {
    [wt['tiles'], wt['setTiles']] = useState(wt.tiles);
    [wt['activeTileId'], wt['setActiveTileId']] = useState(wt.activeTileId);
    [wt['openLauncher'], wt['setOpenLauncher']] = useState(false);
    [wt['layout'], wt['setLayout']] = useState(wt.layout);

    const test = new MonthCalendarClass();

    useEffect(() => {
        // タイル外をクリックしたとき、アクティブタイルを解除
        document.onclick = (e) => {
            const target = e.target as HTMLElement;
            if (typeof target.className == 'string' && target.className.includes('layout')) {
                document.querySelectorAll('.active').forEach(ele => {
                    ele.classList.remove('active');
                });
                wt.setActiveTileId('');
            }
        }
    }, []);

    return <>
        <ResponsiveReactGridLayout
            className={"layout"}
            cols={{ lg: 6 }}
            layouts={{lg: wt.layout}}
            draggableHandle=".tile-header"
            onLayoutChange={wt.setLayout}
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
            <test.MonthCalendar
                dayStrings={{
                    '0': '日',
                    '1': '月',
                    '2': '火',
                    '3': '水',
                    '4': '木',
                    '5': '金',
                    '6': '土',
                }}
            />

        <ComponentLauncher
            wt={wt}
            id=''
            isOpen={wt.openLauncher}
            setOpen={wt.setOpenLauncher}
        />
    </>
}
