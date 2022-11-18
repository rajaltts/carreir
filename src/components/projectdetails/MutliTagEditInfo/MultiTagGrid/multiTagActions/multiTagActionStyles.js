import { makeStyles } from '@material-ui/core/styles';

const multiTagActionStyles = makeStyles((theme) => ({
    circleIcon: {
        height: "6px",
        width: "6px !important",
        paddingRight: "4px"
    },
    green: {
        color: "#61B549"
    },
    red: {
        color: "#FF2A2A"
    },
    warningIcon: {
        height: "20px",
        cursor: "pointer",
        width: "20px !important",
        color: "#EB2653",
        display: "block"
    },
    tooliip: {
        fontSize:"10px",
        backgroundCOlor: "#617080",
        height:"20px",
        padding: "4px"
    },
}), { withTheme: true });

export default multiTagActionStyles;