/*
 * grunt-gconfig
 * https://github.com/goliatone/grunt-gconfig
 *
 * Copyright (c) 2014 goliatone
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
    var MetadataParser = require('../lib/metadata'),
        extend = require('../lib/utils').extend,
        path = require('path'),
        $ = require('cheerio');

    var desc = 'Process Gconfig metadata';

    grunt.registerMultiTask('gconfig', desc, function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            punctuation: '.',
            separator: ', '
        });

        var cwd = process.cwd();
        
        grunt.log.writeln('\n', desc, 'total files:', this.files.length);
        grunt.log.writeln('--------------------------------------------');
        
        var metadata,
            data,
            parser = new MetadataParser(),
            filepath = this.data.gconfig,
            removeOriginalUnmatchedMeta = this.data.removeOriginalUnmatchedMeta,
            gconfig = grunt.file.readJSON(path.join(cwd, filepath));

        this.files.forEach(function(file) {
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

                data = extend({}, defaults, gconfig);
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
                                grunt.log.writeln('  √ Update meta ', name, ' content ', item.attr('content'), ' to ', metadata[name].content);
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
                    grunt.log.writeln('- Creating HTML metadata for ', filepath);
                    Object.keys(metadata).forEach(function(name){
                        if(name !== 'html') grunt.log.writeln('  √ Create metadata for', name);
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