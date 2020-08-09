import React, { useRef, useState } from 'react';
import { useFirebase } from '../../../components/FirebaseProvider';
import { useSnackbar } from 'notistack';
import isEmail from 'validator/lib/isEmail';

// Material UI
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useStyles from './styles/pengguna';
import { Typography } from '@material-ui/core';

const Pengguna = () => {

    const { user } = useFirebase();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState({
        displayName: '',
        email: ''
    })

    const displayNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const saveDisplayName = async e => {

        const displayName = displayNameRef.current.value;

        if (!displayName) {
            setError({
                displayName: 'Nama Wajib Diisi'
            })
        } else if (displayName !== user.displayName) {
            setError({
                displayName: ''
            })
            setSubmitting(true);
            await user.updateProfile({ displayName });
            setSubmitting(false);
            enqueueSnackbar('Data Pengguna Berhasil Diperbarui', { variant: 'success' });
        }
    }


    const saveEmail = async e => {

        const email = emailRef.current.value;

        if (!email) {
            setError({
                email: 'Email Wajib Diisi'
            })
        }
        else if (!isEmail(email)) {
            setError({
                email: 'Email Tidak Valid'
            })
        }
        else if (email !== user.email) {

            try {
                setError({
                    email: '',
                })
                setSubmitting(true);
                await user.updateEmail(email);
                setSubmitting(false);
                enqueueSnackbar('Email Berhasil Diperbarui', { variant: 'success' });
            } catch (e) {

                let emailError = '';

                switch (e.code) {
                    case 'auth/email-already-in-use':
                        emailError = 'Email Sudah Didaftarkan Oleh pengguna Lain';
                        break;
                    case 'auth/invalid-email':
                        emailError = 'Email Tidak Valid';
                        break;
                    case 'auth/requires-recent-login':
                        emailError = 'Terjadi kesalahan, Silahkan Logout dan Login kembali';
                        break;
                    default:
                        emailError = 'Terjadi Kesalahan, Silahkan ulangi lagi';
                }

                setError({ email: emailError })
                setSubmitting(false);

            }
        }
    }

    const sendEmailVerification = async e => {
        const actionCodeSetting = {
            url: `${window.location.origin}/login`
        }

        setSubmitting(true);
        await user.sendEmailVerification(actionCodeSetting);
        enqueueSnackbar(`Email verifikasi telah dikirim ke ${emailRef.current.value}`, { variant: 'success' })
        setSubmitting(false);
    }

    const savePassword = async e => {

        const password = passwordRef.current.value;

        if (!password) {
            setError({
                password: 'password Wajib Diisi'
            })
        }
        else if (password !== user.password) {

            try {
                setError({
                    password: '',
                })
                setSubmitting(true);
                await user.updatePassword(password);
                setSubmitting(false);
                enqueueSnackbar('Password Berhasil Diperbarui', { variant: 'success' });
            } catch (e) {

                let passwordError = '';

                switch (e.code) {
                    case 'auth/weak-password':
                        passwordError = 'Password Terlalu Lemah';
                        break;
                    case 'auth/requires-recent-login':
                        passwordError = 'Terjadi kesalahan, Silahkan Logout dan Login kembali';
                        break;
                    default:
                        passwordError = 'Terjadi Kesalahan, Silahkan ulangi lagi';
                }

                setError({ password: passwordError })
                setSubmitting(false);
            }
        }
    }

    return (
        <div className={classes.pengaturanPengguna}>
            <TextField
                id='displayName'
                name='displayName'
                label='Nama'
                margin='normal'
                defaultValue={user.displayName}
                inputProps={{
                    ref: displayNameRef,
                    onBlur: saveDisplayName
                }}
                disabled={isSubmitting}
                error={error.displayName ? true : false}
                helperText={error.displayName}
            />

            <TextField
                id='email'
                name='email'
                label='Email'
                defaultValue={user.email}
                inputProps={{
                    ref: emailRef,
                    onBlur: saveEmail
                }}
                disabled={isSubmitting}
                margin='normal'
                error={error.email ? true : false}
                helperText={error.email}
            />

            {
                user.emailVerified
                    ? <Typography color='primary'>Email Sudah Terverifikasi</Typography>
                    : <Button
                        variant='outline'
                        onClick={sendEmailVerification}
                        disabled={isSubmitting}>
                        Kirim Email Kerifikasi
                    </Button>
            }

            <TextField
                id='password'
                name='password'
                label='Password Baru'
                type='password'
                defaultValue={user.password}
                inputProps={{
                    ref: passwordRef,
                    onBlur: savePassword
                }}
                autoComplete='new-password'
                disabled={isSubmitting}
                margin='normal'
                error={error.password ? true : false}
                helperText={error.password}
            />

        </div>
    )
}

export default Pengguna;