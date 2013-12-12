/*
combined files : 

hotel-item/mods/hotel-fav

*/
/**
 * 收藏模块
 * Author: Angtian
 * E-mail: Angtian.fgm@taobao.com
 */
KISSY.add('hotel-item/mods/hotel-fav', function(S, O) {
    var $    = S.all,
        B    = $('body'),
        tmpl = '<a class="close-btn" href="javascript:;">X</a>' +
               '<iframe id="hotel-fav-iframe" src="about:blank" frameborder="0" scrolling="no"></iframe>' +
               '<div class="hotel-fav-bg"></div>';

    function HotelFav() {
        var container = $('<div id="popupPanel">');

        B.append(container);

        var dialog = new O.Dialog({
            srcNode  : container,
            prefixCls: 'hotel-fav-',
            closable : false,
            zIndex   : 999999,
            bodyContent: tmpl,
            align    : {
                points: ['cc', 'cc']
            }
        });

        dialog.render();


        var favIframe = container.one('#hotel-fav-iframe');

        B.delegate('click', '.J_HotelFavTrigger', function(e) {
            e.preventDefault();

            var target = $(e.currentTarget),
                url    = target.attr('href'),
                width  = target.attr('data-width'),
                height = target.attr('data-height');

            dialog.set('width', width);
            dialog.set('height', height);

            if(favIframe.attr('src') != url) {
                favIframe.attr({
                    src   : url,
                    width : width,
                    height: height
                });
            }

            dialog.show();
        });

        container.delegate('click', '.close-btn', function(e) {
            dialog.hide();
        });

        // 解决ie8以下，收藏层无法根据内容自动调整宽高。待主站收藏代码升级后可去除
        S.UA.ie < 8 && dialog.on('show', function() {
            this.__timer && this.__timer.cancel();
            this.__timer = S.later(function() {
                var width  = parseInt(container.css('width')),
                    height = parseInt(container.css('height'));

                favIframe.width() != width && favIframe.attr('width', width);
                favIframe.height() != height && favIframe.attr('height', height);
            }, 1000, true);
        });
    }
    return S.HotelFav = HotelFav;
}, {requires: ['overlay']});
