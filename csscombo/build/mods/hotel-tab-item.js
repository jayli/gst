/*
combined files : 

hotel-item/mods/hotel-tab-item

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

