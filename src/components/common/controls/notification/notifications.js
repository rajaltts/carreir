import React from 'react';
import { connect } from 'react-redux';
import { hideNotification, hideLoader } from "@carrier/workflowui-globalfunctions";
import Snackbar from '@material-ui/core/Snackbar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CloseIcon from '@material-ui/icons/Close';
import useNotificationStyles from './notificationStyles';
import { Success, Error, Warning, Info } from '../../../../utilities/constants/Constants';
import classnames from 'classnames';
import LinearProgress from '@material-ui/core/LinearProgress';

const Notifications = (props) => {
    const { root, container, description, infoIcon, closeIconStyles, error, success, info, warning,
        alignCenter, linerProgress } = useNotificationStyles();
    const { visible, statusType, notificationText, hideNotification, isAutohide, showProgress, hideLoader } = props;

    const closeNotification = (event, reason) => {
        if (reason === "clickaway") {
            return;
        } else {
            hideLoader()
            hideNotification();
        }
    }

    const getNotificationDetails = (notificationClass, iconComponent, notificationId) => {
        return { notificationClass, iconComponent, notificationId }
    }

    const getDetails = (statusType) => {
        if (statusType === Success) {
            return getNotificationDetails(success, <CheckCircleIcon fontSize="small" className={infoIcon}/>, 'SuccessNotification')
        }
        else if (statusType === Error) {
            return getNotificationDetails(error, <ErrorIcon fontSize="small" className={infoIcon}/>, 'ErrorNotification')
        }
        else if (statusType === Warning) {
            return getNotificationDetails(warning, <ReportProblemOutlinedIcon fontSize="small" className={infoIcon}/>, 'WarningNotification')
        }
        else if (statusType === Info) {
            return getNotificationDetails(info, <InfoOutlinedIcon fontSize="small" className={infoIcon}/>, 'InfoNotification')
        }
    }

    const notificationDetails = getDetails(statusType);
    return (
        notificationDetails ?
            <Snackbar
                open={visible}
                autoHideDuration={isAutohide ? 6000 : null}
                onClose={closeNotification}
                classes={{root: root}}
            >
                <div>
                    {showProgress && (<div className={linerProgress}><LinearProgress /></div>)}
                    <div id={notificationDetails.notificationId} className={classnames(notificationDetails.notificationClass, container)}>
                        {notificationDetails.iconComponent}
                        <div id="notificationText" className={description}>
                            {notificationText}
                            <div id="notificationClose" className={alignCenter}>
                                <CloseIcon fontSize="small" className={closeIconStyles} onClick={closeNotification}/>
                            </div>
                        </div>
                    </div>
                </div>
            </Snackbar>
        :
        null
    )
}

const mapStateToProps = (state) => ({
    visible: state.notification.visible,
    statusType: state.notification.statusType,
    notificationText: state.notification.notificationText,
    isAutohide: state.notification.isAutohide,
    showProgress: state.notification.showProgress
});

export default connect(mapStateToProps, { hideNotification, hideLoader })(Notifications);