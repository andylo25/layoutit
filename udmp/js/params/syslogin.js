/**
 * Description:
 * @author Seadon
 * @date 2016年1月28日
 * 
 */
;(function($,window,undefined){
	/*布局自适应*/
	var gLayout= function(){
		var _height = document.body.clientHeight,
			bheight = _height-123-60;
		$("#container").css("height",bheight)
	}
	
	$(document).ready(function() {
		if($("#loginError").html()){
			showInfo('error', $("#loginError").html());
			setTimeout(function(){window.i_show_error=undefined;clearInfo();},3000);
		}
		$("#loginForm").validate({
			rules: {
				validateCode: {remote: $("#contextPath").val() + "/servlet/validateCodeServlet"}
			},
			messages: {
				username: {required: "请填写用户名"},
				password: {required: "请填写密码"},
				validateCode: {remote: "验证码不正确", required: "请填写验证码"}
			},
			//errorLabelContainer: "#messageBox",
			errorPlacement: function(error, element) {
				//error.appendTo($("#loginError").parent());
				//避免验证控件频繁触发
				if(typeof(window.i_show_error)=="undefined"){
					var _err = error[0].innerText ? error[0].innerText : error[0].innerHTML;
					window.i_show_error = true;
					showInfo('error',_err);
					setTimeout(function(){window.i_show_error=undefined;clearInfo();},3000);
				}
			} 
		});
	});
	// 如果在框架或在对话框中，则弹出提示并跳转到首页
	if(self.frameElement && self.frameElement.tagName == "IFRAME" || $('#left').length > 0 || $('.jbox').length > 0){
		alert('未登录或登录超时。请重新登录，谢谢！');
			top.location = "${ctx}";
	}
})(jQuery,window);
