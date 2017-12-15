(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Qa.controller : ma.QaCtrl
     * QA 관리
     */
    angular.module("ma.Itl.controller")
        .controller("ma.ItlCtrl", ["$window", "$scope", "$http", "$q", "$log", "ma.QaSvc", "APP_CONFIG", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "Util01maSvc", "APP_SA_MODEL", 
            function ($window, $scope, $http, $q, $log, MaQaSvc, APP_CONFIG, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util01maSvc, APP_SA_MODEL) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            var itlDataVO = $scope.itlDataVO = {
	            	userInfo : JSON.parse($window.localStorage.getItem("USER")),
	            	boxTitle : "검색",
	            	settingMrk : {
	        			id: "NO_MNGMRK",
	        			name: "NM_MRK",
	        			maxNames: 2,
	        		},
	            	setting : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 3
	        		},
	            	datesetting : {
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month'],
						selected   : '1Week',
						period : {
							start : angular.copy(today),
							end   : angular.copy(today)
						}
	        		},
                    contentText: { value: "" , focus: false},			//제목,내용
                    mngMrkModel : "*",                                  //마켓명 모델
                    mngMrkBind  : [],                                   //마켓명 옵션
                    nmJobModel  : "*",                                  //작업명 모델
                    nmJobBind   : [],                                   //작업명 옵션                    
                    stJobModel  : "*",                     	            //작업상태 모델
                    stJobBind   : [],                     	    	    //작업상태 옵션
    				dataTotal   : 0,
             	    resetAtGrd  : ""
		        };
	            
	            itlDataVO.stopEvent = function(e){
	            	e.preventDefault();
	            	e.stopPropagation();
                };
	            
	            //toolTip
	            UtilSvc.gridtooltipOptions.filter = "td";
	            itlDataVO.tooltipOptions = UtilSvc.gridtooltipOptions;
	            
	            //text Editor
	            itlDataVO.kEditor = {
	            	NO_QA:"",
         	    	tools: [
         	    	   "bold",
                       "italic",
                       "underline",
                       "strikethrough",
                       "justifyLeft",
                       "justifyCenter",
                       "justifyRight",
                       "justifyFull",
                       "insertUnorderedList",
                       "insertOrderedList",
                       "indent",
                       "outdent"
                    ]
         	    };
	            	            
	            //초기 실행
	            itlDataVO.inQuiry = function(){
	            	itlDataVO.mngMrkBind = resData.mngMrkData;
	            	itlDataVO.nmJobBind = resData.nmJobData;
	            	itlDataVO.stJobBind = resData.stJobData;
	            	
	            	/*var me = this, dateSts = itlDataVO.datesetting.period.start, dateSte = itlDataVO.datesetting.period.end;
	            	me.param = {
                    	CONT: itlDataVO.contentText.value,
                    	CD_ANSSTAT : itlDataVO.answerStatusModel,
                    	NO_C_S : itlDataVO.qaNocModel.toString(),                    	
                    	DTS_FROM : (qa)? new Date(today.y, today.m, today.d-1, 23, 59, 58).dateFormat("YmdHis") : new Date(dateSts.y, dateSts.m-1, dateSts.d-1, 23, 59, 58).dateFormat("YmdHis"),
                    	DTS_TO : (qa)? new Date(today.y, today.m, today.d, 23, 59, 58).dateFormat("YmdHis") : new Date(dateSte.y, dateSte.m-1, dateSte.d, 23, 59, 59).dateFormat("YmdHis"),
                    	NO_QA : qa
                    }; 
	            	
	            	if(!me.answerStatusModel){ alert("답변처리상태를 입력해 주세요."); return false; };
	            	if(!me.qaNocModel){ alert("문의대상을 입력해 주세요."); return false; };	            	
	            	if(me.param.NOTI_TO > me.param.NOTI_FROM){ alert("공지일자를 올바르게 선택해 주세요."); return false; };
	            	
	            	$scope.qakg.dataSource.data([]);
	            	$scope.qakg.dataSource.page(1);
	            	$scope.nkg.dataSource.read();*/
	            	
	            	
	            };	 
	            
	          //초기 실행
	            itlDataVO.search = function(){
	            	$scope.itlkg.dataSource.data([]);
	            	$scope.itlkg.dataSource.page(1);
	            	$scope.itlkg.dataSource.read();
	            };	
	            	            
	            //초기화버튼
	            itlDataVO.init = function(){
	            	var me  = this;
                	
                	me.contentText.value = "";
                	
                	me.answerStatusModel = ["*"];
                	me.allSelectTargetModel = [];

            		me.fileSlrDataVO.currentDataList = [];
        			me.fileMngDataVO.currentDataList = [];
                	
                	me.answerStatusBind.bReset = true;
                	
                	$timeout(function(){
                		angular.element(".frm-group").find("button:eq(0)").triggerHandler("click");
                		angular.element(".frm-group").find("button:eq(2)").triggerHandler("click");
                	},0);                	
                	        			                	
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.qakg;
                	me.resetAtGrd.dataSource.data([]);
                	
                	$scope.memSearchGrd.selectAll = false;
                	$scope.memSearchGrd.selectAllItems();              	
                	$scope.memSearchGrd.searchValue = ""; 	//공지대상 검색 팝업창 초기화                	                	 
                	
                	me.initCdTarget();
	            };
	            
	            //open
	            itlDataVO.isOpen = function(val){
	            	if(val) {
	            		$scope.qakg.wrapper.height(657);
	            		$scope.qakg.resize();
	            		gridItlVO.dataSource.pageSize(20);
	            	}else {
	            		$scope.qakg.wrapper.height(798);
	            		$scope.qakg.resize();
	            		gridItlVO.dataSource.pageSize(24);
	            	}
	            };	
	            
	            itlDataVO.paramFunc =  function(param){
					var inputParam = angular.copy(param.data[0].ARR_NO_C);
					
					if(inputParam.indexOf('*') > -1){
						inputParam = $scope.itlDataVO.allSelectTargetModel;    
						$scope.itlDataVO.allSelectTargetModel = [];
					}
					return inputParam;
				};
				
				//각 컬럼에 header 정보 넣어줌, 공통 모듈이 2줄 위주로 작성 되어 있기 떄문에  일부러 일케 했음 
				itlDataVO.columnProc = (function(){
            		var tpl = [ APP_SA_MODEL.ROW_NUM,
            		            { field: "NO_C"       	, type: "string" , width: "60px", textAlign: "center", title: "문의 가입자번호"},            		            
		                        { field: "NO_MRK"       , type: "string" , width: "90px", textAlign: "center", title: "마켓명"},   
		                        { field: "NO_MNGMRK"    , type: "string" , width: "90px", textAlign: "center", title: "관리마켓명"},
		                        { field: "DC_MRKID"     , type: "string" , width: "50px", textAlign: "center", title: "마켓ID"},
		                        { field: "JOB"          , type: "string" , width: "80px", textAlign: "center", title: "작업명"},
		                        { field: "STATUS"       , type: "string" , width: "70px", textAlign: "center", title: "작업상태"},
		                        { field: "RESULT"       , type: "string" , width: "150px",textAlign: "center", title: "결과메시지"},
		                        { field: "RESERVED_DATE", type: "string" , width: "90px", textAlign: "center", title: "예약시간"},
		                        { field: "START_DATE"   , type: "string" , width: "90px", textAlign: "center", title: "시작일시"},
		                        { field: "END_DATE"     , type: "string" , width: "90px", textAlign: "center", title: "종료일시"},
		                        { field: "UPDATED"      , type: "string" , width: "90px", textAlign: "center", title: "수정일시"},
		                       ],
            			extTpl = {headerAttributes : {"class": "table-header-cell", style: "text-align: center; font-size: 12px; vertical-align:middle;"}},
            			returnTpl = [];
            			
        				for(var i=0; i<tpl.length; i++){
        					var temp = angular.extend(extTpl, tpl[i]);
        					returnTpl.push(angular.copy(temp));
            			};
            			return returnTpl;
            	}());				
					                            
	            //검색 그리드
                var gridItlVO = $scope.gridItlVO = {
                	autoBind: false,
                    messages: {                        	
                        requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
                        commands: {
                            update: "저장",
                            canceledit: "취소"
                        }
                        ,noRecords: "검색된 데이터가 없습니다."
                    },
                    boxTitle : "Itl 리스트",
                    sortable: true,                    	
                    pageable: {
                       	messages: UtilSvc.gridPageableMessages
                    },
                    pageSize: 8,
                    noRecords: true,
                    dataSource: new kendo.data.DataSource({
                    	transport: {
                    		read: function(e) {
                				var param = {
                						procedureParam: "USP_MA_07ITL_SEARCH&L_LIST01@s|L_LIST02@s|L_LIST03@s|L_START_DATE@s|L_END_DATE@s",
                						L_LIST01      : itlDataVO.mngMrkModel,
                						L_LIST02      : itlDataVO.nmJobModel,
                						L_LIST03      : itlDataVO.stJobModel,
                						L_START_DATE  : new Date(itlDataVO.datesetting.period.start.y, itlDataVO.datesetting.period.start.m-1, itlDataVO.datesetting.period.start.d).dateFormat("Ymd"),
                						L_END_DATE    : new Date(itlDataVO.datesetting.period.end.y  , itlDataVO.datesetting.period.end.m-1  , itlDataVO.datesetting.period.end.d).dateFormat("Ymd")
                					};
            					UtilSvc.getList(param).then(function (res) {
            						e.success(res.data.results[0]);

            	    				setTimeout(function () {
            	                       	if(!page.isWriteable()) {
            	               				$(".k-grid-delete").addClass("k-state-disabled");
            	               				$(".k-grid-delete").click(stopEvent);
            	               				$(".k-grid-연동체크").addClass("k-state-disabled");
            	               				$(".k-grid-연동체크").click(stopEvent);
            	               			}
            	                    });
            					});
                			},  		
                			parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
                		},
                		change: function(e){
                			var data = this.data();
                			itlDataVO.dataTotal = data.length;
                		},
                		batch: true,
                		schema: {
                			model: { 
                    			id: "ROW_NUM",
                				fields: {
                					ROW_NUM: 		   {	
				                    						type: "number", 
															editable: false,  
															nullable: false
            										   },
								    NO_C:		       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        NO_MRK:		       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        NO_MNGMRK:		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        DC_MRKID:		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        CD_ITLWAY:		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        JOB:	   		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },      
							        STATUS:	   		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },       
							        RESULT:	   	       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   }, 
							        RESERVED_DATE:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        START_DATE:	       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        END_DATE:	   	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        UPDATED:	   	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   }
							        				   
	                			}
	                		}
	                	}
                	}),                    	
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	selectable: "single, row",
                	columns: itlDataVO.columnProc,                			      
                	dataBound: function(e) {
                		
                    },
                    collapse: function(e) {
                        this.cancelRow();
                    },
                	resizable: true,
                	rowTemplate: kendo.template($.trim(angular.element(document.querySelector("#qa-template")).html())),
                	altRowTemplate: kendo.template($.trim(angular.element(document.querySelector("#qa-template")).html()).replace("class=\"k-grid-row\"","class=\"k-alt\"")),
                	height: 294                 	
        		};
                
                /*//가입자 검색 UI
                //조회용
                $scope.memSearchGrd = {
                	id: "memSearchGrd",
                	initTotalCount : 0, 			// 초기 로드시 데이터의 총 갯수
        			repeaterItems : [],
        			searchTotal : 0,
        			selectAll : false,
        			selectedCount : 0,
        			searchValue : "",
        			modal: true,
        			visible: false,
        			height: "500",
        			width: "400",
        			title: "가입자 검색",
        			show: function(e){        		           
                       angular.element(document.querySelector("#memberSearchMain")).focus();    
                       
                       if(itlDataVO.qaNocModel.indexOf("*") > -1){
                    	   $scope.treeView.element.find(".k-checkbox").removeAttr("checked").trigger("change");
                           for (var i = 0; i < $scope.memSearchGrd.dataSource.data().length; i++) {
                        	   var item = $scope.treeView.findByText($scope.memSearchGrd.dataSource.data()[i]["NM"]);
                               item.find(".k-checkbox").first().click();2
                           }   
                       }                       
        			},
        			searchKeyUp: function(keyEvent){
        				filter($scope.treeView.dataSource, keyEvent.target.value.toLowerCase(), $scope.memSearchGrd.searchTotal);
        				$scope.memSearchGrd.selectedCount = 0;
        				$scope.treeView.element.find(".k-checkbox").prop("checked", false);
                        $scope.treeView.element.find(".k-checkbox").trigger("change");
        			},
        			actions : [
    		                    { 
    		                    	text: '취소' 
    		                    },
    		                    {
    		                        text: '확인', 
    		                        action: function () {
    		                            $scope.$apply(function (e) {
    		                            	var view = $scope.memSearchGrd;
    		                                view.repeaterItems = getCheckedItems($scope.treeView, view);
    		                                
    		                                //전체 조회 시의 체크시 "전체"로 표시함
    		                                if(view.selectAll && view.repeaterItems.length === view.initTotalCount){        		                                	
    		                                	var multiSelect = angular.element(document.querySelector("#nkms")).data("kendoMultiSelect");                   
        		                                multiSelect.dataSource.data([]);
        		                                
        		                                var multiData = multiSelect.dataSource.data();
        		                                multiData.push({NM: "전체", NO_C: "*"});
        		                                multiSelect.dataSource.data(multiData);    
    		                                	multiSelect.value(["*"]);
    		                                	multiSelect.trigger("change"); //트리거를 안하면 모델에 안들어감!
    		                                }else{
    		                                	populateMultiSelect(view.repeaterItems, "#nkms");
    		                                }       		                                
    		                            });
    		                        }
    		                    }
        		    ],
        		    dataSource : new kendo.data.HierarchicalDataSource ({ 
        		    	transport : {
        		    		read : function(e){
        		    			itlDataVO.qaTgtBind("MarketManager.USP_MA_05MEMBERSEARCH01_GET", e, "noticeGet", $scope.memSearchGrd); 
        		    		}
        		    	},
        		    	schema: {
                			model: {
                    			id: "NM",
                				fields: {
                					NM : {
                						type: "string", 
										editable: false,  
										nullable: false
                					},
                					NO_C : {
                						type: "string", 
										editable: false,  
										nullable: false
                					}
                				}
                			}
        		    	}
        		    }),
	    			autoBind: true,
                    dataTextField: "NM", 
                    checkboxes: true,
                    loadOnDemand: false,
                    expandAll: true, 
                    dataBound: function (e) {
                        e.sender.expand(e.node);    
                    },
                    check: function (e) {
                        $timeout(function () {
                        	$scope.$apply(function(){
                        		var view = $scope.memSearchGrd,
                        		    liList = $scope.treeView.element.find("li").length;
                        		
                        		view.selectedCount = getCheckedItems(e.sender, view).length;
                                if(view.selectedCount === liList && view.selectAll === false){
                                	view.selectAll = true;
                                }else if(view.selectedCount !== liList && view.selectAll === true){
                                	view.selectAll = false;
                                };
                        	});
                    	}, 0);
                    },
                    selectAllItems : function () {
                    	$scope.treeView.element.find(".k-checkbox").prop("checked", $scope.memSearchGrd.selectAll);
                        $scope.treeView.element.find(".k-checkbox").trigger("change");
                    }
                };                            
                      */               
                //done
                function getCheckedItems(treeview, obj) {
                    var nodes = treeview.dataSource.data();
                    return getCheckedNodes(nodes, obj);
                };                
                //done
                function getCheckedNodes(nodes, obj) {
                    var node, childCheckedNodes;
                    var checkedNodes = [];
                    
                    obj.searchTotal = nodes.length;
                    
                    for (var i = 0; i < obj.searchTotal; i++) {
                        node = nodes[i];
                        if (node.checked) {
                            checkedNodes.push(node);
                        }                        
                        if (node.hasChildren) {
                            childCheckedNodes = getCheckedNodes(node.children.data());
                            if (childCheckedNodes.length > 0) {
                                checkedNodes = checkedNodes.concat(childCheckedNodes);
                            };
                        };
                    }
                    return checkedNodes;
                };                
                //done
                function filter(dataSource, query, viewGrdCnt) {
                    var hasVisibleChildren = false;
                    var data = dataSource instanceof kendo.data.HierarchicalDataSource && dataSource.data();
                    
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        var text = item.NM.toLowerCase(); //유기적으로 변하는 값
                        var itemVisible =
                            query === true // parent already matches
                            || query === "" // query is empty
                            || text.indexOf(query) >= 0; // item text matches query

                        var anyVisibleChildren = filter(item.children, itemVisible || query, viewGrdCnt); // pass true if parent matches

                        hasVisibleChildren = hasVisibleChildren || anyVisibleChildren || itemVisible;

                        item.hidden = !itemVisible && !anyVisibleChildren;
                    }
                    if (data) {
                        // re-apply filter on children
                        dataSource.filter({ field: "hidden", operator: "neq", value: true });
                    }                              
                    return hasVisibleChildren;
               };               
               //done
               function populateMultiSelect(checkedNodes, id) {
                   var multiSelect = angular.element(document.querySelector(id)).data("kendoMultiSelect");                   
                   multiSelect.dataSource.data([]);
                   
                   var multiData = multiSelect.dataSource.data();                   
                  
                   if(checkedNodes.length > 0) {
                       var array = multiSelect.value().slice();
                       for (var i = 0; i < checkedNodes.length; i++) {
                    	   var strNM = checkedNodes[i].NM.split("-");
                           multiData.push({ NM: strNM[0], NO_C: checkedNodes[i].NO_C});
                           array.push(checkedNodes[i].NO_C.toString());
                       }
                       multiSelect.dataSource.data(multiData);
                       multiSelect.dataSource.filter({});
                       multiSelect.value(array);
                       multiSelect.trigger("change");
                   };
               };           	   
                                             
               $timeout(function () {
            	   if(!page.isWriteable()) {            		   
            		   $(".k-grid-add").addClass("k-state-disabled");
            		   $(".k-grid-delete").addClass("k-state-disabled");
       				   $(".k-grid-add").click(itlDataVO.stopEvent);
       				   $(".k-grid-delete").click(itlDataVO.stopEvent);
       			   };

            	   itlDataVO.inQuiry();
               });
               
            }]);
}());