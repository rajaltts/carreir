import React, { useState } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from "react-intl";
import { translation, SearchDropdown } from '@carrier/ngecat-reactcomponents';
import {
    injectIntlTranslation, projectListColumn, keyboard,
    sortingOrder, getProjectList
} from '@carrier/workflowui-globalfunctions';
import projectGridStyles from './projectGridStyles';
import { updateProjectGridState } from '../../../redux/Actions/updateProjectListState';

const ProjectSearch = (props) => {
    const { getProjectList, intl, updateProjectGridState, searchText, filterSelected,searchColumn, projectType, rowsPerPage } = props;
    const { gridSearchRoot } = projectGridStyles();
    const { ProjectName, ProjectCustomer, OwnerName } = projectListColumn;
    const [searchQuery, setSearchQuery] = useState(searchText);
    const [searchFilterType, setSearchFilterType] = useState(searchColumn);
    const [selectedFilter, setSelectedFilter] = useState(filterSelected);

    const onTextChange = ({target: {value}}) => {
        setSearchQuery(value);
        if (!value) {
            updateProjectGridState({
                searchText: "",
                searchColumn: "",
                page: 0,
                order: sortingOrder.descending,
                orderBy: projectListColumn.LastModifiedDate,
                selectedFilter: selectedFilter
            });
            getProjectListData("", "");
        }
    }

    const changeSelectedFilter = (filterName) => {
        let selectedFilter = "";
        let searchColumn = "";
        switch (filterName.props.id) {
            case "Customer":
                selectedFilter = "Customer"
                searchColumn = ProjectCustomer
                break;
            case "DisplayAll":
                searchColumn = "all"
                selectedFilter = "DisplayAll"
                break;
            case "Owner":
                searchColumn = OwnerName
                selectedFilter = "Owner"
                break;
            default: selectedFilter = searchColumn = ProjectName
                break;
        }
        setSelectedFilter(selectedFilter);
        setSearchFilterType(searchColumn);
    }

    const onSearchClick = () => applyFilterOnProjectGrid()

    const handleKeyPress = ({key}) => {
        if (key === keyboard.ENTER) {
            applyFilterOnProjectGrid()
        }
    }

    const applyFilterOnProjectGrid = () => {
        if (searchQuery) {
            updateProjectGridState({
                searchText: searchQuery,
                searchColumn: searchFilterType,
                page: 0,
                order: sortingOrder.descending,
                orderBy: projectListColumn.LastModifiedDate,
                selectedFilter: selectedFilter
            });
            getProjectListData(searchFilterType, searchQuery);
        }
    }

    const getProjectListData = (searchFilterType, searchQuery) => {
        getProjectList(
            0,
            rowsPerPage,
            `${projectListColumn.LastModifiedDate}_${sortingOrder.descending}`,
            searchFilterType,
            searchQuery,
            projectType
        )
    }

    return (
        <div className={gridSearchRoot} >
            <SearchDropdown
                filterName={selectedFilter}
                filters={[
                    translation("DisplayAll"),
                    translation(ProjectName),
                    translation("Customer"),
                    translation("Owner")
                ]}
                onSearchClick={onSearchClick}
                handleKeyPress={handleKeyPress}
                onTextChange={onTextChange}
                onListItemClicked={changeSelectedFilter}
                placeholder={injectIntlTranslation(intl, "SearchPlaceholderText")}
                title={injectIntlTranslation(intl, "ClickToSearch")}
                value={searchQuery}
            />
        </div>
    );
};

const mapStateToProps = (state) => ({
    searchText: state.getProjectList.searchText,
    searchColumn: state.getProjectList.searchColumn,
    filterSelected: state.getProjectList.selectedFilter,
    projectType: state.getProjectList.projectType,
    rowsPerPage: state.getProjectList.rowsPerPage
});

export default injectIntl(withRouter(connect(mapStateToProps, {
    updateProjectGridState, getProjectList
})(ProjectSearch)));