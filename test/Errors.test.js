/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */
var Candi = require('../lib/Candi');
var should = require('chai').should();

//Testing of Errors thrown by Candi Container
describe("Errors", function() {
    var Container = new Candi.Container();

    describe('FunctionFound', function() {
        it('Inject function as value', function() {
            (function() {
                Container.inject('value', 'foo', function() {
                    return true;
                });
            }).should.throw();
        });
    });

    describe('FunctionNotFound', function() {
        it('Inject object as provider', function() {
            (function() {
                Container.inject('provider', 'foo', 5);
            }).should.throw();
        });
    });

    describe('UnknownInjectionType', function() {
        it('Inject foo type', function() {
            (function() {
                Container.inject('foo', 'bar', 'test');
            }).should.throw();
        });
    });

    describe('InvalidArguments', function() {
        it('Inject too few arguments', function() {
            (function() {
                Container.inject('value', 'foo');
            }).should.throw();
        });
        it('Inject too many arguments', function() {
            (function() {
                Container.inject('value', 'foo', 3, 4, 5);
            }).should.throw();
        });
    });

    describe('InjectionExists', function() {
        it('Inject value twice again', function() {
            (function() {
                Container.reinject('value', 'score', 99);
                Container.inject('value', 'score', 99);
            }).should.throw();
        });
    });

    Container.reinject('constant', 'PI',3.14);
    describe('ReInjectionRequired', function() {
        it('Constant PI cannot be changed', function() {
            (function() {
                Container.PI = 10;
            }).should.throw();
        });
    });

    Container.reinject('factory', 'Circumference', function(PI, radius) {
        return 2 * PI * radius;
    }, 'PIFI');
    describe('ReInjectionRequired', function() {
        it('Injection PI renamed to non-existant PIFI', function() {
            (function() {
                return Container.Circumference;
            }).should.throw();
        });
    });

});
