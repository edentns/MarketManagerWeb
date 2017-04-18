(function () {
	"use strict";

	/**
	 * @name
	 * modal - 사원 검색
	 */
	angular.module("edtApp.common.modal")
		.controller("modal.searchMemberCtrl", ["$scope", "$modalInstance", "ngTableParams", "$sce", "$filter", "sy.userListSvc", "sy.codeSvc", "APP_CODE", "sy.departSvc", "paramSvc",
			function ($scope, $modalInstance, ngTableParams, $sce, $filter, SyUserListSvc, SyCodeSvc, APP_CODE, SyDepartSvc, paramSvc) {

				var employeeVO;

				/**
				 * 유저검색을 관리한다.
				 */
				employeeVO = $scope.employeeVO = {
					isSearchStatus		: false,
					total				: 0,
					data				: [],
					departCodeList		: [],
					selectedEmployeeInfo: {
						roleCd	 : "",
						departCd : "",
						depart	 : "",
						empNo	 : "",
						name	 : ""
					}
				};

				// 검색
				employeeVO.search = {
					depart	: "",
					name	: ""
				};

				// 테이블 세팅
				employeeVO.tbl = {
					tableParams: new ngTableParams({
						page	: 1,
						count	: 5,
						isShowSelectLength: false
					}, {
						total	: employeeVO.data.length,
						getData: function($defer, params) {
							var orderedData = params.sorting() ? $filter( "orderBy" )(employeeVO.data, params.orderBy()) : employeeVO.data;
							params.total(orderedData.length);
							$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						}
					})
				};

				/**
				 * 초기 로드시 실행된다.
				 */
				employeeVO.initLoad = function () {
					employeeVO.initSearch();
					employeeVO.getSubcodeList({ search: "all" });
				};

				/**
				 * 검색조건과 데이터를 초기화한다.
				 */
				employeeVO.initSearch = function () {
					if ( paramSvc ) {
						employeeVO.isSearchStatus			= true;
						employeeVO.search.name 				= (paramSvc.name === "all") ? "" : paramSvc.name;
						employeeVO.data						= paramSvc.data;
					} else {
						employeeVO.isSearchStatus 			= false;
						employeeVO.search.name 				= "";
						employeeVO.data 					= [];

						employeeVO.doInquiry();
					}

					employeeVO.search.depart 				 = "";
					employeeVO.selectedEmployeeInfo.roleCd 	 = "";
					employeeVO.selectedEmployeeInfo.departCd = "";
					employeeVO.selectedEmployeeInfo.depart 	 = "";
					employeeVO.selectedEmployeeInfo.empNo 	 = "";
					employeeVO.selectedEmployeeInfo.name	 = "";
				};

				/**
				 * 테이블 데이터를 갱신하다.
				 * @param {Array} data 검색된 유저정보리스트
				 */
				employeeVO.doReload = function ( data ) {
					employeeVO.tbl.tableParams.settings( { data: data } );
					employeeVO.tbl.tableParams.page( 1 );
					employeeVO.tbl.tableParams.reload();
				};

				/**
				 * SUB코드정보를 가져온다.
				 * @param param
				 */
				employeeVO.getSubcodeList = function (param) {
					SyDepartSvc.getDepart(param)
						.then(function (result) {
							employeeVO.departCodeList = result.data;
						});
				};

				/**
				 * 재직중인 유저 정보를 가져온다.
				 */
				employeeVO.doInquiry = function () {
					employeeVO.isSearchStatus = true;
					var param = {
						dept	: (edt.isValid(employeeVO.search.depart)) ? employeeVO.search.depart.CD : "all",
						pos		: "all",
						name	: (edt.isValid(employeeVO.search.name)) ? employeeVO.search.name : "all",
						status	: "JOINED"
					};

					if ( paramSvc && paramSvc.searchFlag ) {
						param.searchFlag = paramSvc.searchFlag;
					}

					SyUserListSvc.getUserList(SyUserListSvc.makeGetUserParam(param)).then(function ( result ) {
						employeeVO.total 	= result.data.length;
						employeeVO.data 	= result.data;
						employeeVO.doReload( result.data );
					});
				};

				/**
				 * 유효성을 체크한다.
				 * @returns {boolean}
				 */
				employeeVO.isValid = function () {// 유효성체크
					if (employeeVO.selectedEmployeeInfo.empNo === "") {
						alert("유저를 선택해주세요.");
						return false;
					}
					return true;
				};

				/**
				 * 테이블 Row를 선택했을경우 동작을 처리한다.
				 * @param {UserDataSet} employeeInfo 선택된 유저정보
				 */
				employeeVO.changeSelected = function (employeeInfo) {
					if (!employeeInfo.selected) {
						employeeVO.data.forEach(function (info) {
							info.selected = false;
						});

						employeeInfo.selected = true;
						employeeVO.selectedEmployeeInfo.departCd = employeeInfo.DEPT_CD;
						employeeVO.selectedEmployeeInfo.depart 	 = employeeInfo.DEPT_NAME;
						employeeVO.selectedEmployeeInfo.roleCd 	 = employeeInfo.ROLE_CD;
						employeeVO.selectedEmployeeInfo.empNo 	 = employeeInfo.CD;
						employeeVO.selectedEmployeeInfo.name 	 = employeeInfo.NAME;
					}
				};

				/**
				 * 선택된 유저정보를 부모창에 전달하고, 모달창을 닫는다.
				 */
				employeeVO.doConfirm = function () {
					if ( employeeVO.isValid() ) {
						$modalInstance.close( employeeVO.selectedEmployeeInfo );
					}
				};

				/**
				 * 더블클릭된 유저정보를 부모창에 전달하고, 모달창을 닫는다.
				 * @param {Object} employeeInfo 선택된 유저정보
				 */
				employeeVO.doDblConfirm = function ( employeeInfo ) {
					employeeVO.changeSelected( employeeInfo );
					employeeVO.doConfirm();
				};

				/**
				 * 모달창을 닫는다.
				 */
				employeeVO.doCancle = function () {
					$modalInstance.dismiss( "cancel" );
				};

				employeeVO.initLoad();
			}
		]);

}());