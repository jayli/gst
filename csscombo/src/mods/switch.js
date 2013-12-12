/**
 * @filroverview switch-bar的js功能
 * @author baxian@taobao.com
*/
KISSY.add('hotel-item/mods/switch', function(S){
	var S = KISSY, DOM = S.DOM, Event = S.Event, UA = S.UA,
        doc = document,
        docBody = doc.body,
        isIE = UA.ie,
        isIE6 = UA.ie === 6;
       /**
         * vars
         * @private
         */
    var config = {},
        switchElement = null,
        switchTrigger = null,
        detailContent = null,
        neoSpan, divDetail, mainWrap;

    /**
     * getDoc
     * @private
     */
    var getDoc = function () {
        if (UA.webkit > 0) {
            getDoc = function () {
                return docBody;
            };
        } else {
            getDoc = function () {
                return doc.documentElement;
            };
        }
        return getDoc();
    };

    /**
     * calcPos
     * @private
     */
    var calcPos = function () {
        var viewportHeight = DOM.viewportHeight() - 2;	// strip 1 pixel from top & bottom each
        if (isIE6) {
            calcPos = function (resizing) {
                try { // on resizing
                    if (true === resizing) {
                        viewportHeight = DOM.viewportHeight() - 2;	// strip 1 pixel from top & bottom each
                    }
                    var docScrollTop = getDoc().scrollTop,
                        detailRegion = DOM.offset(detailContent),
                        detailTop = detailRegion.top,
                        detailBottom = detailTop + detailContent.offsetHeight;

                    DOM.css(switchElement, 'position', 'absolute');
                    DOM.css(switchElement, 'z-index', '10');
                    DOM.css(switchElement, 'width', '11px');
                    DOM.css(switchElement, 'margin-left', '-20px');

                    if (docScrollTop >= detailTop) {
                        DOM.css(switchElement, 'top', docScrollTop + 'px');
                        if (docScrollTop + viewportHeight < detailBottom) {
                            // height
                            DOM.css(switchTrigger, 'height', viewportHeight + 'px');
                        } else {
                            // height
                            DOM.css(switchTrigger, 'height', detailBottom - docScrollTop + 'px');
                        }
                    } else {
                        // 取消mainWrap的relative后，需同时调整switchElement，modify by changtian, 2010-12-10
                        DOM.css(switchElement, 'top', detailTop + 'px');

                        // height
                        var height = viewportHeight + docScrollTop - detailTop;
                        if (height >= 0) {
                            DOM.css(switchTrigger, 'height', height + 'px');
                        }
                    }
                } catch (e) { }
            };
        } else {
            // doesn't change y position for non-IE6
            calcPos = function (resizing) {
                try {
                    if (true === resizing) {
                        viewportHeight = DOM.viewportHeight() - 2;	// strip 1 pixel from top & bottom each
                    }
                    var docScrollTop = getDoc().scrollTop,
                        detailRegion = DOM.offset(detailContent),
                        detailTop = detailRegion.top,
                        detailBottom = detailTop + detailContent.offsetHeight;
                    if (docScrollTop >= detailTop) {
                        // top
                        DOM.css(switchElement, 'top', '0');
                        DOM.css(switchElement, 'margin-top', '0');
                        if (docScrollTop + viewportHeight < detailBottom) {
                            // height
                            DOM.css(switchTrigger, 'height', viewportHeight + 'px');
                        } else {
                            // height
                            DOM.css(switchTrigger, 'height', detailBottom - docScrollTop + 'px');
                        }
                    } else {
                        // top
                        DOM.css(switchElement, 'margin-top', 0 - getDoc().scrollTop + 'px');
                        DOM.css(switchElement, 'top', 'auto');

                        // height
                        DOM.css(switchTrigger, 'height', viewportHeight + docScrollTop - detailTop + 'px');
                    }
                } catch (e) { }
            };
        }
        return calcPos();
    };

    /**
     * decorate
     * @private
     */
    var decorate = function () {
		mainWrap = DOM.get('.main-wrap', '#bd');
        // create a new div
        switchElement = DOM.create('<div class="switch-bar" />');
        switchTrigger = DOM.create('<a href="#" />');
        neoSpan = DOM.create('<span>点此展开/折叠侧栏</span>');

        // shortcuts
        detailContent = DOM.parent(mainWrap, '.layout');

        if (1 === config.expanded) {
            DOM.addClass(detailContent, 'expanded')
        }
        if (DOM.hasClass(detailContent, 'expanded')) {
            var expanded = 1;
        } else {
            var expanded = -1;
        }

        // hide focus for ie
        if (isIE === true) {
            switchTrigger.hideFocus = true;
        }

        /*
         * @fixed: IE6下，mainWrap设置为relative后，switchbar无法显示
         * @solution: 取消relative，各浏览器下显示正常
         * @by: changtian
         * @date: 2010-12-10
         */
        //DOM.css(mainWrap, 'position', 'relative');

        // appending
        switchTrigger.appendChild(neoSpan);
        switchElement.appendChild(switchTrigger);

		DOM.prepend(switchElement, mainWrap);

        // calculate the position & height
        calcPos();

        // fade in animation
        // var anime = new YUA(switchElement, {opacity: {from: 0, to: 1}}, 0.3);
        // anime.animate();

        Event.on(window, 'scroll', function () { calcPos(); });
        Event.on(window, 'resize', function () { calcPos(); });

        // on clicking
        Event.on(switchTrigger, 'click', function (e) {
            e.halt();

            // TODO: 调用其他模块接口
            // 重置滚动促销的状态
            // TB.Detail.ScrollingPromo.reset();

            DOM[expanded === 1 ? 'removeClass' : 'addClass'](detailContent, 'expanded');
            expanded *= -1;
        });
    };

    return {
        /**
         * initialization
         * @public
         */
        init: function () {
            // data-type为normal，说明页面为普通店铺，普通店铺无左侧栏，不需要折叠展开功能
            if (!(divDetail = DOM.get('#detail')) || DOM.attr('#content', 'data-type') == 'normal') {
                return;
            }

            decorate();
        }
    };
});