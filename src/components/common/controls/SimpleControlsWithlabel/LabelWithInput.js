import React from 'react'

function LabelWithInput(props) {
    const { type, name, controlId, checked, labelText, OnControlChange, value, constant } = props;

    const onChangeHandler = (e) => {
        const { checked } = e.target;
        OnControlChange && OnControlChange(e.target.type === 'radio' ? e.target.value : checked, constant)
    }

    return (
        <label>
            <input
                type={type}
                name={name}
                id={controlId}
                onChange={onChangeHandler}
                checked={checked}
                value={value}
            />
            <span className="labelCss">{labelText}</span>
        </label>
    )
}

export default LabelWithInput;