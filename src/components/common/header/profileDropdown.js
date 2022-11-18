import React, { useEffect, useState, useRef, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { logout } from './../../../auth-utils';
import { translation } from '@carrier/ngecat-reactcomponents';
import '../../../App.scss';
import { injectIntl } from 'react-intl';
import { FormatTransKey } from '@carrier/workflowui-globalfunctions';
import AboutEcat from './aboutEcat/AboutEcat';
import { Button, Tooltip } from '@material-ui/core';
import SettingDropdown from './settingDropdown';
import LangDropdown from './langDropdown';
import { connect } from 'react-redux';
import { updateLockedId } from "../../../redux/Actions/getTagList"

const ProfileDropdown = (props) => {
	const node = useRef();

	const [open, setOpen] = useState(false);
	const [openDialouge, setOpenDialouge] = useState(false);

	const handleClick = (e) => {
		if (node.current.contains(e.target)) {
			return;
		}
		setOpen(false);
	};
	const handleChange = (selectedValue) => {
		setOpenDialouge(true);
		setOpen(false);
	};
	const handleChangeOfRoles = (selectedObj) => {
		props.onChange(selectedObj);
	};
	const handleSignOut = () => {
		localStorage.removeItem('showDialog');
		if (!!props.projectListRecords.length) {
			props.updateLockedId()
		}
		logout();
	};
	const toggleDialog = () => {
		setOpenDialouge(false);
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClick);

		return () => {
			document.removeEventListener('mousedown', handleClick);
		};
	}, []);

	const UserNameButton = () => {
		const userNameInitials = props.fullName
			.split(' ')
			.splice(0, 2)
			.map((i) => i.charAt(0))
			.join('');

		return (
			<Tooltip title={props.fullName}>
				<Button
					role='button'
					className='user-name-button'
					onClick={(e) => setOpen(!open)}
				>
					{userNameInitials}
				</Button>
			</Tooltip>
		);
	};

	return (
		<div ref={node} className='dropdown' id='profiledd' data-label='profiledd'>
			<UserNameButton />
			{open && (
				<ul className='dropdown-menu listWidth'>
					<li>
						<p class='dropdown-switch-title'>
							Welcome {props.fullName}
						</p>
						<ul className='dropdown-switch'>
							{props.roles.map((opt, idx) => (
								<li
									className={
										opt === props.role ? 'active' : ''
									}
									key={idx}
									onClick={(e) => handleChangeOfRoles(opt)}
								>
									{translation(FormatTransKey(opt))}
								</li>
							))}
						</ul>
					</li>
					<li id='AboutEcatLink' onClick={(e) => handleChange()}>
						<FontAwesomeIcon icon={faInfoCircle} />
						{translation('AboutNGECat')}
					</li>
					<li>
						<p class='dropdown-switch-title'>Units</p>
						<SettingDropdown
							selectedItem={props.selectedUnit}
							onchange={props.onUnitChange}
						/>
					</li>
					<LangDropdown
						selectedItem={props.selectedLanguage}
						options={props.languageOptions}
						onChange={props.onLanguageChange}
					/>
					<li id='LogOutLink' onClick={(e) => handleSignOut()}>
						<FontAwesomeIcon icon={faLock} />
						{translation('LogOutDropdownItem')}
					</li>
				</ul>
			)}
			<AboutEcat openDialouge={openDialouge} onClose={toggleDialog} />
		</div>
	);
};

const mapStateToProps = (state) => ({
    projectListRecords: state.getProjectList.records
});

export default injectIntl(connect(mapStateToProps, { updateLockedId })(memo(ProfileDropdown)));
