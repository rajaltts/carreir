import React from 'react';
import { injectIntl } from "react-intl";
import { translation } from '@carrier/ngecat-reactcomponents';
import { faSave, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import BuilderMenu from '../../common/controls/builderList/builderMenu';
import CustomButton from '../../common/controls/CustomButton'
import addProjectDialogStyles from './addProjectDialogStyles';

const AddProjectDialogFooter = (props) => {
const { disableSave, saveAndAddSelectionHandler, saveHandler, editProject } = props;
const { ButtonsStyles } = addProjectDialogStyles();

    return (
        <div className={ButtonsStyles}>
            <CustomButton
                name={translation("Save")}
                disabled={disableSave}
                id="saveProject"
                iconProps={{ icon: faSave }}
                onClick={saveHandler}
            />
            {!editProject &&
            <BuilderMenu
                dropdownMenuClass="saveAndAddDropwDown"
                clickHandler={saveAndAddSelectionHandler}
                buttonProps={{
                    name: translation("SaveAndAddSelection"),
                    disabled: disableSave,
                    id: "SaveandAddSelection",
                    iconProps: { icon: faFileAlt }
                }}
            />
            }
        </div>
    )
}

export default injectIntl((AddProjectDialogFooter));