import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
    title: {
        // color: theme.palette.primary.main,
        textAlign: 'center',
        marginBottom: theme.spacing(1)
    },
    paper: {
        marginTop: theme.spacing(8),
        padding: theme.spacing(6)
    },
    buttonGroup: {
        marginTop: theme.spacing(3)
    },
    forgotPassword: {
        marginTop: theme.spacing(3)
    }
}))

export default useStyles;