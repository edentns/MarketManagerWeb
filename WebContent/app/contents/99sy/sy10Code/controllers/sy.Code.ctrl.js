(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Code.controller : sy.CodeCtrl
     * 코드관리
     */
    angular.module("sy.Code.controller")
        .controller("sy.CodeCtrl", ["$scope", "$http", "$q", "$log", "sy.CodeSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, SyCodeSvc, APP_CODE, $timeout, resData, Page) {
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
                    }
                };

                /**
                 * 그룹코드 parameter를 생성한다.
                 */
                syCodeVO.makeGetParam = function () {
                    var self  = this,
                        param = {
                            // codeitem(코드헤더), usercode(유저코드), syscode(시스템코드)
                            ITEM : APP_CODE.header.cd
                        };

                    if ( self.searchNm !== "" ) {
                        switch ( self.searchKind ) {
                            case "defNm" :
                                param.NM_DEF = self.searchNm;
                                break;

                            case "clsCd" :
                                param.CD_CLS = self.searchNm;
                                break;
                        }
                    }

                    return param;
                };

                /**
                 * 코드분류 데이터를 가져온다.
                 */
                syCodeVO.inquiry = function () {
                    var self = this;

                    $scope.$emit( "event:autoLoader", false );
                    SyCodeSvc.getGroupCode(syCodeVO.makeGetParam()).then(function (result) {
                        self.gridOptions.data = result.data;

                        var codeParam = {
                            ID_ROW : "",
                            CD_CLS : ""
                        };

                        if (result.data.length > 0) {
                            $timeout(function () {
                                self.gridApi.selection.selectRow( self.gridOptions.data[0] );
                                self.selected = result.data[0];

                                codeParam.ID_ROW = self.selected.ID_ROW;
                                codeParam.CD_CLS = self.selected.CD_CLS;
                                self.inquiryAll( codeParam );
                            });

                        } else {
                            $scope.$emit( "event:autoLoader", true );
                            self.selected = null;
                            syCodeVO.broadcastData(codeParam, []);
                        }
                    });
                };

                /**
                 * 시스템코드와 사용자코드를 가져온다.
                 * @param {Object} oCodeParam ID_ROW와 분류코드
                 */
                syCodeVO.inquiryAll = function ( oCodeParam ) {
                    var self  = this,
                        cdCls = oCodeParam.CD_CLS,
                        idRow = oCodeParam.ID_ROW;

                    $q.all([
                        SyCodeSvc.getUserCode({
                            CD_CLS : cdCls,
                            ID_ROW : idRow,
                            ITEM   : APP_CODE.user.cd
                        }),
                        SyCodeSvc.getSystemCode({
                            CD_CLS : cdCls,
                            ID_ROW : idRow,
                            ITEM   : APP_CODE.system.cd
                        })
                    ]).then(function ( result ) {
                        $scope.$emit( "event:autoLoader", true );

                        self.broadcastData( oCodeParam, result );
                    });
                };

                /**
                 * childrent controller에 data를 set한다.
                 * @param {Object} oCodeParam 조회조건 parameter
                 * @param {Array} aResult 조회된 사용자코드와 시스템코드
                 */
                syCodeVO.broadcastData = function (oCodeParam, aResult) {
                    var customerData =  [],
                        systemData = [];

                    if ( aResult.length > 0 ) {
                        customerData    = aResult[0].data;
                        systemData      = aResult[1].data;
                    }
                    $scope.$broadcast( "codeMng.customer:inquiry", oCodeParam, customerData );
                    $scope.$broadcast( "codeMng.system:inquiry", oCodeParam, systemData );
                };

                /**
                 * 코드분류 Row 클릭시 사용자코드와 시스템코드를 가져온다.
                 */
                syCodeVO.rowClick = function ( oGridRow ) {
                    var self = this,
                        codeParam   = {};

                    self.selected = oGridRow.entity;

                    codeParam.ID_ROW = self.selected.ID_ROW;
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