const env = process.env.REACT_APP_ENV
const tenant = 'carriertools.onmicrosoft.com'

export const appConfig = {
    api: {
        userManagement: 'https://api.carrierappshub.com/',
        eCatAppService: 'https://ecatappstaging.azurewebsites.net/',
        eCatApimAppService: "https://suulca7hxg.execute-api.us-east-2.amazonaws.com/staging/ProjectTagMicroService/",
        eCatApimImportExportService: "https://suulca7hxg.execute-api.us-east-2.amazonaws.com/staging/ImportExportMicroService/",
        eCatApimTagUpgradeService: "https://suulca7hxg.execute-api.us-east-2.amazonaws.com/staging/TagUpgradeMicroService/",
        sapService: 'https://apim-carrier-qa.azure-api.net/sapstage/',
        rulesAppServices: 'https://staging.carrierrulesengine.com/api/eCatEngine/',
        rulesEngineApi: 'https://staging.carrierrulesengine.com/api/eCatEngine/',
        translationApi: 'https://app-translationservice-prod.azurewebsites.net/api/v1/translations/',
        templateApi: "https://suulca7hxg.execute-api.us-east-2.amazonaws.com/staging/TemplateMicroservice/api/Template/", 
        umDashboardNavigation: 'https://www.carrierappshub.com/',
        jsReport: 'https://apim-carrier.azure-api.net/',
        digitalEdr: "https://suulca7hxg.execute-api.us-east-2.amazonaws.com/staging/DataLookupMicroservice/api/v0.1/",
        calcEngine: 'https://apim-carrier.azure-api.net/calcstage/api/',
        ecodesign: 'https://ecodesignwizard.carrier.com/api/v1/ecodesign/',
        blobStorage: 'https://stecatbuildersstage.blob.core.windows.net/',
        pricesManagement: 'https://pricesmanagement.carrier.com/',
        forgotpasswordAuthority: 'https://login.microsoftonline.com/tfp/' + tenant + '/B2C_1_ResetPassword/', // Forget password policy name
        profileEditing: 'https://login.microsoftonline.com/tfp/' + tenant + '/B2C_1_PROEDIT/', // Profile Edit
        clientScope2: 'https://' + tenant + '/ecatuistaging/read',
        clientScope3: 'https://' + tenant + '/ecatuistaging/write',
        postLogoutRedirectUri: 'https://stagingecat.carrier.com/',
        encryption: {
            IV: '8080808080808080',
            Key: '8080808080808080',
        },
        appAcessURl: 'https://stagingecat.carrier.com/',
        version: 'V 1.8',
        exportPMT: 'https://stagingecat.carrier.com/pmt/',
        drawingManagerUrl: 'https://stagingecat.carrier.com/drawingmanager',
        loginConfig: {
            apiUrl: 'https://api.carrierappshub.com/',
            uiUrl: 'https://stagingecat.carrier.com/',
        },
    },
}

export default appConfig
