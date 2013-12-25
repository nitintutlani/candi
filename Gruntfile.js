/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */

module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        "concat": {
            references: {
                src: ['build/<%= pkg.name %>.ts', 'src/references.d.ts'],
                dest: 'build/<%= pkg.name %>.ts'
            },
            temp: {
                src: ['src/candi.*.ts'],
                dest: 'build/temp.ts'
            },
            merge: {
                src: ['build/<%= pkg.name %>.ts', 'build/temp.ts'],
                dest: 'build/<%= pkg.name %>.ts'
            },
            publish: {
                src: ['build/<%= pkg.name %>.js'],
                dest: 'lib/<%= pkg.name %>.js'
            }
        },
        "clean": {
            temp: {
                src: ['build/temp.ts']
            }
        },
        "replace": {
            version: {
                src: ['src/<%= pkg.name %>.ts'],
                dest: 'build/',
                replacements: [{
                    from: '%VERSION%',
                    to: '<%= pkg.version %>'
                }]
            },
            references: {
                src: ['build/temp.ts'],
                overwrite: true,
                replacements: [{
                    from: /\/\/\/\<reference path=\'\.\.\/references\/.*\n/,
                    to: ''
                }]
            }
        },
        "typescript": {
            base: {
                src: ['build/<%= pkg.name %>.ts'],
                dest: '',
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    sourcemap: true,
                    fullSourceMapPath: false,
                    declaration: true,
                    comments: true
                }
            }
        },
        "jshint": {
            lib: ['lib/**/*.js'],
            options: {
                '-W027': true,
                '-W086': true,
                '-W069': true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['replace:version', 'concat:references', 'concat:temp', 'replace:references', 'concat:merge', 'clean:temp', 'typescript', 'concat:publish', 'jshint:lib']);
};