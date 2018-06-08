(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Qa.controller : ma.QaCtrl
     * QA 관리
     */
    angular.module("ma.File.controller")
        .controller("ma.FileCtrl", ["$window", "$scope", "$state", "$http", "$q", "APP_CONFIG", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "ma.FileSvc", 
            function ($window, $scope, $state, $http, $q, APP_CONFIG, APP_CODE, $timeout, resData, Page, UtilSvc, maFileSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            gridHeaderAttributes = {"class": "table-header-cell", style: "text-align: center; font-size: 12px"};
	            
	            var fileDataVO = $scope.fileDataVO = {
	            	boxTitle : "파일 관리",
	            	setting : {
	            		id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 2
	            	},
	            	datesetting : {  // 등록일자
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month', 'range'],
						selected   : resData.selectDate.selected,
						period : {
							start : resData.selectDate.start,
							end   : resData.selectDate.end
						}
	        		}, 
             	    fileGubunModel : resData.fileGubunModel, // 파일구분
             	    fileGubunBind  : resData.fileGubunBind,  // 파일구분
             	    ynDelList      : [{CD_DEF: 'N', NM_DEF: '미삭제'},{CD_DEF: 'Y', NM_DEF: '삭제'}], 
             	    ynDelModel     : resData.ynDelModel,     // 삭제여부
             	    noC            : resData.noC             // 가입자번호
		        };

	            fileDataVO.isOpen = function (val) {
	            	if(val) {
	            	}
	            	else {
	            	}
	            };
	            
	            fileDataVO.reset = function() {
	            	var self = this;

	            	self.fileGubunBind.bReset = true;
	            	self.datesetting.period.start = angular.copy(edt.getToday());
	            	self.datesetting.period.end   = angular.copy(edt.getToday());
	            	self.datesetting.selected = '1Week';
	            };
	            
	            fileDataVO.init = function() {
	            	fileDataVO.search();
	            };
	            
	            UtilSvc.gridtooltipOptions.filter = "td";
	            fileDataVO.tooltipOptions = UtilSvc.gridtooltipOptions;
	            
	            //초기 실행
	            fileDataVO.search = function(){
	            	var self = this;
	            	var param = {
    						procedureParam: "USP_MA_11FILE_GET&L_CD_AT@s|L_YN_DIRDEL@s|L_NO_C@s|L_START_DATE@s|L_END_DATE@s",
    						L_CD_AT       : self.fileGubunModel,
    						L_YN_DIRDEL   : self.ynDelModel,
    						L_NO_C        : self.noC,
    						L_START_DATE  : new Date(self.datesetting.period.start.y, self.datesetting.period.start.m-1, self.datesetting.period.start.d).dateFormat("Ymd"),
    						L_END_DATE    : new Date(self.datesetting.period.end.y  , self.datesetting.period.end.m-1  , self.datesetting.period.end.d).dateFormat("Ymd"),
    					};
					UtilSvc.getList(param).then(function (res) {
						$scope.gridFileVO.dataSource.data(res.data.results[0]);

						// 조회한 조건을 localstorage에 저장함.
						var inquiryParam = {
							fileGubunBindSelectIndex: self.fileGubunBind.allSelectNames,	
							fileGubunModel: self.fileGubunModel,       
							ynDelModel : self.ynDelModel,       
							noC        : self.noC,
							selected   : self.datesetting.selected,
    	                    start      : self.datesetting.period.start,
    	                    end        : self.datesetting.period.end
	                    };
						
	        			// 검색조건 세션스토리지에 임시 저장
	        			UtilSvc.grid.setInquiryParam(inquiryParam);
					});
	            };	
	            
	            var gridFileVO = $scope.gridFileVO = {
                    messages: {
                        noRows: "파일정보가 존재하지 않습니다.",
                        loading: "파일정보를 가져오는 중...",
                        requestFailed: "파일정보를 가져오는 중 오류가 발생하였습니다.",
                    },
                	boxTitle : "파일",                 	
                    pageable: {
                    	messages: UtilSvc.gridPageableMessages
                    },
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				e.success();
                			},
                			parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
                		},
                		batch: true,
                		pageSize: 20,
                		schema: {
                			model: {
                    			id: "NO_AT",
                				fields: {
                					ROW_NUM     : { type: "number", editable: false },
                					NO_C        : { type: "string" },
                					CD_AT       : { type: "string" },
                					NM_AT       : { type: "string" },
                					NM_FILE     : { type: "string" },
                					SZ_FILE     : { type: "string" },
                					NM_FILEPATH : { type: "string" },
                					YN_DIRDEL   : { type: "string" },
                					DTS_UPDATE  : { type: "string" },
                				}
                			}
                		}
                	}),
                	navigatable: true,
                	toolbar: [{template: kendo.template($.trim($("#bss-toolbar-template").html()))}],
                	autoBind: false,
                	resizable: true,
                	persistSelection: true,
                	columns: [
                	       {selectable: true, width: 50, headerAttributes: gridHeaderAttributes},
           		           {field: "ROW_NUM"  , title: "No",  width: 50, template: "<span class='row-number'></span>",
   							headerAttributes: gridHeaderAttributes},
   						   {field: "NO_C"     , title: "가입자번호", width: 100,  
   	   	   					headerAttributes: gridHeaderAttributes},
        		           {field: "NM_AT"    , title: "파일구분", width: 100, attributes: {class:"ta-l", style:"text-overflow: ellipsis; white-space: nowrap; overflow:hidden;"},
   	   						headerAttributes: gridHeaderAttributes},
         		           {field: "NM_FILE"  , title: "파일명",  width: 100, attributes: {class:"ta-l", style:"text-overflow: ellipsis; white-space: nowrap; overflow:hidden;"},
   	   	   					headerAttributes: gridHeaderAttributes},
        		           {field: "NM_FILEPATH", title: "파일경로", attributes: {class:"ta-l", style:"text-overflow: ellipsis; white-space: nowrap; overflow:hidden;"}, 
       	   					headerAttributes: gridHeaderAttributes},
         		           {field: "SZ_FILE"  , title: "파일크기", width: 100, attributes: {class:"ta-r", style:"text-overflow: ellipsis; white-space: nowrap; overflow:hidden;"}, 
           	   				headerAttributes: gridHeaderAttributes},
          		           {field: "YN_DIRDEL", title: "삭제여부", width: 100, 
               	   			headerAttributes: gridHeaderAttributes},
        		           {field: "DTS_UPDATE", title: "수정일시", width: 130, 
               	   			headerAttributes: gridHeaderAttributes}
                	],
                    collapse: function(e) {
                        // console.log(e.sender);
                        this.cancelRow();
                    },
                    dataBound: function () {
                        var rows = this.items();
                        $(rows).each(function () {
                            var index = $(this).index() + 1;
                            var rowLabel = $(this).find(".row-number");
                            $(rowLabel).html(index);
                        });
                    },
                	height: 699
                };

	            gridFileVO.fileDeleteMove = function() {
	            	// 서버에 전달
            		var grid = $scope.kg;
            		var gridSelect = grid.select();
            		var retData = [];
            		var iIndex = 0;
            		var dataItem = {};
            		for(; iIndex < gridSelect.length; iIndex++) {
            			dataItem = grid.dataItem(gridSelect[iIndex]);
            			
            			if(dataItem.YN_DEL === "삭제") {
            				alert('미삭제로 조회 후 삭제이동을 해야 합니다.');
            				return;
            			}
            			
            			retData.push(dataItem);
            		}

            		if(iIndex === 0) {
            			alert('선택된 데이터가 없습니다.');
            			return;
            		}
            		
		            if(confirm("삭제폴더로 이동하시겠습니까?")) {
	            		maFileSvc.fileDeleteMove(retData, "D").then(function(res) {
	        				if(res.data) {
	        					alert('삭제폴더로 이동하였습니다.');
	        					fileDataVO.search();
	        				}
	        				else {
	        					alert('삭제폴더의 이동에 실패하였습니다.');
	        				}
	        			});
	            	}
	            };
	            
	            gridFileVO.fileUndo = function() {
	            	// 서버에 전달
            		var grid = $scope.kg;
            		var gridSelect = grid.select();
            		var retData = [];
            		var iIndex = 0;
            		var dataItem = {};
            		for(; iIndex < gridSelect.length; iIndex++) {
            			dataItem = grid.dataItem(gridSelect[iIndex]);
            			
            			if(dataItem.YN_DEL === "미삭제") {
            				alert('삭제로 조회 후 원복을 하셔야 합니다.');
            				return;
            			}

            			retData.push(dataItem);
            		}
            		
            		if(iIndex === 0) {
            			alert('선택된 데이터가 없습니다.');
            			return;
            		}
            		
            		if(confirm("해당 건을 원복하시겠습니까?")) {
	            		maFileSvc.fileDeleteMove(retData, "U").then(function(res) {
	        				if(res.data) {
	        					alert('원복하였습니다.');
	        					fileDataVO.search();
	        				}
	        				else {
	        					alert('원복에 실패하였습니다.');
	        				}
	        			});
	            	}
	            };
	            
	            fileDataVO.init();
            }]);
}());