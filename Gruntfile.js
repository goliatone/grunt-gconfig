/*
 * grunt-gconfig
 * https://github.com/goliatone/grunt-gconfig
 *
 * Copyright (c) 2014 goliatone
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
        },

        // Configuration to be run (and then tested).
        gconfig: {

            dev:{
                // src:['app/*.html'],
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'test/fixtures',      // Src matches are relative to this path.
                        src: ['index.dev.html'], // Actual pattern(s) to match.
                        dest: 'tmp',   // Destination path prefix.
                    },
                ],
                gconfig:'test/fixtures/gconfig.dev.json',
                mergeConfigs:['gconfigMergeGrunt'], //SEE BELOW!
                mergeFiles:[
                    'test/fixtures/gconfig.merge.json'
                ],
                removeOriginalUnmatchedMeta:true
            },
            dist:{
                // src:['app/*.html'],
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'test/fixtures',      // Src matches are relative to this path.
                        src: ['index.dist.html'], // Actual pattern(s) to match.
                        dest: 'tmp',   // Destination path prefix.
                    },
                ],
                mergeFiles:[
                    'test/fixtures/gconfig.merge.json'
                ],
                gconfig:'test/fixtures/gconfig.dist.json',
                removeOriginalUnmatchedMeta:false
            }
        },
        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },
        //We are going to merge this Object in final gconfig!
        gconfigMergeGrunt:{
            foo:'bar',
            baz:'fuz'
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'gconfig', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);
};
