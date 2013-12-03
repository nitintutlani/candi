/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */
var Candi = require('../lib/Candi');
var should = require('chai').should();

//High level testing of Candi Container, does not include everything
//@todo I want to improve in line var and object creation by adding a new bootstrap script
//@todo move test cases to typescript

function Student(name, score) {
    this.name = name;
    this.score = score;
}

describe("Container", function() {
    var Container = new Candi.Container();
    describe('Values', function() {

        it('inject value value_score: 100', function() {
            (function() {
                Container.inject('value', 'value_score', 100);
            }).should.not.throw();
        });

        it('hasInjection injected value_score', function() {
            Container.hasInjection('value_score').should.be.true;
        });

        it('reinject value_score: 50', function() {
            (function() {
                Container.reinject('value', 'value_score', 50);
            }).should.not.throw();
        });


        it('check score to be 50', function() {
            Container.value_score.should.be.equal(50);
        });

        it('Delete score,check again', function() {
            Container.deleteInjection('value_score').hasInjection('value_score').should.be.false
        });
    });

    describe('Constants', function() {

        it('Inject Constant PI', function() {
            (function() {
                Container.inject('constant', 'PI', 3.14);
            }).should.not.throw();
        });

        it('Injected PI should be equal to 3.14', function() {
            Container.PI.should.be.equal(3.14);
        });

        it('Injected PI cannot be changed', function() {
            (function() {
                Container.PI = 10;
            }).should.throw();
        });

    });

    describe('Providers', function() {

        it('Inject function Sum(a+b)', function() {
            (function() {
                Container.inject('provider', 'Sum', function(a, b) {
                    return a+b;
                });
            }).should.not.throw();
        });

        it('Injected Sum should be a Function', function() {
            (typeof Container['Sum']).should.be.equal('function');
        });

        it('Injected Sum should return 100 for a Sum(40, 60)', function() {
            Container['Sum'](40, 60).should.be.equal(100);
        });

        it('Inject Student class as Provider', function() {
            //Usage display inclusion of Class functions into Container as Providers
            //Such functions cannot use full dependency injection and must be called with arguments
            Container.reinject('provider', 'Student', Student);
            var nitin = new Container.Student('nitin', 100);
            nitin.score.should.be.equal(100);
        });

    });

    describe('Factories', function() {

        Container.reinject('value', 'a', 5);
        Container.reinject('value', 'b', 9);
        it('Inject function MultiplyFactory(x*y)', function() {
            (function() {
                Container.reinject('factory', 'MultiplyFactory', function(x, y) {
                    return x*y;
                }, 'a b');
            }).should.not.throw();
        });

        it('Check Multiply result', function() {
            Container.MultiplyFactory.should.be.equal(45);
        });

        it('Check Multiply result after changing dependencies values', function() {
            Container.a = 8;
            Container.MultiplyFactory.should.be.equal(72);
        });

        Container.reinject('value', 'name', 'nitin');
        Container.reinject('value', 'score', 99);

        it('Inject Student class with 4th param of injection, depends', function() {
            (function() {
                Container.reinject('factory', 'Student', Student, 'name score');
            }).should.not.throw();
        });

        Container.reinject('factory', 'Student', Student, 'name score');
        var nitin = Container.Student;

        it('Check nitin', function() {
            nitin.name.should.be.equal('nitin');
        });

        Container.name = 'john';
        Container.score = 80;
        var john = Container.Student;

        it('Check nitin & john to be separate objects', function() {
            nitin.name.should.be.equal('nitin');
            john.name.should.be.equal('john');
        });

    });

    describe('Services', function() {

        Container.reinject('value', 'serve_a', 5);
        Container.reinject('value', 'serve_b', 9);

        Container.reinject('service', 'MultiplyService', function(m, n) {
            return m*n;
        }, 'serve_a serve_b');

        it('Check Multiply result', function() {
            Container.MultiplyService.should.be.equal(45);
        });

        it('Check Multiply result after changing dependencies values', function() {
            Container.serve_a = 8;
            Container.MultiplyService.should.be.equal(45);
        });

        Container.reinject('value', 'name', 'nitin');
        Container.reinject('value', 'score', 99);

        it('Inject Student class with 4th param of injection, depends', function() {
            (function() {
                Container.reinject('service', 'Student', Student, 'name score');
            }).should.not.throw();
        });

        Container.reinject('service', 'Student', Student, 'name score');
        var nitin = Container.Student;
        Container.name = 'john';
        Container.score = 80;
        var john = Container.Student;

        it('Check nitin', function() {
            nitin.name.should.be.equal('nitin');
        });

        it('Check nitin & john to be same objects', function() {
            nitin.name.should.be.equal('nitin');
            john.name.should.be.equal('nitin');
        });

    });

});
