(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name ma.Dashboard.controller : ma.DashboardCtrl
     * 코드관리
     */
    angular.module("ma.Dashboard.controller")
        .controller("ma.MrkItlListCtrl", ['$scope', 'ma.DashboardSvc', '$timeout', 'UtilSvc', 
            function ($scope, MaDashboardSvc, $timeout, UtilSvc) {
	        $scope.$on('dashboard:query', function(event, payload) {
	            MaDashboardSvc.setPayload(mrkItlList, payload);
	            $timeout(function() {
	            	mrkItlList.find();
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
	        
	        var mrkItlList = $scope.mrkItlList = {
	            tabName     : '',
	            code        : {},
	            table       : {},
	            chart       : {},
	
	            find: function() {
	                var me      = this,
	                    isChart = me.tabName === 'CHART',
	                    target  = isChart ? mrkItlList.chart : mrkItlList.table;
	                
	                var param = {
    					procedureParam : "USP_MA_01DASHBOARD03_GET&DTS_JOINREQSTRT@s|DTS_JOINREQEND@s",
    					DTS_JOINREQSTRT: target.search.period.startYear+target.search.period.startMonth+"01000000",
    					DTS_JOINREQEND : target.search.period.endYear+target.search.period.endMonth+"32000000"
    				};      
	            	
        			UtilSvc.getList(param).then(function (res) {
        				if(isChart) {
        					res.data.results[1].forEach(function (data) {
        						data.YN_DEL = data.YN_DEL==="true"?true:false;
        					});
        					target.dataSource = res.data.results[1];
        				}
	        			else		target.dataSource.data(res.data.results[0]);
        			});        			
	            }
	        };
	
	        mrkItlList.table = {
	            search  : {
	                period      : angular.extend({ type: 'current' }, angular.copy(period))
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
                			id: "NO_MNGMRK",
    						fields: {
    							NO_MNGMRK : {type:"string"},
    							NM_MRK    : {type:"string"},
    							YN_DEL    : {type:"string"}
    						}
    					}
    				}
    			}),
    			columns: [
            		{field: "NO_MNGMRK", width: 100, attributes: grid_con_center, title: "마켓번호", headerAttributes: grid_header},
          			{field: "NM_MRK"   , width: 100, attributes: grid_con_left  , title: "마켓명" , headerAttributes: grid_header},
          			{field: "YN_DEL"   , width: 100, attributes: grid_con_center, title: "사용여부"  , headerAttributes: grid_header}
          		],
          		resizable: true
	        };
	
	        mrkItlList.chart = {
	            search: {
	                period   : angular.extend({ type: 'current' }, angular.copy(period)),
	                changeMngMrk: function(e, NO_MNGMRK, YN_DEL) {
	                	
	                	//console.log(e, "  데이터 --> [",NO_MNGMRK,"], [",YN_DEL,"];");
	                	if(confirm("상태를 변경 하시겠습니까?")){
		                	MaDashboardSvc.updateMngMrk(NO_MNGMRK, (e.checked)?'N':'Y').then(function (result) {
								alert("변경완료하였습니다.");
		                	});
	                	}
	                	else {
	                		mrkItlList.chart.dataSource.forEach(function (data) {
	                			if(data.NO_MNGMRK === NO_MNGMRK) {
	                				data.YN_DEL = !e.checked;
	                			}
        					}); 
	                	}
	                }
	            },
	            dataSource : []
	        };
        }]);
}());