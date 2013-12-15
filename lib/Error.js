/**
* Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
//Just a trick found here: http://stackoverflow.com/questions/12915412/how-do-i-extend-a-host-object-e-g-error-in-typescript
var ErrorClass = Error;

/**
* Template class for Error
*
* Usage:
*     throw new Template('my_package_name', 'my_code_area_name', 'This error message supports tags like {0}, {1}', [100, 'foo']);
*/
var Template = (function (_super) {
    __extends(Template, _super);
    function Template(package, code, template, options) {
        this.name = package ? package + ':' + code : code;
        this.message = '[' + this.name + '] ' + template.replace(/\{\d+\}/g, function (match) {
            var index = +match.slice(1, -1), arg;
            if (index < options.length) {
                arg = Template.stringify(options[index]);
                return arg;
            }
            return match;
        });
        _super.call(this, this.message);
    }
    Template.stringify = function (obj) {
        if (typeof obj === 'function') {
            return obj.toString().replace(/ \{[\s\S]*$/, '');
        } else if (typeof obj === 'undefined') {
            return 'undefined';
        } else if (typeof obj !== 'string') {
            return JSON.stringify(obj);
        }
        return obj;
    };
    return Template;
})(ErrorClass);
exports.Template = Template;

/**
* Wrapper function can be used as Class to create custom template Errors
*
* Usage
*     var myError = new Custom('my_package_name');
*     throw myError('my_code_area_name', 'This error message supports tags like {0}, {1}', 100, 'foo');
*
* PS: The tag parameters are passed as arguments. This usage is different from Template class
*/
function Custom(package) {
    return function (code, template) {
        var options = [];
        for (var _i = 0; _i < (arguments.length - 2); _i++) {
            options[_i] = arguments[_i + 2];
        }
        return new Template(package, code, template, options);
    };
}
exports.Custom = Custom;

//# sourceMappingURL=Error.js.map
