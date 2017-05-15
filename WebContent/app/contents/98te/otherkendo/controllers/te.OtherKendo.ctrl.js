(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name te.OtherKendo.controller : te.OtherKendoCtrl
     * 부서관리
     */
    angular.module("te.OtherKendo.controller", [ 'kendo.directives', 'ngGrid' ])
    	.directive("dropdownMultiselect",function() {
    		//콤보박스 속 다중체크박스 커스텀마이징한 디렉티브
    		return {
                restrict: 'E',
                scope: {
                    model: '=',
                    options: '=',
                },
                template:
                		"<div class='btn-group' data-ng-class='{open: open}' style='width:100%;'>" +
                            "<button class='btn btn-small' style='width:93%'>Select...</button>" +
                            "<button class='btn btn-small dropdown-toggle'"+ 
                            "data-ng-click='openDropdown()'>"+
                            "<span class='caret'></span></button>" +
                            "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
                                "<li><a data-ng-click='selectAll()'>"+
                                "<span class='glyphicon glyphicon-ok green' "+
                                "aria-hidden='true'></span> Check All</a></li>" +
                                "<li><a data-ng-click='deselectAll();'>"+
                                "<span class='glyphicon glyphicon-remove red' "+
                                "aria-hidden='true'></span> Uncheck All</a></li>" +
                                "<li class='divider'></li>" +
                                "<li data-ng-repeat='option in options'>"+
                                "<a data-ng-click='toggleSelectItem(option)'>"+
                                "<span data-ng-class='getClassName(option)'" +
                                "aria-hidden='true'></span> {{option.name}}</a></li>" +
                            "</ul>" +
                        "</div>",

                controller:['$scope', function ($scope) {
                    $scope.openDropdown = function () {
                        $scope.open = !$scope.open;
                    };

                    $scope.selectAll = function () {
                        $scope.model = [];
                        angular.forEach($scope.options, function (item, index) {
                            $scope.model.push(item.id);
                        });
                    };

                    $scope.deselectAll = function () {
                        $scope.model = [];
                    };

                    $scope.toggleSelectItem = function (option) {
                        var intIndex = -1;
                        angular.forEach($scope.model, function (item, index) {
                            if (item == option.id) {
                                intIndex = index;
                            }
                        });

                        if (intIndex >= 0) {
                            $scope.model.splice(intIndex, 1);
                        }
                        else {
                            $scope.model.push(option.id);
                        }
                    };

                    $scope.getClassName = function (option) {
                        var varClassName = 'glyphicon glyphicon-remove red';
                        angular.forEach($scope.model, function (item, index) {
                            if (item == option.id) {
                                varClassName = 'glyphicon glyphicon-ok green';
                            }
                        });
                        return (varClassName);
                    };
                }]
            }
    		
    	})
    
        .controller("te.OtherKendoCtrl", ["$scope", "$q", "sy.CodeSvc", "te.OtherKendoSvc", "APP_CODE", "resData", "Page", "$state", 'MenuSvc', "$location", "$window", "UtilSvc",
            function ($scope, $q, SyCodeSvc, TeOtherKendoSvc, APP_CODE, resData, Page, $state, MenuSvc, $location, window, UtilSvc) {
	        	var page  = $scope.page = new Page({ auth: resData.access }),
	            today = edt.getToday();
	        	
	        	var otherKendoVO1 = $scope.otherKendoVO1 = {
	        		boxTitle : "검색",
	        		selectedMrkIds : [],
	        		mrkDataSource : [],
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
	        	
	        	otherKendoVO1.inquiry = function() {
	        		var param = {
						procedureParam:"USP_TE_OTHERKENDO01_GET&sFromDt@s",
						sFromDt:"20161215"
					};
					UtilSvc.getList(param).then(function (res) {
						gridSampleVO.dataSource.data(res.data.results[0]);
						gridSampleVO_test.dataSource.data(res.data.results[0]);
					})
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
        								procedureParam:"USP_TE_OTHERKENDO01_GET&sFromDt@s",
        								sFromDt:"20161215"
        							};
        							UtilSvc.getList(param).then(function (res) {
        								e.success()
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
	                		var grid = e.sender;
	                		grid.select("tr:eq(1)");
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
	        	
	        	otherKendoVO1.inquiry();
        	}
        ]);
}());