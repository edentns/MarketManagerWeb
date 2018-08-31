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
            	
            	goSave : function ( aParam, CD_ITEM ) {
                    return $http({
                        method   : "POST",
                        url		 : APP_CONFIG.domain +"/it05MappingItem/"+CD_ITEM,
                        data     : aParam
                    });
                }
            };
        }]);
}());