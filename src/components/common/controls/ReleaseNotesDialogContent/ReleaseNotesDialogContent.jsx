import React, {useState, memo } from 'react';
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Checkbox, Link } from '@material-ui/core';
import { ApiService, generatePdfReport, endPoints } from "@carrier/workflowui-globalfunctions";
import { closeReleaseNotes, hideDialog } from '../../../../redux/Actions/ReleaseNotesActions';
import appConfig from '../../../../Environment/environments';
import './ReleaseNotesDialogContent.scss';
import { translation, ConfirmModal } from '@carrier/ngecat-reactcomponents';


const ReleaseNotesDialogContent = (props) => {

    const [checked, setchecked] = useState(false);
    const { releaseNotes, closeReleaseNotes, hideDialog, previousReleaseId, currentReleaseId, IsReviewReleaseNote} = props;

    const linkHandler = async (FileBlobContainer,FileName) => {
        const url = `${appConfig.api.eCatAppService}${endPoints.GET_DOCUMENT_CONTENT}?container=${FileBlobContainer}&fileName=${FileName}`;
        const { data } = await ApiService(url, 'get');
        generatePdfReport(data, FileName);
    }

    const handleChange = (event) => {
        setchecked(event.target.checked);
    };

    const onClose= () => {
        localStorage.setItem("showDialog",false);
        if(checked) {
            closeReleaseNotes(previousReleaseId, currentReleaseId);
        }
        else {
            hideDialog();
        } 
    };

    const title = IsReviewReleaseNote ? translation("ReleaseNotes") : translation("ReleaseNotesTitle");

    return (
        <ConfirmModal
                isModalOpen={true}
                title={title}
                onClose={onClose}
                hideCancel= {true}
        >
            <div>
                <div className="releaseNotesHeading">
                    <p>{translation("ReleaseNotesHeading")}</p>
                </div>
                    <ul className="releaseNoteList">
                        {releaseNotes.map((item) => {
                                    return <li key={item.Id}> <span>{item.Header} : </span> <Link key={1} color="inherit" className="b-link pdf-link" onClick={() => linkHandler(item.FileBlobContainer , item.FileName)} >{item.FileName}</Link></li>
                                })
                        }
                    </ul>
                 { !IsReviewReleaseNote ? 
                    <div className="saveCheckbox">
                        <Checkbox color="primary" checked={checked} className="OptionControl-Checkbox" onChange={handleChange} /> 
                        <p className="saveLabel">{translation("ReleaseNotesCheckboxText")}</p> 
                    </div> : ''
                }   
            </div>
      </ConfirmModal>
    );
}

const mapStateToProps = state => {
    return {
        releaseNotes: state.ReleaseNotesReducer.releaseNotes,
        previousReleaseId : state.ReleaseNotesReducer.previousReleaseId,
        currentReleaseId : state.ReleaseNotesReducer.currentReleaseId,
        IsReviewReleaseNote : state.ReleaseNotesReducer.IsReviewReleaseNote
    };
};

export default injectIntl(withRouter(
    connect( mapStateToProps, { closeReleaseNotes, hideDialog })(memo(ReleaseNotesDialogContent))
  ));