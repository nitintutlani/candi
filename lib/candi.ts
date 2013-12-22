/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */

/**
 * candi
 *
 * Dependency injection library written in typescript for node.js
 *
 * Creators of Pimple, Rewire and AngularJS have done tremendous job implementing Dependency injection techniques
 * I am thankful to their respective authors for sharing knowledge and work with the community
 *
 * My intended purpose of writing this library is to build a lifecycle based Application container
 *
 * @package candi
 * @author  Nitin Tutlani
 */

import ContainerErrors = require('./ContainerErrors');
import Container = require('./Container');
import Error = require('./Error');
import Util = require('./Util');


export var Container;
