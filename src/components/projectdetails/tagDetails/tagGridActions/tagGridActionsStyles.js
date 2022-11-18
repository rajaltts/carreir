import { makeStyles } from '@material-ui/core/styles';

const tagGridActionsStyles = makeStyles((theme) => ({
    inlineDisplay: {
        display: 'inline-block',
        position: 'relative'
    },
    margin1: {
        marginRight: '8px'
    },
    disabledIcon: {
        opacity: 0.5,
        cursor: "not-allowed"
    }
}));

export default tagGridActionsStyles;