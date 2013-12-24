/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */

var should = require('chai').should();

var candi = require('../lib/candi');
var container = new candi.Container();

function Student(name) {
    this.name = name;
}
var nitin = new Student('nitin');
var nitin2 = new Student('nitin2');

describe('Container', function() {

    describe('value', function() {

        it('set', function() {
            (function() {
                container.value('nitin', nitin);
            }).should.not.throw();
        });

        it('hasInjection', function() {
            container.hasInjection('nitin').should.be.true;
        });

        it('get', function() {
            container.nitin.name.should.be.equal('nitin');
        });

        it('deleteInjection', function() {
            container.deleteInjection('nitin').hasInjection('nitin').should.be.false;
        });

        it('FunctionFoundError', function() {
            (function() {
                container.value('nitin', Student);
            }).should.throw('is a function');
        });

        it('overwrite', function() {
            container.value('nitin', nitin);
            container.nitin = nitin2;
            container.nitin.name.should.be.equal('nitin2');
        });

    });

});