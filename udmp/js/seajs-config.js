/**
 * Description:
 * @author Seadon
 * @date 2016年2月06日
 *
 */

//获取项目路径
var _cd_tname = window.document.location.pathname,
	_cd_pname = _cd_tname.substring(0, _cd_tname.substr(1).indexOf('/') + 1);

seajs.config({
	base: _cd_pname + '/static/',
	paths: {
		'udmp': _cd_pname + '/udmp/js/'
	},
	alias: {
		jquery: 'jquery/sea-jquery-1.11.3.min',
		bootstrap: 'bootstrap/3.3.5/js/bootstrap.min',
		echarts: 'echart/echarts.min',
		nicescroll: 'scroll/jquery.nicescroll.min',
		toastr: 'toastr/toastr.min',
		app_plugin: 'app/app_plugin',
		bs_table: 'bootstrap-table/bootstrap-table.min',
		bs_validator: 'bootstrap-validator/js/bootstrapValidator.min',
		jbox: 'jquery-jbox/2.3/jquery.jBox-2.3.min',
		bs_datetime: 'bootstrap-datetimepicker/js/bootstrap-datetimepicker.min',
		bs_datetime_cn: 'bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN'
	},
	vars: {
		locale: 'zh-CN'
	},
	preload: [
		'jquery'
	],
	charset: 'utf-8'
});
