/*
combined files : 

src/config

*/
;(function (S){

    if (S.Config.debug) {
        S.config({
            packages:[
                {
                    name: 'hotel-item',
                    path: '../../',
                    charset: 'utf-8',
                    ignorePackageNameInUri: true,
                    debug: true
                },
                {
                    name: 'wangpu',
                    path: 'http://a.tbcdn.cn' + ['/p/shop/3.0/', '/apps/taesite/platinum/scripts/'][g_config['h_wangpu2012'] * 1],
                    charset: 'utf-8'
                }
            ]
        });
    } else {
        S.config({
            packages: [
                {
                    name: 'hotel-item',
                    path: 'http://'+ item_config.server +'/trip/hotel-item/0.1.0',
                    ignorePackageNameInUri: true
                },
                {
                    name: 'wangpu',
                    path: 'http://a.tbcdn.cn' + ['/p/shop/3.0/', '/apps/taesite/platinum/scripts/'][g_config['h_wangpu2012'] * 1],
                    charset: 'utf-8'
                }
            ]
        });
    }

    S.ready(function() {
        S.use('wangpu/init', function(S, Wangpu) {
           Wangpu.init({
               'assetsHost'    : 'http://a.tbcdn.cn',
               'pageType'      : 'cdetail',
               'lazyContainers': 'body',
               'isvParams'     : {}
           });
        });
    });
})(KISSY);
