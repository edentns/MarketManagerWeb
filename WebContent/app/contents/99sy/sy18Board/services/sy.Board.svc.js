(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Board.service : sy.BoardSvc
     * 게시판를 등록, 수정, 삭제
     */
    angular.module("sy.Board.service")
        .factory("sy.BoardSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
//            	boardSearch : function (param) {					
//					return $http({
//						method	: "POST",
//						url		: APP_CONFIG.domain +"/sy/qaDelete",
//						data	: param
//					}).success(function (data, status, headers, config) {
//						alert(data);
//					}).error(function (data, status, headers, config) {
//						alert(data);
//						e.error();
//					});
//				},
				boardSave : function (param, CUD) {				
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/sy/boardInsert/"+CUD,
						data	: param
					});
				},
				boardCommentSave : function (param, CUD) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/sy/boardCommentInsert/"+CUD,
						data	: param
					});
				},
				boardCntSelSave : function (param) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/sy/boardCntSelInsert",
						data	: param
					});
				}
            };
        }]);
}());