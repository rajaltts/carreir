import React from 'react';
import {translation} from '../common/Utilities';

function NavigationBar(props) {
    return (
        <ul className="App-Breadcrumbs">
            <a href="/">
            {translation("Dashboard")}
            </a>
        </ul>     
    )
}

export default NavigationBar;