(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name sy.Dashboard.controller : sy.DashboardCtrl
     * 코드관리
     */
    angular.module("sy.Dashboard.controller")
        .controller("sy.SaMonthCtrl", ['$scope', 'sy.DashboardSvc', '$timeout', 'UtilSvc', 
            function ($scope, MaDashboardSvc, $timeout, UtilSvc) {
	        $scope.$on('dashboard:query', function(event, payload) {
	            MaDashboardSvc.setPayload(saMonth, payload);
	            $timeout(function() {
	            	saMonth.find();
	            });
	        });
	
	        var today   = edt.getToday(),
	            period  = { startYear: today.y, startMonth: today.m, endYear: today.y, endMonth: today.m },
	            grid_con_center   = {"class":"table-cell", style: "text-align: center; font-size: 12px"},
	            grid_con_right    = {"class":"table-cell", style: "text-align: right; font-size: 12px"},
	            grid_con_left     = {"class":"table-cell", style: "text-align: left; font-size: 12px"},
	            grid_tot_center   = "<div class='table-cell' style='text-align:center; font-size:12px; color:red;'>총 합계</div>",
	            grid_tot_right    = "<div class='table-cell' style='text-align:right; font-size:12px; color:red;'>#= sum #</div>",
	            grid_group_center = "<div class='table-cell' style='text-align:center; font-size:12px; color:blue;'>그룹합계</div>",
	            grid_group_right  = "<div class='table-cell' style='text-align:right; font-size:12px; color:blue;'>#= sum #</div>",
	            grid_header       = {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"};
	        
	        var saMonth = $scope.saMonth = {
	            tabName     : '',
	            code        : {},
	            table       : {},
	            chart       : {},
	
	            find: function() {
	                var me      = this,
	                    isChart = me.tabName === 'CHART',
	                    target  = isChart ? saMonth.chart : saMonth.table;
	                
	                var param = {
    					procedureParam : "USP_SY_01DASHBOARD04_GET&DTS_JOINREQSTRT@s|DTS_JOINREQEND@s",
    					DTS_JOINREQSTRT: target.search.period.startYear+target.search.period.startMonth+"01000000",
    					DTS_JOINREQEND : target.search.period.endYear+target.search.period.endMonth+"32000000"
    				};      
	            	
        			UtilSvc.getList(param).then(function (res) {
    					var sumCntT1 = 0,
    						sumCntT2 = 0,
    						sumCntT3 = 0,
    						sumCntT4 = 0,
    						iIndex = 0;
    					res.data.results[0].forEach(function (data) {
    						sumCntT1 = sumCntT1 + data.T1_CNT;
    						sumCntT2 = sumCntT2 + data.T2_CNT;
    						sumCntT3 = sumCntT3 + data.T3_CNT;
    						sumCntT4 = sumCntT4 + data.T4_CNT;
    						data.SUM_T1_CNT = sumCntT1;
    						data.SUM_T2_CNT = sumCntT2;
    						data.SUM_T3_CNT = sumCntT3;
    						data.SUM_T4_CNT = sumCntT4;
    					});
    					target.dataSource.data(res.data.results[0]);
        			});
	            }
	        };
	
	        saMonth.table = {
	            search  : {
	                period      : angular.extend({ type: 'year' }, angular.copy(period))
	            },
	            data    : {},
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
                			id: "ROW_NUM",
    						fields: {
    							YYMM  : {type:"string"},
    							T1_CNT : {type:"number"},
    							T2_CNT : {type:"number"},
    							T3_CNT : {type:"number"},
    							T4_CNT : {type:"number"}
    						}
    					}
    				},
              		sort:{field:"YYMM",dir:"asc"}
    			}),
    			columns: [
            		{field: "YYMM" , width: 100, attributes: grid_con_center, title:  "년/월", headerAttributes: grid_header},
          			{field: "T1_CNT", width: 100, attributes: grid_con_right , title: "주문완료"  , headerAttributes: grid_header},
          			{field: "T2_CNT", width: 100, attributes: grid_con_right , title: "취소완료"  , headerAttributes: grid_header},
          			{field: "T3_CNT", width: 100, attributes: grid_con_right , title: "반품완료" , headerAttributes: grid_header},
          			{field: "T4_CNT", width: 100, attributes: grid_con_right , title: "교환완료" , headerAttributes: grid_header},
          			{field: "detail", title: " "}
          		],
          		sortable: {
          			mode: "single",
          			allowUnsort: false,
          			showIndexes: true
          		}
	        };
	
	        saMonth.chart = {
	            search: {
	                selected : '000',
	                period   : angular.extend({ type: 'year' }, angular.copy(period))
	            },
	            dataSource: new kendo.data.DataSource({
	            	transport: {
		        		read: function(e) {
		        			
		        		}
		        	}
	            })
	        };
	        saMonth.chart.options = {
        		legend: {
	        		visible: true,
	        		position: 'bottom'
	        	},
	        	series: [{
	        		field:'T1_CNT',
	        		name: '주문완료'
	        	},{
	        		field:'T2_CNT',
	        		name: '취소완료'
	        	},{
	        		field:'T3_CNT',
	        		name: '반품완료'
	        	},{
	        		field:'T4_CNT',
	        		name: '교환완료'
	        	},{
	        		type: 'line',
	        		field:'SUM_T1_CNT',
	        		name: '주문완료누적',
	        		axis: "line"
	        	},{
	        		type: 'line',
	        		field:'SUM_T2_CNT',
	        		name: '취소완료누적',
	        		axis: "line"
	        	},{
	        		type: 'line',
	        		field:'SUM_T3_CNT',
	        		name: '반품완료누적',
	        		axis: "line"
	        	},{
	        		type: 'line',
	        		field:'SUM_T4_CNT',
	        		name: '교환완료누적',
	        		axis: "line"
	        	}],
	        	categoryAxis: {
	        		field: "YYMM",
	        		majorGridLines: {
	        			visible: false
	        		},
	        		axisCrossingValue: [0, 12]
	        	},
	        	valueAxis: [{
	        		labels: {
	        			format: ""
	        		},
	        		majorUnit: 1,
	        		line: {
	        			visible: false
	        		},
	        		title: { text: "월단위" }
	        	},{
	        		name: "line",
	        		min: 0,
	        		magjorUnit: 5,
	        		title: { text: "누적단위" }
	        	}],
	        	seriesColors: ['#9ddffb', '#ffcf88', '#fdea9f', '#03a9f4', '#ff9800', '#fad84a', '#7575ff', '#ffb2d9'],
	        	tooltip: {
	        		visible: true,
                	template: '${ series.name } ${ value }건'
	        	},
	        	chartArea: {
	        		height:300
	        	}
	        };
        }]);
}());