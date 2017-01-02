/**
 * Description:
 * @author Seadon
 * @date 2016年2月16日
 *
 */

define({
	showInfo: function(type, msg) {
		//var myMessages = ['info','warning','error','success'];
		jQuery(".message").remove();
		jQuery('body').append("<div class='msg-" + type + " message'><h3>" + msg +
			"</h3></div>");
		jQuery('.msg-' + type).animate({
			top: "0"
		}, 500);
		jQuery('.message').click(function() {
			jQuery(this).animate({
				top: -jQuery(this).outerHeight()
			}, 500);
		});
	},
	clearInfo: function() {
		jQuery(".message").animate({
			top: -jQuery(".message").outerHeight()
		}, 500)
	}
});
