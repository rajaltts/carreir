import React, { useState } from "react";
import { injectIntl } from "react-intl";
import ProjectShareDialog from "../../../common/controls/ProjectShareDialog";
import SharedList from "./SharedList";
import { connect } from "react-redux";

const ProjectShare = (props) => {
    const { rowData, intl } = props;
    const [openShareDialog, setOpenShareDialog] = useState(false);

    const openDialog = () => {
        setOpenShareDialog(true);
    };

    const closeDialog = () => {
        setOpenShareDialog(false);
    };

    const clickHandler = (event) => {
        event.stopPropagation();
    }

    return (
        <div onClick={clickHandler}>
            <SharedList
                openShareDialogHandler={openDialog}
                projectDetail={rowData}
            />
            {openShareDialog && (
                <ProjectShareDialog
                    isModalOpen={openShareDialog}
                    projectDetail={rowData}
                    onProjectShareClose={closeDialog}
                    intl={intl}
                />
            )}
        </div>
    );
};

export default injectIntl(connect()(ProjectShare));
