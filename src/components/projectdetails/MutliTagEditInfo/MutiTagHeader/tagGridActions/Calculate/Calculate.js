import React, { useContext } from 'react';
import { injectIntl } from "react-intl";
import { MultiTagContext } from '../../../multiTagContext'
import { translation } from "@carrier/ngecat-reactcomponents";
import CustomButton from '../../../../../common/controls/CustomButton';
import multiTagHeaderStyles from '../../multiTagHeaderStyles';
import { connect } from 'react-redux';

const Calculate = ({isLoading}) => {
    const { calculateCol, calculateButton } = multiTagHeaderStyles();
    const { calculateAction = () => { } } = useContext(MultiTagContext)
    const CalculateTag = () => {
        calculateAction && calculateAction()
    }
    return (
        !isLoading &&
        <div className={calculateCol}>
            <CustomButton
                showRipple={false}
                name={translation("MultiTagCalculate")}
                onClick={CalculateTag}
                isKeyboardAccessible
                className={calculateButton}
            />
        </div>
    )
}

const mapStateToProps = (state) => ({
    isLoading: state.tagList.isLoading
});

export default injectIntl(connect(mapStateToProps, null)(Calculate));