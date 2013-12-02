/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */
var Candi = require('../lib/Candi');
var should = require('should');

//High level testing of Candi Container, does not include everything
describe("Container", function() {
    var Container = new Candi.Container();
    describe('Inject score: 100', function() {
        Container.inject('value', 'score', 100);

        it('Container should have an injected score', function() {
            Container.hasInjection('score').should.be.true;
        });

        it('Injected score should be equal to 100', function() {
            Container['score'].should.be.equal(100);
        });

        it('Delete score,check again', function() {
            Container.deleteInjection('score').hasInjection('score').should.be.false
        });
    });

    describe('Inject constant PI: 3.14', function() {
        Container.inject('constant', 'PI', 3.14);

        it('Container should have an injected PI', function() {
            Container.hasInjection('PI').should.be.true;
        });

        it('Injected PI should be equal to 3.14', function() {
            Container['PI'].should.be.equal(3.14);
        });

        it('Change PI to 100', function() {
            Container['PI'] = 100;
            Container['PI'].should.be.equal(3.14);
        });

    });

    describe('Inject provider function Sum(a, b) returns a+b', function() {
        Container.inject('provider', 'Sum', function(a, b) {
            return a+b;
        });

        it('Container should have an injected Sum function', function() {
            Container.hasInjection('Sum').should.be.true;
        });

        it('Injected Sum should be a Function', function() {
            Container['Sum'].should.be.of.type('function');
        });

        it('Injected Sun should return 100 for a Sum(40, 60)', function() {
            Container['Sum'](40, 60).should.be.equal(100);
        });

    });

});
