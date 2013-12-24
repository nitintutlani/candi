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