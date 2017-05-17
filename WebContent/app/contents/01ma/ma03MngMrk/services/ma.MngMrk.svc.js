(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.MngMrk.service : ma.MngMrkSvc
     * MngMrk에 "관리자마켓(을)"를 관리한다.
     */
    angular.module("ma.MngMrk.service")
        .factory("ma.MngMrkSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
				/**
				 * 새 마켓정보 등록 Parameter 생성한다.
				 */
            	mngmrkInsert : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/mngmrk/mrkInsert",
						data	: param
					}).success(function (data, status, headers, config) {
						if(data !== "1") {
							alert("저장 실패하였습니다.!! 연구소에 문의 부탁드립니다.");
							return;
						}
					}).error(function (data, status, headers, config) {
						console.log("error",data,status,headers,config);
					});
				}
            
	            /**
				 * 기존 마켓정보를 수정 Parameter 생성한다.
				 */
            	,mngmrkUpdate : function (param) {					
					return $http({
						method	: "PUT",
						url		: APP_CONFIG.domain +"/mngmrk/mrkUpdate",
						data	: param
					}).success(function (data, status, headers, config) {
						if(data !== "1") {
							alert("수정 실패하였습니다.!! 연구소에 문의 부탁드립니다.");
							return;
						}
					}).error(function (data, status, headers, config) {
						console.log("error",data,status,headers,config);
					});
				}
            	
            	/**
				 * 기존 마켓정보를 삭제 Parameter 생성한다.
				 */
            	,mngmrkDelete: function (param) {					
					return $http({
						method	: "PUT",
						url		: APP_CONFIG.domain +"/mngmrk/mrkDelete",
						data	: param
					}).success(function (data, status, headers, config) {
						if(data !== "1") {
							alert("삭제 실패하였습니다.!! 연구소에 문의 부탁드립니다.");
							return;
						}
					}).error(function (data, status, headers, config) {
						console.log("error",data,status,headers,config);
					});
				}
            	
            	//배열에 찾는 값이 있나 
            	,arrayIndexCheck: function(arr, target){
            		return arr.indexOf(target) >= 0 ? true : false;
            	}
            
            };
        }]);
}());