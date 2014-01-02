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

var Engine = function(power) {
    this.power = power;
}
Engine.prototype.start = function() {
    return 'Engine start with power ' + this.power;
}

var Car = function(name) {
    this.name = name;
}
Car.prototype.run = function() {
    return this.name + ' with power ' + this.power + ' is running';
}
Util.extends2(Car, Engine);
Car.prototype.horn = function() {
    return this.name + ' with power ' + this.power + ' called horn';
}

var zen = new Car('zen');
zen.power = 1000;

describe("candi.Util", function () {

    it('annotateFn: Sum', function () {
        Sum.injections.should.be.equal('a,b');
    });

    it('annotateFn: Multiply', function () {
        Multiply.injections.should.be.equal('x, y');
    });

    it('__extends', function () {
        zen.start().should.be.equal('Engine start with power 1000');
        zen.run().should.be.equal('zen with power 1000 is running');
        zen.horn().should.be.equal('zen with power 1000 called horn');
    });

});
