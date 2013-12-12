/**
 * @fileoverview 店铺头部搜索js,包含店铺信息信用的popup
 * @author baxian@taobao.com
 */
KISSY.add('hotel-item/mods/head', function(S,Suggest,Overlay){
	var S = KISSY, DOM = S.DOM, Event = S.Event, IE = S.UA.ie,
        host = (location.hostname.indexOf('taobao.com') != -1) ? 'taobao.com' : 'daily.taobao.net',
        defaultFormAction = 'http://s.' + host + '/search';
    //修改domain
    try{
    	var w = document.domain.split(".");
    	document.domain = w.slice(w.length-2).join(".");
    }catch(v){}

    function inputHit(el) {

        el = DOM.get(el);
        if (!el) return;

        var elemParent = el.parentNode,
            FOCUS = 'focus',

            blurHandle = function () {
                '' !== el.value ?
                DOM.addClass(elemParent, FOCUS) :
                DOM.removeClass(elemParent, FOCUS);
            };

        Event.on(el, FOCUS, function (evt) {
            DOM.addClass(elemParent, FOCUS);
        });

        Event.on(el, 'blur', blurHandle);

        setTimeout(blurHandle, 0);
    }

    function initTBSearch(form) {
        if (!(form = DOM.get(form))) return;


        var q = form['shop-q'], sourceId, appId;

        if (!q) return;

        Event.on(DOM.query('button', form), 'click', function (evt) {
            var curBtn = this;
            form.action = DOM.hasClass(curBtn, 'searchtb') ? defaultFormAction : DOM.attr(curBtn, 'data-action');
            form.submit();
        });

        var sug = new S.Suggest(q, 'http://suggest.taobao.com/sug?code=utf-8', {
            resultFormat:'约%result%个宝贝',
            containerWidth:'312px'
        });


        // 主搜埋点
        if (window.g_config && (appId = window.g_config.appId)) {


            sourceId = (1 === appId ? 'itemz' : (16 === appId ? 'ratez' : 'shopz'));

            if (sourceId === 'itemz' && location.hostname.indexOf('beta') > -1) {
                sourceId = 'itembetaz';
            }

            (function (sourceId) {


                var input = document.createElement("input");
                input.setAttribute("type", "hidden");
                input.setAttribute("name", "initiative_id");
                function retDate() {
                    var now = new Date();
                    var month = now.getMonth() + 1;
                    if (month < 10) month = "0" + month;
                    var date = now.getDate();
                    if (date < 10) date = "0" + date;
                    return [now.getFullYear(), month, date].join("");
                }

                input.value = sourceId + "_" + retDate();

                DOM.append(input, form);

            })(sourceId);

        }
    }


    function fixIE6Hover(el) {
        if (IE && 6 === IE) {

            el = DOM.get(el);
            if (!el) return;
            Event.add(el, 'mouseenter', function (evt) {
                DOM.addClass(this, 'hover');
            });

            Event.add(el, 'mouseleave', function (evt) {
                DOM.removeClass(this, 'hover');
            });
        }
    }

    return {
        init : function () {
            inputHit('#shop-q');
            initTBSearch('#J_TBSearchForm');
            S.each(['#shop-info', '#shop-search .searchmy', '#shop-search .searchtb'], function (el) {
                fixIE6Hover(el);
            });

            // 鼠标移到信用图标上显示虚拟交易比例的Popup
            new Overlay.Popup({
                srcNode: '#shop-rank-popup',
                trigger:'#shop-rank',
                triggerType : 'mouse',
                align:  {
                    node : '#shop-rank',
                    points:['bc', 'tl'],
                    offset:[-20, 10]
                }
            });

            S.ready(function () {
                if (IE && IE === 6) {
                    if (DOM.hasClass('#content', 'head-expand')) return;
                    var hd = DOM.get('#hd');
                    if (hd && hd.offsetHeight > 250) {
                        DOM.css(hd, 'height', '250px');
                    }
                }
            });
        }
    }
},{requires:['suggest','overlay']});