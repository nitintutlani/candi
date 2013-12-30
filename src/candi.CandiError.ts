///<reference path='./candi.Util.ts' />

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
                    arg = Util.stringify(options[index]);
                    return arg;
                }
                return match;
            });
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
