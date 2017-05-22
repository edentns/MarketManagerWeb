(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.MemJoinAppr.controller : ma.MemJoinApprCtrl
     * 코드관리
     */
    angular.module("ma.MemJoinAppr.controller")
        .controller("ma.MemJoinApprCtrl", ["$scope", "$http", "$q", "$log", "ma.MemJoinApprSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, MaMemJoinApprSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            	            
	            var joinerDataVO = $scope.joinerDataVO = {
	            	boxTitle : "검색",
	            	datesetting : {
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month'],
						selected   : 'current',
						period : {
							start : angular.copy(today),
							end   : angular.copy(today)
						}
	        		},
                    searchText: "",				    //검색어
             	    joinerStatusData : [""],		//가입자 상태
             	    joinerNameData : [""],			//상품명
             	    dataTotal : 0
	            };
	            
            }]);
}());