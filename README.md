Candi
-----
Dependency injection and utility library for node.js

Why this name?
--------------
it CAN do Dependency Injection

Disclaimer
----------
This has no dependencies. It should work on browser too. ECMAScript5 support is required. >=IE9 and all other modern browsers have it.
We make use of Object.defineProperty, bind.apply and __proto__ to handle Object inheritance and get/set actions. Both these methods can cause compatibility issues in older versions of javascript environments.
I have ran my tests on node v0.10.* only, but it should work on 0.8 or earlier also. Please run tests using `npm test` before using.

Thanks
------
Creators of Pimple, Rewire and AngularJS have done tremendous job implementing Dependency Injection techniques.
I am thankful to their respective authors for sharing knowledge and work with the community.

Features
--------
`candi.CandiError.Template` and `candi.CandiError.Custom` - for throwing template based Custom Errors.
`candi.ContainerErrors` - enumerates errors thrown by `candi`.
`candi.Injection` - injected property object.
`candi.Container` - container class for Dependency Injection operations.
`candi.Util` - wraps lodash and adds functionality. lodash can be replaced with underscore, lazy.js or other drop-in library of this kind.

TODO
----
All usable features I could think of are done. I will add more in readme, generate api, wiki tutorials later if requested.
Injections for value, constant, provider, factory and service - all are here.

Usage
-----
For now please review code and tests files. They have almost everything needed to get going.
