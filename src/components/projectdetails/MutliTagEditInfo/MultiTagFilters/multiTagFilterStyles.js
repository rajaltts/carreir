import { makeStyles } from "@material-ui/core/styles";

const multiTagFilterStyles = makeStyles((theme) => ({
  paperMenu:{
    "& .MuiMenu-list":{
      padding: "15px 13px 15px 13px"
    }
  },
  wrapper: {
    margin: "0 156px",
    "& .MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before, & .Mui-focused .MuiOutlinedInput-notchedOutline, &:focus-within": {
      borderBottom: "0px"
    },
    "& .MuiInput-formControl": {
      fontSize: "12px"
    },
    "& .MuiIconButton-colorSecondary": {
      color: "#1891f6"
    },
    "& .MuiSelect-select": {
      width: "60px !important",
      minWidth: "60px !important",
      background: "transparent !important"
    },
    "& input.MuiSelect-nativeInput": {
      fontSize: "12px",
      color: "#333333",
      lineHeight: "14.06px"
    }
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 95
  },
  groupControl: {
    margin: theme.spacing(1),
    minWidth: 90
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  menuItem: {
    fontSize: "14px",
    cursor: "initial",
    padding: "0px",
    background: "#ffffff !important",
    lineHeight: "16.41px",
    color: "#333333"
  },
  checkboxControl: {
    width: "18px",
    height: '18px'
  },
}));

export default multiTagFilterStyles;
