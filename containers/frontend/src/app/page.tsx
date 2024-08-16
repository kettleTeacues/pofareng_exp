'use client';

import { useState, useEffect } from 'react';
import '@/styles/global.scss';

import { AppBar, Box, Toolbar, Typography, IconButton, Drawer } from '@mui/material';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Menu, Add, CloudUpload } from '@mui/icons-material';

import axiosClient from '@/plugins/axiosClient';
import WorkTile from '@/components/WorkTile';
import type { dashboardResponse, DatasetResponse } from '@/components/types/WorkTile';

const getDashboard = async () => {
    const res = await axiosClient.get('/dashboard');
    console.log(JSON.parse(JSON.stringify(res.data)));
    return res.data;
}
const getDatasetAll = async (datasetNames: string[]) => {
    // datasetsを取得
    const promises = datasetNames.map(name => getDataset(name));
    const promisesRes = await Promise.all(promises);
    console.log('getDatasetAll()', promisesRes)
    return promisesRes;
}
const getDataset = async (datasetName?: string): Promise<DatasetResponse> => {
    let url = '/datalog';
    if (datasetName) {
        url += `?dataset=${datasetName}`;
    }
    const res = await axiosClient.get(url);
    return res.data;
}
const page = () => {
    const [open, setOpen] = useState(false);
    const [dashboardList, setDashboardList] = useState<dashboardResponse[]>([]);
    const [wt, setWt] = useState<WorkTile>();
    const [dialogOpen, setDialogOpen] = useState(false);

    const changeWorktile = (id: string | undefined) => {
        const newDashboard = dashboardList.find(dashboard => dashboard.id == id);
        let newWt = undefined;

        if (id && newDashboard) {
            newWt = new WorkTile(JSON.parse(JSON.stringify(newDashboard)));
        } else {
            newWt = new WorkTile(JSON.parse(JSON.stringify(dashboardList[0])));
        }
        setWt(newWt);
    };
    const saveDashboard = () => {
        if (!wt) return;
        const data = wt.toJson()

        // ローカルのダッシュボードを更新
        dashboardList.forEach(dashboard => {
            if (dashboard.id == wt.id) {
                Object.assign(dashboard, data);
            }
        });

        // DBを更新
        axiosClient.put('dashboard', [data])
    }

    // useEffect
    useEffect(() => {
        getDashboard().then(async (res: dashboardResponse[]) => {
            setDashboardList(JSON.parse(JSON.stringify(res)));

            // datasetsを取得
            const datasetNames = res[0].datasets.map(dataset => dataset.refDatasetId || '');
            const remoteDatasets = await getDatasetAll(datasetNames);
            // 取得したデータセットをダッシュボードにマージ
            res[0].datasets.forEach(dataset => {
                const remoteDataset = remoteDatasets.find(ds => ds.dataset.id == dataset.refDatasetId);
                if (remoteDataset) {
                    dataset.records = remoteDataset.records
                }
            });

            // wtを初期化
            const wt = new WorkTile(res.length? JSON.parse(JSON.stringify(res[0])): 'new');
            setWt(wt);
        });
    }, []);

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpen(!open)}>
            <List>
                {dashboardList.map((dashboard, index) => (
                    <ListItem key={dashboard.id} disablePadding>
                        <ListItemButton onClick={() => changeWorktile(dashboard.id)}>
                            <ListItemText primary={dashboard.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
    return <>
        <Box>
            <AppBar>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setOpen(!open)}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <span onClick={() => console.log(wt)}>{ wt?.title }</span>
                    </Typography>
                    <IconButton color="inherit" onClick={() => saveDashboard()}>
                        <CloudUpload />
                    </IconButton>
                    <IconButton color="inherit" onClick={() => setDialogOpen(true)}>
                        <Add />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
        <Drawer open={open} onClose={() => setOpen(!open)}>
            {DrawerList}
        </Drawer>

        {wt &&
            <>
                <wt.Worktile />
                <wt.ComponentLauncher
                    id=''
                    isOpen={dialogOpen}
                    setOpen={setDialogOpen}
                />
            </>
        }
    </>;
}
export default page;
