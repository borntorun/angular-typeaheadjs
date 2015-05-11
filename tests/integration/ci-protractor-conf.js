var env = require('./env.js');

exports.config = {
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,

    framework: 'jasmine',

    specs: [
        '../e2e/local_spec.js'
    ],

    // Two latest versions of Chrome, Firefox, IE, Safari.
    // TODO - add mobile.
    multiCapabilities: [{
        'browserName': 'chrome',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'build': process.env.TRAVIS_BUILD_NUMBER,
        'name': 'angular-typeaheadjs e2e tests',
        'version': '40',
        'selenium-version': '2.45.0',
        'chromedriver-version': '2.14',
        'platform': 'OS X 10.9'
    }, {
        'browserName': 'firefox',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'build': process.env.TRAVIS_BUILD_NUMBER,
        'name': 'angular-typeaheadjs e2e tests',
        'version': '36',
        'selenium-version': '2.45.0'
    }, {
        'browserName': 'safari',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'build': process.env.TRAVIS_BUILD_NUMBER,
        'name': 'angular-typeaheadjs e2e tests',
        'version': '7',
        'selenium-version': '2.44.0'
    }, {
        'browserName': 'safari',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'build': process.env.TRAVIS_BUILD_NUMBER,
        'name': 'angular-typeaheadjs e2e tests',
        'version': '8',
        'selenium-version': '2.44.0'
    }, {
        'browserName': 'internet explorer',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'build': process.env.TRAVIS_BUILD_NUMBER,
        'name': 'angular-typeaheadjs e2e tests',
        'version': '11',
        'selenium-version': '2.45.0',
        'platform': 'Windows 7'
    }, {
        'browserName': 'internet explorer',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'build': process.env.TRAVIS_BUILD_NUMBER,
        'name': 'angular-typeaheadjs e2e tests',
        'version': '10',
        'selenium-version': '2.45.0',
        'platform': 'Windows 7'
    }],

    baseUrl: env.baseUrl,

    // Up the timeouts for the slower browsers (IE, Safari).
    allScriptsTimeout: 30000,
    getPageTimeout: 30000,

    jasmineNodeOpts: {
        isVerbose: true,
        showTiming: true,
        showColors: true,
        defaultTimeoutInterval: 90000
    }
};
