import React, {memo, useEffect} from 'react';
import { withRouter } from 'react-router';
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux';
import { injectIntl } from "react-intl";
import BuilderMenu from '../common/controls/builderList/builderMenu';
import { translation } from '@carrier/ngecat-reactcomponents';
import UpsertProject from './AddProject/upsertProject';
import ImportProject from './ImportProject/importProject';
import { makeStyles } from '@material-ui/core/styles';
import ProjectGrid from "./projectList/projectGrid";
import ProjectSearch from "./projectList/projectSearch";
import './Dashboard.scss';
import {sectionAddWrapper, sectionRemoveWrapper} from '../common/section/sectionWrapper';
import ExportProjectSaveDialog from './projectList/projectListActions/components/exportProject/ExportProjectSaveDialog';

const dashboardStyles = makeStyles((theme) => ({
    dashboardActionContainer: {
        display: "flex",
        padding: "16px 156px",
        alignItems: "center",
        backgroundColor: '#ffffff'
    },
    dashboardActions: {
        display: 'flex',
        columnGap: "15px",
        width: '100%',
        justifyContent: "flex-end"
    },
    containerPadding: {
        padding: '0px 156px'
    },
    projectGrid: {
        backgroundColor: "#F0F0F4"
    }
}));

const Dashboard = (props) => {
    const { visible } = props;
    const {dashboardActionContainer, dashboardActions, containerPadding, projectGrid} = dashboardStyles();

    useEffect(() => {
        sectionAddWrapper(projectGrid);
        return () =>{
            sectionRemoveWrapper(projectGrid);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className={dashboardActionContainer}>
                <ProjectSearch />
                <div className={dashboardActions}>
                    <ImportProject />
                    <BuilderMenu
                        buttonProps={{
                            name: translation("AddNewSelection"),
                            id: "AddSelection",
                            iconComponenet: <AddIcon />
                        }}
                    />
                    <UpsertProject />
                </div>
            </div>
            <div className={containerPadding}>
                <ProjectGrid />
            </div>
            {visible && <ExportProjectSaveDialog />}
        </>
    )
}

const mapStateToProps = state => ({
    lang: state.locale,
    visible: state.createNewProject.isExportProjectData
});

export default injectIntl(withRouter(connect(mapStateToProps)(memo(Dashboard))));