//exports.config = {
//    seleniumAddress: 'http://localhost:4444/wd/hub',
//    specs: ['spec.js'],
//    rootElement: 'html',
//    jasmineNodeOpts: {
//        showColors: true,
//        defaultTimeoutInterval: 30000,
//        isVerbose: true
//    }
//}
// An example configuration file.
exports.config = {
    directConnect: true,

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },

    // Spec patterns are relative to the current working directly when
    // protractor is called.
    specs: ['local_spec.js'],

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};
