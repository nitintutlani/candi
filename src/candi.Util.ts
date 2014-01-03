///<reference path='./references.d.ts' />

export class Util {

    public static isArray(obj: any): boolean {
        return Array.isArray(obj);
    }

    public static isString(obj: any) {
        return typeof obj == 'string' ||
            obj && typeof obj == 'object' && toString.call(obj) == 'stringClass' || false;
    }

    public static isFunction(obj: any): boolean {
        return (typeof obj == 'function');
    }

    public static isUndefined(obj) {
        return typeof obj == 'undefined';
    }

    /**
     * Check if value is an Invokable function in context of Candi
     * value === function || value is [fn, injections]
     *
     * @param obj
     * @returns {boolean}
     */
    public static isInvokable(obj: any): boolean {
        if(typeof obj === 'function') {
            return true;
        } else {
            if (Util.isArray(obj)) {
                if (Util.isFunction(obj[0]) && Util.isString(obj[1])) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Annotates a function with static parameter `injections`
     * injections is a string of comma separated function arguments to protect it from minification
     * annotated function can be used as DI provider and called later by way of Automatic injections
     *
     * @param fn function to annotate, function can also be an Invokable function array [fn: function, injections: string]
     * @returns Annotated function reference is returned
     */
    public static annotateFn(fn: any) {
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
        } else if (Util.isInvokable(fn)) {
            injections = fn[1];
            result = fn[0];
            result.injections = injections;
        } else {
            result = fn;
        }
        return result;
    }

    /**
     * Stringify converts obj/fn/value into a readable string.
     * Log, Debug, Error messages may use stringify to return meaningful messages to the user.
     *
     * @param obj can be anything
     * @returns string
     */
    public static stringify(obj: any): string {
        if (typeof obj === 'function') {
            return obj.toString().replace(/ \{[\s\S]*$/, '');
        } else if (typeof obj === 'undefined') {
            return 'undefined';
        } else if (typeof obj !== 'string') {
            return JSON.stringify(obj);
        }
        return obj.toString();
    }
}