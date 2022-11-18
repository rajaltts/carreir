import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import { addLocaleData } from 'react-intl';
import nl from 'react-intl/locale-data/nl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import de from 'react-intl/locale-data/de';
import it from 'react-intl/locale-data/it';
import ru from 'react-intl/locale-data/ru';
import pl from 'react-intl/locale-data/pl';
import tr from 'react-intl/locale-data/tr';
import es from 'react-intl/locale-data/es';
import zh from 'react-intl/locale-data/zh';
import zht from 'react-intl/locale-data/zh';
import pt from 'react-intl/locale-data/pt';
import sv from 'react-intl/locale-data/sv';
addLocaleData([...nl, ...en, ...fr, ...de, ...it, ...ru, ...pl, ...tr, ...zh, ...zht, ...es, ...pt, ...sv]);

ReactDOM.render(<Provider store={store}>
    <Router>
        <App />
    </Router>
</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
