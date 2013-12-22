/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */

var should = require('chai').should();

var Util = require('../lib/Util');

function Sum(a,b) {
    return a+b;
}
Sum = Util.annotateFn(Sum);

var Multiply = [function (x,y) { return x*y; }, 'x, y'];
Multiply = Util.annotateFn(Multiply);

describe("candi.Util", function () {

    it('annotateFn: Sum', function () {
        Sum.injections.should.be.equal('a,b');
    });

    it('annotateFn: Multiply', function () {
        Multiply.injections.should.be.equal('x, y');
    });

});
