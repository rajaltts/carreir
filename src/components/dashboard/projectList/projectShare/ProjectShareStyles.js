import { makeStyles } from "@material-ui/core/styles";

const ProjectShareStyles = makeStyles((theme) => ({
    shareButton: {
        minwidth: "69px",
        height: "24px",
    },
    shareIcon: {
        transform: 'scale(-1, 1)',
        width: '24px',
        height: '24px'
    },
    shareButtonText: {
        whiteSpace: "nowrap",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "12px",
        lineHeight: "16px",
        textAlign: "center",
        color: "#333333",
        textTransform: "none",
    },
    userOptionsContainer: {
        zIndex: 9999999,
        transform: "translate3d(420px, 3610px, 0px)",
    },
    userOptionsDrawer: {
        padding: "0px",
        border: "1px solid #E5E7ED",
        maxHeight: "180px",
    },
    userOptions: {
        borderBottom: "1px solid #E5E7ED",
    },
    userInviteContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    userSearchContainer: {
        width: "100%",
    },
    sharedListAvatarsContainer: {
        display: "flex",
    },
    avatarShare: {
        width: "24px",
        height: "24px",
        fontSize: "12px",
        margin: "-3px",
        border: "2px solid #FFFFFF",
        backgroundColor: "#E5E7ED",
        color: "#617080",
        borderRadius: "2000px",
        zIndex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
    },
    avatarShareButton: {
        color: "#617080",
        width: "18px",
        height: "18px",
    },
    bg1: {
        backgroundColor: "#F77387",
    },
    bg2: {
        backgroundColor: "#6F4CDA",
    },
    bg3: {
        backgroundColor: "#D56CCA",
    },
    bg4: {
        backgroundColor: "#4caf50",
    },
    userSearchInput: {
        height: "10px",
    },
    shareContentContainer: {
        padding: "8px 8px",
    },
    userDetailsContainer: {
        display: "flex",
        flexDirection: "column",
        marginLeft: "10px",
    },
    userName: {
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "15.68px",
        color: "#333333",
    },
    userNameSelected: {
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "15.68px",
        color: "#1891F6",
    },
    userEmail: {
        fontSize: "12px",
        lineHeight: "112%",
        color: "#BAC0D0",
        marginTop: "2px",
    },
    userDetailsRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sharedWithListForDialogContainer: {
        marginTop: "20px",
    },
    sharedWithListForDialog: {
        display: "flex",
        justifyContent: "space-between",
        padding: "5px 1px",
    },
    sharedUserNameContainerDialog: {
        width: "fit-content",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    userInviteDetails: {
        display: "flex",
        flexDirection: "column",
    },
    userNameMarginLeft: {
        marginLeft: "8px",
    },
    sharedWithAccessSelect: {
        minWidth: "60px",
        marginLeft: "5px",
    },
    roleMenuItem: {
        padding: "5px 10px",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "15.68px",
        color: "#333333",
    },
    removeAccessMenuItem: {
        padding: "5px 10px",
        borderTop: "1px solid #E5E7ED",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "15.68px",
        color: "#333333",
    },
    userSelectInputEndAdornment: {
        display: "hidden",
    },
    userSearchInputField: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        "& .MuiFormLabel-root": {
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "19px",
            color: "#293043",
        },
        "& .MuiInputLabel-formControl": {
            top: "-5px",
        }
    },
    userSearchInputWidth: {
        minWidth: "100% !important",
        padding: "0px 0px 0px 5px !important",
    },
    sharedProjectAccessSelect: {
        minWidth: "50px",
    },
    userNameMarginRight: {
        marginRight: "24px",
    },
    usersSharedLoader: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    userShareSelectedAccess: {
        marginLeft: "5px",
    },
    hideUserShareSelectedAccess: {
        marginRight: "5px",
        display: "none",
    },
    userShareSelectedTag: {
        borderRadius: "4px",
    },
    menuItemSelectedGutters: {
        paddingLeft: "10px",
    },
    menuItemSelected: {
        backgroundColor: "white !important",
    },
    infoProject: {
        height: '14px',
        marginBottom: '0px',
        fontSize: '14px',
        lineHeight: '14px'
    },
    helperText: {
        height: "18px",
        color: "#BAC0D0",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "112%",
        marginBottom: "2px",
    },
    modifyAccessContainer: {
        display: "flex",
        justifyContent: "space-betwwen",
        alignItems: "center",
    },
    sendInviteButton: {
        minWidth: "128px",
        marginLeft: "8px",
        padding: "11px 20px",
    },
    sendInviteButtonActive: {
        minWidth: "128px",
        marginLeft: "8px",
        padding: "11px 20px",
        alignSelf: "flex-start",
    },
}));

export default ProjectShareStyles;
