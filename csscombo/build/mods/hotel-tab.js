/*
combined files : 

hotel-item/mods/hotel-tab-item
hotel-item/mods/hotel-page
hotel-item/mods/hotel-tab-record
hotel-item/mods/hotel-tab

*/
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

