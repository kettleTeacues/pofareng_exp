import { useEffect, useState, ComponentType, lazy } from 'react';
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { Menu, MenuItem } from '@mui/material';
import { Dialog, DialogActions, DialogContent, Autocomplete, DialogTitle, TextField, Button } from '@mui/material';
import { Drawer } from '@mui/material';
import { Close, ExpandMore } from '@mui/icons-material';

import '@/components/styles/worktile.scss';
import type { TileStates, TileProps, InnerTileProps, HeaderProps } from './types/WorkTile';
import type { CalendarEvent } from './types/calendars';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const tileKeys = ['id', 'title', 'module', 'component', 'colSta', 'colLength', 'rowSta', 'rowLength', 'dataSource', 'data',];
export default class WorkTile {
    name: string;
    tiles: TileStates[];
    maxRow = 2;
    maxCol = 3;
    worktile: () => JSX.Element;

    handler: {
        addTile: (tiles: TileProps | TileProps[]) => InnerTileProps[] | Error;
        removeTile: (id: string | number) => void;
        setTiles?: (tiles: TileStates[]) => void;
    }
    
    constructor(args: {
        name?: string,
        tiles?: TileProps[],
    }) {
        // init
        this.name = args.name || 'WorkTile';
        this.tiles = [];
        this.worktile = () => Worktile({wt: this});
        
        // methods
        this.handler = {
            addTile: (tiles) => {
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
                        tile.id = Math.random().toString(36).slice(-10);
                        while (this.tiles.some(prop => prop.id == tile.id)) {
                            tile.id = Math.random().toString(36).slice(-10);
                        }
                    }
    
                    // タイトルを付加
                    if (!tile.title) {
                        tile.title = tile.component;
                    }
    
                    // タイルを追加
                    if (this.handler.setTiles) {
                        this.handler.setTiles([...this.tiles, tile as TileStates]);
                    } else {
                        this.tiles.push(tile as TileStates);
                    }
                });
                return tempTiles as InnerTileProps[];
            },
            removeTile: (id) => {
                if (this.handler.setTiles) {
                    this.handler.setTiles(this.tiles.filter(prop => prop.id !== id));
                } else {
                    this.tiles = this.tiles.filter(prop => prop.id !== id);
                }
            }
        }

        // tilesを初期化
        if (args.tiles) {
            args.tiles.forEach(tile => {
                this.handler.addTile(tile);
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
const TileHeader = ({wt, tile, props}: {wt: WorkTile, tile: TileStates, props: HeaderProps}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
    };
    const relaunchModule = () => {
        props.launchHandler(true);
        setAnchorEl(null);
    }
    const openDrawer = () => {
        setAnchorEl(null);
        props.drawerHandler(true);
    }
    const closeTile = () => {
        console.log('close')
        props.componentHandler(undefined);
        wt.handler.removeTile(tile.id);
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
    const setLocalInputEvents = (jsonStr: string) => {
        let json;
        try {
            // 入力されたJSONをパース
            json = JSON.parse(jsonStr);

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
            tile.setData(json);
        } catch (e) {
            console.error(e);
        }
    }
    const refOtherTileEvents = (val: {label: string | number, id: string | number} | null) => {
        if (!val) {
            tile.setData([]);
            return;
        } else {
            let otherTile = wt.tiles.find(tile => tile.id == val.id);
            if (otherTile && otherTile.data) {
                tile.setData(otherTile.data);
            } else {
                tile.setData([]);
            }
        }
    }

    return <div className='drawer-content' style={{width: 600}}>
        <pre style={{maxHeight: '50vh', overflow: 'auto'}}>
            {JSON.stringify(tile, null, 4)}
        </pre>
        {tile.dataSource == 'local'?
            <textarea
                placeholder='local data here, JSON format'
                onChange={(e) => setLocalInputEvents(e.target.value)}
                defaultValue={JSON.stringify(tile.data, null, 4)}
            />
        :tile.dataSource == 'remote'?
            <Autocomplete
                id="dataSource-select"
                options={['data-set1', 'data-set2', 'data-set3']}
                renderInput={(params) => <TextField {...params} label='DataSource' />}
            />
        : //others
            <>
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
                    renderInput={(params) => <TextField {...params} label='DataSource' />}
                    onChange={(_, val) => refOtherTileEvents(val)}
                />
            </>
        }
    </div>
}
const Tile = ({wt, tile}: {wt: WorkTile, tile: TileStates}) => {
    // 初期化
    const [launcherOpen, setlauncherOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [Component, setComponents] = useState<ComponentType<any>>();

    // tileを生成
    let clone = JSON.parse(JSON.stringify(tile));
    tileKeys.forEach(key => {
        delete tile[key];
        [tile[key], tile[`set${key.charAt(0).toUpperCase()}${key.slice(1)}`]] = useState(clone[key]);
    });

    // useEffect
    useEffect(() => {
        setComponents(loadComponent(tile.module, tile.component));
    }, []);
    useEffect(() => {
        setComponents(loadComponent(tile.module, tile.component));
    }, [tile.module, tile.component]);

    return <div
        className={'tile-cell'}
    >
        {Component&& <>
            <TileHeader
                wt={wt}
                tile={tile}
                props={{
                    componentHandler: setComponents,
                    launchHandler: setlauncherOpen,
                    drawerHandler: setDrawerOpen,
                }}
            />
            <div className='tile-content'>
                <Component events={tile.data} />
            </div>
        </>}
        {launcherOpen&&
            // launcher dialog
            <Dialog
                open={launcherOpen}
                onClose={() => setlauncherOpen(false)}
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
                                wt.handler.addTile({
                                    module: formJson.Module,
                                    component: formJson.Component,
                                    title: formJson.Component,
                                    colSta: tile.colSta,
                                    rowSta: tile.rowSta,
                                });
                            }
                            setlauncherOpen(false);
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
                    <Button onClick={() => setlauncherOpen(false)}>Cancel</Button>
                    <Button type='submit'>Launch</Button>
                </DialogActions>
            </Dialog>
        }
        {
            <Drawer open={drawerOpen} anchor='right' onClose={() => setDrawerOpen(!drawerOpen)}>
                <DrawerContent wt={wt} tile={tile} />
            </Drawer>
        }
    </div>
}
const Worktile = ({wt}: {wt: WorkTile}) => {
    [wt['tiles'], wt.handler['setTiles']] = useState(wt.tiles);

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