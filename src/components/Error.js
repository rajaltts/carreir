import React from 'react';
import { translation } from '@carrier/ngecat-reactcomponents';
import appConfig from "../Environment/environments";

export default function Error(props) {
  const { isWorkflowPermission } = props;
  const styles = {
    textDecoration: "none",
    padding: "13px 20px",
    backgroundColor: "#262c43",
    color: "#ffffff",
    fontSize: "16px"
  }
  const idToken = localStorage.getItem("msal.idtoken");
  return (
    <div>
      {isWorkflowPermission ?
        <p>{translation("NO_VALID_ROLES")}</p>
        :
        <>
          <p>{translation("ApplicationPermission")}</p><br /><br />
          <a style = {styles} href={appConfig.api.umDashboardNavigation + "?umtoken=" + idToken}>{translation("OpenCAH")}</a>
        </>
      }
    </div>
  )
}
