import { useEffect, useState } from 'react';

import { Box, Tabs, Tab } from '@mui/material';
import { Table as MuiTable,TableBody, TableCell, TableContainer, TableHead, TableRow, Paper }from '@mui/material';

import '@/components/styles/datamanager.scss';
import type WorkTile from './WorkTile';
import { BaseInnerComponent, TileStates, DatasetResponse } from './types/WorkTile';

export class Table extends BaseInnerComponent {
    constructor() {
        super();
        this.Component = this.Component.bind(this);
    };

    Component = ({wt, tile}: {wt?: WorkTile, tile?: TileStates}) => {
        if (!wt || !tile) { return <div>no active tile</div>; }

        const [recordKeys, setRecordKeys] = useState<string[]>(['start_datetime', 'end_datetime', 'event', 'additional']);
        const [tabId, setTabId] = useState(0);
        const [datasets, setDataset] = useState<DummyDataset[]>(dummyDataset);
        
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
                                            recordKeys.map(key => {
                                                return <TableCell key={key}>{key}</TableCell>
                                            })
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        dataset.records.map((record, i: number) => {
                                            return <TableRow key={i}>
                                                {
                                                    recordKeys.map(key => {
                                                        if (key.includes('Date')) {
                                                            return <TableCell key={key}>{wt.toDateString(record.datalog[key] || '')}</TableCell>
                                                        } else {
                                                            return <TableCell key={key}>{record.datalog[key]}</TableCell>
                                                        }
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
        const [dataRecord, setDataRecord] = useState<DummyDetail | undefined>(dummyDetail);
        const columns = ['id', 'event', 'start_datetime', 'end_datetime', 'updated_at', 'updated_by', 'created_at', 'created_by_id']
    
        return <div className='tile-info-wrapper'>
            <div className='property-wrapper'>
                {dataRecord?
                    columns.map(key => {
                        return <div className='property-row' key={key}>
                            <div className='property-col'>{key}</div>
                            <div className='property-col'>{dataRecord.datalog[key]}</div>
                        </div>
                    })
                :
                    <div>no active tile</div>
                }
                {dataRecord?
                    Object.keys(JSON.parse(dataRecord.datalog.additional)).map(key => {
                        return <div className='property-row' key={key}>
                            <div className='property-col'>{key}</div>
                            <div className='property-col'>{JSON.parse(dataRecord.datalog.additional)[key]}</div>
                        </div>
                    })
                :
                    <div />
                }
            </div>
        </div>
    }
}

interface DummyDetail {
    datalog: {
        id: string;
        event: string;
        additional: string;
        start_datetime: string;
        end_datetime: string;
        updated_at: string | null;
        updated_by: string | null;
        created_at: string;
        created_by_id: string;
        [k: string]: string | null;
    }
    logColor: string | null
}
const dummyDetail = {
    "datalog": {
        "id": "nikke0000000000000000000000000000001",
        "event": "ドレイク",
        "additional": "{\"reality\":\"SSR\",\"weapon\":\"ショットガン\",\"attack_type\":\"灼熱\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
        "start_datetime": "2024-01-01T10:00:00+09:00",
        "end_datetime": "2024-01-01T20:00:00+09:00",
        "updated_at": "2024-01-01T10:00:00+09:00",
        "updated_by": null,
        "created_at": "2024-01-01T10:00:00+09:00",
        "created_by_id": "user10_use"
    },
    "logColor": null
}
interface DummyDataset {
    dataset: {
        id: string;
        name: string;
        description: string;
        created_by_id: string;
    }
    records: {
        datalog: {
            id: string;
            event: string;
            additional: string;
            start_datetime: string;
            end_datetime: string;
            updated_at: string | null;
            updated_by: string | null;
            created_at: string;
            created_by_id: string;
            [k: string]: string | null;
        }
        logColor: string | null
    }[];
}
const dummyDataset: DummyDataset[] = [{
    "dataset": {
        "id": "ds0000000000000000000000000000000002",
        "name": "nikke_characters",
        "description": "nikke characters dataset",
        "created_by_id": "user10_use"
    },
    "records": [
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000001",
                "event": "ドレイク",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ショットガン\",\"attack_type\":\"灼熱\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000002",
                "event": "マクスウェル",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"鉄甲\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000003",
                "event": "ジュリア",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"鉄甲\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000004",
                "event": "ユニ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ランチャー\",\"attack_type\":\"灼熱\",\"battle_type\":\"防御型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000005",
                "event": "アドミ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"風圧\",\"battle_type\":\"支援型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000006",
                "event": "シグナル",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"灼熱\",\"battle_type\":\"火力型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000007",
                "event": "ミランダ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"灼熱\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000008",
                "event": "ディーゼル",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"マシンガン\",\"attack_type\":\"風圧\",\"battle_type\":\"防御型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000009",
                "event": "エマ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"マシンガン\",\"attack_type\":\"灼熱\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000010",
                "event": "ウンファ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"灼熱\",\"battle_type\":\"火力型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000011",
                "event": "プリバティ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"水冷\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000012",
                "event": "ギロチン",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"マシンガン\",\"attack_type\":\"電撃\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000013",
                "event": "メアリー",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ショットガン\",\"attack_type\":\"水冷\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000014",
                "event": "シュガー",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ショットガン\",\"attack_type\":\"鉄甲\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000015",
                "event": "プリム",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"鉄甲\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000016",
                "event": "ルドミラ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"水冷\",\"battle_type\":\"防御型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000017",
                "event": "アリス",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"灼熱\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000018",
                "event": "エクシア",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"電撃\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000019",
                "event": "エピネル",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"風圧\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000020",
                "event": "スノーホワイト",
                "additional": "{\"reality\":\"PILGRIM\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"鉄甲\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000021",
                "event": "紅蓮",
                "additional": "{\"reality\":\"PILGRIM\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"電撃\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000022",
                "event": "ノア",
                "additional": "{\"reality\":\"PILGRIM\",\"weapon\":\"ランチャー\",\"attack_type\":\"風圧\",\"battle_type\":\"防御型\",\"burst\":\"2\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000023",
                "event": "クロウ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"灼熱\",\"battle_type\":\"防御型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000024",
                "event": "ポリ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ショットガン\",\"attack_type\":\"水冷\",\"battle_type\":\"防御型\",\"burst\":\"2\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000025",
                "event": "ソリン",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"鉄甲\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000026",
                "event": "アリア",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"マシンガン\",\"attack_type\":\"水冷\",\"battle_type\":\"火力型\",\"burst\":\"2\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000027",
                "event": "ヤン",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ランチャー\",\"attack_type\":\"灼熱\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000028",
                "event": "ブリッド",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"水冷\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000029",
                "event": "センチ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ランチャー\",\"attack_type\":\"鉄甲\",\"battle_type\":\"防御型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000030",
                "event": "ハラン",
                "additional": "{\"reality\":\"PILGRIM\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"電撃\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000031",
                "event": "ボリューム",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"風圧\",\"battle_type\":\"火力型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000032",
                "event": "ノイズ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ランチャー\",\"attack_type\":\"電撃\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000033",
                "event": "ラプンツェル",
                "additional": "{\"reality\":\"PILGRIM\",\"weapon\":\"ランチャー\",\"attack_type\":\"鉄甲\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"60\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000034",
                "event": "ミルク",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"水冷\",\"battle_type\":\"火力型\",\"burst\":\"1\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000035",
                "event": "ペッパー",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ショットガン\",\"attack_type\":\"風圧\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000036",
                "event": "ベスティー",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ランチャー\",\"attack_type\":\"水冷\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000037",
                "event": "リター",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"鉄甲\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000038",
                "event": "ユルハ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"灼熱\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000039",
                "event": "メイデン",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ショットガン\",\"attack_type\":\"電撃\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000040",
                "event": "ノベル",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"鉄甲\",\"battle_type\":\"防御型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000041",
                "event": "フォルクヴァン",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"水冷\",\"battle_type\":\"防御型\",\"burst\":\"2\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000042",
                "event": "ルピー",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"鉄甲\",\"battle_type\":\"火力型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000043",
                "event": "イサベル",
                "additional": "{\"reality\":\"PILGRIM\",\"weapon\":\"ショットガン\",\"attack_type\":\"電撃\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000044",
                "event": "ドラー",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"風圧\",\"battle_type\":\"支援型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000045",
                "event": "ヘルム",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"水冷\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000046",
                "event": "ラプラス",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ランチャー\",\"attack_type\":\"鉄甲\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000047",
                "event": "ルピー：ウィンターショッパー",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"電撃\",\"battle_type\":\"防御型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000048",
                "event": "エヌ：ミラクルフェアリー",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ランチャー\",\"attack_type\":\"風圧\",\"battle_type\":\"支援型\",\"burst\":\"2\",\"cool_tile\":\"60\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000049",
                "event": "モダニア",
                "additional": "{\"reality\":\"PILGRIM\",\"weapon\":\"マシンガン\",\"attack_type\":\"灼熱\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000050",
                "event": "ジャッカル",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ランチャー\",\"attack_type\":\"鉄甲\",\"battle_type\":\"防御型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000051",
                "event": "バイパー",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ショットガン\",\"attack_type\":\"水冷\",\"battle_type\":\"火力型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000052",
                "event": "ギルティ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ショットガン\",\"attack_type\":\"風圧\",\"battle_type\":\"火力型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000053",
                "event": "クエンシー",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"電撃\",\"battle_type\":\"支援型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000054",
                "event": "シン",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"電撃\",\"battle_type\":\"防御型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000055",
                "event": "ココア",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"灼熱\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000056",
                "event": "ソーダ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"マシンガン\",\"attack_type\":\"灼熱\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000057",
                "event": "マキマ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"水冷\",\"battle_type\":\"防御型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000058",
                "event": "パワー",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ランチャー\",\"attack_type\":\"灼熱\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000059",
                "event": "N102",
                "additional": "{\"reality\":\"SR\",\"weapon\":\"ランチャー\",\"attack_type\":\"水冷\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000060",
                "event": "ネオン",
                "additional": "{\"reality\":\"SR\",\"weapon\":\"ショットガン\",\"attack_type\":\"灼熱\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000061",
                "event": "ラピ",
                "additional": "{\"reality\":\"SR\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"灼熱\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000062",
                "event": "ミハラ",
                "additional": "{\"reality\":\"SR\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"水冷\",\"battle_type\":\"防御型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000063",
                "event": "デルタ",
                "additional": "{\"reality\":\"SR\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"風圧\",\"battle_type\":\"防御型\",\"burst\":\"2\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000064",
                "event": "ミカ",
                "additional": "{\"reality\":\"SR\",\"weapon\":\"ランチャー\",\"attack_type\":\"風圧\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000065",
                "event": "ベロータ",
                "additional": "{\"reality\":\"SR\",\"weapon\":\"ランチャー\",\"attack_type\":\"電撃\",\"battle_type\":\"火力型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000066",
                "event": "アニス",
                "additional": "{\"reality\":\"SR\",\"weapon\":\"ランチャー\",\"attack_type\":\"鉄甲\",\"battle_type\":\"防御型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000067",
                "event": "エーテル",
                "additional": "{\"reality\":\"SR\",\"weapon\":\"ショットガン\",\"attack_type\":\"電撃\",\"battle_type\":\"防御型\",\"burst\":\"1\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000068",
                "event": "ネヴェ",
                "additional": "{\"reality\":\"SR\",\"weapon\":\"ショットガン\",\"attack_type\":\"水冷\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000069",
                "event": "姫野",
                "additional": "{\"reality\":\"SR\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"風圧\",\"battle_type\":\"支援型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000070",
                "event": "ソルジャーO.W.",
                "additional": "{\"reality\":\"R\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"灼熱\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000071",
                "event": "ソルジャーE.G.",
                "additional": "{\"reality\":\"R\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"電撃\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000072",
                "event": "ソルジャーF.A.",
                "additional": "{\"reality\":\"R\",\"weapon\":\"ショットガン\",\"attack_type\":\"鉄甲\",\"battle_type\":\"防御型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000073",
                "event": "I-DOLL・オーシャン",
                "additional": "{\"reality\":\"R\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"水冷\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000074",
                "event": "I-DOLL・フラワー",
                "additional": "{\"reality\":\"R\",\"weapon\":\"ランチャー\",\"attack_type\":\"風圧\",\"battle_type\":\"防御型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000075",
                "event": "I-DOLL・サン",
                "additional": "{\"reality\":\"R\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"鉄甲\",\"battle_type\":\"支援型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000076",
                "event": "プロダクト08",
                "additional": "{\"reality\":\"R\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"電撃\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000077",
                "event": "プロダクト12",
                "additional": "{\"reality\":\"R\",\"weapon\":\"マシンガン\",\"attack_type\":\"灼熱\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000078",
                "event": "プロダクト23",
                "additional": "{\"reality\":\"R\",\"weapon\":\"ショットガン\",\"attack_type\":\"風圧\",\"battle_type\":\"支援型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000079",
                "event": "アンカー",
                "additional": "{\"reality\":\"SR\",\"weapon\":\"ランチャー\",\"attack_type\":\"風圧\",\"battle_type\":\"防御型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000080",
                "event": "ヘルムアクアマリン",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"鉄甲\",\"battle_type\":\"火力型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000081",
                "event": "アニススパークリングサマー",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ショットガン\",\"attack_type\":\"電撃\",\"battle_type\":\"支援型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000082",
                "event": "マスト",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"電撃\",\"battle_type\":\"支援型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000083",
                "event": "ネロ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"灼熱\",\"battle_type\":\"防御型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000084",
                "event": "ネオンブルーオーシャン",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"マシンガン\",\"attack_type\":\"水冷\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000085",
                "event": "メアリーベイゴッデス",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"水冷\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000086",
                "event": "ロザンナ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"マシンガン\",\"attack_type\":\"電撃\",\"battle_type\":\"火力型\",\"burst\":\"1\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000087",
                "event": "ノワール",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ショットガン\",\"attack_type\":\"風圧\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000088",
                "event": "ブラン",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"風圧\",\"battle_type\":\"防御型\",\"burst\":\"2\",\"cool_tile\":\"60\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000089",
                "event": "ライ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"水冷\",\"battle_type\":\"防御型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000090",
                "event": "ドロシー",
                "additional": "{\"reality\":\"PILGRIM\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"水冷\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000091",
                "event": "D",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"サブマシンガン\",\"attack_type\":\"風圧\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000092",
                "event": "サクラ",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"灼熱\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000093",
                "event": "ニヒリスター",
                "additional": "{\"reality\":\"PILGRIM\",\"weapon\":\"スナイパーライフル\",\"attack_type\":\"灼熱\",\"battle_type\":\"火力型\",\"burst\":\"2\",\"cool_tile\":\"20\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000094",
                "event": "ビスケット",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ランチャー\",\"attack_type\":\"電撃\",\"battle_type\":\"支援型\",\"burst\":\"2\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000095",
                "event": "パスカル",
                "additional": "{\"reality\":\"SR\",\"weapon\":\"ランチャー\",\"attack_type\":\"鉄甲\",\"battle_type\":\"支援型\",\"burst\":\"1\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000096",
                "event": "A2",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"ランチャー\",\"attack_type\":\"灼熱\",\"battle_type\":\"火力型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        },
        {
            "datalog": {
                "id": "nikke0000000000000000000000000000097",
                "event": "2B",
                "additional": "{\"reality\":\"SSR\",\"weapon\":\"アサルトライフル\",\"attack_type\":\"灼熱\",\"battle_type\":\"防御型\",\"burst\":\"3\",\"cool_tile\":\"40\"}",
                "start_datetime": "2024-01-01T10:00:00+09:00",
                "end_datetime": "2024-01-01T20:00:00+09:00",
                "updated_at": "2024-01-01T10:00:00+09:00",
                "updated_by": null,
                "created_at": "2024-01-01T10:00:00+09:00",
                "created_by_id": "user10_use"
            },
            "logColor": null
        }
    ]
}]
