import React, { useContext } from "react";
import { injectIntl } from "react-intl";
import { connect } from 'react-redux';
import { translation } from "@carrier/ngecat-reactcomponents";
import multiTagHeaderStyles from './multiTagHeaderStyles';
import CustomButton from '../../../common/controls/CustomButton';
import CloseIcon from "@material-ui/icons/Close";
import { faSave } from '@fortawesome/free-solid-svg-icons';
import Undo from './tagGridActions/Undo/undo';
import Redo from './tagGridActions/Redo/redo';
import Calculate from "./tagGridActions/Calculate/Calculate";
import Validate from "./tagGridActions/Validate/Validate";
import TagGridActions from './tagGridActions/tagGridActions';
import { MultiTagContext } from '../multiTagContext'

const MultiTagHeader = ({isLoading}) => {

  const { backToSelectionSummary, gridActions, setOpenDialog, saveMultiTagList,
    unlockTags, closeMultiTag } = useContext(MultiTagContext);
  const { tagHeader, closeIcon, closeIconDiv, tagTitle, tagGrid, undoRedoCol, tagGridCol, saveCol, saveButton } = multiTagHeaderStyles();
  
  const closeMultiTagGrid = async () => {
    if (closeMultiTag) {
      return setOpenDialog(true)
    }
    else{
      await unlockTags()
      backToSelectionSummary();
    }
  }

  const keyCodeHandler = (event) => {
    if (!event.ctrlKey && !event.altKey && !event.shiftKey && event.keyCode === 13) {
      closeMultiTagGrid()
    }
  }
  
  return (
    <div className={tagHeader}>
      <div className={tagGrid}>
        <div className={tagTitle}>{translation("MultiTagEdit")}</div>
      </div>
      {false && (
        <div className={tagGrid}>
          <div className={undoRedoCol}>
            <Undo />
            <Redo />
          </div>
        </div>
      )}
      <TagGridActions gridActions={gridActions} />
      <div className={tagGridCol}>
        <Validate />
        <Calculate />
      </div>
      <div className={tagGrid}>
        <div className={tagGridCol}>
          <div className={saveCol}>
            <CustomButton
              name={translation("MultiTagSave")}
              onClick={saveMultiTagList}
              iconProps={{ icon: faSave, alt: translation("MultiTagSave") }}
              className={saveButton}
              disabled={isLoading}
              showRipple={false}
              isKeyboardAccessible
            />
          </div>
        </div>
        <div tabIndex={2} className={closeIconDiv} onKeyDown={keyCodeHandler} onClick={closeMultiTagGrid}>
          <CloseIcon
            fontSize="small"
            className={closeIcon}
            titleAccess={translation("MultiTagClose")}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.tagList.isLoading
});

export default injectIntl(connect(mapStateToProps, null)(MultiTagHeader));
