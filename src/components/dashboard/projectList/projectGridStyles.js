import { makeStyles } from '@material-ui/core/styles';

const projectGridStyles = makeStyles((theme) => ({
    gridRoot: (props) => {
        let height = window.outerHeight;
        if (height < 600) {
            height = Math.round(window.outerWidth * 0.53)
        }
        if (height < 600) {
            height = 600
        }
        return {
            display: 'flex',
            marginTop: '8px',
            maxHeight: `calc(${height}px - 415px) !important`,
            "& td": {
                padding: '2.5px 1px 2.5px 9px !important',
                border: 'none !important',
                color: '#333333 !important',
                minWidth: 'inherit'
            }
        }
    },
    projectNameStyles: {
        backgroundColor: 'rgba(0, 118, 244, 0.1)',
        borderRadius: '3px',
        padding: '0px 8px'
    },
    actionsStyles: {
        width: '50px !important',
        backgroundColor: '#F0F0F4 !important',
        border: 'none !important',
        minWidth: "50px !important"
    },
    gridSearchRoot: {
        display: 'flex',
        flexDirection: "row-reverse"
    },
    divisionLine: {
        borderColor: '#E5E7ED'
    },
    rowClassName: {
        backgroundColor: '#ffffff !important'
    },
    tdClassName: {
        color: '#617080 !important',
        backgroundColor: '#F0F0F4 !important',
        fontSize: '14px !important',
        fontWeight: '500 !important',
        lineHeight: '16px !important',
        letterSpacing: '0.05em !important',
        border: 'none !important',
        '&:hover': {
            color: '#000000 !important',
        }
    },
    pagination: {
        border: 'none !important',
        paddingTop: '24px',
        backgroundColor: '#F0F0F4 !important'
    },
    lastModifiedDate: {
        color: '#333333 !important'
    },
}));

export default projectGridStyles;
