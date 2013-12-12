/*
combined files : 

hotel-item/mods/head
hotel-item/mods/report
hotel-item/mods/hotel-login
hotel-item/mods/hotel-tab-item
hotel-item/mods/hotel-page
hotel-item/mods/hotel-tab-record
hotel-item/mods/hotel-tab
hotel-item/mods/hotel-gotop
hotel-item/mods/hotel-fav
hotel-item/mods/switch
hotel-item/mods/imgview
hotel-item/mods/hotel-room
hotel-item/mods/hotel-price-policy
hotel-item/mods/hotel-item

*/
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
/**
 * @fileOverview 举报中心js功能
 * @version 0.1
 * @author baxian@taobao.com
 */
KISSY.add('hotel-item/mods/report', function(S){
	var _report = S.one(document.getElementById('J_Report'));
	if(!_report){
		return {
			init : function(){}
		};
	}
	var heading = _report.one('.tb-report-heading'),
		menu = _report.one('.tb-report-menu'),
		VISIBILITY = 'visibility',
		HOVER_CLS = 'tb-report-hover';

	function _init(){
		_report.on('mouseenter', function () {
			menu.css(VISIBILITY, 'visible');
			_report.addClass(HOVER_CLS);
		});
		_report.on('mouseleave', function () {
			menu.css(VISIBILITY, 'hidden');
			_report.removeClass(HOVER_CLS);
		});
	}

	return {
            init:_init
        }
},{requires:['node','event']});
/**
 * 淘宝迷你登录
 * Author: Angtian
 * E-mail: Angtian.fgm@taobao.com
 *
 * ===========================使用方法===========================
 * 一、调用模块
 * KISSY.use('hotel/item/js/hotel-login', function(S, HotelLogin) {
 *     //存放迷你登录实例
 *     var oLogin = null;
 *     //显示迷你登录框触发事件
 *     S.one('button').on('click', function() {
 *          //迷你登录实例不存在，new一个新实例
 *          if(!oLogin) {
 *              oLogin = new HotelLogin();
 *          }
 *          //如果实例存在，使用show方法显示迷你登录框
 *          else {
 *              oLogin.show();
 *          }
 *     });
 * });
 */

KISSY.add('hotel-item/mods/hotel-login', function(S) {

/**
 * 淘宝迷你登录模块
 * 在实例化和调用show方法的时候都可以进行参数调整
 *
 * 参数类型：json
 * @param {Number}  width         登录框宽
 * @param {Number}  height        登录框高
 * @param {String}  redirectURL   登录成功后跳转页面
 * @param {Boolean} full_redirect 是否框内跳转

 * @module hotel-login
 */

var $        = S.all,
    IE       = S.UA.ie,
    LOGINSRC = document.location.hostname.indexOf('daily') < 0 ? 'https://login.taobao.com/member/login.jhtml' : 'https://login.daily.taobao.net/member/login.jhtml';

/**
  * 迷你登录构造函数
  *
  * @class  Login
  * @constructor
  */

function Login() {
    this._init.apply(this, arguments);
};

S.augment(Login, {
    /**
     * 遮罩层
     *
     * @element _mask
     * @type Object
     * @private
     */
    _mask: null,

    /**
     * 登录框外容器
     *
     * @element _wrap
     * @type Object
     * @private
     */
    _wrap: null,

    /**
     * 登录框关闭按钮
     *
     * @element _closeBtn
     * @type Object
     * @private
     */
    _closeBtn: null,

    /**
     * 登录框架
     *
     * @element _iframe
     * @type Object
     * @private
     */
    _iframe: null,

    /**
     * 登录框参数
     *
     * @property _options
     * @type Object
     * @private
     */
    _options: {},

    /**
     * 模块初始化
     *
     * @method _init
     * @param {Object} options 配置参数
     * @private
     */
    _init: function(options) {
        this._setOptions(options)._renderUI()._bindUI();
    },

    /**
     * 绑定事件
     *
     * @method _bindUI
     * @private
     */
    _bindUI: function() {
        this._closeBtn.on('click', this.hide, this);
    },

    /**
     * 渲染结构
     *
     * @method _renderUI
     * @private
     */
    _renderUI: function() {
        this._mask = $('<div />').css({
                     'position'  : 'fixed',
                     'top'       : 0,
                     'left'      : 0,
                     'right'     : 0,
                     'bottom'    : 0,
                     'z-index'   : 8888888,
                     'width'     : '100%',
                     'background': '#000000',
                     'opacity'   : 0.6,
                     'filter'    : 'alpha(opacity=60)'
                     });

        this._wrap = $('<div />').css({
                     'position'  : 'fixed',
                     'top'       : '50%',
                     'left'      : '50%',
                     'width'     : this._options.width + 'px',
                     'height'    : this._options.height + 'px',
                     'margin'    : -parseInt(this._options.height / 2) + 'px 0 0 -' + parseInt(this._options.width / 2) + 'px',
                     'padding'   : '10px',
                     'z-index'   : 9999999,
                     'background': '#FAFAFA'
                     });

        this._closeBtn = $('<a href="javascript:;" />').css({
                         'position'  : 'absolute',
                         'top'       : '5px',
                         'right'     : '5px',
                         'width'     : '17px',
                         'height'    : '17px',
                         'overflow'  : 'hidden',
                         'background': 'url("http://img03.taobaocdn.com/tps/i3/T1HQezXcXnXXXXXXXX-123-400.png") no-repeat scroll 0 -81px transparent'
                         });

        this._iframe = $('<iframe scrolling="no" frameborder="0" src="' + this._setIframeSrc() + '" />').css({
                       'width' : this._options.width + 'px',
                       'height': this._options.height + 'px'
                       });

        $('body').append(this._mask).append(this._wrap.append(this._closeBtn).append(this._iframe));

        IE == 6 && this._fixed();

        return this;
    },

    /**
     * 设置iframe src
     *
     * @method _setIframeSrc
     * @private
     */
    _setIframeSrc: function() {
        return LOGINSRC + '?style=mini&redirectURL=' + encodeURIComponent(this._options.redirectURL) +'&full_redirect='+ this._options.full_redirect;
    },

    /**
     * 设置参数
     *
     * @method _setOptions
     * @param {Object} 配置参数
     * @private
     */
    _setOptions: function(options) {
        this._options = S.merge({
                        width        : 380,                     //登录框宽，默认380像素
                        height       : 270,                     //登录框高，默认270像素
                        redirectURL  : 'http://www.taobao.com', //登录成功后跳转地址，默认淘宝主页
                        full_redirect: true                     //是否框外跳转，默认true
                        }, options || {});
        return this;
    },

    /**
     * 使IE6支持fixed，并修复无法遮罩select元素的bug
     *
     * @method _fixed
     * @private
     */
    _fixed: function() {
        this._mask.css('position', 'absolute');
        this._wrap.css('position', 'absolute');
        document.documentElement.style.textOverflow = "ellipsis";
        this._mask.getDOMNode().style.setExpression('height', 'eval(document.documentElement.scrollTop + document.documentElement.clientHeight) + "px"');
        this._wrap.getDOMNode().style.setExpression('top', 'eval(document.documentElement.scrollTop + document.documentElement.clientHeight/2) + "px"');
        this._wrap.getDOMNode().style.setExpression('left', 'eval(document.documentElement.scrollLeft + document.documentElement.clientWidth/2) + "px"');
        this._mask.append($('<iframe scrolling="no" frameborder="0" />').css({
                          'position': 'absolute',
                          'top'     : 0,
                          'left'    : 0,
                          'width'   : this._mask.width() + "px",
                          'height'  : this._mask.height() + "px",
                          'z-index' : -1,
                          'filter'  : 'alpha(opacity=0)'
                          }));
    },

    /**
     * 对外接口，显示迷你登录框
     *
     * @method show
     * @param {Object} options 配置参数
     */
    show: function(options) {
        this._mask.css('display', 'block');
        this._wrap.css('display', 'block');
        if(!options) return;
        this._setOptions(options);
        this._wrap.css({
            'width' : this._options.width + 'px',
            'height': this._options.height + 'px'
        });
        this._iframe.css({
            'width' : this._options.width + 'px',
            'height': this._options.height + 'px'
        });
        this._iframe.attr('src', this._setIframeSrc());
    },

    /**
     * 对外接口，隐藏迷你登录框
     *
     * @method hide
     */
    hide: function() {
        this._wrap.css('display', 'none');
        this._mask.css('display', 'none');
    }
});

return S.HotelLogin = Login;

});
/**
 * 宝贝详情
 * Author: Angtian
 * E-mail: angtian.fgm@taobao.com
 */
KISSY.add('hotel-item/mods/hotel-tab-item', function(S, Template) {

var toHTML = S.substitute;

/**
 * 商品属性区域模块
 * @type {String}
 */
var TEMPLATE = '<ul class="attr-list">' +

                   '{{#if sz}}' +
                       '<li>床宽: {{sz}}</li>' +
                   '{{/if}}' +

                   '{{#if st}}' +
                       '<li>楼层: {{st}}</li>' +
                   '{{/if}}' +

                   '{{#if bf}}' +
                       '<li>早餐: {{bf}}</li>' +
                   '{{/if}}' +

                   '{{#if bt}}' +
                       '<li>床型: {{bt}}</li>' +
                   '{{/if}}' +

                   '{{#if ar}}' +
                       '<li>面积: {{ar}}</li>' +
                   '{{/if}}' +

                   '{{#if bbn}}' +
                       '<li>宽带: {{bbn}}</li>' +
                   '{{/if}}' +

                   '{{#if s}}' +
                       '<li class="last">服务设施: {{s}}</li>' +
                   '{{/if}}' +

                   '{{#if rt}}' +
                       '<li class="last row">发票: {{#if rt.hasRT}}有发票，{{rt.type}}{{#else}}无发票{{/if}}</li>' +
                       '{{#if rt.info}}' +
                           '<li class="last row">发票说明: {{rt.info}}</li>' +
                       '{{/if}}' +
                   '{{/if}}' +

                   '{{#if rf}}' +
                        '<li class="last row">' +
                            '<div class="refund-title">退订政策: </div>' +
                            '<div class="refund-content">' +
                                '{{#each rf}}<p>{{_ks_value}}</p>{{/each}}' +
                            '</div>' +
                        '</li>' +
                   '{{/if}}' +

               '</ul>';

/**
 * 商品属性数据
 * @type {Object}
 */
var __ATTRS = {
    'sz': {
        'S0': '1米及以下',
        'S1': '1.35米',
        'S2': '1.5米',
        'S3': '1.8米',
        'S4': '2.0米',
        'S5': '2.2米及以上',
        'S6': '1.1米',
        'S7': '1.2米'
    },
    'bt': {
        'T0': '单人床',
        'T1': '大床',
        'T2': '双床',
        'T3': '双床/大床',
        'T4': '子母床',
        'T5': '上下床',
        'T6': '圆形床',
        'T7': '多床',
        'T8': '其他床型'
    },
    'bf': [
        '无早',
        '单早',
        '双早',
        '三早',
        '多早'
    ],
    'ar': {
        'A0': '15平米以下',
        'A1': '16-30平米',
        'A2': '31-50平米',
        'A3': '50平米以上'
    },
    'bbn': {
        'B0': '无宽带',
        'B1': '免费宽带',
        'B2': '收费宽带',
        'B3': '部分收费宽带'
    },
    's': {
        'bar'      : '吧台',
        'catv'     : '有线电视',
        'ddd'      : '国内长途电话',
        'idd'      : '国际长途电话',
        'toilet'   : '独立卫生间',
        'pubtoilet': '公共卫生间'
    }
};

function TabItem() {
    this.attr     = S.one('#J_ItemAttribute');
    this.desc     = S.one('#J_ItemDesc');
    this.howToBuy = S.one('#J_HowToBuy');
}

S.augment(TabItem, {

    /**
     * 对外接口，加载宝贝详情内容
     *
     * @method load
     */
    load: function() {
        // this._updateAttribute();
        this._updateDesc();
        // this._updateHowToBuy();
    },

    /**
     * 重置宝贝详情
     *
     * @method reset
     */
    reset: function() {
        // this.desc.empty();
        // this.howToBuy.empty();
    },

    /**
     * 更新商品属性
     *
     * @method _updateAttribute
     * @private
     */
    // _updateAttribute: function() {
    //     var detail = _HOTELDATA_.detail,
    //         item   = detail.item,
    //         pt     = detail.paymentType,
    //         p      = detail.p,
    //         data   = {};

    //     S.each(__ATTRS, function(v, k) {
    //         if(k == 's' && item[k].length > 0) {
    //             for(var i = 0, arr = []; i < item[k].length; i++) arr.push(v[item[k][i]]);
    //             data[k] = arr.join('，');
    //             return;
    //         }
    //         if(k == 'bf' && !S.isEmptyObject(p) && p[pt]) {
    //             data[k] = v[p[pt]['breakfasts'][0]];
    //             return;
    //         }
    //         data[k] = v[item[k]];
    //     });

    //     data['st'] = item['st'] || undefined;

    //     // 发票
    //     (function(RT) {
    //         if(!RT['switch']) return;

    //         data['rt'] = {
    //             hasRT: RT['hasReceipt'],
    //             type : RT['type'] == 'R1' ? '酒店住宿发票' : RT['otherInfo'],
    //             info : RT['receiptInfo']
    //         };
    //     })(item['rt']);

    //     // 退订政策
    //     (function(RF) {
    //         var i = 0
    //         data['rf'] = []

    //         // 全额支付时才显示退订政策，paymentType == 1 为全额支付类型
    //         if (pt != 1) {
    //             data['rf'] = null
    //             return
    //         }

    //         switch (RF.type) {
    //             case 1:
    //                 data['rf'] = ['任意退']
    //                 break
    //             case 2:
    //                 data['rf'] = ['不能退']
    //                 break
    //             case 3:
    //                 for (i; i < RF.policy.length; ++i) {
    //                     data['rf'].push('提前' + RF.policy[i]['d'] + '天内退订，收取订单总额' + RF.policy[i]['r'] + '%的违约金；')
    //                 }
    //                 break
    //             default:
    //                 data['rf'] = null
    //                 return
    //         }
    //     })(item['refund'])

    //     this.attr.html(Template(TEMPLATE).render(data));
    // },

    /**
     * 更新宝贝描述
     *
     * @method _updateDesc
     * @private
     */
    _updateDesc: function() {
        var that = this;

        S.getScript('http://' + item_config.descUrl, {
            success: function() {
                that.desc.html(window['desc']);
            }
        });
    },

    /**
     * 更新购买须知
     *
     * @method _updateHowToBuy
     * @private
     */
    _updateHowToBuy: function() {
        var that  = this,
            guUrl = _HOTELDATA_.detail.item.guUrl;

        guUrl && S.getScript(guUrl, {
            success: function() {
                that.howToBuy.html(window['hotelBuyGuide']);
            }
        });
    }

});

return S.TabItem = TabItem;

}, {requires: ['template']});

/**
 * 分页
 * Author: Angtian
 * E-mail: angtian.fgm@taobao.com
 */
KISSY.add('hotel-item/mods/hotel-page',function(S) {

var toHTML = S.substitute;

var TEMPLATE = {
    'page-box' : '<div class="hotel-page-box">' +
                    '<div class="hotel-page">' +
                        '{prev-page}' +
                        '{first-page}' +
                        '{pages}' +
                        '{next-page}' +
                    '</div>' +
                 '</div>',

    'prev-page' : '<a href="javascript:;" class="{prev-cls}" data-value="{data-value}">上一页</a>',

    'first-page': '<a href="javascript:;" data-value="1" class="J_HotelPage">1</a>',

    'page-break': '<a href="javascript:;" class="page-break">...</a>',

    'pages'     : '<a href="javascript:;" class="{current}" data-value="{data-value}">{page}</a>',

    'next-page' : '<a href="javascript:;" class="{next-cls}" data-value="{data-value}">下一页</a>'

};

function HotelPage() {

}

S.augment(HotelPage, {
    /**
     * 对外接口，初始化
     *
     * @method init
     */
    init: function(options) {
        this._options = KISSY.merge({
            'pageSize': 1,
            'curPage' : 1
        }, options || {});
        return this._updatePage();
    },

    /**
     * 更新分页
     *
     * @method _updatePage
     * @private
     */
    _updatePage: function() {
        var maxNum   = 5,
            pageSize = this._options.pageSize,
            curPage  = this._options.curPage,
            maxSize  = 1;

        switch(true) {
            case pageSize < maxNum:
                maxSize = pageSize;
                break;
            case curPage == pageSize:
                maxSize = pageSize;
                break;
            case curPage >= maxNum:
                maxSize = curPage * 1 + 1;
                break;
            default:
                maxSize = maxNum;
                break;
        }

        return toHTML(TEMPLATE['page-box'], {
                   'prev-page' : toHTML(TEMPLATE['prev-page'], {'prev-cls': curPage > 1 ? 'prev-page J_HotelPage' : 'first-page', 'data-value': curPage - 1}),
                   'first-page': maxSize > 5 ? TEMPLATE['first-page'] + TEMPLATE['page-break'] : '',
                   'pages'     : function(){
                                     var tmpl = '';
                                     var i    = maxSize > 5 ? maxSize - 3 : 1;
                                     for(;i <= maxSize; i++) {
                                         tmpl += toHTML(TEMPLATE['pages'], {'page': i, 'current': i == curPage ? 'current' : 'J_HotelPage', 'data-value': i});
                                     }
                                     return tmpl;
                                 } (),
                   'next-page': toHTML(TEMPLATE['next-page'], {'next-cls': curPage == pageSize ? 'last-page' : 'next-page J_HotelPage', 'data-value': curPage * 1 + 1})
               });
    }
});

return S.HotelPage = HotelPage;

});
/**
 * 交易记录
 * Author: Angtian
 * E-mail: angtian.fgm@taobao.com
 */
KISSY.add('hotel-item/mods/hotel-tab-record', function(S, HotelPage) {

var D      = S.DOM,
    each   = S.each,
    toHTML = S.substitute,
    GUID   = 0;

/**
 * 成交记录模块
 * @type {String}
 */
var TEMPLATE = {
    'table'  : '<table>' +
                   '<thead>' +
                       '<th class="first">买家</th>' +
                       '<th>拍下价格</th>' +
                       '<th>数量</th>' +
                       '<th>付款时间</th>' +
                       '<th>宝贝名称</th>' +
                   '</thead>' +
                   '<tbody>' +
                       '{rows}' +
                   '</tbody>' +
               '</table>',

    'rows'   : '<tr>' +
                  '<td class="record-nick first">' +
                      '<span>{nick}</span>' +
                      '{rank}{vip}' +
                  '</td>' +
                  '<td class="record-price">' +
                      '{price}' +
                      '<span>' +
                          ' ({pay_name})' +
                      '</span>' +
                      '{discount}' +
                  '</td>' +
                  '<td class="record-amount">' +
                      '{amount}' +
                  '</td>' +
                  '<td class="record-time">' +
                      '{time}' +
                  '</td>' +
                  '<td class="record-name">' +
                      '{name}' +
                  '</td>' +
               '</tr>',

    'rank'   : '<img src="http://pics.taobaocdn.com/newrank/{displayRatePic}" alt="{rankTitle}" title="{rankTitle}" />',

    'vip'    : '<a href="http://vip.taobao.com" target="_blank">' +
                   '<img src="{vipSrc}" alt="{vipTitle}" title="{vipTitle}" />' +
               '</a>',

    'noRecord': '<div class="no-prompt">' +
                    '<p>暂时还没有买家购买此宝贝，最近30天成交0件。</p>' +
                '</div>'
};

var PAYNAME = [
              '',
              '全额支付',
              '手续费-订单',
              '订金支付',
              '手续费-间夜',
              '到店支付'];

var HOST = 'http://' + location.href.match(/:\/\/([^\/]+)/)[1];

function TabRecord() {
    this.pos   = S.one('#J_PromotionsShop').next();
    this.box   = S.one('#J_RecordBox');
    this.prev  = this.box.prev();
    this.count = S.one('#J_RecordCount');
    this._bindUI();
}

S.augment(TabRecord, {

    /**
     * 对外接口，加载成交记录
     *
     * @method load
     */
    load: function(param) {
      var that    = this,
          oDetail = _HOTELDATA_.detail,
          oParam  = param || {};

      S.io({
          'url': HOST + '/remote/getBuyerList.do',
          'data': {
              'gid'     : oDetail.item.id,
              'sellerId': oDetail.seller.id,
              'history' : oParam.history || 0,
              'page'    : oParam.page || 1,
              'sn'      : ++GUID
          },
          'context' : that,
          'dataType': 'jsonp',
          'success' : that._success,
          'error'   : function() {
            S.log('getBuyerList api error');
          }
      });

      return this;
    },

    /**
     * 重置成交记录
     *
     * @method reset
     */
    reset: function() {
        this.count.html(0);
        this.box.html(TEMPLATE.noRecord);
        this.box.undelegate('click', '.J_HotelPage', this._pageClick, this);
    },

    /**
     * 接口成功回调函数
     *
     * @function
     * @param  {Object} data 回调数据
     */
    _success: function(data) {
        if(!data || GUID != data.query.sn) return;

        var sTmpl = '';

        if(!data.list.length) {
            this.reset();
            return;
        }

        this.count.html(data.totalCount);

        each(data.list, function(o) {
            sTmpl += toHTML(TEMPLATE.rows, {
                'nick'    : o['nick'],
                'rank'    : o['displayRatePic'] ? toHTML(TEMPLATE.rank, o) : '',
                'vip'     : o['vipSrc'] ? toHTML(TEMPLATE.vip, o) : '',
                'price'   : o['price'],
                'amount'  : o['amount'],
                'time'    : o['payTime'],
                'name'    : o['title'],
                'pay_name': PAYNAME[o['payType']],
                'discount': o['discount'] ? '<a title="活动促销" class="discount"></a>' : ''
            });
        });

        this.box.html(
            toHTML(TEMPLATE.table, {'rows' : sTmpl}) + this._updatePage(data)
        ).addClass('loaded');
    },

    /**
     * 更新分页数据
     *
     * @method _updatePage
     * @param {Object} data 回调数据
     * @private
     */
    _updatePage: function(data) {
        var that = this;
        if(!this._page) this._page = new HotelPage();
        return this._page.init({
            'pageSize': data['maxPage'],
            'curPage' : data['page']
        });
    },

    /**
     * 绑定事件
     *
     * @method _bindUI
     * @private
     */
    _bindUI: function() {
        this.box.delegate('click', '.J_HotelPage', this._pageClick, this);
        return this;
    },

    /**
     * 分页点击事件处理函数
     *
     * @method _pageClick
     * @param  {Event} e 事件对象
     * @private
     */
    _pageClick: function(e) {
        this.load({
            'page': e.currentTarget.getAttribute('data-value')
        });
        D.scrollTop(this._toScroll());
    },

    /**
     * 滚动条位置
     *
     * @method _toScroll
     * @return  {Number} 滚动条位置
     * @private
     */
    _toScroll: function() {
      return this.prev.hasClass('hidden') ? this.pos.offset().top : this.prev.offset().top - 50;
    }

});

return S.TabRecord = TabRecord;

}, {requires: ['./hotel-page']});
/**
 * Tab切换
 * Author: Angtian
 * E-mail: angtian.fgm@taobao.com
 */
KISSY.add('hotel-item/mods/hotel-tab', function(S, TabItem, TabRecord, Anim) {

/**
 * 酒店优惠信息接入模块
 * 根据UMP接口返回的数据，显示优惠促销信息
 *
 * @module hotel-tab
 */

window['_HOTELDATA_'] = _hotel_data;

var $  = S.all,
    D  = S.DOM,
    E  = S.Event,
    IE = S.UA.ie;

function Tab() {
    this.pos   = S.one('#J_PromotionsShop').next();
    this.tab   = S.one('#J_HotelTab');
    this.tabs  = this.tab.all('.J_Tab');
    this.attr  = S.all('#J_HotelTabSummary .J_Summary');
    this.boxes = S.all('#J_HotelTabBox .J_TabBox');
    this._init();
}

S.augment(Tab, {

    /**
     * 初始化
     *
     * @method _init
     * @private
     */
    _init: function() {
        this._bindUI();
        this.fireClick(0);
    },

    /**
     * 事件绑定
     *
     * @method _bindUI
     * @private
     */
    _bindUI: function() {
        E.delegate(this.tab, 'click', '.J_Tab', this._EVENT.toggle, this);
        E.on(window, 'scroll resize', this._EVENT.tabFixed, this);
    },

    /**
     * 对外接口，按索引激活选项卡
     *
     * @method fireClick
     * @param {Number} idx 选项卡索引
     */
    fireClick: function(idx) {
        this.tabs.item(idx).fire('click');
        if(!this['boolean']) this['boolean'] = !0;
    },

    /**
     * 事件处理
     *
     * @name _EVENT
     * @private
     */
    _EVENT: {
        /**
         * Tab切换
         * @function
         * @param  {Event} e 事件对象
         */
        toggle: function(e) {
            var _this = this,
                _target   = e.currentTarget,
                oTarget   = S.one(_target),
                idx       = S.indexOf(_target, oTarget.parent().children()),
                oSummarys = this.attr.item(idx),
                oBox      = this.boxes.item(idx);

            switch(idx) {
                // 宝贝详情
                case 0:
                    if(!this._tabItem) {
                        this.loadItemDesc();
                    }

                    if(!this._tabReview) {
                         // S.one('#J_ReviewBox').removeClass('loaded');
                    }
                    break;
                // 酒店详情
                case 1:
                    // S.one('#J_ReviewBox').addClass('loaded');
                    break;
                // 评价详情
                // case 2:
                //     if(!this._tabReview) {
                //         // 防止重复请求接口
                //         S.one('#J_ReviewBox').addClass('loaded');
                //         S.one('#J_RecordBox').addClass('loaded');
                //         this.loadReview();
                //     }
                //     break;
                // // 成交记录
                case 2:
                    // S.one('#J_ReviewBox').addClass('loaded');
                    if(!this._tabRecord) {
                        // 防止重复请求接口
                        S.one('#J_RecordBox').addClass('loaded');
                        this.loadRecord();
                    }
                    break;
            }

            this['boolean'] && D.scrollTop(_this.pos.offset().top);

            oTarget.addClass('selected').siblings().removeClass('selected');

            oSummarys.removeClass('hidden').siblings().addClass('hidden');

            oBox.removeClass('hidden').siblings().addClass('hidden');

            if(idx == 0) oBox.siblings().removeClass('hidden');
            // bugfix: ie6 下 a 链接点击触发 iframe 刷新被阻止
            // 阻止默认行为
            return false;
        },

        /**
         * Tab栏固定位置
         * @function
         */
        tabFixed: function() {
            if(IE != 6) {
               this.tab[D.scrollTop() > this.pos.offset().top + 10 ? 'addClass' : 'removeClass']('fixed');
               return;
            }
        }
    },

    /**
     * 加载宝贝详情
     *
     * @method loadItemDesc
     */
    loadItemDesc: function() {
        if(!this._tabItem) {
            this._tabItem = new TabItem();
        }
        this._tabItem.load();
    },

    /**
     * 加载评价详情
     *
     * @method loadReview
     */
    loadReview: function() {
        // var oDetail = _HOTELDATA_.detail;
        // if(!this._tabReview) {
        //     this._tabReview = (typeof oDetail.seller.kaname !== 'undefined') && oDetail.seller.kaname === 'booking' && oDetail.hotel.reviewCount > 0 ? new TabReviewBooking : new TabReview();
        // }
        // this._tabReview.load();
    },

    /**
     * 加载成交记录
     *
     * @method loadRecord
     */
    loadRecord: function() {
        if(!this._tabRecord) {
            this._tabRecord = new TabRecord();
        }
        this._tabRecord.load();
    },

    /**
     * 重置Tab
     *
     * @method reset
     */
    reset: function() {
        this._tabItem && this._tabItem.reset();
        this._tabItem = null;

        // this._tabReview && this._tabReview.reset();
        // this._tabReview = null;

        this._tabRecord && this._tabRecord.reset();
        this._tabRecord = null;

        this['boolean'] = !1;
    }

});

return S.HotelTab = Tab;

// }, {requires:['./hotel-tab-item', './hotel-tab-review', './hotel-tab-review-booking', './hotel-tab-record', 'anim']});
}, {requires:['./hotel-tab-item', './hotel-tab-record', 'anim']});

/**
 * 回到顶部
 * Author: Angtian
 * E-mail: angtian.fgm@taobao.com
 */
KISSY.add('hotel-item/mods/hotel-gotop', function(S) {

var D  = S.DOM,
    E  = S.Event,
    IE = S.UA.ie;

/**
 * 结构模板
 *
 * @type {String}
 */

var TEMPLATE = '<div id="hotel-gotop-wrap">' +
				   '<div class="join-wrap join-wrap-hide">' +
					   '<a class="hotel-adm-join" href="{url}" target="_blank"></a>' +
					   '<a class="join-link" href="{url}" target="_blank">马上加入</a>' +
				    '</div>' +
                   '<a class="hotel-gotop" href="javascript:;"></a>' +
                   '<a class="hotel-feedback" href="http://ur.taobao.com/survey/view.htm?id=1474" target="_blank"></a>' +
               '</div>';

/**
 * Fixed定位处理辅助
 *
 * @name setFixed
 * @param {Node} el 定位的节点
 * @function
 */
function setFixed(el) {
    if(IE != 6) {
        el.css('position', 'fixed');
        return;
    }
    el.css('position', 'absolute');
    document.documentElement.style.textOverflow = 'ellipsis';
    el.getDOMNode().style.setExpression('top', 'eval(document.documentElement.scrollTop + ' + ((parseInt(el.css('top')) || 0) - D.scrollTop()) + ') + "px"');
    el.getDOMNode().style.setExpression('left', 'eval(document.documentElement.scrollLeft + ' + ((parseInt(el.css('left')) || 0) - D.scrollLeft()) + ') + "px"');
};

/**
  * 回到顶部构造函数
  *
  * @class GoTop
  * @constructor
  */
function GoTop() {
    this._init();
}

S.augment(GoTop, {

    /**
     * 初始化
     *
     * @method _init
     * @private
     */
    _init: function() {
        this._renderUI()._bindUI();
    },

    /**
     * 渲染结构
     *
     * @method _renderUI
     * @private
     */
    _renderUI: function() {
    	var seller = S.one('#content').attr('data-isquickbuyseller'),
    		url = S.one('#content').attr('data-quickbuyurl');

        if(seller == 'true') {
    		TEMPLATE = TEMPLATE.replace(/\{url\}/ig, url).replace(/join-wrap-hide/ig, '');
    	}

        this.wrap = S.one(TEMPLATE);
        this.goEl = this.wrap.one('.hotel-gotop');
        this.entryEl = this.wrap.one('.join-wrap');
        S.one('body').append(this.wrap);
        this._setPos();
        return this;
    },

    /**
     * 事件绑定
     *
     * @method _bindUI
     * @private
     */
    _bindUI: function() {
        E.on(window, 'scroll resize', this._setPos, this);
        E.on(this.goEl, 'click', this._gotop, this);
        E.on(this.entryEl, 'mouseenter mouseleave', function(e) {
        	S.one(this).toggleClass('join-wrap-hover');
        });
    },

    /**
     * 设置位置
     *
     * @method _setPos
     * @private
     */
    _setPos: function() {
        this.wrap.css({
            'top'    : D.viewportHeight() - 110 - parseInt(this.wrap.height()) + (IE == 6 ? D.scrollTop() : 0),
            'left'   : D.viewportWidth() / 2 + 485,
            'display': D.viewportWidth() < 950 ? 'none' : 'block'
        });
        this.goEl.css('visibility', D.scrollTop() < 200 ? 'hidden' : 'visible');
        IE && (document.documentElement.style.overflowX = D.viewportWidth() < 950 ? "auto": "hidden");
        setFixed(this.wrap);
    },

    /**
     * 回到顶部处理
     *
     * @method _gotop
     * @private
     */
    _gotop: function() {
        D.scrollTop(0);
    }

});

return S.GoTop = GoTop;

});
/**
 * 收藏模块
 * Author: Angtian
 * E-mail: Angtian.fgm@taobao.com
 */
KISSY.add('hotel-item/mods/hotel-fav', function(S, O) {
    var $    = S.all,
        B    = $('body'),
        tmpl = '<a class="close-btn" href="javascript:;">X</a>' +
               '<iframe id="hotel-fav-iframe" src="about:blank" frameborder="0" scrolling="no"></iframe>' +
               '<div class="hotel-fav-bg"></div>';

    function HotelFav() {
        var container = $('<div id="popupPanel">');

        B.append(container);

        var dialog = new O.Dialog({
            srcNode  : container,
            prefixCls: 'hotel-fav-',
            closable : false,
            zIndex   : 999999,
            bodyContent: tmpl,
            align    : {
                points: ['cc', 'cc']
            }
        });

        dialog.render();


        var favIframe = container.one('#hotel-fav-iframe');

        B.delegate('click', '.J_HotelFavTrigger', function(e) {
            e.preventDefault();

            var target = $(e.currentTarget),
                url    = target.attr('href'),
                width  = target.attr('data-width'),
                height = target.attr('data-height');

            dialog.set('width', width);
            dialog.set('height', height);

            if(favIframe.attr('src') != url) {
                favIframe.attr({
                    src   : url,
                    width : width,
                    height: height
                });
            }

            dialog.show();
        });

        container.delegate('click', '.close-btn', function(e) {
            dialog.hide();
        });

        // 解决ie8以下，收藏层无法根据内容自动调整宽高。待主站收藏代码升级后可去除
        S.UA.ie < 8 && dialog.on('show', function() {
            this.__timer && this.__timer.cancel();
            this.__timer = S.later(function() {
                var width  = parseInt(container.css('width')),
                    height = parseInt(container.css('height'));

                favIframe.width() != width && favIframe.attr('width', width);
                favIframe.height() != height && favIframe.attr('height', height);
            }, 1000, true);
        });
    }
    return S.HotelFav = HotelFav;
}, {requires: ['overlay']});
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
/**
 * @fileoverview 宝贝图片模块，包含大图浏览
 * @author baxian@taobao.com
 */
KISSY.add('hotel-item/mods/imgview', function(S,ImageZoom){
    var boothEl, thumbEl, triggers, zoom, imagezoom, cache,
        timer, DELAY = 100,
        DOM = S.DOM,
        Event = S.Event,
        docBody = document.body,
        EMPTY= '',
        SELECTED = 'tb-selected', HIDDEN = 'hidden';

    return {

        /**
         * @public
         */
        init: function() {
            var self = this;
            if (!(boothEl = DOM.get('#J_ImgBooth'))
                || !(thumbEl = DOM.get('#J_UlThumb'))) return;

            triggers = DOM.query('li', thumbEl);
            zoom = DOM.get('J_zoomIcon');
            self._bindEvents();

            S.ready(function() {
                if (S.UA.ie === 6) self._resizeHead();
                self._preloadImgs();
            });
            //Event.on(window,"resize",this.refreshimageZoom)
        },

        /**
         * 重新设置ImageZoom位置
         */
        refreshimageZoom: function() {
            imagezoom&&imagezoom.refreshRegion();
        },

        /**
         * 初始化载入
         * @private
         */
        _resizeHead: function() {
            // B2C
            var el,de;
            if ( (el = DOM.get('div.shop-banner','#hd'))
                && el.scrollHeight > 150 ) {
                el.style.height = '150px';
                if(de=document.getElementById('detail')){
                    de.style.zoom=1;
                }
            }

            // C2C
            if ( (el = S.get('#hd')) && el.scrollHeight > 250 ) {
                DOM.css(el, {
                    height: '250px',
                    overflow: 'hidden'
                });
            }
        },

        /**
         * 预载入原始图片
         *
         * @method loadImages
         */
        loadImages: function() {
            this._preloadImgs();
        },

        /**
         * 预载入原始图片
         * @private
         */
        _preloadImgs: function() {
            if(!cache) {
                cache = DOM.create('<div style="width:0;height:0;overflow:hidden;">');
                docBody.appendChild(cache);
            }
            //var cache = DOM.create('<div style="width:0;height:0;overflow:hidden;">'),
            var limit = parseInt(boothEl.getAttribute('data-hasZoom'), 10),
            self  = this;
            cache.innerHTML = '';
            //docBody.appendChild(cache);
            S.each(DOM.query('img', thumbEl), function(thumb) {
                var img = new Image();
                img.src = thumb.src.replace(/_40x40\.(jpg|png|gif)$/, '');
                cache.appendChild(img);
                if (img.complete) {
                    __loaded(img, thumb);
                }else {
                    Event.on(img, 'load', function() {
                        __loaded(img, thumb);
                    });
                }
            });

            function __loaded(img, thumb) {

                if (img.width >= limit) {
                    thumb.setAttribute('data-hasZoom', '1');
                    thumb.setAttribute('data-bigimgwidth',img.width);
                    thumb.setAttribute('data-bigimgheight',img.height);
                    if (DOM.hasClass(DOM.parent(thumb, 'li'), SELECTED)) {
                        // 延时生成imagezoom，防止错位
                        S.later(function() {
                            self._newImageZoom(img.width,img.height);
                            imagezoom.set('bigImageSrc', img.src);
                        }, 100);
                    }
                }
            }
        },

        /**
         * 绑定事件
         * @private
         */
        _bindEvents: function() {
            var self = this, target;

            Event.on(thumbEl, 'click', function(e) {
                e.preventDefault();
            });
            // Event.on(triggers, 'mouseenter', function(e) {
            //     timer && timer.cancel();
            //     timer = S.later(function() {
            //         self._switchTo(e.target);
            //     }, DELAY);
            // });
            // Event.on(triggers, 'mouseleave', function() {
            //     if(timer){
            //         timer.cancel();
            //     }
            // });
            /** 重写事件绑定 by angtian---------------------------------- {{{ */
            Event.delegate(thumbEl, 'mouseenter mouseleave', 'li', function(e) {
                switch(e.type) {
                    case 'mouseenter':
                        timer && timer.cancel();
                        timer = S.later(function() {
                            self._switchTo(e.target);
                        }, DELAY);
                        break;
                    case 'mouseleave':
                        timer && timer.cancel();
                        break;
                }
            });
            /** end------------------------------------------------------ }}} */
        },

        /**
         * 切换到指定图片
         * @private
         */
        _switchTo: function(o) {
            if (!o) return;

            //新版统计埋点
            //T.sendClick(null, '8.0.0');

            if (o.tagName !== 'LI'){
                o = DOM.parent(o, 'LI');
            }
            var self = this,
            img = o.getElementsByTagName('img')[0],
            hasZoom = img.getAttribute('data-hasZoom') === '1',
            bWidth = img.getAttribute('data-bigimgwidth'),
            bHeight = img.getAttribute('data-bigimgheight'),
            src_310 = img.src.replace('40x40', '310x310'),
            src_big = src_310.replace('_310x310.jpg', EMPTY);
            // DOM.removeClass(triggers, SELECTED);
            // DOM.addClass(o, SELECTED);
            /** 重写替换className by angtian--------------------- {{{ */
            S.one(o).addClass(SELECTED).siblings().removeClass(SELECTED);
            /** end---------------------------------------------- }}} */
            if(imagezoom){
                imagezoom.set('imageSrc',src_310);
            }else{
                boothEl.src = src_310;
            }
            DOM[hasZoom ? 'removeClass' : 'addClass'](zoom, HIDDEN);

            if (!imagezoom) {
                self._newImageZoom(bWidth,bHeight);
            }
            if (imagezoom) {
                imagezoom.set('hasZoom', hasZoom);
                imagezoom.set('bigImageWidth',bWidth);
                imagezoom.set('bigImageHeight',bHeight);
                imagezoom.set('bigImageSrc', src_big);
            }
        },

        /**
         * 初始化 imagezoom 实例
         * @private
         */
        _newImageZoom: function(bigWidth,bigHeight) {
            imagezoom = new ImageZoom({
                imageNode : boothEl,
                align:  {
                    node : S.one(boothEl).parent('.tb-booth'),
                    points : ['tr','tl'],
                    offset : [10,-1]
                },
                preload:  false,
                width : 310,
                height : 310,
                bigImageWidth : bigWidth || 700,
                bigImageHeight : bigHeight || 700
            });
        },

        /**
         * 显示指定图片路径
         * @public
         */
        show: function(src) {
            if (!boothEl || !thumbEl) return;
            DOM.removeClass(triggers, SELECTED);
            boothEl.src = src;

            // 属性图片没有放大镜功能
            imagezoom && imagezoom.set('hasZoom', false);
        }
    };
},{requires:['imagezoom']});
/**
 * 酒店房型
 * Author: Angtian
 * E-mail: Angtian.fgm@taobao.com
 */

KISSY.add('hotel-item/mods/hotel-room', function(S, Template) {

/**
 * 酒店房型模块
 *
 * @module hotel-room
 */
var minHeight = 29 * 2;
var moreClass = 'hotel-sku-has-more';
var minClass = 'hotel-sku-min';

var tpl = ''
    + '<ul class="hotel-sku room-type tb-clear">'
        + '{@each roomTypes as roomType}'
            + '<li class="{@if selected}selected{{@/if}}"">'
                + '<a href="http://kezhan.trip.daily.taobao.net/item2.htm?item_id=${roomType.iid}&start=${roomType.checkIn}&end=${roomType.checkOut}">${roomType.name}</a>'
                + '<i></i>'
            + '</li>'
        + '{@/each}'
    + '</ul>';

var more_tpl = '<a href="javascript:;" class="more"><span class="show">更多房型</span><span class="hide">收起</span></a>';

return {
    init: function() {
        var self = this;

        self.nContainer = S.one('#J_RoomType');
        self.nContent = self.nContainer.one('.room-type');

        self._isNeedMore();

        self._bindUI();
    },

    _bindUI: function() {
        var self = this;

        self.nContainer.delegate('click', '.more', function(e) {
            self.nContainer.toggleClass('hotel-sku-min');

            self.nContent.css('height', self.nContainer.hasClass(minClass) ? minHeight : 'auto');
        });
    },

    _isNeedMore: function() {
        var self = this;

        var isMore = self.nContent.outerHeight() > minHeight;

        if (isMore) {
            self.nContainer.addClass(moreClass);
            self.nContainer.addClass(minClass);
            self.nContent.css('height', minHeight);
            self.nContent.after(more_tpl);
            return;
        }

        self.nContainer.removeClass(moreClass);
        self.nContainer.removeClass(minClass);
        self.nContent.css('height', 'auto');
    },

    reRender: function(data) {
        var self = this;

        self.nContainer.html(Template(tpl, data));

        self._isNeedMore();
    }
};

}, {requires:['gallery/juicer/1.3/']});
/**
 * 酒店价格政策
 * Author: Angtian
 * E-mail: Angtian.fgm@taobao.com
 */

KISSY.add('hotel-item/mods/hotel-price-policy', function(S, Slide, Template) {

/**
 * 酒店价格政策模块
 *
 * @module hotel-room
 */
var minHeight = 29 * 2;
var moreClass = 'hotel-sku-has-more';
var minClass = 'hotel-sku-min';

var tpl = ''
    + '<ul class="hotel-sku price-policy tb-clear">'
        + '{@each rates as rate}'
            + '<li class="J_Rate{@if rate.selected} selected{@/if}" data-value="${rate.rateid}">'
                + '<a href="javascript:;"><span class="price"><em>&yen</em>${rate.avgPrice|round}</span>${rate.name} - <span class="gray">${rate.payType}</span></a>'
                + '<i></i>'
            + '</li>'
        + '{@/each}'
    + '</ul>'
    + '<div class="price-policy-content">'
        + '{@each rates as rate, rate_index}'
            + '<ul class="price-policy-pannel">'
                + '{@each rate.gifts as gift, index}'
                    + '<li>'
                        +'<span class="tit">赠送礼包{@if rate.gifts.length > 1}index * 1 + 1{@/if}</span>'
                        + '{@if gift.type == 1}'
                        + '预订'
                        + '{@else if gift.type == 2}'
                        + '入住'
                        + '{@/if}'
                        + '赠送：'
                        + '<span class="desc">${gift.desc}</span>'
                    + '</li>'
                + '{@/each}'
            + '</ul>'
        + '{@/each}'
    + '</div>';

var more_tpl = '<a href="javascript:;" class="more"><span class="show">更多价格政策</span><span class="hide">收起</span></a>';

var more_desc_tpl = '<span class="short">${text}</span><a href="javascript:;" class="more-desc"><span class="show">更多</span><span class="hide">收起</span></a>';

Template.register('round', function(v) {
    return Math.round(v / 100);
});

return {
    init: function() {
        var self = this;

        self.data = S.clone((window['_hotel_data'] || {}).detail || {});

        self.nRateId = S.one('#J_RateId');

        self.nContainer = S.one('#J_PricePolicy');
        self.nNav = self.nContainer.one('.price-policy');
        self.nPannels = self.nContainer.all('.price-policy-pannel li');

        self._isNeedMore();
        self._isNeedMoreDesc();

        self._bindUI();

        self._initSlide();
    },

    _bindUI: function() {
        var self = this;

        self.nContainer.delegate('click', '.more', function(e) {
            self.nContainer.toggleClass('hotel-sku-min');

            self.nNav.css('height', self.nContainer.hasClass(minClass) ? minHeight : 'auto');
        });

        self.nContainer.delegate('click', '.more-desc', function(e) {
            var node = S.one(e.currentTarget);
            var parent = node.parent('li');

            parent.toggleClass('open');
        });

        self.nContainer.delegate('click', '.J_Rate', function(e) {
            e.halt();

            var node = S.one(e.currentTarget);

            self.nRateId.val(node.attr('data-value'));
        });
    },

    _isNeedMore: function() {
        var self = this;

        if (self.nNav.outerHeight() > minHeight) {
            self.nContainer.addClass(moreClass);
            self.nContainer.addClass(minClass);
            self.nNav.css('height', minHeight);
            self.nNav.after(more_tpl);
            return;
        }

        self.nContainer.removeClass(moreClass);
        self.nContainer.removeClass(minClass);
        self.nNav.css('height', 'auto');
    },

    _isNeedMoreDesc: function() {
        var self = this;
        var len = 40;

        self.nPannels.each(function(pannel) {
            var desc = pannel.one('.desc');
            var text = desc.text();
            var isMore = text.length > len;

            if (isMore) {
                pannel.addClass('has-more open');
                desc.after(Template(more_desc_tpl, {text:text.substr(0, len)}));
            }
        });
    },

    _initSlide: function() {
        var self = this;

        self.slide = new Slide('#J_PricePolicy', {
            navClass: 'price-policy',
            contentClass: 'price-policy-content',
            pannelClass: 'price-policy-pannel',
            defaultTab: -1
        });

        self.slide.go(self._getIndex());
    },

    _getIndex: function() {
        var self = this;

        var index = -1;

        S.each(self.data.rates, function(v, i) {
            if (v.selected) {
                index = i;
            }
        });

        return index;
    },

    reRender: function(data) {
        var self = this;

        self.data = S.clone(data);

        self.nContainer.html(Template(tpl, data));

        self.nNav = self.nContainer.one('.price-policy');
        self.nPannels = self.nContainer.all('.price-policy-pannel li');

        self._initSlide();
        self._isNeedMore();
        self._isNeedMoreDesc();
    }
};

}, {requires:['gallery/slide/1.1/', 'gallery/juicer/1.3/']});
/**
 * 酒店宝贝详情模块
 * Author: Angtian
 * E-mail: Angtian.fgm@taobao.com
 */
KISSY.add('hotel-item/mods/hotel-item', function (S, Anim, Node, Head, Report, Calendar, HotelLogin, HotelTab, HotelGoTop, HotelFav, Switch, Imgview, HotelRoom, HotelPricePolicy) {
/**
 * 酒店宝贝详情模块
 *
 * @module hotel-item
 */
var $      = S.all,
    D      = S.DOM,
    E      = S.Event,
    IE     = S.UA.ie,
    each   = S.each,
    toHTML = S.substitute;

var HOST = 'http://' + (location.href.indexOf('taobao.com') != -1 ? 'kezhan.trip.taobao.com' : 'kezhan.trip.daily.taobao.net');

var WIN              = S.one(window),                //window
    DOC              = S.one(document),              //document
    BODY             = S.one('body'),                //body
    HOTELFORM        = S.one('#J_HotelForm'),        //酒店表单节点
    EDITLINK         = S.one('#J_TEditItem a'),      //编辑宝贝链接
    REPORTLINK       = S.one('#J_isuit'),            //举报商品链接
    HOTELSHARE       = S.one('#J_HotelShareBtn'),    //分享宝贝
    HOTELFAV         = S.one('#J_HotelFav'),         //收藏宝贝
    HOTELFAVSHOP     = S.one('#J_HotelFavShop'),     //收藏店铺
    HOTELSHARESHOP   = S.one('#J_HotelShareShop'),   //分享店铺
    ISDEFAULTDATE    = S.one('#J_DefaultDateFlag'),  //用户是否输入日期
    HOTELGID         = S.one('#J_HotelGid'),         //提交表单元素gid
    BUYNOWVER        = S.one('#J_BuyNowVer'),        //跳转下表单表识，2转到新下单页，1转到老下单页
    CHECKIN          = S.one('#J_CheckIn'),          //入住日期节点
    CHECKOUT         = S.one('#J_CheckOut'),         //离店日期节点
    BUYBTN           = S.one('#J_BuyBtn'),           //立即购买按钮
    ROOMNUM          = S.one('#J_RoomNum'),          //房间数节点
    ROOMSTATUS       = S.one('#J_RoomStatus'),       //房间数状态图标
    TOTALNIGHT       = S.one('#J_TotalNight'),       //房间数容器
    ERRORMSG         = S.one('#J_ErrorMsg'),         //错误消息容器
    WARNINGMSG       = S.one('#J_WarningMsg'),       //警告类提示
    BIGIMG           = S.one('#J_ImgBooth'),         //商品大图
    IMGLIST          = S.one('#J_UlThumb'),          //商品小图列表
    CHANGETIPS       = S.one('#J_ChangeTips'),       //切换商品提示信息
    ROOM             = S.one('#J_Room'),             //房型节点
    PAY              = S.one('#J_Pay'),              //支付类型父节点
    PAYTYPE          = S.one('#J_PayType'),          //支付类型隐藏域
    PAYTIP           = S.one('#J_PayTip'),           //支付类型说明
    ITEMNAME         = S.one('#J_HotelTitle'),       //宝贝名称节点
    TOTALPRICE       = S.all('.J_TotalPrice'),       //商品总价节点
    ONLINEPAY        = S.one('#J_OnlinePay'),        //在线支付节点
    HOTELPAY         = S.one('#J_HotelPay'),         //到店支付节点
    CASHBACKPAY      = S.one('#J_CashbackPay'),      //离店返现节点
    CASHBACKNUM      = S.one('#J_CashbackNum'),      //离店返现金额节点
    REALPRICE        = S.one('#J_RealPrice'),        //实价有房节点
    PREPAYTIPS       = S.one('#J_PrePayTips'),       //全额支付提示节点

    SALESCOUNT       = S.one('#J_MonthSalesCount'),  //月销量节点
    REVIEWCOUNT      = S.all('.J_ReviewCount'),      //评价数节点
    RECORDCOUNT      = S.one('#J_RecordCount'),      //成交记录数节点
    TABLAZYLOAD      = null,                         //Tab懒加载节点

    PROMOTIONSWRAP   = S.one('#J_PromotionsWrap'),   //商品优惠你父容器
    ITEMPROMOTIONS   = S.one('#J_ItemPromotions'),   //商品优惠节点
    SHOPPROMOTIONS   = S.one('#J_PromotionsShop'),   //商品优惠你父容器
    HOTELPROMOTIONS  = S.one('#J_PromotionsHotel'),  //商品优惠父容器

    HOTELPAYAREA     = S.one('#J_HotelPayArea'),     //购买区域容器
    HOTELCANTBUY     = S.one('#J_HotelCantBuy'),     //不能购买外容器

    JUHUASUAN        = S.one('#J_Juhuasuan'),        //聚划算优惠容器
    JUPRICE          = JUHUASUAN.one('.ju-price'),   //聚划算价格
    JUKEY            = S.one('#J_JuKey'),            //聚划算key

    ETAO             = S.one('#J_ETao'),             //一淘容器
    ETAOJF           = S.one('#J_EtaoJF'),           //一淘集分

    SEARCHBY         = S.one('#J_SearchBy'),         //渠道流量监控
    PROMOTION_NIGHTS = null,                         //优惠间夜数提醒

    HOTELISQUICKBUY  = S.one('#J_HotelIsQuickbuy'),  //是否快速购
    HOTELCITY        = S.one('#J_HotelCity'),        //酒店城市

    RATEID           = S.one('#J_RateId')
    ;

var guid = 0;

/**
  * 宝贝详情构造函数
  *
  * @class  HotelItem
  * @constructor
  */
function HotelItem() {
    this._init();
};

S.augment(HotelItem, E.Target, {

    /**
     * 模块初始化
     *
     * @method _init
     * @private
     */
    _init: function() {
        var self = this;

        self.data = S.clone(window['_hotel_data'] || {});

        self._initHotelRoom();
        self._initPricePolicy();

        self._initCalendar();
        self._initGoTop();
        self._bindUI();

        Imgview.init();

        self._update(['_updateNights']);

        // 依赖domready的方法后调用
        S.ready(function() {
            Head.init();
            Report.init();

            self._initTab();
            self._initTabLazyLoad();
            Switch.init();
            HotelFav();
        });
    },

    /**
     * 事件绑定
     *
     * @method _bindUI
     * @private
     */
    _bindUI: function() {

        this.calendar.on('dateclick', this._EVENT.calClick, this);
        this.calendar.on('show', this._EVENT.calShow);

        E.delegate(HOTELFORM, 'click', '#J_BuyBtn', this._EVENT.buy, this);

        E.delegate(HOTELFORM, 'click', '#J_ReviewTabTrigger', this._EVENT.fireReview, this);

        E.delegate(HOTELFORM, 'change', '#J_RoomNum', this._EVENT.roomNumChange, this);

        E.delegate(HOTELFORM, 'click', '.ipt-date', this._EVENT.scroll, this);

        E.delegate(DOC, 'click', '#J_HotelShareBtn', this._EVENT.sns);

        E.delegate(DOC, 'mouseenter mouseleave', '.J_Hover', function(e) {
            S.one(e.currentTarget).toggleClass('hover');
        });

        return this;
    },

    _initHotelRoom: function() {
        HotelRoom.init();
    },

    _initPricePolicy: function() {
        HotelPricePolicy.init();
    },

    /**
     * 日历模块初始化
     *
     * @method _initCalendar
     * @private
     */
    _initCalendar: function() {
        var self = this;

        self.calendar = new Calendar({
            isDateInfo: false,
            isDateIcon: false,
            triggerNode : '#J_CheckIn',
            finalTriggerNode: '#J_CheckOut',
            afterDays: item_config.maxCheckOut,
        });

        self.calendar._maxCheckoutDate = self.calendar.get('maxDate');

        return self;
    },

    /**
     * Tab模块初始化
     *
     * @method _initTab
     * @private
     */
    _initTab: function() {
        this.hotelTab = new HotelTab();
        return this;
    },

    /**
     * 回到顶部模块初始化
     *
     * @method _initGoTop
     * @private
     */
    _initGoTop: function() {
        new HotelGoTop();
        return this;
    },

    /**
     * Tab延时加载
     *
     * @method _initTabLazyLoad
     * @private
     */
    _initTabLazyLoad: function() {
        TABLAZYLOAD = S.all('.J_TablazyLoad');
        E.on(window, 'scroll resize', this._EVENT.tabLazyLoad, this);
    },

    /**
     * 更新处理
     *
     * @method _update
     * @param {Array} updates 更新函数数组
     * @param {Boolean} async   是否异步拉取数据
     * @private
     */
    _update: function(updates, async) {
        if(!async) {
            this._batchUpdate(updates);
        }
        else {
            this._asyncUpdate(updates);
        }
    },

    /**
     * 批量更新
     *
     * @method _batchUpdate
     * @param {Array} updates 更新函数数组
     * @private
     */
    _batchUpdate: function(updates) {
        if(!S.isArray(updates)) return;
        each(updates, function(update) {
           if(S.isFunction(this[update])) this[update]();
        }, this);
    },

    /**
     * 异步拉取数据更新
     *
     * @method _asyncUpdate
     * @param {Array} updates 更新函数数组
     * @param {Function} callback 请求成功回调函数
     * @private
     */
    _asyncUpdate: function(updates, callback) {
        var self = this;

        var url = HOST + '/ajax/item.htm';
        var checkin = CHECKIN.val();
        var checkout = CHECKOUT.val();

        S.io({
            url : url,
            data: {
                item_id: item_config.item_id,
                checkIn: Calendar.DATE.isDate(checkin) ? checkin : '',
                checkOut: Calendar.DATE.isDate(checkout) ? checkout : '',
                roomnum: ROOMNUM.val() || 1,
                useCache: item_config.useCache,
                rateid: RATEID.val(),
                sn: ++guid

            },
            dataType: 'jsonp',
            success: function (data) {

                self.data = S.clone(data);

                // 系统级错误处理
                // if(data.ERROR == 'SYSTEMERR') {
                //     that._cantBuy('抱歉，此宝贝已下架，请选择其他宝贝。<a href="'+ HOTELDATA.detail.hotel.uri +'">返回酒店列表</a>');
                //     return;
                // }

                // 如果流水号不一致，直接返回
                if(guid != data.sn) {
                    return;
                }

                // 批量更新数据
                self._batchUpdate(updates);

                // 验证接口数据
                // if(!that._apiValidation(HOTELDATA)) return;

                // 购买前校验
                if (callback) {
                    callback.call(self, data);
                }
            },
            error: function() {
                S.log('item api error');
            }
        });
    },

    /**
     * 更新价格
     *
     * @method _updatePrice
     * @private
     */
    _updatePrice: function() {
        var detail = HOTELDATA.detail;

        // 更新总价
        TOTALPRICE.html(this._formatPrice(detail.avgPrice));

        // 更新到店支付价格
        HOTELPAY.html(this._formatPrice(detail.totalShopPay));

        // 更新在线支付价格
        ONLINEPAY.html(this._formatPrice(detail.totalOnlinePay));
        // 聚划算商品更新价格
        if(!detail.cantBuy.code && !!detail.juhuasuan) {
           JUPRICE.html(this._formatPrice(detail.juhuasuan.price));
        }

        // 更新离店返现
        // todo
    },

    /**
     * 更新间夜数
     *
     * @method _updateNights
     * @private
     */
    _updateNights: function() {
        var self = this;

        var checkin = CHECKIN.val();
        var checkout = CHECKOUT.val();
        var nParent = TOTALNIGHT.parent();

        // 日期不合法，直接返回
        if(!Calendar.DATE.isDate(checkin) || !Calendar.DATE.isDate(checkout)) {
            return;
        }

        // 入住日期小于离店日期时，进行更新
        if(Calendar.DATE.parse(checkin) < Calendar.DATE.parse(checkout)) {
            TOTALNIGHT.html(Calendar.DATE.differ(checkin, checkout));
            nParent.show();
            return;
        };

        // 入住日期大于离店日期时，隐藏结构
        nParent.hide();
    },

    /**
     * 更新房间数
     *
     * @method _updateRoomNum
     * @private
     */
    _updateRoomNum: function() {
        var self = this;

        var data = self.data.detail;

        var minRoomNum = data.minAvailRoomNum;
        var maxRoomNum = data.maxAvailRoomNum;
        var curRoomNum = data.roomnum;
        var fragment = document.createDocumentFragment();

        for(var i = minRoomNum, opt = null; i <= maxRoomNum; i++) {
            opt = document.createElement('option');
            opt.innerHTML = i;
            if(i == curRoomNum) {
                opt.selected = 'selected';
            }
            fragment.appendChild(opt);
        }

        ROOMNUM.empty();
        ROOMNUM.getDOMNode().appendChild(fragment);
        ROOMNUM.attr('disabled', maxRoomNum < minRoomNum);

        if(maxRoomNum < minRoomNum) {
            ROOMSTATUS.addClass('hidden');
            return;
        }

        ROOMSTATUS.getDOMNode().className = 'room-' + (maxRoomNum > 5 ? 'many' : 'less');
        ROOMSTATUS.removeClass('hidden');
    },

    /**
     * 更新房型
     *
     * @method _updateRoomTypes
     * @private
     */
    _updateRoomTypes: function() {
        var self = this;

        var data = self.data.detail;

        HotelRoom.reRender(data);
    },

    /**
     * 更新价格政策
     *
     * @method _updatePricePolicy
     * @private
     */
    _updatePricePolicy: function() {
        var self = this;

        var data = self.data.detail;

        HotelPricePolicy.reRender(data);
    },

    /**
     * 更新Tab
     *
     * @method _updateTab
     * @private
     */
    _updateTab: function() {
        this.hotelTab.reset();
        this.hotelTab.fireClick(0);
        TABLAZYLOAD.removeClass('loaded');
    },

    /**
     * 静态数据校验
     *
     * @method _validation
     * @private
     * @return {Number} 错误码
     */
    _validation: function() {
        var sCheckin  = CHECKIN.val(),
            sCheckout = CHECKOUT.val(),
            iCheckin  = Calendar.DATE.isDate(sCheckin) && Calendar.DATE.parse(sCheckin),
            iCheckout = Calendar.DATE.isDate(sCheckout) && Calendar.DATE.parse(sCheckout),
            minDate   = Calendar.DATE.parse(this.calendar.get('minDate'));
            maxDate   = Calendar.DATE.parse(this.calendar.get('maxDate'));

            this._ERROR.hide();

            // 入住日期为空
            if(!sCheckin || sCheckin == CHECKIN.attr('placeholder')) {
                return 1;
            }
            // 入住日期格式不正确
            if(!Calendar.DATE.isDate(sCheckin)) {
                return 2;
            }
            // 入住日期小于今天
            if(iCheckin < minDate) {
                return 7;
            }
            // 入住日期大于90天
            if(iCheckin > maxDate) {
                return 8;
            }

            // 离店日期为空
            if(!sCheckout || sCheckout == CHECKOUT.attr('placeholder')) {
                return 3;
            }
            // 离店日期格式不正确
            if(!Calendar.DATE.isDate(sCheckout)) {
                return 2;
            }
            // 离店日期小于今天
            if(iCheckout < minDate) {
                return 7;
            }
            //预订时间超过28天
            if(Calendar.DATE.differ(sCheckin, sCheckout) > 28) {
                return 5;
            }
            // 离店日期大于90天
            if(iCheckout > maxDate) {
                return 8;
            }
            //离店日期小于入住日期
            if(Calendar.DATE.parse(sCheckout) <= Calendar.DATE.parse(sCheckin)) {
                return 4;
            }
    },

    /**
     * 接口返回数据检验
     *
     * @method _apiValidation
     * @param {Object} data 接口返回数据
     * @private
     * @return {Boolean} true/false
     */
    _apiValidation: function(data) {
        var detail      = data.detail,
            cantBuy     = detail.cantBuy,
            checkin     = detail.checkIn,
            checkOut    = detail.checkOut,
            maxInterval = detail.maxInterval;

        if(!cantBuy.code) {
            // 重置按钮状态
            this._BTNSTATUS['normal'].call(this);
            // 重置购买状态
            this._cantBuy(false);
            return !0;
        }

        switch(cantBuy.code) {
            case 1:
                TOTALPRICE.html('--');
                this._cantBuy(cantBuy.msg);
                break;
            case 2:
            case 3:
            case 7:
            case 8:
                this._cantBuy(false);
                this._ERROR.show(10, null, cantBuy.msg);
                this._BTNSTATUS['disabled'].call(this);
                break;
            case 4:
            case 5:
            case 6:
                this._cantBuy(cantBuy.msg);
                break;
        }

        return false;
    },

    /**
     * 购买状态处理
     *
     * @method _cantBuy
     * @param {String} msg 不能购买时的提示信息。为false时将状态置为正常
     */
    _cantBuy: function(msg) {
        ROOMNUM.attr('disabled', !!msg);
        CHECKIN.attr('disabled', !!msg);
        CHECKOUT.attr('disabled', !!msg);

        HOTELPAYAREA[!!msg ? 'addClass' : 'removeClass']('hidden');
        HOTELCANTBUY[!!msg ? 'removeClass' : 'addClass']('hidden');

        !!msg && HOTELCANTBUY.html(msg);
    },

    /**
     * 重置购买区域状态
     *
     * @method _resetBuyStatus
     * @param {Object} discount
     */
    _resetBuyStatus: function(discount) {
        // 恢复原价
        TOTALPRICE.removeClass('del');
        // 隐藏商品优惠结构
        PROMOTIONSWRAP.addClass('hidden');
        //重置返现
        CASHBACKPAY.addClass('hidden');
        // 隐藏店铺优惠结构
        SHOPPROMOTIONS.hide();
        // 更新原价格
        this._updatePrice();
        // 更新日历价格
        // this.calendar.set('discount', discount);
        // 更新一淘
        this._updateETao(discount.price);
    },

    /**
     * 用户登陆状态检测
     *
     * @method _checkUserLogin
     * @private
     */
    _checkUserLogin: function() {
        var that   = this,
            url    = HOST + '/remote/CheckLogin.do',
            jump   = !!this.jump;

        // 根据支付类型修改表单元素name值，跳转到新下单页
        (function(ver){
            HOTELGID.attr("name", ver ? "id" : "gid");
            ROOMNUM.attr("name", ver ? "roomnum" : "amount");
            BUYNOWVER.val(ver ? 2 : 1);
        })(HOTELDATA.detail.ver == 2);

        S.io.jsonp(url, function(data) {
            if(data.loginflag) {
                if(!jump) {
                    HOTELFORM.getDOMNode().submit();
                    return;
                }
                that.jump.show({
                    'gid'       : HOTELDATA.detail.item.id,
                    'checkin'   : CHECKIN.val(),
                    'checkout'  : CHECKOUT.val(),
                    'rooms'     : ROOMNUM.val(),
                    'price'     : that._itemPrice,
                    'name'      : that._getPromotionsName(),
                    'isquickbuy': HOTELISQUICKBUY.val(),
                    'city'      : HOTELCITY.val()
                });
                return;
            }

            // 迷你登录框埋点
            // HotelMonitor.single('tbtrip.8.5.9');

            var redirectUlr = HOST + (jump ? '/kaJump.htm?callback=itemTripTransfer&domain='+document.domain : HOTELFORM.attr('action') + '?searchBy=' + SEARCHBY.val() + '&' + S.io.serialize(HOTELFORM));

            that.login ? that.login.show({'redirectURL': redirectUlr}) : that.login = new HotelLogin({'redirectURL': redirectUlr, 'full_redirect': !jump});
        });
    },

    /**
     * 检测实价有房状态
     *
     * @method _checkRealPrice
     * @param {Boolen} b 实价有房状态，true/false
     * @private
     */
    _checkRealPrice: function(b) {
        var that = this;
        if(!REALPRICETAG || b) return !1;
        b || S.use('overlay', function(S, O) {
            // 去除实价有房标记
            REALPRICE.addClass('hidden');
            REALPRICETAG = !1;
            // 如果对象存在，直接显示
            if(that.realPriceDialog) {
                that.realPriceDialog.show();
                return;
            }

            // 对象不存在，实例化
            that.realPriceDialog = new O.Dialog({
                width        : 330,
                height       : 190,
                mask         : true,
                zIndex       : 9999999,
                prefixCls    : 'hotel-',
                align        : {points: ['cc', 'cc']},
                closeAction  : 'destroy',
                headerContent: '提示',
                bodyContent  : '<ul id="real-price-dialog">' +
                                   '<li>卖家已对此商品进行编辑，此商品已不是实价有房商品。</li>' +
                                   '<li id="J_RealPriceDelegate" class="center"><a class="continue" href="javascript:;">继续预订</a><a class="cancel" href="javascript:;">再看看</a></li>' +
                               '</ul>'
            });
            that.realPriceDialog.show();

            E.delegate('#J_RealPriceDelegate', 'click', 'a', function(e) {
                that.realPriceDialog.destroy();
                S.one(e.currentTarget).hasClass('continue') && that._checkUserLogin();
            });
        });
        return !0;
    },

    /**
     * 购买前校验
     *
     * @method _checkItemStatus
     * @private
     */
    _checkItemStatus: function() {
        this._asyncUpdate(null, function(data) {
            this._checkRealPrice(data.detail.it == 'T1') || this._checkUserLogin();
        });
    },

    /**
     * 格式化价格
     *
     * @method _formatPrice
     * @private
     */
    _formatPrice: function(price) {
        return price >= 0 ? (price / 100).toFixed(2) : '--';
    },

    /**
     * 日期变化处理函数
     *
     * @method _dateChange
     * @private
     */
    _dateChange: function() {
        this._update(['_updateNights' ,'_updateRoomNum', '_updateRoomTypes'], true);
    },

    /**
     * 购买按钮状态
     *
     * @name _BTNSTATUS
     * @type {Object}
     */
    _BTNSTATUS: {
        // 正常购买
        normal: function() {
            this._ERROR.hide();
            if(!HOTELDATA.detail.cantBuy.code) ROOMSTATUS.removeClass('hidden');
            BUYBTN.getDOMNode().className = 'buy-btn';
        },
        // 禁止购买
        disabled: function() {
            ROOMSTATUS.addClass('hidden');
            BUYBTN.getDOMNode().className = 'buy-btn-disabled';
        }
    },

    /**
     * 错误提示处理
     *
     * @name _ERROR
     * @type {Object}
     * @private
     */
    _ERROR: {
        msg: [
            '请选择入住日期',
            '请选择离店日期',
            '请填写正确的日期，例如：' + item_config.today,
            '离店日期必须晚于入住日期，请重新选择日期',
            '酒店预订时间不能超过28天，请重新选择日期',
            '您选择的时间段内没有房间，请重新选择日期',
            '你输入的日期已过期，请重新选择日期',
            '只能预订今天起90天内的酒店，请重新选择日期',
            '房间数量发生变化，请关注是否满足您的入住需求'
        ],
        /**
         * 显示错误信息
         *
         * @name _ERROR#show
         * @param {Number} idx 错误索引
         * @param {Node}   el  提示容器
         * @param {String} msg 指定显示的错误信息
         * @private
         */
        show: function(idx, el, msg) {
            var sTips = '',
                el    = el || ERRORMSG;
            if(!idx) return;
            switch(idx) {
                // 入住日期为空
                case 1:
                    CHECKIN.getDOMNode().focus();
                    break;
                // 日期格式错误
                case 2:
                    sTips = this.msg[2];
                    break;
                // 离店日期为空
                case 3:
                    CHECKOUT.getDOMNode().focus();
                    break;
                // 入住日期小于离店日期
                case 4:
                    sTips = this.msg[3];
                    break;
                // 预订时间超过28天
                case 5:
                    sTips = this.msg[4];
                    break;
                // 无房
                case 6:
                    sTips = this.msg[5];
                    break;
                // 日期小于今天
                case 7:
                    sTips = this.msg[6];
                    break;
                // 日期大于90天
                case 8:
                    sTips = this.msg[7];
                    break;
                // 可订房间数发生变化
                case 9:
                    sTips = this.msg[8];
                    break;
                // 接口返回的错误提示
                case 10:
                    sTips = msg;
                    break;
            }
            sTips && el.html(sTips).parent().removeClass('hidden');
        },
        /**
         * 隐藏错误信息
         *
         * @name _ERROR#hide
         * @private
         */
        hide: function(el) {
            el = el || ERRORMSG;
            el.parent().addClass('hidden');
        }
    },

    /**
     * 事件函数集
     *
     * @name _EVENT
     * @type {Object}
     * @private
     */
    _EVENT: {
        /**
         * 购买事件函数
         *
         * @method _EVENT#login
         * @param {Event} e 事件对象
         * @private
         */
        buy: function(e) {
            e.halt();
            if(S.one(e.currentTarget).hasClass('buy-btn-disabled')) return;

            var error = this._validation();

            if(error || this._ERROR.index) {
                this._ERROR.show(error);
                this._BTNSTATUS['disabled'].call(this);
                return;
            }

            this._checkItemStatus();
        },

        /**
         * 评价Tab激活
         *
         * @method fireReview
         * @param {e} e 事件对象
         * @private
         */
        fireReview: function() {
            this.hotelTab.fireClick(2);
            location = '#J_HotelTab';
        },

        /**
         * 支付类型对应的提示信息显示/隐藏
         *
         * @method _EVENT#tipToggle
         * @param {Event} e 事件对象
         * @private
         */
        tipToggle: function(e) {
            var oTarget = S.one(e.currentTarget),
                aTips   = [
                          '',
                          '房费通过支付宝全额支付。',
                          '手续费通过支付宝支付，房费到酒店前台支付。',
                          '订金通过支付宝支付，房费到酒店前台支付。',
                          '手续费通过支付宝支付，房费到酒店前台支付。',
                          '房费到酒店前台全额支付。'];
            clearTimeout(this.tipMouseTimer);
            switch(e.type) {
                case 'mouseenter':
                    PAYTIP.removeClass('hidden')
                        .css('left', 0)
                        .html('<i></i>'+ aTips[oTarget.attr('data-type')])
                        .css('left', oTarget.offset().left - PAYTIP.offset().left - parseInt(PAYTIP.width()) / 2 + parseInt(oTarget.width()) / 2);
                    break;
                case 'mouseleave':
                    this.tipMouseTimer = setTimeout(function() {
                        PAYTIP.addClass('hidden');
                    }, 100);
                    break;
            }
        },

        /**
         * 日历点击事件函数
         *
         * @method _EVENT#calClick
         * @param {Event} e 日期事件对象
         * @private
         */
        calClick: function(e) {
            var self = this;

            self._update(['_updateNights', '_updateRoomNum', '_updateRoomTypes'], true);

            return;

            var oCheckin  = this.calendar.currentNode.getDOMNode(),
                errorIdx  = 0;

            // 清空日历入住/离住缓存
            this.calendar._checkIn = this.calendar._checkOut = null;

            //标识日期由用户输入
            ISDEFAULTDATE.val(1);


            if(errorIdx = this._validation()) {
                this._ERROR.show(errorIdx);
                this._BTNSTATUS['disabled'].call(this);
                return;
            }

            // 选择入住/离店时间埋点，只有检验通过的时候再会记录
            // HotelMonitor.single(oCheckin.id == 'J_CheckIn' ? 'tbtrip.8.5.2' : 'tbtrip.8.5.3');
        },

        /**
         * 日历显示事件函数
         *
         * @method _EVENT#calShow
         * @private
         */
        calShow: function(e) {
            switch(e.node.attr('id')) {
                case 'J_CheckIn':
                    this.set('minDate', item_config.today);
                    this.set('afterDays', item_config.maxCheckOut);
                    this.render();
                break;
                case 'J_CheckOut':
                    this.set('minDate', this.get('startDate') || item_config.today);
                    this.set('afterDays', Math.min(item_config.maxInterval, Calendar.DATE.differ(this.get('minDate'), this._maxCheckoutDate) + 1));
                    this.render();
                break;
            }
        },

        /**
         * 房间数切换
         *
         * @method  _EVENT#roomNumChange
         * @private
         */
        roomNumChange: function() {
            this._update(['_updateRoomTypes', '_updatePricePolicy'], true);
        },

        /**
         * Tab延时加载处理函数
         *
         * @method _EVENT#tabLazyLoad
         * @private
         */
        tabLazyLoad: function() {
            var scrollTop  = D.scrollTop(),
                viewHeight = D.viewportHeight() + scrollTop;

            for(var i = iT = iB = 0, el = null, len = TABLAZYLOAD.length; i < len; i++) {
                el = TABLAZYLOAD.item(i);
                if(!el.hasClass('loaded')) {
                    iT = el.offset().top;
                    iB = iT + parseInt(el.height());
                    if((iT > scrollTop && top < viewHeight) || (iB > scrollTop && iB < viewHeight)) {
                        this.hotelTab[el.attr('data-value')]();
                        el.addClass('loaded');
                    }
                }
            }
        },

        /**
         * 点击日历输入框自动滚动到标题位置
         *
         * @method _EVENT#scroll
         * @private
         */
        scroll: function() {
            if(WIN.scrollTop() + 5 >= parseInt(ITEMNAME.offset().top)) return;

            Anim(WIN, {
                scrollTop: parseInt(ITEMNAME.offset().top)
            }, 0.3).run();
        },

        /**
         * SNS
         *
         * @method _EVENT#sns
         * @private
         */
        sns: function() {
            var config = {
                    key: item_config.item_id,
                    title: item_config.title,
                    pic: '',
                    linkUrl: 'http://kezhan.trip.taobao.com/item.htm?item_id=' + item_config.item_id,
                    type: 'item',
                    element: '#J_HotelBtShare',
                    client_id: '002',
                    ui: {
                        width: 900,
                        height: 500,
                        isIframe: false
                    },
                    callback : {
                        shareCallback: {
                            success: function() {
                                var share = HOTELSHARE.one('.J_HotelShareCount'),
                                    count = /\((\d+)\)/.test(share.html()) ? RegExp.$1 : 0;
                                share.html('('+ (++count) +')');
                            }
                        }
                    }
                };

            S.getScript('http://a.tbcdn.cn/p/snsdk/core.js', {
                success: function() {
                    typeof SNS == 'object' && SNS.ui('btshare', config);
                }
            });
        }
    }
});

return S.HotelItem = HotelItem;

}, {requires:['anim', 'node', './head', './report', 'gallery/calendar/1.2/', './hotel-login', './hotel-tab', './hotel-gotop', './hotel-fav', './switch', './imgview', './hotel-room', './hotel-price-policy']});
