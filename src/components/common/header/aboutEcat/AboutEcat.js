import React from 'react';
import { connect } from 'react-redux';
import { ConfirmModal, translation } from '@carrier/ngecat-reactcomponents';
import { checkForBuilderPermission } from '@carrier/workflowui-globalfunctions';
import Versions from "./versions";
import useAboutEcatStyles from './AboutEcatStyles';

const AboutEcat = (props) => {
    const { openDialouge, onClose, builderList } = props;
    const { root, platform, platformText, builderItem } = useAboutEcatStyles();

    const getReleaseDetails = () => {
        const releaseDetails = [];
        if (!builderList.length) { return releaseDetails };
        
        builderList.forEach((workflow) => {
            const { childrenWorkflow, hideChildrenWorkflow, release } = workflow;
            if (release && !release.hideInAboutEcat && release.builderVersion && workflow.visible && checkForBuilderPermission(workflow)) {
                releaseDetails.push(release);
            }
            if (!hideChildrenWorkflow && childrenWorkflow && !!childrenWorkflow.length) {
                childrenWorkflow.forEach((childWorkflow) => {
                    const { release } = childWorkflow;
                    if (release && !release.hideInAboutEcat && release.builderVersion && childWorkflow.visible && checkForBuilderPermission(workflow, childWorkflow)) {
                        releaseDetails.push(release);
                    }
                })
            }
        });
        return releaseDetails;
    }

    const releaseDetails = getReleaseDetails();

    return (
        <ConfirmModal
            isModalOpen={openDialouge}
            title={translation("AboutNGECat")}
            modalWidth="xs"
            onClose={onClose}
        >
            <div className={root}>
                <div className={platform}>
                    <div className={platformText}><strong>{translation("ECATVersion")} :</strong></div>
                    <div>{Versions.EcatVersion} </div>
                </div>
                {!!releaseDetails.length &&
                    <>
                        <div className={platform}><strong>{translation("ProductBuilderDetails")}</strong></div>
                        {releaseDetails.map((item) => <div key={item.builderDisplayName} className={builderItem}>{item.builderDisplayName} ({item.builderVersion})</div>)}
                    </>
                }
            </div>
        </ConfirmModal>
    )
}

const mapStateToProps = (state) => ({
    builderList: state.getAllProductsReducer.builderList,
});

export default connect(mapStateToProps, null)(AboutEcat);