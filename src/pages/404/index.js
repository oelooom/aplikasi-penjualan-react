import React from 'react';

// Material UI
import { Container, Paper, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import useStyles from './styles';


const NotFound = () => {

    const classes = useStyles();

    return (
        <Container maxWidth='xs'>
            <Paper elevation='3' className={classes.paper}>
                <Typography variant='subtitle1'>
                    Halaman Tidak Ditemukan
                </Typography>
                <Typography variant='h3'>
                    404
                </Typography>
                <Typography component={Link} to='/'>
                    Kembali Ke Beranda
                </Typography>
            </Paper>
        </Container>
    )
}

export default NotFound;