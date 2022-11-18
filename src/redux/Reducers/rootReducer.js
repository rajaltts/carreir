import { combineReducers } from 'redux';
import localeReducer from './localeReducer';
import getprojectListReducer from './getProjectListReducer';
import createNewProjectReducer from './createNewProjectReducer';
import tagDetailInformation from './tagDetailInformation';
import getUserCustomersReducer from './getUserCustomersReducer';
import getProjectDetailList from './getprojectDetailListReducer';
import getTemplateListReducer from './getTemplateListReducer';
import getTagList from './getTagListReducer';
import newTagSave from './SavetagReducer';
import SavetemplateReducer from './SavetemplateReducer';
import GenerateReportReducer from './GenerateReportReducer';
import getAllProductsReducer from './getAllProductsReducer';
import csoExportReducer from './csoExportReducer';
import ReleaseNotesReducer from './ReleaseNotesReducer';
import { deleteTagTemplateReducer, getTagTemplatesReducer, saveTagTemplateReducer, updateTagTemplateReducer } from "./TagTemplatesReducer"
import { ConceptTemplatesReducer } from "./ConceptTemplatesReducer"
import csoCalculationReducer from "./csoCalculatioReducer";
import { TagTemplateOpenDialouge } from './TagTemplatesDialougeReducer';
import setBuilderPermissionsReducer from './setBuilderPermissionsReducer';
import userProfileReducer from './userProfileReducer';
import selectionLoadReducer from './selectionLoadReducer'
import configurationLoadReducer from './configurationLoadReducer';
import notificationReducer from './notificationReducer';
import environmentReducer from './environmentReducer';
import loaderReducer from './loaderReducer';
import saveTagGlobalReducer from './saveTagGlobalReducer'
import jsReportsReducer from './jsReportsReducer'
import upgradeReducer from "./upgradeReducer"
import saveTemplateGlobalReducer from './saveTemplateGlobalReducer'
import QuoteSelectionReducer from './quoteSelectionReducer';

const rootReducer = combineReducers({
    api: environmentReducer,
    locale: localeReducer,
    loader: loaderReducer,
    notification: notificationReducer,
    getProjectList: getprojectListReducer,
    createNewProject: createNewProjectReducer,
    tagDetailInformation,
    getUserCustomers: getUserCustomersReducer,
    getAllProductsReducer,
    getProjectDetailList,
    getTemplateList: getTemplateListReducer,
    tagList: getTagList,
    newTagSave,
    SavetemplateReducer,
    GenerateReportReducer,
    csoExport: csoExportReducer,
    getTagTemplates: getTagTemplatesReducer,
    saveTagTemplate: saveTagTemplateReducer,
    deleteTagTemplate: deleteTagTemplateReducer,
    updateTagTemplate: updateTagTemplateReducer,
    csoCalculation: csoCalculationReducer,
    getConceptTemplates: ConceptTemplatesReducer,
    TagTemplateOpenDialouge: TagTemplateOpenDialouge,
    setBuilderPermissionsReducer: setBuilderPermissionsReducer,
    userProfile: userProfileReducer,
    selectionLoad: selectionLoadReducer,
    configurationLoad: configurationLoadReducer,
    ReleaseNotesReducer: ReleaseNotesReducer,
    saveTag: saveTagGlobalReducer,
    jsReportsReducer: jsReportsReducer,
    upgradeReducer: upgradeReducer,
    saveTemplate: saveTemplateGlobalReducer,
    quoteSelection: QuoteSelectionReducer
});

export default rootReducer;