import { makeStyles } from '@material-ui/core/styles';

const projectInformationStyles = makeStyles((theme) => ({
    header: {
        backgroundColor: '#071e62 !important',
        color: '#ffffff !important',
        minHeight: '40px !important',
        height: '42px'
    },
    arrowIcon: {
        color: '#ffffff !important'
    },
    editIcon: {
        color: '#071e62 !important'
    },
    fullWidth: {
        width: '100%',
    },
    alignCenter: {
        display: 'flex',
        justifyContent: 'center'
    },
    contentRoot: {
        display: 'flex',
        flexDirection: 'row',
        margin: '8px 2px 8px 8px'
    },
    projectInfoItem: {
        minWidth: '150px'
    },
    projectNameStyles: {
        backgroundColor: 'rgba(0, 118, 244, 0.1)',
        borderRadius: '3px',
        padding: '0px 8px',
        display: "inline-flex",
        cursor: "pointer",
    },
    customerNameButton: {
        backgroundColor: 'transparent',
        padding: '0px',
    },
    disabled: {
        opacity: '0.5',
        cursor: 'default',
        pointerEvents: 'none'
    }
}));

export default projectInformationStyles;