exports.config = {
    'browserName': 'safari',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'angular-typeaheadjs e2e tests',
    'version': '8',
    'selenium-version': '2.44.0'
};
