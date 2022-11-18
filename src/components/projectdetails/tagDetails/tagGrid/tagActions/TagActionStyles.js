import { makeStyles } from '@material-ui/core/styles';

const tagActionComponentStyles = makeStyles((theme) => ({
    actionLinkContainer: {
        display: "inline-flex",
        alignItems: "center",
        marginRight: "10px",
        fontSize: "16px",
        color: "#152c73"
    },
    actionsContainer: {
        marginTop: "3px",
        display: "flex",
    },
    actionLink: {
        cursor: "pointer",
    },
    disable: {
        color: "darkgrey",
        pointerEvents: "none",
        cursor: "not-allowed",
        opacity: "0.4",
    },
    copyProjectDialog: {
        padding: '8px 0px',
        marginTop: '8px'
    },
    menuItem: {
        border: '1px solid #E5E5E5'
    }
}), { withTheme: true });

export default tagActionComponentStyles;