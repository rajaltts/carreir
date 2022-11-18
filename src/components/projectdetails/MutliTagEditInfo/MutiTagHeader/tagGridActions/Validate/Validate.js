import React, { useContext } from 'react';
import { injectIntl } from "react-intl";
import { Checkbox } from '@material-ui/core';
import { translation } from "@carrier/ngecat-reactcomponents";
import CustomButton from '../../../../../common/controls/CustomButton';
import multiTagHeaderStyles from '../../multiTagHeaderStyles';
import { MultiTagContext } from '../../../multiTagContext'
import { connect } from 'react-redux';

const Validate = ({isLoading}) => {
    const { calculateCol, calculateButton, calculateCheckBox, calculateText, validateCheckbox } = multiTagHeaderStyles();
    const { validateAction = () => { }, setIsAutoValidate, isAutoValidate } = useContext(MultiTagContext)

    const ValidateTag = () => {
        validateAction && validateAction()
    }

    const handleChange = (event) => {
        setIsAutoValidate(!isAutoValidate);
    };

    const keyCodeHandler = (event) => {
        if (event.key === 'Enter') {
            setIsAutoValidate(!isAutoValidate);
        }
    }

    return (
        !isLoading &&
        <div className={calculateCol}>
            <CustomButton
                name={translation("MultiTagValidate")}
                onClick={ValidateTag}
                className={calculateButton}
                showRipple={false}
                isKeyboardAccessible
            />
            <div className={calculateCheckBox}>
                <Checkbox color="primary"  checked={isAutoValidate} onKeyPress={keyCodeHandler} className={validateCheckbox} tabIndex={2} onChange={handleChange} />
                <span className={calculateText}>{translation("MultiTagAuto")}</span>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    isLoading: state.tagList.isLoading
});

export default injectIntl(connect(mapStateToProps, null)(Validate));