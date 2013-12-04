/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */
var candi = require('../lib/candi');
var should = require('chai').should();

//High level testing of Candi container, does not include everything
//@todo I want to improve in line var and object creation by adding a new bootstrap script
//@todo move test cases to typescript

function Student(name, score) {
    this.name = name;
    this.score = score;
}

describe("container", function() {
    var container = new candi.container();
    describe('Values', function() {

        it('inject value value_score: 100', function() {
            (function() {
                container.inject('value', 'value_score', 100);
            }).should.not.throw();
        });

        it('hasInjection injected value_score', function() {
            container.hasInjection('value_score').should.be.true;
        });

        it('reinject value_score: 50', function() {
            (function() {
                container.reinject('value', 'value_score', 50);
            }).should.not.throw();
        });


        it('check score to be 50', function() {
            container.value_score.should.be.equal(50);
        });

        it('Delete score,check again', function() {
            container.deleteInjection('value_score').hasInjection('value_score').should.be.false
        });
    });

    describe('Constants', function() {

        it('Inject Constant PI', function() {
            (function() {
                container.inject('constant', 'PI', 3.14);
            }).should.not.throw();
        });

        it('Injected PI should be equal to 3.14', function() {
            container.PI.should.be.equal(3.14);
        });

        it('Injected PI cannot be changed', function() {
            (function() {
                container.PI = 10;
            }).should.throw();
        });

    });

    describe('Providers', function() {

        it('Inject function Sum(a+b)', function() {
            (function() {
                container.inject('provider', 'Sum', function(a, b) {
                    return a+b;
                });
            }).should.not.throw();
        });

        it('Injected Sum should be a Function', function() {
            (typeof container['Sum']).should.be.equal('function');
        });

        it('Injected Sum should return 100 for a Sum(40, 60)', function() {
            container['Sum'](40, 60).should.be.equal(100);
        });

        it('Inject Student class as Provider', function() {
            //Usage display inclusion of Class functions into container as Providers
            //Such functions cannot use full dependency injection and must be called with arguments
            container.reinject('provider', 'Student', Student);
            var nitin = new container.Student('nitin', 100);
            nitin.score.should.be.equal(100);
        });

    });

    describe('Factories', function() {

        container.reinject('value', 'a', 5);
        container.reinject('value', 'b', 9);
        it('Inject function MultiplyFactory(x*y)', function() {
            (function() {
                container.reinject('factory', 'MultiplyFactory', function(x, y) {
                    return x*y;
                }, 'a b');
            }).should.not.throw();
        });

        it('Check Multiply result', function() {
            container.MultiplyFactory.should.be.equal(45);
        });

        it('Check Multiply result after changing dependencies values', function() {
            container.a = 8;
            container.MultiplyFactory.should.be.equal(72);
        });

        container.reinject('value', 'name', 'nitin');
        container.reinject('value', 'score', 99);

        it('Inject Student class with 4th param of injection, depends', function() {
            (function() {
                container.reinject('factory', 'Student', Student, 'name score');
            }).should.not.throw();
        });

        container.reinject('factory', 'Student', Student, 'name score');
        var nitin = container.Student;

        it('Check nitin', function() {
            nitin.name.should.be.equal('nitin');
        });

        container.name = 'john';
        container.score = 80;
        var john = container.Student;

        it('Check nitin & john to be separate objects', function() {
            nitin.name.should.be.equal('nitin');
            john.name.should.be.equal('john');
        });

    });

    describe('Services', function() {

        container.reinject('value', 'serve_a', 5);
        container.reinject('value', 'serve_b', 9);

        container.reinject('service', 'MultiplyService', function(m, n) {
            return m*n;
        }, 'serve_a serve_b');

        it('Check Multiply result', function() {
            container.MultiplyService.should.be.equal(45);
        });

        it('Check Multiply result after changing dependencies values', function() {
            container.serve_a = 8;
            container.MultiplyService.should.be.equal(45);
        });

        container.reinject('value', 'name', 'nitin');
        container.reinject('value', 'score', 99);

        it('Inject Student class with 4th param of injection, depends', function() {
            (function() {
                container.reinject('service', 'Student', Student, 'name score');
            }).should.not.throw();
        });

        container.reinject('service', 'Student', Student, 'name score');
        var nitin = container.Student;
        container.name = 'john';
        container.score = 80;
        var john = container.Student;

        it('Check nitin', function() {
            nitin.name.should.be.equal('nitin');
        });

        it('Check nitin & john to be same objects', function() {
            nitin.name.should.be.equal('nitin');
            john.name.should.be.equal('nitin');
        });

    });

});
