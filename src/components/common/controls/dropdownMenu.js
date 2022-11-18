import React, { useState, cloneElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CustomButton from './CustomButton';
import classNames from 'classnames';

const useStyles = makeStyles((theme) => ({
  dropdownMenu: {
    position: "absolute",
    backgroundColor: "#ffffff",
    zIndex: "999",
    borderRadius: "4px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.175)",
    border: "1px solid grey"
  }
}));

const DropdownMenu = (props) => {
    const { id, children, buttonProps, className, dropdownMenuClass, showGradient=false } = props;
    const { dropdownMenu } = useStyles();
    const [open, setOpen] = useState(false);
    
    const clickAwayHandler = () => setOpen(false);

    const handleBtnClick = (event) => {
        setOpen(!open);
    }

    return (
        <ClickAwayListener onClickAway={clickAwayHandler}>
            <div id={id} className={classNames(className, 'dropdownButton')}>
                <CustomButton onClick={handleBtnClick} showDropdownIcon {...buttonProps} showGradient={showGradient}/>
                {open && (
                    <div className={classNames(dropdownMenuClass, dropdownMenu)}>
                        {children && cloneElement(children, { closeDropdown: handleBtnClick })}
                    </div>
                )}
            </div>
        </ClickAwayListener>
    )
}

export default DropdownMenu;
