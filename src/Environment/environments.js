const tenant = 'carriertools.onmicrosoft.com';
let appAcessURl;

if (process.env.NODE_ENV === "development") {
    appAcessURl = 'https://ecatui-dev.azurewebsites.net/';
} else {
    appAcessURl = 'https://ecatui-dev.azurewebsites.net/'
}

export const appConfig = {
    api: {
        userManagement: 'https://api.carrierappshub.com/',
        eCatAppService: 'https://ngecatapplicationservicedev.azurewebsites.net/',
        eCatApimAppService: 'https://0b7g9r1zqg.execute-api.us-east-2.amazonaws.com/qa/ProjectTagMicroService/',
        eCatApimImportExportService: 'https://0b7g9r1zqg.execute-api.us-east-2.amazonaws.com/qa/ImportExportMicroService/',
        eCatApimTagUpgradeService: 'https://0b7g9r1zqg.execute-api.us-east-2.amazonaws.com/qa/TagUpgradeMicroService/',
        sapService: 'https://apim-carrier-qa.azure-api.net/sapq/',
        rulesAppServices: 'https://dev.carrierrulesengine.com/api/EcatEngine/', //'http://localhost:57884/api/EcatEngine/'
        rulesEngineApi: 'https://dev.carrierrulesengine.com/api/EcatEngine/', //'http://localhost:57884/api/EcatEngine/'
        templateApi: 'https://0b7g9r1zqg.execute-api.us-east-2.amazonaws.com/qa/TemplateMicroservice/api/Template/',
        translationApi: 'https://app-translationservice-prod.azurewebsites.net/api/v1/translations/',
        umDashboardNavigation: "https://www.carrierappshub.com/",
        blobStorage: "https://stecatbuildersdev.blob.core.windows.net/",
        jsReport: "https://apim-carrier-qa.azure-api.net/",
        digitalEdr: 'https://0b7g9r1zqg.execute-api.us-east-2.amazonaws.com/qa/DataLookupMicroservice/api/v0.1/',
        calcEngine: 'https://apim-carrier-qa.azure-api.net/calcq/api/',
        ecodesign: 'https://qaecodesignwizard.carrier.com/api/v1/ecodesign/',
        pricesManagement: "https://qapricesmanagement.carrier.com/",
        forgotpasswordAuthority: "https://login.microsoftonline.com/tfp/" + tenant + "/B2C_1_ResetPassword/", // Forget password policy name
        profileEditing: "https://login.microsoftonline.com/tfp/" + tenant + "/B2C_1_PROEDIT/", // Profile Edit
        clientScope2: "https://" + tenant + "/ecatuistaging/read",
        clientScope3: "https://" + tenant + "/ecatuistaging/write",
        eCatImportConnectUrl:"https://ecatimportqa.s3.us-east-2.amazonaws.com",
        encryption: {
            IV: "8080808080808080",
            Key: "8080808080808080"
        },
        appAcessURl: appAcessURl,
        exportPMT: "https://ecatui-dev.azurewebsites.net/pmt/",
        drawingManagerUrl: 'https://ecatui-dev.azurewebsites.net/drawingmanager',
        loginConfig: {
            apiUrl: 'https://api.carrierappshub.com/',
            uiUrl: appAcessURl
        }
    },
}
export default appConfig;