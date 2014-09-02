/*
 * grunt-gconfig
 * https://github.com/goliatone/grunt-gconfig
 *
 * Copyright (c) 2014 goliatone
 * Licensed under the MIT license.
 */

'use strict';

var _stylize = require('../lib/stylize');
var DEFAULTS = {files:{
            expand: true,     // Enable dynamic expansion.
            cwd: 'app/',      // Src matches are relative to this path.
            src: ['*.html'], // Actual pattern(s) to match.
            dest: '.tmp/',   // Destination path prefix.,
            removeOriginalUnmatchedMeta:false,
            mergeConfigs:[],
            mergeFiles:[]
        }};

module.exports = function(grunt) {
    var MetadataParser = require('../lib/metadata'),
        extend = require('../lib/utils').extend,
        path = require('path'),
        $ = require('cheerio');


    var desc = 'Process Gconfig metadata';

    grunt.registerMultiTask('gconfig', desc, function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options(DEFAULTS);

        /*
         * this.data holds the data stored in the current target.
         * options holds ^defaults and the user declared options object.
         */
        extend(options, this.data);

        var cwd = process.cwd();
        grunt.log.writeln('\n', desc, 'total files:', options.files.length);
        grunt.log.writeln('--------------------------------------------');

        var metadata,
            data,
            parser = new MetadataParser(),
            filepath = options.filepath || options.gconfig,
            removeOriginalUnmatchedMeta = options.removeOriginalUnmatchedMeta,
            mergeObject = {},
            //TODO: this two should be configured from defaults?!
            mergeConfigs = options.mergeConfigs || [],
            mergeFiles   = options.mergeFiles || [],
            gconfig = grunt.file.readJSON(path.join(cwd, filepath));

        /*
         * mergeConfigs is an object holding
         * id references to `grunt` config
         * objects.
         */
        mergeConfigs.forEach(function(id){
            var value,
                toMerge = {},
                //TODO: Ensure we got a valid object!!
                config = grunt.config.get(id);

            grunt.log.writeln( _stylize('\n+ Merging config object', 'yellow'), _stylize(id, 'yellowBG'));

            Object.keys(config).forEach(function(key){
                value = config[key];
                if(typeof value === 'object') value = JSON.stringify(value);
                grunt.log.writeln('  -', key, ':', value);
                toMerge[key] = value;
            });
            mergeObject[id] = extend(config, toMerge);
        });

        /*
         * mergeFiles is an object holding
         * paths to files that will be merged
         * like a normal ENV config file.
         */
        mergeFiles.forEach(function(path){
            var value,
                toMerge = {},
                config = grunt.file.readJSON(path);

            grunt.log.writeln( _stylize('\n+ Merging config file', 'yellow'), _stylize(path, 'yellowBG'));

            Object.keys(config).forEach(function(key){
                value = config[key];
                grunt.log.writeln('  -', key, ':', value);
                mergeObject[key] = value;
            });
        });

        /*
         * If we do not do this, we would have to declare
         * the `files` property on each target.
         */
        options.files = grunt.task.normalizeMultiTaskFiles(options, this.target);

        options.files.forEach(function(file) {
            var contents = file.src.filter(function(filepath) {
                // Remove nonexistent files (it's up to you to filter or warn here).
                if (grunt.file.exists(filepath)) return true;
                grunt.log.warn('Source file "' + filepath + '" not found.');
                return false;
            }).map(function(filepath) {
                // Read and return the file's source.
                var fileContent = grunt.file.read(filepath),
                parsedHTML = $.load(fileContent),
                defaults = parser.extractMetadata($('meta'));

                data = extend({}, defaults, gconfig, mergeObject);
                metadata = parser.buildMetadata(data);

                var htmlMeta = parsedHTML('meta');

                //TODO: We need to keep the meta that is not part of gconf
                if(htmlMeta.length){
                    grunt.log.writeln('- Building HTML metadata for ', filepath);

                    htmlMeta.each(function(i, el){
                        var item = $(this);
                        if(item.attr('name') && item.attr('name').indexOf(':')){
                            var name = item.attr('name');
                            if(metadata[name]){
                                grunt.log.writeln('  √ Update meta: ', name,
                                    ' from: ', _stylize(item.attr('content'), 'orange'),
                                    ' to: ', _stylize(metadata[name].content, 'magenta'));
                                item.attr('content', metadata[name].content);
                                delete metadata[name];
                            } else if(removeOriginalUnmatchedMeta){
                                grunt.log.writeln('  † Remove meta ', name);
                                item.remove();
                            }
                        }
                    });

                    Object.keys(metadata).forEach(function(name){
                        var content = metadata[name];
                        parsedHTML('meta').append(content.html);
                    });
                }
                else{
                    grunt.log.writeln('\n- Creating HTML metadata for ', _stylize(filepath, 'greenBG'));
                    Object.keys(metadata).forEach(function(name){
                        if(name !== 'html') grunt.log.writeln('  √ Created meta:', name, 'content:', _stylize(metadata[name].content, 'green'));
                    });
                    parsedHTML('head').append($(metadata.html.join('\n')));
                }

                var outputHTML = parsedHTML.html();
                // Write joined contents to destination filepath.
                grunt.file.write(file.dest, outputHTML);
                // Print a success message.
                grunt.log.writeln('\n  + File "' + file.dest + '" created.\n');
            });
        });
    });
};