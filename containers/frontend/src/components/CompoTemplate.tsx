import { useEffect, useState } from 'react';

import { Typography, Menu, MenuItem } from '@mui/material';

import '@/components/styles/datamanager.scss';
import type WorkTile from './WorkTile';
import { BaseInnerComponent, TileStates } from './types/WorkTile';

export class CompoTemplate extends BaseInnerComponent {
    constructor() {
        super();
        this.Component = this.Component.bind(this);
    };

    Component = ({wt, tile}: {wt?: WorkTile, tile?: TileStates}) => {
        return <div className=''>
            <Typography>this is template component</Typography>
        </div>
    }
    
    AdditionalHeader = () => {
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
        const openMenu = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
        };
        const closeMenu = () => {
            setAnchorEl(null);
        };

        return <>
            <div className='menu' onClick={openMenu}>
                addtional
            </div>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
            >
                <MenuItem key={'0'}>
                    addtional1
                </MenuItem>
            </Menu>
        </>
    };
}
