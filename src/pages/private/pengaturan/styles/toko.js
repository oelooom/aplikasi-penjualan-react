import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    pengaturanToko: {
        display: 'flex',
        flexDirection: 'column'
    },
    actionButton: {
        marginTop: theme.spacing(2)
    }
}))

export default useStyles;