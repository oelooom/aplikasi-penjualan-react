import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    hideInputFile: {
        display: 'none'
    },
    uploadFotoProduk: {
        textAlign: 'center',
        padding: theme.spacing(3)
    },
    previewFotoProduk: {
        width: '300px',
        height: '300px'
    },
    iconRight: {
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(0.5)
    }

}))

export default useStyles;