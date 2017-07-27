(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name ma.Dashboard.controller : ma.DashboardCtrl
     * 코드관리
     */
    angular.module("ma.Dashboard.controller")
        .controller("ma.JoinItemCtrl", ['$scope', 'ma.DashboardSvc', '$timeout', 'UtilSvc', 
            function ($scope, MaDashboardSvc, $timeout, UtilSvc) {
	        $scope.$on('dashboard:query', function(event, payload) {
	            MaDashboardSvc.setPayload(joinItem, payload);
	            $timeout(function() {
	            	joinItem.find();
	            });
	        });
	
	        var today   = edt.getToday(),
	            period  = { startYear: today.y, startMonth: today.m, endYear: today.y, endMonth: today.m };
	
	        var joinItem = $scope.joinItem = {
	            tabName     : '',
	            code        : {},
	            table       : {},
	            chart       : {},
	
	            find: function() {
	                var me      = this,
	                    isChart = me.tabName === 'CHART',
	                    target  = isChart ? joinItem.chart : joinItem.table;
	                
	                var param = {
    					procedureParam : "USP_MA_01DASHBOARD01_GET&DTS_JOINREQSTRT@s|DTS_JOINREQEND@s",
    					DTS_JOINREQSTRT: target.search.period.startYear+target.search.period.startMonth+"01000000",
    					DTS_JOINREQEND : target.search.period.endYear+target.search.period.endMonth+"32000000"
    				};      
	            	
        			UtilSvc.getList(param).then(function (res) {
        				target.data = res.data.results[0];
        				if(res.data.results[0].length > 0) {
	        				if(isChart) {
	        					res.data.results[1].forEach(function (data) {
	        						data.CNT_001 = Number(data.CNT_001);
	        						data.CNT_002 = Number(data.CNT_002);
	        						data.CNT_003 = Number(data.CNT_003);
	        						data.TOT_CNT = Number(data.TOT_CNT);
	        					});
	        					target.config.data(res.data.results[1]);
	        				}
        				}
        			});
	            }
	        };
	
	        joinItem.table = {
	            search  : {
	                period      : angular.extend({ type: 'current' }, angular.copy(period))
	            },
	            total   : {
	                CNT_001 : 0,
	                CNT_002 : 0,
	                CNT_003 : 0
	            },
	            data    : {}
	        };
	
	        joinItem.chart = {
	            search: {
	                field       : 'TOT_CNT',
	                period      : angular.extend({ type: 'current' }, angular.copy(period)),
	                changeSelectedData: function() {
	                	var chart = $("#joinitemchart").data("kendoChart");
	                	chart.options.series[0].field = joinItem.chart.search.field;
	                	chart.refresh();
	                }
	            },
	            data    : {}
	        };
	        joinItem.chart.options = {
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
	        	seriesColors: ['#03a9f4', '#ff9800', '#fad84a'],
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
	        
	        joinItem.chart.config = new kendo.data.DataSource({
	        	transport: {
	        		read: function(e) {
	        			
	        		}
	        	}
	        });
        }]);
}());