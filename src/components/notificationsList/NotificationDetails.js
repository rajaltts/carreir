import React from "react";
import NotificationsListStyles from "./NotificationsListStyles";
import CloseIcon from "@material-ui/icons/Close";
import moment from "moment";
import { NotificationTypes, injectIntlTranslation } from "@carrier/workflowui-globalfunctions";
import { translation } from "@carrier/ngecat-reactcomponents";

const NotificationDetails = (props) => {
    const {
        data: { ProjectName, UserName, SharedAt, IsSeen, Role, ProjectNameOld },
        Type,
        intl,
        onProjectDelete,
        id,
    } = props;
    const classes = NotificationsListStyles();
    const { Shared, RoleChanged, Removed, ProjectDeleted, ProjectRenamed } = NotificationTypes;

    const getNotification = () => {
        let message = "";
        switch (Type.toString()) {
            case Shared:
                message = translation("ProjectRoleInvite", "", {
                    _USERNAME_: UserName,
                    _ROLE_: Role,
                });
                return getProjectShareNotification(message, true, true);
            case RoleChanged:
                message = translation("ProjectRoleInvite", "", {
                    _USERNAME_: UserName,
                    _ROLE_: Role,
                });
                return getProjectShareNotification(message, true, true);
            case Removed:
                message = translation("ProjectRemoveInvite", "", {
                    _USERNAME_: UserName,
                });
                return getProjectShareNotification(message, true, true);
            case ProjectDeleted:
                message = translation("ProjectDeleted", "", {
                    _USERNAME_: UserName,
                });
                return getProjectShareNotification(message, true, true);
            case ProjectRenamed:
                message = translation("ProjectRenamed", "", {
                    _USERNAME_: UserName,
                });
                return getProjectShareNotification(message, true, true);
            default:
                return null;
        }
    };

    const getProjectShareNotification = (message, showSentTime, showDelete) => {
        return (
            <div>
                <div className={classes.notificationData}>
                    <div className={classes.notificationViewStatus}>
                        <div
                            className={
                                IsSeen
                                    ? classes.notificationSeen
                                    : classes.notificationNotSeen
                            }
                        />
                    </div>
                    <div
                        className={`${classes.notificationDetails} ${
                            IsSeen ? classes.notificationSeenOpacity : ""
                        } ${!showDelete ? classes.paddingRightHideCancel : ""}`}
                    >
                        <div>
                            <span className={classes.notificationTitle}>
                                {message}
                            </span>
                            {ProjectNameOld && (
                                <React.Fragment>
                                    <span
                                        className={classes.notificationSubTitle}
                                    >
                                        {" " + ProjectNameOld}
                                    </span>
                                    <span>{" " + injectIntlTranslation(intl, "TextTo")}</span>
                                </React.Fragment>
                            )}
                            <span className={classes.notificationSubTitle}>
                                {" " + ProjectName}
                            </span>
                        </div>

                        {showSentTime && (
                            <div className={classes.notificationSharedAt}>
                                {moment(new Date(SharedAt)).fromNow()}
                            </div>
                        )}
                    </div>
                    <div className={classes.deleteNotification}>
                        {showDelete && (
                            <CloseIcon className={classes.deleteIcon} onClick={() => onProjectDelete(id)} />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={classes.notificationDetailsContainer}>
            {getNotification()}
        </div>
    );
};

export default NotificationDetails;
