$(document).ready(function() {
	$(".i-title.i-query").on(
			'click',
			function() {
				var that = $(this);
				$(".i-form-panel,.i-knowledge-panel").slideToggle(
						"fast",
						function() {
							var els = $(".i-rt>span", that);
							if (els.is(".glyphicon-menu-down"))
								els.removeClass("glyphicon-menu-down")
										.addClass("glyphicon-menu-up");
							else
								els.removeClass("glyphicon-menu-up").addClass(
										"glyphicon-menu-down");
							$("body").resize();
						});
			});
});

/*cwm 工具方法*/
var CC = {};
/*客户放大镜*/
CC.openCust = function(callBac){
	debugger
	var contentV = $("#cusmagnifiervalue");
	if(contentV.length == 0){
		// 不存在，创建
		contentV = $('<input id="cusmagnifiervalue" type="hidden">').appendTo($("body"));
	}
	layer.open({
	    type: 2,
	    title: '客户放大镜',
	    fix: false,
	    maxmin: true,
	    shadeClose: true,
	    area: ['800px', '400px'],
	    content: ctx+'/magnifier/items/customermagnifier',
	    end: function(){
	    	callBac && callBac($.parseJSON(contentV.val()));
	    }
	  });
}

/*合作商放大镜*/
CC.openHzs = function(callBac){
	var contentV = $("#cusmagnifiervalue");
	if(contentV.length == 0){
		// 不存在，创建一个
		contentV = $('<input id="cusmagnifiervalue" type="hidden">').appendTo($("body"));
	}
	
	layer.open({
	    type: 2,
	    title: '合作商放大镜',
	    fix: false,
	    maxmin: true,
	    shadeClose: true,
	    area: ['800px', '400px'],
	    content: ctx+'/magnifier/items/cooperativemagnifier',
	    end: function(){
	    	callBac && callBac($.parseJSON(contentV.val()));
	    }
	  });
}