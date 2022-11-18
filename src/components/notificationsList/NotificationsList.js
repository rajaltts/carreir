import React, { useState, memo, useEffect } from "react";
import { injectIntl } from "react-intl";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import NotificationsListStyles from "./NotificationsListStyles";
import NotificationDetails from "./NotificationDetails";
import CustomButton from "../common/controls/CustomButton";
import {
    injectIntlTranslation,
    showErrorNotification,
} from "@carrier/workflowui-globalfunctions";
import Badge from "@material-ui/core/Badge";
import { ApiService, endPoints } from "@carrier/workflowui-globalfunctions";
import appConfig from "../../Environment/environments";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";

const NotificationsList = (props) => {
    const { intl, showErrorNotification } = props;
    const [open, setOpen] = useState(false);
    const classes = NotificationsListStyles();
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [deleteNotificationLoader, setDeleteNotificationLoader] = useState(false);
    const [notifications, setNotifications] = useState({
        Notifications: [],
        TotalCount: 0,
    });
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleClickAway = () => {
        setOpen(false);
    };

    const showNotificationLoader = (refresh, status) => {
        if (!refresh) {
            setLoadingNotifications(status);
        } else {
            setDeleteNotificationLoader(status);
        }
    }

    const getNotifications = async (pageNumber = 1, refresh) => {
        showNotificationLoader(refresh, true);
        const url = `${appConfig.api.eCatApimAppService}${endPoints.GET_PROJECT_NOTIFICATIONS}?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`;
        try {
            const { data } = await ApiService(url, "GET");
            setNotifications(data);
            if (notificationsCount > 0) {
                setNotificationsCount(0);
            };
            showNotificationLoader(refresh, false);
        } catch (error) {
            showErrorNotification(
                injectIntlTranslation(intl, "GenericErrorMessage")
            );
            showNotificationLoader(refresh, false);
        }
    };

    const getNotificationsCount = async () => {
        const url = `${appConfig.api.eCatApimAppService}${endPoints.GET_PROJECT_NOTIFICATIONS_COUNT}`;
        try {
            const { data } = await ApiService(url, "GET");
            setNotificationsCount(data);
        } catch (error) {
            showErrorNotification(
                injectIntlTranslation(intl, "GenericErrorMessage")
            );
        }
    };

    useEffect(() => {
        open && getNotifications(1, false);
        if (!open) {
            getNotificationsCount();
        }
    }, [open, rowsPerPage]);

    const handleLoadMoreNotifications = () => {
        setRowsPerPage(rowsPerPage + 10);
    };

    const getLoadMoreDisableStatus = () => {
        if (
            notifications.Notifications.length === notifications.TotalCount ||
            notifications.TotalCount <= 5 ||
            loadingNotifications
        ) {
            return true;
        }
        return false;
    };

    const handleProjectDelete = async (notificationId) => {
        setDeleteNotificationLoader(true);
        const url = `${appConfig.api.eCatApimAppService}${endPoints.DELETE_NOTIFICATION}?notificationId=${notificationId}`;
        try {
            await ApiService(url, "DELETE");
            getNotifications(1, true);
        } catch (error) {
            setDeleteNotificationLoader(false);
            showErrorNotification(
                injectIntlTranslation(intl, "GenericErrorMessage")
            );
        }
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div className={classes.notificationHeaderIcon} id="notifications">
                <Badge
                    badgeContent={notificationsCount}
                    classes={{ colorPrimary: classes.badgeContent }}
                    color="primary"
                >
                    <NotificationsIcon
                        id="notifications-btn"
                        className={classes.notificationIcon}
                        onClick={() => setOpen(!open)}
                    />
                </Badge>
                {open && (
                    <div className={classes.notificationsContainer}>
                        {deleteNotificationLoader && (<div><LinearProgress /></div>)}
                        <div
                            className={
                                loadingNotifications ||
                                !notifications.Notifications.length
                                    ? classes.notificationsWrapperLoading
                                    : classes.notificationsWrapper
                            }
                        >
                            {loadingNotifications && (
                                <CircularProgress color="inherit" size={20} />
                            )}
                            {!loadingNotifications &&
                                notifications.Notifications.length > 0 &&
                                notifications.Notifications.map((data) => {
                                    return (
                                        <NotificationDetails
                                            data={data.Details}
                                            Type={data.Action}
                                            intl={intl}
                                            onProjectDelete={handleProjectDelete}
                                            id={data.NotificationId}
                                        />
                                    );
                                })}
                            {!loadingNotifications &&
                                notifications.Notifications.length === 0 && (
                                    <div>
                                        {injectIntlTranslation(
                                            intl,
                                            "GridNoData"
                                        )}
                                    </div>
                                )}
                        </div>
                        {!loadingNotifications &&
                            notifications.Notifications.length > 0 && (
                                <div className={classes.loadMoreContainer}>
                                    <CustomButton
                                        name={injectIntlTranslation(
                                            intl,
                                            "LoadMore"
                                        )}
                                        id="load-more-notifications"
                                        onClick={(e) =>
                                            handleLoadMoreNotifications(e)
                                        }
                                        className={classes.loadMoreButton}
                                        showDropdownIcon={false}
                                        disabled={getLoadMoreDisableStatus()}
                                        showGradient={true}
                                    />
                                </div>
                            )}
                    </div>
                )}
            </div>
        </ClickAwayListener>
    );
};

export default injectIntl(
    connect(null, { showErrorNotification })(NotificationsList)
);
