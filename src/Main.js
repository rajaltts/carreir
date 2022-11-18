import React from 'react';
import RouterConfig from './components/router';
import messages from './utilities/messages';
import Header from './components/common/header/header';
import Footer from './components/common/footer/footer';
import { IntlProvider } from 'react-intl';
import {BrowserRouter as Router} from 'react-router-dom';

const MainApp = (props) => {
    const {lang} = props;
    return (<IntlProvider locale={lang} messages={messages[lang]}>
      <Router>
        <Header
          appPermissionsWithRoles={props.appPermissionsWithRoles}
        />
        <section className="section-wrapper">
          <div className="container">
            <RouterConfig role={props.role} permissions={props.permissions} />
          </div>
        </section>
        <Footer />
      </Router>
    </IntlProvider>)
}

export default MainApp;