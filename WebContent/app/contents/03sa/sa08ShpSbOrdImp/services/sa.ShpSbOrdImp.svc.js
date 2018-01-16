(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.ShpSbOrdImp.service : sa.ShpSbOrdImpSvc
     * 
     */
    angular.module("sa.ShpSbOrdImp.service")
        .factory("sa.ShpSbOrdImpSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	/**
				 * 모든 택배사 코드 정보 GET
				 */
            	shpbyordList : function (param) {
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/shpbyord/shplist/*",
					});
				},
				
				// 엑셀 그리드에 import
				excelImport : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/sa08ShpImp/excelImport",
					});
				},
				
				// 그리드 데이터 택배사&송장번호 디비에 저장 (실패시 정보와 사유 리턴)
				excelExecute : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/sa08ShpImp/excelExecute",
						data	: param
					});
				}
            };
        }]);
}());