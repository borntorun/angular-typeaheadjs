
describe('e2e test angular-typeaheadjs demo page', function() {
    beforeEach(function() {
        browser.driver.manage().window().setSize(400, 400);
        browser.get('http://borntorun.github.io/angular-typeaheadjs/');
    });

    it('should have a title', function () {
        expect(browser.getTitle()).toEqual('angular-typeaheadjs Directive demo');
    });
    it('should have an input.typeahead.inputclass', function() {
        var oinput = element(by.css('span.twitter-typeahead > input[id]'));
        expect(browser.isElementPresent(oinput)).toBeTruthy();
    })
    it('should open dropdown with 9 suggestions and correct hint when typing "u"', function() {
        var oinput = element(by.css('span.twitter-typeahead > input[id]'));
        expect(browser.isElementPresent(oinput)).toBeTruthy();

        var ohint = element(by.css('span.twitter-typeahead > input.tt-hint'));
        expect(browser.isElementPresent(ohint)).toBeTruthy();

        oinput.sendKeys('u');

        var odropdown = element(by.css('span.twitter-typeahead > span.tt-dropdown-menu'));
        expect(browser.isElementPresent(odropdown)).toBeTruthy();

        expect(ohint.getAttribute('value')).toBe('united Arab Emirates');

        var suggestions = element.all(by.css('.tt-dataset-countries > .tt-suggestions > .tt-suggestion'));
        expect(suggestions.count()).toBe(9);
    })
    it('should open dropdown with 1 suggestions and correct hint when typing "ut"', function() {
        var oinput = $('span.twitter-typeahead > input[id]');//element(by.css('span.twitter-typeahead > input[id]'));
        expect(browser.isElementPresent(oinput)).toBeTruthy();

        var ohint = $('span.twitter-typeahead > input.tt-hint');//element(by.css('span.twitter-typeahead > input.tt-hint'));
        expect(browser.isElementPresent(ohint)).toBeTruthy();

        oinput.sendKeys('ut');

        browser.driver.sleep('500');

        var odropdown = $('span.twitter-typeahead > span.tt-dropdown-menu'); //element(by.css('span.twitter-typeahead > span.tt-dropdown-menu'));
        expect(browser.isElementPresent(odropdown)).toBeTruthy();

        expect(ohint.getAttribute('value')).toBe('utopia');

        var suggestions = $$('.tt-dataset-countries .tt-suggestion'); //element.all(by.css('.tt-dataset-countries > .tt-suggestions > .tt-suggestion'));
        expect(suggestions.count()).toBe(1);
    })

});
