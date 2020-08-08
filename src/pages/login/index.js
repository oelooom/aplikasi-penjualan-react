import React, { useState } from 'react';
import { Button, Container, Paper, Typography, TextField, Grid } from '@material-ui/core';

// import styles
import useStyles from './styles';

// Import React Router Dom
import { Link, Redirect } from 'react-router-dom';

// Validator
import isEmail from 'validator/lib/isEmail';

// Firebase Hooks
import { useFirebase } from '../../components/FirebaseProvider';

// Component
import AppLoading from '../../components/AppLoading';

function Login(props) {

    const { location } = props;
    const classes = useStyles();
    const { auth, user, loading } = useFirebase();

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const [error, setError] = useState({
        email: '',
        password: ''
    })

    const [isSubmitting, setSubmitting] = useState(false);


    // Event Handler
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })

        setError({
            ...error,
            [e.target.name]: ''
        })
    }

    const validate = () => {
        const newError = { ...error };

        if (!form.email) {
            newError.email = 'Email Wajib Diisi'
        } else if (!isEmail(form.email)) {
            newError.email = 'Email Tidak Valid'
        }

        if (!form.password) {
            newError.password = 'Password Wajib Diisi'
        }

        return newError;
    }

    const handleSubmit = async e => {
        e.preventDefault();

        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors)
        } else {
            try {
                setSubmitting(true);
                await auth.signInWithEmailAndPassword(form.email, form.password)
            } catch (e) {
                const newError = {};

                switch (e.code) {
                    case 'auth/user-not-found':
                        newError.email = 'Email Tidak Terdaftar';
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Email Tidak Valid';
                        break;
                    case 'auth/wrong-password':
                        newError.password = 'Password Salah';
                        break;
                    case 'auth/user-disabled':
                        newError.email = 'User Dinonaktifkan, Silahkan Hubungi Admin';
                        break;
                    default:
                        newError.email = 'Terjadi Kesalahan, Silahkan Coba Lagi';
                }

                setError(newError);
                setSubmitting(false);
            }
        }

    }

    if (loading) {
        return <AppLoading />
    }

    if (user) {
        const redirectTo = location.state && location.state.from && location.state.from.pathname
            ? location.state.from.pathname
            : '/';
        return <Redirect to={redirectTo} />
    }

    return (
        <Container maxWidth='xs'>
            <Paper className={classes.paper} elevation={3}>
                <Typography variant='h4' className={classes.title}>Login Akun</Typography>
                <form noValidate onSubmit={handleSubmit}>
                    <TextField
                        id='email'
                        type='email'
                        name='email'
                        margin='normal'
                        label='Alamat Email'
                        value={form.email}
                        onChange={handleChange}
                        helperText={error.email}
                        error={error.email ? true : false}
                        disabled={isSubmitting}
                        fullWidth
                        required
                    />
                    <TextField
                        id='password'
                        type='password'
                        name='password'
                        margin='normal'
                        label='Password'
                        value={form.password}
                        onChange={handleChange}
                        helperText={error.password}
                        error={error.password ? true : false}
                        disabled={isSubmitting}
                        fullWidth
                        required
                    />

                    <Grid container className={classes.buttonGroup}>
                        <Grid item xs>
                            <Button
                                type='submit'
                                color='primary'
                                variant='contained'
                                size='large'
                                disabled={isSubmitting}>
                                Login
                        </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                component={Link}
                                to='/registrasi'
                                variant='contained'
                                size='large'
                                disabled={isSubmitting}>
                                Register
                        </Button>
                        </Grid>
                    </Grid>

                    <div className={classes.forgotPassword}>
                        <Typography component={Link} to='/lupa-password'>
                            Lupa Password?
                        </Typography>
                    </div>
                </form>
            </Paper>
        </Container>
    )
}

export default Login;