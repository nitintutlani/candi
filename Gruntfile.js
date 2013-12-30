/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */

module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        "concat": {
            references: {
                src: ['src/references.d.ts', 'build/<%= pkg.name %>.ts'],
                dest: 'build/<%= pkg.name %>.ts'
            },
            temp: {
                src: ['src/candi.*.ts'],
                dest: 'build/temp.ts'
            },
            publish: {
                src: ['build/<%= pkg.name %>.js'],
                dest: 'lib/<%= pkg.name %>.js'
            }
        },
        "clean": {
            temp: {
                src: ['build/temp.ts']
            },
            build: {
                src: ['build/<%= pkg.name %>.*']
            },
            lib: {
                src: ['lib/<%= pkg.name %>.js']
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
                    from: /\/\/\/<reference.*\n/g,
                    to: ''
                }]
            },
            merge: {
                src: ['build/<%= pkg.name %>.ts'],
                overwrite: true,
                replacements: [{
                    from: /\/\/\/code.*\n/,
                    to: function (matchedWord, index, fullText, regexMatches) {
                        return grunt.file.read('build/temp.ts');
                    }
                }]
            },
            cleanReferences: {
                src: ['build/<%= pkg.name %>.js'],
                overwrite: true,
                replacements: [{
                    from: /\/\/\/<reference.*\n/g,
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
    grunt.loadNpmTasks('grunt-release');
    grunt.registerTask('default', ['clean:build', 'clean:lib', 'replace:version', 'concat:references', 'concat:temp', 'replace:references', 'replace:merge', 'clean:temp', 'typescript', 'replace:cleanReferences', 'concat:publish', 'jshint:lib']);
};