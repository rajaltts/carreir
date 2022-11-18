import { makeStyles } from "@material-ui/core/styles";

const ruleBasedFormBuilderFieldStyles = makeStyles((theme) => ({
    spanContent: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },
    editComponent: {
        minWidth: "200px !important"
    },
    error: {
        color: "#FF2A2A"
    },
    selectRootClassName: {
        height: '20px !important',
        minHeight: '20px  !important',
    },
    formControlClassName: {
        margin: "0px !important"
    },
    input: {
        height: "20px !important",
        minWidth: "200px !important",
        '& > div': {
            height: "20px !important",
            minHeight: "20px !important"
        }
    },
    container: {
        height: '34px !important',
        padding: "0px !important",
        display: "block"
    },
    inputRangeRoot: {
        height: '22px !important',
    },
    inputNotch: {
        paddingTop: '0px !important',
        paddingBottom: '0px !important'
    },
    inputOutlined: {
        height: '20px !important',
        minHeight: '20px !important',
        paddingTop: "0px",
        paddingBottom: "0px",
    },
    inputOutlinedRoot: {
        height: '20px !important'
    },
    checkBoxContainer: {
        margin: "0px !important"
    },
    checkBoxStyle: {
        paddingTop: "0px !important",
        paddingBottom: "0px !important"
    },   
    disableCellContent :{
      cursor: "not-allowed !important",
      opacity: "0.5",
    }
}));

export default ruleBasedFormBuilderFieldStyles