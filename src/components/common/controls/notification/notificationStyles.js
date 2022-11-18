import { makeStyles } from '@material-ui/core/styles';

const useNotificationStyles = makeStyles((theme) => {
    const alignCenter = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };
    const iconSize = {
        fontSize: '20px',
        width: '32px'
    }
    return {
        root: {
            color: "#FFFFFF",
            maxWidth: "80%"
        },
        container: {
            ...alignCenter,
            flexDirection: 'row',
            fontSize: '16px',
            lineHeight: '19px',
            borderRadius: '4px',
            letterSpacing: '0.01071em',
            fontWeight: '500',
            boxSizing: 'border-box',
        },
        description: {
            ...alignCenter,
            flexDirection: 'row',
            padding: '8px 8px 8px 16px',
            color: '#333333',
            backgroundColor: '#FFFFFF',
            borderRadius: '0px 4px 4px 0px',
        },
        infoIcon: iconSize,
        closeIconStyles: {
            ...iconSize,
            paddingLeft: '8px',
            color: '#c4c5c9',
            cursor: 'pointer'
        },
        error: {
            backgroundColor: "#EB5623"
        },
        success: {
            backgroundColor: "#4caf50"
        },
        info: {
            backgroundColor: "#2196f3"
        },
        warning: {
            backgroundColor: "#ff9800"
        },
        alignCenter
    }
});

export default useNotificationStyles;
