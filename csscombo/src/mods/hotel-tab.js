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
