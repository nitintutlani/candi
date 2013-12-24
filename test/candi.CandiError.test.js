/**
* Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
*/

var should = require('chai').should();

var candi = require('../lib/candi');
var CandiError = candi.CandiError;
var myError = candi.CandiError.Custom('my_package_name');

describe("candi.CandiError", function () {
    it('Template', function () {
        try  {
            throw new CandiError.Template('my_package_name', 'my_code_area_name', 'myError', 'This error message supports tags like {0}, {1}', [100, 'foo']);
        } catch (e) {
            e.name.should.be.equal('myError');
            e.message.should.be.equal('[my_package_name:my_code_area_name] This error message supports tags like 100, foo');
        }
    });

    it('Custom', function () {
        try  {
            throw myError('my_code_area_name', 'myError', 'This error message supports tags like {0}, {1}', 100, 'bar');
        } catch (e) {
            e.name.should.be.equal('myError');
            e.message.should.be.equal('[my_package_name:my_code_area_name] This error message supports tags like 100, bar');
        }
    });
});
