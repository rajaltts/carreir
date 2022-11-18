import React from "react";
import { makeStyles } from "@material-ui/core";
import { injectIntlTranslation } from "@carrier/workflowui-globalfunctions";

const useStyles = makeStyles((theme) => ({
    errorContainer: {
        "& #names": {
            color: "#333333",
            fontWeight: 700,
        },
    },
    errorMessageStyle: {
        color: "#EB5623",
        marginTop: "10px",
    },
}));

const TagLockDeleteError = (props) => {
    const { message, subMessage, intl } = props;
    const classes = useStyles();
    return (
        <div className={classes.errorContainer}>
            {message}
            <div>{injectIntlTranslation(intl, "TryAgain")}</div>
            <div className={classes.errorMessageStyle}>{subMessage}</div>
        </div>
    );
};

export default TagLockDeleteError;
