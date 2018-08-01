(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Qa.controller : ma.QaCtrl
     * QA 관리
     */
    angular.module("ma.Board.controller")
        .controller("ma.BoardCtrl", ["$window", "$scope", "$state", "$http", "$q", "APP_CONFIG", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "ma.BoardSvc", 
            function ($window, $scope, $state, $http, $q, APP_CONFIG, APP_CODE, $timeout, resData, Page, UtilSvc, maBoardSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            gridHeaderAttributes = {"class": "table-header-cell", style: "text-align: center; font-size: 12px"};
	            
//	            $scope.fbdWordMng = function() {
//	            	var fbdWordWin = $("#moFbdWordMng"),
//	            	    undo = $("#undo");
//	            	
//	            	fbdWordWin.open();
//	            	undo.fadeOut();
//				};
				
	            var boardDataVO = $scope.boardDataVO = {
	            	boxTitle : "게시판",
	            	datesetting : {
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month'],
						selected   : resData.selectDate.selected,
						period : {
							start : resData.selectDate.start,
							end   : resData.selectDate.end
						}
	        		},
             	    subject : resData.subject,  // 제목
             	    writer  : resData.writer,   // 글쓴이
             	    fbdCheck: resData.fbdCheck  // 금지어 등록된 게시물
		        };

	            boardDataVO.isOpen = function (val) {
	            	var searchIdHeight = $("#searchId").height();
	            	var settingHeight = $(window).height() - searchIdHeight - 90;
	            	var pageSizeValue = val? 20 : 24;
	            	
	            	$scope.kg.wrapper.height(settingHeight);
            		$scope.kg.resize();
            		gridBoardVO.dataSource.pageSize(pageSizeValue);
	            };
	            
	            boardDataVO.reset = function() {
	            	var self = this;
	            	self.datesetting.period.start = angular.copy(edt.getToday());
	            	self.datesetting.period.end   = angular.copy(edt.getToday());
	            	self.datesetting.selected = '1Week';
	            };
	            
	            boardDataVO.init = function() {
	            	boardDataVO.search(function(){
	            		boardDataVO.isOpen(false);
	            	});
	            };
	            
	            UtilSvc.gridtooltipOptions.filter = "td";
	            boardDataVO.tooltipOptions = UtilSvc.gridtooltipOptions;
	            
	            //초기 실행
	            boardDataVO.search = function(func){
	            	var self = this;
	            	var param = {
    						procedureParam: "USP_MA_10BOARD_GET&L_DC_SBJ@s|L_NO_INSERT@s|L_START_DATE@s|L_END_DATE@s|L_CHECK@s",
    						L_DC_SBJ      : self.subject,
    						L_NO_INSERT   : self.writer,
    						L_START_DATE  : new Date(self.datesetting.period.start.y, self.datesetting.period.start.m-1, self.datesetting.period.start.d).dateFormat("Ymd"),
    						L_END_DATE    : new Date(self.datesetting.period.end.y  , self.datesetting.period.end.m-1  , self.datesetting.period.end.d).dateFormat("Ymd"),
    						L_CHECK       : self.fbdCheck?'Y':'N'
    					};
					UtilSvc.getList(param).then(function (res) {
						$scope.gridBoardVO.dataSource.data(res.data.results[0]);

						// 조회한 조건을 localstorage에 저장함.
						var inquiryParam = {
							subject : self.subject,       
							writer  : self.writer,       
							fbdCheck: self.fbdCheck,
							period  : UtilSvc.grid.getDateSetting(self.datesetting)
	                    };
						
	        			// 검색조건 세션스토리지에 임시 저장
	        			UtilSvc.grid.setInquiryParam(inquiryParam);
	        			
	        			if(func !== undefined) {
	        				func();
	        			}
					});
	            };	
	            
	            var gridBoardVO = $scope.gridBoardVO = {
                    messages: {
                        noRows: "게시판정보가 존재하지 않습니다.",
                        loading: "게시판정보를 가져오는 중...",
                        requestFailed: "게시판정보를 가져오는 중 오류가 발생하였습니다.",
                        commands: {
                        	update: "글쓰기"
                        }
                    },
                	boxTitle : "게시판",                 	
                    pageable: {
                    	messages: UtilSvc.gridPageableMessages
                    },
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
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
                    			id: "NO_BOARD",
                				fields: {
                					ROW_NUM   : { type: "number", editable: false },
                					NO_BOARD  : { type: "string" },
                					SY_FILES  : { type: "number" },
                					DC_SBJ    : { type: "string" },
                					NM_NKNENOC: { type: "string" },
                					DTS_INSERT: { type: "string" },
                					CNT_SEL   : { type: "string" }
                				}
                			}
                		}
                	}),
                	navigatable: true,
                	toolbar: [{template: kendo.template($.trim($("#bss-toolbar-template").html()))}],
                	autoBind: false,
                	resizable: true,
                	columns: [
           		           {field: "ROW_NUM"  , title: "No",  width: 50, template: "<span class='row-number'></span>",
   							headerAttributes: gridHeaderAttributes},
        		           {field: "DC_SBJ"   , title: "제목", attributes: {class:"ta-l"}, 
   							template: kendo.template($("#dc_sbj_template").html()),
   	   						headerAttributes: gridHeaderAttributes},
        		           {field: "NM_NKNENOC", title: "가입자번호/글쓴이", width: 100,
       	   					headerAttributes: gridHeaderAttributes},
        		           {field: "DTS_INSERT", title: "등록일시", width: 130, headerAttributes: gridHeaderAttributes},
        		           {field: "CNT_SEL"   , title: "조회", width: 80, attributes: {class:"ta-r"}, headerAttributes: gridHeaderAttributes}
                	],
                    collapse: function(e) {
                        // console.log(e.sender);
                        this.cancelRow();
                    },
                    dataBound: function () {
                        var grid = this;
                        grid.tbody.find("tr").dblclick(function(e) {
                        	var dataItem = grid.dataItem(this);
                        	$state.go('app.maBoard', { kind: "", menu: null, write: null, ids: dataItem.NO_BOARD });
                        });
                        
                        var rows = this.items();
                        $(rows).each(function () {
                            var index = $(this).index() + 1;
                            var rowLabel = $(this).find(".row-number");
                            $(rowLabel).html(index);
                        });
                    },
                	height: 699
                };

				var fbdWordVO = $scope.fbdWordVO = {
	            	title : "금지어관리창",
             	    fbdWord : '',  // 금지어,
             	    width: "400",
             	    height: "560",
             	    visible: false,
             	    scrollable: false,
             	    modal: true
		        };

				fbdWordVO.search = function() {
					gridFbdWordVO.dataSource.read();
				};
				
				var gridFbdWordVO = $scope.gridFbdWordVO = {
                    messages: {
                        noRows: "금지어정보가 존재하지 않습니다.",
                        loading: "금지어정보를 가져오는 중...",
                        requestFailed: "금지어정보를 가져오는 중 오류가 발생하였습니다.",
                        commands: {
                        	create: "추가",
                        	destroy: "삭제",
                        	save: '저장',
                        	cancel: '취소'
                        }
                    },
                	boxTitle : "금지어",                 	
                    pageable: {
                    	messages: UtilSvc.gridPageableMessages
                    },
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				var param = {
            						procedureParam: "USP_MA_10BOARD02_GET&L_NM_BOARDFILTER@s",
            						L_NM_BOARDFILTER: fbdWordVO.fbdWord
            					};
            					UtilSvc.getList(param).then(function (res) {
            						e.success(res.data.results[0]);
            					});
                			},
                			create: function(e) {
	                			var defer = $q.defer();
                				maBoardSvc.boardFilterSave(e.data.models, "I").then(function () {
                					e.success();
            						defer.resolve();
            						gridFbdWordVO.dataSource.read();                					
                                });
	                			return defer.promise;
	            			},
                			update: function(e) {
	                			var defer = $q.defer();
                				maBoardSvc.boardFilterSave(e.data.models, "U").success(function () {
                					e.success();
            						defer.resolve();
            						gridFbdWordVO.dataSource.read();
                				});
	                			return defer.promise;
                			},
                			destroy: function(e) {
	                			var defer = $q.defer();
                				maBoardSvc.boardFilterSave(e.data.models, "D").success(function () {
                					e.success();
            						defer.resolve();
            						gridFbdWordVO.dataSource.read();
                				});
	                			return defer.promise;
                			},
                			parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
                		},
                		batch: true,
                		pageSize: 10,
                		schema: {
                			model: {
                    			id: "NO_BOARDFILTER",
                				fields: {
                					ROW_NUM       : { type: "number", editable: false },
                					NO_BOARDFILTER: { type: "string" },
                					NM_BOARDFILTER: { type: "string", validation: {required: true}},
                					DTS_INSERT    : { type: "string" }
                				}
                			}
                		}
                	}),
                	toolbar: ["create","save","cancel"],
                	columns: [
           		           {field: "NO_BOARDFILTER"  , title: "번호",  width: 130,
   							headerAttributes: gridHeaderAttributes},
        		           {field: "NM_BOARDFILTER", title: "금지어", width: 150, attributes: {class:"ta-l"}, 
       	   					headerAttributes: gridHeaderAttributes},
       	   				   {command: ["destroy"],minwidth:10}
                	],
                    collapse: function(e) {
                        this.cancelRow();
                    },
                    editable: true,
                	height: 410
                };
				
	            boardDataVO.init();
            }]);
}());