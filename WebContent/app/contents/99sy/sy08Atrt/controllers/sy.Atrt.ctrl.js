(function () {
    "use strict";

    /**
     * 권한관리 - root
     * @name sy.Atrt.controller : sy.AtrtMngCtrl
     */
    angular.module("sy.Atrt.controller")
        .controller("sy.AtrtMngCtrl", ["$scope", "$q", "$timeout", "sy.AtrtSvc", "resData", "$interval", "Page", "UtilSvc",
            function ($scope, $q, $timeout, SyAuthSvc, resData, $interval, Page, UtilSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();

                var rowTemplate = "<div ng-click=\"grid.appScope.syAtrtVO.rowClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ui-grid-cell></div>";

                /**
                 * @typedef {object} syAtrtVO
                 * @property {string} searchNm 검색어
                 * @property {array} deleteData 권한정보 삭제데이터
                 * @property {object} select
                 * @property {function} initLoad
                 * @property {function} init
                 * @property {function} inquiry
                 * @property {function} makeGridEntity
                 * @property {function} makeGetParam
                 * @property {function} makePostParam
                 * @property {function} add
                 * @property {function} delete
                 * @property {function} save
                 * @property {function} rowClick
                 */

                /**
                 * syAtrtVO
                 * @namespace
                 * @type {Boolean}
                 * @type {String} searchNm 검색어
                 * @type {Array} deleteData 권한정보 삭제데이터
                 */
                var syAtrtVO = $scope.syAtrtVO = {
                    boxTitle    : "권한정보",
                    searchNm	: "",
                    deleteData 	: [],
                    select      : {
                        NO_ATRT : "",
                        NM_ATRT : ""
                    }
                };

                /**
                 * 권한정보 grid option을 세팅한다.
                 */
                syAtrtVO.options = {
                    multiSelect             : false,
                    enableRowSelection	    : true,
                    enableCellEditOnFocus   : true,

                    data    : [],
                    height  : 400,
                    rowTemplate : rowTemplate,
                    procedureParam: "USP_SY_08ATRT01_GET",
                    columnDefs  : [
                        { displayName : "권한코드", field : "NO_ATRT", width : 100, enableCellEdit: false },
                        { displayName : "권한이름", field : "NM_ATRT", width : 150, enableCellEdit: true },
                        { displayName : "사용여부", field : "YN_USE", width : 100, enableCellEdit: true, cellClass: "ta-c", cellFilter: "ynUse", editableCellTemplate: "ui-grid/dropdownEditor", editDropdownValueLabel: "YN_USE",
                            editDropdownOptionsArray : [  { id: "Y", YN_USE: "사용" }, { id: "N", YN_USE: "사용안함" }] },
                        { displayName : "수정일시", field : "DTS_UPDATE", width : 120, enableCellEdit: false }
                    ],

                    onRegisterApi : function (gridApi) {
                        syAtrtVO.gridApi = gridApi;

                        gridApi.edit.on.afterCellEdit($scope, function (oRowEntity) {
                            if (oRowEntity.NO_ATRT && oRowEntity.NO_ATRT!=="") {
                                oRowEntity.STATE = "U";
                            }
                        });
                    }
                };

                /**
                 * 초기로드시 실행된다.
                 */
                syAtrtVO.initLoad = function () {
                    var self = this;

                    self.inquiry();
                    $scope.$on("admin.auth:init", function () {
                        self.inquiry();
                    });
                };

                /**
                 * 사용자코드정보를 초기화하고 조회한다.
                 */
                syAtrtVO.init = function () {
                    this.deleteData = [];
                    this.inquiry();
                };

                /**
                 * 권한코드정보를 가져온다.
                 */
                syAtrtVO.inquiry = function () {
                    var self = this,
                    param = {
                        procedureParam: self.options.procedureParam
                    };
                    UtilSvc.getList(param).then(function (result) {
                        self.options.data = result.data.results[0];

                        var selectCdg = self.select.NO_ATRT;
                        if (selectCdg !== "") {
                            var oSelect = null;
                            angular.forEach(self.options.data, function (oData) {
                                if (oData.NO_ATRT === selectCdg) { oSelect = oData; }
                            });

                            //$timeout(function () {
                                self.gridApi.selection.selectRow(oSelect);
                            //}, 50);
                        }
                    });
                };

                /**
                 * 권한코드 추가시 default parameter
                 */
                syAtrtVO.makeGridEntity = function () {
                    return {
                        STATE    : "I",
                        NO_ATRT  : "",
                        NM_ATRT  : "",
                        YN_USE   : "Y",
                        DTS_UPDATE : ""
                    };
                };

                /**
                 * 등록, 수정, 삭제를 위한 parameter를 생성한다.
                 */
                /*syAtrtVO.makeGetParam = function () {
                    var searchNm = this.searchNm,
                        getParam = null;

                    if (searchNm !== "") {
                        getParam = {
                            NM_ATRT : searchNm
                        };
                    }
                    return getParam;
                };*/

                /**
                 * 등록, 수정, 삭제를 위한 parameter를 생성한다.
                 */
                syAtrtVO.makePostParam = function ( data ) {
                    var postParam = {
                        STATE	: data.STATE,
                        NM_ATRT	: data.NM_ATRT,
                        YN_USE	: data.YN_USE
                    };

                    if ( data.STATE==="U" || data.STATE==="D" ) {
                        postParam.NO_ATRT = data.NO_ATRT;
                    }

                    return postParam;
                };


                /**
                 * 권한코드를 추가한다.
                 */
                syAtrtVO.add = function () {
                    var self = this,
	                    data;

	                data = self.makeGridEntity();

                    self.options.data.push(data);


                    SyAuthSvc
                        .saveAuth([
                            { NM_ATRT: " ", YN_USE: "Y", STATE: "I" }
                        ])
                        .then(function (result) {
                            self.select.NO_ATRT = result.data.NO_ATRT;
                    
                            data.STATE  = "U";
                            data.NO_ATRT   = result.data.NO_ATRT;

                            self.gridApi.cellNav.scrollToFocus(data, self.options.columnDefs[1]);
                            self.select.NO_ATRT = data.NO_ATRT;
                            self.select.NM_ATRT = data.NM_ATRT;
                            self.gridApi.selection.selectRow(data);
                            
                            $scope.$broadcast("authMng.menu:inquiry", self.select);
                        });
                };

                /**
                 * 권한코드를 삭제한다.
                 */
                syAtrtVO.delete = function () {
                    var self = this,
                        data = self.options.data,
                        selectedList = self.gridApi.selection.getSelectedRows(),

                        i, leng, j, leng2;

                    if ( selectedList.length === 0 ) {
                        alert( "삭제할 데이터를 선택해주세요." );
                        return;
                    }

                    for ( i=0, leng=data.length; i<leng; i+=1 ) {
                        for ( j=0, leng2=selectedList.length; j<leng2; j+=1 ) {
                            if ( data[i] === selectedList[j] ) {
                                data.splice( i, 1 );
                                if ( selectedList[j].NO_ATRT && selectedList[j].NO_ATRT!=="" ) {
                                    selectedList[j].STATE = "D";
                                    self.deleteData.push( self.makePostParam( selectedList[j] ) );
                                }
                            }
                        }
                    }
                };

                /**
                 * 권한코드를 저장한다.
                 */
                syAtrtVO.save = function () {
                    if (confirm("저장시 변경된 데이터는 복구 불가능합니다.")) {
                        if (confirm("저장하시겠습니까?")) {
                            var self = this,
                                data = self.options.data,
                                deleteData = self.deleteData,
                                postData   = [];

                            angular.forEach( data, function ( oData ) {
                                if ( oData.STATE==="U" || oData.STATE==="I" ) {
                                    postData.push( self.makePostParam( oData ) );
                                }
                            });

                            postData = postData.concat( deleteData );
                            
                            
                            if (!self.isValid(postData)) {
                                alert("유효하지않은 데이터입니다.");
                                return;
                            }
                            
                            if (postData.length > 0) {
                                $scope.$emit("event:autoLoader", false);
                                SyAuthSvc.saveAuth(postData)
                                    .then(function (result) {
                                        self.deleteData = [];
                                        //self.select.NO_ATRT = result.data.NO_ATRT;
                                        self.select.NO_ATRT = "";
                                        self.select.NM_ATRT = "";


                                        $scope.$broadcast("authMng.menu:save", postData);
                                    });

                            } else {
                                $scope.$broadcast("authMng.menu:save", postData);
                            }

                        }
                    }

                };

                /**
                 * 권한 row 클릭시 메뉴권한을 가져온다.
                 * @param row
                 */
                syAtrtVO.rowClick = function (row) {
                    this.select.NO_ATRT = row.entity.NO_ATRT;
                    this.select.NM_ATRT = row.entity.NM_ATRT;
                    
                    if (row.isSelected) {
                        $scope.$broadcast("authMng.menu:inquiry", this.select);
                    }
                };
                
                syAtrtVO.isValid = function(datas) {
                    var valid = true;
                    
                    angular.forEach(datas, function(d) {
                        if (d.STATE !== "D" && !d.NM_ATRT.trim()) {
                            valid = false;
                        }
                    });
                    
                    return valid;
                };

                syAtrtVO.initLoad();
            }]);
}());