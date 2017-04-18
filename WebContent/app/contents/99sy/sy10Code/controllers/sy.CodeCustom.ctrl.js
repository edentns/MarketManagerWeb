(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Code.controller : sy.CodeCustomCtrl
     * 코드관리 - 사용자코드관리
     */
    angular.module("sy.Code.controller")
        .controller("sy.CodeCustomCtrl", ["$scope", "$http", "$log", "$timeout", "sy.CodeSvc", "APP_CODE",
            function ($scope, $http, $log, $timeout, SyCodeSvc, APP_CODE) {

                /**
                 * customerVO
                 * @namespace
                 * @extends code.codeMngCtrl
                 * @type {String} ID_ROW
                 * @type {String} CD_CLS 분류코드
                 */
                var customerVO = $scope.customerVO = {
                    boxTitle : "사용자코드",
                    ID_ROW   : "",
                    CD_CLS   : "",
                    deleteData : []
                };

                /**
                 * 사용자코드 테이블 Option을 세팅한다.
                 */
                customerVO.gridOptions = {
                    enableCellEditOnFocus : true,
                    columnDefs : [
                        { field : "NM_DEF", displayName: "구분코드명", width: "160", cellClass: "ta-l" },
                        { field : "DC_RMK1", displayName: "비고1", width: "100" },
                        { field : "DC_RMK2", displayName: "비고2", width: "100" },
                        { field : "DC_RMK3", displayName: "비고3", width: "100" },
                        { field : "DC_RMK4", displayName: "비고4", width: "100" },
                        { field : "DC_RMK5", displayName: "비고5", width: "100" },
                        { field : "YN_USE", displayName: "사용여부", width: "120", cellClass: "ta-c", cellFilter: "ynUse", editableCellTemplate: "ui-grid/dropdownEditor", editDropdownValueLabel: "YN_USE",
                            editDropdownOptionsArray : [  { id: "Y", YN_USE: "사용" }, { id: "N", YN_USE: "사용안함" } ]
                        },
                        { field : "DTS_UPDATE", displayName: "수정일시", width: "150", cellClass: "ta-c", enableCellEdit: false }
                    ],
                    data : [],
                    onRegisterApi: function( gridApi ) {
                        gridApi.edit.on.afterCellEdit($scope, function ( oRowEntity, a, b ) {
                            if ( oRowEntity.CD_DEF && oRowEntity.CD_DEF!=="" ) {
                                oRowEntity.STATE = "U";
                            }
                        });

                        customerVO.gridApi = gridApi;
                    }
                };

                /**
                 * 사용자코드 처음 로드시 실행된다.
                 */
                customerVO.initLoad = function () {
                    var self = this;

                    // 코드분류 row클릭시 정보를 받아 사용자코드를 조회한다.
                    $scope.$on( "codeMng.customer:inquiry", function ( $event, oEntity, aData ) {
                        self.ID_ROW = oEntity.ID_ROW;
                        self.CD_CLS = oEntity.CD_CLS;
                        self.gridOptions.data = aData;
                    });
                };

                /**
                 * 사용자코드정보를 초기화하고 조회한다.
                 */
                customerVO.init = function () {
                    this.deleteData = [];
                    this.inquiry();
                };

                /**
                 * 사용자코드 조회를 위한 parameter를 생성한다.
                 */
                customerVO.makeGetParam = function () {
                    var self = this,
                        getParam = {
                            CD_CLS : self.CD_CLS,
                            ID_ROW : self.ID_ROW,
                            ITEM   : APP_CODE.user.cd
                        };



                    return getParam;
                };

                /**
                 * 등록, 수정, 삭제를 위한 parameter를 생성한다.
                 */
                customerVO.makePostParam = function ( oData ) {
                    var postParam = {
                        STATE   : oData.STATE,
                        ID_ROW  : oData.ID_ROW,
                        CD_CLS  : oData.CD_CLS,
                        NM_DEF  : oData.NM_DEF,
                        YN_USE  : oData.YN_USE,
                        ITEM    : APP_CODE.user.cd,
                        DC_RMK1 : oData.DC_RMK1,
                        DC_RMK2 : oData.DC_RMK2,
                        DC_RMK3 : oData.DC_RMK3,
                        DC_RMK4 : oData.DC_RMK4,
                        DC_RMK5 : oData.DC_RMK5
                    };

                    if ( oData.STATE==="U" || oData.STATE==="D" ) {
                        postParam.CD_DEF = oData.CD_DEF;
                    }

                    return postParam;
                };

                /**
                 * 사용자코드를 조회한다.
                 */
                customerVO.inquiry = function () {
                    var self = this;
                    SyCodeSvc.getUserCode(self.makeGetParam())
                        .success(function (resData) {
                            self.gridOptions.data = resData;
                        });
                };

                /**
                 * 사용자 코드를 저장한다.
                 */
                customerVO.save = function () {
                    if (confirm("저장시 변경된 데이터는 복구 불가능합니다.")) {
                        if (confirm("저장하시겠습니까?")) {

                            var self = this,
                                data       = self.gridOptions.data,
                                deleteData = self.deleteData,

                                postData = [],
	                            validResult;

                            angular.forEach( data, function ( oData ) {
                                if ( oData.STATE==="U" || oData.STATE==="I" ) {
                                    postData.push( self.makePostParam( oData ) );
                                }
                            });

                            postData = postData.concat( deleteData );

	                        validResult = customerVO.isValid(postData);
	                        if (!validResult.valid) {
		                        alert(validResult.message);
		                        return;
	                        }

                            SyCodeSvc.saveUserCode(postData).success(function () {
                                alert( "저장되었습니다." );
                                self.init();
                            });
                        }
                    }

                };

                /**
                 * 사용자 코드를 추가한다.
                 */
                customerVO.add = function () {
                    var self = this,
                        data = self.gridOptions.data,

                        addData = {
                            STATE   : "I",
                            ID_ROW  : self.ID_ROW,
                            CD_CLS  : self.CD_CLS,
                            DC_RMK1 : "",
                            DC_RMK2 : "",
                            DC_RMK3 : "",
                            DC_RMK4 : "",
                            DC_RMK5 : "",
                            NM_DEF  : "",
                            YN_USE  : "Y"
                        };

                    data.push( addData );
                };

                /**
                 * 사용자 코드를 삭제한다.
                 */
                customerVO.delete = function () {
                    var self = this,
                        data = self.gridOptions.data,
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
                                if ( selectedList[j].CD_DEF && selectedList[j].CD_DEF!=="" ) {
                                    selectedList[j].STATE = "D";
                                    self.deleteData.push( self.makePostParam( selectedList[j] ) );
                                }
                            }
                        }
                    }
                };

	            customerVO.isValid = function(data) {
		            var codeReg = /^[가-힣a-zA-Z0-9~`\|\\!@#$%^&*()\[\]\-=+_|{};':\"<>?,.\/\s]{1,100}$/,
			            ynEnum  = ["Y", "N"],
			            i, lng, code, key;

		            for (i=0, lng=data.length; i<lng; i++) {
			            code = data[i];
			            for (key in code) {
				            if (code.hasOwnProperty(key)) {
					            if (key === "YN_USE") {
						            if (ynEnum.indexOf(code[key]) === -1) {
							            return { valid: false, message: "[형식] 유효하지 않은 형식입니다." };
						            }
					            } else if (key === "NM_DEF"){
						            if (!code[key]) {
							            return { valid: false, message: "[필수] 구분코드명은 필수 입력입니다." };
						            } else {
							            if (!codeReg.test(code[key])) {
								            return { valid: false, message: "[형식] 유효하지 않은 형식입니다." };
							            }
						            }
					            } else {
						            if (code[key] && !codeReg.test(code[key])) {
							            return { valid: false, message: "[형식] 유효하지 않은 형식입니다." };
						            }
					            }
				            }
			            }
		            }

		            return { valid: true, message: "유효합니다." };
	            };

                customerVO.initLoad();
            }]);
}());
