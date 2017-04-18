(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name edtApp.common.service:AuthSvc
	 */
	angular.module("edtApp.common.service")
		.factory("AuthSvc", ["$rootScope", "$http", "$q", "APP_CONFIG",
			function ($rootScope, $http, $q, APP_CONFIG) {

				var setLoginInfo = function () {
						$rootScope.$emit("event:login");
					},
					roleUrl = APP_CONFIG.domain +"/sy08AtrtCheck";

				return {
					isAccess : function () {
						var defer = $q.defer();
						$http.get(roleUrl).success(function (result) {
							setLoginInfo();
							defer.resolve(result);
						});
						return defer.promise;
					}
				};
			}]);


}());