module.exports = function override(config, env) {
        config.optimization.splitChunks = {
            chunks: 'all',
            maxInitialRequests: Infinity,
            cacheGroups: {
                reactVendor: {
                    test: /[\\/]node_modules[\\/](react|react-dom|react-app-polyfill|react-cool-onclickoutside|react-currency-input|react-dnd|react-dnd-html5-backend|react-dnd-touch-backend|react-intl|react-onclickoutside|react-redux|react-router-dom|react-scripts|react-spinners)[\\/]/,
                    name: 'reactVendor',
                    chunks: 'all'
                },
                utilityVendor: {
                    test: /[\\/]node_modules[\\/](lodash|moment|jwt-decode|jsreport-browser-client-dist|axios|axios-progress-bar|classnames|core-js|crypto-js)[\\/]/,
                    name: 'utilityVendor',
                    chunks: 'all'
                },
                reduxVendor: {
                    test: /[\\/]node_modules[\\/](redux|redux-thunk)[\\/]/,
                    name: 'reduxVendor',
                    chunks: 'all'
                },
                KendoUIVendor: {
                    test: /[\\/]node_modules[\\/](@progress)[\\/]/,
                    name: 'KendoUIVendor',
                    chunks: 'all'
                },
                materialUICoreVendor: {
                    test: /[\\/]node_modules[\\/](@material-ui[\\/]core)[\\/]/,
                    name: 'materialUICoreVendor',
                    chunks: 'all'
                },
                commonVendor: {
                    test: /[\\/]node_modules[\\/](|@carrier[\\/]ngecat-pricingfunctions|@carrier[\\/]ngecat-reactcomponents|@carrier[\\/]ngecat-unitsconversion|@carrier[\\/]workflowui-globalfunctions)[\\/]/,
                    name: 'commonVendor',
                    chunks: 'all'
                },
                materialUIIconVendor: {
                    test: /[\\/]node_modules[\\/](@material-ui[\\/]icons)[\\/]/,
                    name: 'materialUIIconVendor',
                    chunks: 'all'
                },
                fontAwesomeVendor: {
                    test: /[\\/]node_modules[\\/](@fortawesome)[\\/]/,
                    name: 'fontAwesomeVendor',
                    chunks: 'all'
                },
                xlsx: {
                    test: /[\\/]node_modules[\\/](react-export-excel-fixed-xlsx|file-saver|xlsx)[\\/]/,
                    name: 'xlsx',
                    chunks: 'all'
                },
                auth: {
                    test: /[\\/]node_modules[\\/](@carrier[\\/]reactauthwrapper)[\\/]/,
                    name: 'auth',
                    chunks: 'all'
                },
            },
        }
    return config;
}