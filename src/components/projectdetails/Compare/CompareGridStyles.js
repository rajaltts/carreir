import { makeStyles } from '@material-ui/core/styles';

const compareGridStyles = makeStyles((theme) => ({
    compareGridRoot: {
        display: 'flex',
        maxHeight: `calc(${window.outerHeight}px - 431px) !important`,
        marginTop: '10px'
    },
    hideComponent: {
        display: "none"
    },
    reportList: {
        display: "flex",
        flexDirection: "column",
        margin: "10px 35px 0px 35px",
        padding: "10px 10px 5px 10px",
        borderRadius: "5px",
        boxShadow: "3px 5px 18px -2px rgba(163,160,160,1)"
    },
}));

export default compareGridStyles;