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

export module Candi {

    //I am looking for a stable alternative
    //This can handle all function calls returning primitive or object types
    //Apply any number of arguments on the fly
    var __construct: any = function(fn, args): any {
        args = args || [];
        var result: any;
        result = fn.apply(fn, args);
        if( typeof(result) === 'object' || result === undefined ) {
            if( args.length==0 || args[0]!==null ) {
                args.unshift(null);
            }
            result = new (fn.bind.apply(fn, args ))();
        }
        return result;
    }

    /**
     * Enumerating allowed Injection type names
     * Allowed string values: value,constant, provider, factory, service
     */
    export enum InjectionTypes {
        value = <any>'value',
        constant = <any>'constant',
        provider = <any>'provider',
        factory = <any>'factory',
        service = <any>'service'
    }

    /**
     * Enumerating thrown error names, for Translation
     */
    export enum ErrorNames {
        FunctionFound = <any>'FunctionFound',
        FunctionNotFound = <any>'FunctionNotFound',
        UnknownInjectionType = <any>'UnknownInjectionType',
        InvalidArguments = <any>'InvalidArguments',
        InjectionExists = <any>'InjectionExists',
        ReInjectionRequired = <any>'ReInjectionRequired',
        UnknownDependency = <any>'UnknownDependency'
    }

    export class Injection {
        public type: InjectionTypes;
        public name: string;
        public depends: string;
        public value: any;
        public _cache: any;

        constructor(type: InjectionTypes, name: string, value: any, depends?: string) {
            this.type = type;
            this.name = name;
            this.value = value;
            this.depends = depends;
        }

    }

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
    export class Container {

        //parent of this Container
        public __proto__: {};
        public _injections: Injection[];

        /**
         * Constructor of Container
         *
         * @param parent is Parent to this container, Candi will use it as prototype to the container object
         */
        constructor(parent: Object) {
            // use obj param as prototype object to this container
            if(parent) this.__proto__ = parent;

            this._injections = [];

            //reject if param obj is anther function
            if( typeof(parent) === 'function' ) {
                throw new Error( ErrorNames.FunctionFound.toString() );
            }

        }

        /**
         * Checks if the injection is already present
         * Only name of injection is checked not the type
         *
         * @param name
         * @returns {boolean}
         */
        public hasInjection = function(name: string) : boolean {
            return (this._injections[name] !== undefined) ? true : false;
        }

        /**
         * Deletes previous injection
         * Supports chaning, Container.inject().hasInjection().inject()
         *
         * @param name
         * @returns this
         */
        public deleteInjection = function(name: string): Container {
            delete this._injections[name];
            return this;
        }

        /**
         * Inject to the container
         * Supports chaning, Container.inject().hasInjection().inject()
         *
         * @param type is Type of injection check InjectionTypes for allowed types
         * @param name is name of injection
         * @param value is the injection itself
         * @returns this
         */
        public inject = function(type: InjectionTypes, name: string, value: any, depends?: string): Container {
            if( arguments.length != 3 && arguments.length != 4 ) {
                throw new Error( ErrorNames.InvalidArguments.toString() );
            }
            if( this.hasInjection(name) ) {
                throw new Error( ErrorNames.InjectionExists.toString() );
            }
            switch( type ) {
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
                    throw new Error( ErrorNames.UnknownInjectionType.toString() );
                    break;
            }
            return this;
        }

        private injectValue = function(name: string, value: any): void {
            Object.defineProperty(this, name, {
                get : function(){
                    return this._injections[name].value;
                },
                set : function(newValue){
                    //reject if function is being injected
                    if( typeof(newValue) === 'function' ) {
                        throw new Error( ErrorNames.FunctionFound.toString() );
                    }
                    this._injections[name] = new Injection(InjectionTypes.value, name, newValue);
                },
                writeable: true,
                enumerable : true,
                configurable : true});
            //reject if function is being injected
            if( typeof(value) === 'function' ) {
                throw new Error( ErrorNames.FunctionFound.toString() );
            }
            this._injections[name] = new Injection(InjectionTypes.value, name, value);
        }

        private injectConstant = function(name: string, value: any): void {
            Object.defineProperty(this, name, {
                get : function(){
                    return this._injections[name].value;
                },
                set : function(newValue){
                    throw new Error( ErrorNames.ReInjectionRequired.toString() );
                },
                writeable: false,
                enumerable : true,
                configurable : true});

            //reject if param obj is anther function
            if( typeof(value) === 'function' ) {
                throw new Error( ErrorNames.FunctionFound.toString() );
            }
            this._injections[name] = new Injection(InjectionTypes.constant, name, value);
        }

        private injectProvider = function(name: string, value: any): void {
            Object.defineProperty(this, name, {
                get : function(){
                    return this._injections[name].value;
                },
                set : function(newValue){
                    //reject if non-function is being injected
                    if( typeof(newValue) !== 'function' ) {
                        throw new Error( ErrorNames.FunctionNotFound.toString() );
                    }
                    this._injections[name] = new Injection(InjectionTypes.value, name, newValue);
                },
                writeable: true,
                enumerable : true,
                configurable : true});
            //reject if non-function is being injected
            if( typeof(value) !== 'function' ) {
                throw new Error( ErrorNames.FunctionNotFound.toString() );
            }
            this._injections[name] = new Injection(InjectionTypes.provider, name, value);
        }

        private injectFactory = function(name: string, value: any, depends: string): void {
            Object.defineProperty(this, name, {
                get : function(){
                    var fn: any, args: any[];
                    fn = this._injections[name].value;
                    args = this._resolveDependencies(this._injections[name].depends);
                    this._injections[name]._cache = __construct(fn, args);
                    return this._injections[name]._cache;
                },
                set : function(newValue){
                    throw new Error( ErrorNames.ReInjectionRequired.toString() );
                },
                writeable: true,
                enumerable : true,
                configurable : true});
            //reject if non-function is being injected
            if( typeof(value) !== 'function' ) {
                throw new Error( ErrorNames.FunctionNotFound.toString() );
            }
            this._injections[name] = new Injection(InjectionTypes.provider, name, value, depends);
        }

        private injectService = function(name: string, value: any, depends: string): void {
            Object.defineProperty(this, name, {
                get : function(){
                    var fn: any, args: any[];
                    fn = this._injections[name].value;
                    args = this._resolveDependencies(this._injections[name].depends);
                    if(this._injections[name]._cache === undefined) {
                        this._injections[name]._cache = __construct(fn, args);
                    }
                    return this._injections[name]._cache;
                },
                set : function(newValue){
                    throw new Error( ErrorNames.ReInjectionRequired.toString() );
                },
                writeable: false,
                enumerable : true,
                configurable : true});
            //reject if non-function is being injected
            if( typeof(value) !== 'function' ) {
                throw new Error( ErrorNames.FunctionNotFound.toString() );
            }
            this._injections[name] = new Injection(InjectionTypes.provider, name, value, depends);
        }

        //Clear service cache
        public resetService = function(name: string): Container {
            delete this._injections[name]._cache;
            return this;
        }

        //Container specific function accepts a string of space delimited dependencies, resolve them and returns them as an Array
        //Its like a getter map
        public _resolveDependencies = function(depends: string): any[] {
            if(typeof(depends)!=='string') return [];
            var dependencyNames: string[] = depends.split(' ');
            if(dependencyNames.length==0) return [];
            var dependencies: any[] = [];
            for (var i = 0; i < dependencyNames.length; i++) {
                if( this.hasInjection( dependencyNames[i] ) ) {
                    dependencies.push( this[dependencyNames[i]] );
                } else {
                    throw new Error( ErrorNames.UnknownDependency.toString() );
                }
            }
            return dependencies;
        }

    }
}
var module = module || {};
module.exports = Candi;