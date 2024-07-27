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
import { Inbox, Mail, Menu, Add } from '@mui/icons-material';

import axiosClient from '@/plugins/axiosClient';
import WorkTile from '@/components/WorkTile';

const getDashboard = async () => {
    const res = await axiosClient.get('/dashboard');
    console.log(res.data);
    return res.data;
}
const page = () => {
    const [open, setOpen] = useState(false);
    const [dashboardList, setDashboardList] = useState<string[]>([]);
    const [wt, setWt] = useState<WorkTile>();
    const [dialogOpen, setDialogOpen] = useState(false);

    // useEffect
    useEffect(() => {
        getDashboard().then(async (res) => {
            setDashboardList(res.map((dashboard: {[key: string ]: string}) => dashboard.title))

            const wt = new WorkTile({
                name: 'my work tile',
                tiles: res.length? res[0].json_data: [],
            });
            setWt(wt);
        });
    }, []);

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpen(!open)}>
            <List>
                {dashboardList.map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <Inbox /> : <Mail />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
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
                        <span onClick={() => console.log(wt)}>{ wt?.name }</span>
                    </Typography>
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
