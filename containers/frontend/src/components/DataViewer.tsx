import { useEffect, useReducer, useState } from 'react';

import { Box, Tabs, Tab } from '@mui/material';
import { Table as MuiTable,TableBody, TableCell, TableContainer, TableHead, TableRow, Paper }from '@mui/material';
import { Edit, CloudUpload } from '@mui/icons-material';

import '@/components/styles/datamanager.scss';
import type WorkTile from './WorkTile';
import { BaseInnerComponent, TileStates, AdditionalParam, InnerDataset, Datalog } from './types/WorkTile';
import type { TableHeader } from './types/common';

import axiosClient from '@/plugins/axiosClient';

const updateRecord = async (record: Datalog) => {
    let url = '/datalog';
    console.log(record);
    const res = await axiosClient.put(url, [record]);
    console.log(res);
}
export class DatasetTable extends BaseInnerComponent {
    constructor() {
        super();
        this.Component = this.Component.bind(this);
    };

    Component = ({wt, tile}: {wt?: WorkTile, tile?: TileStates}) => {
        if (!wt || !tile) { return <div>no active tile</div>; }

        const [tableHeader, setTableHeader] = useState<TableHeader[]>([
            {key: 'start_datetime', title: 'start_datetime'},
            {key: 'end_datetime', title: 'end_datetime'},
            {key: 'event', title: 'event'},
        ]);
        const [tabId, setTabId] = useState(0);
        const [datasets, setDataset] = useState(wt.datasets as unknown as {[key: string]: string}[]);
        
        return <MuiTable size="small" aria-label="a dense table" stickyHeader>
            <TableHead>
                <TableRow>
                    {
                        Object.keys(datasets[0]).map(header => {
                            return <TableCell key={header}>{header}</TableCell>
                        })
                    }
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    datasets.map((dataset, i: number) => {
                        return <TableRow key={i}>
                            {
                                Object.keys(dataset).map(key => {
                                    return <TableCell key={key}>{`${dataset[key]}`}</TableCell>
                                })
                            }
                        </TableRow>
                    })
                }
            </TableBody>
        </MuiTable>
    }
}
export class Table extends BaseInnerComponent {
    constructor() {
        super();
        this.Component = this.Component.bind(this);
    };

    Component = ({wt, tile}: {wt?: WorkTile, tile?: TileStates}) => {
        if (!wt || !tile) { return <div>no active tile</div>; }

        const [tableHeader, setTableHeader] = useState<TableHeader[]>([
            {key: 'start_datetime', title: 'start_datetime'},
            {key: 'end_datetime', title: 'end_datetime'},
            {key: 'event', title: 'event'},
        ]);
        const [tabId, setTabId] = useState(0);
        const [datasets, setDataset] = useState<InnerDataset[]>(wt.datasets);
        
        return <div className='data-table-wrapper'>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabId} onChange={(_, val) => setTabId(val)} aria-label="basic tabs example">
                    {
                        datasets.map((dataset, i) => {
                            return <Tab key={dataset.dataset.id} label={dataset.dataset.name} />
                        })
                    }
                </Tabs>
            </Box>
            {
                datasets.map((dataset, i) => {
                    return <div hidden={tabId != i} key={dataset.dataset.id} className='property-wrapper'>
                        <TableContainer component={Paper} sx={{height: '10%'}}>
                            <MuiTable size="small" aria-label="a dense table" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {
                                            tableHeader.map(header => {
                                                return <TableCell key={header.key}>{header.title}</TableCell>
                                            })
                                        }
                                        {
                                            dataset.dataset.additional.map((additional: AdditionalParam) => {
                                                return <TableCell key={additional.key}>{additional.title}</TableCell>
                                            })
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        dataset.records.map((record, i: number) => {
                                            return <TableRow key={i} onClick={() => wt.setActiveDatalog(record.datalog)}>
                                                {
                                                    tableHeader.map(header => {
                                                        if (header.key.includes('date')) {
                                                            return <TableCell key={header.key}>{wt.toDateString(record.datalog[header.key] || '').slice(0,10)}</TableCell>
                                                        } else {
                                                            return <TableCell key={header.key}>{record.datalog[header.key]}</TableCell>
                                                        }
                                                    })
                                                }
                                                {
                                                    dataset.dataset.additional.map((additional: AdditionalParam) => {
                                                        const additionalData = record.datalog.additional
                                                        return <TableCell key={additional.key}>{additionalData[additional.key]}</TableCell>
                                                    })
                                                }
                                            </TableRow>
                                        })
                                    }
                                </TableBody>
                            </MuiTable>
                        </TableContainer>
                    </div>
                })
            }
        </div>
    }
}

export class RecordDetail extends BaseInnerComponent {
    constructor() {
        super();
        this.Component = this.Component.bind(this);
    };

    Component = ({wt, tile}: {wt?: WorkTile, tile?: TileStates}) => {
        const [dataRecord, setDataRecord] = useState<Datalog | undefined>(wt?.activeDatalog);
        const columns = ['event', 'start_datetime', 'end_datetime', 'updated_at', 'updated_by', 'created_at', 'created_by_id']
        const [isEditing, setIsEditing] = useState(false);

        const ViewRecord = ({activeRecord}: {activeRecord: Datalog}) => {
            return <>
                    <div>{activeRecord['id']}</div>
                    <Edit onClick={() => setIsEditing(true)}/>
                <div className='property-wrapper'>
                    {
                        columns.map(key => {
                            const val = activeRecord[key] || ''
                            return <div className='property-row' key={key}>
                                <div className='property-col'>{key}</div>
                                <div className='property-col'>{val}</div>
                            </div>
                        })
                    }
                    {
                        Object.keys(activeRecord.additional).map(key => {
                            const addtional = activeRecord.additional || '{}'
                            return <div className='property-row' key={key}>
                                <div className='property-col'>{key}</div>
                                <div className='property-col'>{addtional[key]}</div>
                            </div>
                        })
                    }
                </div>
            </>
        }
        const EditRecord = ({activeRecord}: {activeRecord: Datalog}) => {
            const editingRecordReducer = (record: Datalog, action: {type: string, payload: {key: string, value: string}}) => {
                const clone = JSON.parse(JSON.stringify(record))
                switch (action.type) {
                    case 'update':
                        // additionalのキーかどうか判定
                        if (Object.keys(clone).includes(action.payload.key)) {
                            clone[action.payload.key] = action.payload.value
                        } else {
                            clone.additional[action.payload.key] = action.payload.value
                        }
                        return clone;
                    case 'remove':
                        delete clone[action.payload.key]
                        return clone;
                    default:
                        return clone;
                }
            }
            const [editingRecord, setEtitingRecord] = useReducer(editingRecordReducer, activeRecord);
            return <>
                    <div>{editingRecord.id}</div>
                    <CloudUpload onClick={async () => {
                        await updateRecord(editingRecord);
                        setIsEditing(false);
                    }}/>
                <div className='property-wrapper'>
                    {
                        columns.map(key => {
                            const val = editingRecord[key] || ''
                            return <div className='property-row' key={key}>
                                <div className='property-col'>{key}</div>
                                <input
                                    className='property-col'
                                    value={val}
                                    onChange={(e) => setEtitingRecord({
                                        type: 'update',
                                        payload: {
                                            key: key,
                                            value: e.target.value
                                        }
                                    })}
                                />
                            </div>
                        })
                    }
                    {
                        Object.keys(editingRecord.additional).map(key => {
                            const addtional = editingRecord.additional || '{}'
                            return <div className='property-row' key={key}>
                                <div className='property-col'>{key}</div>
                                <input
                                    className='property-col'
                                    value={addtional[key]}
                                    onChange={(e) => setEtitingRecord({
                                        type: 'update',
                                        payload: {
                                            key: key,
                                            value: e.target.value
                                        }
                                    })}
                                />
                            </div>
                        })
                    }
                </div>
            </>
        }
    
        return <div className='tile-info-wrapper'>
            {!wt?.activeDatalog?
                <div>no active record</div>
            : wt?.activeDatalog && isEditing?
                <EditRecord activeRecord={wt.activeDatalog} />
            :   
                <ViewRecord activeRecord={wt.activeDatalog} />
            }
        </div>
    }
}
