/**
* Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
*/
/**
* Enumerating thrown error names, for Translation
* This enum array contains array objects of name, template pairs
*/
var ContainerErrors;
(function (ContainerErrors) {
    ContainerErrors[ContainerErrors["FunctionFoundError"] = ['FunctionFoundError', '`{0}` is a function']] = "FunctionFoundError";
    ContainerErrors[ContainerErrors["FunctionNotFoundError"] = ['FunctionNotFoundError', '`{0}` is not a function']] = "FunctionNotFoundError";
    ContainerErrors[ContainerErrors["UnknownInjectionError"] = ['UnknownInjectionError', 'No such injection `{0}` in the Container']] = "UnknownInjectionError";
    ContainerErrors[ContainerErrors["SetInjectionError"] = ['SetInjectionError', '`{0}` is a readonly injection in the Container']] = "SetInjectionError";
    ContainerErrors[ContainerErrors["UnknownDependencyError"] = ['UnknownDependencyError', '`{0}` dependency cannot be resolved in the Container']] = "UnknownDependencyError";
})(ContainerErrors || (ContainerErrors = {}));


module.exports = ContainerErrors;

//# sourceMappingURL=ContainerErrors.js.map
