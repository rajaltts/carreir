import { makeStyles } from "@material-ui/core/styles";

const multiTagEditStyles = makeStyles((theme) => ({
  multiTagGrid: {
    "& tr td": {
      maxWidth: "300px",
      whiteSpace: "nowrap",
      overflow: "hidden !important",
      textOverflow: "ellipsis",
    },
    "& thead tr th": {
      background: "inherit !important",
      border: "inherit !important",
      position: "unset !important",
      paddingLeft: "12px !important"
    },
    "& td": {
      minHeight: "39px",
      "& #multiTagActionList": { 
        padding: "9.5px 12px !important",
      },
      "& #ruleBasedCompContainer": { 
        padding: "9.5px 12px !important",
      },
      "& #numberField": { 
        padding: "9.5px 12px !important",
      },
      "& #textField": { 
        padding: "9.5px 12px !important",
      },
      padding: "0px !important",
      width: "auto !important",
      "-webkit-touch-callout": "none",
      "-webkit-user-select": "none",
      "-khtml-user-select": "none",
      "-moz-user-select": "none",
      "-ms-user-select": "none",
      "user-select": "none",
    },
    "& .MuiTableCell-root:nth-child(1)": {
      minWidth: "20px !important;",
      paddingLeft: "10px !important"
    },
    "& .MuiTableCell-root:nth-child(2)": {
      minWidth: "20px !important;"
    },
    "& .tableWrapper": {
      maxHeight: "none !important",
    }
  },
  checkBoxCell: {
    padding: "0px"
  }, 
  tableTd: {
    backgroundColor: "#E5E5E5 !important",
  },
  disableCell: {
    cursor: "not-allowed !important",
    opacity: "0.5",
  },
  tagHeader: {
    backgroundColor: "#1891F6",
    height: "72px",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  closeIconDiv: {
    display: "flex",
    width: "32px !important",
    height: "32px !important",
    borderRadius: "50%",
    background: "#ffffff",
    marginRight: "10px",
  },
  closeIcon: {
    color: "#FFFFFF",
    width: "17px !important",
    height: "17px !important",
    border: "0px",
    padding: "0px",
    cursor: "pointer",
    color: "#1891f6",
    marginLeft: "6.5px",
    marginTop: "8px",
  },
  tagTitle: {
    paddingLeft: "32px",
    color: "#FFFFFF",
    fontFamily: "Roboto",
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "28.13px",
    letterSpacing: "0em",
    minWidth: "141px",
  },
  unavailbleText: {
    color: "#152c73",
  },
  unavailableGrid: {
    opacity: 0.5,
    "& .tableWrapper": {
      maxHeight: "none !important",
      overflowX: "hidden",
    }
  },
  removeMaxHeight: {
    maxHeight: "unset !important",
  },
  gridWrapperBottom: {
    marginBottom: "144px !important",
  },
  gridWrapper: {
    padding: "0px 0px 30px 0px",
    margin: "0 156px",
  },
  multiTagEditGrid: {
    backgroundColor: "#E5E5E5",
  },
  defaultStyles: {
    minWidth: "50px !important",
  },
  selectionNameStyles: {
    minWidth: "95px !important",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "inline-block",
    width: "95px !important",
    overflow: "hidden",
    minWidth: "110px !important",
  },
  modelStyles: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "inline-block",
    minWidth: "160px !important",
    width: "160px !important",
    overflow: "hidden",
  },
  controlTypeStyles: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "inline-block",
    width: "95px !important",
    overflow: "hidden",
    minWidth: "95px !important",
  },
  qtyStyles: {
    minWidth: "40px !important",
    textAlign: "center",
    width: "40px !important",
  },
  actionStyles: {
    minWidth: "30px !important",
    textAlign: "center",
    padding: "9.5px 0px !important",
  },
  defaultCellStyles: {
    minWidth: "30px !important",
    textAlign: "center",
    width: "30px !important",
  },
  confirmContainer: {
    display: "flex",
    flexDirection: "column",
  },
  inValidColumnContent: {
    padding: "10px 20px 16px 3px",
    display: "inherit",
    justifyContent: "start",
    textAlign: "start",
  },
  inValidColumnFooter: {
    display: "flex",
    flexDirection: "row",
    marginTop: "32px",
  },
  headerIconClassName: {
    color: "#FF2A2A",
  },
  contentInfo: {
    fontSize: "16px",
    fontWeight: "400",
    lineHeight: "18.75px",
    color: "#152C73",
    paddingBottom:"12px",
    margin:"0px 0px 15px 0px",
    whiteSpace:"pre-line",
    "& span": {
      fontWeight: "bold",
    },
  },
  contentType: {
    display: "flex",
    flexDirection: "row",
    alignItems: "start",
    flex: 1,
    letterSpacing: "0.4px",
    lineHeight: "16px",
    fontSize: "12px",
    margin: "15px 0px 15px 0px",
    width: "75%",
    gap: "12px",
  },
  gridCol: {
    maxWidth: "75% !important",
    marginBottom: "31px",
  },
  unitMenu: {
    zIndex: "9999999 !important",
  },
  inputTextDialog: {
    padding: "0px !important",
    display: "block",
    margin: "4px 0px 0px",
    height: "36px !important",
  },
  selectTextDialog: {
    height: "36px !important",
  },
  checkBoxContainer: {
    margin: "0px !important",
  },
  checkBoxStyle: {
    paddingTop: "0px !important",
    paddingBottom: "0px !important",
  },
  paddingFromTopForFixedPosition: {
    paddingTop: "88px"
  }
}));

export default multiTagEditStyles;
