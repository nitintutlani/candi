/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */

var should = require('chai').should();
var candi = require('../lib/candi');
var container = new candi.Container();
function Sum(a, b) {
    return a+b;
}

describe('Container', function() {

    describe('provider', function() {

        it('set', function() {
            (function() {
                container.provider('Sum', Sum);
            }).should.not.throw();
        });

        it('get', function() {
            container.Sum(5, 4).should.be.equal(9);
        });

        it('FunctionNotFoundError', function() {
            (function() {
                container.provider('Test', 1);
            }).should.throw('is not a function');
        });

        it('SetInjectionError', function() {
            (function() {
                container.Sum = Sum;
            }).should.throw('is a readonly injection in the Container');
        });

    });

});