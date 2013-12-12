/**
 * @fileOverview 酒店详情页入口文件
 */
KISSY.add('hotel-item/mods/index', function (S, HotelItem) {
    return {
        init: function() {
            new HotelItem();
        }
    };
}, {requires:['./hotel-item']})