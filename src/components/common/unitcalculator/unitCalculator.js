import React, { useState, useRef } from "react";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { translation, ConfirmModal } from "@carrier/ngecat-reactcomponents";
import "./UnitCalculator.scss";
import calculatorConfigData  from "./Calculator";
import { connect } from "react-redux";
import UnitConvertorControl from "./unitConvertorControl";
import { injectIntl } from 'react-intl'
import { HasPermission } from "@carrier/workflowui-globalfunctions";
import {ReactComponent as CalculatorIcon} from '../../../assets/images/Calculator.svg';

const UnitConversionCalculator = (props) => {
  const node = useRef();
  const unitConversionList = JSON.parse(JSON.stringify(calculatorConfigData));
  const [openDialouge, setOpenDialouge] = useState(false);
  const hasPermission = HasPermission(
    "Platform Permissions/Unit Conversion Calculator",
    props.PlatformPermissions
  );
  const toggleDialog = () => {
    setOpenDialouge(false);
  };

  return (
		hasPermission && (
			<div
				ref={node}
				className='dropdown'
				key='calculator'
				id='calculator'
			>
				<Tooltip title={translation('UnitCalculator')}>
					<IconButton
						role='button'
						className='dropdown-toggler'
						onClick={(e) => setOpenDialouge(true)}
					>
						<CalculatorIcon />
					</IconButton>
				</Tooltip>

				{openDialouge && (
					<ConfirmModal
						className='box'
						isModalOpen
						title={translation('UnitConversionCalculator')}
						hideCancel={false}
						id='UnitCalculator'
						key='UnitCalculator'
						onClose={toggleDialog}
					>
						<div className='unitConvertor-control-container'>
							{unitConversionList.Units.map((unit) => {
								return (
									<UnitConvertorControl
										key={unit.id}
										unit={unit}
									></UnitConvertorControl>
								);
							})}
						</div>
					</ConfirmModal>
				)}
			</div>
		)
  );
};
const mapStateToProps = (state) => ({
  PlatformPermissions: state.userProfile.permissions,
});
export default injectIntl(connect(mapStateToProps)(React.memo(UnitConversionCalculator)));
