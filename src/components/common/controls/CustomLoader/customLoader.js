import React from "react";
import { css } from "@emotion/core";
import { connect } from "react-redux";
import { HashLoader } from "react-spinners";
import customLoaderStyles from "./customLoaderStyles";
import { showInfoNotification } from "@carrier/workflowui-globalfunctions";
import { ConfirmModal } from '@carrier/ngecat-reactcomponents';

const override = css`
  margin: auto;
`;

const CustomLoader = (props) => {
  const {
    showLoaderImage,
    loadertext,
    visible,
    showInfoNotification,
    showFullPageLoader = true,
  } = props;
  const { dialogRoot, contentClass, pageLoaderContent } = customLoaderStyles();
  // to-do: remove hash loader and keep new loader
  return showFullPageLoader ? (
    <ConfirmModal
      isModalOpen={visible}
      hideActions
      hideHeader
      dialogClassName={dialogRoot}
      contentClassName={contentClass}
    >
      <p id="customFullPageLoder" className={pageLoaderContent}>
        {showLoaderImage && (
          <HashLoader
            css={override}
            sizeUnit={"px"}
            size={25}
            color={"ffffff"}
            loading={true}
          />
        )}
        {loadertext && (
          <b>
            <font size="6">{loadertext}</font>
          </b>
        )}
      </p>
    </ConfirmModal>
  ) : (
    <>
      {visible && showInfoNotification(loadertext, false, true)}
    </>
  );
};
export default connect(null, { showInfoNotification })(
  React.memo(CustomLoader)
);
