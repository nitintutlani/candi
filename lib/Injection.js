/**
* Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
*/
/**
* Injectable object class
*
* Every container has _injections array that collects these Injection objects
* Removed `depends`, provider functions now inject invokable functions into value as returned from Util.annotateFn
*/
var Injection = (function () {
    function Injection(type, name, value) {
        this.type = type;
        this.name = name;
        this.value = value;
    }
    return Injection;
})();


module.exports = Injection;

//# sourceMappingURL=Injection.js.map
