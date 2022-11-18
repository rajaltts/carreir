import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { Route } from 'react-router-dom';
import { injectIntl } from "react-intl";
import { getWorkflowDetailsForRoute, checkForBuilderPermission, checkForBuilderRolePermission,
  showWarningNotification, injectIntlTranslation } from "@carrier/workflowui-globalfunctions";
import workFlowsConfig from './WorkflowsConfig';
import Error from './Error';
import BrowserCompatability from './dashboard/BrowserCompatability/BrowserCompatability';

const PrivateRoute = ({ component: Component, path, isBuilderRoute, userRole, ...rest }) => {
  const isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
  const isEdge = window.navigator.userAgent.indexOf("Edge") > -1 || window.navigator.userAgent.indexOf("Edg") > -1;
  const isIpad = navigator.platform.match(/iPad/i);
  const isIpadPro = /Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
  const isChromeIOS= /CriOS/.test(navigator.userAgent);
  const { role, permissions } = rest.props;
  const showBlankScreen = (permissions.permissions) ? ((permissions.permissions.length > 0) ? true : false) : true;

  const getWorkflowPermission = () => {
    const { workflow, childrenWorkflow } = getWorkflowDetailsForRoute(workFlowsConfig, {pathname: path})
    const builderPermission = checkForBuilderPermission(workflow, childrenWorkflow);
    const builderRolePermission = checkForBuilderRolePermission(workflow, childrenWorkflow, userRole);
    return isBuilderRoute && !(builderPermission && builderRolePermission)
  }
  const [workflowPermission, setWorkflowPermission] = useState(getWorkflowPermission())
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    setWorkflowPermission(getWorkflowPermission())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[path, userRole])

  useEffect(() => {
    if (initialRender && typeof userRole === 'string' && isEdge) {
      setInitialRender(false);
      rest.showWarningNotification(injectIntlTranslation(rest.intl, "BrowserWarningMessage"));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userRole])

  if (!(isChrome || (isChromeIOS && (isIpad || isIpadPro)))) {
    return (
      <Route
        {...rest.props}
        render={props =>
          (<BrowserCompatability to={{ pathname: '/', state: { from: props.location } }} role={role} permissions={permissions} />)
        }
      />
    )
  }
  else {
    if(permissions.length === 0) {
      return(
        <Route 
          {...rest.props}
          render = { props => 
            (<Error to = {{ pathname: '/ErrorPage', state: { from: props.location }}} role={role} permissions={permissions} />) 
          }
        />
      )
    }
    else if (!permissions.appAccess && showBlankScreen) {
      return null
    }
    else if (workflowPermission) {
      return(
        <Route 
          {...rest.props}
          render = { props => 
            (<Error to = {{ pathname: '/ErrorPage', state: { from: props.location }}} role={role} permissions={permissions} isWorkflowPermission={true}/>) 
          }
        />
      )
    }
    else if (permissions.appAccess) {
      return (
        <Route
          {...rest.props}
          render={props =>
            (<Component {...props} role={role} permissions={permissions} />)
          }
        />
      )
    }
    else {
      return (
        <Route
          {...rest.props}
          render={props =>
            (<Error to={{ pathname: '/ErrorPage', state: { from: props.location } }} role={role} permissions={permissions} />)
          }
        />
      )
    }
  }
};

const mapStateToProps = (state) => ({
  userRole: state.locale.role
})

export default injectIntl(connect(mapStateToProps, {showWarningNotification})(PrivateRoute));
