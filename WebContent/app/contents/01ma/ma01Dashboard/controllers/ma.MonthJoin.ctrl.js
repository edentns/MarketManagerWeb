(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name ma.Dashboard.controller : ma.DashboardCtrl
     * 코드관리
     */
    angular.module("ma.Dashboard.controller")
        .controller("ma.MonthJoinCtrl", ['$scope', 'ma.DashboardSvc', '$timeout', 'UtilSvc', 
            function ($scope, MaDashboardSvc, $timeout, UtilSvc) {
	        $scope.$on('dashboard:query', function(event, payload) {
	            MaDashboardSvc.setPayload(monthJoin, payload);
	            $timeout(function() {
	            	monthJoin.find();
	            });
	        });
	
	        var today   = edt.getToday(),
	            period  = { startYear: today.y, startMonth: today.m, endYear: today.y, endMonth: today.m },
	            grid_con_center   = {"class":"table-cell", style: "text-align: center; font-size: 12px"},
	            grid_con_right    = {"class":"table-cell", style: "text-align: right; font-size: 12px"},
	            grid_con_left     = {"class":"table-cell", style: "text-align: left; font-size: 12px"},
	            grid_tot_center   = "<div class='table-footer-cell' style='text-align:center; font-size:12px; color:red;'>총 합계</div>",
	            grid_tot_right    = "<div class='table-footer-cell' style='text-align:right; font-size:12px; color:red;'>#= sum #</div>",
	            grid_group_center = "<div class='table-cell' style='text-align:center; font-size:12px; color:blue;'>그룹합계</div>",
	            grid_group_right  = "<div class='table-cell' style='text-align:right; font-size:12px; color:blue;'>#= sum #</div>",
	            grid_header       = {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"};
	        
	        var monthJoin = $scope.monthJoin = {
	            tabName     : '',
	            code        : {},
	            table       : {},
	            chart       : {},
	
	            find: function() {
	                var me      = this,
	                    isChart = me.tabName === 'CHART',
	                    target  = isChart ? monthJoin.chart : monthJoin.table;
	                
	                var param = {
    					procedureParam : "USP_MA_01DASHBOARD02_GET&DTS_JOINREQSTRT@s|DTS_JOINREQEND@s",
    					DTS_JOINREQSTRT: target.search.period.startYear+target.search.period.startMonth+"01000000",
    					DTS_JOINREQEND : target.search.period.endYear+target.search.period.endMonth+"32000000"
    				};      
	            	
        			UtilSvc.getList(param).then(function (res) {
        				res.data.results[0].forEach(function (data) {
    						data.CNT_001 = Number(data.CNT_001);
    						data.CNT_002 = Number(data.CNT_002);
    						data.CNT_003 = Number(data.CNT_003);
    						data.TOT_CNT = Number(data.TOT_CNT);
    					});
        				target.dataSource.data(res.data.results[0]);
        				target.search.codeList = res.data.results[1];
        				if(isChart) {
        					var sumCnt001 = [0,0,0,0],
        						sumCnt002 = [0,0,0,0],
        						sumCnt003 = [0,0,0,0],
        						sumTot    = [0,0,0,0],
        						iIndex = 0;
        					res.data.results[2].forEach(function (data) {
        						data.CNT_001 = Number(data.CNT_001);
        						data.CNT_002 = Number(data.CNT_002);
        						data.CNT_003 = Number(data.CNT_003);
        						data.TOT_CNT = Number(data.TOT_CNT);
        						if(data.CD_DEF === "000") iIndex = 0;
        						else if(data.CD_DEF === "001") iIndex = 1;
        						else if(data.CD_DEF === "002") iIndex = 2;
        						else if(data.CD_DEF === "003") iIndex = 3;

        						sumCnt001[iIndex] = sumCnt001[iIndex] + data.CNT_001;
        						sumCnt002[iIndex] = sumCnt002[iIndex] + data.CNT_002;
        						sumCnt003[iIndex] = sumCnt003[iIndex] + data.CNT_003;
        						sumTot[iIndex] = sumTot[iIndex] + data.TOT_CNT;
        						data.SUM_CNT_001 = sumCnt001[iIndex];
        						data.SUM_CNT_002 = sumCnt002[iIndex];
        						data.SUM_CNT_003 = sumCnt003[iIndex];
        						data.SUM_TOT_CNT = sumTot[iIndex];
        					});
        					target.dataSource.data(res.data.results[2]);
        					
        					var chart = $("#monthJoinChart").data("kendoChart");
    	                	monthJoin.chart.dataSource.filter({field:"CD_DEF", operator:"startswith", value:monthJoin.chart.search.selected});;
    	                	chart.refresh();
        				}
        			});
	            }
	        };
	
	        monthJoin.table = {
	            search  : {
	                period      : angular.extend({ type: 'year' }, angular.copy(period))
	            },
	            total   : {
	                CNT_001 : 0,
	                CNT_002 : 0,
	                CNT_003 : 0
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
    							ROW_NUM   : {type:"string"},
    							YM_JOINREQ: {type:"string"},
    							CD_DEF    : {type:"string"},
    							NM_DEF    : {type:"string"},
    							TOT_CNT   : {type:"number"},
    							CNT_001   : {type:"number"},
    							CNT_002   : {type:"number"},
    							CNT_003   : {type:"number"},
    							detail    : {type:"string"}
    						}
    					}
    				},
    				group: {
    					field: "NM_DEF", 
    					aggregates: [
    		    					    {field: "TOT_CNT", aggregate:"sum"},
    		    					    {field: "CNT_001", aggregate:"sum"},
    		    					    {field: "CNT_002", aggregate:"sum"},
    		    					    {field: "CNT_003", aggregate:"sum"}
    		    					]
    				},
					aggregate: [
					            	{field: "TOT_CNT", aggregate:"sum"},
					            	{field: "CNT_001", aggregate:"sum"},
					            	{field: "CNT_002", aggregate:"sum"},
		    					    {field: "CNT_003", aggregate:"sum"}
		    					],
              		sort:{field:"YM_JOINREQ",dir:"asc"}
    			}),
    			columns: [
            		{field: "YM_JOINREQ", width: 100, attributes: grid_con_center, footerTemplate: grid_tot_center, groupFooterTemplate: grid_group_center, title: "가입요청년월", headerAttributes: grid_header},
          			{field: "NM_DEF"    , width: 100, attributes: grid_con_center,                                                                          title: "가입상태명" , headerAttributes: grid_header},
          			{field: "TOT_CNT"   , width: 100, attributes: grid_con_right , footerTemplate: grid_tot_right , groupFooterTemplate: grid_group_right , title: "전체건수"  , headerAttributes: grid_header},
          			{field: "CNT_001"   , width: 100, attributes: grid_con_right , footerTemplate: grid_tot_right , groupFooterTemplate: grid_group_right , title: "무료건수"  , headerAttributes: grid_header},
          			{field: "CNT_002"   , width: 100, attributes: grid_con_right , footerTemplate: grid_tot_right , groupFooterTemplate: grid_group_right , title: "월정액건수" , headerAttributes: grid_header},
          			{field: "CNT_003"   , width: 100, attributes: grid_con_right , footerTemplate: grid_tot_right , groupFooterTemplate: grid_group_right , title: "연간액건수" , headerAttributes: grid_header},
          			{field: "detail"    , title: " "}
          		],
          		sortable: {
          			mode: "single",
          			allowUnsort: false,
          			showIndexes: true
          		},
          		scrollable: false,
          		groupable: false
	        };
	
	        monthJoin.chart = {
	            search: {
	                selected : '000',
	                period   : angular.extend({ type: 'year' }, angular.copy(period)),
	                changeSelectedData: function() {
	                	var chart = $("#monthJoinChart").data("kendoChart");
	                	monthJoin.chart.dataSource.filter({field:"CD_DEF", operator:"startswith", value:monthJoin.chart.search.selected});;
	                	chart.refresh();
	                }
	            },
	            data    : {}
	        };
	        monthJoin.chart.options = {
        		legend: {
	        		visible: true,
	        		position: 'bottom'
	        	},
	        	series: [{
	        		field:'CNT_001',
	        		name: '무료'
	        	},{
	        		field:'CNT_002',
	        		name: '월정액'
	        	},{
	        		field:'CNT_003',
	        		name: '연간액'
	        	},{
	        		type: 'line',
	        		field:'SUM_CNT_001',
	        		name: '무료누적',
	        		axis: "line"
	        	},{
	        		type: 'line',
	        		field:'SUM_CNT_002',
	        		name: '월정액누적',
	        		axis: "line"
	        	},{
	        		type: 'line',
	        		field:'SUM_CNT_003',
	        		name: '연간액누적',
	        		axis: "line"
	        	},{
	        		type: 'line',
	        		field:'SUM_TOT_CNT',
	        		name: '전체누적',
	        		axis: "line"
	        	}],
	        	categoryAxis: {
	        		field: "YM_JOINREQ",
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
	        	seriesColors: ['#9ddffb', '#ffcf88', '#fdea9f', '#03a9f4', '#ff9800', '#fad84a', '#7575ff'],
	        	tooltip: {
	        		visible: true,
                	template: '${ series.name } ${ value }건'
	        	},
	        	height:300
	        };
	        
	        monthJoin.chart.dataSource = new kendo.data.DataSource({
	        	transport: {
	        		read: function(e) {
	        			
	        		}
	        	},
	        	filter: {field:"CD_DEF", operator:"startswith", value:"001"}
	        });
        }]);
}());