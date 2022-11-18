import { makeStyles } from '@material-ui/core/styles';

const importProjectStyles = makeStyles({
    tagNameContainer: {
        display: "flex",
        flexDirection: "row",
        padding: "20px",
    },
    tagNameLabel: {
        margin: "19px 0px 0px 10px",
        width: "30%",
        display: "flex"
    },
    requiredAsterik: {
        color: "#c00000"
    },
    filePosition: {
        "padding-left": "133px",
    },
    tagNameField: {
        width: "50%",
        "margin-left": "-50px",
        "padding-right": "130px"
    },
    errorBorder: {
        borderColor: "#c00000 !important"
    },
    nonErrorBorder: {
        borderColor: "#bcbcbc !important"
    },
    errorMsg: {
        display: "block",
        color: "#c00000",
        margin: "4px 0px"
    },
    body: {
        "min-height": "200px",
        display: "flex",
        "flex-direction": "column",
    },
    fileLable: {
        paddingTop: "5px",
        maxWidth: "70%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"  
    },
    fileButton: {
        textTransform: "none",
        "border-color": "black",
        "background-color": "#e5e5e5",
        height: "23px"
    },
    fileDiv: {
        "column-gap": "5px",
        display: "flex",
        "flex-direction": "row",
    },
    inputActual: {
        display: "none"
    }
});

export default importProjectStyles;