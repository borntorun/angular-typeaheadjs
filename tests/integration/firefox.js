exports.config = {
    'browserName': 'firefox',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'angular-typeaheadjs e2e tests',
    'version': '36',
    'selenium-version': '2.45.0'
};
