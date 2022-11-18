import React, { useState, useEffect } from 'react';
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import {
    injectIntlTranslation, getProjectIdFromUrl, getTagIdFromUrl, getFullUrl,
    breadcrumbText, showWarningNotification
} from "@carrier/workflowui-globalfunctions";
import { MinutesTimer, ConfirmModal } from '@carrier/ngecat-reactcomponents';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CustomButton from "../controls/CustomButton";
import { withRouter } from 'react-router';
import { updateLockedId } from "../../../redux/Actions/getTagList";

const timerModalStyles = makeStyles((theme) => ({
    timerModalContainer: {
        margin: "16px",
        position: "relative",
        alignItems: "center",
        display: "flex"
    },
    timerModalContent: {
        padding: "0px !important",
        width: "440px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    timerOver: {
        marginBottom: "16px"
    },
    timerOverError: {
        color: "#EB5623",
        margin: "0px 50px",
        textAlign: "center",
        marginBottom: "16px"
    },
    timerModalFooter: {
        marginTop: "16px"
    },
    editSession: {
        marginLeft: "16px !important"
    }
}));

const SessionTimerAndModal = ({
    intl,
    tagList: { resetTimer, lockedID, lockedMessage, checkForTagLockWarning },
    projectList,
    history,
    location,
    fullName,
    updateLockedId,
    showWarningNotification
}) => {
    const [showTimerModal, setShowTimerModal] = useState(false)
    const { UserName = fullName, RemainingTime } = lockedMessage
    const timeInterval = RemainingTime * 60
    const {
        timerModalContainer, timerModalContent, timerOver, timerOverError,
        timerModalFooter, editSession
    } = timerModalStyles();

    useEffect(() => {
        if (resetTimer) {
            setShowTimerModal(false)
        }
    }, [resetTimer])

    useEffect(() => {
        if (RemainingTime && UserName === fullName && showTimerModal && checkForTagLockWarning) {
            showWarningNotification(injectIntlTranslation(intl, "TIMER_LOCK_WARNING").replace('{_RemainingTime_}', RemainingTime))
            setShowTimerModal(false)
        }
    }, [checkForTagLockWarning])

    useEffect(() => {
        if (UserName !== fullName && !showTimerModal) {
            showWarningNotification(injectIntlTranslation(intl, "TAG_LOCK_WARNING").replace('{_USER_NAME_}', UserName))
        }
    }, [UserName])

    const resetHandler = () => setShowTimerModal(true)

    const backToProject = () => {
        const projectID = getProjectIdFromUrl() || ""
        const projectData = projectList.filter(record => record.ProjectID === projectID)[0] || {};
        const { ProjectID, ProjectName } = projectData;
        const url = getFullUrl(
            location,
            { url: `/${breadcrumbText.projectDetail}` },
            { ProjectId: ProjectID, ProjectName: ProjectName }
        );
        setShowTimerModal(false)
        history.push(url, { ...projectData });
    }

    const newEditSession = () => updateLockedId(true)

    const createTimerModalFooter = () => {
        return (
            <>
                <CustomButton
                    id="Back_To_Project"
                    iconProps={editSession}
                    onClick={backToProject}
                    name={injectIntlTranslation(intl, "BACK_TO_PROJECT")}
                />
                {(fullName === UserName) &&
                    <CustomButton
                        showGradient
                        id="New_Edit_Session"
                        className={editSession}
                        iconProps={editSession}
                        onClick={newEditSession}
                        name={injectIntlTranslation(intl, "NEW_EDIT_SESSION")}
                    />
                }
            </>
        );
    }

    return (
        <div className={timerModalContainer}>
            {(getTagIdFromUrl() && lockedID) &&
                <>
                    {(fullName === UserName) &&
                        <MinutesTimer
                            label={injectIntlTranslation(intl, "EDIT_SESSION_TIMER_LABEL")}
                            resetCallback={resetHandler}
                            reset={resetTimer}
                            timeInterval={timeInterval}
                        />
                    }
                    <ConfirmModal
                        isModalOpen={showTimerModal}
                        hideHeader
                        hideCancel
                        contentClassName={timerModalContent}
                        footerComponent={createTimerModalFooter()}
                        footerClassName={timerModalFooter}
                    >
                        <Typography variant="subtitle1" className={timerOver} >
                            {injectIntlTranslation(intl, "EDIT_SESSION_TIME_OVER")}
                        </Typography>
                        {(fullName !== UserName) && UserName &&
                            <Typography variant="subtitle2" className={timerOverError} >
                                {injectIntlTranslation(intl, "EDIT_SESSION_BLOCKED").replace('{_USER_NAME_}', UserName)}
                            </Typography>
                        }
                    </ConfirmModal>
                </>
            }
        </div>
    )
}

const mapStateToProps = (state) => ({
    tagList: state.tagList,
    projectList: state.getProjectList.records,
    fullName: state.userProfile.fullName,
})

export default injectIntl(withRouter(connect(mapStateToProps, { updateLockedId, showWarningNotification })(SessionTimerAndModal)));
