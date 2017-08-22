(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name it.SaleItem.service : it.SaleItemSvc
     * 상품분류관리
     */
    angular.module("it.SaleItem.service")
        .factory("it.SaleItemSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
            	saveItem : function ( aParam, CUD ) {
                    return $http({
                        method   : "POST",
                        url		 : APP_CONFIG.domain +"/it03SaleItem/"+CUD,
                        data     : aParam
                    }).success(function (data, status, headers, config) {
						return data;
					}).error(function (data, status, headers, config) {
						console.log("error",data,status,headers,config);
					});
                }
                
            };
        }]);
}());