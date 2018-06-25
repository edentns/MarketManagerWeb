(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Board.service : ma.BoardSvc
     * Avtm를 관리한다.
     */
    angular.module("ma.Board.service")
        .factory("ma.BoardSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	boardFilterSave : function (param, CUD) {				
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/maBoard/"+CUD,
						data	: param
					});
				},
				boardSave : function (param, CUD) {				
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/maBoardDelete/"+CUD,
						data	: param
					});
				}
            };
        }]);
}());