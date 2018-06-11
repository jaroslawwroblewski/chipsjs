
/*
    Author: Jaroslaw Wroblewski
    Repo:   https://github.com/jaroslawwroblewski/chipsjs
 */

(function (factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // browser globals
        factory(jQuery);
    }

}(function ($) {

    'use strict';
    var chipsjs = (function() {

        console.log('ready');

    })();

}));