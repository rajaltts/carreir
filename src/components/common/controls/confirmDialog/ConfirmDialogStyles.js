import { makeStyles } from '@material-ui/core/styles';

const confirmDialogStyles = makeStyles((theme) => {
    const textAlign = {
        display: "inherit",
        justifyContent: "center",
        textAlign: "center",
    }

    const leftPadding = {
        paddingRight: '24px'
    }

    return {
        confirmContainer: {
            display: "flex",
            flexDirection: "column"
        },
        confirmContent: {
            padding: "10px 20px 0px 20px",
            ...textAlign
        },
        confirmContentLeftAlign: {
            display: "inherit",
            justifyContent: "left",
            textAlign: "left",
        },
        confirmContentCenterAlign: {
            ...textAlign
        },
        expandMoreLink: {
            position: "static",
            width: "inherit",
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "16px",
            color: "#1891F6",
            cursor: 'pointer'
        },
        expandedDiv: {
            maxHeight: "190px",
            overflow: "auto",
            ...leftPadding
        },
        leftPadding,
        listPadding: {
            paddingInlineStart: '20px'
        }
    }
});

export default confirmDialogStyles;