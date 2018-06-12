
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
    var ChipsJS = (function() {

        function ChipsJS() {

            var self = this;


            var state = {
              currentLink: ''
            };

            var  redirect = function(url) {
                window.location.href = url;
            };

            var showSelectedMenu = function ($element) {
                console.log($element);
            };


            var buildMenu = function (elements) {
              $('body').append('<div class="chipsjs__countainer">Hello World</div>')
            };


            var attachClickHandler = function($elements) {
                $elements.on('click.chipsjs', function(event) {
                    event.preventDefault();

                    state.currentLink = $(this);

                    var $selectedMenu = $(this).siblings(self.options.ulNestedClass);
                    $selectedMenu.length > 0 ? showSelectedMenu($selectedMenu) : redirect($(this).attr('data-href'));

                });
            };


            this.run = function() {

                buildMenu();
                attachClickHandler(self.$elem.find('[data-href]'));
            }


        }

        ChipsJS.prototype.init = function (options, elem) {
            this.$elem = $(elem);
            this.options = $.extend({}, $.fn.chipsjs.default, options);

            return this.options;
        };

        return ChipsJS;

    })();

    $.fn.chipsjs = function (method, options) {
        return this.each(function () {
            var plugin = new ChipsJS();

            if (plugin.hasOwnProperty(method)) {
                plugin.init(options, this);
                return plugin.run();
            } else if (typeof method === 'object' || !method) {
                options = method;
                plugin.init(options, this);
                return plugin.run();
            } else {
                $.error('Method ' + method + ' does not exist in ChipsJS');
            }
        });
    };

    $.fn.chipsjs.default = {
        dataType: 'html',
        ulClass: '.chipsjs__ul',
        liClass: '.chipsjs__li',
        ulNestedClass: '.chipsjs__ul-nested'
    };

    $.fn.chipsjs.ChipsJS = ChipsJS;

}));