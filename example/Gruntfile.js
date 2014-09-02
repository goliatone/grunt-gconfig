'use strict';

/*global require:true*/
/*jshint indent:2*/
var loader = require('load-grunt-task-options');


/*jshint indent:2 */
module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-gconfig');

  var config = {};

  /**
   * Load configuration files.
   * Each file will be mapped to a property
   * in gruntConfig object.
   * See loadConfig function.
   */
  config = loader('./tasks/options/', config);

  //Load configuration options and define tasks
  // grunt.initConfig(gruntConfig);

  //Load custom tasks
  grunt.loadTasks('tasks');


  grunt.initConfig(config);
};