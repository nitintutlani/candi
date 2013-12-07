/**
* Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
*/
/**
* candi
*
* Dependency injection library written in typescript for node.js
*
* Creators of Pimple, Rewire and AngularJS have done tremendous job implementing Dependency injection techniques
* I am thankful to their respective authors for sharing knowledge and work with the community
*
* My intended purpose of writing this library is to build a lifecycle based Application container
*
* @package candi
* @author  Nitin Tutlani
*/
var candi;
(function (candi) {
    /**
    * Enumerating allowed injection type names
    * Allowed string values: value,constant, provider, factory, service
    */
    (function (injectionTypes) {
        injectionTypes[injectionTypes["value"] = 'value'] = "value";
        injectionTypes[injectionTypes["constant"] = 'constant'] = "constant";
        injectionTypes[injectionTypes["provider"] = 'provider'] = "provider";
        injectionTypes[injectionTypes["factory"] = 'factory'] = "factory";
        injectionTypes[injectionTypes["service"] = 'service'] = "service";
    })(candi.injectionTypes || (candi.injectionTypes = {}));
    var injectionTypes = candi.injectionTypes;

    /**
    * Enumerating thrown error names, for Translation
    */
    (function (errorNames) {
        errorNames[errorNames["FunctionFoundError"] = 'FunctionFoundError'] = "FunctionFoundError";
        errorNames[errorNames["FunctionNotFoundError"] = 'FunctionNotFoundError'] = "FunctionNotFoundError";
        errorNames[errorNames["UnknowninjectionTypeError"] = 'UnknowninjectionTypeError'] = "UnknowninjectionTypeError";
        errorNames[errorNames["InvalidArgumentsError"] = 'InvalidArgumentsError'] = "InvalidArgumentsError";
        errorNames[errorNames["injectionExistsError"] = 'injectionExistsError'] = "injectionExistsError";
        errorNames[errorNames["ReinjectionRequiredError"] = 'ReinjectionRequiredError'] = "ReinjectionRequiredError";
        errorNames[errorNames["UnknownDependencyError"] = 'UnknownDependencyError'] = "UnknownDependencyError";
    })(candi.errorNames || (candi.errorNames = {}));
    var errorNames = candi.errorNames;

    var injection = (function () {
        function injection(type, name, value, depends) {
            this.type = type;
            this.name = name;
            this.value = value;
            this.depends = depends;
        }
        return injection;
    })();
    candi.injection = injection;

    /**
    * candi - container class
    *
    * injection (contextual) - the injected parameter, value, object or function kept in container for later use
    * injection Types
    *  - value (get/set object)
    *  - constant (get(only) object)
    *  - provider (get/set function)
    *  - factory (new function())
    *  - service (cache obj || new function())
    * In case of function type injections candi can automatically pass previously injected injections as arguments to their constructor.
    * Dependency injection use case is most important for factory (execute every time) and service (execute first time) injections as they accept functions and return object obtained from constructors based on dependencies.
    *
    */
    var container = (function () {
        /**
        * Constructor of container
        *
        * @param parent is Parent to this container, candi will use it as prototype to the container object
        */
        function container(parent) {
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
            * Supports chaning, container.inject().hasInjection().inject()
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
            * Supports chaning, container.inject().hasInjection().inject()
            *
            * @param type is Type of injection check injectionTypes for allowed types
            * @param name is name of injection
            * @param value is the injection itself
            * @returns this
            *
            * @todo Make value optional at the time of injection
            */
            this.inject = function (type, name, value, depends) {
                if (arguments.length != 3 && arguments.length != 4) {
                    throw new Error(errorNames.InvalidArgumentsError.toString());
                }
                if (this.hasInjection(name)) {
                    throw new Error(errorNames.injectionExistsError.toString());
                }
                switch (type) {
                    case injectionTypes.value:
                        this.injectValue(name, value);
                        break;
                    case injectionTypes.constant:
                        this.injectConstant(name, value);
                        break;
                    case injectionTypes.provider:
                        this.injectProvider(name, value);
                        break;
                    case injectionTypes.factory:
                        this.injectFactory(name, value, depends);
                        break;
                    case injectionTypes.service:
                        this.injectService(name, value, depends);
                        break;
                    default:
                        throw new Error(errorNames.UnknowninjectionTypeError.toString());
                        break;
                }
                return this;
            };
            /**
            * ReInject to the container
            * Supports chaning, container.inject().hasInjection().reinject()
            * Quick work around for deleteInjection().inject()
            *
            * @param type is Type of injection check injectionTypes for allowed types
            * @param name is name of injection
            * @param value is the injection itself
            * @returns this
            */
            this.reinject = function (type, name, value, depends) {
                return this.deleteInjection(name).inject(type, name, value, depends);
            };
            this.injectValue = function (name, value) {
                Object.defineProperty(this, name, {
                    get: function () {
                        return this._injections[name].value;
                    },
                    set: function (newValue) {
                        if (typeof (newValue) === 'function') {
                            throw new Error(errorNames.FunctionFoundError.toString());
                        }
                        this._injections[name] = new injection(injectionTypes.value, name, newValue);
                    },
                    writeable: true,
                    enumerable: true,
                    configurable: true
                });

                if (typeof (value) === 'function') {
                    throw new Error(errorNames.FunctionFoundError.toString());
                }
                this._injections[name] = new injection(injectionTypes.value, name, value);
            };
            this.injectConstant = function (name, value) {
                Object.defineProperty(this, name, {
                    get: function () {
                        return this._injections[name].value;
                    },
                    set: function (newValue) {
                        throw new Error(errorNames.ReinjectionRequiredError.toString());
                    },
                    writeable: false,
                    enumerable: true,
                    configurable: true
                });

                if (typeof (value) === 'function') {
                    throw new Error(errorNames.FunctionFoundError.toString());
                }
                this._injections[name] = new injection(injectionTypes.constant, name, value);
            };
            this.injectProvider = function (name, value) {
                Object.defineProperty(this, name, {
                    get: function () {
                        return this._injections[name].value;
                    },
                    set: function (newValue) {
                        if (typeof (newValue) !== 'function') {
                            throw new Error(errorNames.FunctionNotFoundError.toString());
                        }
                        this._injections[name] = new injection(injectionTypes.value, name, newValue);
                    },
                    writeable: true,
                    enumerable: true,
                    configurable: true
                });

                if (typeof (value) !== 'function') {
                    throw new Error(errorNames.FunctionNotFoundError.toString());
                }
                this._injections[name] = new injection(injectionTypes.provider, name, value);
            };
            this.injectFactory = function (name, value, depends) {
                Object.defineProperty(this, name, {
                    get: function () {
                        var fn, args;
                        fn = this._injections[name].value;
                        args = this._resolveDependencies(this._injections[name].depends);
                        this._injections[name]._cache = this.__construct(fn, args);
                        return this._injections[name]._cache;
                    },
                    set: function (newValue) {
                        throw new Error(errorNames.ReinjectionRequiredError.toString());
                    },
                    writeable: true,
                    enumerable: true,
                    configurable: true
                });

                if (typeof (value) !== 'function') {
                    throw new Error(errorNames.FunctionNotFoundError.toString());
                }
                this._injections[name] = new injection(injectionTypes.provider, name, value, depends);
            };
            this.injectService = function (name, value, depends) {
                Object.defineProperty(this, name, {
                    get: function () {
                        var fn, args;
                        fn = this._injections[name].value;
                        args = this._resolveDependencies(this._injections[name].depends);
                        if (this._injections[name]._cache === undefined) {
                            this._injections[name]._cache = this.__construct(fn, args);
                        }
                        return this._injections[name]._cache;
                    },
                    set: function (newValue) {
                        throw new Error(errorNames.ReinjectionRequiredError.toString());
                    },
                    writeable: false,
                    enumerable: true,
                    configurable: true
                });

                if (typeof (value) !== 'function') {
                    throw new Error(errorNames.FunctionNotFoundError.toString());
                }
                this._injections[name] = new injection(injectionTypes.provider, name, value, depends);
            };
            //Clear service cache
            this.resetService = function (name) {
                delete this._injections[name]._cache;
                return this;
            };
            //container specific function accepts a string of space delimited dependencies, resolve them and returns them as an Array
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
                        throw new Error(errorNames.UnknownDependencyError.toString());
                    }
                }
                return dependencies;
            };
            //I am looking for a stable alternative
            //This can handle all function calls returning primitive or object types
            //Apply any number of arguments on the fly
            this.__construct = function (fn, args) {
                args = args || [];
                var result;
                result = fn.apply(fn, args);
                if (typeof (result) === 'object' || result === undefined) {
                    if (args.length == 0 || args[0] !== null) {
                        //insert null as first item to the array of arguments
                        args.unshift(null);
                    }
                    result = new (fn.bind.apply(fn, args))();
                }
                return result;
            };
            if (parent)
                this.__proto__ = parent;

            this._injections = [];

            if (typeof (parent) === 'function') {
                throw new Error(errorNames.FunctionFoundError.toString());
            }
        }
        return container;
    })();
    candi.container = container;
})(candi || (candi = {}));


module.exports = candi;

//# sourceMappingURL=candi.js.map
