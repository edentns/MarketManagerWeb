(function () {
    "use strict";

    /**
     * 유저관리 - 리스트
     * @name sy.User.controller : sy.UserListCtrl
     */
    angular.module("sy.User.controller")
        .controller("sy.UserListCtrl", ["$state", "$scope", "ngTableParams", "$sce", "$filter", "sy.UserListSvc", "sy.CodeSvc", "APP_CODE", "sy.DeptSvc", "resData", "Page", "UtilSvc",
            function ($state, $scope, ngTableParams, $sce, $filter, UserListSvc, SyCodeSvc, APP_CODE, SyDepartSvc, resData, Page, UtilSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            /*$scope.selectedDeptIds = '';
	            $scope.selectedRankIds = '';
	            $scope.selectedStatIds = '';
	            $scope.selectedAtrtIds = '';*/

                // [syUserVO]
                var vo = $scope.syUserVO = {
                	selectedDeptIds : '*',
                	selectedRankIds : '*',
                	selectedStatIds : '*',
                	selectedAtrtIds : '*',
                    boxTitle : "검색",
                    total: 0,
                    data: [],
	        		settingDept : {
	        			id: "NO_DEPT",
	        			name: "NM_DEPT",
	        			maxNames: 2,
	        		},
	        		settingCode : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 3,
	        		},
	        		settingAtrt : {
	        			id: "NO_ATRT",
	        			name: "NM_ATRT",
	        			maxNames: 3,
	        		},
                    departCodeList: [],
                    rankCodeList  : [],
                    empStatList   : [],
                    atrtCodeList  : [],
                    searchName    : ""
                };
                vo.tbl = {
                    columns: [
                        {field: "DC_ID"       , visible: true, title: "사원아이디"  },
                        {field: "NM_EMP"      , visible: true, title: "성명"      },
                        {field: "NM_DEPT"     , visible: true, title: "부서"      },
                        {field: "CD_RANK"     , visible: true, title: "직급"      },
                        {field: "NO_CEPH"     , visible: true, title: "휴대폰번호"  },
                        {field: "DC_EMIADDR"  , visible: true, title: "E-mail"   },
                        {field: "CD_EMPSTAT"  , visible: true, title: "상태"      },
                        {field: "NO_ATRT"     , visible: true, title: "권한"      },
                        {field: "DT_EMP"      , visible: true, title: "입사일자"   }
                    ],
                    tableParams: new ngTableParams({
                        page: 1,
                        count: 10,
                        isShowSelectLength: false,
                        sorting: {
                            CREATE_DT: "desc"
                        }
                    }, {
                        total: vo.data.length,
                        getData: function($defer, params) {
                            var orderedData = params.sorting() ? $filter("orderBy")(vo.data, params.orderBy()) : vo.data;
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    })
                };
                vo.init = function () {// 초기로드시 실행된다.
                	var param = {
                            procedureParam: "USP_SY_08ATRT01_GET"
                        };
                    vo.getDepart({search: "all"});
                    vo.getSubcodeList( {cd: "SY_000020", search: "all"} );
                    vo.getSubcodeList( {cd: "SY_000025", search: "all"} );
                    vo.getSubcodeList( param );
                    vo.doInquiry(1);
                };
                vo.doReload = function (data) {// 테이블 데이터를 갱신하다.
                    vo.tbl.tableParams.settings({data: data});
                    vo.tbl.tableParams.page(1);
                    vo.tbl.tableParams.reload();
                };
                vo.doInquiry = function (flag) {// 검새조건에 해당하는 유저 정보를 가져온다.
                	if(flag != 1){
	                	if(vo.selectedDeptIds == ""){
	                		alert("부서를 선택해주세요.");
	                		return false;
	                	}else if(vo.selectedRankIds == ""){
	                		alert("직급을 선택해주세요.");
	                		return false;
	                	}else if(vo.selectedStatIds == ""){
	                		alert("재직상태 선택해주세요.");
	                		return false;
	                	}else if(vo.selectedAtrtIds == ""){
	                		alert("권한을 선택해주세요.");
	                		return false;
	                	}
                	}
                	var param = {
    						procedureParam:"USP_SY_07USER01_GET&L_LIST01@s|L_LIST02@s|L_LIST03@s|L_LIST04@s|L_SEARCH_NAME@s",
    						L_LIST01  :  vo.selectedDeptIds,
    						L_LIST02  :  vo.selectedRankIds,
    						L_LIST03  :  vo.selectedStatIds,
    						L_LIST04  :  vo.selectedAtrtIds,
    						L_SEARCH_NAME  : vo.searchName
    					};
    					UtilSvc.getList(param).then(function (res) {
    						vo.total = res.data.results[0].length;
                            vo.data = res.data.results[0];
                            vo.doReload(res.data.results[0]);
    					});
                };
                
                /**
                 * 직급 코드를 가져온다.
                 * @param param
                 */
                vo.getSubcodeList = function (param) {
                    var self = this;
                    SyCodeSvc.getSubcodeList(param).then(function (result) {
                    	if(param.cd == "SY_000020"){
                    		self.rankCodeList = result.data;
                    	}else if(param.cd == "SY_000025"){
                    		self.empStatList = result.data;
                    	}else if(param.procedureParam == "USP_SY_08ATRT01_GET"){
                    		UtilSvc.getList(param).then(function (result) {
                                self.atrtCodeList = result.data.results[0];
                            });
                    	}
                    });
                };

                /**
                 * 부서코드를 가져온다.
                 */
                vo.getDepart = function (param) {
                    var self = this;
                    UserListSvc.getDepart(param).then(function (result) {
                            self.departCodeList = result.data;
                        });
                };

                vo.moveInsertPage = function () {// 사원등록페이지로 이동한다.
                    $state.go('app.syUser', { kind: 'insert', menu: null, ids: null });
                };
                vo.moveDetailPage = function (info) {// 사원 수정,상세페이지로 이동한다.
                    $state.go('app.syUser', { kind: 'detail', menu: null, ids: info.NO_EMP });
                };

                vo.init();
            }
        ]);
}());