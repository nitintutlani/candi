/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */

var should = require('chai').should();
var Container = require('../lib/Container');
var container = new Container();
var container2 = new Container();
function Sum(a,b) {
    return a+b;
}
function Student(name) {
    this.name = name;
}
container.provider('Sum', Sum);
container.factory('Student', Student);

describe('Container', function() {

    describe('link', function() {

        it('set', function() {
            (function() {
                container2.link('Sum', container);
            }).should.not.throw();
        });

        it('get', function() {
            container2.Sum(10, 20).should.be.equal(30);
        });

        it('SetInjectionError', function() {
            (function() {
                container2.Sum = 100;
            }).should.throw('is a readonly injection in the Container');
        });

        it('UnknownDependencyError', function(){
            (function(){
                container2.link('Student', container);
            }).should.throw('No such injection');
        });

    });

});