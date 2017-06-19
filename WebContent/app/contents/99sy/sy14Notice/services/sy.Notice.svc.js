(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Notice.service : sy.NoticeSvc
     * 공지사항
     */
    angular.module("sy.Notice.service")
        .factory("sy.NoticeSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
            	noticeInsert : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/notice/noticeInsert",
						data	: param
					}).success(function (data, status, headers, config) {
						if(data === "") {
							alert("저장 실패하였습니다.!! 연구소에 문의 부탁드립니다.");
							return;
						}else{
							alert("저장 되었습니다.");
							return;
						}
					}).error(function (data, status, headers, config) {
						console.log("error",data,status,headers,config);
					});
				}
            
	            /**
				 * 기존 마켓정보를 수정 Parameter 생성한다.
				 */
            	,noticeUpdate : function (param) {					
					return $http({
						method	: "PUT",
						url		: APP_CONFIG.domain +"/notice/noticeUpdate",
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
            	,noticeDelete: function (param) {					
					return $http({
						method	: "DELETE",
						url		: APP_CONFIG.domain +"/notice/noticeDelete",
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
            };
        }]);
}());