'use client';

import { useState, useEffect } from 'react';
import '@/styles/global.scss';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Inbox, Mail, Menu, Add, Dashboard, CloudUpload } from '@mui/icons-material';

import axiosClient from '@/plugins/axiosClient';
import WorkTile from '@/components/WorkTile';
import type { dashboardResponse } from '@/components/types/WorkTile';
import { json } from 'stream/consumers';

const getDashboard = async () => {
    const res = await axiosClient.get('/dashboard');
    console.log(JSON.parse(JSON.stringify(res.data)));
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
