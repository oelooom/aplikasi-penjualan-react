import React, { useState } from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import useStyles from './styles/grid';
import AddDialog from './add';

const GridProduk = () => {

    const classes = useStyles();
    const [openAddDialod, setAddDialog] = useState(false);
    return (
        <React.Fragment>

            <Fab className={classes.fab} color='primary' onClick={() => setAddDialog(true)} >
                <AddIcon />
            </Fab>

            <AddDialog open={openAddDialod} handleClose={() => setAddDialog(false)} />

        </React.Fragment>
    )
}

export default GridProduk;