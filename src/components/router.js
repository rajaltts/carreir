import React, { Suspense, lazy, useMemo, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from "react-redux";
import authcallback from './Shared/Authcallback/authcallback';
import PrivateRoute  from "./PrivateRoute";
import Error  from "./Error";
import Dashboard from'./dashboard/Dashboard';
import {NotFound} from "./common/NotFound";
import workFlowsConfig from './WorkflowsConfig';
import { getUrlInfo,  breadcrumbText } from '@carrier/workflowui-globalfunctions';
import { updateAllBuilderRoutes } from '../redux/Actions/getAllProducts'

const Projectinfo = lazy(() => import(/* webpackChunkName: "Projectinfo" */ './projectdetails/projectinfo'));
const HelpAndLibrary = lazy(() => import(/* webpackChunkName: "HelpAndLibrary" */ './HelpAndLibrary/helpAndLibrary'));
const MultiTagEditInfo = lazy(() => import(/* webpackChunkName: "MultiTagEditInfo" */ './projectdetails/MutliTagEditInfo/MutiTagEditInfo'));

const RouterConfig = (props) => {
    const { updateAllBuilderRoutes, role, permissions } = props;
    const [ privateConfigProps, setPrivateConfigProps] = useState({
        permissions: permissions,
        role: role
    });

    useEffect(()=>{
        setPrivateConfigProps({
            permissions: permissions,
            role: role
        });
    }, [role, permissions])

    const getAllWorkflowRoutes = (workFlowsConfig) => {
        const allWorkFlowRoutes = [];
        workFlowsConfig.forEach((workFlow) => {
            const { launchUrl, childrenWorkflow } = workFlow;
            addAllRoute(allWorkFlowRoutes, launchUrl);
            addChildrenWorkflowRoute(allWorkFlowRoutes, childrenWorkflow);
        });
        updateAllBuilderRoutes([...allWorkFlowRoutes,
            {url: '/ProjectDetail'},
            {url: '/ProductLibrary'},
            {url: '/ProductHelp'}
        ]);
        return allWorkFlowRoutes;
    }

    const addAllRoute = (allWorkFlowRoutes, launchUrl) => {
        if (launchUrl) {
            const { selection, configuration, additional } = launchUrl;
            addRoute(allWorkFlowRoutes, selection);
            addRoute(allWorkFlowRoutes, configuration);
            addAdditionalRoute(allWorkFlowRoutes, additional);
        }
    }

    const addChildrenWorkflowRoute = (allWorkFlowRoutes, childrenWorkflow) => {
        if (childrenWorkflow && !!childrenWorkflow.length) {
            childrenWorkflow.forEach((childFlow) => {
                addAllRoute(allWorkFlowRoutes, childFlow.launchUrl);
            });
        }
    }

    const addRoute = async (allWorkFlowRoutes, route) => {
        if (route) {
            allWorkFlowRoutes.push(route);
        }
    }

    const addAdditionalRoute = (allWorkFlowRoutes, additionalRoute) => {
        if (additionalRoute && !!additionalRoute.length) {
            additionalRoute.forEach((route) => addRoute(allWorkFlowRoutes, route));
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const memoizedAllWorkflowRoutes = useMemo(() => getAllWorkflowRoutes(workFlowsConfig), [workFlowsConfig]);
    
    return (
        <Suspense fallback={<div></div>}>
            <Switch>
              <PrivateRoute exact path='/' component={Dashboard} props={privateConfigProps} />
              <PrivateRoute path='/ProjectDetail'  component={
                  getUrlInfo([breadcrumbText.isMultiTag]) ? MultiTagEditInfo : Projectinfo
              } props={privateConfigProps} />
              {memoizedAllWorkflowRoutes.map((route) => <PrivateRoute key={route.url} path={route.url} component={route.component} props={privateConfigProps} isBuilderRoute={true}/>)}
              <PrivateRoute path='/ProductLibrary' component={HelpAndLibrary} props={privateConfigProps} />
              <PrivateRoute path='/ProductHelp' component={HelpAndLibrary} props={privateConfigProps} />
              <PrivateRoute path="/authcallback" component={authcallback} props={privateConfigProps} />
              <Route exact path='/ErrorPage' component={Error} role={role} permissions={permissions} />
              <Route path="*"component={NotFound} />
            </Switch>
        </Suspense>
    )
}

const mapStateToProps = (state) => ({
    permissions: state.userProfile,
    role: state.locale.role
});

export default connect(mapStateToProps, { updateAllBuilderRoutes })(RouterConfig);