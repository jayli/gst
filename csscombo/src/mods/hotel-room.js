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