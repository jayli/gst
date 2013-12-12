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