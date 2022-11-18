import Asia19DVConfig from "@carrier/ngecat-19dvasia-ui/asia19DVConfig";
import PackagedChillersAsiaConfig from "@carrier/ngecat-packagedchillersasia/PackagedChillersAsiaConfig";
import NAConfig from "@carrier/ngecat-appliedchillerna-ui/NAConfig";
import AppliedRooftopsNAOConfig from "@carrier/ngecat-appliedrooftopsnao/Config";
import PackagedChillersEMEAConfig from "@carrier/ngecat-packagedchillersemea/PackagedChillersEMEAConfig";
import PackagedRooftopsEMEAConfig from "@carrier/ngecat-packagedrooftopsemea/PackagedRooftopsEMEAConfig";
import PackagedFanCoilsEMEAConfig from "@carrier/ngecat-packagedfancoilsemea/PackagedFanCoilsEMEAConfig";
import PackagedControlEMEAConfig from "@carrier/ngecat-packagedcontrolemea/PackagedControlEMEAConfig";
import PackagedCommonWorkflowConfig from "@carrier/ngecat-packagedcommonworkflow/Config";
import UnitVentConfig from "@carrier/ngecat-unitventsnao/Config";
import PackageChillersNAOConfig from "@carrier/ngecat-packagechillersnao/Config";
import DOASWorkflowConfig from "@carrier/ngecat-na-doas-ui/DOASWorkflowConfig";
import NAFanCoilsConfig from "@carrier/ngecat-na-fancoils-ui/NAFanCoilsConfig";
import WSHPConfig from "@carrier/ngecat-wshp-ui/WSHPConfig";

export const workflowsConfig = [
  { ...Asia19DVConfig },
  { ...PackagedChillersAsiaConfig },
  { ...NAConfig },
  { ...AppliedRooftopsNAOConfig },
  { ...PackageChillersNAOConfig },
  { ...PackagedChillersEMEAConfig },
  { ...PackagedRooftopsEMEAConfig },
  { ...PackagedFanCoilsEMEAConfig },
  { ...PackagedControlEMEAConfig },
  { ...PackagedCommonWorkflowConfig },
  { ...UnitVentConfig },
  { ...DOASWorkflowConfig },
  { ...NAFanCoilsConfig },
  { ...WSHPConfig },
];

export default workflowsConfig;
