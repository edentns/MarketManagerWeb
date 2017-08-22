(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name
	 * modal - 고객사 검색
	 */
	angular.module("edtApp.common.modal")
		.controller("modal.saleSiteDetailCtrl", ["$scope", "$modal", "$modalInstance", "ngTableParams", "$sce", "$filter", "sy.CodeSvc", "UtilSvc", "NO_MRKREGITEM",
			function ($scope, $modal, $modalInstance, ngTableParams, $sce, $filter, SyCodeSvc, UtilSvc, NO_MRKREGITEM) {

				var saleSiteDetailVO;

				/**
				 * ===================================================
				 * @description 검색 layout을 관리한다.
				 * ===================================================
				 */
				saleSiteDetailVO = $scope.saleSiteDetailVO = {
					param:{
						NO_MRK        : "",
						NO_MRKREGITEM : "",
						CD_SIGNITEM   : "",
						NM_ITEM       : "",
						NM_CTGR       : "",
						DC_ITEMABBR   : "",
						NM_DEF        : ""
					},
					fileMainVO: {
	        			CD_AT:"004",
	        			limitCnt: 1,
	        			bImage: true,
	        			imgWidth: '310px',
	        			imgHeight: '290px'
	        		},
	        		fileDExVO: {
	        			CD_AT:"005",
	        			limitCnt: 10,
	        			bImage: true,
	        			imgWidth: '0px',
	        			imgHeight: '0px',
	        			currentDataList:[]
	        		}
						
				};

				/**
				 * 검색조건과 데이터를 초기화한다.
				 */
				saleSiteDetailVO.initSearch = function () {
				var param = {
    					procedureParam  : "MarketManager.USP_IT_04SITEITEM_DETAIL_GET&L_NO_MRKREGITEM@s",
    					L_NO_MRKREGITEM : NO_MRKREGITEM
                    };
    				UtilSvc.getList(param).then(function (res) {
    					saleSiteDetailVO.param = res.data.results[0][0];
    					saleSiteDetailVO.fileMainVO.currentData = res.data.results[1][0];
    					saleSiteDetailVO.fileDExVO.currentDataList = res.data.results[2];
					});
				};

				/**
				 * 모달창을 닫는다.
				 */
				saleSiteDetailVO.doCancle = function () {
					$modalInstance.dismiss( "cancel" );
				};


				// 처음 로드되었을 때 실행된다.
				(function  () {
					saleSiteDetailVO.initSearch();
				}());
			}]);

}());