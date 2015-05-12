exports.config = [
    /*{
        'browserName': 'internet explorer',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'build': process.env.TRAVIS_BUILD_NUMBER,
        'name': 'angular-typeaheadjs e2e tests',
        'version': '11',
        'selenium-version': '2.45.0',
        'platform': 'Windows 7'
    },*/
    {
        'browserName': 'internet explorer',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'build': process.env.TRAVIS_BUILD_NUMBER,
        'name': 'angular-typeaheadjs e2e tests',
        'version': '10',
        //'selenium-version': '2.45.0',
        'platform': 'Windows 7'
    }
];
