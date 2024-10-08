import { useEffect, useState, useReducer, Dispatch } from 'react';
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { Menu, MenuItem } from '@mui/material';
import { Drawer, Box, Tabs, Tab } from '@mui/material';
import { Close, ExpandMore } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, Autocomplete, DialogTitle, TextField, Button } from '@mui/material';

import '@/components/styles/worktile.scss';
import { tileKeys } from './types/WorkTile';
import type { TileStates, TileProps, InnerTileProps, InnerDataset, dashboardResponse, Datalog } from './types/WorkTile';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const ComponentsSelection: {[key: string]: string[]} = {
    'Calendars': ['MonthCalendar', 'WeekCalendar'],
    'DataManager': ['DataTable', 'TileInformation', 'WorktileInformation'],
    'CompoTemplate': ['CompoTemplate'],
    'DataViewer': ['Table', 'RecordDetail']
}
const genUniqueId = (array: any[], idKey: string) => {
    let id = Math.random().toString(36).slice(-10);
    while (array.some(data => {data[idKey] == id})) {
        id = Math.random().toString(36).slice(-10);
    }
    return id;
};
const datasetsReducer = (datasets: InnerDataset[], action: {type: string, payload: InnerDataset}) => {
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
const loadComponent = async (moduleName: string | undefined, componentName: string | undefined) => {
    if (!moduleName || !componentName) { return; }
    const componentClass = await import(`@/components/${moduleName}`);
    return componentClass[componentName];
}

export default class WorkTile {
    constructor(dashboard: dashboardResponse | 'new') {
        // init
        if (dashboard == 'new') {
            this.id = '';
            this.order = 0;
            this.title = 'WorkTile';
            this.description = '';
            this.updated_by_id = '';
            this.created_by_id = '';
            this.Worktile = this.Worktile.bind(this);
            this.Tile = this.Tile.bind(this);
            this.TileHeader = this.TileHeader.bind(this);
            this.ComponentLauncher = this.ComponentLauncher.bind(this);
            this.addTile = this.addTile.bind(this);
            this.removeTile = this.removeTile.bind(this);
        } else {
            this.id = dashboard.id || '';
            this.order = dashboard.order || 0;
            this.title = dashboard.title || 'WorkTile';
            this.description = dashboard.description || '';
            this.updated_by_id = dashboard.updated_by_id || '';
            this.created_by_id = dashboard.created_by_id || '';
            this.Worktile = this.Worktile.bind(this);
            this.Tile = this.Tile.bind(this);
            this.TileHeader = this.TileHeader.bind(this);
            this.ComponentLauncher = this.ComponentLauncher.bind(this);
            this.addTile = this.addTile.bind(this);
            this.removeTile = this.removeTile.bind(this);
            
            // tilesを初期化
            if (dashboard.tiles) {
                dashboard.tiles.forEach(tile => {
                    this.addTile(tile);
                });
            }

            // datasetを初期化
            if (dashboard.datasets) {
                this.datasets = dashboard.datasets as InnerDataset[];
                this.datasets.forEach(dataset => {
                    dataset.id = genUniqueId(this.datasets, 'id');
                });
            }
        }
        console.log('WorkTiel initialized')
    }
    
    // datas
    id: string;
    order: number;
    title: string;
    description: string;
    updated_by_id: string;
    created_by_id: string;
    layout: Layout[] = [];
    tiles: TileStates[] = [];
    datasets: InnerDataset[] = [];
    activeTileId: string = '';
    activeDatalog: Datalog | undefined = undefined;
    maxRow = 2;
    maxCol = 3;
    openLauncher = false;

    // methods
    addTile = (tiles: TileProps | TileProps[]) => {
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
                this.layout.push({
                    i: tile.id,
                    x: Number(tile.x) || 0,
                    y: Number(tile.y) || 0,
                    w: Number(tile.w) || 1,
                    h: Number(tile.h) || 1,
                });
            }
        });
        return tempTiles as InnerTileProps[];
    }
    removeTile = (id: string | number) => {
        if (this.setTiles) {
            this.setTiles(this.tiles.filter(prop => prop.id !== id));
        } else {
            this.tiles = this.tiles.filter(prop => prop.id !== id);
        }
    }
    toDateString: (date: string) => string = (date) => {
        const tmpDate = new Date(date);

        if (isNaN(tmpDate.getTime())) {
            return date;
        } else {
            return `${tmpDate.getFullYear()}-${('0' + (tmpDate.getMonth() + 1)).slice(-2)}-${('0' + tmpDate.getDate()).slice(-2)} ${('0' + tmpDate.getHours()).slice(-2)}:${('0' + tmpDate.getMinutes()).slice(-2)}:${('0' + tmpDate.getSeconds()).slice(-2)}.${('00' + tmpDate.getMilliseconds()).slice(-3)}`;
        }
    };
    toJson = (): dashboardResponse => {
        // 現在のWorkTileをjson形式で出力する。
        const tiles = this.tiles.map(tile => {
            const layout = this.layout.find(l => l.i == tile.id);
            return {
                title: tile.title,
                module: tile.module,
                component: tile.component,
                x: layout? layout.x : 0,
                w: layout? layout.w : 0,
                y: layout? layout.y : 0,
                h: layout? layout.h : 0,
                datasets: [],
            }
        });
        return {
            id: this.id,
            order: this.order,
            title: this.title,
            description: this.description,
            updated_by_id: this.updated_by_id,
            created_by_id: this.created_by_id,
            tiles: tiles,
            dataset_ids: []
        }
    }
    // 最初はundefinedまたは空の関数を入れておく、WorkTileを生成するときステート更新関数に上書きする
    setTiles?: (tiles: TileStates[]) => void;
    setActiveTileId: (tileId: string) => void = () => {};
    setActiveDatalog: (datalog: Datalog) => void = () => {};
    setOpenLauncher: (bool: boolean) => void = () => {console.log('setOpenLauncher()')};
    setLayout: (layout: Layout[]) => void = () => {};

    // Components
    Worktile = () => {
        [this.tiles, this.setTiles] = useState(this.tiles);
        [this.activeTileId, this.setActiveTileId] = useState(this.activeTileId);
        [this.activeDatalog, this.setActiveDatalog] = useState(this.activeDatalog);
        [this.openLauncher, this.setOpenLauncher] = useState(false);
        [this.layout, this.setLayout] = useState(this.layout);
    
        useEffect(() => {
            // タイル外をクリックしたとき、アクティブタイルを解除
            document.onclick = (e) => {
                const target = e.target as HTMLElement;
                if (typeof target.className == 'string' && target.className.includes('layout')) {
                    document.querySelectorAll('.active').forEach(ele => {
                        ele.classList.remove('active');
                    });
                    this.setActiveTileId('');
                }
            }
        }, []);
    
        return <>
            <ResponsiveReactGridLayout
                className={"layout"}
                cols={{ lg: 6 }}
                layouts={{lg: this.layout}}
                draggableHandle=".tile-header"
                onLayoutChange={this.setLayout}
            >
                {
                    this.tiles.map((tile) => {
                        return <div key={tile.id}>
                            <this.Tile
                                tile={tile}
                            />
                        </div>
                    })
                }
            </ResponsiveReactGridLayout>
        </>
    }
    private Tile = ({tile}: {tile: TileStates}) => {
        // 初期化
        let clone: TileStates = JSON.parse(JSON.stringify(tile));
        tileKeys.forEach(key => {
            // ステートを定義
            delete tile[key];
            [tile[key], tile[`set${key.charAt(0).toUpperCase()}${key.slice(1)}`]] = useState(clone[key]);
        });
        // clone.datasetsにユニークなidを付与
        clone.datasets.forEach((dataset: InnerDataset) => {
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
                this.setActiveTileId(tile.id);
            }
        };
        const launchComponent = async () => {
            if (!tile.component) return;
            const component = await loadComponent(tile.module, tile.component);
            const instance = new component();
            tile.setComponentInstance(() => instance);
        }
    
        // useEffect
        useEffect(() => {launchComponent();}, []);
        useEffect(() => {launchComponent();}, [tile.module, tile.component]);
    
        return <div
            id={tile.id}
            className={'tile-cell'}
            onClick={() => clickTile(tile)}
        >
            <this.TileHeader
                tile={tile}
            />
            <div className='tile-content'>
            {tile.componentInstance &&
                <tile.componentInstance.Component
                    wt={this}
                    tile={tile}
                    events={(() => {
                        let events: {[key: string]: any}[] = [];
                        tile.datasets?.forEach(data => {
                            events = events.concat(data.records);
                        });
                        return events;
                    })()}
                    {...tile.componentProps}
                />
            }
            </div>
            <this.ComponentLauncher
                id={tile.id}
                isOpen={tile.openLauncher}
                setOpen={tile.setOpenLauncher}
            />
            <Drawer open={tile.openDatasetsManager} anchor='right' onClose={() => tile.setOpenDatasetsManager(!tile.openDatasetsManager)}>
                <this.DatasetsManager tile={tile} />
            </Drawer>
            <Drawer open={tile.openTileConfig} anchor='right' onClose={() => tile.setOpenTileConfig(!tile.openTileConfig)}>
                <this.TileConfig tile={tile} />
            </Drawer>
        </div>
    }
    private TileHeader = ({tile}: {tile: TileStates}) => {
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
        const mngDataset = () => {
            tile.setOpenDatasetsManager(true);
            closeMenu();
        }
        const openTileConfig = () => {
            console.log(tile)
            console.log(tile.setOpenTileConfig)
            tile.setOpenTileConfig(true);
            closeMenu();
        }
        const closeTile = () => {
            console.log('close')
            tile.setComponentInstance(undefined);
            this.removeTile(tile.id);
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
                <MenuItem key={2} onClick={mngDataset}>
                    Datasets
                </MenuItem>
                <MenuItem key={3} onClick={openTileConfig}>
                    tile config
                </MenuItem>
            </Menu>

            {tile.componentInstance &&
                <tile.componentInstance.AdditionalHeader />
            }
            
            <div className='icon close-btn' onClick={closeTile}>
                <Close />
            </div>
        </div>;
    }
    ComponentLauncher = ({id='', isOpen=false, setOpen}: {id: string, isOpen: boolean, setOpen: Dispatch<boolean>}) => {
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
                        const tile = this.tiles.find(tile => tile.id == formJson.id);
                        tile?.setModule(formJson.Module);
                        tile?.setComponent(formJson.Component);
                        tile?.setTitle(formJson.Component);
                    } else {
                        // add new tile
                        this.addTile({
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
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button type='submit'>Launch</Button>
            </DialogActions>
        </Dialog>
    }
    private DatasetsManager = ({tile}: {tile: TileStates}) => {
        const dataSources = ['local', 'remote', 'other-tile'];
        const [tabId, setTabId] = useState(0);

        return <div className='drawer-content' style={{width: 600}}>
            <div className='record-wrapper'>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabId} onChange={(_, val) => setTabId(val)} aria-label="basic tabs example">
                        {
                            dataSources.map((dataSource, i) => {
                                return <Tab key={i} label={dataSource} />
                            })
                        }
                    </Tabs>
                </Box>
            </div>
        </div>
    }
    private TileConfig = ({tile}: {tile: TileStates}) => {
        const dataSource = [
            'title',
            'module',
            'component',
            'x',
            'w',
            'y',
            'h',
        ];
    
        return <div className='drawer-content' style={{width: 600}}>
            <div className='record-wrapper'>
                {
                    Object.keys(tile).filter(key => dataSource.includes(key)).map(key => {
                        return <div key={key} className='property-row'>
                            <div className='property-col'>{key}</div>
                            <div className='property-col'>{tile[key]}</div>
                        </div>
                    })
                }
            </div>
        </div>
    }
}
