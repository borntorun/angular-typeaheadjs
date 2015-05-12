var env = require('./env.js');

exports.config = {
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,

    framework: 'jasmine',

    specs: [
        '../e2e/local_spec.js'
    ],

    capabilities: require('./' + process.env.BROWSER + process.env.BROWSERVERSION).config,

    baseUrl: env.baseUrl,
    rootElement: 'body',

    // Up the timeouts for the slower browsers (IE, Safari).
    //allScriptsTimeout: 30000,
    //getPageTimeout: 30000,

    jasmineNodeOpts: {
        isVerbose: true,
        showTiming: true,
        showColors: true,
        defaultTimeoutInterval: 90000
    }
};
