import React, { useState } from 'react';
import './footer.scss';
import { FormattedMessage as Culture } from 'react-intl';

const Footer = () => {
    const [currentYear] = useState(new Date().getFullYear())

    return (
        <footer>
            <div className="container">
                <div className="footer-wrapper">
                    <div className="links">
                        <a
                            href="http://www.carrier.com/carrier/en/us/privacy-notice/"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <Culture id="FooterPrivacyPolicy" />
                        </a>
                        <a
                            href="https://www.carrier.com/carrier/en/us/terms-of-use/"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <Culture id="FooterTermsOfUse" />
                        </a>
                        <a
                            href="https://www.carrier.com/carrier/en/worldwide/about/?location=us"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <Culture id="FooterContactUs" />
                        </a>
                    </div>
                    <div className="details">
                        <a
                            href="https://www.corporate.carrier.com/"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <Culture id="CarrierCorpName" />
                        </a>
                        &nbsp; | &nbsp;
                        <span>
                            &copy; {currentYear}&nbsp;
                            <Culture id="Carrier" />
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
