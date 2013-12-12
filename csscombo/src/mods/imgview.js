/**
 * @fileoverview 宝贝图片模块，包含大图浏览
 * @author baxian@taobao.com
 */
KISSY.add('hotel-item/mods/imgview', function(S,ImageZoom){
    var boothEl, thumbEl, triggers, zoom, imagezoom, cache,
        timer, DELAY = 100,
        DOM = S.DOM,
        Event = S.Event,
        docBody = document.body,
        EMPTY= '',
        SELECTED = 'tb-selected', HIDDEN = 'hidden';

    return {

        /**
         * @public
         */
        init: function() {
            var self = this;
            if (!(boothEl = DOM.get('#J_ImgBooth'))
                || !(thumbEl = DOM.get('#J_UlThumb'))) return;

            triggers = DOM.query('li', thumbEl);
            zoom = DOM.get('J_zoomIcon');
            self._bindEvents();

            S.ready(function() {
                if (S.UA.ie === 6) self._resizeHead();
                self._preloadImgs();
            });
            //Event.on(window,"resize",this.refreshimageZoom)
        },

        /**
         * 重新设置ImageZoom位置
         */
        refreshimageZoom: function() {
            imagezoom&&imagezoom.refreshRegion();
        },

        /**
         * 初始化载入
         * @private
         */
        _resizeHead: function() {
            // B2C
            var el,de;
            if ( (el = DOM.get('div.shop-banner','#hd'))
                && el.scrollHeight > 150 ) {
                el.style.height = '150px';
                if(de=document.getElementById('detail')){
                    de.style.zoom=1;
                }
            }

            // C2C
            if ( (el = S.get('#hd')) && el.scrollHeight > 250 ) {
                DOM.css(el, {
                    height: '250px',
                    overflow: 'hidden'
                });
            }
        },

        /**
         * 预载入原始图片
         *
         * @method loadImages
         */
        loadImages: function() {
            this._preloadImgs();
        },

        /**
         * 预载入原始图片
         * @private
         */
        _preloadImgs: function() {
            if(!cache) {
                cache = DOM.create('<div style="width:0;height:0;overflow:hidden;">');
                docBody.appendChild(cache);
            }
            //var cache = DOM.create('<div style="width:0;height:0;overflow:hidden;">'),
            var limit = parseInt(boothEl.getAttribute('data-hasZoom'), 10),
            self  = this;
            cache.innerHTML = '';
            //docBody.appendChild(cache);
            S.each(DOM.query('img', thumbEl), function(thumb) {
                var img = new Image();
                img.src = thumb.src.replace(/_40x40\.(jpg|png|gif)$/, '');
                cache.appendChild(img);
                if (img.complete) {
                    __loaded(img, thumb);
                }else {
                    Event.on(img, 'load', function() {
                        __loaded(img, thumb);
                    });
                }
            });

            function __loaded(img, thumb) {

                if (img.width >= limit) {
                    thumb.setAttribute('data-hasZoom', '1');
                    thumb.setAttribute('data-bigimgwidth',img.width);
                    thumb.setAttribute('data-bigimgheight',img.height);
                    if (DOM.hasClass(DOM.parent(thumb, 'li'), SELECTED)) {
                        // 延时生成imagezoom，防止错位
                        S.later(function() {
                            self._newImageZoom(img.width,img.height);
                            imagezoom.set('bigImageSrc', img.src);
                        }, 100);
                    }
                }
            }
        },

        /**
         * 绑定事件
         * @private
         */
        _bindEvents: function() {
            var self = this, target;

            Event.on(thumbEl, 'click', function(e) {
                e.preventDefault();
            });
            // Event.on(triggers, 'mouseenter', function(e) {
            //     timer && timer.cancel();
            //     timer = S.later(function() {
            //         self._switchTo(e.target);
            //     }, DELAY);
            // });
            // Event.on(triggers, 'mouseleave', function() {
            //     if(timer){
            //         timer.cancel();
            //     }
            // });
            /** 重写事件绑定 by angtian---------------------------------- {{{ */
            Event.delegate(thumbEl, 'mouseenter mouseleave', 'li', function(e) {
                switch(e.type) {
                    case 'mouseenter':
                        timer && timer.cancel();
                        timer = S.later(function() {
                            self._switchTo(e.target);
                        }, DELAY);
                        break;
                    case 'mouseleave':
                        timer && timer.cancel();
                        break;
                }
            });
            /** end------------------------------------------------------ }}} */
        },

        /**
         * 切换到指定图片
         * @private
         */
        _switchTo: function(o) {
            if (!o) return;

            //新版统计埋点
            //T.sendClick(null, '8.0.0');

            if (o.tagName !== 'LI'){
                o = DOM.parent(o, 'LI');
            }
            var self = this,
            img = o.getElementsByTagName('img')[0],
            hasZoom = img.getAttribute('data-hasZoom') === '1',
            bWidth = img.getAttribute('data-bigimgwidth'),
            bHeight = img.getAttribute('data-bigimgheight'),
            src_310 = img.src.replace('40x40', '310x310'),
            src_big = src_310.replace('_310x310.jpg', EMPTY);
            // DOM.removeClass(triggers, SELECTED);
            // DOM.addClass(o, SELECTED);
            /** 重写替换className by angtian--------------------- {{{ */
            S.one(o).addClass(SELECTED).siblings().removeClass(SELECTED);
            /** end---------------------------------------------- }}} */
            if(imagezoom){
                imagezoom.set('imageSrc',src_310);
            }else{
                boothEl.src = src_310;
            }
            DOM[hasZoom ? 'removeClass' : 'addClass'](zoom, HIDDEN);

            if (!imagezoom) {
                self._newImageZoom(bWidth,bHeight);
            }
            if (imagezoom) {
                imagezoom.set('hasZoom', hasZoom);
                imagezoom.set('bigImageWidth',bWidth);
                imagezoom.set('bigImageHeight',bHeight);
                imagezoom.set('bigImageSrc', src_big);
            }
        },

        /**
         * 初始化 imagezoom 实例
         * @private
         */
        _newImageZoom: function(bigWidth,bigHeight) {
            imagezoom = new ImageZoom({
                imageNode : boothEl,
                align:  {
                    node : S.one(boothEl).parent('.tb-booth'),
                    points : ['tr','tl'],
                    offset : [10,-1]
                },
                preload:  false,
                width : 310,
                height : 310,
                bigImageWidth : bigWidth || 700,
                bigImageHeight : bigHeight || 700
            });
        },

        /**
         * 显示指定图片路径
         * @public
         */
        show: function(src) {
            if (!boothEl || !thumbEl) return;
            DOM.removeClass(triggers, SELECTED);
            boothEl.src = src;

            // 属性图片没有放大镜功能
            imagezoom && imagezoom.set('hasZoom', false);
        }
    };
},{requires:['imagezoom']});