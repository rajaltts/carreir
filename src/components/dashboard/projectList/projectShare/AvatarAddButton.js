import React from "react";
import AddIcon from "@material-ui/icons/Add";
import ProjectShareStyles from "./ProjectShareStyles";

const AvatarAddButton = (props) => {
    const { shareClickHandler } = props;
    const classes = ProjectShareStyles();

    return (
        <div className={classes.avatarShare}>
            <AddIcon
                onClick={shareClickHandler}
                className={classes.avatarShareButton}
            />
        </div>
    );
};

export default AvatarAddButton;
