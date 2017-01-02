//调整框架窗口高度
function setFrameSize() {
	$("#frameLeft, #frameRight").height($(window).height() - $("#frameHeader").height() - 40);
	var height = $("#frameRight").height();
	$("#tabFrame .tab-content").height(height - 35);
	$("#mainFrame").height(height);
}

//切换菜单模式
function toggleMenu() {
	var $mainMenu = $("#menu");
	
	if ($mainMenu.is(".mini")) {
		$("#btn-collapse").attr("title", "收起菜单").removeClass("off");
		$mainMenu.children("li").off("mouseenter").off("mouseleave");
		$("#frameLeft").css("width","200").css("overflow", "auto");
		$("#frameRight").css("marginLeft","200px");
	} else {
		$("#btn-collapse").attr("title", "展开菜单").addClass("off");;
		$mainMenu.children("li").on("mouseenter", function () {
			$(this).children("ul").show().children("li").show();
		}).on("mouseleave", function () {
			$(this).children("ul").hide().children("li").hide();
		});
		$("#frameLeft").css("width","44").css("overflow", "visible");;
		$("#frameRight").css("marginLeft","44px");
	}
	$("#frameHeader .navbar-header").toggle();
	$mainMenu.toggleClass("mini").find("ul, ul li").hide();
	$mainMenu.find("li a").find(".glyphicon-menu-down").removeClass('glyphicon-menu-down').addClass('glyphicon-menu-right');
}

//切换标签模式
function toggleTabPage() {
	enableTabPage = !enableTabPage;
	cookie('tabmode', enableTabPage ? '1' : '0');
	setTabPage();
}

//设置标签模式
function setTabPage() {
	if (enableTabPage) {
		$("#btn-tabpage").removeClass("off").attr("title", "关闭标签页模式");
		$("#mainFrame").hide();
		$("#tabFrame").show();
		var url = $("#mainFrame")[0].contentWindow.location.pathname;
		if (url && url != "blank" && url != "/blank") {
			addTab(url, $("#mainFrame").data("title"));
		}
	}
	else {
		$("#btn-tabpage").addClass("off").attr("title", "打开标签页模式");
		$("#tabFrame").hide();
		$("#mainFrame").show();
		var $tab = $("#tabFrame > .nav-tabs").children(".active");
		if ($tab.length) {
			showLoadingBar();
			var $a = $tab.children("a");
			$("#mainFrame").attr("data-title", $a.text()).attr("src", $a.attr("href"));
		}
	}
}

//载入内容页
function loadPage($a) {
	var title = $a.attr("title") || $a.text();
	if (enableTabPage) {
		addTab($a.attr("href"), title);
		return false;
	}
	else {
		$("#mainFrame").attr("data-title", title);
		showLoadingBar();
		return true;
	}
}

//刷新页面
function reloadPage() {
	if (enableTabPage) {
		$("#tabFrame > .nav-tabs").children(".active").find("a").trigger("click");
	}
	else {
		$("#mainFrame")[0].contentWindow.location.reload(true);
	}
}

//加载标签
function addTab(url, title) {
	var $tabs = $("#tabFrame > .nav-tabs");
	var $pages = $("#tabFrame > .tab-content");
	var max = 10;
	
	$tabs.children(".active").removeClass("active");
	//$pages.children(".active").removeClass("active");
	
	var $tab = $tabs.children().find("a[href='" + url + "']");
	var $page;
	
	if ($tab.length) {
		$tab.parent().addClass("active");
		//$page = $pages.children("[data-url='" + url + "']").addClass("active");
	}
	else if ($tabs.children().length >= max) {
		$tabs.children(":first").addClass("active").find("a").attr("href", url).text(title);
		//$page = $pages.children(":first").addClass("active").attr("data-url", url).empty();
	}
	else {
		$tabs.append("<li class=\"active\"><a href=\"" + url + "\">" 
			+ title + "</a><span class=\"btn-remove\">&times;</span></li>");
		//$page = $("<div class=\"tab-pane active\" data-url=\"" + url + "\"></div>");
		//$pages.append($page);
	}
	
	if ($pages.children().length) {
		$page = $pages.children(":first").attr("data-url", url).empty();
	}
	else {
		$page = $("<div class=\"tab-pane active\" data-url=\"" + url + "\"></div>");
		$pages.append($page);
	}
	
	loadTabPage($page, url);
}

//加载标签页
function loadTabPage($src, url) {
	showLoadingBar();
	$src.load(url, function() {
		hideLoadingBar();
		initDatetimePicker($src);
		$src.find(".table").bootstrapTable();
	});
}

//显示进度条
function showLoadingBar() {
	var $loadingBar = $("#loadingBar");
	if (!$loadingBar.is(":visible"))
		$loadingBar.width(0).show().animate({width : '100%'}, 2000, 'linear');
}

//隐藏进度条
function hideLoadingBar() {
	var $loadingBar = $("#loadingBar");
	if ($loadingBar.is(":visible"))
		$loadingBar.finish().fadeOut();
}

//显示右下角消息
function showMessage(title, content, timeOut) {
	var $message = $("#message");
	$message.find(".title").text(title);
	$message.find(".content").text(content);
	$message.show().animate({bottom : '0'}, 500, 'linear');
	if (timeOut) {
		setTimeout(hideMessage, timeOut);
	}
}

//关闭右下角消息
function hideMessage(){
	var $message = $("#message");
	$message.hide().css("bottom", "-160px");
	$message.find(".title").text("");
	$message.find(".content").text("");
}

//绑定窗口尺寸改变事件
$(window).resize(function(){
	setFrameSize();
});

//通用模块初始化
$(document).ready(function() {
	//页面框架初始化
	$(document).ready(function() {
		var $mainMenu = $("#menu");
		
		//移除空菜单
		$mainMenu.find("ul").each(function() {
			if (!$(this).children().length) {
				$(this).prev().find(".glyphicon.pull-right").remove();
				$(this).remove();
			}
		});
		
		//绑定菜单模式按钮点击事件
		$("#btn-collapse").on("click", toggleMenu);
		
		//绑定标签模式按钮点击事件
		$("#btn-tabpage").on("click", toggleTabPage);
		
		//绑定链接单击事件
		$("#frameHeader, #tabFrame > .tab-content").on("click", "a[target='mainFrame']", function() {
			return loadPage($(this));
		});
		
		//绑定菜单点击事件
		$mainMenu.on("click", "li a", function() {
			var $menu = $(this).closest("ul");
			var isMini = $mainMenu.is(".mini");
			
			//收起无关菜单
			if ($menu.is("#menu")) {
				$(".menu1").not($(this).next()).hide().children().not(".title").hide();
				$(".menu2").hide().children().hide();
			}
			else if ($menu.is(".menu1") && !isMini) {
				$(".menu2").not($(this).next()).hide().children().hide();
			}
			
			//更改当前菜单样式
			$mainMenu.find("li a").not(this).removeClass("active");
			$(this).addClass("active");
			
			//修改图标
			if (!isMini) {
				var $ico = $(this).children(".glyphicon.pull-right");
				if ($ico.length) {
					if ($ico.hasClass('glyphicon-menu-right')) {
						$ico.removeClass('glyphicon-menu-right').addClass('glyphicon-menu-down');
					} else if ($ico.hasClass('glyphicon-menu-down')) {
						$ico.removeClass('glyphicon-menu-down').addClass('glyphicon-menu-right');
					}
				}
				$mainMenu.find("li a").not(this).find(".glyphicon-menu-down").removeClass('glyphicon-menu-down').addClass('glyphicon-menu-right');
			}
			
			//判断是否打开页面
			$menu = $($(this).data("menu"));
			if($menu.length > 0){
				if (!isMini || !$menu.is(".menu1")) {
					$menu.children().not(".title").toggle();
					$menu.slideToggle();
				}
				return false;
			}
			else if (isMini) {
				$(this).closest(".menu1").hide();
			}
			
			if ($(this).attr("target") == "mainFrame")
				return loadPage($(this));
			else 
				return true;
		});
		
		//绑定标签页点击事件
		$("#tabFrame .nav-tabs").on("click", "li a", function() {
			var $tabs = $("#tabFrame > .nav-tabs");
			var $pages = $("#tabFrame > .tab-content");
			var url = $(this).attr("href");
			
			$tabs.children(".active").not($(this).parent().addClass("active")).removeClass("active");
			//$pages.children(".active").removeClass("active");
			//var $page = $pages.find(".tab-pane[data-url='" + url + "']").addClass("active");
			var $page = $pages.children(".active").empty().attr("data-url", url);
			loadTabPage($page, url);
			return false;
		});
		
		//绑定标签页删除按钮点击事件
		$("#tabFrame > .nav-tabs").on("click", "li .btn-remove", function() {
			var $pages = $("#tabFrame > .tab-content");
			var $tab = $(this).parent();
			var url = $tab.find("a").attr("href");
			//var $page = $pages.find(".tab-pane[data-url='" + url + "']");
			var $page = $pages.children(".active");
			
			if ($tab.is(".active") && $("#tabFrame > .nav-tabs li").length > 1) {
				var $next = $tab.prev();
				if (!$next.length)
					$next = $tab.next();
				$next.addClass("active");
				url = $next.find("a").attr("href");
				//$pages.find(".tab-pane").removeClass("active");
				//$pages.find(".tab-pane[data-url='" + url + "']").addClass("active");
				loadTabPage($page.empty(), url);
			}
			else if ($tab.is(".active")) {
				$page.empty();
			}
			
			$tab.remove();
			//$page.remove();
		});
		
		//绑定表单提交事件
		$(document).on("submit", "form[target='mainFrame']", function() {
			if (!validateForm($(this)))
				return false;
			
			if (enableTabPage) {
				var form = $(this);
				form.find(".btn[type='submit']").attr("disabled", "disabled");
				showLoadingBar();
				$.ajax({
			    	url: form.attr("action"),
			    	type : form.attr("method"),
			    	data : form.serialize(),
			    	success: function (data, status, xhr) {
			    		$("#tabFrame > .tab-content").children(":first").html(data);
			        },
			        complete: function() {
			        	hideLoadingBar();
			        	form.find(".btn[type='submit']").removeAttr("disabled");
			        }
			    });
				return false;
			}
			else {
				showLoadingBar();
				return true;
			}
		});
		
		$("#mainFrame").on("load", hideLoadingBar);

		//调整框架窗口
		setFrameSize();
		
		//设置标签模式;
		setTabPage();
		
		//打开默认页
		$("#menu > li:first a")[0].click();
	});
});