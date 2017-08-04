(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name sy.Dashboard.controller : sy.DashboardCtrl
     * 코드관리
     */
    angular.module("sy.Dashboard.controller")
        .controller("sy.MrkSaCntCtrl", ['$scope', 'sy.DashboardSvc', '$timeout', 'UtilSvc', 
            function ($scope, MaDashboardSvc, $timeout, UtilSvc) {
	        $scope.$on('dashboard:query', function(event, payload) {
	            MaDashboardSvc.setPayload(mrkSaCnt, payload);
	            $timeout(function() {
	            	mrkSaCnt.find();
	            });
	        });
	
	        var today   = edt.getToday(),
	            period  = { startYear: today.y, startMonth: today.m, endYear: today.y, endMonth: today.m },
            	grid_header       = {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"};
	
	        var mrkSaCnt = $scope.mrkSaCnt = {
	            tabName     : '',
	            code        : {},
	            table       : {},
	            chart       : {},
	
	            find: function() {
	                var me      = this,
	                    isChart = me.tabName === 'CHART',
	                    target  = isChart ? mrkSaCnt.chart : mrkSaCnt.table;
	                
	                var param = {
    					procedureParam : "USP_SY_01DASHBOARD03_GET"
    				};
	            	
        			UtilSvc.getList(param).then(function (res) {
        				res.data.results[0].forEach(function (data) {
        					data.QT_NEWORD  = Number(data.QT_NEWORD);
        					data.QT_CCL     = Number(data.QT_CCL);
        					data.QT_TKBK    = Number(data.QT_TKBK);
        					data.QT_ECHG    = Number(data.QT_ECHG);
        					data.QT_INQ     = Number(data.QT_INQ);
        					data.QT_ITEMINQ = Number(data.QT_ITEMINQ);
        					data.QT_SHPRDY  = Number(data.QT_SHPRDY);
        					data.QT_SHPING  = Number(data.QT_SHPING);
        					data.QT_SHPCPLT = Number(data.QT_SHPCPLT);
        					data.QT_REGITEM = Number(data.QT_REGITEM);
    					});
        				
        				target.options.dataSource.data(res.data.results[0]);
        			});
	            }
	        };
	
	        mrkSaCnt.table = {
	            search  : {
	                period      : angular.extend({ type: 'year' }, angular.copy(period))
	            },
	            data    : {}
	        };
	
	        mrkSaCnt.table.options = {
        		messages: {
    				noRows: "정보가 존재하지 않습니다.",
    				loading: "정보를 가져오는 중...",
    				requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
    				retry: "갱신",
    			},
    			dataSource: new kendo.data.DataSource({
    				autoBind: false,
    				transport: {
    					read: function(e) {
    					}
    				},
    				schema: {
    					model: {
    						fields: {
    							NO_MRK    : {type:"string"},
    							NM_MRK    : {type:"string"},
    							QT_NEWORD : {type:"number"},
    							QT_CCL    : {type:"number"},
    							QT_TKBK   : {type:"number"},
    							QT_ECHG   : {type:"number"},
    							QT_INQ    : {type:"number"},
    							QT_ITEMINQ: {type:"number"},
    							QT_SHPRDY : {type:"number"},
    							QT_SHPING : {type:"number"},
    							QT_SHPCPLT: {type:"number"},
    							QT_REGITEM: {type:"number"}
    						}
    					}
    				}
    			}),
    			columns: [
            		{field: "NM_MRK"    , width: 100, headerAttributes: grid_header, template:'<div style="text-align:center;">#=NM_MRK#</div>', title: "마켓명"},
          			{field: "QT_NEWORD" , width: 100, headerAttributes: grid_header, template:'<div style="text-align:right; margin-right:5px;">#=kendo.toString(QT_NEWORD ,"n0")#</div>', title: "신규주문"},
          			{field: "QT_CCL"    , width: 100, headerAttributes: grid_header, template:'<div style="text-align:right; margin-right:5px;">#=kendo.toString(QT_CCL    ,"n0")#</div>', title: "취소"},
          			{field: "QT_TKBK"   , width: 100, headerAttributes: grid_header, template:'<div style="text-align:right; margin-right:5px;">#=kendo.toString(QT_TKBK   ,"n0")#</div>', title: "반품"},
          			{field: "QT_ECHG"   , width: 100, headerAttributes: grid_header, template:'<div style="text-align:right; margin-right:5px;">#=kendo.toString(QT_ECHG   ,"n0")#</div>', title: "교환"},
          			{field: "QT_INQ"    , width: 100, headerAttributes: grid_header, template:'<div style="text-align:right; margin-right:5px;">#=kendo.toString(QT_INQ    ,"n0")#</div>', title: "문의"},
          			{field: "QT_ITEMINQ", width: 100, headerAttributes: grid_header, template:'<div style="text-align:right; margin-right:5px;">#=kendo.toString(QT_ITEMINQ,"n0")#</div>', title: "아이템문의"},
          			{field: "QT_SHPRDY" , width: 100, headerAttributes: grid_header, template:'<div style="text-align:right; margin-right:5px;">#=kendo.toString(QT_SHPRDY ,"n0")#</div>', title: "배송준비"},
          			{field: "QT_SHPING" , width: 100, headerAttributes: grid_header, template:'<div style="text-align:right; margin-right:5px;">#=kendo.toString(QT_SHPING ,"n0")#</div>', title: "배송중"},
          			{field: "QT_SHPCPLT", width: 100, headerAttributes: grid_header, template:'<div style="text-align:right; margin-right:5px;">#=kendo.toString(QT_SHPCPLT,"n0")#</div>', title: "배송완료"},
          			{field: "QT_REGITEM", width: 100, headerAttributes: grid_header, template:'<div style="text-align:right; margin-right:5px;">#=kendo.toString(QT_REGITEM,"n0")#</div>', title: "등록상품"}
          		],
          		scrollable: false
	        };
	        
	        mrkSaCnt.chart = {
	            data    : {}
	        };
	        mrkSaCnt.chart.options = {
        		legend: {
	        		visible: true,
	        		position: 'bottom'
	        	},
	        	series: [{
	        		field:'QT_NEWORD',
	        		name: '신규주문'
	        	},{
	        		field:'QT_CCL',
	        		name: '취소'
	        	},{
	        		field:'QT_TKBK',
	        		name: '반품'
	        	},{
	        		field:'QT_ECHG',
	        		name: '교환'
	        	},{
	        		field:'QT_INQ',
	        		name: '문의'
	        	},{
	        		field:'QT_ITEMINQ',
	        		name: '아이템문의'
	        	},{
	        		field:'QT_SHPRDY',
	        		name: '배송준비'
	        	},{
	        		field:'QT_SHPING',
	        		name: '배송중'
	        	},{
	        		field:'QT_SHPCPLT',
	        		name: '배송완료'
	        	},{
	        		field:'QT_REGITEM',
	        		name: '등록상품'
	        	}],
	        	categoryAxis: {
	        		field: "NM_MRK",
	        		majorGridLines: {
	        			visible: false
	        		}
	        	},
	        	valueAxis: [{
	        		labels: {
	        			format: ""
	        		},
	        		majorUnit: 5,
	        		line: {
	        			visible: false
	        		},
	        		title: { text: "건수" }
	        	}],
	        	seriesColors: ['#9ddffb', '#ffcf88', '#fdea9f', '#03a9f4', '#ff9800', '#fad84a', '#7575ff', '#ffb2d9', '#f15f5f', '#a6a6a6'],
	        	tooltip: {
	        		visible: true,
                	template: '${ series.name } ${ value }건'
	        	},
	        	height:200
	        };
	        
	        mrkSaCnt.chart.options.dataSource = new kendo.data.DataSource({
	        	transport: {
	        		read: function(e) {
	        		}
	        	}
	        });
        }]);
}());