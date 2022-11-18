import React, {useRef } from 'react';
import { translation } from '@carrier/ngecat-reactcomponents';

const SettingDropdown = (props) => {
	const node = useRef();

	const handleChange = (val) => {
		props.onchange(val);
	};

	return (
		<ul ref={node} className='dropdown-switch'>
			<li
				id='metric'
				className={props.selectedItem === 'Metric' ? 'active' : ''}
				onClick={(e) => handleChange('Metric')}
			>
				{translation('Metric')}
			</li>
			<li
				id='imperial'
				className={props.selectedItem === 'English' ? 'active' : ''}
				onClick={(e) => handleChange('English')}
			>
				{translation('Imperial')}
			</li>
		</ul>
	);
};

export default SettingDropdown;
