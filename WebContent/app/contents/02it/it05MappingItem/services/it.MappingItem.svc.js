(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name it.MappingItem.service : it.MappingItemSvc
     * 상품분류관리
     */
    angular.module("it.MappingItem.service")
        .factory("it.MappingItemSvc", ["APP_CONFIG", "$http", "ModalSvc" , function (APP_CONFIG, $http, ModalSvc) {
            return {
            	
            	saveCtgr : function ( aParam, CUD ) {
                    return $http({
                        method   : "POST",
                        url		 : APP_CONFIG.domain +"/it01saveCtgr/"+CUD,
                        data     : aParam
                    });
                },
            	
            	modal: function (NO_MNGMRK) {
    				var modalInstance = ModalSvc.openIt01ItemCfct(NO_MNGMRK);
    				return modalInstance.result;
    			}
            };
        }]);
}());