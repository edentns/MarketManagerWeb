(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Code.controller : sy.CodeCtrl
     * 코드관리
     */
    angular.module("sy.Code.controller")
        .controller("sy.CodeCtrl", ["$scope", "$http", "$q", "$log", "sy.CodeSvc", "APP_CODE", "$timeout", "resData", "Page","UtilSvc",
            function ($scope, $http, $q, $log, SyCodeSvc, APP_CODE, $timeout, resData, Page, UtilSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();

                /**
                 * -----------------------------------------------------------------------------------------------------------
                 * syCodeVO
                 * @namespace
                 * -----------------------------------------------------------------------------------------------------------
                 */
                var syCodeVO = $scope.syCodeVO = {
                    boxTitle : "코드분류",
                    searchKindList : [
                        { name : "분류명칭", value : "defNm" },
                        { name : "분류코드", value : "clsCd" }
                    ],
                    searchKind : "defNm",
                    searchNm   : "",
                    selected   : null,
                    ID_ROW  : "",
                    CD_CLS  : ""
                };

                /**
                 * 코드분류 테이블 초기 로드시 실행된다.
                 */
                syCodeVO.initLoad = function () {
                    this.inquiry();
                };

                /**
                 * 코드분류 테이블 Option을 세팅한다.
                 */
                syCodeVO.gridOptions = {
                    rowTemplate : "<div ng-click=\"grid.appScope.syCodeVO.rowClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ui-grid-cell></div>",
                    columnDefs : [
                        { field : "CD_CLS", displayName: "분류코드", width: "100", pinnedLeft: true },
                        { field : "NM_CLS", displayName: "분류명칭", width: "200", pinnedLeft: true },
                        { field : "DC_RMK", displayName: "비고", width: "150" },
                        { field : "YN_SYS", displayName: "수정여부", width: "90", cellClass: "ta-c", cellFilter: "ynUse:'불가능':'가능'" },
                        { field : "DTS_UPDATE", displayName: "수정일시", width: "120", cellClass: "ta-c" }
                    ],
                    data : [],
                    multiSelect : false,
                    enableRowSelection	    : true,
                    enableRowHeaderSelection: false,
                    onRegisterApi : function( gridApi ) {
                        syCodeVO.gridApi = gridApi;
                    },
                    procedureParam: "USP_SY_10CODE01_GET&L_SEARCHKIND@s|L_SEARCHNAME@s"
                };

                /**
                 * 코드분류 데이터를 가져온다.
                 */
                syCodeVO.inquiry = function () {
                    var self = this,
					param = {
                    	procedureParam: self.gridOptions.procedureParam,
                    	L_SEARCHKIND: self.searchKind,
                    	L_SEARCHNAME: self.searchNm
                    };

                    $scope.$emit( "event:autoLoader", false );
                    
                    UtilSvc.getList(param).then(function (res) {
						self.gridOptions.data = res.data.results[0];

                        var codeParam = {
                        	NO_MNGCDHD : "",
                            CD_CLS : ""
                        };

                        if (res.data.results[0].length > 0) {
                            $timeout(function () {
                                self.gridApi.selection.selectRow( self.gridOptions.data[0] );
                                self.selected = res.data.results[0][0];

                                codeParam.NO_MNGCDHD = self.selected.NO_MNGCDHD;
                                codeParam.CD_CLS = self.selected.CD_CLS;
                                
                                self.inquiryAll(codeParam);
                            });

                        } else {
                            $scope.$emit( "event:autoLoader", true );
                            //self.selected = null;
                            //syCodeVO.broadcastData(codeParam, []);
                        }
					});
                };

                /**
                 * 시스템코드와 사용자코드를 가져온다.
                 * @param {Object} oCodeParam ID_ROW와 분류코드
                 */
                syCodeVO.inquiryAll = function ( oCodeParam ) {
                    var self  = this,
                        param = {                    	
    						procedureParam: "USP_SY_10CODE02_GET&L_NO_MNGCDHD@s|L_CD_CLS@s",
    						L_NO_MNGCDHD: oCodeParam.NO_MNGCDHD,
    						L_CD_CLS: oCodeParam.CD_CLS
                        };

                    UtilSvc.getList(param).then(function (res) {
//						$scope.systemVO.gridOptions.data = res.data.results[0];
//						$scope.customerVO.gridOptions.data = res.data.results[1];
						
	                    $scope.$broadcast( "codeMng.customer:inquiry", oCodeParam, res.data.results[1] );
	                    $scope.$broadcast( "codeMng.system:inquiry", oCodeParam, res.data.results[0] );
                    });
                };

                /**
                 * 코드분류 Row 클릭시 사용자코드와 시스템코드를 가져온다.
                 */
                syCodeVO.rowClick = function ( oGridRow ) {
                    var self = this,
                        codeParam   = {};

                    self.selected = oGridRow.entity;

                    codeParam.NO_MNGCDHD = self.selected.NO_MNGCDHD;
                    codeParam.CD_CLS = self.selected.CD_CLS;
                    self.inquiryAll( codeParam );
                };

                /**
                 * 사용자코드 추가,수정이 가능한지 판단한다.
                 * @returns {boolean}
                 */
                syCodeVO.isCustomWrite = function () {
                    if (this.selected) { return this.selected.YN_SYS === "N"; }
                    else { return false; }
                };

                syCodeVO.initLoad();
            }]);
}());