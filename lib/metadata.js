'use strict';

var $ = require('cheerio');

var MetadataParser = function(){};

MetadataParser.prototype.getCommentTags = function(){
	var tag = 'gconfig';
    var end = '@gconfig';
    var matcher = new RegExp('<!--\\s*'+tag+'\\s*-->([\\s\\S]*?)<!--\\s*'+end+'\\s*-->', 'igm');
};

MetadataParser.prototype.extractMetadata = function(metadata){
    var output = {}, name, content, namespace, key;
    metadata.map(function(i, meta){
        meta = $(meta);
        if(meta.attr('name') && meta.attr('name').indexOf(':')){
            name = meta.attr('name').split(':');
            content = meta.attr('content');
            namespace = name[0];
            key = name[1];
            if(! (namespace in output)) output[namespace] = {};
            output[namespace][key] = content;
        }
    });
    return output;
};

MetadataParser.prototype.buildMetadata = function(data){
    var metadata = {}, tags=[], name, content, html;
    Object.keys(data).forEach(function(namespace){
        Object.keys(data[namespace]).forEach(function(item){
            name = namespace+':'+item;
            content = data[namespace][item];
            html = '<meta name="'+name+'" content="'+content+'">';
            tags.push(html);
            metadata[name] = {name:name, content:content, html:html};
            // metadata.push({name:name, content:content, html:html});
        });
    });
    metadata.html = tags;
    return metadata;
};



module.exports = MetadataParser;