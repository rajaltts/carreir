import React, { memo, useEffect } from 'react';
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withRouter } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { translation } from '@carrier/ngecat-reactcomponents';
import { breadcrumbText, injectIntlTranslation, decodeURIForSpecialCharacter } from "@carrier/workflowui-globalfunctions";
import classNames from 'classnames'
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { updateLockedId } from "../../../redux/Actions/getTagList"
import { fetchAndUpdateTagDetails } from "../../../redux/Actions/tagActions/editTagAction"

const useBreadcrumbStyles = makeStyles((theme) => ({
  breadcrumbWrapper: {
    "@media screen and (max-width: 767px)": {
      display: "none",
    },
    "& .MuiBreadcrumbs-separator": {
      "& .MuiSvgIcon-root": {
        fill: "white",
        opacity: 0.5
      }
    }
  },
  breadcrumbMargin: {
    margin: "14px 0 14px 40px",
  },
  linkColor: {
    color: "white",
    opacity: 0.5
  },
  inactiveLinkColor: {
    color: "white"
  },
}));

const CustomBreadcrumb = (props) => {
    const { 
        history, location: { pathname, search, state }, allBuilderRoutes, intl, updateLockedId, projectListRecords,
        saveTagModalOpen, userRole, fetchAndUpdateTagDetails, tagLockUserName
    } = props;
    const { breadcrumbWrapper, breadcrumbMargin, linkColor, inactiveLinkColor } = useBreadcrumbStyles();

    useEffect(() => {
        !!projectListRecords.length && !saveTagModalOpen && !tagLockUserName && updateLockedId()
        !!projectListRecords.length && fetchAndUpdateTagDetails()
    }, [search, projectListRecords, userRole])

    const dashboardClickHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        !!projectListRecords.length && updateLockedId()
        history.push('/');
    }

    const breadcrumbClickHandler = (event, index) => {
        event.preventDefault();
        const breadcrumbIndex = breadcrumbList.length - (index + 1);
        !!projectListRecords.length && updateLockedId()
        history.push(getRoute(breadcrumbIndex), state);
    }

    const getRoute = (breadcrumbIndex) => {
        let route = pathname;
        for (let count = 1; count <= breadcrumbIndex; count++) {
            route = getRouteString(route)
        }
        let newSearch = removeTagIdFromSearch(route);
        newSearch = removeTemplateIdFromSearch(newSearch);
        return `${route}${newSearch}`;
    }

    const removeTagIdFromSearch = (route) => {
        if (!!filteredRouteList.length && search.includes(breadcrumbText.tagId)) {
            const projectBreadcrumb = filteredRouteList[0].breadcrumb;
            if (projectBreadcrumb && route.startsWith(`/${breadcrumbText.projectDetail}`)) {
                return getNewSerachText(search, tagIdValidation);
            }
            return search;
        }
        return search;
    }

    const removeTemplateIdFromSearch = (searchParam) => {
        if (searchParam) {
            return getNewSerachText(searchParam, templateIdValidation)
        }
        return searchParam;
    }

    const templateIdValidation = (searchItem) => {
        return !searchItem.includes(breadcrumbText.templateId);
    }

    const tagIdValidation = (searchItem) => {
        return !(searchItem.includes(breadcrumbText.tagId) || searchItem.includes(breadcrumbText.isFixConfiguration));
    }

    const getNewSerachText = (searchParam, validate) => {
        const searchList = searchParam.split('&');
        let newSearchList = [];
        for (const searchItem of searchList) {
            if (validate(searchItem)) {
                newSearchList.push(searchItem);
            }
        }
        return newSearchList.join('&');
    }

    const getRouteString = (url) => {
        let route = url.slice(1);
        const startIndex = route.indexOf('/')
        const lastIndex = route.lastIndexOf('/')
        route = route.substring(startIndex, lastIndex);
        return route;
    }

    const getBreadcrumbs = () => {
        const url = pathname.slice(1);
        if (!url) return [];
        const breadcrumbList = url.split('/')
        return breadcrumbList.filter((breadcrumb) => {
            const isBuilderRoute = allBuilderRoutes.find(route => route.url.slice(1) === decodeURI(breadcrumb));
            if (isBuilderRoute) {
                filteredRouteList.push(isBuilderRoute);
                return false;
            }
            return true
        })
    }

    const getDecodedText = (text) => {
        let decodedText = decodeURI(text);
        decodedText = decodeURIForSpecialCharacter(decodedText);
        return decodedText;
    }

    const getTranslationKey = (text) => {
        return text.split(' ').join('');
    }

    const getTranslatedText = (text) => {
        const textToTranslate = getDecodedText(text);
        return translation(getTranslationKey(textToTranslate), textToTranslate);
    }

    const getBreadcrumbNameWithBuilder = (breadcrumb) => {
        if (!!filteredRouteList.length) {
            const builderBreadcrumb = filteredRouteList[0].breadcrumb;
            if (builderBreadcrumb && builderBreadcrumb.builderName) {
                const textToTranslate = getDecodedText(breadcrumb);
                return `${injectIntlTranslation(intl, getTranslationKey(textToTranslate), textToTranslate)} - ${builderBreadcrumb.builderName}`
            }
        }
        return getTranslatedText(breadcrumb);
    }

    const filteredRouteList = [];
    let breadcrumbList = getBreadcrumbs();

    return (
        <Breadcrumbs className={`${breadcrumbWrapper} ${!!breadcrumbList.length && classNames(breadcrumbMargin)}`} separator={<NavigateNextIcon fontSize='small' />}>
            {!!breadcrumbList.length && <Link className={linkColor} id='Breadcrumb_Dashboard'  href="/" onClick={dashboardClickHandler} variant='body2'>{translation('Dashboard')}</Link>}
            {breadcrumbList.map((breadcrumb, index) => {
                if (breadcrumbList.length === (index + 1)) {
                    return <Typography key={breadcrumb} color="textSecondary" variant='body2' className={inactiveLinkColor}>{getBreadcrumbNameWithBuilder(breadcrumb)}</Typography>
                }
                return <Link key={breadcrumb} className={linkColor} href="/" id={`Breadcrumb_${index}`} onClick={(event) => breadcrumbClickHandler(event, index)} variant='body2'>{getTranslatedText(breadcrumb)}</Link>
            })}
        </Breadcrumbs>
    )
}

const mapStateToProps = (state) => ({
    allBuilderRoutes: state.getAllProductsReducer.allBuilderRoutes,
    projectListRecords: state.getProjectList.records,
    saveTagModalOpen: state.saveTag.isModalOpen,
    userRole: state.locale.role,
    tagLockUserName: state.tagList.lockedMessage.UserName 
  });

export default injectIntl(
    withRouter(connect(
        mapStateToProps,
        { updateLockedId, fetchAndUpdateTagDetails }
    )(memo(CustomBreadcrumb)))
);