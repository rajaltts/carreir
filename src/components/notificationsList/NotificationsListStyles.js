import { makeStyles } from '@material-ui/core/styles';

const NotificationsListStyles = makeStyles((theme) => {
    return {
        notificationIcon: {
           color: "#FFFFFF",
           cursor: "pointer",
        },
        notificationsContainer: {
            position: "absolute",
            top: "60px",
            right: 0,
            width: "324px",
            height: "auto",
            backgroundColor: "white",
            margin: 0,
            padding: 0,
            zIndex: 999,
            boxShadow: "0px 12px 10px -10px rgba(0, 118, 244, 0.1)",
            borderRadius: "5px",
            border: "1px solid rgba(167, 175, 195, 0.3)",
        },
        notificationDetailsContainer: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "4rem",
            padding: "0.25rem 0rem",
            borderBottom: "1px solid #E5E7ED",
        },
        notificationViewStatus: {
            width: "28px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        notificationSeen: {
            width: "6.4px",
            height: "6.4px",
            marginLeft: "12.8px",
            marginRight: "8.8px",
            borderRadius: "100%",
            background: "white",
        },
        notificationNotSeen: {
            width: "6.4px",
            height: "6.4px",
            marginLeft: "12.8px",
            marginRight: "8.8px",
            borderRadius: "100%",
            background: "#0176F4",
        },
        deleteNotification: {
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
        },
        notificationData: {
            display: "flex",
        },
        notificationDetails: {
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "flex-start",
            fontSize: "14px",
            lineHeight: "16px",
            minHeight: "36px",
            width: "260px",
            wordBreak: "break-word",
            padding: "5px 0px",
        },
        notificationTitle: {
            color: "#333333",
            fontWeight: 400,
            cursor: "default !important",
        },
        notificationSubTitle: {
            color: "#333333",
            fontWeight: 700,
            cursor: "default !important",
        },
        notificationSharedAt: {
            fontWeight: 400,
            color: "#b5b5b5",
        },
        notificationSeenOpacity: {
            opacity: "0.7",
        },
        loadMoreContainer: {
            height: "27px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "8px",
        },
        loadMoreButton: {
            fontSize: "16px",
            borderRadius: "26px",
            minWidth: "95px",
            padding: "4px",
            minHeight: "22px !important",
            '&:disabled': {
                background: "#617080",
                color: "white",
                opacity: "0.5",
            },
        },
        notificationsWrapper: {
            maxHeight: "365px",
            overflowY: "auto",
        },
        notificationsWrapperLoading: {
            height: "399px",
            overflowY: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        deleteIcon: {
            width: "14px",
            height: "14px",
            marginLeft: "4px",
        },
        notificationMessage: {
            display: "flex",
        },
        badgeContent: {
            minWidth: '10px',
            height: '10px',
            fontSize: '0.5rem',
            fontWeight: 'bold',
            lineHeight: '8px',
            padding: '0 3px',
            color: '#FFFFFF !important',
            right: '5px',
            backgroundColor: '#1891F6',
            top: "5px",
        },
        notificationHeaderIcon: {
            position: "relative",
            marginLeft: "40px",
            display: "flex",
            alignItems: "center",
        },
        paddingRightHideCancel: {
            paddingRight: "8px",
        }
    }
});

export default NotificationsListStyles;
