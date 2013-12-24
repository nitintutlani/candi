/// <reference path="../references/node.d.ts" />
/// <reference path="../references/lodash.d.ts" />
export declare module CandiError {
    class Template {
        public name: string;
        public message: string;
        constructor(lib: string, code: string, name: string, template: string, options?: any[]);
        static stringify: (obj: any) => any;
    }
    function Custom(lib: string): any;
}
export declare class Container {
    public name: string;
    public _injections: Injection[];
    public ContainerError: any;
    constructor(name?: string);
    public hasInjection: (name: string) => boolean;
    public deleteInjection: (name: string) => Container;
    private _invokeInjection;
    private _inject;
    public value: (name: string, value: any) => Container;
    public constant: (name: string, value: any) => Container;
    public provider: (name: string, value: any) => Container;
    public factory: (name: string, value: any) => Container;
    public service: (name: string, value: any) => Container;
    public link: (name: string, value: any) => Container;
    public resetService: (name: string) => Container;
    private _resolveInjections;
    private __construct;
}
export declare enum ContainerErrors {
    FunctionFoundError,
    FunctionNotFoundError,
    UnknownInjectionError,
    SetInjectionError,
    UnknownDependencyError,
}
export declare class Injection {
    public type: string;
    public name: string;
    public value: any;
    public cache: any;
    constructor(type: string, name: string, value: any);
}
export declare var Util: any;
