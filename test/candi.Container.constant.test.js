/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */

var should = require('chai').should();
var Container = require('../lib/Container');
var container = new Container();

describe('Container', function() {

    describe('constant', function() {

        it('set', function() {
            (function() {
                container.constant('PI', 3.14);
            }).should.not.throw();
        });

        it('get', function() {
            container.PI.should.be.equal(3.14);
        });

        it('FunctionFoundError', function() {
            (function() {
                container.constant('Total', function() {
                    return 100;
                });
            }).should.throw('is a function');
        });

        it('set/ConstantInjectionError', function() {
            (function() {
                container.PI = 100;
            }).should.throw('is a readonly injection in the Container');
        });

    });

});