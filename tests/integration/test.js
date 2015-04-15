/* jshint esnext: true, evil: true, sub: true */
/**
 * Code inspired in https://github.com/twitter/typeahead.js/blob/master/test/integration/test.js
 */
var wd = require('yiewd'),
    colors = require('colors'),
    expect = require('chai').expect,
    f = require('util').format,
    env = process.env;

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
    var driver, body, container1 = {}, allPassed = true;

    this.timeout(300000);

    function getContainer(container) {
        return {
            input: f('div.container%s > span.twitter-typeahead > input[id]', container),
            hint: f('div.container%s > span.twitter-typeahead > input.tt-hint', container),
            dropdown: f('div.container%s > span.twitter-typeahead > span.tt-dropdown-menu', container),
            itemonSelected: f('div.container%s > input#itemonSelected%s', container),
            itemonClosed: f('div.container%s > input#itemonClosed%s', container),
            itemonCursorChanged: f('div.container%s > input#itemonCursorChanged%s', container)
        }
    }

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
            var selectors;
            yield this.init(caps);
            yield this.get('http://localhost:8888/tests/integration/test.html');

            body = this.elementByTagName('body');

            selectors = getContainer('1');
            container1.input = yield this.elementByCssSelector(selectors.input);
            container1.hint = yield this.elementByCssSelector(selectors.hint);
            container1.dropdown = yield this.elementByCssSelector(selectors.dropdown);
            container1.itemonSelected = yield this.elementByCssSelector(selectors.itemonSelected);
            container1.itemonClosed = yield this.elementByCssSelector(selectors.itemonClosed);
            container1.itemonCursorChanged = yield this.elementByCssSelector(selectors.itemonCursorChanged);

            selectors = getContainer('2');
            container2.input = yield this.elementByCssSelector(selectors.input);
            container2.hint = yield this.elementByCssSelector(selectors.hint);
            container2.dropdown = yield this.elementByCssSelector(selectors.dropdown);
            container2.itemonSelected = yield this.elementByCssSelector(selectors.itemonSelected);
            container2.itemonClosed = yield this.elementByCssSelector(selectors.itemonClosed);
            container2.itemonCursorChanged = yield this.elementByCssSelector(selectors.itemonCursorChanged);

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
            yield container1.input.click();
            yield this.execute('window.jQuery("span.twitter-typeahead > input[id]").typeahead("val", "")');
            yield body.click();
            done();
        });
    });

    afterEach(function() {
        allPassed = allPassed && (this.currentTest.state === 'passed');
    });
    describe('Test container1: on input: ', function() {
        it('dropdown should only be displayed if minlensugestion is reached', function(done) {
            driver.run(function*() {
                yield container1.input.click();
                yield container1.input.type('l');
                yield driver.sleep(500);
                expect(yield container1.dropdown.isDisplayed()).to.equal(false);
                yield container1.input.type('i');
                yield driver.sleep(500);
                expect(yield container1.dropdown.isDisplayed()).to.equal(false);
                yield container1.input.type('t');
                yield driver.sleep(500);
                expect(yield container1.dropdown.isDisplayed()).to.equal(true);
                done();
            });
        });
        it('dropdown should be displayed', function(done) {
            driver.run(function*() {
                yield container1.input.click();
                yield container1.input.type('lit');
                yield driver.sleep(500);
                expect(yield container1.dropdown.isDisplayed()).to.equal(true);
                done();
            });
        });
        it('class tt-dataset-<datasource> should be set', function(done) {
            driver.run(function*() {
                yield container1.input.click();
                yield container1.input.type('lit');
                yield driver.sleep(500);
                expect(yield container1.dropdown.isDisplayed()).to.equal(true);
                expect(yield container1.dropdown.elementsByClassName('tt-dataset-categories')).to.not.be.undefined;
                done();
            });
        });
        it('hint should be "literatura" on type "lit"', function(done) {
            driver.run(function*() {
                yield container1.input.click();
                yield container1.input.type('lit');
                yield driver.sleep(500);
                expect(yield container1.hint.getValue()).to.equal('literatura');
                done();
            });
        });
        it('input value should be "Literatura" on typing "lit" and autocomplete with TAB', function(done) {
            driver.run(function*() {
                yield container1.input.click();
                yield container1.input.type('lit');
                yield driver.sleep(500);
                yield container1.input.type(wd.SPECIAL_KEYS['Tab']);
                yield driver.sleep(500);
                expect(yield container1.input.getValue()).to.equal('Literatura');
                done();
            });
        });
        it('should trigger onselected event on typing "lit" and autocomplete with TAB', function(done) {
            //event trigger is ok if input element 'itemonSelected' has value autocompleted
            //caused by databind in onselected callback
            driver.run(function*() {
                yield container1.input.click();
                yield container1.input.type('lit');
                yield driver.sleep(500);
                yield container1.input.type(wd.SPECIAL_KEYS['Tab']);
                yield driver.sleep(500);
                expect(yield container1.itemonSelected.getValue()).to.equal('selected:Literatura');
                done();
            });
        });
        it('should trigger onclosed event after typing and lost focus', function(done) {
            //event trigger is ok if input element 'itemonClosed' has value
            //caused by databind in onclosed callback
            driver.run(function*() {
                yield container1.input.click();
                yield container1.input.type('test');
                yield body.click();
                yield driver.sleep(500);
                expect(yield container1.itemonClosed.getValue()).to.equal('closed:test');
                done();
            });
        });
        it('should trigger oncursorchanged event after typing arrow keys UP and Down', function(done) {
            //event trigger is ok if input element 'itemonCursorChanged' has value
            //caused by databind in oncursorchanged callback
            driver.run(function*() {
                yield container1.input.click();
                yield container1.input.type('lit');
                yield driver.sleep(500);
                yield container1.input.type(wd.SPECIAL_KEYS['Down arrow']);
                expect(yield container1.input.getValue()).to.equal('Literatura');
                expect(yield container1.itemonCursorChanged.getValue()).to.equal('cursorchanged:Literatura');
                yield container1.input.type(wd.SPECIAL_KEYS['Down arrow']);
                yield container1.input.type(wd.SPECIAL_KEYS['Down arrow']);
                expect(yield container1.input.getValue()).to.equal('Politica & Religião');
                expect(yield container1.itemonCursorChanged.getValue()).to.equal('cursorchanged:Politica & Religião');
                yield container1.input.type(wd.SPECIAL_KEYS['Up arrow']);
                expect(yield container1.input.getValue()).to.equal('Literatura Inglesa');
                expect(yield container1.itemonCursorChanged.getValue()).to.equal('cursorchanged:Literatura Inglesa');
                done();
            });
        });
        it('number of suggestions should be 3', function(done) {
            driver.run(function*() {
                yield container1.input.click();
                yield container1.input.type('lit');
                yield driver.sleep(500);

                var suggestions = yield container1.dropdown.elementsByClassName('tt-suggestion');
                expect(suggestions).to.have.length('3');
                expect(yield suggestions[0].text()).to.equal('Literatura');
                expect(yield suggestions[1].text()).to.equal('Literatura Inglesa');
                expect(yield suggestions[2].text()).to.equal('Politica & Religião');
                done();
            });
        });
        it('should trigger onselected event on click suggestion', function(done) {
            driver.run(function*() {
                yield container1.input.click();
                yield container1.input.type('lit');
                yield driver.sleep(500);

                var suggestions = yield container1.dropdown.elementsByClassName('tt-suggestion');
                yield suggestions[1].click();
                yield driver.sleep(500);
                expect(yield container1.dropdown.isDisplayed()).to.equal(false);
                expect(yield container1.input.getValue()).to.equal('Literatura Inglesa');
                expect(yield container1.itemonSelected.getValue()).to.equal('selected:Literatura Inglesa');

                done();
            });
        });

    });
    describe('Test container2: on input: ', function() {
        it('should trigger $scope.on:typeahead:selected event on typing "lit" and autocomplete with TAB', function(done) {
            driver.run(function*() {
                yield container2.input.click();
                yield container2.input.type('lit');
                yield driver.sleep(500);
                yield container2.input.type(wd.SPECIAL_KEYS['Tab']);
                yield driver.sleep(500);
                expect(yield container2.itemonSelected.getValue()).to.equal('selected:Literatura');
                done();
            });
        });
        it('should trigger $scope.on:typeahead:closed event after typing and lost focus', function(done) {
            driver.run(function*() {
                yield container2.input.click();
                yield container2.input.type('test');
                yield body.click();
                yield driver.sleep(500);
                expect(yield container2.itemonClosed.getValue()).to.equal('closed:test');
                done();
            });
        });
        it('should trigger $scope.on:typeahead:cursorchanged event after typing arrow keys UP and Down', function(done) {
            driver.run(function*() {
                yield container2.input.click();
                yield container2.input.type('lit');
                yield driver.sleep(500);
                yield container2.input.type(wd.SPECIAL_KEYS['Down arrow']);
                expect(yield container2.input.getValue()).to.equal('Literatura');
                expect(yield container2.itemonCursorChanged.getValue()).to.equal('cursorchanged:Literatura');
                yield container2.input.type(wd.SPECIAL_KEYS['Down arrow']);
                yield container2.input.type(wd.SPECIAL_KEYS['Down arrow']);
                expect(yield container2.input.getValue()).to.equal('Politica & Religião');
                expect(yield container2.itemonCursorChanged.getValue()).to.equal('cursorchanged:Politica & Religião');
                yield container2.input.type(wd.SPECIAL_KEYS['Up arrow']);
                expect(yield container2.input.getValue()).to.equal('Literatura Inglesa');
                expect(yield container2.itemonCursorChanged.getValue()).to.equal('cursorchanged:Literatura Inglesa');
                done();
            });
        });
        it('should trigger $scope.on:typeahead:selected event on click suggestion', function(done) {
            driver.run(function*() {
                yield container2.input.click();
                yield container2.input.type('lit');
                yield driver.sleep(500);

                var suggestions = yield container2.dropdown.elementsByClassName('tt-suggestion');
                yield suggestions[1].click();
                yield driver.sleep(500);
                expect(yield container2.dropdown.isDisplayed()).to.equal(false);
                expect(yield container2.input.getValue()).to.equal('Literatura Inglesa');
                expect(yield container2.itemonSelected.getValue()).to.equal('selected:Literatura Inglesa');

                done();
            });
        });

    });
});
