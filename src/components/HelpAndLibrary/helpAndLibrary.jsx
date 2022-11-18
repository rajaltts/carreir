import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { ApiService, generatePdfReport, endPoints, getWorkflowDetails } from "@carrier/workflowui-globalfunctions";
import { CustomGrid, translation } from '@carrier/ngecat-reactcomponents';
import appConfig from '../../Environment/environments';
import { getLanguageDetails } from '../../utilities/languagesutils';
import findPageName from './helpAndLibraryConstant';
import { helpLibraryConfig } from './helpAndLibraryConfig';
import './helpAndLibrary.scss';
import { showInfoNotification} from "@carrier/workflowui-globalfunctions"; 

let initialData = [];

const HelpAndLibrary = (props) => {
    const { lang, builderList } = props;
    const { pathname, search } = props.location;
    const [isLoading, setIsLoading] = useState(true);
    const [documentList, setDocumentList] = useState([]);
    const [headCells, setHeadCells] = useState([]);

    useEffect(() => {
        fetchLibraryRecords();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(initialData.length > 0){
            updateTableHeaderData(initialData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang]);

    const fetchLibraryRecords = async () => {
        const searchParams = search.split('&');
        const queryString = getQueryString(searchParams);
        const { workflowId, childrenWorkflowId } = getBuilderDetails(searchParams);
        const { workflow } = getWorkflowDetails({workflowsConfig: builderList, workflowId, childrenWorkflowId});
        let record = null;
        const { name, getContentFromBuilder } = getBuilderHandler(workflow)
        if (getContentFromBuilder) {
            record = await getContentFromBuilder({ name, workflow, workflowId });
        }
        else {
            const url = `${appConfig.api.eCatAppService}${endPoints.GET_PRODUCT_LIBRARY}${queryString}`;
            const { data } = await ApiService(url, 'get');
            record = data
        }
        initialData = record;
        setIsLoading(false);
        setDocumentList(record);
        updateTableHeaderData(record);
    };

    const getBuilderHandler = (workflow) => {
        if (workflow && workflow.helpOrLibrarySupported && workflow.HelpLibrary && !!workflow.HelpLibrary.length) {
            const helpLibraryConfig = workflow.HelpLibrary.find(item => item.name.toLowerCase() === findPageName[pathname].toLowerCase())
            return helpLibraryConfig || {};
        }
        return {};
    }

    const getBuilderDetails = (searchParams) => {
        return {
            workflowId: searchParams[0].slice(1).split('=')[1],
            childrenWorkflowId: searchParams[1].split('=')[1]
        }
    }

    const getQueryString = (searchParams) => {
        const language = getLanguageDetails(lang.name);
        return `${searchParams[0]}&culture=${language.fullLangCode}&${searchParams[1]}&documentType=${findPageName[pathname]}`;
    }

    const updateTableHeaderData = (data) => {
        const header = data[0].DocumentNames;
        const updatedTableHeader = header.map((name, index) => {
            if (name === 'Document') {
                helpLibraryConfig[name].formatValue = formatValue;
                return { name, displayName: translation("Document")};
            }
            else if (name === 'HyperLink') {
                helpLibraryConfig[name].onClick = linkHandler;
                return { name, displayName: translation("HyperLink"), className: 'hyperLinkColumn' };
            }
            else if (name === 'Category') {
                return { name, displayName: translation("Category"), className: 'categoryColumn' };
            }
            else if (name === 'Chiller') {
                return { name, displayName: translation("Chiller"), className: 'ChillerColumn' };
            }
            else {
                return { name };
            }
        });
        setHeadCells(updatedTableHeader);
    };

    const formatValue = (text) => {
        return text.substring((text.indexOf('/') + 1), text.lastIndexOf('.')) || text;
    }

    const linkHandler = async (event, rowItem = {}) => {
        event.preventDefault();
        props.showInfoNotification(translation("LIB_DOC_DOWNLOAD"));
        const { Document, ContainerName } = rowItem;
        const url = `${appConfig.api.eCatAppService}${endPoints.GET_DOCUMENT_CONTENT}?container=${ContainerName}&fileName=${Document}`;
        const { data } = await ApiService(url, 'get');
        generatePdfReport(data, Document);
    }

    const searchHandler = ({ target: { value }}) => {
        if (value) {
            const upperCaseValue = value.toUpperCase();
            const filteredRows = initialData.filter((item) => {
                return headCells.some((head) => {
                    const configItem = helpLibraryConfig[head.name];
                    const itemKey = (configItem && configItem.lookUpKey) || head.name;
                    const itemValue = configItem && configItem.formatValue ? configItem.formatValue(item[itemKey]) : item[itemKey];
                    return itemValue.toUpperCase().includes(upperCaseValue);       
                });
            });
            setDocumentList(filteredRows);
        }
        else {
            setDocumentList(initialData);
        }
    }

    return (
        <div className="helpAndLibrary">
            <CustomGrid
                headCells={headCells}
                rows={documentList}
                orderByfield={'Category'}
                sortable
                config={helpLibraryConfig}
                rowsPerPageOptions={[5, 10, 25, 50, 'All']}
                isLoading={isLoading}
                onSearch={searchHandler}
                doNotTranslate={false}
            />
        </div>
    );
};

const mapStateToProps = (state) => ({
    lang: state.locale,
    builderList: state.getAllProductsReducer.builderList,
});

export default withRouter(connect(mapStateToProps, { showInfoNotification })(React.memo(HelpAndLibrary)));
