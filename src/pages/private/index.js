import React from 'react';
import useStyles from './styles';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SignOutIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import StoreIcon from '@material-ui/icons/Store';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SettingIcon from '@material-ui/icons/Settings';

// React Router DOM
import { Switch, Route } from 'react-router-dom';

// Komponen Halaman Private
import Pengaturan from './pengaturan';
import Produk from './produk';
import Transaksi from './transaksi';
import Home from './home';

// Firebase Hooks
import { useFirebase } from '../../components/FirebaseProvider';


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}



export default function Private() {
    const classes = useStyles();
    const { auth } = useFirebase();
    const [open, setOpen] = React.useState(true);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        <Switch>
                            <Route exact path='/' children='Home' />
                            <Route path='/produk' children='Produk' />
                            <Route path='/transaksi' children='Transaksi' />
                            <Route path='/pengaturan' children='Pengaturan' />
                        </Switch>
                    </Typography>
                    <IconButton color="inherit" onClick={() => auth.signOut()}>
                        <Badge color="secondary">
                            <SignOutIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <Typography variant='h5' className={classes.toolbarIconText}>Aplikasi Toko</Typography>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <Route exact path='/' children={({ match, history }) => {
                        return (<ListItem button selected={match ? true : false} onClick={() => history.push('/')}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary='Home' />
                        </ListItem>)
                    }} />
                    <Route exact path='/produk' children={({ match, history }) => {
                        return (<ListItem button selected={match ? true : false} onClick={() => history.push('/produk')}>
                            <ListItemIcon>
                                <StoreIcon />
                            </ListItemIcon>
                            <ListItemText primary='Produk' />
                        </ListItem>)
                    }} />
                    <Route exact path='/transaksi' children={({ match, history }) => {
                        return (<ListItem button selected={match ? true : false} onClick={() => history.push('/transaksi')}>
                            <ListItemIcon>
                                <ShoppingCartIcon />
                            </ListItemIcon>
                            <ListItemText primary='Transaksi' />
                        </ListItem>)
                    }} />
                    <Route path='/pengaturan' children={({ match, history }) => {
                        return (<ListItem button selected={match ? true : false} onClick={() => history.push('/pengaturan')}>
                            <ListItemIcon>
                                <SettingIcon />
                            </ListItemIcon>
                            <ListItemText primary='Pengaturan' />
                        </ListItem>)
                    }} />
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Switch>
                        <Route path='/pengaturan' component={Pengaturan} />
                        <Route path='/produk' component={Produk} />
                        <Route path='/transaksi' component={Transaksi} />
                        <Route component={Home} />
                    </Switch>
                    <Box pt={4}>
                        <Copyright />
                    </Box>
                </Container>
            </main>
        </div>
    );
}