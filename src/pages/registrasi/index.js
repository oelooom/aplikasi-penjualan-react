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

function Registrasi() {

    const classes = useStyles();
    const { auth, user, loading } = useFirebase();

    const [form, setForm] = useState({
        email: '',
        password: '',
        ulangi_password: ''
    })

    const [error, setError] = useState({
        email: '',
        password: '',
        ulangi_password: ''
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

        if (!form.ulangi_password) {
            newError.ulangi_password = 'Ulangi Password Wajib Diisi'
        } else if (form.ulangi_password !== form.password) {
            newError.ulangi_password = 'Ulangi Password Tidak Sama Dengan Password'
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
                await auth.createUserWithEmailAndPassword(form.email, form.password)
            } catch (e) {
                const newError = {};

                switch (e.code) {
                    case 'auth/email-already-in-use':
                        newError.email = 'Email Sudah Terdaftar';
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Email Tidak Valid';
                        break;
                    case 'auth/weak-password':
                        newError.password = 'Password Lemah';
                        break;
                    case 'auth/operation-not-allowed':
                        newError.email = 'Metode Authentikasi Email Tidak Didukung';
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
        return <Redirect to='/' />
    }

    return (
        <Container maxWidth='xs'>
            <Paper className={classes.paper} elevation={3}>
                <Typography variant='h4' className={classes.title}>Buat Akun Baru</Typography>
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
                    <TextField
                        id='ulangi_password'
                        type='password'
                        name='ulangi_password'
                        margin='normal'
                        label='Ulangi Password'
                        value={form.ulangi_password}
                        onChange={handleChange}
                        helperText={error.ulangi_password}
                        error={error.ulangi_password ? true : false}
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
                                Daftar
                        </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                component={Link}
                                to='/login'
                                variant='contained'
                                size='large'
                                disabled={isSubmitting}>
                                Login
                        </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Registrasi;