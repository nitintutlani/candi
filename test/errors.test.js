/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */
var candi = require('../lib/candi');
var should = require('chai').should();

//Testing of Errors thrown by Candi container
describe("Errors", function() {
    var container = new candi.container();

    describe('FunctionFoundError', function() {
        it('Inject function as value', function() {
            (function() {
                container.inject('value', 'foo', function() {
                    return true;
                });
            }).should.throw();
        });
    });

    describe('FunctionNotFoundError', function() {
        it('Inject object as provider', function() {
            (function() {
                container.inject('provider', 'foo', 5);
            }).should.throw();
        });
    });

    describe('UnknownInjectionTypeError', function() {
        it('Inject foo type', function() {
            (function() {
                container.inject('foo', 'bar', 'test');
            }).should.throw();
        });
    });

    describe('InvalidArgumentsError', function() {
        it('Inject too few arguments', function() {
            (function() {
                container.inject('value', 'foo');
            }).should.throw();
        });
        it('Inject too many arguments', function() {
            (function() {
                container.inject('value', 'foo', 3, 4, 5);
            }).should.throw();
        });
    });

    describe('InjectionExistsError', function() {
        it('Inject value twice again', function() {
            (function() {
                container.reinject('value', 'score', 99);
                container.inject('value', 'score', 99);
            }).should.throw();
        });
    });

    container.reinject('constant', 'PI',3.14);
    describe('ReInjectionRequiredError', function() {
        it('Constant PI cannot be changed', function() {
            (function() {
                container.PI = 10;
            }).should.throw();
        });
    });

    container.reinject('factory', 'Circumference', function(PI, radius) {
        return 2 * PI * radius;
    }, 'PIFI');
    describe('ReInjectionRequiredError', function() {
        it('Injection PI renamed to non-existant PIFI', function() {
            (function() {
                return container.Circumference;
            }).should.throw();
        });
    });

});
