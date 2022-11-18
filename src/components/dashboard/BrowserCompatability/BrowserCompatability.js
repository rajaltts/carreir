import React from 'react';
import './BrowserCompatability.scss';

const browserIcons = "/Images/icons/";

const BrowserCompatability = () => {
    return (
        <div className="browser-warning">
            <div className="browser-warning-container">
                <h2>
                    We don't support this browser at this time.
                </h2>
                <span>Use the Chrome browser instead.</span>
                <div className="browsers-list">
                    <div className="chrome-link">
                        <img src={`${browserIcons}chrome.png`} alt="crome" />
                        <a href="https://www.google.com/chrome/">Download Google Chrome</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BrowserCompatability
