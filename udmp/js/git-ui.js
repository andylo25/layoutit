/**
 * bootstrap3前端UI公共js函数
 * 
 * @version 2016-01-13
 * @author YeQingping
 */
var git = git || {};

/**
 * bootstrap-table函数
 */
git.table = {
	/**
	 * 初始化表格
	 * 
	 * @param $table
	 *            表格对象
	 * @param options
	 *            自定义表格属性
	 */
	init : function($table, options) {
		// 默认表格属性
		var defaultOptions = {
			classes : "table table-no-bordered table-hover",
			idField : "id",
			striped : true,
			pagination : true,
			undefinedText : "",
			sidePagination : "server",
			pageList : "[10, 30, 50, 100]",
			queryParams : "git.table.queryParams",
			responseHandler : "git.table.responseHandler"
		};
		// 拷贝自定义表格属性
		git.copyProperties(options, defaultOptions, true);
		$table.bootstrapTable(defaultOptions);
	},
	/**
	 * 查询
	 * 
	 * @param $table
	 *            表格对象
	 */
	query : function($table) {
		$table.bootstrapTable('refresh');
		return false;
	},
	/**
	 * 表格查询参数
	 * 
	 * @param params
	 *            查询参数
	 */
	queryParams : function(params) {
		var searchParams = git.serializeObject($("#searchForm"));
		searchParams.pageNo = (params.offset / params.limit) + 1;
		searchParams.pageSize = params.limit;
		return searchParams;
	},
	/**
	 * 表格响应处理(如果后台没有数据,返回的json对象没有rows属性,bootstrap-table插件不会刷新表格,这里判断如果没有rows属性,添加一个空的rows)
	 * 
	 * @param res
	 *            返回值
	 */
	responseHandler : function(res) {
		if (!res.hasOwnProperty("rows")) {
			res.rows = [];
		}
		return res;
	},
	/**
	 * 获取选中记录
	 * 
	 * @param $table
	 *            表格对象
	 */
	getSelections : function($table) {
		return $table.bootstrapTable("getSelections");
	},
	/**
	 * 获取选中记录id
	 * 
	 * @param $table
	 *            表格对象
	 */
	getSelectionsId : function($table) {
		var selections = $table.bootstrapTable("getSelections");
		var ids = [];
		$.each(selections, function(index) {
			ids.push(this.id);
		});
		return ids;
	},
	/**
	 * 获取单条选中记录id
	 * 
	 * @param $table
	 *            表格对象
	 */
	getSelectionId : function($table) {
		var selections = $table.bootstrapTable("getSelections");
		if (git.isNullObj(selections) || git.isNullObj(selections[0])) {
			alert("请选择一条记录!");
			return;
		}
		if (selections.length > 1) {
			alert("请只选择一条记录!");
			return;
		}
		return selections[0].id;
	},
	/**
	 * 根据唯一标识获取行(table必须设置uniqueId属性)
	 * 
	 * @param $table
	 *            表格对象
	 * @param uniqueId
	 *            唯一标识
	 */
	getRowByUniqueId : function($table, uniqueId) {
		return $table.bootstrapTable("getRowByUniqueId", uniqueId);
	}
};
/**
 * 树形表格
 */
git.treeTable = {
	/**
	 * 初始化树形表格
	 * 
	 * @param $table
	 *            表格对象
	 * @param options
	 *            自定义表格属性
	 * @param expandLevel
	 *            展开等级
	 * @param rootId
	 *            根节点
	 */
	init : function($table, options, expandLevel, rootId) {
		options.onLoadSuccess = function(data) {
			// 按树形结构从新排序列表
			var rows = git.sort2TreeData(data.rows, rootId);
			data.rows = rows;
			// 重新载入表格
			$table.bootstrapTable('load', data);
			// 在数据加载结束后转换为树形结构
			$table.treeTable({
				expandLevel : expandLevel
			});
		};
		git.table.init($table, options);
	},
	/**
	 * 展开所有节点
	 * 
	 * @param $table
	 *            表格对象
	 */
	expandAll : function($table) {
		$table.treeTable("expandAll");
	},
	/**
	 * 展开指定节点
	 * 
	 * @param $table
	 *            表格对象
	 * @param nodeId
	 *            节点id
	 */
	expandNode : function($table, nodeId) {
		$table.treeTable("expandNode", nodeId);
	},
	/**
	 * 关闭所有节点
	 * 
	 * @param $table
	 *            表格对象
	 */
	collapseAll : function($table) {
		$table.treeTable("collapseAll");
	},
	/**
	 * 关闭指定节点
	 * 
	 * @param $table
	 *            表格对象
	 * @param nodeId
	 *            节点id
	 */
	collapseNode : function($table, nodeId) {
		$table.treeTable("collapseNode");
	}
};