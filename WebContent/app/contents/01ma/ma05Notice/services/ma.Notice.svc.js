(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Notice.service : ma.NoticeSvc
     * Notice에 ""를 관리한다.
     */
    angular.module("ma.Notice.service")
        .factory("ma.NoticeSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
            	/**
				 * 새 마켓정보 등록 Parameter 생성한다.
				 */
            	imgUpload : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/ut05FileUpload",
						data	: param
					}).success(function (data, status, headers, config) {
						
					}).error(function (data, status, headers, config) {
						alert("재 업로드 해주세요.");
					});
				}
            	
            	/**
				 * 새 마켓정보 등록 Parameter 생성한다.
				 */
            	,noticeInsert : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/notice/noticeI",
						data	: param
					}).success(function (data, status, headers, config) {
						
					}).error(function (data, status, headers, config) {
						alert("새 글을 써주세요.");
					});
				}
            
	            /**
				 * 기존 마켓정보를 수정 Parameter 생성한다.
				 */
            	,noticeUpdate : function (param) {					
					return $http({
						method	: "PUT",
						url		: APP_CONFIG.domain +"/notice/noticeU",
						data	: param
					}).success(function (data, status, headers, config) {
						
					}).error(function (data, status, headers, config) {
						//console.log("error",data,status,headers,config);
						alert("새로 수정해 주세요.");
					});
				}
            	
            	/**
				 * 기존 마켓정보를 삭제 Parameter 생성한다.
				 */
            	,noticeDelete: function (param) {					
					return $http({
						method	: "DELETE",
						url		: APP_CONFIG.domain +"/notice/noticeR",
						data	: param
					}).success(function (data, status, headers, config) {
						if(data === "") {
							alert("삭제 실패하였습니다.!! 연구소에 문의 부탁드립니다.");
						}else{
							alert("삭제 되었습니다.");
						}
					}).error(function (data, status, headers, config) {						
						//console.log("error",data,status,headers,config);
						alert("다시 삭제 해주세요.");
					});
				}
            	
            	/**
				 * 공지사항 시퀀스 번호 가져오기
				 */
            	,noticeGetseq: function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/notice/noticeS",
						data	: param
					}).success(function (data, status, headers, config) {
						
					}).error(function (data, status, headers, config) {						
						//console.log("error",data,status,headers,config);
						alert("순번 가져오기 실패.");
					});
				}
            	
            };
        }]);
}());