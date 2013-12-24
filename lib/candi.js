(function (CandiError) {
    var Template = (function () {
        function Template(lib, code, name, template, options) {
            this.name = name;
            this.message = '[' + (lib ? lib + ':' + code : code) + '] ' + template.replace(/\{\d+\}/g, function (match) {
                var index = +match.slice(1, -1), arg;
                if (index < options.length) {
                    arg = Template.stringify(options[index]);
                    return arg;
                }
                return match;
            });
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
    })();
    CandiError.Template = Template;

    function Custom(lib) {
        return function (code, name, template) {
            var options = [];
            for (var _i = 0; _i < (arguments.length - 3); _i++) {
                options[_i] = arguments[_i + 3];
            }
            return new Template(lib, code, name, template, options);
        };
    }
    CandiError.Custom = Custom;
})(exports.CandiError || (exports.CandiError = {}));
var CandiError = exports.CandiError;

var Container = (function () {
    function Container(name) {
        this.hasInjection = function (name) {
            return (this._injections[name] !== undefined) ? true : false;
        };
        this.deleteInjection = function (name) {
            delete this._injections[name];
            return this;
        };
        this._invokeInjection = function (name) {
            if (this.hasInjection(name)) {
                var injection;
                injection = this._injections[name];
                switch (this._injections[name].type) {
                    case 'value':
                    case 'constant':
                    case 'provider':
                        return injection.value;
                        break;
                    case 'service':
                        if (!exports.Util.isUndefined(injection.cache)) {
                            return injection.cache;
                        }
                    case 'factory':
                        injection.cache = this.__construct(injection.value, this._resolveInjections(injection.value.injections));
                        return injection.cache;
                        break;
                    case 'link':
                        return injection.value[name];
                        break;
                }
            } else {
                throw this.ContainerError('_invokeInjection', ContainerErrors.UnknownInjectionError[0], ContainerErrors.UnknownInjectionError[1], name);
            }
        };
        this._inject = function (type, name, value) {
            Object.defineProperty(this, name, {
                get: function () {
                    return this._invokeInjection(name);
                },
                set: function (newValue) {
                    if (type === 'value') {
                        if (exports.Util.isFunction(newValue)) {
                            throw this.ContainerError(type, ContainerErrors.FunctionFoundError[0], ContainerErrors.FunctionFoundError[1], newValue);
                        }
                        this._injections[name] = new Injection(type, name, newValue);
                    } else {
                        throw this.ContainerError(type, ContainerErrors.SetInjectionError[0], ContainerErrors.SetInjectionError[1], newValue);
                    }
                },
                writeable: (type === 'value'),
                enumerable: true,
                configurable: true });

            switch (type) {
                case 'value':
                case 'constant':
                    if (exports.Util.isFunction(value)) {
                        throw this.ContainerError(type, ContainerErrors.FunctionFoundError[0], ContainerErrors.FunctionFoundError[1], value);
                    }
                    break;
                case 'factory':
                case 'service':
                    value = exports.Util.annotateFn(value);
                case 'provider':
                    if (!exports.Util.isFunction(value)) {
                        throw this.ContainerError(type, ContainerErrors.FunctionNotFoundError[0], ContainerErrors.FunctionNotFoundError[1], value);
                    }
                    break;
                case 'link':
                    break;
            }
            this._injections[name] = new Injection(type, name, value);
            return this;
        };
        this.value = function (name, value) {
            return this._inject('value', name, value);
        };
        this.constant = function (name, value) {
            return this._inject('constant', name, value);
        };
        this.provider = function (name, value) {
            return this._inject('provider', name, value);
        };
        this.factory = function (name, value) {
            return this._inject('factory', name, value);
        };
        this.service = function (name, value) {
            return this._inject('service', name, value);
        };
        this.link = function (name, value) {
            return this._inject('link', name, value);
        };
        this.resetService = function (name) {
            delete this._injections[name].cache;
            return this;
        };
        this._resolveInjections = function (injections) {
            if (!exports.Util.isString(injections))
                return [];
            var injectionNames = injections.replace(' ', '').split(',');
            if (injectionNames.length == 0)
                return [];
            var result = [];
            for (var i = 0; i < injectionNames.length; i++) {
                if (!exports.Util.isUndefined(this[injectionNames[i]])) {
                    result.push(this[injectionNames[i]]);
                } else {
                    throw this.ContainerError('_resolveInjections', ContainerErrors.UnknownDependencyError[0], ContainerErrors.UnknownDependencyError[1], injectionNames[i]);
                }
            }
            return result;
        };
        this.__construct = function (fn, injections) {
            injections = injections || [];
            var result;
            result = fn.apply(fn, injections);
            if (result === undefined) {
                if (injections.length == 0 || injections[0] !== null) {
                    injections.unshift(null);
                }
                result = new (fn.bind.apply(fn, injections))();
            }
            return result;
        };
        this.name = name || 'candi';
        this.ContainerError = CandiError.Custom('candi:Container' + (name ? ':' + name : ''));
        this._injections = [];
    }
    return Container;
})();
exports.Container = Container;

(function (ContainerErrors) {
    ContainerErrors[ContainerErrors["FunctionFoundError"] = ['FunctionFoundError', '`{0}` is a function']] = "FunctionFoundError";
    ContainerErrors[ContainerErrors["FunctionNotFoundError"] = ['FunctionNotFoundError', '`{0}` is not a function']] = "FunctionNotFoundError";
    ContainerErrors[ContainerErrors["UnknownInjectionError"] = ['UnknownInjectionError', 'No such injection `{0}` in the Container']] = "UnknownInjectionError";
    ContainerErrors[ContainerErrors["SetInjectionError"] = ['SetInjectionError', '`{0}` is a readonly injection in the Container']] = "SetInjectionError";
    ContainerErrors[ContainerErrors["UnknownDependencyError"] = ['UnknownDependencyError', '`{0}` dependency cannot be resolved in the Container']] = "UnknownDependencyError";
})(exports.ContainerErrors || (exports.ContainerErrors = {}));
var ContainerErrors = exports.ContainerErrors;

var Injection = (function () {
    function Injection(type, name, value) {
        this.type = type;
        this.name = name;
        this.value = value;
    }
    return Injection;
})();
exports.Injection = Injection;

exports.Util = require('lodash');

exports.Util.annotateFn = function (fn) {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

    var injections, fnText, fnArgs, last, result;

    if (exports.Util.isFunction(fn)) {
        if (!(injections = fn.injections)) {
            injections = [];
            if (fn.length) {
                fnText = fn.toString().replace(STRIP_COMMENTS, '');
                fnArgs = fnText.match(FN_ARGS);
                injections = fnArgs[1];
            }
            result = fn;
            result.injections = injections;
        }
    } else if (exports.Util.isArray(fn)) {
        if (exports.Util.isFunction(fn[0]) && fn[1].length) {
            injections = fn[1];
            result = fn[0];
            result.injections = injections;
        } else {
            result = fn;
        }
    } else {
        result = fn;
    }
    return result;
};
//# sourceMappingURL=candi.js.map
