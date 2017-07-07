(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name
	 * modal - 메뉴그룹 등록
	 */
	angular.module("edtApp.common.modal")
		.controller("modal.mo05ChangeNmCtrl", ["$scope", "$modal", "modal.ChangeNmSvc", "$modalInstance", "$timeout", "resData", 
			function ($scope, $modal, moChangeNmSvc, $modalInstance, $timeout, resData) {
				var changeNmVO;

				/**
				 * ===================================================
				 * @description 검색 layout을 관리한다.
				 * ===================================================
				 */
				changeNmVO = $scope.changeNmVO = {
				};
				
				/**
				 * 선택된 거래처 정보를 부모창에 전달하고, 모달팝업창을 닫는다.
				 */
				changeNmVO.doConfirm = function () {
//					if (!/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/.test(rePwdVO.email)) {
//						return edt.invalidFocus("rePwdVO.email", "[형식] 이메일은 유효하지 않은 형식입니다.");
//					}
					moChangeNmSvc.changeNm(resData.noMygrp, resData.noM, changeNmVO.nmChange).then(function (res) {
						if(res.status === 200) {
							alert('변경하였습니다.');
							$modalInstance.close();
						}
					});
				};

				/**
				 * 모달창을 닫는다.
				 */
				changeNmVO.doCancle = function () {
					$modalInstance.dismiss( "cancel" );
				};

				// 처음 로드되었을 때 실행된다.
				(function  () {
					$timeout(function () {
                        edt.id("nmChange").focus();
                    }, 500);
				}());
			}]);
}());