/*
combined files : 

hotel-item/mods/hotel-map

*/
/**
 * 酒店地图
 * Author: Angtian
 * E-mail: Angtian.fgm@taobao.com
 */

KISSY.add('hotel-item/mods/hotel-map', function(S) {

function HotelMap() {
    this._init.apply(this, arguments);
};

S.augment(HotelMap, {
    _init: function(cfg) {
        if(!KISSY.isObject(cfg)) return;
        var lat  = cfg.lat,
            lng  = cfg.lng,
            name = cfg.name;
            S.getScript('http://api.ditu.aliyun.com/map.js', {
                success: function() {
                    if(lat != 0 && lng != 0) {
                        var oMap               = new AliMap('J_HotelMap'),
                            oCenter            = new AliLatLng(lat, lng),
                            oIcon              = new AliIcon('http://img03.taobaocdn.com/tps/i3/T1kQCfXlRvXXXXXXXX-25-40.png', {x: 25, y: 40}, {x: 0, y: 0}),
                            oMarker            = new AliMarker(oCenter, {title: name, icon: oIcon, offset: {x: -12, y: -40}}),
                            oMouseWheelControl = new AliMapMouseWheelControl();

                            oMap.centerAndZoom(oCenter, 16);
                            oMap.addControl(oMouseWheelControl);
                            oMap.addOverlay(oMarker);
                        return this;
                    }
                    S.one('#J_HotelMap').hide();
                }
            });
    }
});

return S.HotelMap = HotelMap;

});
