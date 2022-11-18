import React, { useEffect, memo } from "react";
import { translation, ConfirmModal } from '@carrier/ngecat-reactcomponents';
import batchUpgradeStyles from "./BatchUpgradeStyles";
import { upgradeStart, upgradeClose } from '../../../../../redux/Actions/upgradeAction';
import { refreshTagGrid } from '../../../../../redux/Actions/getTagList';
import { connect } from "react-redux";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import CircularProgress from '@material-ui/core/CircularProgress';
import { tagUpgradeStatus ,FormatTransKey} from "@carrier/workflowui-globalfunctions";
import CustomButton from '../../../../common/controls/CustomButton';
import classNames from 'classnames'

const UpgradeDialog = (props) => {
  const { upgradeStart, tagsUpgradeStatus, upgradeEligibleTags=null, dataItem: tagData, showUpgradeDialog=true,
    upgradeClose, isUpgradeCompleted, refreshTagGrid, hideComponent } = props;
  const { batchUpgradeHeader, batchUpgradeCell, batchUpgradeFooter,
    successIcon, failureIcon, progressIcon, batchUpgradeTable, upgradeMessageText } = batchUpgradeStyles();

  useEffect(() => {
    if (showUpgradeDialog) {
      upgradeStart(upgradeEligibleTags || [tagData]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showUpgradeDialog]);

  const closeUpgradeDialogHandler = () => {
    if (isUpgradeCompleted) {
      refreshTagGrid();
      upgradeClose();
      hideComponent && hideComponent();
    }
  }

  const getStatusImage = (status) => {
    switch (status) {
      case tagUpgradeStatus.InProgress: return <CircularProgress className={progressIcon} />
      case tagUpgradeStatus.UpgradeCompleted: return <CheckCircleIcon className={successIcon} />
      case tagUpgradeStatus.UpgradeFailed:
      case tagUpgradeStatus.UpgradeCompletedWithError:
      case tagUpgradeStatus.ApiFailed: return <ErrorIcon className={failureIcon} />
      default: return null
    }
  }

  const createBulkUpgradeStatusComponent = (bulkUpgradeDetail) => {
    const { tagInfo } = bulkUpgradeDetail;
    return (
      Object.keys(tagInfo).map(key => {
        const { tagName, tagModel, status, upgradeMessage } = tagInfo[key];
        return (
          <tr key={tagName}>
            <td className={batchUpgradeCell}>
              {getStatusImage(status)}
            </td>
            <td title={tagName} className={batchUpgradeCell}>{tagName}</td>
            <td title={tagModel} className={batchUpgradeCell}>{tagModel}</td>
            <td title={upgradeMessage} className={classNames(upgradeMessageText, batchUpgradeCell)}>{ upgradeMessage && translation(FormatTransKey(upgradeMessage),upgradeMessage) }</td>
          </tr>
        )
      }
      )
    )
  }

  const getFooterButton = () => {
    return (
      <CustomButton
        name={translation("ButtonTextOk", "Ok")}
        id="UpgradeOkButton"
        disabled= {!isUpgradeCompleted}
        onClick={closeUpgradeDialogHandler}
      />
    )
}

return (
    <ConfirmModal
      isModalOpen={showUpgradeDialog}
      title={translation("BulkTagUpgrade")}
      footerComponent={getFooterButton()}
      hideCancel
      disableCloseIcon={true}
      footerClassName={batchUpgradeFooter}
    >
      <div className={batchUpgradeTable}>
        <table className="table">
          <thead>
            <tr>
              <th className={batchUpgradeHeader}>
                {translation("STATUS_TEXT")}
              </th>
              <th className={batchUpgradeHeader}>
                {translation("SelectionName")}
              </th>
              <th className={batchUpgradeHeader}>
                {translation("SSModel")}
              </th>
              <th className={batchUpgradeHeader}>
                {translation("UPGRADE_MESSAGE")}
              </th>
            </tr>
          </thead>
          <tbody>
            {tagsUpgradeStatus.map((bulkUpgradeDetail, index) => createBulkUpgradeStatusComponent(bulkUpgradeDetail, index))}
          </tbody>
        </table>
      </div>
    </ConfirmModal>
  );
};

const mapStateToProps = (state) => ({
  tagsUpgradeStatus: state.upgradeReducer.tagsUpgradeStatus,
  isUpgradeCompleted: state.upgradeReducer.isUpgradeCompleted
});

export default connect(
  mapStateToProps,
  { upgradeStart, upgradeClose, refreshTagGrid }
)(memo(UpgradeDialog))