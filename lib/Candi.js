/**
* Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
*/
/**
* Candi
*
* Dependency injection library written in typescript for node.js
*
* Creators of Pimple, Rewire and AngularJS have done tremendous job implementing Dependency Injection techniques
* I am thankful to their respective authors for sharing knowledge and work with the community
*
* My intended purpose of writing this library is to build a lifecycle based Application container
*
* @package Candi
* @author  Nitin Tutlani
*/
(function (Candi) {
    //I am looking for a stable alternative
    //This can handle all function calls returning primitive or object types
    //Apply any number of arguments on the fly
    var __construct = function (fn, args) {
        args = args || [];
        var result;
        result = fn.apply(fn, args);
        if (typeof (result) === 'object' || result === undefined) {
            if (args.length == 0 || args[0] !== null) {
                args.unshift(null);
            }
            result = new (fn.bind.apply(fn, args))();
        }
        return result;
    };

    /**
    * Enumerating allowed Injection type names
    * Allowed string values: value,constant, provider, factory, service
    */
    (function (InjectionTypes) {
        InjectionTypes[InjectionTypes["value"] = 'value'] = "value";
        InjectionTypes[InjectionTypes["constant"] = 'constant'] = "constant";
        InjectionTypes[InjectionTypes["provider"] = 'provider'] = "provider";
        InjectionTypes[InjectionTypes["factory"] = 'factory'] = "factory";
        InjectionTypes[InjectionTypes["service"] = 'service'] = "service";
    })(Candi.InjectionTypes || (Candi.InjectionTypes = {}));
    var InjectionTypes = Candi.InjectionTypes;

    /**
    * Enumerating thrown error names, for Translation
    */
    (function (ErrorNames) {
        ErrorNames[ErrorNames["FunctionFound"] = 'FunctionFound'] = "FunctionFound";
        ErrorNames[ErrorNames["FunctionNotFound"] = 'FunctionNotFound'] = "FunctionNotFound";
        ErrorNames[ErrorNames["UnknownInjectionType"] = 'UnknownInjectionType'] = "UnknownInjectionType";
        ErrorNames[ErrorNames["InvalidArguments"] = 'InvalidArguments'] = "InvalidArguments";
        ErrorNames[ErrorNames["InjectionExists"] = 'InjectionExists'] = "InjectionExists";
        ErrorNames[ErrorNames["ReInjectionRequired"] = 'ReInjectionRequired'] = "ReInjectionRequired";
        ErrorNames[ErrorNames["UnknownDependency"] = 'UnknownDependency'] = "UnknownDependency";
    })(Candi.ErrorNames || (Candi.ErrorNames = {}));
    var ErrorNames = Candi.ErrorNames;

    var Injection = (function () {
        function Injection(type, name, value, depends) {
            this.type = type;
            this.name = name;
            this.value = value;
            this.depends = depends;
        }
        return Injection;
    })();
    Candi.Injection = Injection;

    /**
    * Candi - Container class
    *
    * Injection (contextual) - the injected parameter, value, object or function kept in container for later use
    * Injection Types
    *  - value (get/set object)
    *  - constant (get(only) object)
    *  - provider (get/set function)
    *  - factory (new function())
    *  - service (cache obj || new function())
    * In case of function type injections Candi can automatically pass previously injected injections as arguments to their constructor.
    * Dependency Injection use case is most important for factory (execute every time) and service (execute first time) injections as they accept functions and return object obtained from constructors based on dependencies.
    *
    */
    var Container = (function () {
        /**
        * Constructor of Container
        *
        * @param parent is Parent to this container, Candi will use it as prototype to the container object
        */
        function Container(parent) {
            /**
            * Checks if the injection is already present
            * Only name of injection is checked not the type
            *
            * @param name
            * @returns {boolean}
            */
            this.hasInjection = function (name) {
                return (this._injections[name] !== undefined) ? true : false;
            };
            /**
            * Deletes previous injection
            * Supports chaning, Container.inject().hasInjection().inject()
            *
            * @param name
            * @returns this
            */
            this.deleteInjection = function (name) {
                delete this._injections[name];
                return this;
            };
            /**
            * Inject to the container
            * Supports chaning, Container.inject().hasInjection().inject()
            *
            * @param type is Type of injection check InjectionTypes for allowed types
            * @param name is name of injection
            * @param value is the injection itself
            * @returns this
            */
            this.inject = function (type, name, value, depends) {
                if (arguments.length != 3 && arguments.length != 4) {
                    throw new Error(ErrorNames.InvalidArguments.toString());
                }
                if (this.hasInjection(name)) {
                    throw new Error(ErrorNames.InjectionExists.toString());
                }
                switch (type) {
                    case InjectionTypes.value:
                        this.injectValue(name, value);
                        break;
                    case InjectionTypes.constant:
                        this.injectConstant(name, value);
                        break;
                    case InjectionTypes.provider:
                        this.injectProvider(name, value);
                        break;
                    case InjectionTypes.factory:
                        this.injectFactory(name, value, depends);
                        break;
                    case InjectionTypes.service:
                        this.injectService(name, value, depends);
                        break;
                    default:
                        throw new Error(ErrorNames.UnknownInjectionType.toString());
                        break;
                }
                return this;
            };
            this.injectValue = function (name, value) {
                Object.defineProperty(this, name, {
                    get: function () {
                        return this._injections[name].value;
                    },
                    set: function (newValue) {
                        if (typeof (newValue) === 'function') {
                            throw new Error(ErrorNames.FunctionFound.toString());
                        }
                        this._injections[name] = new Injection(InjectionTypes.value, name, newValue);
                    },
                    writeable: true,
                    enumerable: true,
                    configurable: true
                });

                if (typeof (value) === 'function') {
                    throw new Error(ErrorNames.FunctionFound.toString());
                }
                this._injections[name] = new Injection(InjectionTypes.value, name, value);
            };
            this.injectConstant = function (name, value) {
                Object.defineProperty(this, name, {
                    get: function () {
                        return this._injections[name].value;
                    },
                    set: function (newValue) {
                        throw new Error(ErrorNames.ReInjectionRequired.toString());
                    },
                    writeable: false,
                    enumerable: true,
                    configurable: true
                });

                if (typeof (value) === 'function') {
                    throw new Error(ErrorNames.FunctionFound.toString());
                }
                this._injections[name] = new Injection(InjectionTypes.constant, name, value);
            };
            this.injectProvider = function (name, value) {
                Object.defineProperty(this, name, {
                    get: function () {
                        return this._injections[name].value;
                    },
                    set: function (newValue) {
                        if (typeof (newValue) !== 'function') {
                            throw new Error(ErrorNames.FunctionNotFound.toString());
                        }
                        this._injections[name] = new Injection(InjectionTypes.value, name, newValue);
                    },
                    writeable: true,
                    enumerable: true,
                    configurable: true
                });

                if (typeof (value) !== 'function') {
                    throw new Error(ErrorNames.FunctionNotFound.toString());
                }
                this._injections[name] = new Injection(InjectionTypes.provider, name, value);
            };
            this.injectFactory = function (name, value, depends) {
                Object.defineProperty(this, name, {
                    get: function () {
                        var fn, args;
                        fn = this._injections[name].value;
                        args = this._resolveDependencies(this._injections[name].depends);
                        this._injections[name]._cache = __construct(fn, args);
                        return this._injections[name]._cache;
                    },
                    set: function (newValue) {
                        throw new Error(ErrorNames.ReInjectionRequired.toString());
                    },
                    writeable: true,
                    enumerable: true,
                    configurable: true
                });

                if (typeof (value) !== 'function') {
                    throw new Error(ErrorNames.FunctionNotFound.toString());
                }
                this._injections[name] = new Injection(InjectionTypes.provider, name, value, depends);
            };
            this.injectService = function (name, value, depends) {
                Object.defineProperty(this, name, {
                    get: function () {
                        var fn, args;
                        fn = this._injections[name].value;
                        args = this._resolveDependencies(this._injections[name].depends);
                        if (this._injections[name]._cache === undefined) {
                            this._injections[name]._cache = __construct(fn, args);
                        }
                        return this._injections[name]._cache;
                    },
                    set: function (newValue) {
                        throw new Error(ErrorNames.ReInjectionRequired.toString());
                    },
                    writeable: false,
                    enumerable: true,
                    configurable: true
                });

                if (typeof (value) !== 'function') {
                    throw new Error(ErrorNames.FunctionNotFound.toString());
                }
                this._injections[name] = new Injection(InjectionTypes.provider, name, value, depends);
            };
            //Clear service cache
            this.resetService = function (name) {
                delete this._injections[name]._cache;
                return this;
            };
            //Container specific function accepts a string of space delimited dependencies, resolve them and returns them as an Array
            //Its like a getter map
            this._resolveDependencies = function (depends) {
                if (typeof (depends) !== 'string')
                    return [];
                var dependencyNames = depends.split(' ');
                if (dependencyNames.length == 0)
                    return [];
                var dependencies = [];
                for (var i = 0; i < dependencyNames.length; i++) {
                    if (this.hasInjection(dependencyNames[i])) {
                        dependencies.push(this[dependencyNames[i]]);
                    } else {
                        throw new Error(ErrorNames.UnknownDependency.toString());
                    }
                }
                return dependencies;
            };
            if (parent)
                this.__proto__ = parent;

            this._injections = [];

            if (typeof (parent) === 'function') {
                throw new Error(ErrorNames.FunctionFound.toString());
            }
        }
        return Container;
    })();
    Candi.Container = Container;
})(exports.Candi || (exports.Candi = {}));
var Candi = exports.Candi;
var module = module || {};
module.exports = Candi;

//# sourceMappingURL=Candi.js.map
