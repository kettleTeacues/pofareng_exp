import { useEffect, useState, useReducer, lazy, Dispatch } from 'react';

import { Box, Tabs, Tab } from '@mui/material';
import { Table,TableBody, TableCell, TableContainer, TableHead, TableRow, Paper }from '@mui/material';

import '@/components/styles/datamanager.scss';
import type WorkTile from './WorkTile';
import type { TileStates, TileProps, InnerTileProps, TileData, InnerTileData } from './types/WorkTile';

export const WorktileInformation = ({wt}: {wt: WorkTile}) => {
    return <div className='tile-info-wrapper'>
        <pre>
            {JSON.stringify(
                (
                    () => {
                        const clone = JSON.parse(JSON.stringify(wt));
                        clone.tiles.forEach((tile: any) => {
                            delete tile.componentEle;
                            delete tile.colSta;
                            delete tile.colLength;
                            delete tile.rowSta;
                            delete tile.rowLength;
                            tile.datasets.forEach((dataset: any) => {
                                if (dataset.records && dataset.records.length > 0) {
                                    dataset.records = "[...]"
                                } else {
                                    dataset.records = []
                                }
                            });
                        });
                        return clone;
                    }
                )()
            , null, 2)}
        </pre>
    </div>
}

export const TileInformation = ({wt, tile}: {wt: WorkTile, tile: TileStates}) => {
    const [activeTile, setActiveTile] = useState<TileStates | undefined>(undefined);

    useEffect(() => {
        const activeTile = wt.tiles.find(tile => tile.id == wt.activeTileId);
        if (activeTile?.module == 'DataManager') return;
        setActiveTile(activeTile);
    }, [wt.activeTileId]);

    return <div className='tile-info-wrapper'>
        <div className='property-wrapper'>
            {activeTile?
                ['id', 'title', 'module', 'component'].map(key => {
                    return <div className='property-row' key={key}>
                        <div className='property-col'>{key}</div>
                        <div className='property-col'>{activeTile[key]}</div>
                    </div>
                })
            :
                <div>no active tile</div>
            }
        </div>
    </div>
}
export const DataTable = ({wt, tile}: {wt: WorkTile, tile: TileStates}) => {
    const recordKeys = ['startDate', 'endDate', 'title', 'color'];
    const [tabId, setTabId] = useState(0);
    const [activeTile, setActiveTile] = useState<TileStates | undefined>(undefined);

    useEffect(() => {
        const activeTile = wt.tiles.find(tile => tile.id == wt.activeTileId);
        if (activeTile?.module == 'DataManager') return;
        setActiveTile(activeTile);
        setTabId(0);
    }, [wt.activeTileId]);
    function createData(
      name: string,
      calories: number,
      fat: number,
      carbs: number,
      protein: number,
    ) {
      return { name, calories, fat, carbs, protein };
    }

    return <div className='data-table-wrapper'>
        {activeTile?
            <>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabId} onChange={(_, val) => setTabId(val)} aria-label="basic tabs example">
                        {
                            activeTile.datasets.map((data, i) => {
                                return <Tab key={data.id} label={data.id} />
                            })
                        }
                    </Tabs>
                </Box>
                {
                    activeTile?.datasets.map((data, i) => {
                        return <div hidden={tabId != i} key={data.id} className='property-wrapper'>
                            <TableContainer component={Paper} sx={{height: '10%'}}>
                                <Table size="small" aria-label="a dense table" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            {
                                                recordKeys.map(key => {
                                                    return <TableCell key={key}>{key}</TableCell>
                                                })
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            data.records.map((record: any, i: number) => {
                                                return <TableRow key={i}>
                                                    {
                                                        recordKeys.map(key => {
                                                            if (key.includes('Date')) {
                                                                return <TableCell key={key}>{record[key].toLocaleString()}</TableCell>
                                                            } else {
                                                                return <TableCell key={key}>{record[key]}</TableCell>
                                                            }
                                                        })
                                                    }
                                                </TableRow>
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    })
                }
            </>
        :
            <div>no active tile</div>
        }
    </div>
}
