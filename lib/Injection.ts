/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */

/**
 * Injectable object class
 *
 * Every container has _injections array that collects these Injection objects
 * Removed `depends`, provider functions now inject invokable functions into value as returned from Util.annotateFn
 */
class Injection {
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

export = Injection;