
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

                var $body = $('body'),
                    menu = $element.clone(),
                    //title = '<p class="chipsjs__title">' + $title.text() + '</p>';
                    title = $title.clone();

                title = title
                        .attr('href', $title.attr('data-href'))
                        .removeAttr('data-href')
                        .addClass('chipsjs__title')
                        .append('<span class="u-arrow"></span>');


                $body.find(self.options.menu + ' ' + self.options.container).html('');
                $body.find(self.options.menu + ' ' + self.options.container).append(title).append(menu.css('display', 'block'));
                $body.find(self.options.wrapper).css({display: 'block', opacity: 0});
                setTimeout( function() {
                    $body.find(self.options.wrapper).addClass(self.options.animationIn);
                }, 50);
                $body.find(self.options.close).focus();

            };

            var hideSelectedMenu = function () {
                var $wrapper = $('body').find(self.options.wrapper);
                $wrapper.removeClass(self.options.animationIn);
                $wrapper.addClass(self.options.animationOut);
                setTimeout( function() {
                    $wrapper.removeClass(self.options.animationOut);
                    $wrapper.hide();
                    $('body').find(self.options.menu + ' ' + self.options.container).html('');
                    $(state.currentLink).focus();
                }, self.options.animationDelay);
            };


            var showMobileMenu = function ($element) {
                $element.find('.chipsjs__trigger-icon').toggleClass('active');
                $(self.options.ul).slideToggle('slow');
            };


            var buildMenu = function () {
                $('body').append(self.options.appendHtml);
                var closeBtn = $('body').find(self.options.close);

                attachClosekHandler(closeBtn);
                attachEsckHandler(closeBtn);
                attachMobileHandler($(self.options.mobileTrigger));
            };

            var mobileSupport = function () {

                if (window.matchMedia('all and (max-width:786px)').matches) {
                    alert('mobile');
                }

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


            var attachEsckHandler = function($elements) {
                $elements.on('keyup.chipsjs', function(event) {
                    if (event.keyCode == 27) {
                        hideSelectedMenu();
                    }
                });
            };

            var attachMobileHandler = function($elements) {
                $elements.on('click.chipsjs', function(event) {
                    showMobileMenu($(this));
                });
            };


            this.run = function() {
                buildMenu();
                attachClickHandler(self.$elem.find('[data-href]'));
                mobileSupport();
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
        animationIn: 'swing-in-top-fwd',
        animationOut: 'swing-out-top-fwd',
        animationDelay: 500,
        nav: '.chipsjs',
        ul: '.chipsjs__ul',
        li: '.chipsjs__li',
        ulNested: '.chipsjs__ul-nested',
        wrapper: '.chipsjs__wrapper',
        close: '.chipsjs__close',
        menu: '.chipsjs__menu',
        container: '.container',
        mobileTrigger: '.chipsjs__trigger',
        addTitle: true,
        appendHtml: '<div class="chipsjs__wrapper"><button class="chipsjs__close"><span class="u-acc-hide">Close</span></button><div class="chipsjs__menu"><div class="container"></div></div></div>'
    };

    $.fn.chipsjs.ChipsJS = ChipsJS;

}));