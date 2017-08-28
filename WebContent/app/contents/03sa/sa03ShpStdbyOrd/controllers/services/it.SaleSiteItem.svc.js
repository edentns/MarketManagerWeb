(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name it.SaleSiteItem.service : it.SaleSiteItemSvc
     * 상품분류관리
     */
    angular.module("it.SaleSiteItem.service")
        .factory("it.SaleSiteItemSvc", ["APP_CONFIG", "$http", "ModalSvc", function (APP_CONFIG, $http, ModalSvc) {
            return {
            	saleSiteDetail : function(NO_MRKREGITEM) {
					var modalInstance = ModalSvc.saleSiteDetail(NO_MRKREGITEM);
					return modalInstance.result;
				}
            };
        }]);
}());