(function () {
    "use strict";

    /**
     * 권한관리 - root
     * @name sy.Ctgr.controller : sy.CtgrMngCtrl
     */
    angular.module("sy.Ctgr.controller")
        .controller("sy.CtgrMngCtrl", ["$scope", "$q", "$timeout", "sy.CtgrSvc", "resData", "$interval", "Page", "UtilSvc",
            function ($scope, $q, $timeout, SyAuthSvc, resData, $interval, Page, UtilSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();

                var rowTemplate = "<div ng-click=\"grid.appScope.syCtgrVO.rowClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ui-grid-cell></div>";

                /**
                 * @typedef {object} syCtgrVO
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

	            var sy01CtgrOptVO = $scope.sy01CtgrOptVO = {
		           	boxTitle: "검색",
		           	mngMrkDs: {
		           		autoBind: true,
			    		dataTextField: "NM_MRK",
		                dataValueField: "NO_MNGMRK",
			    		dataSource: new kendo.data.DataSource({
			    			transport: {
			    				read: function(e){ 
			    					var param = {
		    		    				procedureParam: "USP_MA_04MNGMRK01_GET",
		    		    			};
		    		    			UtilSvc.getList(param).then(function (res) {
		    							e.success(res.data.results[0]);
		    							if(res.data.results[0].length > 0) {
		    								$scope.sy01CtgrOptVO.mngMrkMd = res.data.results[0][0].NO_MNGMRK;
		    							}
		    						}); 
			    				}
			    			}
			    		}),
			    		valuePrimitive: true
		            },
		            mngMrkMd: [""]
	            };


                /**
                 * syCtgrVO
                 * @namespace
                 * @type {Boolean}
                 * @type {String} searchNm 검색어
                 * @type {Array} deleteData 권한정보 삭제데이터
                 */
                var syCtgrVO = $scope.syCtgrVO = {
                    boxTitle    : "카테고리정보",
                    no_mngmrk : "SYMM170101_00001",
                    nm_ctrg_search	: "",
                    deleteData 	: [],
                    select      : {
                    	ID_CTGR : "",
                    	NM_ALLCTGR : ""
                    }
                };
                
                syCtgrVO.height = $(window).height() - 90 - 131;
                syCtgrVO.height = syCtgrVO.height + 'px'; 
                /**
                 * 권한정보 grid option을 세팅한다.
                 */
                syCtgrVO.options = {
                	multiSelect             : false,
                    enableRowSelection	    : true,
                    enableCellEditOnFocus   : true,
                    messages: {
            			noRows: "카테고리가 존재하지 않습니다.",
            			loading: "카테고리를 가져오는 중...",
                        requestFailed: "카테고리를 가져오는 중 오류가 발생하였습니다."
            		},
                    data    : [],
                    rowTemplate : rowTemplate,
                    procedureParam: "USP_SY_19CTGR01_SEARCH&l_no_mngmrk@s|l_nm_ctrg_search@s",
                    columnDefs  : [
                        { displayName : "카테고리번호", field : "ID_CTGR", width : 120, enableCellEdit: false },
                        { displayName : "카테고리명", field : "NM_ALLCTGR", width : 280, enableCellEdit: false },
                        { displayName : "사용여부", field : "YN_MM_USE", width : 80, enableCellEdit: true, cellClass: "ta-c", cellFilter: "ynUse", editableCellTemplate: "ui-grid/dropdownEditor", editDropdownValueLabel: "YN_USE",
                            editDropdownOptionsArray : [  { id: "Y", YN_USE: "사용" }, { id: "N", YN_USE: "사용안함" }] },
                        { displayName : "수정일시", field : "DTS_UPDATE", width : 120, enableCellEdit: false }
                    ],

                    onRegisterApi : function (gridApi) {
                        syCtgrVO.gridApi = gridApi;

                        gridApi.edit.on.afterCellEdit($scope, function (oRowEntity) {
                            if (oRowEntity.NO_Ctgr && oRowEntity.NO_Ctgr!=="") {
                                oRowEntity.STATE = "U";
                            }
                        });
                    }
                };

                /**
                 * 초기로드시 실행된다.
                 */
                syCtgrVO.initLoad = function () {
                    var self = this;
                    $("#no_mrk").val('SYMM170101_00001');
                    self.inquiry();
                    $scope.$on("admin.auth:init", function () {
                        self.inquiry();
                    });
                };

                /**
                 * 사용자코드정보를 초기화하고 조회한다.
                 */
                syCtgrVO.init = function () {
                    this.deleteData = [];
                    this.inquiry();
                };

                /**
                 * 권한코드정보를 가져온다.
                 */
                syCtgrVO.inquiry = function () {
                    var self = this,
                    param = {
                        procedureParam: self.options.procedureParam,
                        l_no_mngmrk : $("#no_mrk").val() == null ? 'SYMM170101_00001' : $("#no_mrk").val(),
                        l_nm_ctrg_search : syCtgrVO.nm_ctrg_search
                    };
                    UtilSvc.getList(param).then(function (result) {
                        self.options.data = result.data.results[0];
                        //alert($("#no_mrk").val());
                        
                        var selectCdg = self.select.NO_Ctgr;
                        if (selectCdg !== "") {
                            var oSelect = null;
                            angular.forEach(self.options.data, function (oData) {
                                if (oData.NO_Ctgr === selectCdg) { oSelect = oData; }
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
                syCtgrVO.makeGridEntity = function () {
                    return {
                        STATE    : "I",
                        NO_Ctgr  : "",
                        NM_Ctgr  : "",
                        YN_USE   : "Y",
                        DTS_UPDATE : ""
                    };
                };

                /**
                 * 등록, 수정, 삭제를 위한 parameter를 생성한다.
                 */
                /*syCtgrVO.makeGetParam = function () {
                    var searchNm = this.searchNm,
                        getParam = null;

                    if (searchNm !== "") {
                        getParam = {
                            NM_Ctgr : searchNm
                        };
                    }
                    return getParam;
                };*/

                /**
                 * 등록, 수정, 삭제를 위한 parameter를 생성한다.
                 */
                syCtgrVO.makePostParam = function ( data ) {
                    var postParam = {
                        STATE	: data.STATE,
                        NM_Ctgr	: data.NM_Ctgr,
                        YN_USE	: data.YN_USE
                    };

                    if ( data.STATE==="U" || data.STATE==="D" ) {
                        postParam.NO_Ctgr = data.NO_Ctgr;
                    }

                    return postParam;
                };


                /**
                 * 권한코드를 추가한다.
                 */
                syCtgrVO.add = function () {
                    var self = this,
	                    data;

	                data = self.makeGridEntity();

                    self.options.data.push(data);


                    SyAuthSvc
                        .saveAuth([
                            { NM_Ctgr: " ", YN_USE: "Y", STATE: "I" }
                        ])
                        .then(function (result) {
                            self.select.NO_Ctgr = result.data.NO_Ctgr;
                    
                            data.STATE  = "U";
                            data.NO_Ctgr   = result.data.NO_Ctgr;

                            self.gridApi.cellNav.scrollToFocus(data, self.options.columnDefs[1]);
                            self.select.NO_Ctgr = data.NO_Ctgr;
                            self.select.NM_Ctgr = data.NM_Ctgr;
                            self.gridApi.selection.selectRow(data);
                            
                            $scope.$broadcast("authMng.menu:inquiry", self.select);
                        });
                };

                /**
                 * 권한코드를 삭제한다.
                 */
                syCtgrVO.delete = function () {
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
                                if ( selectedList[j].NO_Ctgr && selectedList[j].NO_Ctgr!=="" ) {
                                    selectedList[j].STATE = "D";
                                    self.deleteData.push( self.makePostParam( selectedList[j] ) );
                                }
                            }
                        }
                    }
                };

	            
                sy01CtgrOptVO.optionChange = function () {
                	syCtgrVO.nm_ctrg_search = "";
                	syCtgrVO.inquiry();
                };	    
                
                /**
                 * 권한코드를 저장한다.
                 */
                syCtgrVO.save = function () {
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
                                        //self.select.NO_Ctgr = result.data.NO_Ctgr;
                                        self.select.NO_Ctgr = "";
                                        self.select.NM_Ctgr = "";


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
                syCtgrVO.rowClick = function (row) {
                    this.select.NO_Ctgr = row.entity.NO_Ctgr;
                    this.select.NM_Ctgr = row.entity.NM_Ctgr;
                    
                    if (row.isSelected) {
                        $scope.$broadcast("authMng.menu:inquiry", this.select);
                    }
                };
                
                syCtgrVO.isValid = function(datas) {
                    var valid = true;
                    
                    angular.forEach(datas, function(d) {
                        if (d.STATE !== "D" && !d.NM_Ctgr.trim()) {
                            valid = false;
                        }
                    });
                    
                    return valid;
                };

                syCtgrVO.initLoad();
            }]);
}());