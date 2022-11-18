import React from "react";
import { injectIntlTranslation } from "@carrier/workflowui-globalfunctions";
import Button from "@material-ui/core/Button";
import ProjectShareStyles from "./ProjectShareStyles";

const ShareButton = (props) => {
    const { shareClickHandler, intl, disabled=false, buttonText=null } = props;
    const classes = ProjectShareStyles();

    return (
        <Button
            variant="outlined"
            size="small"
            classes={{ root: classes.shareButton, label: classes.shareButtonText }}
            onClick={shareClickHandler}
            disabled={disabled}
        >
            {buttonText || injectIntlTranslation(intl, "Share", "Share")}
        </Button>
    );
};

export default ShareButton;
