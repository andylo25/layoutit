/**
 * Description:
 * @author Seadon
 * @date 2016年2月06日
 *
 */

define(function(require, exports, module) {
	require('bootstrap');
	require('bs_validator');
	require('bs_datetime');
	require.async('bs_datetime_cn');
	require('nicescroll');
	require('toastr');
	require('app_plugin');
	var _tool = require('udmp/params/util_tool');

	window.showInfo = function(type, msg) {
		if (typeof(window.i_show_error) == "undefined") {
			window.i_show_error = true;
			with(_tool) {
				showInfo(type, msg);
				setTimeout(function() {
					window.i_show_error = undefined;
					clearInfo();
				}, 3000);
			}
		}
	};
	(function($) {
		$(".i-son-abs,#winModal,#secondModal").niceScroll({
			styler: "fb",
			cursorcolor: "#e8403f",
			cursorwidth: '6',
			cursorborderradius: '10px',
			background: '#404040',
			spacebarenabled: false,
			cursorborder: '',
			zindex: '1000'
		});
		//窗口大小改变时触发
		$(window).resize(function() {
			if (document.body.clientWidth < 770)
				$('.i-aside-xs').removeClass('i-aside-xs');
		})
		$('#i-frame-tabs').multabs({
			monitor: '.i-nav-menu,.i-header-right,.i-work-info'
		});
		//bootstrap toggle增强
		$(document).on('click', '[data-toggle^="class"]', function(e) {
			e && e.preventDefault();
			var $this = $(e.target),
				$class, $target, $tmp, $classes, $targets;
			!$this.data('toggle') && ($this = $this.closest(
				'[data-toggle^="class"]'));
			$class = $this.data()['toggle'];
			$target = $this.data('target') || $this.attr('href');
			$class && ($tmp = $class.split(':')[1]) && ($classes = $tmp.split(','));
			$target && ($targets = $target.split(','));
			$classes && $classes.length && $.each($targets, function(index, value) {
				if ($classes[index].indexOf('*') !== -1) {
					var patt = new RegExp('\\s' +
						$classes[index].replace(/\*/g, '[A-Za-z0-9-_]+').split(' ').join(
							'\\s|\\s') +
						'\\s', 'g');
					$($this).each(function(i, it) {
						var cn = ' ' + it.className + ' ';
						while (patt.test(cn)) {
							cn = cn.replace(patt, ' ');
						}
						it.className = $.trim(cn);
					});
				}
				($targets[index] != '#') && $($targets[index]).toggleClass($classes[
					index]) || $this.toggleClass($classes[index]);
			});
			$this.toggleClass('active');
		});
		// aside click event
		$('.i-nav-menu').on('click', 'a', function(e) {
			var $this = $(e.target),
				$active;
			$this.is('a') || ($this = $this.closest('a'));

			$active = $this.parents().siblings('.active');
			$active && $active.toggleClass('active').find('> ul:visible').slideUp(
				200);

			if ($this.parent().hasClass('active')) {
				$this.next().slideUp(200);
			} else {
				$this.parents('ul:first').parent('li').addClass('active');
				$this.next().slideDown(200);
			}
			$this.parent().removeClass('cd').toggleClass('active');
			$this.next().is('ul') && e.preventDefault();
		}).on('mouseenter', 'ul>li ul a', function(e) {
			var $this = $(e.target);

			$active = $this.parent().siblings('.cd');
			$active.length && $active.toggleClass('cd').find('> ul:visible').slideUp(
				200);

			$this.parent(":not(.active)").addClass('cd').end().next().slideDown(200);
		}).on('mouseleave', function(e) {
			$('.cd').removeClass('cd');
		});
		//小分辨率下，点击设置按钮触发
		$("#i-user-set").on("click", function() {
			var $dd = $(".dropdown");
			if ($dd.hasClass("open")) {
				$dd.removeClass("open");
			} else {
				setTimeout(function() {
					$dd.addClass("open");
				}, 100);
			}
		});
		//搜索功能
		$(".i-search-txt").on("keyup", function() {
			toastr.success("您输入的查询字段为" + this.value);
		});

		//子页面调用模块

		//重新登录提示
		function showLogin() {
			showAlert("error", "会话已超时，请重新登录。");
			window.document.location.href = $ctx + "/login";
		}

		//获取URL地址参数
		window.getQueryString = function(name, url) {
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

		//加载模态窗口
		window.showModal = function(url, html, params, buttons, callback) {
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
				if (params.overflow) {
					$content.css('overflow', params.overflow);
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

		}

		//显示模态框，表单使用  bootstrap validator 验证表单项
		function setModalShow($modal, html) {
			//填充窗体内容
			var $content = $modal.find(".modal-body .body-content").html(html),
				$mcontent = $modal.find(".modal-content");
			$modal.css({
				"display": "block"
			});

			//替换自定义按钮组
			var $buttons = $modal.find(".my-buttons");
			if ($buttons.length) {
				$buttons.children().appendTo($modal.find(".modal-footer").empty());
				$buttons.hide();
			}

			//定位窗体到中间位置
			var $dlg = $modal.find(".modal-dialog");
			var margin = ($(window).height() - $mcontent.height() - 60) / 2;
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
		window.hideModal = function($modal) {
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
			//初始化日期选择控件
		window.initDatetimePicker = function($container) {
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
				
				$container.find('.form-month').datetimepicker({
					language: 'zh-CN',
					format: "yyyy-mm",
					weekStart: 1,
					todayBtn: 1,
					autoclose: 1,
					todayHighlight: 0,
					startView: 3,
					minView: 3,
					forceParse: 0
				});
			}
			//设置窗体数据
		window.setModalData = function(name, value, $modal) {
			if (!$modal)
				$modal = $("#winModal");
			$modal.data(name, value);
		}

		//获取窗体数据
		window.getModalData = function(name, $modal) {
			if (!$modal)
				$modal = $("#winModal");
			return $modal.data(name);
		}

		//手动验证表单
		window.validateForm = function($form) {
			var $form = $($form);
			var validator = $form.data("bootstrapValidator");
			if (validator) {
				validator.validate();
				return validator.isValid();
			} else
				return true;
		}

		//重载本页
		window.reloadPage = function() {
			var $frame = $('body').find('.tab-content .tab-pane:visible iframe')[0].contentWindow;
			$frame.location.reload();
		}

		//确认提示
		window.showConfirm = function(message, callback) {
			showAlert("confirm", message, callback);
		}

		//错误提示
		window.showError = function(message, callback, timeOut) {
			showAlert("error", message, callback, timeOut);
		}

		//显示消息提示框
		window.showAlert = function(type, message, callback, timeOut) {
			var $alert = $("#alert");

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
				if (!$alert.data("callback")) {
					showInfo('success', '操作成功');
					reloadPage();
				}
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
		});

	}(jQuery));
});
