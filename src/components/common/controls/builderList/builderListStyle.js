import { makeStyles } from '@material-ui/core/styles';

const builderListStyles = makeStyles((theme) => ({
  root: {
    fontWeight: "bold",
    color: "#333333",
    fontSize: "13px",
    padding: "4px 0px",
    minHeight: "100px",
    maxHeight: "220px",
    height: "inherit",
    overflowY: "auto",
    width: "190px",
    boxSizing: "border-box"
  },
  activeItem: {
    cursor: "pointer",
    color: "#152c73",
    "&:hover": {
      backgroundColor: "#2041ac",
      color: "#ffffff"
    }
  },
  spacingLevel1: {
    padding: "5px 8px"
  },
  spacingLevelHelpAndLibrary: {
    padding: "2px 8px 3px 18px"
  },
  spacingLevel2: {
    padding: "6px 8px 6px 18px",
    fontWeight: "normal"
  },
  spacingLevel3: {
    padding: "3px 8px 3px 36px",
    fontWeight: "normal"
  },
  disabled: {
    pointerEvents: "none",
    cursor: "not-allowed !important",
    color: "#a9a9a9 !important"
  }
}));

export default builderListStyles;
