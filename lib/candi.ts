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
 * @author  Nitin Tutlani <nitintutlani@yahoo.com>
 * @version 0.2.0
 */


///<reference path='../references/node.d.ts' />
///<reference path='../references/lodash.d.ts' />

export module CandiError {
    /**
     * Template class for Error
     *
     * Usage:
     *     throw new Template('my_lib_name', 'my_code_area_name', 'myError', 'This error message supports tags like {0}, {1}', [100, 'foo']);
     */
    export class Template {
        public name: string;
        public message: string;

        constructor(lib: string, code: string, name: string, template: string, options?: any[]) {
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

        public static stringify = function(obj) {
            if (typeof obj === 'function') {
                return obj.toString().replace(/ \{[\s\S]*$/, '');
            } else if (typeof obj === 'undefined') {
                return 'undefined';
            } else if (typeof obj !== 'string') {
                return JSON.stringify(obj);
            }
            return obj;
        }

    }

    /**
     * Wrapper function can be used as Class to create custom template Errors
     *
     * Usage
     *     var myError = new Custom('my_lib_name');
     *     throw myError('my_code_area_name', 'myError', 'This error message supports tags like {0}, {1}', 100, 'foo');
     *
     * PS: The tag parameters are passed as arguments. This usage is different from Template class
     */
    export function Custom(lib: string): any {
        return function (code: string, name: string, template: string, ...options: any[]): Template {
            return new Template(lib, code, name, template, options);
        };
    }
}

/**
 * Container class
 *
 * injection (contextual) - the injected parameter, value, object or function kept in container for later use
 * injection types
 *  - value (get/set object)
 *  - constant (get(only) object)
 *  - provide (get/set function)
 *  - factory (new function())
 *  - service (cache obj || new function())
 *  - import (reference to another container injection or object property)
 * In case of factory and service type injections candi can automatically pass previously injected injections as arguments.
 * `import` type injection for linking to another container's injections or another object properties.
 *
 * Ability to extend or inherit from parent object has been revoked, it added complexity and both going down and upside of Container Provider Bundle Application chain.
 */
export class Container {

    public name: string;
    public _injections: Injection[];
    public ContainerError: any;

    /**
     * Constructor of Container
     *
     * @param name is Name to this container, candi will throw errors using this name.
     */
    constructor(name?: string) {
        this.name = name || 'candi';
        this.ContainerError = CandiError.Custom( 'candi:Container' + ( name ? ':' + name : ''));
        this._injections = [];
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
     * Supports chaining, container.hasInjection().deleteInjection().value...
     *
     * @param name
     * @returns this
     */
    public deleteInjection = function(name: string): Container {
        delete this._injections[name];
        return this;
    }

    //Invoke injection method
    private _invokeInjection = function(name: string): any {
        if(this.hasInjection(name)) {
            var injection: Injection;
            injection = this._injections[name];
            switch(this._injections[name].type) {
                case 'value':
                case 'constant':
                case 'provider':
                    return injection.value;
                    break;
                case 'service':
                    if(!Util.isUndefined(injection.cache)) {
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
            throw this.ContainerError('_invokeInjection', ContainerErrors.UnknownInjectionError[0] , ContainerErrors.UnknownInjectionError[1], name);
        }
    }

    //Common injection method
    private _inject = function(type: string, name: string, value: any): Container {

        Object.defineProperty(this, name, {
            get : function(){
                return this._invokeInjection(name);
            },
            set : function(newValue){
                if( type === 'value' ) {
                    //Cannot inject function as value
                    if( Util.isFunction(newValue) ) {
                        throw this.ContainerError(type, ContainerErrors.FunctionFoundError[0] , ContainerErrors.FunctionFoundError[1], newValue);
                    }
                    this._injections[name] = new Injection(type, name, newValue);
                } else {
                    throw this.ContainerError(type, ContainerErrors.SetInjectionError[0] , ContainerErrors.SetInjectionError[1], newValue);
                }
            },
            writeable: (type === 'value'),
            enumerable : true,
            configurable : true});

        //Cannot inject function as value
        switch(type) {
            case 'value':
            case 'constant':
                if(Util.isFunction(value) ) {
                    throw this.ContainerError(type, ContainerErrors.FunctionFoundError[0] , ContainerErrors.FunctionFoundError[1], value);
                }
                break;
            case 'factory':
            case 'service':
                //use Util.annotateFn to filter value into annotated function
                value = Util.annotateFn(value);
            case 'provider':
                if( !Util.isFunction(value) ) {
                    throw this.ContainerError(type, ContainerErrors.FunctionNotFoundError[0] , ContainerErrors.FunctionNotFoundError[1], value);
                }
                break;
            case 'link':
                break;
        }
        this._injections[name] = new Injection(type, name, value);
        return this;
    }

    /**
     * Inject value to the container
     * Supports chaining, container.hasInjection().deleteInjection().value...
     *
     * @param name is name of value to be injected
     * @param value itself
     * @returns this
     *
     */
    public value = function(name: string, value: any): Container {
        return this._inject('value', name, value);
    }

    /**
     * Inject constant to the container
     * Supports chaining, container.hasInjection().deleteInjection().constant...
     *
     * @param name is name of constant to be injected
     * @param value itself
     * @returns this
     *
     */
    public constant = function(name: string, value: any): Container {
        return this._inject('constant', name, value);
    }

    /**
     * Inject provider function to the container
     * Supports chaining, container.hasInjection().deleteInjection().provider...
     *
     * @param name is name of provider function to be injected
     * @param value itself
     * @returns this
     *
     */
    public provider = function(name: string, value: any): Container {
        return this._inject('provider', name, value);
    }

    /**
     * Inject factory function (or annotated function or invokable function array) to the container that returns object or primitive
     * For non-returning function register as factory provider
     * See Util.annotateFn for detail
     * Supports chaining, container.hasInjection().deleteInjection().factory...
     *
     * @param name is name of provider function to be injected
     * @param value itself
     * @returns this
     *
     */
    public factory = function(name: string, value: any): Container {
        return this._inject('factory', name, value);
    }

    /**
     * Inject service function (or annotated function or invokable function array) to the container that returns object or primitive
     * For non-returning function register as service provider
     * See Util.annotateFn for detail
     * Supports chaining, container.hasInjection().deleteInjection().factory...
     *
     * @param name is name of provider function to be injected
     * @param value itself
     * @returns this
     *
     */
    public service = function(name: string, value: any): Container {
        return this._inject('service', name, value);
    }

    /**
     * Inject link
     * Add a special link injection that links to other container or object property
     * Injected link and object property must have same names
     * Primary use of link injections comes into play when Bundles import/export from other Bundles
     * Supports chaining, container.hasInjection().deleteInjection().factory...
     *
     * @param name is name of property to be linked
     * @param object to which property link is established
     * @returns this
     *
     */
    public link = function(name: string, value: any): Container {
        return this._inject('link', name, value);
    }

    /**
     * Clear service cache
     * This will cause service to be re-initialized the next time it is called
     * Supports chaining, container.hasInjection().deleteInjection().resetService...
     *
     * @param name
     * @returns this
     */
    public resetService = function(name: string): Container {
        delete this._injections[name].cache;
        return this;
    }

    //Accepts a string of function arguments, resolves them and returns them as an Array
    private _resolveInjections = function(injections: string): any[] {
        if(!Util.isString(injections)) return [];
        var injectionNames: string[] = injections.replace(' ', '').split(',');
        if(injectionNames.length==0) return [];
        var result: any[] = [];
        for (var i = 0; i < injectionNames.length; i++) {
            if( !Util.isUndefined(this[injectionNames[i]]) ) {
                result.push( this[injectionNames[i]] );
            } else {
                throw this.ContainerError('_resolveInjections', ContainerErrors.UnknownDependencyError[0] , ContainerErrors.UnknownDependencyError[1], injectionNames[i]);
            }
        }
        return result;
    }

    //I am looking for a stable alternative
    //__construct call is specific to factory or service injections
    //This function applies args to the bound injection function
    //By convention all factory functions should return a new object from within their code
    // and all service function should create object when called first time and return same object on subsequent calls
    //If in either case fn.apply does not return a valid object a new bind.apply call is executed
    private __construct = function(fn, injections): any {
        injections = injections || [];
        var result: any;
        result = fn.apply(fn, injections);
        if( result === undefined ) {
            if( injections.length==0 || injections[0]!==null ) {
                //insert null as first item to the array of arguments
                injections.unshift(null);
            }
            result = new (fn.bind.apply(fn, injections ))();
        }
        return result;
    }

}

/**
 * Enumerating thrown error names, for Translation
 * This enum array contains array objects of name, template pairs
 */
export enum ContainerErrors {
    FunctionFoundError = <any>['FunctionFoundError', '`{0}` is a function'],
    FunctionNotFoundError = <any>['FunctionNotFoundError', '`{0}` is not a function'],
    UnknownInjectionError = <any>['UnknownInjectionError', 'No such injection `{0}` in the Container'],
    SetInjectionError = <any>['SetInjectionError', '`{0}` is a readonly injection in the Container'],
    UnknownDependencyError = <any>['UnknownDependencyError', '`{0}` dependency cannot be resolved in the Container']
}

/**
 * Injectable object class
 *
 * Every container has _injections array that collects these Injection objects
 * Removed `depends`, provider functions now inject invokable functions into value as returned from Util.annotateFn
 */
export class Injection {
    public type: string;
    public name: string;
    public value: any;
    public cache: any;

    constructor(type: string, name: string, value: any) {
        this.type = type;
        this.name = name;
        this.value = value;
    }

}

declare module _ {
    interface LoDashStatic {
        annotateFn(fn: any): any;
    }
}

export var Util = require('lodash');

/**
 * Annotates a function with static parameter `injections`
 * injections is a string of comma separated function arguments to protect it from minification
 * annotated function can be used as DI provider and called later by way of Automatic injections
 *
 * @param fn function to annotate, function can also be an Invokable function array [fn: function, injections: string]
 * @returns Annotated function reference is returned
 */
Util.annotateFn = function(fn) {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

    var injections, fnText, fnArgs, last, result;

    if (Util.isFunction(fn)) {
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
    } else if (Util.isArray(fn)) {
        if (Util.isFunction(fn[0]) && fn[1].length) {
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
}