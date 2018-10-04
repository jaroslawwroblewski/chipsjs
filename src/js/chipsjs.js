
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
    var chipsJs = (function() {

        function chipsJs() {

            var self = this;


            var state = {
                currentLink: '',
                currentTitle: ''
            };

            var  redirect = function(url) {
                window.location.href = url;
            };

            var showSelectedMenu = function ($element, $title) {

                $title.attr('aria-expanded', true);
                $title.siblings('ul').attr('aria-hidden', false);

                var $body = $('body'),
                    menu = $element.clone(),
                    //title = '<p class="chipsjs__title">' + $title.text() + '</p>';
                    title = $title.clone();

                title = title
                        .attr('href', $title.attr('data-href'))
                        .removeAttr('data-href')
                        .addClass('chipsjs__title')
                        .append('<span class="u-arrow"></span>');

                $body.css({overflow: 'hidden', position: 'fixed'});
                $body.find(self.options.menu + ' ' + self.options.container).html('');
                $body.find(self.options.menu + ' ' + self.options.container).append(title).append(menu.css('display', 'block'));
                $body.find(self.options.wrapper).css({display: 'block', opacity: 0});

                if (window.matchMedia(self.options.mediaQuery).matches) {
                    checkBrowserViewport();
                }

                setTimeout( function() {
                    $body.find(self.options.wrapper).addClass(self.options.animationIn);
                }, 50);
                $body.find(self.options.close).focus();

                attachClickNestedHandler($('body').find(self.options.wrapper + ' a'));

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

                $('body').css({overflow: 'auto', position: 'static'});
                $(state.currentLink).attr('aria-expanded', false);
                $(state.currentLink).siblings('ul').attr('aria-hidden', true);


                var closeBtn = $('body').find(self.options.close);
                detachHandler(closeBtn);
                detachHandler(self.$elem.find(self.options.ulNested + ' a'));
            };


            var showMobileMenu = function ($element) {
                $element.find('.chipsjs__trigger-icon').toggleClass('active');
                $(self.options.ul).slideToggle('slow');
            };


            var buildMenu = function () {
                $('body').append(self.options.appendHtml);
                var closeBtn = $('body').find(self.options.close);

                attachCloseHandler(closeBtn);
                attachEscHandler(closeBtn);
            };

            var mobileSupport = function () {

                if (window.matchMedia('all and (max-width:786px)').matches) {}
            };

            var checkBrowserViewport = function () {

                var $menu = $(self.options.wrapper + ' ' + self.options.menu),
                    wrapperHeight = $menu.height(),
                    windowHeight = $(window).height();

                if(wrapperHeight >= windowHeight || (wrapperHeight < windowHeight && wrapperHeight > (windowHeight - self.options.mobileSensitivity))) {
                    $menu.addClass(self.options.mobileReset);
                } else {
                    $menu.removeClass(self.options.mobileReset);
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

            var attachCloseHandler = function($elements) {
                $elements.on('click.chipsjs', function(event) {
                    hideSelectedMenu();
                });
            };


            var attachEscHandler = function($elements) {
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

            var attachClickNestedHandler = function($elements){
                $elements.on('click.chipsjs', function(event) {
                    hideSelectedMenu();
                });
            };

            var detachHandler = function($elements) {
                //$elements.off('.chipsjs');
            };


            this.run = function() {
                buildMenu();
                attachClickHandler(self.$elem.find('[data-href]'));
                attachMobileHandler($(self.options.mobileTrigger));
                mobileSupport();
            };
        }

        chipsJs.prototype.init = function (options, elem) {
            this.$elem = $(elem);
            this.options = $.extend({}, $.fn.chipsjs.default, options);

            return this.options;
        };

        return chipsJs;

    })();

    $.fn.chipsjs = function (method, options) {
        return this.each(function () {
            var plugin = new chipsJs();

            if (plugin.hasOwnProperty(method)) {
                plugin.init(options, this);
                return plugin.run();
            } else if (typeof method === 'object' || !method) {
                options = method;
                plugin.init(options, this);
                return plugin.run();
            } else {
                $.error('Method ' + method + ' does not exist in chipsJs');
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
        mediaQuery: 'all and (max-width:786px)',
        mobileTrigger: '.chipsjs__trigger',
        mobileReset: 'chipsjs__reset-transform',
        mobileSensitivity: 80,
        addTitle: true,
        appendHtml: '<div class="chipsjs__wrapper">' +
                    '<button class="chipsjs__close"><span class="u-acc-hide">Close</span></button>' +
                    '<div class="chipsjs__menu"><div class="container"></div></div></div>'
    };

    $.fn.chipsjs.chipsJs = chipsJs;

}));