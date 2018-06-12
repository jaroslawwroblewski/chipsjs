
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
                currentLink: '',
                currentTitle: ''
            };

            var  redirect = function(url) {
                window.location.href = url;
            };

            var showSelectedMenu = function ($element, $title) {

                var menu = $element.clone(),
                    title = '<p class="chipsjs__title">' + $title.text() + '</p>';


                $('body').find(self.options.menu + ' ' + self.options.container).html('');
                $('body').find(self.options.menu + ' ' + self.options.container).append(title).append(menu.css('display', 'block'));
                $('body').find(self.options.wrapper).show();
                $('body').find(self.options.close).focus();

            };

            var hideSelectedMenu = function () {
                $('body').find(self.options.menu + ' ' + self.options.container).html('');
                $('body').find(self.options.wrapper).hide();
                $(state.currentLink).focus();
            };


            var buildMenu = function () {
                $('body').append(self.options.appendHtml);
                attachClosekHandler($('body').find(self.options.close));
            };


            var attachClickHandler = function($elements) {
                $elements.on('click.chipsjs', function(event) {
                    event.preventDefault();

                    state.currentLink = $(this);

                    var $selectedMenu = $(this).siblings(self.options.ulNested);
                    $selectedMenu.length > 0 ? showSelectedMenu($selectedMenu, $(this)) : redirect($(this).attr('data-href'));

                });
            };

            var attachClosekHandler = function($elements) {
                $elements.on('click.chipsjs', function(event) {
                    hideSelectedMenu();
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
        ul: '.chipsjs__ul',
        li: '.chipsjs__li',
        ulNested: '.chipsjs__ul-nested',
        wrapper: '.chipsjs__wrapper',
        close: '.chipsjs__close',
        menu: '.chipsjs__menu',
        container: '.container',
        addTitle: true,
        appendHtml: '<div class="chipsjs__wrapper"><button class="chipsjs__close"><span class="u-acc-hide">Close</span></button><div class="chipsjs__menu"><div class="container"></div></div></div>'
    };

    $.fn.chipsjs.ChipsJS = ChipsJS;

}));