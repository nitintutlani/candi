/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */

var should = require('chai').should();
var Container = require('../lib/Container');
var container = new Container();
function Sum(a, b) {
    return a+b;
}
container.value('a', 40);
container.value('b', 10);
function Student(name) {
    this.name = name;
}

describe('Container', function() {

    describe('factory', function() {

        it('set, function', function() {
            (function() {
                container.factory('Sum', Sum);
            }).should.not.throw();
        });

        it('get, function', function() {
            container.Sum.should.be.equal(50);
        });

        it('get, change dependency', function() {
            container.a = 50;
            container.Sum.should.be.equal(60);
        });

        it('UnknownDependencyError', function() {
            container.deleteInjection('b');
            (function(){
                container.Sum.should.be.equal(60);
            }).should.throw('No such injection');
        });

        it('FunctionNotFoundError', function() {
            (function() {
                container.factory('Test', 1);
            }).should.throw('is not a function');
        });

        it('SetInjectionError', function() {
            (function() {
                container.Sum = Sum;
            }).should.throw('is a readonly injection in the Container');
        });

        it('set, Factory object', function() {
            (function() {
                container.factory('Student', Student);
            }).should.not.throw();
        });

        it('set, Factory object', function() {
            container.value('name', 'Nitin');
            var nitin = container.Student;
            container.name = 'Foo';
            var foo = container.Student;
            (nitin === foo).should.be.false;
        });

    });

});