///<reference path='./references.d.ts' />

declare module _ {
    interface LoDashStatic {
        annotateFn(fn: any): any;
        stringify(obj: any): string;
        extends2(thisConstructor: any, superConstructor: any): string;
    }
}

export var Util: any = require('lodash');

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

/**
 * Stringify converts obj/fn/value into a readable string.
 * Log, Debug, Error messages may use stringify to return meaningful messages to the user.
 *
 * @param obj can be anything
 * @returns string
 */
Util.stringify = function(obj: any): string {
    if (typeof obj === 'function') {
        return obj.toString().replace(/ \{[\s\S]*$/, '');
    } else if (typeof obj === 'undefined') {
        return 'undefined';
    } else if (typeof obj !== 'string') {
        return JSON.stringify(obj);
    }
    return obj.toString();
}

/**
 * This function can be used to support multiple inheritance
 * Extends Class enumerations and mixes Prototype functions
 * It also preserves prototype function on original object unlike typescript __extends
 * This can be used instead of typescript __extends, util.inherits
 * eg:
 *      class Bundle extends Component implements EventEmitter
 *      Util.extends2(Bundle, EventEmitter2)
 *
 * @param thisConstructor
 * @param superConstructor
 * @returns {boolean}
 */
Util.extends2 = function (thisConstructor: any, superConstructor: any) {
    if(typeof thisConstructor !=='function' || typeof superConstructor !== 'function') {
        return false;
    }

    //Typescript way
    /* for (var property in superConstructor) if (superConstructor.hasOwnProperty(property)) thisConstructor[property] = superConstructor[property];
    function __() { this.constructor = thisConstructor; }
    __.prototype = superConstructor.prototype;
    thisConstructor.prototype = new __(); */

    //Lodash way
    Util.assign(thisConstructor, superConstructor);
    Util.mixin(thisConstructor.prototype, superConstructor.prototype);

    return true;
}
