/*
combined files : 

hotel-item/mods/hotel-gotop

*/
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
