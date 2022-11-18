import React from "react";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    avatar: {
        width: "24px",
        height: "24px",
        fontSize: "12px",
        margin: "-3px",
        border: "2px solid #FFFFFF",
        background: "#617080",
    },
}));

const AvatarStacked = (props) => {
    const { children, maxTogether = 4 } = props;
    const classes = useStyles();
    return (
        <AvatarGroup classes={{ avatar: classes.avatar }} max={maxTogether}>
            {children}
        </AvatarGroup>
    );
};

export default AvatarStacked;
