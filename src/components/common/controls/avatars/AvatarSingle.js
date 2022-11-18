import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core";
import ProjectShareStyles from "../../../dashboard/projectList/projectShare/ProjectShareStyles";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "24px",
        height: "24px",
        fontSize: "10px",
        margin: "-3px",
        border: "2px solid #FFFFFF",
        textTransform: "uppercase",
    },
}));

const AvatarSingle = (props) => {
    const { avatarText } = props;
    const classes = useStyles();
    const shareStyles = ProjectShareStyles();
    const avatarBgColours = {
        "['a', 'b', 'c', 'd']": shareStyles.bg1,
        "['e', 'f', 'g']": shareStyles.bg3,
        "['h', 'i', 'j', 'k']": shareStyles.bg2,
        "['l', 'm', 'n']": shareStyles.bg4,
        "['o', 'p', 'q']": shareStyles.bg1,
        "['r', 's', 't']": shareStyles.bg3,
        "['u', 'v', 'w']": shareStyles.bg2,
        "['x', 'y', 'z']": shareStyles.bg4,
    };

    const addBgColor = (avatarText) => {
        let colourClass;
        Object.keys(avatarBgColours).forEach((colourKeys) => {
            if (avatarText && colourKeys.includes(avatarText[0].toLowerCase())) {
                colourClass = avatarBgColours[colourKeys];
            }
        });
        return colourClass;
    };

    return (
        <div>
            <Avatar className={`${classes.root} ${addBgColor(avatarText)}`}>
                {avatarText}
            </Avatar>
        </div>
    );
};

export default AvatarSingle;
