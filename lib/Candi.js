/**
* Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
*/
/**
* candi
*
* Dependency injection library written in typescript for node.js
*
* Creators of Pimple, Rewire and AngularJS have done tremendous job implementing Dependency Injection techniques
* I am thankful to their respective authors for sharing knowledge and work with the community
*
* My intended purpose of writing this library is to build a lifecycle based Application container
*
* @package candi
* @author  Nitin Tutlani
*/
(function (candi) {
    //Enumerating allowed Injection type names
    (function (InjectionTypes) {
        InjectionTypes[InjectionTypes["value"] = 'value'] = "value";
        InjectionTypes[InjectionTypes["constant"] = 'constant'] = "constant";
        InjectionTypes[InjectionTypes["provider"] = 'provider'] = "provider";
        InjectionTypes[InjectionTypes["factory"] = 'factory'] = "factory";
        InjectionTypes[InjectionTypes["service"] = 'service'] = "service";
    })(candi.InjectionTypes || (candi.InjectionTypes = {}));
    var InjectionTypes = candi.InjectionTypes;

    //Enumerating thrown error names, for Translation
    (function (ErrorNames) {
        ErrorNames[ErrorNames["FunctionFound"] = 'FunctionFound'] = "FunctionFound";
        ErrorNames[ErrorNames["FunctionNotFound"] = 'FunctionNotFound'] = "FunctionNotFound";
        ErrorNames[ErrorNames["UnknownInjectionType"] = 'UnknownInjectionType'] = "UnknownInjectionType";
        ErrorNames[ErrorNames["InvalidArguments"] = 'InvalidArguments'] = "InvalidArguments";
    })(candi.ErrorNames || (candi.ErrorNames = {}));
    var ErrorNames = candi.ErrorNames;

    var Definition = (function () {
        function Definition() {
        }
        return Definition;
    })();

    /**
    * Candi - Container class
    *
    * Definition (contextual) - the injected parameter, value, object or function.
    * Injection is an act of keeping definitions in a container for later use.
    * Injection Types
    *  - value (get/set object)
    *  - constant (get(only) object)
    *  - provider (get/set function)
    *  - factory (new function())
    *  - service (cache obj || new function())
    * In case of function type definitions Candi can automatically pass previously injected definitions as arguments to their constructor.
    * Dependency Injection use case is most important for factory (execute every time) and service (execute first time) definitions as they accept functions and return object obtained from constructors
    *
    */
    var Candi = (function () {
        /**
        * Constructor of Candi
        *
        * @param parent is Parent to this container, Candi will use it as prototype to the container object
        */
        function Candi(parent) {
            if (parent)
                this.__proto__ = parent;

            if (typeof (parent) === 'function') {
                throw new Error(ErrorNames.FunctionFound.toString());
            }
        }
        /**
        * Inject definitions to the container
        *
        * @param type is Type of injection check InjectionTypes for allowed types
        * @param name is name of injected definition
        * @param value is the definition value itself
        */
        Candi.prototype.inject = function (type, name, value) {
            if (arguments.length != 2 || arguments.length != 3) {
                throw new Error(ErrorNames.InvalidArguments.toString());
            }

            switch (type) {
                case InjectionTypes.value:
                    this.injectValue(name, value);
                    break;
                case InjectionTypes.constant:
                    this.injectConstant(name, value);
                    break;
                default:
                    throw new Error(ErrorNames.UnknownInjectionType.toString());
                    break;
            }
        };

        Candi.prototype.injectValue = function (name, value) {
            if (typeof (value) === 'function') {
                throw new Error(ErrorNames.FunctionFound.toString());
            }
            this._definitions[name] = value;
            Object.defineProperty(this, name, {
                get: function () {
                    return this._definitions[name];
                },
                set: function (newValue) {
                    this._definitions[name] = newValue;
                },
                writeable: true,
                enumerable: true,
                configurable: true
            });
        };

        Candi.prototype.injectConstant = function (name, value) {
            if (typeof (value) === 'function') {
                throw new Error(ErrorNames.FunctionFound.toString());
            }
            this._definitions[name] = value;
            Object.defineProperty(this, name, {
                get: function () {
                    return this._definitions[name];
                },
                writeable: false,
                enumerable: true,
                configurable: true
            });
        };

        /**
        * Checks if the injected definition is present
        * Only name of definition is checked not the type
        *
        * @param name
        * @returns {boolean}
        */
        Candi.prototype.hasInject = function (name) {
            return (this._definitions[name] != undefined) ? true : false;
        };

        /**
        * Deletes previously injected definition
        *
        * @param injectionName
        * @returns {boolean}
        */
        Candi.prototype.deleteInject = function (name) {
            delete this._definitions[name];
        };
        return Candi;
    })();
    candi.Candi = Candi;
})(exports.candi || (exports.candi = {}));
var candi = exports.candi;

//# sourceMappingURL=Candi.js.map
