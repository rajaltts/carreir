import React, { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import SharedListAvatars from "./SharedListAvatars";
import ShareAddButton from "./AvatarAddButton";
import ShareButton from "./ShareButton";
import ProjectShareStyles from "./ProjectShareStyles";
import { isProjectAdminOrOwner } from "@carrier/workflowui-globalfunctions";

const SharedList = (props) => {
    const { intl, openShareDialogHandler, projectDetail } = props;
    const classes = ProjectShareStyles();
    const [sharedWithInitials, setSharedWithInitials] = useState([]);
    const shareButtonVisible = isProjectAdminOrOwner(projectDetail.UserRole);

    const handleShareClick = () => {
        openShareDialogHandler();
    };

    useEffect(() => {
        if (projectDetail.SharedWith) {
            const sharedInitials = projectDetail.SharedWith.split(",");
            setSharedWithInitials(sharedInitials);
        } else {
            setSharedWithInitials([]);
        }
    }, [projectDetail.SharedWith]);

    return (
        <div>
            {sharedWithInitials.length ? (
                <div className={classes.sharedListAvatarsContainer}>
                    <SharedListAvatars
                        sharedWithInitialTexts={sharedWithInitials}
                    />
                    {shareButtonVisible && <ShareAddButton shareClickHandler={handleShareClick} />}
                </div>
            ) : (
                shareButtonVisible && <ShareButton shareClickHandler={handleShareClick} intl={intl} />
            )}
        </div>
    );
};

export default injectIntl(SharedList);
