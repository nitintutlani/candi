/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */

//Error declaration as class
//lib.d.ts declares Error as interface
export declare class ErrorClass implements Error {
    public name: string;
    public message: string;
    constructor(message?: string);
}
//Just a trick found here: http://stackoverflow.com/questions/12915412/how-do-i-extend-a-host-object-e-g-error-in-typescript
var ErrorClass = Error;

/**
 * Template class for Error
 *
 * Usage:
 *     throw new Template('my_package_name', 'my_code_area_name', 'myError', 'This error message supports tags like {0}, {1}', [100, 'foo']);
 */
export class Template extends ErrorClass {
    public name: string;
    public message: string;

    constructor(package: string, code: string, name: string, template: string, options: Array) {
        this.name = name;
        this.message = '[' + (package ? package + ':' + code : code) + '] ' + template.replace(/\{\d+\}/g, function (match) {
            var index = +match.slice(1, -1), arg;
            if (index < options.length) {
                arg = Template.stringify(options[index]);
                return arg;
            }
            return match;
        });
        super(this.message);
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
 *     var myError = new Custom('my_package_name');
 *     throw myError('my_code_area_name', 'myError', 'This error message supports tags like {0}, {1}', 100, 'foo');
 *
 * PS: The tag parameters are passed as arguments. This usage is different from Template class
 */
export function Custom(package: string): any {
    return function (code: string, name: string, template: string, ...options: Array): Template {
        return new Template(package, code, name, template, options);
    };
}
