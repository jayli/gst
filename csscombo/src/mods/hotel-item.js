/**
 * 酒店宝贝详情模块
 * Author: Angtian
 * E-mail: Angtian.fgm@taobao.com
 */
KISSY.add('hotel-item/mods/hotel-item', function (S, Anim, Node, Head, Report, Calendar, HotelLogin, HotelTab, HotelGoTop, HotelFav, Switch, Imgview, HotelRoom, HotelPricePolicy) {
/**
 * 酒店宝贝详情模块
 *
 * @module hotel-item
 */
var $      = S.all,
    D      = S.DOM,
    E      = S.Event,
    IE     = S.UA.ie,
    each   = S.each,
    toHTML = S.substitute;

var HOST = 'http://' + (location.href.indexOf('taobao.com') != -1 ? 'kezhan.trip.taobao.com' : 'kezhan.trip.daily.taobao.net');

var WIN              = S.one(window),                //window
    DOC              = S.one(document),              //document
    BODY             = S.one('body'),                //body
    HOTELFORM        = S.one('#J_HotelForm'),        //酒店表单节点
    EDITLINK         = S.one('#J_TEditItem a'),      //编辑宝贝链接
    REPORTLINK       = S.one('#J_isuit'),            //举报商品链接
    HOTELSHARE       = S.one('#J_HotelShareBtn'),    //分享宝贝
    HOTELFAV         = S.one('#J_HotelFav'),         //收藏宝贝
    HOTELFAVSHOP     = S.one('#J_HotelFavShop'),     //收藏店铺
    HOTELSHARESHOP   = S.one('#J_HotelShareShop'),   //分享店铺
    ISDEFAULTDATE    = S.one('#J_DefaultDateFlag'),  //用户是否输入日期
    HOTELGID         = S.one('#J_HotelGid'),         //提交表单元素gid
    BUYNOWVER        = S.one('#J_BuyNowVer'),        //跳转下表单表识，2转到新下单页，1转到老下单页
    CHECKIN          = S.one('#J_CheckIn'),          //入住日期节点
    CHECKOUT         = S.one('#J_CheckOut'),         //离店日期节点
    BUYBTN           = S.one('#J_BuyBtn'),           //立即购买按钮
    ROOMNUM          = S.one('#J_RoomNum'),          //房间数节点
    ROOMSTATUS       = S.one('#J_RoomStatus'),       //房间数状态图标
    TOTALNIGHT       = S.one('#J_TotalNight'),       //房间数容器
    ERRORMSG         = S.one('#J_ErrorMsg'),         //错误消息容器
    WARNINGMSG       = S.one('#J_WarningMsg'),       //警告类提示
    BIGIMG           = S.one('#J_ImgBooth'),         //商品大图
    IMGLIST          = S.one('#J_UlThumb'),          //商品小图列表
    CHANGETIPS       = S.one('#J_ChangeTips'),       //切换商品提示信息
    ROOM             = S.one('#J_Room'),             //房型节点
    PAY              = S.one('#J_Pay'),              //支付类型父节点
    PAYTYPE          = S.one('#J_PayType'),          //支付类型隐藏域
    PAYTIP           = S.one('#J_PayTip'),           //支付类型说明
    ITEMNAME         = S.one('#J_HotelTitle'),       //宝贝名称节点
    TOTALPRICE       = S.all('.J_TotalPrice'),       //商品总价节点
    ONLINEPAY        = S.one('#J_OnlinePay'),        //在线支付节点
    HOTELPAY         = S.one('#J_HotelPay'),         //到店支付节点
    CASHBACKPAY      = S.one('#J_CashbackPay'),      //离店返现节点
    CASHBACKNUM      = S.one('#J_CashbackNum'),      //离店返现金额节点
    REALPRICE        = S.one('#J_RealPrice'),        //实价有房节点
    PREPAYTIPS       = S.one('#J_PrePayTips'),       //全额支付提示节点

    SALESCOUNT       = S.one('#J_MonthSalesCount'),  //月销量节点
    REVIEWCOUNT      = S.all('.J_ReviewCount'),      //评价数节点
    RECORDCOUNT      = S.one('#J_RecordCount'),      //成交记录数节点
    TABLAZYLOAD      = null,                         //Tab懒加载节点

    PROMOTIONSWRAP   = S.one('#J_PromotionsWrap'),   //商品优惠你父容器
    ITEMPROMOTIONS   = S.one('#J_ItemPromotions'),   //商品优惠节点
    SHOPPROMOTIONS   = S.one('#J_PromotionsShop'),   //商品优惠你父容器
    HOTELPROMOTIONS  = S.one('#J_PromotionsHotel'),  //商品优惠父容器

    HOTELPAYAREA     = S.one('#J_HotelPayArea'),     //购买区域容器
    HOTELCANTBUY     = S.one('#J_HotelCantBuy'),     //不能购买外容器

    JUHUASUAN        = S.one('#J_Juhuasuan'),        //聚划算优惠容器
    JUPRICE          = JUHUASUAN.one('.ju-price'),   //聚划算价格
    JUKEY            = S.one('#J_JuKey'),            //聚划算key

    ETAO             = S.one('#J_ETao'),             //一淘容器
    ETAOJF           = S.one('#J_EtaoJF'),           //一淘集分

    SEARCHBY         = S.one('#J_SearchBy'),         //渠道流量监控
    PROMOTION_NIGHTS = null,                         //优惠间夜数提醒

    HOTELISQUICKBUY  = S.one('#J_HotelIsQuickbuy'),  //是否快速购
    HOTELCITY        = S.one('#J_HotelCity'),        //酒店城市

    RATEID           = S.one('#J_RateId')
    ;

var guid = 0;

/**
  * 宝贝详情构造函数
  *
  * @class  HotelItem
  * @constructor
  */
function HotelItem() {
    this._init();
};

S.augment(HotelItem, E.Target, {

    /**
     * 模块初始化
     *
     * @method _init
     * @private
     */
    _init: function() {
        var self = this;

        self.data = S.clone(window['_hotel_data'] || {});

        self._initHotelRoom();
        self._initPricePolicy();

        self._initCalendar();
        self._initGoTop();
        self._bindUI();

        Imgview.init();

        self._update(['_updateNights']);

        // 依赖domready的方法后调用
        S.ready(function() {
            Head.init();
            Report.init();

            self._initTab();
            self._initTabLazyLoad();
            Switch.init();
            HotelFav();
        });
    },

    /**
     * 事件绑定
     *
     * @method _bindUI
     * @private
     */
    _bindUI: function() {

        this.calendar.on('dateclick', this._EVENT.calClick, this);
        this.calendar.on('show', this._EVENT.calShow);

        E.delegate(HOTELFORM, 'click', '#J_BuyBtn', this._EVENT.buy, this);

        E.delegate(HOTELFORM, 'click', '#J_ReviewTabTrigger', this._EVENT.fireReview, this);

        E.delegate(HOTELFORM, 'change', '#J_RoomNum', this._EVENT.roomNumChange, this);

        E.delegate(HOTELFORM, 'click', '.ipt-date', this._EVENT.scroll, this);

        E.delegate(DOC, 'click', '#J_HotelShareBtn', this._EVENT.sns);

        E.delegate(DOC, 'mouseenter mouseleave', '.J_Hover', function(e) {
            S.one(e.currentTarget).toggleClass('hover');
        });

        return this;
    },

    _initHotelRoom: function() {
        HotelRoom.init();
    },

    _initPricePolicy: function() {
        HotelPricePolicy.init();
    },

    /**
     * 日历模块初始化
     *
     * @method _initCalendar
     * @private
     */
    _initCalendar: function() {
        var self = this;

        self.calendar = new Calendar({
            isDateInfo: false,
            isDateIcon: false,
            triggerNode : '#J_CheckIn',
            finalTriggerNode: '#J_CheckOut',
            afterDays: item_config.maxCheckOut,
        });

        self.calendar._maxCheckoutDate = self.calendar.get('maxDate');

        return self;
    },

    /**
     * Tab模块初始化
     *
     * @method _initTab
     * @private
     */
    _initTab: function() {
        this.hotelTab = new HotelTab();
        return this;
    },

    /**
     * 回到顶部模块初始化
     *
     * @method _initGoTop
     * @private
     */
    _initGoTop: function() {
        new HotelGoTop();
        return this;
    },

    /**
     * Tab延时加载
     *
     * @method _initTabLazyLoad
     * @private
     */
    _initTabLazyLoad: function() {
        TABLAZYLOAD = S.all('.J_TablazyLoad');
        E.on(window, 'scroll resize', this._EVENT.tabLazyLoad, this);
    },

    /**
     * 更新处理
     *
     * @method _update
     * @param {Array} updates 更新函数数组
     * @param {Boolean} async   是否异步拉取数据
     * @private
     */
    _update: function(updates, async) {
        if(!async) {
            this._batchUpdate(updates);
        }
        else {
            this._asyncUpdate(updates);
        }
    },

    /**
     * 批量更新
     *
     * @method _batchUpdate
     * @param {Array} updates 更新函数数组
     * @private
     */
    _batchUpdate: function(updates) {
        if(!S.isArray(updates)) return;
        each(updates, function(update) {
           if(S.isFunction(this[update])) this[update]();
        }, this);
    },

    /**
     * 异步拉取数据更新
     *
     * @method _asyncUpdate
     * @param {Array} updates 更新函数数组
     * @param {Function} callback 请求成功回调函数
     * @private
     */
    _asyncUpdate: function(updates, callback) {
        var self = this;

        var url = HOST + '/ajax/item.htm';
        var checkin = CHECKIN.val();
        var checkout = CHECKOUT.val();

        S.io({
            url : url,
            data: {
                item_id: item_config.item_id,
                checkIn: Calendar.DATE.isDate(checkin) ? checkin : '',
                checkOut: Calendar.DATE.isDate(checkout) ? checkout : '',
                roomnum: ROOMNUM.val() || 1,
                useCache: item_config.useCache,
                rateid: RATEID.val(),
                sn: ++guid

            },
            dataType: 'jsonp',
            success: function (data) {

                self.data = S.clone(data);

                // 系统级错误处理
                // if(data.ERROR == 'SYSTEMERR') {
                //     that._cantBuy('抱歉，此宝贝已下架，请选择其他宝贝。<a href="'+ HOTELDATA.detail.hotel.uri +'">返回酒店列表</a>');
                //     return;
                // }

                // 如果流水号不一致，直接返回
                if(guid != data.sn) {
                    return;
                }

                // 批量更新数据
                self._batchUpdate(updates);

                // 验证接口数据
                // if(!that._apiValidation(HOTELDATA)) return;

                // 购买前校验
                if (callback) {
                    callback.call(self, data);
                }
            },
            error: function() {
                S.log('item api error');
            }
        });
    },

    /**
     * 更新价格
     *
     * @method _updatePrice
     * @private
     */
    _updatePrice: function() {
        var detail = HOTELDATA.detail;

        // 更新总价
        TOTALPRICE.html(this._formatPrice(detail.avgPrice));

        // 更新到店支付价格
        HOTELPAY.html(this._formatPrice(detail.totalShopPay));

        // 更新在线支付价格
        ONLINEPAY.html(this._formatPrice(detail.totalOnlinePay));
        // 聚划算商品更新价格
        if(!detail.cantBuy.code && !!detail.juhuasuan) {
           JUPRICE.html(this._formatPrice(detail.juhuasuan.price));
        }

        // 更新离店返现
        // todo
    },

    /**
     * 更新间夜数
     *
     * @method _updateNights
     * @private
     */
    _updateNights: function() {
        var self = this;

        var checkin = CHECKIN.val();
        var checkout = CHECKOUT.val();
        var nParent = TOTALNIGHT.parent();

        // 日期不合法，直接返回
        if(!Calendar.DATE.isDate(checkin) || !Calendar.DATE.isDate(checkout)) {
            return;
        }

        // 入住日期小于离店日期时，进行更新
        if(Calendar.DATE.parse(checkin) < Calendar.DATE.parse(checkout)) {
            TOTALNIGHT.html(Calendar.DATE.differ(checkin, checkout));
            nParent.show();
            return;
        };

        // 入住日期大于离店日期时，隐藏结构
        nParent.hide();
    },

    /**
     * 更新房间数
     *
     * @method _updateRoomNum
     * @private
     */
    _updateRoomNum: function() {
        var self = this;

        var data = self.data.detail;

        var minRoomNum = data.minAvailRoomNum;
        var maxRoomNum = data.maxAvailRoomNum;
        var curRoomNum = data.roomnum;
        var fragment = document.createDocumentFragment();

        for(var i = minRoomNum, opt = null; i <= maxRoomNum; i++) {
            opt = document.createElement('option');
            opt.innerHTML = i;
            if(i == curRoomNum) {
                opt.selected = 'selected';
            }
            fragment.appendChild(opt);
        }

        ROOMNUM.empty();
        ROOMNUM.getDOMNode().appendChild(fragment);
        ROOMNUM.attr('disabled', maxRoomNum < minRoomNum);

        if(maxRoomNum < minRoomNum) {
            ROOMSTATUS.addClass('hidden');
            return;
        }

        ROOMSTATUS.getDOMNode().className = 'room-' + (maxRoomNum > 5 ? 'many' : 'less');
        ROOMSTATUS.removeClass('hidden');
    },

    /**
     * 更新房型
     *
     * @method _updateRoomTypes
     * @private
     */
    _updateRoomTypes: function() {
        var self = this;

        var data = self.data.detail;

        HotelRoom.reRender(data);
    },

    /**
     * 更新价格政策
     *
     * @method _updatePricePolicy
     * @private
     */
    _updatePricePolicy: function() {
        var self = this;

        var data = self.data.detail;

        HotelPricePolicy.reRender(data);
    },

    /**
     * 更新Tab
     *
     * @method _updateTab
     * @private
     */
    _updateTab: function() {
        this.hotelTab.reset();
        this.hotelTab.fireClick(0);
        TABLAZYLOAD.removeClass('loaded');
    },

    /**
     * 静态数据校验
     *
     * @method _validation
     * @private
     * @return {Number} 错误码
     */
    _validation: function() {
        var sCheckin  = CHECKIN.val(),
            sCheckout = CHECKOUT.val(),
            iCheckin  = Calendar.DATE.isDate(sCheckin) && Calendar.DATE.parse(sCheckin),
            iCheckout = Calendar.DATE.isDate(sCheckout) && Calendar.DATE.parse(sCheckout),
            minDate   = Calendar.DATE.parse(this.calendar.get('minDate'));
            maxDate   = Calendar.DATE.parse(this.calendar.get('maxDate'));

            this._ERROR.hide();

            // 入住日期为空
            if(!sCheckin || sCheckin == CHECKIN.attr('placeholder')) {
                return 1;
            }
            // 入住日期格式不正确
            if(!Calendar.DATE.isDate(sCheckin)) {
                return 2;
            }
            // 入住日期小于今天
            if(iCheckin < minDate) {
                return 7;
            }
            // 入住日期大于90天
            if(iCheckin > maxDate) {
                return 8;
            }

            // 离店日期为空
            if(!sCheckout || sCheckout == CHECKOUT.attr('placeholder')) {
                return 3;
            }
            // 离店日期格式不正确
            if(!Calendar.DATE.isDate(sCheckout)) {
                return 2;
            }
            // 离店日期小于今天
            if(iCheckout < minDate) {
                return 7;
            }
            //预订时间超过28天
            if(Calendar.DATE.differ(sCheckin, sCheckout) > 28) {
                return 5;
            }
            // 离店日期大于90天
            if(iCheckout > maxDate) {
                return 8;
            }
            //离店日期小于入住日期
            if(Calendar.DATE.parse(sCheckout) <= Calendar.DATE.parse(sCheckin)) {
                return 4;
            }
    },

    /**
     * 接口返回数据检验
     *
     * @method _apiValidation
     * @param {Object} data 接口返回数据
     * @private
     * @return {Boolean} true/false
     */
    _apiValidation: function(data) {
        var detail      = data.detail,
            cantBuy     = detail.cantBuy,
            checkin     = detail.checkIn,
            checkOut    = detail.checkOut,
            maxInterval = detail.maxInterval;

        if(!cantBuy.code) {
            // 重置按钮状态
            this._BTNSTATUS['normal'].call(this);
            // 重置购买状态
            this._cantBuy(false);
            return !0;
        }

        switch(cantBuy.code) {
            case 1:
                TOTALPRICE.html('--');
                this._cantBuy(cantBuy.msg);
                break;
            case 2:
            case 3:
            case 7:
            case 8:
                this._cantBuy(false);
                this._ERROR.show(10, null, cantBuy.msg);
                this._BTNSTATUS['disabled'].call(this);
                break;
            case 4:
            case 5:
            case 6:
                this._cantBuy(cantBuy.msg);
                break;
        }

        return false;
    },

    /**
     * 购买状态处理
     *
     * @method _cantBuy
     * @param {String} msg 不能购买时的提示信息。为false时将状态置为正常
     */
    _cantBuy: function(msg) {
        ROOMNUM.attr('disabled', !!msg);
        CHECKIN.attr('disabled', !!msg);
        CHECKOUT.attr('disabled', !!msg);

        HOTELPAYAREA[!!msg ? 'addClass' : 'removeClass']('hidden');
        HOTELCANTBUY[!!msg ? 'removeClass' : 'addClass']('hidden');

        !!msg && HOTELCANTBUY.html(msg);
    },

    /**
     * 重置购买区域状态
     *
     * @method _resetBuyStatus
     * @param {Object} discount
     */
    _resetBuyStatus: function(discount) {
        // 恢复原价
        TOTALPRICE.removeClass('del');
        // 隐藏商品优惠结构
        PROMOTIONSWRAP.addClass('hidden');
        //重置返现
        CASHBACKPAY.addClass('hidden');
        // 隐藏店铺优惠结构
        SHOPPROMOTIONS.hide();
        // 更新原价格
        this._updatePrice();
        // 更新日历价格
        // this.calendar.set('discount', discount);
        // 更新一淘
        this._updateETao(discount.price);
    },

    /**
     * 用户登陆状态检测
     *
     * @method _checkUserLogin
     * @private
     */
    _checkUserLogin: function() {
        var that   = this,
            url    = HOST + '/remote/CheckLogin.do',
            jump   = !!this.jump;

        // 根据支付类型修改表单元素name值，跳转到新下单页
        (function(ver){
            HOTELGID.attr("name", ver ? "id" : "gid");
            ROOMNUM.attr("name", ver ? "roomnum" : "amount");
            BUYNOWVER.val(ver ? 2 : 1);
        })(HOTELDATA.detail.ver == 2);

        S.io.jsonp(url, function(data) {
            if(data.loginflag) {
                if(!jump) {
                    HOTELFORM.getDOMNode().submit();
                    return;
                }
                that.jump.show({
                    'gid'       : HOTELDATA.detail.item.id,
                    'checkin'   : CHECKIN.val(),
                    'checkout'  : CHECKOUT.val(),
                    'rooms'     : ROOMNUM.val(),
                    'price'     : that._itemPrice,
                    'name'      : that._getPromotionsName(),
                    'isquickbuy': HOTELISQUICKBUY.val(),
                    'city'      : HOTELCITY.val()
                });
                return;
            }

            // 迷你登录框埋点
            // HotelMonitor.single('tbtrip.8.5.9');

            var redirectUlr = HOST + (jump ? '/kaJump.htm?callback=itemTripTransfer&domain='+document.domain : HOTELFORM.attr('action') + '?searchBy=' + SEARCHBY.val() + '&' + S.io.serialize(HOTELFORM));

            that.login ? that.login.show({'redirectURL': redirectUlr}) : that.login = new HotelLogin({'redirectURL': redirectUlr, 'full_redirect': !jump});
        });
    },

    /**
     * 检测实价有房状态
     *
     * @method _checkRealPrice
     * @param {Boolen} b 实价有房状态，true/false
     * @private
     */
    _checkRealPrice: function(b) {
        var that = this;
        if(!REALPRICETAG || b) return !1;
        b || S.use('overlay', function(S, O) {
            // 去除实价有房标记
            REALPRICE.addClass('hidden');
            REALPRICETAG = !1;
            // 如果对象存在，直接显示
            if(that.realPriceDialog) {
                that.realPriceDialog.show();
                return;
            }

            // 对象不存在，实例化
            that.realPriceDialog = new O.Dialog({
                width        : 330,
                height       : 190,
                mask         : true,
                zIndex       : 9999999,
                prefixCls    : 'hotel-',
                align        : {points: ['cc', 'cc']},
                closeAction  : 'destroy',
                headerContent: '提示',
                bodyContent  : '<ul id="real-price-dialog">' +
                                   '<li>卖家已对此商品进行编辑，此商品已不是实价有房商品。</li>' +
                                   '<li id="J_RealPriceDelegate" class="center"><a class="continue" href="javascript:;">继续预订</a><a class="cancel" href="javascript:;">再看看</a></li>' +
                               '</ul>'
            });
            that.realPriceDialog.show();

            E.delegate('#J_RealPriceDelegate', 'click', 'a', function(e) {
                that.realPriceDialog.destroy();
                S.one(e.currentTarget).hasClass('continue') && that._checkUserLogin();
            });
        });
        return !0;
    },

    /**
     * 购买前校验
     *
     * @method _checkItemStatus
     * @private
     */
    _checkItemStatus: function() {
        this._asyncUpdate(null, function(data) {
            this._checkRealPrice(data.detail.it == 'T1') || this._checkUserLogin();
        });
    },

    /**
     * 格式化价格
     *
     * @method _formatPrice
     * @private
     */
    _formatPrice: function(price) {
        return price >= 0 ? (price / 100).toFixed(2) : '--';
    },

    /**
     * 日期变化处理函数
     *
     * @method _dateChange
     * @private
     */
    _dateChange: function() {
        this._update(['_updateNights' ,'_updateRoomNum', '_updateRoomTypes'], true);
    },

    /**
     * 购买按钮状态
     *
     * @name _BTNSTATUS
     * @type {Object}
     */
    _BTNSTATUS: {
        // 正常购买
        normal: function() {
            this._ERROR.hide();
            if(!HOTELDATA.detail.cantBuy.code) ROOMSTATUS.removeClass('hidden');
            BUYBTN.getDOMNode().className = 'buy-btn';
        },
        // 禁止购买
        disabled: function() {
            ROOMSTATUS.addClass('hidden');
            BUYBTN.getDOMNode().className = 'buy-btn-disabled';
        }
    },

    /**
     * 错误提示处理
     *
     * @name _ERROR
     * @type {Object}
     * @private
     */
    _ERROR: {
        msg: [
            '请选择入住日期',
            '请选择离店日期',
            '请填写正确的日期，例如：' + item_config.today,
            '离店日期必须晚于入住日期，请重新选择日期',
            '酒店预订时间不能超过28天，请重新选择日期',
            '您选择的时间段内没有房间，请重新选择日期',
            '你输入的日期已过期，请重新选择日期',
            '只能预订今天起90天内的酒店，请重新选择日期',
            '房间数量发生变化，请关注是否满足您的入住需求'
        ],
        /**
         * 显示错误信息
         *
         * @name _ERROR#show
         * @param {Number} idx 错误索引
         * @param {Node}   el  提示容器
         * @param {String} msg 指定显示的错误信息
         * @private
         */
        show: function(idx, el, msg) {
            var sTips = '',
                el    = el || ERRORMSG;
            if(!idx) return;
            switch(idx) {
                // 入住日期为空
                case 1:
                    CHECKIN.getDOMNode().focus();
                    break;
                // 日期格式错误
                case 2:
                    sTips = this.msg[2];
                    break;
                // 离店日期为空
                case 3:
                    CHECKOUT.getDOMNode().focus();
                    break;
                // 入住日期小于离店日期
                case 4:
                    sTips = this.msg[3];
                    break;
                // 预订时间超过28天
                case 5:
                    sTips = this.msg[4];
                    break;
                // 无房
                case 6:
                    sTips = this.msg[5];
                    break;
                // 日期小于今天
                case 7:
                    sTips = this.msg[6];
                    break;
                // 日期大于90天
                case 8:
                    sTips = this.msg[7];
                    break;
                // 可订房间数发生变化
                case 9:
                    sTips = this.msg[8];
                    break;
                // 接口返回的错误提示
                case 10:
                    sTips = msg;
                    break;
            }
            sTips && el.html(sTips).parent().removeClass('hidden');
        },
        /**
         * 隐藏错误信息
         *
         * @name _ERROR#hide
         * @private
         */
        hide: function(el) {
            el = el || ERRORMSG;
            el.parent().addClass('hidden');
        }
    },

    /**
     * 事件函数集
     *
     * @name _EVENT
     * @type {Object}
     * @private
     */
    _EVENT: {
        /**
         * 购买事件函数
         *
         * @method _EVENT#login
         * @param {Event} e 事件对象
         * @private
         */
        buy: function(e) {
            e.halt();
            if(S.one(e.currentTarget).hasClass('buy-btn-disabled')) return;

            var error = this._validation();

            if(error || this._ERROR.index) {
                this._ERROR.show(error);
                this._BTNSTATUS['disabled'].call(this);
                return;
            }

            this._checkItemStatus();
        },

        /**
         * 评价Tab激活
         *
         * @method fireReview
         * @param {e} e 事件对象
         * @private
         */
        fireReview: function() {
            this.hotelTab.fireClick(2);
            location = '#J_HotelTab';
        },

        /**
         * 支付类型对应的提示信息显示/隐藏
         *
         * @method _EVENT#tipToggle
         * @param {Event} e 事件对象
         * @private
         */
        tipToggle: function(e) {
            var oTarget = S.one(e.currentTarget),
                aTips   = [
                          '',
                          '房费通过支付宝全额支付。',
                          '手续费通过支付宝支付，房费到酒店前台支付。',
                          '订金通过支付宝支付，房费到酒店前台支付。',
                          '手续费通过支付宝支付，房费到酒店前台支付。',
                          '房费到酒店前台全额支付。'];
            clearTimeout(this.tipMouseTimer);
            switch(e.type) {
                case 'mouseenter':
                    PAYTIP.removeClass('hidden')
                        .css('left', 0)
                        .html('<i></i>'+ aTips[oTarget.attr('data-type')])
                        .css('left', oTarget.offset().left - PAYTIP.offset().left - parseInt(PAYTIP.width()) / 2 + parseInt(oTarget.width()) / 2);
                    break;
                case 'mouseleave':
                    this.tipMouseTimer = setTimeout(function() {
                        PAYTIP.addClass('hidden');
                    }, 100);
                    break;
            }
        },

        /**
         * 日历点击事件函数
         *
         * @method _EVENT#calClick
         * @param {Event} e 日期事件对象
         * @private
         */
        calClick: function(e) {
            var self = this;

            self._update(['_updateNights', '_updateRoomNum', '_updateRoomTypes'], true);

            return;

            var oCheckin  = this.calendar.currentNode.getDOMNode(),
                errorIdx  = 0;

            // 清空日历入住/离住缓存
            this.calendar._checkIn = this.calendar._checkOut = null;

            //标识日期由用户输入
            ISDEFAULTDATE.val(1);


            if(errorIdx = this._validation()) {
                this._ERROR.show(errorIdx);
                this._BTNSTATUS['disabled'].call(this);
                return;
            }

            // 选择入住/离店时间埋点，只有检验通过的时候再会记录
            // HotelMonitor.single(oCheckin.id == 'J_CheckIn' ? 'tbtrip.8.5.2' : 'tbtrip.8.5.3');
        },

        /**
         * 日历显示事件函数
         *
         * @method _EVENT#calShow
         * @private
         */
        calShow: function(e) {
            switch(e.node.attr('id')) {
                case 'J_CheckIn':
                    this.set('minDate', item_config.today);
                    this.set('afterDays', item_config.maxCheckOut);
                    this.render();
                break;
                case 'J_CheckOut':
                    this.set('minDate', this.get('startDate') || item_config.today);
                    this.set('afterDays', Math.min(item_config.maxInterval, Calendar.DATE.differ(this.get('minDate'), this._maxCheckoutDate) + 1));
                    this.render();
                break;
            }
        },

        /**
         * 房间数切换
         *
         * @method  _EVENT#roomNumChange
         * @private
         */
        roomNumChange: function() {
            this._update(['_updateRoomTypes', '_updatePricePolicy'], true);
        },

        /**
         * Tab延时加载处理函数
         *
         * @method _EVENT#tabLazyLoad
         * @private
         */
        tabLazyLoad: function() {
            var scrollTop  = D.scrollTop(),
                viewHeight = D.viewportHeight() + scrollTop;

            for(var i = iT = iB = 0, el = null, len = TABLAZYLOAD.length; i < len; i++) {
                el = TABLAZYLOAD.item(i);
                if(!el.hasClass('loaded')) {
                    iT = el.offset().top;
                    iB = iT + parseInt(el.height());
                    if((iT > scrollTop && top < viewHeight) || (iB > scrollTop && iB < viewHeight)) {
                        this.hotelTab[el.attr('data-value')]();
                        el.addClass('loaded');
                    }
                }
            }
        },

        /**
         * 点击日历输入框自动滚动到标题位置
         *
         * @method _EVENT#scroll
         * @private
         */
        scroll: function() {
            if(WIN.scrollTop() + 5 >= parseInt(ITEMNAME.offset().top)) return;

            Anim(WIN, {
                scrollTop: parseInt(ITEMNAME.offset().top)
            }, 0.3).run();
        },

        /**
         * SNS
         *
         * @method _EVENT#sns
         * @private
         */
        sns: function() {
            var config = {
                    key: item_config.item_id,
                    title: item_config.title,
                    pic: '',
                    linkUrl: 'http://kezhan.trip.taobao.com/item.htm?item_id=' + item_config.item_id,
                    type: 'item',
                    element: '#J_HotelBtShare',
                    client_id: '002',
                    ui: {
                        width: 900,
                        height: 500,
                        isIframe: false
                    },
                    callback : {
                        shareCallback: {
                            success: function() {
                                var share = HOTELSHARE.one('.J_HotelShareCount'),
                                    count = /\((\d+)\)/.test(share.html()) ? RegExp.$1 : 0;
                                share.html('('+ (++count) +')');
                            }
                        }
                    }
                };

            S.getScript('http://a.tbcdn.cn/p/snsdk/core.js', {
                success: function() {
                    typeof SNS == 'object' && SNS.ui('btshare', config);
                }
            });
        }
    }
});

return S.HotelItem = HotelItem;

}, {requires:['anim', 'node', './head', './report', 'gallery/calendar/1.2/', './hotel-login', './hotel-tab', './hotel-gotop', './hotel-fav', './switch', './imgview', './hotel-room', './hotel-price-policy']});