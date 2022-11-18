const env = process.env.REACT_APP_ENV
const tenant = 'carriertools.onmicrosoft.com'

export const appConfig = {
    api: {
        userManagement: 'https://api.carrierappshub.com/',
        eCatAppService: 'https://ecatappqarel.azurewebsites.net/',
        eCatApimAppService: 'https://suulca7hxg.execute-api.us-east-2.amazonaws.com/staging/ProjectTagMicroService/',
        eCatApimImportExportService: 'https://suulca7hxg.execute-api.us-east-2.amazonaws.com/staging/ImportExportMicroService/',
        eCatApimTagUpgradeService: 'https://suulca7hxg.execute-api.us-east-2.amazonaws.com/staging/TagUpgradeMicroService/',
        sapService: 'https://apim-carrier-qa.azure-api.net/sapqarel/',
        rulesAppServices: 'https://rulesapiqarel.azurewebsites.net/api/RulesEngine/',
        rulesEngineApi: 'https://stagingrulesengine.carrier.com/api/EcatEngine/',
        translationApi: 'https://app-translationservice-prod.azurewebsites.net/api/v1/translations/',
        templateApi: 'https://suulca7hxg.execute-api.us-east-2.amazonaws.com/staging/TemplateMicroservice/api/Template/',
        umDashboardNavigation: 'https://www.carrierappshub.com/',
        jsReport: 'https://apim-carrier.azure-api.net/',
        digitalEdr: 'https://suulca7hxg.execute-api.us-east-2.amazonaws.com/staging/DataLookupMicroservice/api/v0.1/',
        calcEngine: 'https://apim-carrier.azure-api.net/calcqarel/api/',
        ecodesign: 'https://ecodesignwizard.carrier.com/api/v1/ecodesign/',
        pricesManagement: 'https://pricesmanagement.carrier.com/',
        blobStorage: 'https://stecatbuildersqarel.blob.core.windows.net/',
        forgotpasswordAuthority: 'https://CarrierTools.b2clogin.com/' + tenant + '/B2C_1_ResetPassword/', // Forget password policy name
        profileEditing: 'https://login.microsoftonline.com/tfp/' + tenant + '/B2C_1_PROEDIT/', // Profile Edit
        clientScope1: 'https://' + tenant + '/ecatuistaging/user_impersonation',
        clientScope2: 'https://' + tenant + '/ecatuistaging/read',
        clientScope3: 'https://' + tenant + '/ecatuistaging/write',
        encryption: {
            IV: '8080808080808080',
            Key: '8080808080808080',
        },
        appAcessURl: 'https://ecatui-qarel.azurewebsites.net/',
        version: 'V 1.8',
        exportPMT: 'https://ecatui-qarel.azurewebsites.net/pmt/',
        drawingManagerUrl: 'https://ecatui-qarel.azurewebsites.net/drawingmanager',
        loginConfig: {
            apiUrl: 'https://api.carrierappshub.com/',
            uiUrl: 'https://ecatui-qarel.azurewebsites.net/',
        },
    },
}

export default appConfig
