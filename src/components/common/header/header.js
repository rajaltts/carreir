import React from 'react';
import './header.scss';
import Logo from './../../../assets/images/LogoEcat.svg'
import HelpLibraryDropdown from './helpLibraryDropdown';
import ProfileDropdown from './profileDropdown';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { UserPerference } from '../../../redux/Actions/userPerference';
import { LangOpt, getLanguageDetails } from './../../../utilities/languagesutils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { getProjectList, showSuccessNotification, showErrorNotification, showInfoNotification, ApiService, endPoints } from "@carrier/workflowui-globalfunctions";
import { withRouter } from 'react-router-dom';
import Notifications from '../controls/notification/notifications';
import { intlShape, injectIntl } from "react-intl";
import UnitCalculator from '../unitcalculator/unitCalculator';
import CustomBreadcrumb from '../../../components/common/controls/CustomBreadcrumb';
import CustomLoader from '../controls/CustomLoader/customLoader';
import SaveTagDialogue from './../../common/SaveTag/saveTagDialogue';
import SaveTemplateDialog from './../../common/SaveTemplate/saveTemplateDialog';
import { updateLockedId } from "../../../redux/Actions/getTagList"
import NotificationsList from '../../notificationsList/NotificationsList';
import SessionTimerAndModal from "./sesssionTimerAndModal"
import QuoteSelections from "../QuoteSelections/QuoteSelections";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: getLanguageDetails('English'),
            unit: props.locale.unit,
            isUnitChange: false,
            userRoles: props.locale.userRoles,
            role: props.locale.role
        }
    }

    static getDerivedStateFromProps(props, state) {
        const lang = getLanguageDetails(props.locale.name);
        const unit = props.locale.unit;

        return { 
            ...state,
            role: props.locale.role,
            lang: lang,
            unit: unit,
            userRoles: props.locale.userRoles
        };
    }

    showNotification = (text) => {
        this.props.showInfoNotification(text)
    }

    handleChangeRoles = (role) => {
        this.updateUserPreference({
            opt: this.state.lang,
            unit: this.state.unit,
            role: role,
            isUnitChange: this.state.isUnitChange
        })
    }

    updateUserPreference = ({opt, unit, role, isUnitChange, succesCallback='', failureCallback=''}) => {
        this.props.UserPerference({
            opt: opt,
            unit: unit,
            role: role,
            isUnitChange: isUnitChange,
            succesCallback: succesCallback,
            failureCallback: failureCallback
        });
    }

    handleChangeLang = (opt) => {
        let unit = (this.state.unit === "English") ? "English" : "Metric";
        this.updateUserPreference({
            opt: opt,
            unit: unit,
            role: this.state.role,
            isUnitChange: this.state.isUnitChange,
            succesCallback: this.succesCallback,
            failureCallback: this.failureCallback
        })
    }

    succesCallback = () => {
        this.props.showSuccessNotification(this.injectIntlTranslation("SettingsSaveSuccessMessage"));
    }

    failureCallback = () => {
        this.props.showErrorNotification(this.injectIntlTranslation("GenericErrorMessage"));
    }

    showQuoteSelectionError = (errorMsg) => {
        this.props.showErrorNotification(errorMsg || this.injectIntlTranslation("GenericErrorMessage"));
    }

    handleChangeUnit = (value) => {
        this.updateUserPreference({
            opt: this.state.lang,
            unit: value,
            role: this.state.role,
            isUnitChange: true,
            succesCallback: this.succesCallback,
            failureCallback: this.failureCallback
        })
    }

    homeClick = () => {
        !!this.props.projectListRecords.length && this.props.updateLockedId()
        if (this.props.location.pathname === '/') {
            window.location.reload();
        }
    }

    injectIntlTranslation = (id) => {
        const intl = this.props.intl;
        return intl.formatMessage({
            id: id
        })
    }

    render() {
        return (
			<>
				<header>
					<div className='container'>
						<div className='header-wrapper'>
							<div className='brand-logo'>
								<Link
									to='/'
									id='EcatLogoLink'
									onClick={this.homeClick}
								>
									<img id='EcatLogo' src={Logo} alt='E CAT' />
								</Link>
								<Link to='/' id="HomeIconLink" className="btn-home" onClick={this.homeClick}><FontAwesomeIcon id="HomeIcon" icon={faHome} /></Link>
							</div>
							<div className='header-right-content'>
								<CustomBreadcrumb />
								<nav className='dropdown-right'>
                                    <SessionTimerAndModal />
									<UnitCalculator />
                                    <NotificationsList />
									<ProfileDropdown
										fullName={this.props.fullName}
										roles={this.state.userRoles}
										role={this.state.role}
										onChange={this.handleChangeRoles}
										selectedUnit={this.state.unit}
										onUnitChange={this.handleChangeUnit}
										selectedLanguage={this.state.lang}
										languageOptions={LangOpt}
										onLanguageChange={this.handleChangeLang}
									/>
									<HelpLibraryDropdown />
								</nav>
							</div>
						</div>
					</div>
				</header>

				<div className='container'>
					<Notifications />
				</div>
				<CustomLoader
					showLoaderImage
					loadertext={this.props.loadertext}
                    visible={this.props.isLoading}
                    showFullPageLoader={this.props.showFullPageLoader}
				/>
				<SaveTagDialogue />
				<SaveTemplateDialog />
                <QuoteSelections errorHandler={this.showQuoteSelectionError}/>
			</>
		);
    }
}

const mapStateToProps = (state) => ({
    projectList: state.getProjectList,
    isLoading: state.loader.isLoading,
    loadertext: state.loader.loadertext,
    showFullPageLoader: state.loader.showFullPageLoader,
    locale: state.locale,
    permissions: state.userProfile.permissions,
    fullName: state.userProfile.fullName,
    oldUserName: state.userProfile.oldEmailAddress,
    projectListRecords: state.getProjectList.records
});

Header.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl(withRouter(connect(mapStateToProps, {
    UserPerference, getProjectList, showSuccessNotification, showErrorNotification,
    showInfoNotification, updateLockedId
})(Header)));