import React, { useState, useEffect, memo } from "react";
import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons";
import { translation } from '@carrier/ngecat-reactcomponents';
import CustomButton from '../../../../common/controls/CustomButton';
import { fetchUpgradeEnableTags } from "../../../projectInfoUtil";
import batchUpgradeStyles from "./BatchUpgradeStyles";
import { connect } from "react-redux";
import UpgradeDialog from "./UpgradeDialog";

const BatchUpgrade = (props) => {
  const { selectedTagData } = props;
  const [showBulkUpgradeDialog, setShowBulkUpgradeDialog] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [upgradeEligibleTags, setUpgradeEligibleTags] = useState([]);
  const { batchUpgradeContainer } = batchUpgradeStyles();

  useEffect(() => {
    const upgradeEligibleTags = fetchUpgradeEnableTags({ tagList: selectedTagData });
    if (upgradeEligibleTags.length > 0) {
      setIsButtonDisabled(false);
      setUpgradeEligibleTags(upgradeEligibleTags);
    }
    else {
      setIsButtonDisabled(true);
      setUpgradeEligibleTags([])
    }
  }, [selectedTagData]);

  const closeBatchUpgradeDialog = () => {
    setIsButtonDisabled(true);
    setShowBulkUpgradeDialog(false);
  }

  return (
    <div className={batchUpgradeContainer}>
      <CustomButton
        name={translation("BatchUpgrade")}
        id={"BatchUpgrade"}
        iconProps={{ icon: faArrowCircleUp }}
        disabled={isButtonDisabled}
        onClick={() => setShowBulkUpgradeDialog(true)}
      />
      <UpgradeDialog
          showUpgradeDialog={showBulkUpgradeDialog}
          hideComponent={closeBatchUpgradeDialog}
          upgradeEligibleTags={upgradeEligibleTags}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  selectedTagData: state.tagList.selectedTags,
  lang: state.locale.leafLocale
});

export default connect(mapStateToProps, null)(memo(BatchUpgrade))