import React from "react";
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import BuilderMenu from '../../common/controls/builderList/builderMenu';
import { translation } from '@carrier/ngecat-reactcomponents'
import { injectIntl } from 'react-intl'

const useStyles = makeStyles((theme) => ({
    dropdown: {
        position: "relative",
        marginLeft: "40px",
        display: "flex",
        alignItems: "center"
    },
    helpLibraryDropdownIcon: {
        height: "22px !important",
        width: "22px !important",
        marginRight: "3px !important",
        verticalAlign: "middle",
    },
    helpAndLibraryDropDown: {
        textTransform: "none",
        position: "relative",
        display: "flex",
        backgroundColor: "transparent",
        color: "#ffffff",
        cursor: "pointer",
        border: "none",
        fontSize: 14,
        padding: "0px",
        outline: "none",
        alignItems: "center",
        "& span[id='caret']": {
            borderTopColor: "white",
        }
    },
    dropdownMenuClass: {
        top: "62px !important",
        right: 0,
    }
}));

const HelpLibraryDropdown = (props) => {

    const { dropdown, helpAndLibraryDropDown, dropdownMenuClass } = useStyles();

    const showHelpAndLibrary = () => {
        return props.builderList.some(item => {
            let childItemPermission = false;
            if (!item.hideChildrenWorkflow && item.childrenWorkflow && !!item.childrenWorkflow.length) {
                childItemPermission = item.childrenWorkflow.some(childItem => childItem.hasPermission && childItem.helpOrLibrarySupported);
            }
            return (childItemPermission || item.helpOrLibrarySupported) && item.hasPermission;
        });
    }

    return (showHelpAndLibrary() && 
        <BuilderMenu
            id="helpAndLibrarydd"
            className={dropdown}
            dropdownMenuClass={dropdownMenuClass}
            buttonProps={{
                name: translation("HelpLibraryTitle"),
                id: "helpAndLibrary",
                className: helpAndLibraryDropDown,
            }}
            showHelpAndLibrary
        />
    );
};

const mapStateToProps = (state) => ({
    builderList: state.getAllProductsReducer.builderList,
})


export default injectIntl(connect(mapStateToProps)(React.memo(HelpLibraryDropdown)));
