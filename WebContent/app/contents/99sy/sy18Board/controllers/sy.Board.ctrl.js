(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Board.controller : sy.BoardCtrl
     * QA 관리
     */
    angular.module("sy.Board.controller")
        .controller("sy.BoardCtrl", ["$window", "$scope", "$state", "$http", "$q", "$log", "sy.BoardSvc", "sy.MyInfoSvc", "APP_CONFIG", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "Util01maSvc", "APP_SA_MODEL", 
            function ($window, $scope, $state, $http, $q, $log, SyBoardSvc, SyMyInfoSvc, APP_CONFIG, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util01maSvc, APP_SA_MODEL) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            gridHeaderAttributes = {"class": "table-header-cell", style: "text-align: center; font-size: 12px"};

	            /*
	             * 글쓰기 버튼 클릭시 실행되는 함수
	             */
	            $scope.moveBoardWrite = function() {
	            	var defer = $q.defer();
    				
	            	SyMyInfoSvc.selectYnNkne().success(function(res) {
	            		if(res) {
	            			$state.go('app.syBoard', { kind: "", menu: null, write:true, ids: "new" });
    						defer.resolve();
	            		}
	            		else {
	            			$state.go('app.syMyInfo', { kind: "", menu: null });
        					defer.reject();
	            		}
	            	}).error(function() {
	            		$state.go('app.syMyInfo', { kind: "", menu: null });
    					defer.reject();
	            	});
        			return defer.promise;
				};

				/*
				 * 닉네임 변경 버튼 클릭시 실행되는 함수
				 */
	            $scope.moveMyInfo = function() {
	            	$state.go('app.syMyInfo', { kind: "", menu: null });
				};

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
             	    writer  : resData.writer    // 글쓴이
		        };
	      	  
	            boardDataVO.isOpen = function (val) {
	            	var searchIdHeight = $("#searchId").height();
	            	var settingHeight = $(window).height() - searchIdHeight - 90;
	            	var pageSizeValue = val? 20 : 24;
	            	$scope.kg.wrapper.height(settingHeight);
            		$scope.kg.resize();
            		gridBoardVO.dataSource.pageSize(pageSizeValue);
	            };
	            
	            /*
	             * 초기화 버튼 클릭시 실행되는 함수
	             */
	            boardDataVO.reset = function() {
	            	var self = this;
	            	self.datesetting.period.start = angular.copy(edt.getToday());
	            	self.datesetting.period.end   = angular.copy(edt.getToday());
	            	self.datesetting.selected = '1Week';
	            };
	            
	            /*
	             * 처음 화면 로딩시 실행되는 함수
	             */
	            boardDataVO.init = function() {
	            	boardDataVO.search();
	            };
	            
	            //toolTip
	            UtilSvc.gridtooltipOptions.filter = "td";
	            boardDataVO.tooltipOptions = UtilSvc.gridtooltipOptions;
	            	
	            //초기 실행
	            boardDataVO.search = function(){
	            	gridBoardVO.dataSource.read().then(function(res) {
	            		boardDataVO.isOpen(false);
	            	});
	            };	
	            
	            var gridBoardVO = $scope.gridBoardVO = {
                    messages: {
                        noRows: "게시판정보가 존재하지 않습니다.",
                        loading: "게시판정보를 가져오는 중...",
                        requestFailed: "게시판정보를 가져오는 중 오류가 발생하였습니다.",
                        commands: {
                        	update: "글쓰기",
                        	
                        }
                    },
                	boxTitle : "게시판",                 	
                    pageable: {
                    	messages: UtilSvc.gridPageableMessages
                    },
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				var self = boardDataVO;
            	            	var param = {
                						procedureParam: "USP_SY_18BOARD_SEARCH&L_DC_SBJ@s|L_NO_INSERT@s|L_START_DATE@s|L_END_DATE@s",
                						L_DC_SBJ      : self.subject,
                						L_NO_INSERT   : self.writer,
                						L_START_DATE  : new Date(self.datesetting.period.start.y, self.datesetting.period.start.m-1, self.datesetting.period.start.d).dateFormat("Ymd"),
                						L_END_DATE    : new Date(self.datesetting.period.end.y  , self.datesetting.period.end.m-1  , self.datesetting.period.end.d).dateFormat("Ymd")
                					};
            					UtilSvc.getList(param).then(function (res) {
            						e.success(res.data.results[0]);

            						// 조회한 조건을 localstorage에 저장함.
            						var inquiryParam = {
            							subject : self.subject,       
            							writer  : self.writer,
            							period  : UtilSvc.grid.getDateSetting(self.datesetting)
            	                    };
            						
            	        			// 검색조건 세션스토리지에 임시 저장
            	        			UtilSvc.grid.setInquiryParam(inquiryParam);
            					}, function(err){
            						e.error([]);
            					});
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
                					NM_NKNE   : { type: "string" },
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
        		           {field: "NM_NKNE", title: "글쓴이", width: 100,
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
                        	$state.go('app.syBoard', { kind: "", menu: null, write: null, ids: dataItem.NO_BOARD });
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
	            
	            boardDataVO.init();
            }]);
}());