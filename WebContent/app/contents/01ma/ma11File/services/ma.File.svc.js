(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.File.service : ma.FileSvc
     * Avtm를 관리한다.
     */
    angular.module("ma.File.service")
        .factory("ma.FileSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	fileDeleteMove : function (param, CUD) {				
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/maFile/"+CUD,
						data	: param
					});
				}
            };
        }]);
}());