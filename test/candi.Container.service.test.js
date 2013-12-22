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

    describe('service', function() {

        it('set, function', function() {
            (function() {
                container.service('Sum', Sum);
            }).should.not.throw();
        });

        it('get, function', function() {
            container.Sum.should.be.equal(50);
        });

        it('get, change dependency', function() {
            container.a = 50;
            container.Sum.should.be.equal(50);
        });

        it('get, resetService', function() {
            container.resetService('Sum');
            container.Sum.should.be.equal(60);
        });

        //cache can bypass dependency resolution, service needs an extra reset here
        it('UnknownDependencyError', function() {
            container.resetService('Sum');
            container.deleteInjection('b');
            (function(){
                container.Sum.should.be.equal(60);
            }).should.throw('No such injection');
        });


        it('FunctionNotFoundError', function() {
            (function() {
                container.service('Test', 1);
            }).should.throw('is not a function');
        });

        it('SetInjectionError', function() {
            (function() {
                container.Sum = Sum;
            }).should.throw('is a readonly injection in the Container');
        });

        it('set, Service object', function() {
            (function() {
                container.service('Student', Student);
            }).should.not.throw();
        });

        it('set, Service object', function() {
            container.value('name', 'Nitin');
            var nitin = container.Student;
            container.name = 'Foo';
            var foo = container.Student;
            (nitin === foo).should.be.true;
        });

    });

});