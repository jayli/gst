/*
combined files : 

hotel-item/mods/hotel-page

*/
/**
 * 分页
 * Author: Angtian
 * E-mail: angtian.fgm@taobao.com
 */
KISSY.add('hotel-item/mods/hotel-page',function(S) {

var toHTML = S.substitute;

var TEMPLATE = {
    'page-box' : '<div class="hotel-page-box">' +
                    '<div class="hotel-page">' +
                        '{prev-page}' +
                        '{first-page}' +
                        '{pages}' +
                        '{next-page}' +
                    '</div>' +
                 '</div>',

    'prev-page' : '<a href="javascript:;" class="{prev-cls}" data-value="{data-value}">上一页</a>',

    'first-page': '<a href="javascript:;" data-value="1" class="J_HotelPage">1</a>',

    'page-break': '<a href="javascript:;" class="page-break">...</a>',

    'pages'     : '<a href="javascript:;" class="{current}" data-value="{data-value}">{page}</a>',

    'next-page' : '<a href="javascript:;" class="{next-cls}" data-value="{data-value}">下一页</a>'

};

function HotelPage() {

}

S.augment(HotelPage, {
    /**
     * 对外接口，初始化
     *
     * @method init
     */
    init: function(options) {
        this._options = KISSY.merge({
            'pageSize': 1,
            'curPage' : 1
        }, options || {});
        return this._updatePage();
    },

    /**
     * 更新分页
     *
     * @method _updatePage
     * @private
     */
    _updatePage: function() {
        var maxNum   = 5,
            pageSize = this._options.pageSize,
            curPage  = this._options.curPage,
            maxSize  = 1;

        switch(true) {
            case pageSize < maxNum:
                maxSize = pageSize;
                break;
            case curPage == pageSize:
                maxSize = pageSize;
                break;
            case curPage >= maxNum:
                maxSize = curPage * 1 + 1;
                break;
            default:
                maxSize = maxNum;
                break;
        }

        return toHTML(TEMPLATE['page-box'], {
                   'prev-page' : toHTML(TEMPLATE['prev-page'], {'prev-cls': curPage > 1 ? 'prev-page J_HotelPage' : 'first-page', 'data-value': curPage - 1}),
                   'first-page': maxSize > 5 ? TEMPLATE['first-page'] + TEMPLATE['page-break'] : '',
                   'pages'     : function(){
                                     var tmpl = '';
                                     var i    = maxSize > 5 ? maxSize - 3 : 1;
                                     for(;i <= maxSize; i++) {
                                         tmpl += toHTML(TEMPLATE['pages'], {'page': i, 'current': i == curPage ? 'current' : 'J_HotelPage', 'data-value': i});
                                     }
                                     return tmpl;
                                 } (),
                   'next-page': toHTML(TEMPLATE['next-page'], {'next-cls': curPage == pageSize ? 'last-page' : 'next-page J_HotelPage', 'data-value': curPage * 1 + 1})
               });
    }
});

return S.HotelPage = HotelPage;

});
