(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.MemJoinAppr.service : ma.MemJoinApprSvc
     * MemJoinAppr에 ""를 관리한다.
     */
    angular.module("ma.MemJoinAppr.service")
        .factory("ma.MemJoinApprSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
            	/**
				 * 가입 승인 처리!
				 */
            	joinerMem : function (param) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/memJoinAppr/joinerMem",
						data	: param
					}).success(function (data, status, headers, config) {
						if(data === "1") {
							alert("승인 처리 되었습니다.");
							return;
						}else if(data === "2"){
							alert("승인 처리 되었습니다.");
							console.log("메일링 에러");
							return;
						}else{
							alert("저장 실패하였습니다.!! 연구소에 문의 부탁드립니다.");
							return;
						}
					}).error(function (data, status, headers, config) {
						//console.log("error",data,status,headers,config);
					});
				}
            };
        }]);
}());