(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name edtApp.common.service:AuthSvc
	 */
	angular.module("edtApp.common.service")
		.factory("AuthSvc", ["$rootScope", "$http", "$q", "APP_CONFIG", 'MenuSvc', "UtilSvc", 
			function ($rootScope, $http, $q, APP_CONFIG, MenuSvc, UtilSvc) {

				var setLoginInfo = function () {
						$rootScope.$emit("event:login");
					},
					roleUrl = APP_CONFIG.domain +"/sy08AtrtCheck";

				return {
					isAccess : function () {
						var defer = $q.defer();
						$http.get(roleUrl).success(function (result) {
							setLoginInfo();
							var param = {
		    					procedureParam: "USP_MA_08HELP02_GET&L_ID_CMP@s",
		    					L_ID_CMP : MenuSvc.getUrl($http.defaults.headers.common.NO_M)
		    				};
							UtilSvc.getList(param).then(function (res) {
								var helpContent = '';

								if($("#helpEditor").data("kendoEditor") !== undefined) {
									if(res.data.results[0].length !== 0) {
										$("#helpEditor").data("kendoEditor").value(res.data.results[0][0].DC_HTMLCONTENT);
									}
									else {
										$("#helpEditor").data("kendoEditor").value("");
									}
								}
								
								defer.resolve(result);
							});
							defer.resolve(result);
						});
						return defer.promise;
					}
				};
			}]);


}());