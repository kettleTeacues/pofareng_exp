import { useEffect, useState } from 'react';

import { Box, Tabs, Tab } from '@mui/material';
import { Table,TableBody, TableCell, TableContainer, TableHead, TableRow, Paper }from '@mui/material';

import '@/components/styles/datamanager.scss';
import type WorkTile from './WorkTile';
import { BaseInnerComponent, TileStates, InnerDataset } from './types/WorkTile';

export class DataTable extends BaseInnerComponent {
    constructor() {
        super();
        this.Component = this.Component.bind(this);
    };

    Component = ({wt, tile}: {wt?: WorkTile, tile?: TileStates}) => {
        if (!wt || !tile) { return <div>no active tile</div>; }

        const recordKeys = ['startDate', 'endDate', 'title', 'color'];
        const [tabId, setTabId] = useState(0);
        const [datasets, setDataset] = useState<InnerDataset[]>([]);
        
        return <div className='data-table-wrapper'>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabId} onChange={(_, val) => setTabId(val)} aria-label="basic tabs example">
                    {
                        datasets.map((dataset, i) => {
                            return <Tab key={dataset.id} label={dataset.id} />
                        })
                    }
                </Tabs>
            </Box>
            {
                datasets.map((dataset, i) => {
                    return <div hidden={tabId != i} key={dataset.id} className='property-wrapper'>
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
                                        dataset.records.map((record: any, i: number) => {
                                            return <TableRow key={i}>
                                                {
                                                    recordKeys.map(key => {
                                                        if (key.includes('Date')) {
                                                            return <TableCell key={key}>{wt.toDateString(record[key])}</TableCell>
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
        </div>
    }
}
