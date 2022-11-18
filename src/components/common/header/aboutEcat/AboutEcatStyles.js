import { makeStyles } from '@material-ui/core/styles';

const useAboutEcatStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column"
    },
    platform: {
        display: "flex",
        flexDirection: "row",
        margin: "8px 0px 4px 0px"
    },
    platformText: {
        width: "50%",
        minWidth: "120px"
    },
    builderItem: {
        height: "30px",
        lineHeight: "30px",
        paddingLeft: "40px",
        paddingRight: "80px",
        marginTop: "5px",
        color: "#FFFFFF",
        backgroundColor: "#152c73",
    }
}));

export default useAboutEcatStyles;