(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name sy.Dashboard.controller : sy.DashboardCtrl
     * 코드관리
     */
    angular.module("sy.Dashboard.controller")
        .controller("sy.SaCntCtrl", ['$scope', 'sy.DashboardSvc', '$timeout', 'UtilSvc', 
            function ($scope, MaDashboardSvc, $timeout, UtilSvc) {
	        $scope.$on('dashboard:query', function(event, payload) {
	            MaDashboardSvc.setPayload(saCnt, payload);
	            $timeout(function() {
	            	saCnt.find();
	            });
	        });
	
	        var today       = edt.getToday(),
	            period      = { startYear: today.y, startMonth: today.m, endYear: today.y, endMonth: today.m },
            	grid_header = {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
            	tableDataSource = { autoBind: false,
						transport: {
							read: function(e) {
							}
						},
						schema: {
							model: {
								fields: {
									CD_DEF : {type:"string"},
									NM_DEF : {type:"string"},
									CNT    : {type:"number"}
								}
							}
						}
					},
				chartDataSource = {
			        	transport: {
			        		read: function(e) {
			        		}
			        	}
					};
	
	        var saCnt = $scope.saCnt = {
	            tabName     : '',
	            code        : {},
	            table       : {},
	            chart       : {},
	
	            find: function() {
	                var me      = this,
	                    isChart = me.tabName === 'CHART',
	                    target  = isChart ? saCnt.chart : saCnt.table;
	                
	                var param = {
    					procedureParam : "USP_SY_01DASHBOARD02_GET&DTS_JOINREQSTRT@s|DTS_JOINREQEND@s",
    					DTS_JOINREQSTRT: target.search.period.startYear+target.search.period.startMonth+"01000000",
    					DTS_JOINREQEND : target.search.period.endYear+target.search.period.endMonth+"32000000"
    				};
	            	
        			UtilSvc.getList(param).then(function (res) {
        				res.data.results.forEach(function (data) {
    						data.forEach(function (lData) {
    							lData.CNT = Number(lData.CNT);
    						});
    					});
        				
        				if(!isChart) {
        					target.optionsOrd.dataSource.data(res.data.results[0]);
        					target.optionsCcl.dataSource.data(res.data.results[1]);
        					target.optionsTkbk.dataSource.data(res.data.results[2]);
        					target.optionsEchg.dataSource.data(res.data.results[3]);
        				}
        				else {
        					target.dataOrd.data(res.data.results[0]);
        					target.dataCcl.data(res.data.results[1]);
        					target.dataTkbk.data(res.data.results[2]);
        					target.dataEchg.data(res.data.results[3]);
        				}
        			});
	            }
	        };
	
	        saCnt.table = {
	            search  : {
	                period      : angular.extend({ type: 'year' }, angular.copy(period))
	            },
	            data    : {}
	        };
	
	        saCnt.table.optionsOrd = {
        		messages: {
    				noRows: "정보가 존재하지 않습니다.",
    				loading: "정보를 가져오는 중...",
    				requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
    				retry: "갱신",
    			},
    			dataSource: new kendo.data.DataSource(tableDataSource),
    			columns: [
            		{field: "NM_DEF", width: 100, title: "주문상태", headerAttributes: grid_header, template:'<div style="text-align:center;">#=NM_DEF#</div>'},
          			{field: "CNT"   , width: 100, title: "건수"  , headerAttributes: grid_header, template:'<div style="text-align:right; margin-right:5px;">#=kendo.toString(CNT,"n0")#</div>'}
          		],
          		scrollable: false
	        };
	        saCnt.table.optionsCcl  = angular.copy(saCnt.table.optionsOrd);
	        saCnt.table.optionsCcl.dataSource = new kendo.data.DataSource(tableDataSource);
	        saCnt.table.optionsCcl.columns[0].title = "취소상태";
	        saCnt.table.optionsTkbk = angular.copy(saCnt.table.optionsOrd);
	        saCnt.table.optionsTkbk.dataSource = new kendo.data.DataSource(tableDataSource);
	        saCnt.table.optionsTkbk.columns[0].title = "반품상태";
	        saCnt.table.optionsEchg = angular.copy(saCnt.table.optionsOrd);
	        saCnt.table.optionsEchg.dataSource = new kendo.data.DataSource(tableDataSource);
	        saCnt.table.optionsEchg.columns[0].title = "교환상태";
	        
	        saCnt.chart = {
	            search: {
	                period      : angular.extend({ type: 'year' }, angular.copy(period))
	            },
	            data    : {}
	        };
	        saCnt.chart.options = {
	        	legend: {
	        		visible: false
	        	},
	        	seriesDefaults: {
	        		labels: {
	        			position: 'center',
                		visible: true,
                		background: 'transparent',
                		rotation: -310,
                		template: '#= category # #= value #건'
	        		}
	        	},
	        	seriesColors: ['#03a9f4', '#ff9800', '#fad84a', '#ffb2d9', '#f15f5f'],
	        	tooltip: {
	        		visible: true,
                	template: '${ category } ${ value }건'
	        	},
                chartArea: {
                	margin:{
                		top:20,
                		left:0,
                		right:0,
                		bottom:0
                	}
                },
                plotArea: {
                	margin:20
                }
	        };
	        
	        saCnt.chart.dataOrd  = new kendo.data.DataSource(chartDataSource);
	        saCnt.chart.dataCcl  = new kendo.data.DataSource(chartDataSource);
	        saCnt.chart.dataTkbk = new kendo.data.DataSource(chartDataSource);
	        saCnt.chart.dataEchg = new kendo.data.DataSource(chartDataSource);
        }]);
}());