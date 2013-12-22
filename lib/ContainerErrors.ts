/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */

/**
 * Enumerating thrown error names, for Translation
 * This enum array contains array objects of name, template pairs
 */
enum ContainerErrors {
    FunctionFoundError = <any>['FunctionFoundError', '`{0}` is a function'],
    FunctionNotFoundError = <any>['FunctionNotFoundError', '`{0}` is not a function'],
    UnknownInjectionError = <any>['UnknownInjectionError', 'No such injection `{0}` in the Container'],
    SetInjectionError = <any>['SetInjectionError', '`{0}` is a readonly injection in the Container'],
    UnknownDependencyError = <any>['UnknownDependencyError', '`{0}` dependency cannot be resolved in the Container']
}

export = ContainerErrors;