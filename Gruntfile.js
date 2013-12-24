/**
 * Copyright (c) Nitin Tutlani <nitintutlani@yahoo.com>
 */

module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        "concat": {
            references: {
                src: ['lib/<%= pkg.name.toLowerCase() %>.ts', 'src/references.d.ts'],
                dest: 'lib/<%= pkg.name.toLowerCase() %>.ts'
            },
            temp: {
                src: ['src/candi.*.ts'],
                dest: 'lib/temp.ts'
            },
            merge: {
                src: ['lib/<%= pkg.name.toLowerCase() %>.ts', 'lib/temp.ts'],
                dest: 'lib/<%= pkg.name.toLowerCase() %>.ts'
            }
        },
        "clean": {
            temp: {
                src: ['lib/temp.ts']
            }
        },
        "replace": {
            version: {
                src: ['src/<%= pkg.name.toLowerCase() %>.ts'],
                dest: 'lib/',
                replacements: [{
                    from: '%VERSION%',
                    to: '<%= pkg.version %>'
                }]
            },
            references: {
                src: ['lib/temp.ts'],
                overwrite: true,
                replacements: [{
                    from: /\/\/\/\<reference path=\'\.\.\/references\/.*\n/,
                    to: ''
                }]
            }
        },
        "typescript": {
            base: {
                src: ['lib/<%= pkg.name.toLowerCase() %>.ts'],
                dest: '',
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    sourcemap: true,
                    fullSourceMapPath: false,
                    declaration: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.registerTask('default', ['replace:version', 'concat:references', 'concat:temp', 'replace:references', 'concat:merge', 'clean:temp', 'typescript']);
};