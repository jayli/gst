/**
 * @fileOverview 举报中心js功能
 * @version 0.1
 * @author baxian@taobao.com
 */
KISSY.add('hotel-item/mods/report', function(S){
	var _report = S.one(document.getElementById('J_Report'));
	if(!_report){
		return {
			init : function(){}
		};
	}
	var heading = _report.one('.tb-report-heading'),
		menu = _report.one('.tb-report-menu'),
		VISIBILITY = 'visibility',
		HOVER_CLS = 'tb-report-hover';

	function _init(){
		_report.on('mouseenter', function () {
			menu.css(VISIBILITY, 'visible');
			_report.addClass(HOVER_CLS);
		});
		_report.on('mouseleave', function () {
			menu.css(VISIBILITY, 'hidden');
			_report.removeClass(HOVER_CLS);
		});
	}

	return {
            init:_init
        }
},{requires:['node','event']});