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