exports.config = [{
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'angular-typeaheadjs e2e tests',
    'version': '40'/*,
        'selenium-version': '2.45.0',
        'chromedriver-version': '2.14',
        //'platform': 'OS X 10.9'
        'platform': 'LINUX'*/
}];
