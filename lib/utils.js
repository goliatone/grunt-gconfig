'use strict';
/**
 * Extends `target` object with all 
 * @param  {object} target Target object. 
 * @return {object}        Target object with props
 *                         merged from other objects in
 *                         arguments.
 */
var extend = function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            if(source[prop] && source[prop].constructor &&
                source[prop].constructor === Object){
                target[prop] = target[prop] || {};
                target[prop] = extend(target[prop], source[prop]);
            } else target[prop] = source[prop];
        }
    });
    return target;
};

module.exports.extend = extend;