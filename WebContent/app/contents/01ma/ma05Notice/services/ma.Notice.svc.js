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
				 * 이미지 업로드
				 */
            	imgUpload : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/ut05FileUpload",
						data	: param
					});
				}
            	
            	/**
				 * 공지사항 등록
				 */
            	,noticeInsert : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/notice/noticeI",
						data	: param
					});
				}
            
	            /**
				 * 공지사항 수정
				 */
            	,noticeUpdate : function (param) {					
					return $http({
						method	: "PUT",
						url		: APP_CONFIG.domain +"/notice/noticeU",
						data	: param
					});
				}
            	
            	/**
				 * 공지 삭제
				 */
            	,noticeDelete: function (param) {				
					return $http({
						method	: "DELETE",
						url		: APP_CONFIG.domain +"/notice/noticeR",
						data	: param
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
					});
				}
            	
            };
        }]);
}());