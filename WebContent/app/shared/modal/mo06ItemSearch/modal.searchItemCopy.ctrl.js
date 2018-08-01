(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name
	 * modal - 고객사 검색
	 */
	angular.module("edtApp.common.modal")
		.controller("modal.searchItemCopyCtrl", ["$scope", "$modal", "$modalInstance", "ngTableParams", "$sce", "$filter", "sy.CodeSvc", "UtilSvc",
			function ($scope, $modal, $modalInstance, ngTableParams, $sce, $filter, SyCodeSvc, UtilSvc) {

				var searchCompanyVO;

				/**
				 * ===================================================
				 * @description 검색 layout을 관리한다.
				 * ===================================================
				 */
				searchCompanyVO = $scope.searchCompanyVO = {
					isSearchStatus: false,
					searchWord: "",
					data: [],
					selectedCD_ITEM: "",
					searchCodeList : [],
					selectedCode   : "CD_SIGNITEM"
				};
				searchCompanyVO.tbl = {// 테이블 세팅
					tableParams: new ngTableParams({
						page              : 1,
						count             : 5,
						isShowSelectLength: false,
						sorting           : {
							name: "desc"
						}
					}, {
						total: searchCompanyVO.data.length,
						getData: function( $defer, params ) {
							var orderedData = params.sorting() ? $filter("orderBy")(searchCompanyVO.data, params.orderBy()) : searchCompanyVO.data;
							params.total(orderedData.length);
							$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						}
					})
				};

				/**
				 * 테이블 데이터를 갱신힌다.
				 * @param {Array} data 검색된 데이터 리스트
				 */
				searchCompanyVO.doReload = function ( data ) {// 테이블 데이터를 갱신하다.
					searchCompanyVO.tbl.tableParams.settings({data: data});
					searchCompanyVO.tbl.tableParams.page(1);
					searchCompanyVO.tbl.tableParams.reload();
				};

				/**
				 * 등록 모달창을 띄운다.(모달창에서 등록 못함)
				 */
				/*searchCompanyVO.modalInsert = function () {
					$modal.open({
						templateUrl : "app/shared/modal/searchCompany/modal.insertCompany.tpl.html",
						controller  : "modal.insertCompanyCtrl",
						size        : "lg"
					});
				};*/

				/**
				 * 검색조건과 데이터를 초기화한다.
				 */
				searchCompanyVO.initSearch = function () {
					var self = this;
					searchCompanyVO.isSearchStatus           = false;
					searchCompanyVO.data                     = [];
					SyCodeSvc.getSubcodeList({cd: "IT_000008", search: "all"}).then(function (result) {
						self.searchCodeList = result.data;
                    });
					/*searchCompanyVO.selectedCompanyInfo.code = "";
					searchCompanyVO.selectedCompanyInfo.name = "";
					searchCompanyVO.selectedCompanyInfo.sales_emp_name = "";
					searchCompanyVO.selectedCompanyInfo.sales_dept_cd = 0;
					searchCompanyVO.selectedCompanyInfo.sales_dept_name = "";*/
				};

				/**
				 * 검색조건에 해당하는 고객사를 검색한다.
				 */
				searchCompanyVO.doInquiry = function () {
					/*var param = {
						client: (searchCompanyVO.searchWord === "") ? "all" : searchCompanyVO.searchWord,
						dept    : "all",
						sales   : "all",
						technic : "all"
					};*/
					
					var param = {
        					procedureParam:"USP_IT_02BSSITEM_SEARCH&L_SEARCH_TYPE@s|L_SEARCH_WORD@s",
        					L_SEARCH_TYPE :	searchCompanyVO.selectedCode,
        					L_SEARCH_WORD : searchCompanyVO.searchWord
                        };
        				UtilSvc.getList(param).then(function (res) {
    						searchCompanyVO.isSearchStatus = true;
    						searchCompanyVO.data = res.data.results[0];
    						searchCompanyVO.doReload(res.data);
    					});

					/*CuCompanyListSvc.getCompanyList( param ).then(function ( result ) {
						searchCompanyVO.isSearchStatus = true;
						searchCompanyVO.data = result.data;
						searchCompanyVO.doReload(result.data);
					});*/
				};

				/**
				 * 유효성을 체크한다.
				 * @returns {boolean}
				 */
				searchCompanyVO.isValid = function () {
					if (searchCompanyVO.selectedCD_ITEM === "") {
						alert("상품을 선택해주세요.");
						return false;
					}
					return true;
				};

				/**
				 * 테이블 Row를 선택했을경우 동작을 처리한다.
				 * @param {Object} companyInfo 선택된 거래처
				 */
				searchCompanyVO.changeSelected = function ( companyInfo ) {
					var vo = $scope.searchCompanyVO;
					if (!companyInfo.selected) {
						vo.data.forEach(function (info) {
							info.selected = false;
						});
						companyInfo.selected = true;
						vo.selectedCD_ITEM = companyInfo.CD_ITEM;
					}
				};

				/**
				 * 선택된 거래처 정보를 부모창에 전달하고, 모달팝업창을 닫는다.
				 */
				searchCompanyVO.doConfirm = function () {
					if ( searchCompanyVO.isValid() ) {
						$modalInstance.close( searchCompanyVO.selectedCD_ITEM );
					}
				};

				/**
				 * 선택된 거래처 정보를 부모창에 전달하고, 모달팝업창을 닫는다.
				 * @param {Object} companyInfo 선택된 거래처
				 */
				searchCompanyVO.doDblConfirm = function ( companyInfo ) {
					searchCompanyVO.changeSelected( companyInfo );
					searchCompanyVO.doConfirm();
				};

				/**
				 * 모달창을 닫는다.
				 */
				searchCompanyVO.doCancle = function () {
					$modalInstance.dismiss( "cancel" );
				};


				// 처음 로드되었을 때 실행된다.
				(function  () {
					searchCompanyVO.initSearch();
				}());
			}]);

}());