const env = process.env.REACT_APP_ENV
const tenant = 'carriertools.onmicrosoft.com'

export const appConfig = {
    api: {
        userManagement: 'https://api.carrierappshub.com/',
        umDashboardNavigation: 'https://www.carrierappshub.com/',
        eCatAppService: 'https://ecatapp.azurewebsites.net/',
        eCatApimAppService: "https://suulca7hxg.execute-api.us-east-2.amazonaws.com/prod/ProjectTagMicroService/",
        eCatApimImportExportService: "https://suulca7hxg.execute-api.us-east-2.amazonaws.com/prod/ImportExportMicroService/",
        eCatApimTagUpgradeService: "https://suulca7hxg.execute-api.us-east-2.amazonaws.com/prod/TagUpgradeMicroService/",
        sapService: 'https://apim-carrier-qa.azure-api.net/sapprod/',
        rulesAppServices: 'https://prod.carrierrulesengine.com/api/eCatEngine/',
        rulesEngineApi: 'https://prod.carrierrulesengine.com/api/eCatEngine/',
        templateApi: "https://suulca7hxg.execute-api.us-east-2.amazonaws.com/prod/TemplateMicroservice/api/Template/",
        translationApi: 'https://app-translationservice-prod.azurewebsites.net/api/v1/translations/',
        jsReport: 'https://apim-carrier.azure-api.net/',
        digitalEdr: "https://suulca7hxg.execute-api.us-east-2.amazonaws.com/prod/DataLookupMicroservice/api/v0.1/",
        calcEngine: 'https://apim-carrier.azure-api.net/calcp/api/',
        ecodesign: 'https://ecodesignwizard.carrier.com/api/v1/ecodesign/',
        pricesManagement: 'https://pricesmanagement.carrier.com/',
        blobStorage: 'https://stecatbuildersprod.blob.core.windows.net/',
        forgotpasswordAuthority: 'https://login.microsoftonline.com/tfp/' + tenant + '/B2C_1_ResetPassword/', // Forget password policy name
        profileEditing: 'https://login.microsoftonline.com/tfp/' + tenant + '/B2C_1_PROEDIT/', // Profile Edit
        clientScope2: 'https://' + tenant + '/ecatuistaging/read',
        clientScope3: 'https://' + tenant + '/ecatuistaging/write',
        encryption: {
            IV: '8080808080808080',
            Key: '8080808080808080',
        },
        appAcessURl: 'https://ecat.carrier.com/',
        version: 'V 1.8',
        exportPMT: 'https://ecat.carrier.com/pmt/',
        drawingManagerUrl: 'https://ecat.carrier.com/drawingmanager',
        loginConfig: {
            apiUrl: 'https://api.carrierappshub.com/',
            uiUrl: 'https://ecat.carrier.com/',
        },
    },
}

export default appConfig
