(function () {
    "use strict";

    angular.module("edtApp.common.directive")
        .directive("co02Filebox", ["$timeout", "APP_CONFIG", "FileUploader", '$http', '$document', function ($timeout, APP_CONFIG, FileUploader, $http, $document) {
        	return {
                restrict: 'E',
                scope: {
                	filevo: '=',
      			    change: "&"
                },
                template:
                		"<div>" +
	                		"<input type='file' ng-attr-id='{{filevo.fileId}}' style='display: none;' nv-file-select uploader='filevo.uploader'>" +
                			"<input type='text' class='form-control' readonly='readonly' data-ng-click='filevo.fileDownload()' style='min-width:190px; max-width:58%; padding-left:2px; padding-right:2px; margin-right:2px;' data-ng-model='filevo.fileName'>" +
                			"<button type='button' class='btn btn-primary' style='margin-right:2px;' title='파일선택' data-ng-click='filevo.fileClick()'>파일선택</button>" +
	                		"<button type='button' class='btn btn-primary' style='margin-right:2px;' title='삭제' data-ng-click='filevo.fileDelete()' data-ng-disabled='filevo.delBtnDisabled'>삭제</button>" +
	                		"<button type='button' class='btn btn-primary' style='margin-right:2px;' title='취소' data-ng-click='filevo.fileInit()' data-ng-disabled='!filevo.dirty'>취소</button>" +
                		"</div>",
                controller:['$scope', function ($scope) {
                	var serverUrl = APP_CONFIG.domain + "/ut05FileUpload",
                		bMulti = false,
                		loFnSuccessCallBack = null,
                		loFnFailCallBack = null;
                	
                	$scope.filevo_back = {};
                	
                	$scope.co02FileVO = {
                		isUploadSuccess: true,
                		uploader: new FileUploader({
	                		url: serverUrl
	                	}),
	                	YN_DEL: 'N',
	                	CD_REF1: '',
	                	CD_REF2: '',
	                	CD_REF3: '',
	                	CD_REF4: '',
	                	CD_REF5: '',
	                	fileId: '',
	                	fileName: '',          // 첨부파일 명칭
	                	delBtnDisabled: true,  // 삭제버튼 활성화 여부
	                	currentData: null,     // 조회된 첨부파일 데이터
	                	dirty: false,          // 변경사항 여부
                	};
                	
                	$scope.initLoad = function () {
                		var self = this;

                		if($scope.filevo.currentData) {
                			$scope.co02FileVO.currentData = $scope.filevo.currentData;
                			$scope.co02FileVO.fileName = $scope.filevo.currentData.NM_FILE;
                			$scope.co02FileVO.delBtnDisabled = false;
                		}
                		if($scope.filevo.CD_AT) {
                			$scope.co02FileVO.CD_AT = $scope.filevo.CD_AT;
                			$scope.co02FileVO.fileId = 'filevo-'+$scope.co02FileVO.CD_AT;
                		}
                		if($scope.filevo.CD_REF1) $scope.co02FileVO.CD_REF1 = $scope.filevo.CD_REF1;
                		if($scope.filevo.CD_REF2) $scope.co02FileVO.CD_REF2 = $scope.filevo.CD_REF2;
                		if($scope.filevo.CD_REF3) $scope.co02FileVO.CD_REF3 = $scope.filevo.CD_REF3;
                		if($scope.filevo.CD_REF4) $scope.co02FileVO.CD_REF4 = $scope.filevo.CD_REF4;
                		if($scope.filevo.CD_REF5) $scope.co02FileVO.CD_REF5 = $scope.filevo.CD_REF5;
                		
                		$scope.filevo = $scope.co02FileVO;
                		$scope.filevo_back = angular.copy($scope.filevo);
                	};

                	$scope.co02FileVO.fileDelete = function() {
                		var self = this;
                		
                		if(self.fileName !== "" && self.currentData!==null) {
                			self.YN_DEL = 'Y';
                		}
                		angular.element($document[0].getElementById(self.fileId)).val(null);
            			$scope.co02FileVO.delBtnDisabled = true;
                		self.uploader.clearQueue();
                		self.fileName = "";
                		self.dirty = true;
                	};

                	$scope.co02FileVO.fileInit = function() {
                		var self = this;

                		self.isUploadSuccess = true;
                		self.YN_DEL = 'N';
                		self.fileName = '';          // 첨부파일 명칭
                		self.delBtnDisabled = true;  // 삭제버튼 활성화 여부
                		self.currentData = null;     // 조회된 첨부파일 데이터
                		self.dirty = false;          // 변경사항 여부

                		if($scope.filevo_back.currentData) {
                			self.currentData = $scope.filevo_back.currentData;
                			self.fileName = $scope.filevo_back.currentData.NM_FILE;
                			self.delBtnDisabled = false;
                		}
                		self.uploader.clearQueue();
                		if(self.fileName === '') {
                    		angular.element($document[0].getElementById(self.fileId)).val(null);
                		}
                	};
                	
                	$scope.co02FileVO.fileDownload = function() {
                		var self = this,
            		    	hiddenA = null;
                		
                		if(self.dirty || !self.currentData || !self.currentData.NO_AT) return;
                		
						hiddenA = document.createElement('a');
						hiddenA.setAttribute('id', 'fileDownload');
						hiddenA.setAttribute('class', 'throw');
						hiddenA.setAttribute('href', serverUrl + "?"+ $.param({NO_AT:self.currentData.NO_AT}));
						document.body.appendChild(hiddenA);
	
						hiddenA.click();
						angular.element(hiddenA).remove();
                	};
            		
                	$scope.co02FileVO.fileClick = function() {
                		var self = this,
                		    obFile = null;
                		obFile = $document[0].getElementById(self.fileId);                		
                		if(obFile) angular.element(obFile).click();
                	};

                    /**
                     * @description 수정 파일을 서버에 반영한다.
                     */
                	$scope.co02FileVO.doUpload = function (fnSuccessCallBack, fnFailCallBack) {
                		var self = this;
                		if(self.YN_DEL === 'Y') {
	                		$http({
	                            url    : serverUrl + "?"+ $.param({NO_AT:self.currentData.NO_AT}),
	                            method : "DELETE"
	                        }).then(function(result) {
	                        	self.deleteFileList=[];
	                        	self.currentData=null;
	                        	self.doUploadAll();
	                        });
                		}
                		else {
                        	self.doUploadAll();
                		}
                		loFnSuccessCallBack = fnSuccessCallBack;
                		loFnFailCallBack = fnFailCallBack;
                    };
                    

                    /**
                     * @description 수정 파일을 서버에 반영한다.
                     */
                	$scope.co02FileVO.doUploadAll = function () {
                		var self = this;
                    	if (self.uploader.queue.length > 0 ) {
                            angular.forEach(self.uploader.queue, function (file) {
                                file.formData.push({
                                	"cd_at"   : self.CD_AT,
                                	"cd_ref1" : self.CD_REF1,
                                	"cd_ref2" : self.CD_REF2,
                                	"cd_ref3" : self.CD_REF3,
                                	"cd_ref4" : self.CD_REF4,
                                	"cd_ref5" : self.CD_REF5
                                });
                            });
                            self.uploader.uploadAll();
                        }
                    	else {
                    		loFnSuccessCallBack();
                    	}
                    };
                    
                    /**
                     * @description loading bar를 on한다.
                     */
                    $scope.co02FileVO.uploader.onBeforeUploadItem = function () {
                        $scope.$emit( "event:loading", true );
                    };
                    
                    /**
                     * @description loading bar를 on한다.
                     */
                    $scope.co02FileVO.uploader.onAfterAddingFile = function (fileItems) {
                    	var self = this,
                    	    fileName = angular.element($document[0].getElementById($scope.co02FileVO.fileId)).val(),
                    	    fileLength = 0;
                    	fileName = fileName.replace("C:\\fakepath\\","");
                    	fileLength = fileName.length;
                    	
                    	if(fileLength > 15) {
                    		fileName = fileName.slice(0,9)+"..."+fileName.slice(fileLength-6,fileLength);
                    	}
                    	if(self.queue.length !== 1) {
                    		self.clearQueue();
                    		self.queue.push(fileItems);
                    	}

                		if($scope.co02FileVO.fileName !== "" && $scope.co02FileVO.currentData!==null) {
                			$scope.co02FileVO.YN_DEL = 'Y';
                		}

                		$scope.co02FileVO.dirty= true;
            			$scope.co02FileVO.delBtnDisabled = false;
                    	$scope.co02FileVO.fileName = fileName;
                    };

                    /**
                     * @description loading bar를 on한다.
                     */
                    $scope.co02FileVO.uploader.onSuccessItem = function (item,response,status,headers) {
                        var self = this;
                        self.currentData = response;
                    };
                    
                    /**
                     * @description loading bar를 off한다.
                     */
                    $scope.co02FileVO.uploader.onCompleteAll = function(file) {
                        $scope.$emit( "event:loading", false );
                        if ( $scope.filevo.isUploadSuccess ) {
                        	if(loFnSuccessCallBack) loFnSuccessCallBack();
                        } else {
                        	if(loFnFailCallBack) loFnFailCallBack();
                        }
                    };

                    /**
                     * @description Uploader실패
                     */
                    $scope.co02FileVO.uploader.onErrorItem = function (item, response, status, headers) {
                    	$scope.filevo.isUploadSuccess = false;
                    };
                    
                    $scope.initLoad();
                }]
            }
        }]);
}());
