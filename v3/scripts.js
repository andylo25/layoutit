function supportstorage() {
    if (typeof window.localStorage=='object')
        return true;
    else
        return false;
}

function handleSaveLayout() {
    var e = $(".demo").html();
    if (!stopsave && e != window.demoHtml) {
        stopsave++;
        window.demoHtml = e;
        saveLayout();
        stopsave--;
    }
}

var layouthistory;
var maxCount = 20;// 只保存20份回退
function saveLayout(){
    var data = layouthistory;
    if (!data) {
        data={};
        data.count = 0;
        data.list = [];
    }

    if (data.list.length>data.count) {
        for (i=data.count;i<data.list.length;i++)
            data.list[i]=null;
    }
    data.list[data.count] = window.demoHtml;
    data.count++;
    // 只保存maxCount份回退
    if(data.list.length > maxCount){
        data.list.shift();
        data.count--;
    }
    if (supportstorage()) {
        localStorage.setItem("layoutdata3",JSON.stringify(data));
    }
    layouthistory = data;
    //console.log(data);
    /*$.ajax({
     type: "POST",
     url: "/build/saveLayout",
     data: { layout: $('.demo').html() },
     success: function(data) {
     //updateButtonsVisibility();
     }
     });*/
}

function downloadLayout(){

    $.ajax({
        type: "POST",
        url: "/build/downloadLayout",
        data: { layout: $('#download-layout').html() },
        success: function(data) { window.location.href = '/build/download'; }
    });
}

function downloadHtmlLayout(){
    $.ajax({
        type: "POST",
        url: "/build/downloadLayout",
        data: { layout: $('#download-layout').html() },
        success: function(data) { window.location.href = '/build/downloadHtml'; }
    });
}

function undoLayout() {
    var data = layouthistory;
    //console.log(data);
    if (data) {
        if (data.count<2) return false;
        window.demoHtml = data.list[data.count-2];
        data.count--;
        $('.demo').html(window.demoHtml);
        if (supportstorage()) {
            localStorage.setItem("layoutdata",JSON.stringify(data));
        }
        return true;
    }
    return false;
    /*$.ajax({
     type: "POST",
     url: "/build/getPreviousLayout",
     data: { },
     success: function(data) {
     undoOperation(data);
     }
     });*/
}

function redoLayout() {
    var data = layouthistory;
    if (data) {
        if (data.list[data.count]) {
            window.demoHtml = data.list[data.count];
            data.count++;
            $('.demo').html(window.demoHtml);
            if (supportstorage()) {
                localStorage.setItem("layoutdata",JSON.stringify(data));
            }
            return true;
        }
    }
    return false;
    /*
     $.ajax({
     type: "POST",
     url: "/build/getPreviousLayout",
     data: { },
     success: function(data) {
     redoOperation(data);
     }
     });*/
}

function handleJsIds() {
    handleModalIds();
    handleAccordionIds();
    handleCarouselIds();
    handleTabsIds()
}
// 拖动后重新绑定【手风琴切换】事件
function handleAccordionIds() {
    var e = $(".demo #myAccordion");
    var t = randomNumber();
    var n = "panel-" + t;
    var r;
    e.attr("id", n);
    e.find(".panel").each(function (e, t) {
        r = "panel-element-" + randomNumber();
        $(t).find(".panel-title").each(function (e, t) {
            $(t).attr("data-parent", "#" + n);
            $(t).attr("href", "#" + r)
        });
        $(t).find(".panel-collapse").each(function (e, t) {
            $(t).attr("id", r)
        })
    })
}
// 拖动后重新绑定【幻灯片】事件
function handleCarouselIds() {
    var e = $(".demo #myCarousel");
    var t = randomNumber();
    var n = "carousel-" + t;
    e.attr("id", n);
    e.find(".carousel-indicators li").each(function (e, t) {
        $(t).attr("data-target", "#" + n)
    });
    e.find(".left").attr("href", "#" + n);
    e.find(".right").attr("href", "#" + n)
}
//拖动后重新绑定【遮罩窗体】事件
function handleModalIds() {
    var e = $(".demo #myModalLink");
    var t = randomNumber();
    var n = "modal-container-" + t;
    var r = "modal-" + t;
    e.attr("id", r);
    e.attr("href", "#" + n);
    e.next().attr("id", n)
}
//拖动后重新绑定【选项卡】事件
function handleTabsIds() {
    var e = $(".demo #myTabs");
    var t = randomNumber();
    var n = "tabs-" + t;
    e.attr("id", n);
    e.find(".tab-pane").each(function (e, t) {
        var n = $(t).attr("id");
        var r = "panel-" + randomNumber();
        $(t).attr("id", r);
        $(t).parent().parent().find("a[href=#" + n + "]").attr("href", "#" + r)
    })
}
function randomNumber() {
    return randomFromInterval(1, 1e6)
}
function randomFromInterval(e, t) {
    return Math.floor(Math.random() * (t - e + 1) + e)
}
// grid布局生成
function gridSystemGenerator() {
    $(".lyrow .preview input").bind("keyup", function () {
        var e = 0;
        var t = "";
        var n = false;
        var r = $(this).val().split(" ", 12);
        $.each(r, function (r, i) {
            if (!n) {
                if (parseInt(i) <= 0)
                    n = true;
                e = e + parseInt(i);
                t += '<div class="col-md-' + i + ' column"></div>'
            }
        });
        if (e == 12 && !n) {
            $(this).parent().next().children().html(t);
            $(this).parent().prev().show()
        } else {
            $(this).parent().prev().hide()
        }
    })
}
function configurationElm(e, t) {
    // 绑定点击直属按钮，自动添加按钮的ref属性的值作为组件class
    $(".demo").delegate(".configuration > a", "click", function (e) {
        e.preventDefault();
        var t = $(this).parent().next().next().children();
        $(this).toggleClass("active");
        // add cwm 增加addClass可以指定元素路径
        var epath = $(this).attr("path");
        if(epath && epath != ''){
            t = t.find(epath);
        }
        t.toggleClass($(this).attr("rel"));
    });
    // 绑定下拉菜单事件，自动添加对应ref属性的值作为组件class
    $(".demo").delegate(".configuration .dropdown-menu a", "click", function (e) {
        e.preventDefault();
        var t = $(this).parent().parent();
        var n = t.parent().parent().next().next().children();
        t.find("li").removeClass("active");
        $(this).parent().addClass("active");
        // add cwm 增加addClass可以指定元素路径
        var epath = $(this).attr("path");
        if(epath && epath != ''){
            n = n.find(epath);
        }
        var r = "";
        t.find("a").each(function () {
            r += $(this).attr("rel") + " "
        });
        t.parent().removeClass("open");
        n.removeClass(r);
        n.addClass($(this).attr("rel"))
    })
}
function removeElm() {
    $(".demo").delegate(".remove", "click", function (e) {
        e.preventDefault();
        $(this).parent().remove();
        if (!$(".demo .lyrow").length > 0) {
            clearDemo()
        }
    })
}
function clearDemo() {
    $(".demo").empty()
}
function removeMenuClasses() {
    $("#menu-layoutit li button").removeClass("active")
}
function changeStructure(e, t) {
    $("#download-layout ." + e).removeClass(e).addClass(t)
}
function cleanHtml(e) {
    $(e).parent().prepend($(e).children().html())
    $(e).remove();
}
// 下载布局代码
function downloadLayoutSrc() {
    var e = "";
    $("#download-layout").children().html($(".demo").html());
    var t = $("#download-layout").children();
    t.find(".preview, .configuration, .drag, .remove").remove();
    t.find(".lyrow").addClass("removeClean");
    t.find(".box-element").addClass("removeClean");

    var trc = t.find(".removeClean");
    if(trc.length >0){
        for(var i=trc.length-1;i>=0;i--){
            cleanHtml(trc.get(i));
        }
    }

    // t.find(".lyrow .lyrow .lyrow .lyrow .lyrow .removeClean").each(function () {
    //     cleanHtml(this)
    // });
    // t.find(".lyrow .lyrow .lyrow .lyrow .removeClean").each(function () {
    //     cleanHtml(this)
    // });
    // t.find(".lyrow .lyrow .lyrow .removeClean").each(function () {
    //     cleanHtml(this)
    // });
    // t.find(".lyrow .lyrow .removeClean").each(function () {
    //     cleanHtml(this)
    // });
    // t.find(".lyrow .removeClean").each(function () {
    //     cleanHtml(this)
    // });
    // t.find(".removeClean").each(function () {
    //     cleanHtml(this)
    // });
    t.find(".removeClean").remove();
    $("#download-layout .column").removeClass("ui-sortable");
    $("#download-layout .form").removeClass("ui-sortable"); // 增加form
    $("#download-layout .row-fluid").removeClass("clearfix").children().removeClass("column");
    if ($("#download-layout .container").length > 0) {
        changeStructure("row-fluid", "row")
    }
    formatSrc = $.htmlClean($("#download-layout").html(), {
        format: true,
        allowedAttributes: [["id"], ["class"], ["data-toggle"], ["data-target"], ["data-parent"], ["role"], ["data-dismiss"], ["aria-labelledby"], ["aria-hidden"], ["data-slide-to"], ["data-slide"]]
    });
    $("#download-layout").html(formatSrc);
    $("#downloadModal textarea").empty();
    $("#downloadModal textarea").val(formatSrc)
}
var currentDocument = null;
var timerSave = 2e3;
var stopsave = 0;
var startdrag = 0;
// 缓存demo源码，在保存的时候对比是否有变更
var demoHtml = $(".demo").html();

function restoreData(){
    if (supportstorage()) {
        layouthistory = JSON.parse(localStorage.getItem("layoutdata3"));
        if (!layouthistory) return false;
        window.demoHtml = layouthistory.list[layouthistory.count-1];
        if (window.demoHtml) $(".demo").html(window.demoHtml);
    }
}

$(window).resize(function () {
    $("body").css("min-height", $(window).height() - 90);
    $(".demo").css("min-height", $(window).height() - 160)
});

function bindSortable() {
    //使得全局布局可排序，用于拖动切换
    $(".demo, .demo .column,.demo .form").sortable({
        connectWith: ".column,.form",
        opacity: .35,
        handle: ".drag",
        start: function(e,t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        stop: function(e,t) {
            if(stopsave>0) stopsave--;
            startdrag = 0;
        }
    });
}

function initContainer(){
    bindSortable();
    // 绑定配置事件
    configurationElm();
}

// 可编辑
function editable() {
    // $(".demo .view label").attr("contenteditable",true);
    $(".sidebar-nav .box > .preview").each(function(){
        var configuration = $(this).prev();
        if(configuration.hasClass("configuration")){
            // 存在configuration
            if(configuration.children("[data-target='#editorModal']").length == 0){
                // 没有【编辑】按钮,需要添加
                var editeBtn = $('<button type="button" class="btn btn-default btn-xs" data-target="#editorModal" role="button" data-toggle="modal">编辑</button>');
                configuration.prepend(editeBtn);
            }
        }else{
            // 没有configuration，需要添加
            configuration = $("<span class=\"configuration\"><button type=\"button\" class=\"btn btn-default btn-xs\" data-target=\"#editorModal\" role=\"button\" data-toggle=\"modal\">编辑</button></span>");
            $(this).before(configuration);
        }
    });
}


// 初始化
$(document).ready(function () {

    // 启用编辑
    editable();

    CKEDITOR.disableAutoInline = true;
    restoreData();
    var contenthandle = CKEDITOR.replace( 'contenteditor' ,{
        language: 'zh-cn',
        contentsCss: ['css/bootstrap.css'],
        allowedContent: true
    });

    $("body").css("min-height", $(window).height() - 90);
    $(".demo").css("min-height", $(window).height() - 160);

    // 给【布局设置】绑定拖动事件
    $(".sidebar-nav .lyrow").draggable({
        connectToSortable: ".demo",
        helper: "clone",
        handle: ".drag",
        start: function(e,t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        drag: function(e, t) {
            t.helper.width(400)
        },
        stop: function(e, t) {
            bindSortable();
        }
    });
    // 给其他组件绑定拖动事件
    $(".sidebar-nav .box").draggable({
        connectToSortable: ".column",
        helper: "clone",
        handle: ".drag",
        start: function(e,t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        drag: function(e, t) {
            t.helper.width(400)
        },
        stop: function() {
            handleJsIds();
            bindSortable();
        }
    });

    // 初始化container事件
    initContainer();

    $('body.edit .demo').on("click","[data-target=#editorModal]",function(e) {
        e.preventDefault();
        currenteditor = $(this).parent().parent().find('.view');
        var eText = currenteditor.html();
        contenthandle.setData(eText);
    });

    $("#savecontentck").click(function(e) {
        e.preventDefault();
        currenteditor.html(contenthandle.getData());
    });

    // 绑定相关按钮事件
    $("[data-target=#downloadModal]").click(function (e) {
        e.preventDefault();
        downloadLayoutSrc()
    });
    $("#download").click(function () {
        downloadLayout();
        return false
    });
    $("#downloadhtml").click(function () {
        downloadHtmlLayout();
        return false
    });
    $("#edit").click(function () {
        $("body").removeClass("devpreview sourcepreview");
        $("body").addClass("edit");
        removeMenuClasses();
        $(this).addClass("active");
        return false
    });
    $("#clear").click(function (e) {
        e.preventDefault();
        clearDemo()
    });
    $("#devpreview").click(function () {
        $("body").removeClass("edit sourcepreview");
        $("body").addClass("devpreview");
        removeMenuClasses();
        $(this).addClass("active");
        return false
    });
    $("#sourcepreview").click(function () {
        $("body").removeClass("edit");
        $("body").addClass("devpreview sourcepreview");
        removeMenuClasses();
        $(this).addClass("active");
        return false
    });
    $(".nav-header").click(function () {
        $(".sidebar-nav .boxes, .sidebar-nav .rows").hide();
        $(this).next().slideDown()
    });

    $("#savecontent").click(function(e) {
        e.preventDefault();
        handleSaveLayout();
    });

    $('#undo').click(function(){
        stopsave++;
        if (undoLayout()) initContainer();
        stopsave--;
    });
    $('#redo').click(function(){
        stopsave++;
        if (redoLayout()) initContainer();
        stopsave--;
    });

    // 绑定移除事件
    removeElm();
    // 表格系统生成
    gridSystemGenerator();
    // 定时保存
    setInterval(function () {
        handleSaveLayout()
    }, timerSave)
})
