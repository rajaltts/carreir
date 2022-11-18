import { makeStyles } from '@material-ui/core/styles';

const customLoaderStyles = makeStyles((theme) => ({
    dialogRoot: {
        backgroundColor: "transparent",
        boxShadow: "none"
    },
    contentClass: {
        padding: "8px 24px !important"
    },
    pageLoaderContent: {
        outline: "none",
        color: "white"
    }
}));

export default customLoaderStyles;
