[![Build Status](https://travis-ci.org/goliatone/grunt-gconfig.png?branch=master)](https://travis-ci.org/goliatone/grunt-gconfig)

# grunt-gconfig

> Grunt task for generating HTML metadata configuration options for gconfig

## GConfig
[GConfig][1] is a simple configuration management library. This task provides a way to manage environment aware configuration options.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-gconfig --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-gconfig');
```

## The "gconfig" task

### Overview
In your project's Gruntfile, add a section named `gconfig` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  gconfig: {
    options: {
      files: [
        {
          expand: true,    // Enable dynamic expansion.
          cwd: 'app/',     // Src matches are relative to this path.
          src: ['*.html'], // Actual pattern(s) to match.
          dest: '.tmp/'    // Destination path prefix.
        },
      ]
    },
    dev:{
      filepath:'app/data/gconfig.dev.json',
      removeOriginalUnmatchedMeta:true
    },
    int:{
      filepath:'app/data/gconfig.int.json'
    },
    dist:{
      filepath:'app/data/gconfig.dist.json'
    }
  }
});
```

### Options

#### options.mergeConfigs
Type: `Array`
Default value: `[]`

Array holding attribute names of the `grunt.config` object. This configuration object will be merged into the final `gconfig` object.
Internally, it uses `grunt.config.get(<id>)`, read more [here][grunt.config].

#### options.mergeFiles
Type: `Array`
Default value: `[]`

Array holding paths to JSON files we want to merge into our final object. 

#### options.filepath
Type: `String`

A path string to the JSON data file holding the configuration values.

#### options.removeOriginalUnmatchedMeta
Type: `Boolean`
Default value: `false`

Should we remove original metadata tags before running the task?

#### options.files
Type: `String`

Targeted files by the task. For more details check out [grunt files][2]

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## TODO
- Use `colors` for terminal output.
- Add examples
- Refactor main task!

[1]:(https://github.com/goliatone/gconfig)
[2]:(http://gruntjs.com/configuring-tasks#files)
[grunt.config]:(http://gruntjs.com/api/grunt.config#grunt.config.get)