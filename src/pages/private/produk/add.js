import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useFirebase } from '../../../components/FirebaseProvider';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

function AddDialog({ history, open, handleClose }) {

    const { firestore, user } = useFirebase();
    const [nama, setNama] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const produkCol = firestore.collection(`toko/${user.uid}/produk`)
    const handleChange = e => {
        setNama(e.target.value)
        setError('');
    }


    const handleSimpan = async e => {
        e.preventDefault();
        try {
            setSubmitting(true)
            if (!nama) {
                throw new Error('Nama Produk Wajib Diisi')
            }
            const produkBaru = await produkCol.add({ nama })
            history.push(`produk/edit/${produkBaru.id}`)
        } catch (e) {
            setError(e.message);
        }
        setSubmitting(false)

    }

    return (
        <Dialog open={open}
            disableBackdropClick={isSubmitting}
            disableEscapeKeyDown={isSubmitting}
            onClose={handleClose}
            maxWidth='xs'
            fullWidth>
            <DialogTitle> Buat Produk Baru</DialogTitle>
            <DialogContent dividers>
                <TextField
                    fullWidth
                    id='nama'
                    label='Nama Produk'
                    onChange={handleChange}
                    value={nama}
                    helperText={error}
                    disabled={isSubmitting}
                    error={error ? true : false}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isSubmitting}>Batal</Button>
                <Button onClick={handleSimpan} disabled={isSubmitting} color='primary'>Simpan</Button>
            </DialogActions>
        </Dialog>
    )
}

AddDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
}

export default withRouter(AddDialog);