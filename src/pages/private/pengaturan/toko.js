import React from 'react';
import useStyles from './styles/toko';
import { TextField, Button } from '@material-ui/core';
import { useFirebase } from '../../../components/FirebaseProvider';
import { useSnackbar } from 'notistack';
import { useDocument } from 'react-firebase-hooks/firestore';
import AppPageLoading from '../../../components/AppPageLoading'

// Validator
import isURL from 'validator/lib/isURL';

// React Router
import { Prompt } from 'react-router-dom';

const Toko = () => {

    const classes = useStyles();
    const { firestore, user } = useFirebase();
    const tokoDoc = firestore.doc(`toko/${user.uid}`);
    const [snapshot, loading] = useDocument(tokoDoc);
    const { enqueueSnackbar } = useSnackbar();
    const [isSubmitting, setSubmitting] = React.useState(false);
    const [isSomethingChange, setSomethingChange] = React.useState(false);
    const [form, setForm] = React.useState({
        nama: '',
        alamat: '',
        telepon: '',
        website: ''
    })

    const [error, setError] = React.useState({
        nama: '',
        alamat: '',
        telepon: '',
        website: ''
    })

    React.useEffect(() => {
        if (snapshot) {
            setForm(snapshot.data())
        }
    }, [snapshot])

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        setError({
            [e.target.name]: ''
        })

        setSomethingChange(true);
    }

    const validate = () => {

        const newError = { ...error };

        if (!form.nama) {
            newError.nama = 'Nama Tidak Boleh Kosong'
        }
        if (!form.alamat) {
            newError.alamat = 'Alamat Tidak Boleh Kosong'
        }
        if (!form.telepon) {
            newError.telepon = 'Telepon Tidak Boleh Kosong'
        }
        if (!form.website) {
            newError.website = 'Website Tidak Boleh Kosong'
        } else if (!isURL(form.website)) {
            newError.website = 'URL Website Tidak Valid'

        }

        return newError;

    }

    const handleSubmit = async e => {
        e.preventDefault();

        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors)
        }
        else {
            try {
                setSubmitting(true);
                await tokoDoc.set(form, { merge: true })
                setSomethingChange(false);
                enqueueSnackbar('Data toko berhasil diupdate', { variant: 'success' })
            } catch (e) {
                console.log(e.message);
            }
        }
        setSubmitting(false);

    }

    if (loading) {
        return (
            <AppPageLoading />
        )
    }

    return (
        <div className={classes.pengaturanToko}>
            <form onSubmit={handleSubmit} noValidate>
                <TextField
                    id='nama'
                    name='nama'
                    label='Nama Toko'
                    margin='normal'
                    fullWidth
                    value={form.nama}
                    onChange={handleChange}
                    error={error.nama ? true : false}
                    helperText={error.nama}
                    disabled={isSubmitting}
                    required
                />
                <TextField
                    id='alamat'
                    name='alamat'
                    label='Alamat Toko'
                    margin='normal'
                    fullWidth
                    multiline
                    rowsMax={3}
                    value={form.alamat}
                    onChange={handleChange}
                    error={error.alamat ? true : false}
                    helperText={error.alamat}
                    disabled={isSubmitting}
                    required
                />
                <TextField
                    id='website'
                    name='website'
                    label='Website Toko'
                    margin='normal'
                    fullWidth
                    value={form.website}
                    onChange={handleChange}
                    error={error.website ? true : false}
                    helperText={error.website}
                    disabled={isSubmitting}
                    required
                />
                <TextField
                    id='telepon'
                    name='telepon'
                    label='Telepon Toko'
                    margin='normal'
                    fullWidth
                    value={form.telepon}
                    onChange={handleChange}
                    error={error.telepon ? true : false}
                    helperText={error.telepon}
                    disabled={isSubmitting}
                    required
                />

                <Button
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={isSubmitting || !isSomethingChange}
                    className={classes.actionButton}>
                    Simpan
                </Button>
            </form>

            <Prompt
                when={isSomethingChange}
                message='Terdapat perubahan pada form toko, apakah anda yakin akan meninggalkan halaman tanpa menyelesaikannya terlebih dahulu?'
            />

        </div>
    )
}

export default Toko;