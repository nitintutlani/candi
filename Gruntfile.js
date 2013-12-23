/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */

module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        "concat": {
            merge: {
                src: ['lib/candi.ts', 'lib/ContainerErrors.ts'],
                dest: 'build/<%= pkg.name.toLowerCase() %>-<%= pkg.version %>.ts'
            }
        },
        "sed": {
            reference: {
                path: 'build/',
                pattern: '\/\/\/.*\n',
                replacement: '',
                recursive: true
            },
            class: {
                path: 'build/',
                pattern: '\nclass ',
                replacement: '\nexport class ',
                recursive: true
            },
            module: {
                path: 'build/',
                pattern: '\ninterface ',
                replacement: '\nexport interface ',
                recursive: true
            },
            enum: {
                path: 'build/',
                pattern: '\nenum ',
                replacement: '\nexport enum ',
                recursive: true
            }
        },
        "typescript": {
            base: {
                src: ['build/<%= pkg.name.toLowerCase() %>-<%= pkg.version %>.ts'],
                dest: '',
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    sourcemap: true,
                    fullSourceMapPath: false,
                    declaration: true
                }
            }
        },
        "copy": {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'build/',
                        src: ['*.js'],
                        dest: '.',
                        filter: 'isFile',
                        rename: function(dest, src) {
                            return 'lib/candi.js';
                        }
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sed');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['concat:merge', 'sed', 'typescript', 'copy']);
};