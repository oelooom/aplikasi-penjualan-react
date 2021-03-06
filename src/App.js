import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

// Halaman
import Registrasi from './pages/registrasi/index';
import Login from './pages/login/index';
import LupaPassword from './pages/lupa-password/index';
import NotFound from './pages/404';
import Private from './pages/private';
import PrivateRoute from './components/PrivateRoute';
import FirebaseProvider from './components/FirebaseProvider';

// Komponen Material UI
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import theme from './config/theme';

// Notistack
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
            <FirebaseProvider>
              <Router>
                <Switch>
                  <PrivateRoute exact path='/' component={Private} />
                  <PrivateRoute path='/pengaturan' component={Private} />
                  <PrivateRoute path='/produk' component={Private} />
                  <PrivateRoute path='/transaksi' component={Private} />
                  <Route path='/registrasi' component={Registrasi} />
                  <Route path='/login' component={Login} />
                  <Route path='/lupa-password' component={LupaPassword} />
                  <Route component={NotFound} />
                </Switch>
              </Router>
            </FirebaseProvider>
          </SnackbarProvider>
        </CssBaseline>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
