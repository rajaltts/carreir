import React from 'react';
import { DynamicIcon } from '@carrier/ngecat-reactcomponents';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import classNames from 'classnames'

const useButtonStyles = makeStyles((theme) => ({
    labelMargin: {
        marginLeft: "7px"
    },
    primary: {
        border: '0px !important',
        padding: "8px 16px 8px 6px",
        boxShadow: '0px 11px 12px -10px rgba(4, 105, 221, 0.7)',
        '&:hover': {
            background:
                'linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), linear-gradient(99.7deg, #15205E -19.43%, #0076F4 80.93%)',
        },
    },
    buttonRoot: {
        fontSize: '1rem',
        lineHeight: '19px',
        textTransform: 'none',
        padding: "7px 16px 7px 6px",
        border: '1px solid #BAC0D0',
        borderRadius: '4px',
        minHeight: "40px",
        backgroundColor: 'transparent',
        color: '#333333',
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    caret: {
        display: "inline-block",
        borderTop: "6px solid #333333",
        borderLeft: "4px solid transparent",
        borderRight: "4px solid transparent",
        verticalAlign: "middle",
        marginLeft: "12px",
        backgroundColor: "transparent",
        whiteSpace: "nowrap",
        overflow: "hidden",
    },
    
    iconStyles: {
        marginRight: '2px'
    },
    gradient: {
        background: "linear-gradient(99.7deg, #15205E -19.43%, #0076F4 80.93%)",
        color: "white !important",
        "& span[id='caret']": {
            borderTopColor: "white",
        }
    },
    disabledStyle: {
        opacity: '0.26'
    }
}));

const CustomButton = (props) => {
    const { buttonRoot, caret, gradient, labelMargin, iconStyles, primary, disabledStyle } = useButtonStyles();
    const { id, disabled, onClick, iconProps, name, className = '', showDropdownIcon, showGradient = false, iconComponenet, showRipple = true, isKeyboardAccessible = false } = props;

    const onClickHandler = (event) => {
        event.preventDefault();
        onClick && onClick(event);
    }

    const getIconElement = () => {
        if (!(iconProps || iconComponenet)) { return null };
        if (iconComponenet) {
            return React.cloneElement(iconComponenet, {className: iconStyles});
        }
        return <DynamicIcon {...iconProps} />
    }

    const stylesName = showGradient && !disabled ? classNames(className, primary, gradient, buttonRoot) : classNames(className, buttonRoot);

    return (
        <Button
            className={stylesName}
            size="small"
            variant="outlined"
            color="default"
            key={id}
            id={id}
            onClick={onClickHandler}
            disabled={disabled}
            disableFocusRipple={showRipple}
            disableRipple={showRipple}
            tabIndex={isKeyboardAccessible ? 2 : -1}
        >
            {getIconElement()}
            <span className={iconProps && labelMargin}>{name}</span>
            {showDropdownIcon && <span id="caret" className={classNames(caret, disabled && disabledStyle)} />}
        </Button>
    )
}

export default CustomButton;