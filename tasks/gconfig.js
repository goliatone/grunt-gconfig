/*
 * grunt-gconfig
 * https://github.com/goliatone/grunt-gconfig
 *
 * Copyright (c) 2014 goliatone
 * Licensed under the MIT license.
 */

'use strict';

var _stylize = function(word, style){ 
    var styles = {
      //styles
      'bold'      : ['\x1B[1m',  '\x1B[22m'],
      'italic'    : ['\x1B[3m',  '\x1B[23m'],
      'underline' : ['\x1B[4m',  '\x1B[24m'],
      'inverse'   : ['\x1B[7m',  '\x1B[27m'],
      'strikethrough' : ['\x1B[9m',  '\x1B[29m'],
      //text colors
      //grayscale
      'white'     : ['\x1B[37m', '\x1B[39m'],
      'grey'      : ['\x1B[90m', '\x1B[39m'],
      'black'     : ['\x1B[30m', '\x1B[39m'],
      //colors
      'blue'      : ['\x1B[34m', '\x1B[39m'],
      'cyan'      : ['\x1B[36m', '\x1B[39m'],
      'green'     : ['\x1B[32m', '\x1B[39m'],
      'magenta'   : ['\x1B[35m', '\x1B[39m'],
      'red'       : ['\x1B[31m', '\x1B[39m'],
      'yellow'    : ['\x1B[33m', '\x1B[39m'],
      //background colors
      //grayscale
      'whiteBG'     : ['\x1B[47m', '\x1B[49m'],
      'greyBG'      : ['\x1B[49;5;8m', '\x1B[49m'],
      'blackBG'     : ['\x1B[40m', '\x1B[49m'],
      //colors
      'blueBG'      : ['\x1B[44m', '\x1B[49m'],
      'cyanBG'      : ['\x1B[46m', '\x1B[49m'],
      'greenBG'     : ['\x1B[42m', '\x1B[49m'],
      'magentaBG'   : ['\x1B[45m', '\x1B[49m'],
      'redBG'       : ['\x1B[41m', '\x1B[49m'],
      'yellowBG'    : ['\x1B[43m', '\x1B[49m']
    };
    if(! style in styles) return word;
    return styles[style][0] + word + styles[style][1];
};

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
                    grunt.log.writeln('- Creating HTML metadata for ', _stylize(filepath, 'greenBG'));
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