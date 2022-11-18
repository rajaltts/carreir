import { makeStyles } from "@material-ui/core/styles";

const multiTagHeaderStyles = makeStyles((theme) => ({
  tagHeader: {
    backgroundColor: "#1891F6",
    padding: "8px 12px 8px 32px",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "start",
    flex: "1 1",
    fontFamily:"Roboto",
    minHeight:"88px",
    position: "fixed",
    width: "100%",
    zIndex: "20",
    boxSizing: "border-box"
  },
  tagGrid: {
    display: "flex",
    alignItems: "center"
  },
  tagCol: {
    flex: "1",
    margin: "auto"
  },
  closeIconDiv: {
    width: "32px !important",
    height: "32px !important",
    borderRadius: "50%",
    background: "#ffffff",
    marginLeft: "auto"
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
    marginTop: "8px"
  },
  tagTitle: {
    color: "#FFFFFF",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "23.44px",
    letterSpacing: "0em",
    minWidth: "120px",
    marginRight: "32px",
    width: "120px",
  },
  undoRedoCol: {
    display: "flex",
    alignItems: "center",
    marginRight: "16px"
  },
  undoIcon: {
    color: "#FFFFFF",
    width: "24px",
    height: "24px"
  },
  tagCol: {
    display: "flex",
    alignItems: "center"
  },
  tagColItems: {
    display: "flex",
    alignItems: "center",
    marginRight: "16px",
    flexDirection: "column",
    cursor: "pointer"
  },
  verticalLineIcon: {
    display: "inline-block",
    height: "32px",
    width: "2px",
    background: "#FFFFFF",
    marginRight: "19px"
  },
  openText: {
    marginLeft: "7px",
    marginTop: "7px",
    color: "#FFFFFF"
  },
  actionsGrid: {
    display: "flex",
    flexDirection: "row",
    flex: "1 1",
    justifyContent: "space-between"
  },
  defaultIcon: {
    color: "#FFFFFF",
    width: "24px !important",
    height: "24px",
  },
  copyIcon: {
    color: "#FFFFFF",
    width: "24px !important",
    height: "24px",
    transform: "rotate(270deg)"
  },
  saveCol: {
    marginRight: "42px",
    marginLeft: "8px"
  },
  saveButton: {
    backgroundColor: "#FFFFFF !important",
    color: "#1891F6",
    lineHeight: "19px",
    fontSize: "16px",
    borderRadius: "4px",
    "& :hover": {
      backgroundColor: "#FFFFFF !important",
      color: "#1891F6",
    },
    "& svg": {
      margin :"0px 0px 0px 6px"
    }
  },
  calculateCol: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column"
  },
  calculateCheckBox: {
    display: "flex",
    marginTop: "6px",
    alignSelf: "start"
  },
  calculateButton: {
    backgroundColor: "rgba(21, 44, 115, 0.5) !important",
    border: "0px",
    color: "#FFFFFF",
    height: "24px",
    minHeight: "24px",
    borderRadius: "4px",
    padding: "8px",
    fontSize: "14px",
    minWidth: "91px",
    marginRight: "24px"
  },
  validateCheckbox: {
    color: "#FFFFFF !important",
    width: "12px",
    height: "12px",
    padding: "0px",
    margin: "0px 12px 0px 6px"
  },
  calculateText: {
    color: "#FFFFFF",
    marginTop: "-3px",
    marginRight: "22px"
  },
  tagGridCol: {
    display: "flex"
  },
  confirmContainer: {
    display: "flex",
    flexDirection: "column"
  },
  confirmContent: {
      padding: "10px 20px 16px 20px",
      display: "inherit",
      justifyContent: "center",
      textAlign: "center",
  },
}));

export default multiTagHeaderStyles;
