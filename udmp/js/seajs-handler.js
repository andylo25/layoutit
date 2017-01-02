/**
 * Description:
 * @author Seadon
 * @date 2016年3月1日
 *
 */

define(function(require, exports, module) {
	require('bootstrap');

	window.onload = function() {
		window.parent.i_web_pg.finish();
	};
	(function($) {
		//iframe载入事件
		var i_frame = $(window.parent.document).find(
			'.tab-content .tab-pane:visible iframe');
		i_frame.load(function() {
			$('body').resize(function() {
				var elem = $(this);
				i_frame.css({
					height: elem.outerHeight(true)
				});
			})
			$('body').resize();
		});
	}(jQuery));
})
