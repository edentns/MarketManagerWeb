(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name te.OtherKendo.controller : te.OtherKendoCtrl
     * 부서관리
     */
    angular.module("te.OtherKendo.controller", [ 'kendo.directives', 'ngGrid' ])
        .controller("te.OtherKendoCtrl", ["$scope", "$q", "sy.CodeSvc", "te.OtherKendoSvc", "APP_CODE", "resData", "Page", "$state", 'MenuSvc', "$location", "$window", "UtilSvc",
            function ($scope, $q, SyCodeSvc, TeOtherKendoSvc, APP_CODE, resData, Page, $state, MenuSvc, $location, window, UtilSvc) {
	        	var page  = $scope.page = new Page({ auth: resData.access }),
	            today = edt.getToday();
	        	
	        	var otherKendoVO1 = $scope.otherKendoVO1 = {
	        		boxTitle : "검색",
	        		mcb01Data : [],
	        		mcb01Model : "",
	        		setting : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 2
	        		},
	        		mcb02Data : [],
	        		mcb02Model : "",
	        		selectedSaStatIds : [],
	        		saStatDataSource : [],
	        		datesetting : {
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month'],
						selected   : 'current',
						period : {
							start : angular.copy(today),
							end   : angular.copy(today)
						}
	        		},
	        		perTpCdList : [{CD:'1',NAME:'주문일자'},{CD:'2',NAME:'결제일자'}]
	        	};
	        	
	        	otherKendoVO1.initLoad = function() {
	        		var self = this;
	        		self.inquiry();
	        		
					var param = {
						procedureParam:"USP_SY_10CODE02_GET&L_NO_MNGCDHD@s|L_CD_CLS@s",
						L_NO_MNGCDHD:"SYCH00001",
						L_CD_CLS:"SY_000001"
					};
					UtilSvc.getList(param).then(function (res) {
						otherKendoVO1.mcb01Data = res.data.results[0];
						otherKendoVO1.mcb02Data = res.data.results[0];
					});
	        	};
	        	
	        	otherKendoVO1.inquiry = function() {
	        		var self = this;
	        		var param = {
						procedureParam:"USP_TE_OTHERKENDO01_GET&sFromDt@s|L_LIST01@s|L_LIST02@s",
						sFromDt:"20161215",
						L_LIST01:self.mcb01Model,
						L_LIST02:self.mcb02Model
					};
					UtilSvc.getList(param).then(function (res) {
						gridSampleVO.dataSource.data(res.data.results[0]);
						gridSampleVO_test.dataSource.data(res.data.results[0]);
					});
	        	};
	        	
	        	otherKendoVO1.initParam = function() {
	        	};
	        	
	        	var gridSampleVO = $scope.gridSampleVO = {
        			messages: {
        				noRows: "정보가 존재하지 않습니다.",
        				loading: "정보를 가져오는 중...",
        				requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
        				retry: "갱신",
        			},
        			boxTitle: "Sample grid",
        			dataSource: new kendo.data.DataSource({
        				autoBind: false,
        				transport: {
        					read: function(e) {
        					}
        				},
        				pageSize: 6,
        				schema: {
        					model: {
        						NO_C: {},
        						CD_CLS: {},
        						CD_DEF: {},
        						NM_DEF: {}
        					}
        				}
        			}),
        			columns: [
              			    {field: "NO_C"  , width: 100, title: "가입자번호"},
            			    {field: "CD_CLS", width: 100, title: "코드해더"},
            			    {field: "CD_DEF", width: 100, title: "코드디테일"},
            			    {field: "NM_DEF", width: 100, title: "코드명"}
            		],
        			pageable: {
        				buttonCount: 10
        			},
        			selectable: "multiple cell",
        			allowCopy: true,
        			navigatable: true,
        			editable: true,
        			resizable: true,
        			columnMenu: true,
        			height: 450
	        	};
	        	var gridSampleVO_test = $scope.gridSampleVO_test = {
	        			messages: {
	        				noRows: "정보가 존재하지 않습니다.",
	        				loading: "정보를 가져오는 중...",
	        				requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
	        				retry: "갱신",
	        			},
	        			boxTitle: "Sample grid",
	        			dataSource: new kendo.data.DataSource({
	        				autoBind: false,
	        				transport: {
	        					read: function(e) {
	        						var param = {
        								procedureParam:"USP_TE_OTHERKENDO01_GET&sFromDt@s|L_LIST01@s|L_LIST02@s",
        								sFromDt:"20161215",
        								L_LIST01:self.mcb01Model,
        								L_LIST02:self.mcb02Model
        							};
        							UtilSvc.getList(param).then(function (res) {
        								//e.success()
        								gridSampleVO.dataSource.data(res.data.results[0]);
        								gridSampleVO_test.dataSource.data(res.data.results[0]);
        							})
	        					},
	                			parameterMap: function(e, operation) {
	                				if(operation !== "read" && e.models) {
	                					return {models:kendo.stringify(e.models)};
	                				}
	                			}
	        				},
	        				pageSize: 6,
	        				schema: {
	        					model: {
	        						DC_CHECK: {},
	        						NO_C: {},
	        						CD_CLS: {},
	        						CD_DEF: {},
	        						NM_DEF: {}
	        					}
	        				}
	        			}),
	                	dataBound:function(e) {
	                		//var grid = e.sender;
	                		//grid.select("tr:eq(1)");
	                	},
	        			columns: [
	        			    {field: "DC_CHECK" , width: 20, title: "선택"},
	        			    {field: "NO_C"  , width: 100, title: "가입자번호",
	        			     columns: [{field: "CD_DEF", width: 100, title: "코드디테일"}]},
	        			    {field: "CD_CLS", width: 100, title: "코드해더",
	        			     columns: [{field: "NM_DEF", width: 100, title: "코드명"}]}
	        			],
	        			pageable: {
	        				buttonCount: 10
	        			},
	        			rowTemplate: '<tr><td rowspan="2"><input type="checkbox" name="#=DC_CHECK#" value="0" id="#=DC_CHECK#"></td><td title="1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"><div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap">1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890</div></td><td>#=CD_CLS#</td></tr><tr><td>#=CD_DEF#</td><td>#=NM_DEF#</td></tr>',
	        			altRowTemplate: '<tr class="k-alt"><td rowspan="2"><input type="checkbox" name="#=DC_CHECK#" value="0" id="#=DC_CHECK#"></td><td>#=NO_C#</td><td>#=CD_CLS#</td></tr><tr class="k-alt"><td>#=CD_DEF#</td><td>#=NM_DEF#</td></tr>',
	        			height: 450
		        	};

	        	function testDropDownEditor(container, options) {
	        		$('<input required name="' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                        autoBind: false,
                        dataTextField: "CD_DEF",
                        dataValueField: "NM_DEF",
                        dataSource: {
                            type: "odata",
                            read: function(e) {
        						var param = {
        							procedureParam:"USP_TE_OTHERKENDO02_GET&L_CD_CLS@s",
        							L_CD_CLS:"SY_000001"
        						};
        						UtilSvc.getList(param).then(function (res) {
        							e.success(res.data.results[0]);
        						})
        					},
        					schema: {
        						model: {
            						CD_DEF: {},
            						NM_DEF: {}        							
        						}
        					}
                        }
                    });
	        	}
	        	
	        	otherKendoVO1.initLoad();
        	}
        ]);
}());