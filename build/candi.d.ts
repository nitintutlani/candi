/// <reference path="../references/node.d.ts" />
/// <reference path="../references/lodash.d.ts" />
export declare module CandiError {
    /**
    * Template class for Error
    *
    * Usage:
    *     throw new Template('my_lib_name', 'my_code_area_name', 'myError', 'This error message supports tags like {0}, {1}', [100, 'foo']);
    */
    class Template {
        public name: string;
        public message: string;
        constructor(lib: string, code: string, name: string, template: string, options?: any[]);
        static stringify: (obj: any) => any;
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
    function Custom(lib: string): any;
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
export declare class Container {
    public name: string;
    public _injections: Injection[];
    public ContainerError: any;
    /**
    * Constructor of Container
    *
    * @param name is Name to this container, candi will throw errors using this name.
    */
    constructor(name?: string);
    /**
    * Checks if the injection is already present
    * Only name of injection is checked not the type
    *
    * @param name
    * @returns {boolean}
    */
    public hasInjection: (name: string) => boolean;
    /**
    * Deletes previous injection
    * Supports chaining, container.hasInjection().deleteInjection().value...
    *
    * @param name
    * @returns this
    */
    public deleteInjection: (name: string) => Container;
    private _invokeInjection;
    private _inject;
    /**
    * Inject value to the container
    * Supports chaining, container.hasInjection().deleteInjection().value...
    *
    * @param name is name of value to be injected
    * @param value itself
    * @returns this
    *
    */
    public value: (name: string, value: any) => Container;
    /**
    * Inject constant to the container
    * Supports chaining, container.hasInjection().deleteInjection().constant...
    *
    * @param name is name of constant to be injected
    * @param value itself
    * @returns this
    *
    */
    public constant: (name: string, value: any) => Container;
    /**
    * Inject provider function to the container
    * Supports chaining, container.hasInjection().deleteInjection().provider...
    *
    * @param name is name of provider function to be injected
    * @param value itself
    * @returns this
    *
    */
    public provider: (name: string, value: any) => Container;
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
    public factory: (name: string, value: any) => Container;
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
    public service: (name: string, value: any) => Container;
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
    public link: (name: string, value: any) => Container;
    /**
    * Clear service cache
    * This will cause service to be re-initialized the next time it is called
    * Supports chaining, container.hasInjection().deleteInjection().resetService...
    *
    * @param name
    * @returns this
    */
    public resetService: (name: string) => Container;
    private _resolveInjections;
    private __construct;
}
/**
* Enumerating thrown error names, for Translation
* This enum array contains array objects of name, template pairs
*/
export declare enum ContainerErrors {
    FunctionFoundError,
    FunctionNotFoundError,
    UnknownInjectionError,
    SetInjectionError,
    UnknownDependencyError,
}
/**
* Injectable object class
*
* Every container has _injections array that collects these Injection objects
* Removed `depends`, provider functions now inject invokable functions into value as returned from Util.annotateFn
*/
export declare class Injection {
    public type: string;
    public name: string;
    public value: any;
    public cache: any;
    constructor(type: string, name: string, value: any);
}
export declare var Util: any;
