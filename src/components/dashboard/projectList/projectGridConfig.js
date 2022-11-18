import { columnType, projectListColumn } from '@carrier/workflowui-globalfunctions'
import ProjectActionsList from "./projectListActions/projectActionsList";
import ProjectShare from "./projectShare/ProjectShare";
import ProjectInformation from '../projectInformation/ProjectInformation';

export const projectGridConfig = {
    [projectListColumn.ProjectName]: {
        lookUpKey: projectListColumn.ProjectName,
        columnType: columnType.textBox,
        isEditable: true,
        onDoubleClick: null,
        validations: {}
    },
    [projectListColumn.ProjectCustomer]: {
        lookUpKey: projectListColumn.ProjectCustomer,
        columnType: columnType.customComponent,
        component: ProjectInformation,
    },
    [projectListColumn.UserRole]: {
        lookUpKey: projectListColumn.UserRole
    },
    [projectListColumn.OwnerName]: {
        lookUpKey: projectListColumn.OwnerName,
        formatValue: null
    },
    [projectListColumn.SharedWith]: {
        lookUpKey: projectListColumn.SharedWith,
        columnType: columnType.customComponent,
        alt: 'Shared With',
        component: ProjectShare,
    },
    [projectListColumn.LastModifiedDate]: {
        lookUpKey: projectListColumn.LastModifiedDate,
        columnType: columnType.date,
        format: 'DD/MM/YYYY hh:mm A',
        updatedByKey: projectListColumn.LastModifiedUser,
        className: null
    },
    [projectListColumn.Actions]: {
        lookUpKey: projectListColumn.Actions,
        columnType: columnType.meatballMenu,
        component: ProjectActionsList
    },
}
