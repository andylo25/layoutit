 /*
  * 前端框架公共模块脚本
  * @author buchunguang
  * @version 2016-1-13
  */

 //进度条完成
 window.onload = function() {
   //window.top.i_web_pg.finish();
 };

 //重新登录提示
 function showLogin() {
   showAlert("error", "会话已超时，请重新登录。", function() {
     window.top.document.location.href = ctx + "/login";
   });
 }

 function reloadPage() {
   window.location.reload();
 }

 //错误提示
 function showError(message, callback, timeOut) {
   window.top.showAlert("error", message, callback, timeOut);
 }

 //消息提示
 function showInfo(message, callback, timeOut) {
   window.top.showAlert("info", message, callback, timeOut);
 }

 //确认提示
 function showConfirm(message, callback) {
   window.top.showAlert("confirm", message, callback);
 }

 //显示消息提示框
 function showAlert(type, message, callback, timeOut) {
   var $alert = $("#alert");

   /*
   //模态窗口消息处理
   var $winModal = $("#winModal");
   if ($winModal.data("isShow")) {
   	if ($winModal.find(".alert").length) {
   		$alert = $winModal.find(".alert");
   		$alert.addClass(type).find(".alert-content").html(message);
   		$alert.show();
   		if (timeOut)
   			setTimeout("$('#winModal').find('.alert').fadeOut();", timeOut);
   		if (callback)
   			callback();
   		return;
   	}
   	$winModal.modal("hide");
   }
   */

   if (type == "error") {
     $alert.find(".alert").removeClass("info confirm").addClass("error");
     $alert.find(".glyphicon").removeClass(
       "glyphicon-info-sign glyphicon-question-sign").addClass(
       "glyphicon-exclamation-sign");
   } else if (type == "info" || type == "success") {
     $alert.find(".alert").removeClass("error confirm").addClass("info");
     $alert.find(".glyphicon").removeClass(
       "glyphicon-exclamation-sign glyphicon-question-sign").addClass(
       "glyphicon-info-sign");
   } else if (type == "confirm" || type == "warning") {
     $alert.find(".alert").removeClass("error info").addClass("confirm");
     $alert.find(".glyphicon").removeClass(
       "glyphicon-info-sign glyphicon-exclamation-sign").addClass(
       "glyphicon-question-sign");
   }
   $alert.find(".alert-content").html(message);
   $alert.find(".btn-cancel").toggle(type == "confirm" || type == "warning");

   if (callback)
     $alert.data("callback", callback);

   $alert.show();

   if (timeOut) {
     setTimeout(hideAlert, timeOut);
   }
 }

 //关闭消息提示框
 function hideAlert() {
   var $alert = $("#alert");
   if ($alert.data("callback")) {
     $alert.data("callback")();
   }
   $alert.removeData("callback").fadeOut();
 }

 //加载模态窗口
 function showModal(url, html, params, buttons, callback) {
   //showLoadingBar();
   var $modal = $("#winModal");
   //如果模态窗口已打开，则弹出二层模态窗口
   if ($modal.data("isShow")) {
     $modal = $("#secondModal");
   }
   var $content = $modal.find(".modal-body .body-content").empty();
   if (params) {
     if (params.width) {
       $modal.find(".modal-dialog").width(params.width);
     } else if (params.lg) {
       $modal.find(".modal-dialog").addClass("modal-lg");
     }
     if (params.height) {
       $content.height(params.height);
     }
     if (params.title) {
       $modal.find(".modal-title .title-text").text(params.title);
     }
     if (params.hideFooter) {
       $modal.find(".modal-footer").addClass("hide");
     }
     if (params.confirmText) {
       $modal.find(".modal-footer .btn-confirm").text(params.confirmText);
     }
     if (params.cancelText) {
       $modal.find(".modal-footer .btn-cancel").text(params.cancelText);
     }
     if (params.confirmCallback) {
       $modal.find(".modal-footer .btn-confirm").data("callback", params.confirmCallback);
     }
   }
   if (buttons) {
     //TODO: 附加按钮
   }
   if (callback) {
     $modal.data("callback", callback);
   }

   if (url) {
     $.get(url, function(data) {
       setModalShow($modal, data);
     });
   } else {
     setModalShow($modal, html);
   }

   //hideLoadingBar();
 }

 //显示模态框，表单使用  bootstrap validator 验证表单项
 function setModalShow($modal, html) {
   //填充窗体内容
   var $content = $modal.find(".modal-body .body-content").html(html);

   //替换自定义按钮组
   var $buttons = $modal.find(".my-buttons");
   if ($buttons.length) {
     $buttons.children().appendTo($modal.find(".modal-footer").empty());
     $buttons.hide();
   }

   //定位窗体到中间位置
   var $dlg = $modal.find(".modal-dialog");
   var margin = ($(window).height() - $content.height() - 150) / 2;
   if (margin < 10)
     margin = 5;
   $dlg.css("top", margin + "px");

   //显示模态框
   $modal.data("isShow", true);
   //$modal.modal("show");
   $modal.modal({
     backdrop: 'static',
     keyboard: false
   });

   //加载表单验证组件
   var $form = $modal.find("form");
   if ($form.length) {
     $form.bootstrapValidator();
     initDatetimePicker($form);
     $form.on('submit', function(e) {
       if (!validateForm($form))
         return false;

       $modal.find(".modal-footer .btn").attr("disabled", "disabled");
       $modal.find(".loading").show();
       $.ajax({
         url: $form.attr("action"),
         type: $form.attr("method"),
         data: $form.serialize(),
         success: function(data, status, xhr) {
           if ($form.data("callback"))
             $form.data("callback")(data, $form);
           else {
             setModalData("ajaxResult", data);
             hideModal();
           }
         },
         complete: function() {
           $modal.find(".loading").hide();
           $modal.find(".modal-footer .btn").removeAttr("disabled");
         }
       });
     });
   }
 }

 //关闭模态窗口
 function hideModal($modal) {
   if (!$modal) {
     if ($("#secondModal").data("isShow"))
       $modal = $("#secondModal");
     else
       $modal = $("#winModal");
   }
   $modal.data("isShow", false);
   $modal.modal("hide");
   if ($modal.data("callback"))
     $modal.data("callback")($modal);
 }

 //设置窗体数据
 function setModalData(name, value, $modal) {
   if (!$modal)
     $modal = $("#winModal");
   $modal.data(name, value);
 }

 //获取窗体数据
 function getModalData(name, $modal) {
   if (!$modal)
     $modal = $("#winModal");
   return $modal.data(name);
 }

 //手动验证表单
 function validateForm($form) {
   var validator = $form.data("bootstrapValidator");
   if (validator) {
     validator.validate();
     return validator.isValid();
   } else
     return true;
 }

 //初始化日期选择控件
 function initDatetimePicker($container) {
   if (!$container)
     $container = $(document);

   $container.find('.form-date').datetimepicker({
     language: 'zh-CN',
     format: "yyyy-mm-dd",
     weekStart: 1,
     todayBtn: 1,
     autoclose: 1,
     todayHighlight: 1,
     startView: 2,
     minView: 2,
     forceParse: 0
   });

   $container.find('.form-datetime').datetimepicker({
     language: 'zh-CN',
     format: "yyyy-mm-dd hh:ii:00",
     weekStart: 1,
     todayBtn: 1,
     autoclose: 1,
     todayHighlight: 1,
     startView: 2,
     minView: 0,
     forceParse: 0
   });
 }

 //cookie操作
 function cookie(name, value, options) {
   if (typeof value != 'undefined') { // name and value given, set cookie
     options = options || {};
     if (value === null) {
       value = '';
       options.expires = -1;
     }
     var expires = '';
     if (options.expires && (typeof options.expires == 'number' || options.expires
         .toUTCString)) {
       var date;
       if (typeof options.expires == 'number') {
         date = new Date();
         date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
       } else {
         date = options.expires;
       }
       expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
     }
     var path = options.path ? '; path=' + options.path : '';
     var domain = options.domain ? '; domain=' + options.domain : '';
     var secure = options.secure ? '; secure' : '';
     document.cookie = [name, '=', encodeURIComponent(value), expires, path,
       domain, secure
     ].join('');
   } else { // only name given, get cookie
     var cookieValue = null;
     if (document.cookie && document.cookie != '') {
       var cookies = document.cookie.split(';');
       for (var i = 0; i < cookies.length; i++) {
         var cookie = jQuery.trim(cookies[i]);
         // Does this cookie string begin with the name we want?
         if (cookie.substring(0, name.length + 1) == (name + '=')) {
           cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
           break;
         }
       }
     }
     return cookieValue;
   }
 }

 //获取URL地址参数
 function getQueryString(name, url) {
   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
   if (!url || url == "") {
     url = window.location.search;
   } else {
     url = url.substring(url.indexOf("?"));
   }
   r = url.substr(1).match(reg)
   if (r != null) return unescape(r[2]);
   return null;
 }

 //ajax全局设置
 $.ajaxSetup({
   cache: false,
   timeout: 60000,
   contentType: "application/x-www-form-urlencoded;charset=utf-8",
   complete: function(XMLHttpRequest, textStatus) {},
   error: function(jqXHR, textStatus, errorThrown) {
     if (jqXHR.status)
       showError(jqXHR.status + ' ' + errorThrown, null, 2000);
     else
       showError(errorThrown, null, 2000);
   }
 });

 //通用模块初始化
 $(document).ready(function() {
   var $alert = $("#alert");
   var $message = $("#message");

   var $drag = null; //要移动的模态窗口
   var _x, _y; //鼠标离控件左上角的相对位置

   //去掉链接虚框
   $(document).on("focus", "a", function() {
     if (this.blur) {
       this.blur()
     };
   });

   //绑定面板折叠按钮点击事件
   $(document).on("click", ".panel .btn-remove", function() {
     $(this).closest(".panel").remove();
   });

   //绑定面板删除按钮点击事件
   $(document).on("click", ".panel .btn-collapse", function() {
     $(this).closest(".panel").find(".panel-body").slideToggle();
     $(this).toggleClass("glyphicon-menu-up").toggleClass(
       "glyphicon-menu-down");
   });

   //绑定消息框关闭按钮点击事件
   $alert.on("click", ".btn-close", function() {
     hideAlert();
   });

   //绑定右下角提示框关闭按钮点击事件
   $message.on("click", ".close", function() {
     hideMessage();
   });

   //绑定提示框取消按钮点击事件
   $alert.on("click", ".btn-cancel", function() {
     $alert.removeData("callback").fadeOut();
   });
   //左侧菜单hover事件
   $("#menu").delegate("a", "mouseenter", function() {
       if (!$(this).is(".active")) {
         $(this).addClass("i-menu-hover");
       }
     }).delegate("a", "mouseleave", function() {
       $(this).removeClass("i-menu-hover");
     })
     //绑定模态窗口关闭事件
   $(".modal").on("hidden.bs.modal", function(e) {
     $(this).find(".modal-dialog").removeClass("modal-lg").css("width",
       "none");
     $(this).find(".modal-title .title-text").text("标题");
     $(this).find(".alert").hide().removeClass().addClass("alert").find(
       ".alert-content").text("");
     $(this).find(".modal-body .body-content").empty().css("height",
       "auto");
     $(this).find(".modal-footer button").not(
       ".btn-confirm, .btn-cancel").remove();
     $(this).find(".modal-footer").removeClass("hide").children(
       ".btn-confirm, .btn-cancel").removeClass("hide");
     $(this).find(".modal-footer .btn-confirm").text("确定");
     $(this).find(".modal-footer .btn-cancel").text("关闭");
     $(this).removeData("bs.modal").removeData();
   });

   //绑定模态窗口确定事件
   $(".modal").on("click", ".btn-confirm", function(e) {
     var $modal = $(this).closest(".modal");
     if ($(this).data("callback")) {
       $(this).data("callback")($(this), $modal);
     } else {
       var $form = $modal.find(".body-content form");
       if ($form.length && $form.attr("action")) {
         $form.submit();
       } else {
         hideModal($modal);
       }
     }
   });

   //绑定模态窗口的拖动事件
   $(".modal").on("mousedown", ".modal-header", function(e) {
     $drag = $(this).closest(".modal");
     var point = $drag.find(".modal-dialog").offset();
     _x = e.pageX - point.left;
     _y = e.pageY - point.top;
   });

   $(document).mousemove(function(e) {
     if ($drag) {
       var x = e.pageX - _x; //控件左上角到屏幕左上角的相对位置
       var y = e.pageY - _y;
       $drag.find(".modal-dialog").offset({
         top: y,
         left: x
       });
     }
   }).mouseup(function() {
     $drag = null;
   });

   //初始化日期控件
   initDatetimePicker();
 });
