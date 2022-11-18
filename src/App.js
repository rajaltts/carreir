import React from 'react';
import './App.scss';
import appConfig from './Environment/environments';
import Header from './components/common/header/header';
import Footer from './components/common/footer/footer';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import RouterConfig from './components/router';
import { withRouter } from 'react-router-dom';
import { loadProgressBar } from 'axios-progress-bar';
import 'axios-progress-bar/dist/nprogress.css';
import axios from 'axios';
import { ReactAuthWrapper } from '@carrier/reactauthwrapper';
import { updatePermissionsAndLocale } from './redux/Actions/appRolesAndLocaleUpdate';
import { getMessageString } from './redux/Actions/userPerference';
import { ThemeProvider } from '@material-ui/core'
import { theme } from '@carrier/ngecat-reactcomponents'
import { getProjectList, ApiService, endPoints } from "@carrier/workflowui-globalfunctions";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    if (localStorage.getItem("msal.idtoken")) {
      this.props.getProjectList(null, null, 'lastmodifieddate_desc', '', '');
    }
    this.props.getMessageString(this.props.leafLocale);
    loadProgressBar({ easing: 'ease-in-out', speed: 100, showSpinner: false }, axios);
  }

  authCallback = (data) => {
    this.props.updatePermissionsAndLocale({data, userRoles: this.props.userRoles});
    try {
      ApiService(`${appConfig.api.eCatAppService}${endPoints.GET_MIGRATION_STATUS}${data.oldEmailAddress}`)
    } catch(error) {
      console.error("Could not migrate user")
    }
  }

  renderMainApp = () => {
    const { lang, message, userPreferencesLoading } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <IntlProvider locale={lang} messages={message}>
          <>
            <Header />
            {!userPreferencesLoading ?
              <section className="section-wrapper">
                <div className="container">
                  <RouterConfig />
                </div>
              </section>
              :
              null
            }
            <Footer />
          </>
        </IntlProvider>
      </ThemeProvider>
    )
  }

  render() {
    return (
      <ReactAuthWrapper
        appConfig={appConfig.api.loginConfig}
        getPermissions={this.authCallback}
      >
        {this.renderMainApp()}
      </ReactAuthWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  userRoles: state.locale.userRoles,
  lang: state.locale.lang,
  message: state.locale.message,
  leafLocale: state.locale.leafLocale,
  userPreferencesLoading: state.locale.isLoading
});

export default withRouter(connect(mapStateToProps, { updatePermissionsAndLocale, getMessageString, getProjectList })(App));