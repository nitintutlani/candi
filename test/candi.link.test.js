/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */
var candi = require('../lib/candi');
var should = require('chai').should();

//link type injection testing

function Student(name, score) {
    this.name = name;
    this.score = score;
}

Student.percentage = function(max, score) {
    return score * 100 / max;
}



var nitin = new Student('Nitin', 45);

describe("container", function() {
    var container = new candi.container();
    describe('Links', function() {

        it('inject link score', function() {
            (function() {
                container.reinject('link', 'score', nitin);
            }).should.not.throw();
        });

        it('link score', function() {
            container.score.should.be.equal(45);
        });

        container.reinject('value', 'score', nitin.score);
        container.reinject('value', 'max', 80);
        container.reinject('factory', 'percentage', Student.percentage, 'max score');

        var newContainer = new candi.container();
        newContainer.reinject('link', 'percentage', container);
        it('newContainer linked to another container\'s factory', function() {
            newContainer.percentage.should.be.equal(56.25);
        });

    });

});
