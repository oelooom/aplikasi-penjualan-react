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

function App() {
  return (
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
  );
}

export default App;
