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

export module candi {

    //Enumerating allowed Injection type names
    export enum InjectionTypes {
        value = <any>'value',
        constant = <any>'constant',
        provider = <any>'provider',
        factory = <any>'factory',
        service = <any>'service'
    }

    //Enumerating thrown error names, for Translation
    export enum ErrorNames {
        FunctionFound = <any>'FunctionFound',
        FunctionNotFound = <any>'FunctionNotFound',
        UnknownInjectionType = <any>'UnknownInjectionType',
        InvalidArguments = <any>'InvalidArguments',
    }


    class Definition {
        public type: InjectionTypes;
        public name: string;
        public value: any;
        private _cache: {};
    }

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
    export class Candi {

        //parent of this Container
        public __proto__: {};
        private _definitions: Definition[];

        /**
         * Constructor of Candi
         *
         * @param parent is Parent to this container, Candi will use it as prototype to the container object
         */
        constructor(parent: Object) {
            // use obj param as prototype object to this container
            if(parent) this.__proto__ = parent;

            //reject if param obj is anther function
            if( typeof(parent) === 'function' ) {
                throw new Error( ErrorNames.FunctionFound.toString() );
            }

        }

        /**
         * Inject definitions to the container
         *
         * @param type is Type of injection check InjectionTypes for allowed types
         * @param name is name of injected definition
         * @param value is the definition value itself
         */
        public inject = function(type: InjectionTypes, name: string, value: any) {

            if( arguments.length != 3 ) {
                throw new Error( ErrorNames.InvalidArguments.toString() );
            }

            switch( type ) {
                case InjectionTypes.value:
                    this.injectValue(name, value);
                    break;
                case InjectionTypes.constant:
                    this.injectConstant(name, value);
                    break;
                default:
                    throw new Error( ErrorNames.UnknownInjectionType.toString() );
                    break;
            }
        }

        private injectValue = function(name: string, value: any): void {
            //reject if param obj is anther function
            if( typeof(value) === 'function' ) {
                throw new Error( ErrorNames.FunctionFound.toString() );
            }
            this._definitions[name] = value;
            Object.defineProperty(this, name, {
                get : function(){
                    return this._definitions[name];
                },
                set : function(newValue){
                    this._definitions[name] = newValue;
                },
                writeable: true,
                enumerable : true,
                configurable : true});
        }

        private injectConstant = function(name: string, value: any): void {
            //reject if param obj is anther function
            if( typeof(value) === 'function' ) {
                throw new Error( ErrorNames.FunctionFound.toString() );
            }
            this._definitions[name] = value;
            Object.defineProperty(this, name, {
                get : function(){
                    return this._definitions[name];
                },
                writeable: false,
                enumerable : true,
                configurable : true});
        }

        /**
         * Checks if the injected definition is present
         * Only name of definition is checked not the type
         *
         * @param name
         * @returns {boolean}
         */
        public hasInject = function(name: string) : boolean {
            return (this._definitions[name] != undefined)? true : false;
        }

        /**
         * Deletes previously injected definition
         *
         * @param injectionName
         * @returns {boolean}
         */
        public deleteInject = function(name: string): void {
            delete this._definitions[name];
        }

    }
}

