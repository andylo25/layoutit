/**
 * 通用js函数
 * 
 * @version 2016-01-13
 * @author YeQingping
 */
var git = git || {};

/**
 * 是否为空串
 * 
 * @param s
 *            字符串
 * @returns {Boolean}
 */
git.isEmptyStr = function(s) {
	return (s === undefined || s === null || s === '' || s == 'undefined');
};

/**
 * 是否为空对象
 * 
 * @param o
 *            对象
 * @returns {Boolean}
 */
git.isNullObj = function(o) {
	return o === undefined || o === null;
};

/**
 * 将form表单元素的值序列化成对象
 * 
 * @example git.serializeObject($('#formId'))
 * @param form
 *            表单对象
 * @returns object
 */
git.serializeObject = function($form) {
	var o = {};
	$.each($form.serializeArray(), function(index) {
		if (o[this['name']]) {
			o[this['name']] = o[this['name']] + "," + this['value'];
		} else {
			o[this['name']] = this['value'];
		}
	});
	return o;
};
/**
 * 拷贝对象属性
 * 
 * @param source
 *            源对象
 * @param target
 *            目标对象
 * @param isOverride
 *            是否覆盖重复的属性
 */
git.copyProperties = function(source, target, isOverride) {
	for ( var prop in source) {
		if (isOverride || git.isNullObj(target[prop])) {
			target[prop] = source[prop];
		}
	}
};
/**
 * 将列表按树形结构(父子关系)排序
 * 
 * @param data
 *            列表数据
 * @param rootId
 *            根节点
 */
git.sort2TreeData = function(data, rootId) {
	var map = {};
	var tree = [];
	var i = 0;
	// 将列表转换为树形结构
	while (data.length != 0) {
		if (data[i].parentId == rootId) {
			tree.push({
				id : data[i].id,
				obj : data[i],
				children : []
			});
			map[data[i].id] = [ tree.length - 1 ];
			data.splice(i, 1);
			i--;
		} else {
			var mapArr = map[data[i].parentId];
			if (mapArr != undefined) {
				var obj = tree[mapArr[0]];
				for (var j = 1; j < mapArr.length; j++) {
					obj = obj.children[mapArr[j]];
				}

				obj.children.push({
					id : data[i].id,
					obj : data[i],
					children : []
				});
				map[data[i].id] = mapArr.concat([ obj.children.length - 1 ]);
				data.splice(i, 1);
				i--;
			}
		}
		i++;
		if (i > data.length - 1) {
			i = 0;
		}
	}
	var rows = [];
	// 将树转换为列表
	git.tree2Array(tree, rows);
	return rows;
};
/**
 * 将树形结构转换为列表
 * 
 * @param data
 *            列表数据
 * @param rootId
 *            根节点
 */
git.tree2Array = function(tree, rows) {
	$.each(tree, function(index) {
		rows.push(this.obj);
		if (this.children.length != 0) {
			git.tree2Array(this.children, rows);
		}
	});
};
/**
 * 字符串缩写
 * 
 * @param str
 *            字符串
 * @param length
 *            长度
 */
git.abbr = function(str, length) {
	if (str && str.length > length) {
		str = str.substr(0, length - 3) + "...";
	}
	return str;
};