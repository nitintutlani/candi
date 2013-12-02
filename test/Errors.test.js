/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */
var Candi = require('../lib/Candi');
var should = require('should');

//Testing of Errors thrown by Candi Container
describe("Errors", function() {
    var Container = new Candi.Container();
    Container.inject('value', 'score', 100);

    describe('Inject vague type', function() {
        it('should throw UnknownInjectionType Error', function() {
            //Container.inject('vague', 'Vague', 3.14).should.throw('UnknownInjectionType');
        });
    });

    describe('Inject duplicate', function() {
        it('should throw InjectionExists Error', function() {
            //Container.inject('value', 'score', 99).should.throw('InjectionExists');
        });
    });

});
