import { makeStyles } from '@material-ui/core/styles';

const batchUpgradeStyles = makeStyles((theme) => ({
    batchUpgradeTable: {
        overflowY: "auto",
        maxHeight: "260px"
    },
    batchUpgradeHeader: {
        textAlign: "center",
        paddingRight: "10px",
        position: "sticky",
        top: "0px",
        backgroundColor: "#fff",
        zIndex: "9999",
    },
    batchUpgradeFooter: {
        display: "inline-flex",
        justifyContent: "center"
    },
    batchUpgradeCell: {
        paddingTop: "10px",
        overflowWrap: "break-word",
        paddingRight: "7px",
        textAlign: "center",
        maxWidth: "100px"
    },
    upgradeMessageText: {
        maxWidth: "300px"
    },
    batchUpgradeContainer: {
        display: "inline-block"
    },
    tagStatus: {
        cursor: "pointer",
        paddingLeft: "8px",
    },
    successIcon: {
        height: "20px",
        color: "#61B549"
    },
    failureIcon: {
        height: "20px",
        color: "#EB5623"
    },
    progressIcon: {
        height: "20px !important",
        width: "20px !important"
    }
}));

export default batchUpgradeStyles;