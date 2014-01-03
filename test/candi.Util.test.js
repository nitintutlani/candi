/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */

var should = require('chai').should();

var candi = require('../lib/candi');
var Util = candi.Util;

function Sum(a,b) {
    return a+b;
}
Sum = Util.annotateFn(Sum);

var Multiply = [function (x,y) { return x*y; }, 'x, y'];
Multiply = Util.annotateFn(Multiply);

describe("Util", function () {

    it('isArray', function() {
        Util.isArray([0,1]).should.be.true;
    });

    it('isString', function() {
        Util.isString('nitin').should.be.true;
    });

    it('isFunction', function() {
        Util.isFunction(Sum).should.be.true;
    });

    it('isInvokable', function() {
        Util.isInvokable(Multiply).should.be.true;
    });

    it('annotateFn: Sum', function () {
        Sum.injections.should.be.equal('a,b');
    });

    it('annotateFn: Multiply', function () {
        Multiply.injections.should.be.equal('x, y');
    });

});
