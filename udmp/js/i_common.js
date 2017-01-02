/**
 * Description:
 * @author Seadon
 * @date 2016年1月29日
 * 
 */

/*顶部弹出框*/
var showInfo = function(type,msg){
	//var myMessages = ['info','warning','error','success']; 
	$(".message").remove();
	$('body').append("<div class='msg-"+type+" message'><h3>"+msg+"</h3></div>");
	$('.msg-'+type).animate({top:"0"}, 500);
	$('.message'). click(function(){	
		$(this).animate({top: -$(this).outerHeight()}, 500);
	});	
},
clearInfo = function(){
	$(".message").animate({top: -$(".message").outerHeight()}, 500)
}