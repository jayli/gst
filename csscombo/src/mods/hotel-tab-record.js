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