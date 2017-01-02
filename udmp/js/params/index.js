/**
 * Description:
 * @author Seadon
 * @date 2016年2月18日
 *
 */

define(function(require, exports, module) {
  //require('udmp/seajs-control');
  require('echarts');
  window.onload = function() {
    //i_web_pg.finish()
  };
  // 基于准备好的dom，初始化echarts实例
  var vocChart = echarts.init(document.getElementById('i-chart-voc'));
  // 指定图表的配置项和数据
  var v_option = {
    title: {
      text: '数据消费交易类型',
      //subtext: '纯属虚构',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>  {b}: ({c}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['联机实时交易', '本地实时交易', '联机异步交易']
    },
    series: [{
      name: '数据消费',
      type: 'pie',
      radius: '55%',
      center: ['50%', '55%'],
      data: [{
        value: 14,
        name: '联机实时交易'
      }, {
        value: 16,
        name: '本地实时交易'
      }, {
        value: 70,
        name: '联机异步交易'
      }, ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  // 使用刚指定的配置项和数据显示图表。
  vocChart.setOption(v_option);

//基于准备好的dom，初始化echarts实例
  var sigChart = echarts.init(document.getElementById('i-chart-signal'));
  // 指定图表的配置项和数据
  var s_option = {
    title: {
      text: '按部门消费',
      //subtext: '纯属虚构',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>  {b}: ({c}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['企金客户信息系统', '大数据智能风控系统', 'OTO对公预约开户系统']
    },
    series: [{
      name: '数据消费',
      type: 'pie',
      radius: '55%',
      center: ['53%', '55%'],
      data: [{
        value: 55,
        name: '企金客户信息系统'
      }, {
        value: 25,
        name: '大数据智能风控系统'
      }, {
        value: 20,
        name: 'OTO对公预约开户系统'
      }, ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  
  sigChart.setOption(s_option);

  function rechart() {
    vocChart.resize();
    sigChart.resize();
  }
  (function($) {
    $(window).resize(function() {
      rechart();
    })
    $(".i-indent,#i-tabs-thome").on('click', function() {
      setTimeout(rechart, 100);
    })
  }(jQuery))
});
