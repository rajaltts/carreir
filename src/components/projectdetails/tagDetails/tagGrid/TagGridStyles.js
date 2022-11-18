import { makeStyles } from '@material-ui/core/styles';

const tagGridStyles = makeStyles((theme) => ({
    gridRoot: {
        display: 'flex',
        maxHeight: `calc(${window.outerHeight}px - 485px) !important`,
        minHeight: '150px !important'
    },
    actionsStyles: {
        width: '180px'
    }
}));

export const tagGridActionsStyles = makeStyles((theme) => ({
    rightAlign: {
        marginTop: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    }
}));

export default tagGridStyles;