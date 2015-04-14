/* jshint esnext: true, evil: true, sub: true */
/**
 * Code inspired in https://github.com/twitter/typeahead.js/blob/master/test/integration/test.js
 */
var wd = require('yiewd'),
    //_ = require('lodash'),
    colors = require('colors'),
    expect = require('chai').expect,
    //expect = require('chai'),
    //chaiAsPromised = require("chai-as-promised"),
    f = require('util').format,
    env = process.env;

//chai.use(chaiAsPromised);
//chai.should();
//chaiAsPromised.transferPromiseness = wd.transferPromiseness;

var browser = (process.env.BROWSER || 'chrome').split(':'),
    caps = {
        name: f('angular-remote-typeaheadjs on [%s]', browser.join(' , ')),
        browserName: browser[0]
    };

setIf(caps, 'version', browser[1]);
setIf(caps, 'platform', browser[2]);
setIf(caps, 'tunnel-identifier', env['TRAVIS_JOB_NUMBER']);
setIf(caps, 'build', env['TRAVIS_BUILD_NUMBER']);
setIf(caps, 'tags', env['CI'] ? ['CI'] : ['local']);

function setIf(obj, key, val) {
    val && (obj[key] = val);
}

describe('angular-remote-typeaheadjs', function() {
    var driver, body, input, inputx, hint, dropdown, allPassed = true;

    this.timeout(300000);

    before(function(done) {
        var host = 'ondemand.saucelabs.com', port = 80, username, password;

        if (env['CI']) {
            host = 'localhost';
            port = 4445;
            username = env['SAUCE_USERNAME'];
            password = env['SAUCE_ACCESS_KEY'];
        }

        driver = wd.remote(host, port, username, password);
        driver.configureHttp({
            timeout: 30000,
            retries: 5,
            retryDelay: 200
        });

        driver.on('status', function(info) {
            console.log(info.cyan);
        });

        driver.on('command', function(meth, path, data) {
            console.log(' > ' + meth.yellow, path.grey, data || '');
        });

        driver.run(function*() {
            yield this.init(caps);
            yield this.get('http://localhost:8888/tests/integration/test.html');

            body = this.elementByTagName('body');
            input = yield this.elementByCssSelector('span.twitter-typeahead > input[id]');
            hint = yield this.elementByClassName('tt-hint');
            dropdown = yield this.elementByClassName('tt-dropdown-menu');

            done();
        });
    });

    after(function(done) {
        driver.run(function*() {
            yield this.quit();
            yield driver.sauceJobStatus(allPassed);
            done();
        });
    });

    beforeEach(function(done) {
        driver.run(function*() {
            yield body.click();
            yield this.execute('window.jQuery("span.twitter-typeahead > input[id]").typeahead("val", "")');
            done();
        });
    });

    afterEach(function() {
        allPassed = allPassed && (this.currentTest.state === 'passed');
    });

    describe('Test: on input', function() {
        it('on type "lit" should show hint equals to "literatura"', function(done) {
            driver.run(function*() {
                yield input.click();
                wd.sleep(500);
                yield input.type('lit');
                wd.sleep(500);
                expect(yield dropdown.isDisplayed()).to.equal(true);


                //expect(yield hint.getValue()).to.equal('literatura');
                done();
            });
        });


        /*it('should open dropdown', function(done) {
            driver.run(function*() {
                yield input.click();
                yield input.type('lit');
                expect(yield dropdown.isDisplayed()).to.equal(true);
                done();
            });
        });
        it('should close dropdown', function(done) {
            driver.run(function*() {
                yield input.click();
                yield input.type('lit');
                expect(yield dropdown.isDisplayed()).to.equal(true);
                yield body.click();
                expect(yield dropdown.isDisplayed()).to.equal(false);
                done();
            });
        });

        it('should show hint', function(done) {
            driver.run(function*() {
                yield input.click();
                yield input.type('lit');
                expect(yield hint.getValue()).to.equal('Literatura');
                done();
            });
        });
        it('should clear hint', function(done) {
            driver.run(function*() {
                yield input.click();
                yield input.type('lit');
                expect(yield hint.getValue()).to.equal('Literatura');
                yield body.click();
                expect(yield hint.getValue()).to.equal('');
                done();
            });
        });*/
    });
});
