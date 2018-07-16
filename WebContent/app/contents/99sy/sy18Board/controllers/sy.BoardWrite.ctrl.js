(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.BoardWrite.controller : sy.BoardWriteCtrl
     * 게시판 등록/수정
     */
    angular.module("sy.Board.controller")
        .controller("sy.BoardWriteCtrl", ["$stateParams", "$window", "$rootScope", "$scope", "$state", "$http", "$q", "$log", "sy.BoardSvc", "APP_CONFIG", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", 
            function ($stateParams, $window, $rootScope, $scope, $state, $http, $q, $log, SyBoardSvc, APP_CONFIG, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            var boardWriteDataVO = $scope.boardWriteDataVO = {
	            	boxTitle : "글쓰기",
	            	params   : resData.params,
	            	kEditor    : UtilSvc.kendoEditor("010"),
                	NO_C      : $rootScope.webApp.user.NO_C,
                	NO_EMP    : $rootScope.webApp.user.NO_EMP,
                	NM_NKNE   : $rootScope.webApp.user.NM_NKNE,
	            	fileDataVO : {
	            		CD_AT:'011',
	        			limitCnt: 5,
	        			currentDataList: resData.currentDataList
	            	}
		        };
	            
	            boardWriteDataVO.goSave = function() {
	            	//저장하고 이동
	            	if(!(boardWriteDataVO.params.DC_SBJ).trim()) {
	            		return edt.invalidFocus("DC_SBJ", "[필수] 제목을 입력해주세요.");
	            	}
	            	else if(!(boardWriteDataVO.params.DC_HTMLCONTENT).trim()) {
	            		return edt.invalidFocus("DC_HTMLCONTENT", "[필수] 내용을 입력해주세요.");
	            	}
	            	
	            	if($stateParams.ids === "new") {
	            		if(confirm("저장하시겠습니까?")) {
	            			SyBoardSvc.boardSave(boardWriteDataVO.params, "I").then(function(res) {
	            				if(res.data) {
	            					if(boardWriteDataVO.fileDataVO.dirty) {
	            						boardWriteDataVO.fileDataVO.CD_REF1 = res.data;
	            						boardWriteDataVO.fileDataVO.doUpload(function(){
            			        			alert('저장 되었습니다.');
            				            	$state.go('app.syBoard', { kind: 'list', menu: true, ids: null });
            			        		}, function() {
            			        			alert('첨부파일업로드 실패하였습니다.');
            				            	$state.go('app.syBoard', { kind: 'list', menu: true, ids: null });
            			        		});
            		        		}else{
            		        			alert('저장 되었습니다.');
            			            	$state.go('app.syBoard', { kind: 'list', menu: true, ids: null });
            		        		}  
	            				}
	            			});
	            		}
	            	}
	            	else {
	            		if(confirm("수정하시겠습니까?")) {
	            			SyBoardSvc.boardSave(boardWriteDataVO.params, "U").then(function(res) {
	            				if(res.data) {
	            					if(boardWriteDataVO.fileDataVO.dirty) {
	            						boardWriteDataVO.fileDataVO.CD_REF1 = res.data;
	            						boardWriteDataVO.fileDataVO.doUpload(function(){
            			        			alert('수정 되었습니다.');
            				            	$state.go('app.syBoard', { kind: 'list', menu: true, ids: null });
            			        		}, function() {
            			        			alert('첨부파일업로드 실패하였습니다.');
            				            	$state.go('app.syBoard', { kind: 'list', menu: true, ids: null });
            			        		});
            		        		}else{
            		        			alert('수정 되었습니다.');
            			            	$state.go('app.syBoard', { kind: 'list', menu: true, ids: null });
            		        		}
	            				}
	            			});
	            		}
	            	}
	            };
	            
	            boardWriteDataVO.goList = function() {
	            	//목록으로 이동
	            	$state.go('app.syBoard', { kind: 'list', menu: true, ids: null });
	            };

				// 처음 로드되었을 때 실행된다.
				(function  () {
					$timeout(function () {
                        edt.id("DC_SBJ").focus();
                    }, 500);
				}());
            }]);
}());