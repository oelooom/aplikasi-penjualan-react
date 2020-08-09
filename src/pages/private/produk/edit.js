import React, { useState } from 'react';
import useStyles from './styles/edit';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import UploadIcon from '@material-ui/icons/CloudUpload';
import Typography from '@material-ui/core/Typography';
import { useFirebase } from '../../../components/FirebaseProvider';
import { useDocument } from 'react-firebase-hooks/firestore';
import AppPageLoading from '../../../components/AppPageLoading';
import { useSnackbar } from 'notistack';
import { Prompt } from 'react-router-dom';

const EditProduk = ({ match }) => {

    const { firestore, user, storage } = useFirebase();

    const classes = useStyles();

    const [isSomethingChange, setSomethingChange] = useState(false);

    const { enqueueSnackbar } = useSnackbar()

    const produkDoc = firestore.doc(`toko/${user.uid}/produk/${match.params.produkId}`);
    const produkStorageRef = storage.ref(`toko/${user.uid}/produk/${match.params.produkId}`);

    const [snapshot, loading] = useDocument(produkDoc);

    const [form, setForm] = useState({
        nama: '',
        sku: '',
        harga: 0,
        stok: 0,
        deskripsi: ''
    })

    const [error, setError] = useState({
        nama: '',
        sku: '',
        harga: '',
        stok: '',
        deskripsi: ''
    })

    React.useEffect(() => {

        if (snapshot) {
            setForm(currentForm => ({
                ...currentForm,
                ...snapshot.data()
            }));
        }

    }, [snapshot])

    const [isSubmitting, setSubmitting] = useState(false);


    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        setError({
            ...error,
            [e.target.name]: ''
        })
        setSomethingChange(true);
    }

    const validate = () => {
        const newError = { ...error };

        if (!form.nama) {
            newError.nama = 'Nama Wajib Diisi'
        }

        if (!form.harga) {
            newError.harga = 'Harga Produk Wajib Diisi'
        }

        if (!form.stok) {
            newError.stok = 'Stok Produk Wajib Diisi'
        }

        return newError;

    }

    const handleSubmit = async e => {
        e.preventDefault();

        setSubmitting(true);

        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        } else {

            try {
                await produkDoc.set(form, { merge: true })
                enqueueSnackbar('Data berhasil diupdate', { variant: 'success' })
            } catch (e) {
                enqueueSnackbar('Terjadi kesalahan, silahkan coba lagi', { variant: 'danger' })
            }

        }
        setSubmitting(false);
        setSomethingChange(false);
    }

    const handleUploadFile = async (e) => {

        const file = e.target.files[0];

        if (!['image/png', 'image/jpeg'].includes(file.type)) {
            setError(error => ({
                ...error,
                foto: `Tipe File Tidak Didukung : ${file.type}`
            }))
        } else if (file.size >= 5120000) {
            setError(error => ({
                ...error,
                foto: `Ukuran File Lebih Dari 5Mb : ${file.size}`
            }))
        } else {
            const reader = new FileReader();

            reader.onabort = () => {
                setError(error => ({
                    ...error,
                    foto: `Proses Pemilihan File Dibatalkan`
                }))
            }

            reader.onerror = () => {
                setError(error => ({
                    ...error,
                    foto: `File Tidak Bisa Dibaca`
                }))
            }

            reader.onload = async () => {
                setError(error => ({
                    ...error,
                    foto: ''
                }))

                setSubmitting(true);
                setSomethingChange(true);

                try {
                    const fotoExt = file.name.substring(file.name.lastIndexOf('.'));
                    const fotoRef = produkStorageRef.child(`${match.params.produkId}${new Date().getTime()}${fotoExt}`);
                    const fotoSnapshot = await fotoRef.putString(reader.result, 'data_url');
                    const fotoUrl = await fotoSnapshot.ref.getDownloadURL();

                    setForm(currentForm => ({
                        ...currentForm,
                        foto: fotoUrl
                    }))

                } catch (e) {
                    setError(err => ({
                        ...err,
                        foto: e.message
                    }))
                }

                setSubmitting(false);
                setSomethingChange(false);
            }


            reader.readAsDataURL(file);
        }

    }

    if (loading) {
        return <AppPageLoading />
    }

    return (
        <div>
            <Typography variant='h5' component='h1'>Edit Produk : {form.nama}</Typography>
            <Grid container alignItems='center' justify='center'>
                <Grid item xs={12} sm={6}>
                    <form id='produk-form' onSubmit={handleSubmit} noValidate>
                        <TextField
                            id='nama'
                            name='nama'
                            label='Nama Produk'
                            margin='normal'
                            fullWidth
                            value={form.nama}
                            error={error.nama ? true : false}
                            helperText={error.nama}
                            disabled={isSubmitting}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            id='sku'
                            name='sku'
                            label='Sku Produk'
                            margin='normal'
                            fullWidth
                            value={form.sku}
                            error={error.sku ? true : false}
                            helperText={error.sku}
                            disabled={isSubmitting}
                            onChange={handleChange}
                        />
                        <TextField
                            id='harga'
                            name='harga'
                            label='Harga Produk'
                            margin='normal'
                            fullWidth
                            value={form.harga}
                            error={error.harga ? true : false}
                            helperText={error.harga}
                            disabled={isSubmitting}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            id='stok'
                            name='stok'
                            label='Stok Produk'
                            margin='normal'
                            fullWidth
                            value={form.stok}
                            error={error.stok ? true : false}
                            helperText={error.stok}
                            disabled={isSubmitting}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            id='deskripsi'
                            name='deskripsi'
                            label='Deskripsi Produk'
                            margin='normal'
                            fullWidth
                            multiline
                            maxRows={3}
                            value={form.deskripsi}
                            error={error.deskripsi ? true : false}
                            helperText={error.deskripsi}
                            disabled={isSubmitting}
                            onChange={handleChange}
                        />
                    </form>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div className={classes.uploadFotoProduk}>
                        {form.foto &&
                            <img src={form.foto} alt='Foto Produk' className={classes.previewFotoProduk} />
                        }
                        <input
                            type='file'
                            className={classes.hideInputFile}
                            id='upload-foto-produk'
                            accept='image/jpeg, image/png'
                            onChange={handleUploadFile}
                        />
                        <label htmlFor='upload-foto-produk'>
                            <Button component='span' variant='outlined' disabled={isSubmitting}>Upload Foto Produk <UploadIcon className={classes.iconRight} /> </Button>
                        </label>
                        <Typography color='error'>
                            {error.foto}
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={12} >
                    <Button
                        color='primary'
                        variant='contained'
                        type='submit'
                        form='produk-form'>
                        Simpan
                    </Button>
                </Grid>

            </Grid>

            <Prompt when={isSomethingChange} message='Terdapat perubahan yang belum disimpan, silahkan menyimpan terlebih dahulu' />

        </div>
    )
}

export default EditProduk;