/**
 * Description:
 * @author Seadon
 * @date 2016年3月1日
 *
 */

define(function(require, exports, module) {
	require('udmp/seajs-handler');
	require('bs_table');

	var wt = window.top;
	(function($) {
		$(document).ready(function() {
			$("#contentTable").bootstrapTable();
		});
		function page(n, s) {
			$("#pageNo").val(n);
			$("#pageSize").val(s);
			$("#searchForm").submit();
			return false;
		}

		//return 选择的结果集字符串
		function chooseTableIds() {
			var selectRow = $("#contentTable").bootstrapTable('getSelections');
			var ids;
			if (selectRow.length < 1) {
				wt.showInfo("error", "请至少选中一行");
				return false;
			} else {
				for (var i = 0; i < selectRow.length; i++) {
					var id = $(selectRow[i]["signalNo"].trim()).text().trim();
					if (i == 0) {
						ids = id;
					} else {
						ids = ids + "," + id
					}
				}
				return ids;
			}
		}
		//点击查看详情
		$("#contentTable").delegate('td>a', 'click', function(e) {
				e && e.preventDefault();
				var $this = $(this),
					_s_no = $this.text();
				wt.showModal(wt.$ctx + '/warnSignal/tWarnInfo/view?id=' +
					_s_no, null, {
						title: '详细信息',
						width: 850
					})
			})
			//分发事件
		$('#i-btn-wtd').on('click', function() {
			var ids = chooseTableIds();
			if (ids) {
				wt.showModal(
					wt.$ctx + "/warnSignal/tWarnInfo/chooseRiskManager?ids=" +
					ids,
					null, {
						title: "选择人员",
						width: 500
					});
			}
		});
		//关闭事件
		$('#i-btn-close').on('click', function() {
			var ids = chooseTableIds();
			if (ids) {
				wt.showModal(wt.$ctx +
					"/warnSignal/tWarnInfo/clsSignal?ids=" +
					ids, null, {
						title: "信号关闭",
						width: 500
					});
			}
		});
		//查询事件
		$('#i-btn-query').on('click', function() {
			$("#searchForm").submit();
		})
	}(jQuery));
});
