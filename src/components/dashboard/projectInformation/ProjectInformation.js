import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import projectInformationStyles from "./ProjectInformationStyles";
import ShareButton from '../projectList/projectShare/ShareButton';
import UpsertProject from "../AddProject/upsertProject";
import { injectIntl } from "react-intl";
import {
    injectIntlTranslation,
    isProjectOwner,
} from "@carrier/workflowui-globalfunctions";
import { Tooltip } from "@material-ui/core";
import classNames from "classnames";

const ProjectInformation = (props) => {
    const { customerList, rowData, intl } = props;
    const { projectNameStyles, disabled, customerNameButton } = projectInformationStyles();
    const { CustomerID, ProjectID, ProjectName, CustomerId } = rowData;
    const customerID = CustomerID || CustomerId;
    const customerData =
        customerList.find((customer) => customer.CustomerID === customerID) ||
        {};
    const { CustomerName, CompanyName, Email, Phone } = customerData;
    const [openPopup, setopenPopup] = useState(false);
    const allowCustomerEdit = isProjectOwner(rowData.UserRole);

    const openEditProjectPopup = () => {
        if (allowCustomerEdit) {
            setopenPopup(!openPopup);
        }
    };

    const clickHandler = (event) => {
        event.stopPropagation();
    };

    const customerName = (
        <span
            className={classNames(!rowData.ProjectCustomer && customerNameButton, !allowCustomerEdit && disabled, projectNameStyles)}
            onDoubleClick={openEditProjectPopup}
        >
            {rowData.ProjectCustomer || <ShareButton buttonText={injectIntlTranslation(intl, "AddCustomer")} disabled={!allowCustomerEdit}/>}
        </span>
    );

    return (
        <div onClick={clickHandler}>
            {allowCustomerEdit ? (
                <Tooltip
                    title={injectIntlTranslation(
                        intl,
                        "DoubleclickToEdit",
                        "Doubleclick to Edit"
                    )}
                    arrow
                >
                    {customerName}
                </Tooltip>
            ) : (
                customerName
            )}

            {openPopup && (
                <UpsertProject
                    editProject={true}
                    projectId={ProjectID}
                    customerID={CustomerID}
                    customerEmail={Email}
                    customerPhone={Phone}
                    customerName={CustomerName}
                    companyName={CompanyName}
                    projectName={ProjectName}
                    isOpenDialog={openPopup}
                    toggleDialog={openEditProjectPopup}
                    disableProjectName
                />
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    customerList: state.getUserCustomers.records,
    isLoading: state.getUserCustomers.isLoading,
    project: state.createNewProject.projectData,
    lang: state.locale.leafLocale,
});

export default injectIntl(
    withRouter(connect(mapStateToProps)(ProjectInformation))
);
