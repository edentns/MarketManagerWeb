(function () {
    "use strict";

    angular.module("edtApp.common.directive")
        .directive("co02Filebox", ["$timeout", "APP_CONFIG", "FileUploader", '$http', '$document', function ($timeout, APP_CONFIG, FileUploader, $http, $document) {
        	var contentUrl;
        	return {
                restrict: 'E',
                scope: {
                	filevo: '=',
      			    change: "&"
                },
                link: function(scope, element, attrs) {
                	scope.contentUrl = 'app/shared/components/co02Filebox/co02Filebox.tpl.01.html';
                	if(scope.filevo.limitCnt && scope.filevo.limitCnt > 1) {
                		scope.contentUrl = 'app/shared/components/co02Filebox/co02Filebox.tpl.02.html';
                	}
                },
                template:'<div data-ng-include="contentUrl"></div>',
                controller:['$scope', function ($scope) {
                	var serverUrl = APP_CONFIG.domain + "/ut05FileUpload",
                		bMulti = false,
                		loFnSuccessCallBack = null,
                		loFnFailCallBack = null;

                    /**
                     * @description 초기화 데이터
                     */
                	$scope.filevo_back = {};

                    /**
                     * @description 
                     */
                	$scope.co02FileVO = {
                		isUploadSuccess: true,
                		uploader: new FileUploader({
	                		url: serverUrl
	                	}),
	                	limitCnt: 1,
	                	YN_DEL: 'N',
	                	CD_REF1: '',
	                	CD_REF2: '',
	                	CD_REF3: '',
	                	CD_REF4: '',
	                	CD_REF5: '',
	                	fileId: '',
	                	fileName: '',         // 첨부파일 명칭
	                	delBtnDisabled: true, // 삭제버튼 활성화 여부
	                	currentData: null,    // 조회된 첨부파일 데이터
	                	currentDataList: [],  // 조회된 첨부파일 데이터 리스트 (멀티건 사용)	
	                	deleteDataList: [],   // 삭제된 데이터 리스트 (멀티건 사용)
	                	dirty: false,         // 변경사항 여부
	                	bImage: false,        // 이미지파일여부
	                	imgSrc: '',
	                	imgWidth: '100%',
	                	imgHeight: '100%'
                	};

                    /**
                     * @description 초기실행 함수
                     */
                	$scope.initLoad = function () {
                		var self = this;
                		if($scope.filevo.limitCnt)  $scope.co02FileVO.limitCnt  = $scope.filevo.limitCnt;
                		if($scope.filevo.bImage)    $scope.co02FileVO.bImage    = $scope.filevo.bImage;
                		if($scope.filevo.imgSrc)    $scope.co02FileVO.imgSrc    = $scope.filevo.imgSrc;
                		if($scope.filevo.imgWidth)  $scope.co02FileVO.imgWidth  = $scope.filevo.imgWidth;
                		if($scope.filevo.imgHeight) $scope.co02FileVO.imgHeight = $scope.filevo.imgHeight;
                		
                		if($scope.filevo.currentData) {
                			$scope.co02FileVO.currentData = $scope.filevo.currentData;
                			$scope.co02FileVO.fileName = $scope.filevo.currentData.NM_FILE;
                			if($scope.filevo.bImage) $scope.co02FileVO.imgSrc = $scope.filevo.currentData.NM_FILEPATH;
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
                		
                		if($scope.co02FileVO.limitCnt > 1) {
                			if($scope.filevo.currentDataList) {
                				$scope.co02FileVO.currentDataList = $scope.filevo.currentDataList;

                    			angular.forEach($scope.co02FileVO.currentDataList, function(dataInfo, key) {
                    				$scope.co02FileVO.currentDataList[key].phantom = false;
                    				$scope.co02FileVO.currentDataList[key].dirty = false;
                    			});
                			}
                		}
                		
                		$scope.filevo = $scope.co02FileVO;
                		if($scope.filevo_back === {}) $scope.filevo_back = angular.copy($scope.filevo);
                	};

                	$scope.$watch('filevo.currentData', function (newValue, oldValue) {
                		$scope.initLoad();
				    });
                	
                    /**
                     * @description 단건 파일 삭제
                     */
                	$scope.co02FileVO.fileDelete = function() {
                		var self = this;
                		
                		if(self.fileName !== "" && self.currentData!==null) {
                			self.YN_DEL = 'Y';
                		}
                		
                		if(self.bImage) {
                			self.imgSrc = '//:0';
            			}
                		
                		angular.element($document[0].getElementById(self.fileId)).val(null);
            			self.delBtnDisabled = true;
                		self.uploader.clearQueue();
                		self.fileName = "";
                		self.dirty = true;
                	};

                    /**
                     * @description 첨부파일 수정 취소(초기화)
                     */
                	$scope.co02FileVO.fileInit = function() {
                		var self = this;

                		self.isUploadSuccess = true;
                		self.YN_DEL          = 'N';
                		self.fileName        = '';    // 첨부파일 명칭
                		self.delBtnDisabled  = true;  // 삭제버튼 활성화 여부
                		self.currentData     = null;  // 조회된 첨부파일 데이터
                		self.dirty           = false; // 변경사항 여부

            			if($scope.filevo_back.imgSrc == '') self.imgSrc = '//:0';
            			else                                self.imgSrc = $scope.filevo_back.imgSrc;
                		
                		if($scope.filevo_back.currentData) {
                			self.currentData    = $scope.filevo_back.currentData;
                			self.fileName       = $scope.filevo_back.currentData.NM_FILE;
                			if(self.bImage) self.imgSrc = $scope.filevo_back.currentData.NM_FILEPATH;
                			self.delBtnDisabled = false;
                		}
                		
                		if($scope.co02FileVO.limitCnt > 1) {
                			if($scope.filevo_back.currentDataList) {
                				self.currentDataList = [];

                    			angular.forEach($scope.filevo_back.currentDataList, function(dataInfo, key) {
                    				dataInfo.phantom = false;
                    				dataInfo.dirty = false;
                    				self.currentDataList.push(dataInfo);
                    			});
                			}
                		}
                		
                		self.uploader.clearQueue();
                		if(self.fileName === '') {
                    		angular.element($document[0].getElementById(self.fileId)).val(null);
                		}
                	};

                    /**
                     * @description 첨부파일 다운로드
                     */
                	$scope.co02FileVO.fileDownload = function() {
                		var self = this,
            		    	hiddenA = null;
                		
                		if(self.dirty || !self.currentData || !self.currentData.NO_AT || self.bImage) return;
                		
						hiddenA = document.createElement('a');
						hiddenA.setAttribute('id', 'fileDownload');
						hiddenA.setAttribute('class', 'throw');
						hiddenA.setAttribute('href', serverUrl + "?"+ $.param({NO_AT:self.currentData.NO_AT}));
						document.body.appendChild(hiddenA);
	
						hiddenA.click();
						angular.element(hiddenA).remove();
                	};

                    /**
                     * @description 첨부파일 다운로드
                     */
                	$scope.co02FileVO.fileMultiDownload = function(idx) {
                		var self = this,
            		    	hiddenA = null;
                		
                		if(self.currentDataList[idx].phantom) return;
                		
						hiddenA = document.createElement('a');
						hiddenA.setAttribute('id', 'fileDownload');
						hiddenA.setAttribute('class', 'throw');
						hiddenA.setAttribute('href', serverUrl + "?"+ $.param({NO_AT:self.currentDataList[idx].NO_AT}));
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

                	$scope.co02FileVO.addDeleteDataList = function(idx) {
                		var self = this,
                		    fileInfo = this.currentDataList[idx];

                		self.currentDataList.splice(idx, 1);
                		
                		if(!fileInfo.phantom) {
                			self.deleteDataList.push(fileInfo);
                		}
                		else {
                			angular.forEach(self.uploader.queue, function(data, key) {
                				if(data === fileInfo.sourceFile) {
                					self.uploader.queue.splice(key, 1);
                				}
                			});
                		}
                		
                		self.fileName = "";
                		self.dirty = true;
                	};
                	
                    /**
                     * @description 수정 파일을 서버에 반영한다.
                     */
                	$scope.co02FileVO.doUpload = function (fnSuccessCallBack, fnFailCallBack) {
                		var self = this,
                			deleteList = '';
                		
                		if(self.limitCnt > 1) {
                			if(self.deleteDataList.length > 0) {            					
                				angular.forEach(self.deleteDataList, function(currentData, key) {
                					if(key === 0) deleteList = currentData.NO_AT;
                					else          deleteList = deleteList + ':' + currentData.NO_AT;
                				});
                				
                				$http({
                					url : serverUrl + "?" + $.param({NO_AT:deleteList}),
                					method : "DELETE"
                				}).then(function(result) {
                					self.doUploadAll();
                				})
                			}
                			else {
                				self.doUploadAll();
                			}
                    		loFnSuccessCallBack = fnSuccessCallBack;
                    		loFnFailCallBack = fnFailCallBack;
                    		
                			return;
                		}
                		
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
                                	"cd_ref5" : self.CD_REF5,
                                	"bimage"  : self.bImage
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
                    	
                    	if($scope.co02FileVO.bImage && !(fileItems._file.type.indexOf('image') > -1)){
                    		alert("이미지파일이 아닙니다.");
                    		return;
                    	}

                    	if(fileLength > 15) {
                    		fileName = fileName.slice(0,9)+"..."+fileName.slice(fileLength-6,fileLength);
                    	}
                    	
                    	if($scope.co02FileVO.limitCnt > 1) {
                    		if($scope.co02FileVO.currentDataList.length >= $scope.co02FileVO.limitCnt) {
                    			alert('허용된 첨부파일 수('+$scope.co02FileVO.limitCnt+')가 초과되었습니다.');
                    			return;
                    		}
                    		
                    		var currentData = {
                    			NM_FILE:fileName,
                    			sourceFile:fileItems,
                    			phantom:true,
                    			dirty:false
                    		};
                		
                    		if(fileItems._file.type.indexOf('image') > -1){
                        		var reader = new FileReader();
                        		reader.onload = function(e) {
                        			$scope.$apply(function() {
                        				currentData.imgSrc = e.target.result;
                        				
        	                    		$scope.co02FileVO.currentDataList.push(currentData);
        	                    		$scope.co02FileVO.dirty = true;
        	                    		$scope.co02FileVO.fileName = fileName;
                        			})
                        		}

                        		reader.readAsDataURL(fileItems._file);
                        	}
                    		else {
	                    		$scope.co02FileVO.currentDataList.push(currentData);
	                    		$scope.co02FileVO.dirty = true;
	                    		$scope.co02FileVO.fileName = fileName;
                    		}
                    		return;
                    	}
                    	// image일 경우
                    	else if($scope.co02FileVO.bImage) {
                    		var reader = new FileReader();
                    		
                    		reader.onload = function(e) {
                    			$scope.$apply(function() {
                    				$scope.co02FileVO.imgSrc = e.target.result;
                    			})
                    		}

                    		reader.readAsDataURL(fileItems._file);
                    	}    
                    	
                    	if(self.queue.length !== 1) {
                    		self.clearQueue();
                    		self.queue.push(fileItems);
                    	}

                		if($scope.co02FileVO.fileName !== "" && $scope.co02FileVO.currentData!==null) {
                			$scope.co02FileVO.YN_DEL = 'Y';
                		}

                		$scope.co02FileVO.dirty = true;
            			$scope.co02FileVO.delBtnDisabled = false;
                    	$scope.co02FileVO.fileName = fileName;
                    };

                    /**
                     * @description loading bar를 on한다.
                     */
                    $scope.co02FileVO.uploader.onSuccessItem = function (item,response,status,headers) {
                        var self = this;
                        if($scope.co02FileVO.limitCnt === 1) {
	                        $scope.co02FileVO.currentData = response;
	                        $scope.filevo_back.currentData = $scope.co02FileVO.currentData;
                        }
                    };
                    
                    /**
                     * @description loading bar를 off한다.
                     */
                    $scope.co02FileVO.uploader.onCompleteAll = function(file) {
                        $scope.$emit( "event:loading", false );
                        if ( $scope.filevo.isUploadSuccess ) {
                        	if(loFnSuccessCallBack) loFnSuccessCallBack();
                        	
                        	$scope.co02FileVO.fileInit();
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
