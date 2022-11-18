import React, { useState } from 'react';
import { injectIntlTranslation } from '@carrier/workflowui-globalfunctions';
import { injectIntl } from "react-intl";
import CustomButton from '../../common/controls/CustomButton'
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import ImportProjectDialog from './importProjectDialog';

const ImportProject = (props) => {
    const { intl } = props;
    const [openDialog, setopenDialog] = useState(false);

    const toggleprojectDialog = () => {
        setopenDialog(!openDialog);
    }

    return (
        <>
            <CustomButton
                name={injectIntlTranslation(intl, "UploadNewProject")}
                id="ImportProject"
                iconProps={{ icon: faFileImport }}
                onClick={toggleprojectDialog}
            />
            {openDialog &&
                <ImportProjectDialog
                    toggleprojectDialog={toggleprojectDialog}
                />}
        </>
    )
}

export default injectIntl((ImportProject));
