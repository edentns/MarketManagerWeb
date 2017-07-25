(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name it.BssItem.service : it.BssItemSvc
     * 기본상품관리
     */
    angular.module("it.BssItem.service")
        .factory("it.BssItemSvc", ["APP_CONFIG", "$http", "ModalSvc", function (APP_CONFIG, $http, ModalSvc) {
            return {
            	
            	/**
				 * 외부에 표시되는 상품코드 중복체크
				 */
            	duplCheck : function (param) {
					return $http({
						method  : "POST",
                        url     : APP_CONFIG.domain +"/it02Bss/duplCheck",
                        data    : param
					});
				},
				
				/**
				 * 리스트 화면에서 상품삭제
				 */
				deleteBssItem : function(param) {
					return $http({
						method  : "POST",
                        url     : APP_CONFIG.domain +"/it02Bss/deleteItem",
                        data    : param
					});
				},
				
				itemCopyModal : function() {
					var modalInstance = ModalSvc.openItemCopy();
					return modalInstance.result;
				},
				
				codeUpdateModal : function() {
					var modalInstance = ModalSvc.openCodeUpdate();
					return modalInstance.result;
				}
				
            };
        }]);
}());