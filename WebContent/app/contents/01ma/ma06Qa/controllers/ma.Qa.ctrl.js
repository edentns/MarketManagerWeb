(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Qa.controller : ma.QaCtrl
     * QA 관리
     */
    angular.module("ma.Qa.controller")
        .controller("ma.QaCtrl", ["$window", "$scope", "$http", "$q", "$log", "ma.QaSvc", "APP_CONFIG", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "Util01maSvc", "APP_SA_MODEL", 
            function ($window, $scope, $http, $q, $log, MaQaSvc, APP_CONFIG, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util01maSvc, APP_SA_MODEL) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            var qaDataVO = $scope.qaDataVO = {
	            	userInfo : JSON.parse($window.localStorage.getItem("USER")),
	            	boxTitle : "검색",
	            	setting : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 2
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
                    answerStatusModel : "*",                     	    //답변처리상태 모델
                    answerStatusBind : [],                     	    	//답변처리상태 옵션                    
                    allSelectTargetModel : [],							//전체 선택시 공지대상자들 아이디를 담아 놓는 모델 
                    qaNocModel : [],									//문의대상
                    qaNocOp : {											//조회시 필요한 문의대상 드랍다운
                    	tagTemplate: kendo.template($.trim($("#qa-select-template").html())),
                    	tagMode: "single",
                        placeholder: "가입자를 선택해 주세요.",
                        dataTextField: "NM",
                        dataValueField: "NO_C",
                        valuePrimitive: true /*,
                        minLength: 1000000,				//아래로 목록이 안 뜨게 하기 위함;
                        enforceMinLength: true	        //아래로 목록이 안 뜨게 하기 위함; */
                    },
                    customOptions : {
                    	dataSource: [],
                        dataTextField: "NM_DEF",
                        dataValueField: "CD_DEF",
                        optionLabel: "선택해 주세요.",
                        valuePrimitive: true
                    },
    				fileMngDataVO : {
	        			CD_AT:'009',
	        			limitCnt: 5
    				},	 
    				fileSlrDataVO : {
	        			CD_AT:'008',
	        			limitCnt: 5
    				},	 
    				fileDtLst : "",
    				dataTotal : 0,
             	    resetAtGrd : ""
		        };
	            
	            //답변 상태 바인딩
	            qaDataVO.asrStsBind = (function(){
	            	var self = this, param = {
    					lnomngcdhd: "SYCH00091",
    					lcdcls: "SY_000031"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        					if(res.data.length >= 1){
        						self.answerStatusBind = res.data;
        						self.customOptions.dataSource = angular.copy(res.data);
        						self.customOptions.dataSource.splice(0,1);
        					}
	        			},
					    function(err) {
	 				    	e.error([]);	 				       
	 				    });
	            });	            	
	            
	            //문의대상 바인딩
	            qaDataVO.qaTgtBind = (function(proparam, e, seq, view){
	            	var param = {
            			procedureParam: proparam
    				};
            		Util01maSvc.getListMset(param, seq).then(function (res) {
            			if(res.data.results[0]){
            				view.initTotalCount = res.data.results[0].length;
        					e.success(res.data.results[0]);
            			}else{
            				e.success('');
            			}
        			},
				    function(err) {
 				    	e.error([]);
 				    });
	            });
	            
	            qaDataVO.stopEvent = function(e){
	            	e.preventDefault();
	            	e.stopPropagation();
                };  
	            
	            //처음 로딩시 검색대상 초기화 
	            qaDataVO.initCdTarget = (function(){
	            	var multiSelect = angular.element(document.querySelector("#nkms")).data("kendoMultiSelect");                   
	                multiSelect.dataSource.data([]);
	                
	                var multiData = multiSelect.dataSource.data();
	                multiData.push({NM: "전체", NO_C: "*"});
	                multiSelect.dataSource.data(multiData);    
	            	multiSelect.value(["*"]);
	            	multiSelect.trigger("change"); //트리거를 안하면 모델에 안들어감!
	            });
	            
	            //toolTip
	            UtilSvc.gridtooltipOptions.filter = "td";
	            qaDataVO.tooltipOptions = UtilSvc.gridtooltipOptions;
	            
	            //text Editor
	            qaDataVO.kEditor = {
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
	            	            
	            //조회
	            qaDataVO.inQuiry = function(qa, noc){
	            	var me = this, dateSts = qaDataVO.datesetting.period.start, dateSte = qaDataVO.datesetting.period.end;
	            	me.param = {
                    	CONT: qaDataVO.contentText.value,
                    	CD_ANSSTAT : qaDataVO.answerStatusModel,
                    	NO_C_S : qaDataVO.qaNocModel.toString(),                    	
                    	DTS_FROM : (qa)? new Date(today.y, today.m, today.d-1, 23, 59, 58).dateFormat("YmdHis") : new Date(dateSts.y, dateSts.m-1, dateSts.d-1, 23, 59, 58).dateFormat("YmdHis"),
                    	DTS_TO : (qa)? new Date(today.y, today.m, today.d, 23, 59, 58).dateFormat("YmdHis") : new Date(dateSte.y, dateSte.m-1, dateSte.d, 23, 59, 59).dateFormat("YmdHis"),
                    	NO_QA : qa,
                    	NO_SALE_C : noc
                    }; 
	            	
	            	if(!me.answerStatusModel){ alert("답변처리상태를 입력해 주세요."); return false; };
	            	if(!me.qaNocModel){ alert("문의대상을 입력해 주세요."); return false; };	            	
	            	if(me.param.NOTI_TO > me.param.NOTI_FROM){ alert("공지일자를 올바르게 선택해 주세요."); return false; };
	            	
	            	$scope.qakg.dataSource.data([]);
	            	$scope.qakg.dataSource.page(1);
	            	//$scope.nkg.dataSource.read();
	            };	        
	            	            
	            //초기화버튼
	            qaDataVO.inIt = function(){
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
	            qaDataVO.isOpen = function(val){
	            	if(val) {
	            		$scope.qakg.wrapper.height(657);
	            		$scope.qakg.resize();
	            		gridQaVO.dataSource.pageSize(20);
	            	}else {
	            		$scope.qakg.wrapper.height(798);
	            		$scope.qakg.resize();
	            		gridQaVO.dataSource.pageSize(24);
	            	}
	            };	
	            
	            qaDataVO.paramFunc =  function(param){
					var inputParam = angular.copy(param.data[0].ARR_NO_C);
					
					if(inputParam.indexOf('*') > -1){
						inputParam = $scope.qaDataVO.allSelectTargetModel;    
						$scope.qaDataVO.allSelectTargetModel = [];
					}
					return inputParam;
				};
				
				//각 컬럼에 header 정보 넣어줌, 공통 모듈이 2줄 위주로 작성 되어 있기 떄문에  일부러 일케 했음 
				qaDataVO.columnProc = (function(){
            		var tpl = [ APP_SA_MODEL.ROW_NUM,
		                        APP_SA_MODEL.NO_C,                                   
		                        APP_SA_MODEL.NO_INSERT,
		                        APP_SA_MODEL.DC_INQTITLE,
		                        APP_SA_MODEL.DC_INQCTT,
		                        APP_SA_MODEL.DTS_INQREG,
		                        APP_SA_MODEL.NM_ANS,
		                        APP_SA_MODEL.DC_ANSCTT,
		                        APP_SA_MODEL.DTS_ANSREG,
		                        APP_SA_MODEL.CD_ANSSTAT],
            			extTpl = {headerAttributes : {"class": "table-header-cell", style: "text-align: center; font-size: 12px; vertical-align:middle;"}},
            			returnTpl = [];
            		
            			tpl[2].title = "문의자";
            			
        				for(var i=0; i<tpl.length; i++){
        					var temp = angular.extend(extTpl, tpl[i]);
        					returnTpl.push(angular.copy(temp));
            			};
            			return returnTpl;
            	}());				
					                            
	            //검색 그리드
                var gridQaVO = $scope.gridQaVO = {
                	autoBind: false,
                    messages: {                        	
                        requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
                        commands: {
                            update: "저장",
                            canceledit: "취소"
                        }
                        ,noRecords: "검색된 데이터가 없습니다."
                    },
                    boxTitle : "QA 리스트",
                    sortable: true,                    	
                    pageable: {
                       	messages: UtilSvc.gridPageableMessages
                    },
                    noRecords: true,
                    dataSource: new kendo.data.DataSource({
                    	transport: {
                    		read: function(e){
                				MaQaSvc.qaList(qaDataVO.param).then(function (res) {
                					if(res.data.queryList){
                						var data = res.data.queryList, i=0, sum=0;		
                            			
                        				for(i; i<data.length; i+=1){
                    						sum += 1;
                    						data[i].ROW_NUM = sum;
                    					};
                						
                						e.success(res.data.queryList);
                						qaDataVO.fileDtLst = res.data.queryFileList;
                					}else{
                    					e.error([]);                						
                					}
            					},
            				    function(err) {
            				    	e.error([]);
            				    });
                    		},
                			update: function(e) {
                				var defer = $q.defer();
                				var param = e.data.models[0];
                				param.NO_SALE_C = param.NO_C;
                				MaQaSvc.qaUpdate(param).then(function (res) {    
                					if(res.data){
	                					if(qaDataVO.fileMngDataVO.dirty) {
                							qaDataVO.fileMngDataVO.CD_REF1 = param.NO_C;
                							qaDataVO.fileMngDataVO.CD_REF2 = param.NO_QA;
                							qaDataVO.fileMngDataVO.doUpload(function(){
                			        			alert("저장 되었습니다.");
                			        		}, function() {
                			        			alert('첨부파일업로드 실패하였습니다.');
                			        		});
                		        		}	    
	                					qaDataVO.inQuiry();
	                				}else{
	                					alert("저장 실패하였습니다.!! 연구소에 문의 부탁드립니다.");
	                				}   	                			
            					},
            				    function(err) {
            				    	e.error([]);            				      
            				    });
	                			return defer.promise;			
                    		},	                		
                			parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
                		},
                		change: function(e){
                			var data = this.data();
                			qaDataVO.dataTotal = data.length;
                		},
                		pageSize: 20,
                		batch: true,
                		schema: {
                			model: { 
                    			id: "NO_QA",
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
							        NO_QA:		       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        CD_BCL:		       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        CD_MCL:		       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        CD_SCL:		       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        DC_INQTITLE:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },      
							        DC_HTMLINQCTT:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },       
							        DC_INQCTT:	   	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   }, 
							        NO_INQPHNE:	       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        DC_INQEMI:	       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        NO_INQCEPH:	   	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        NM_ANS:	   	       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        DC_ANSCTT:	   	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        DTS_ANSREG:	   	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        DTS_ANSCFM:	   	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        NM_C:	   	       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        DTS_INQREG:	       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   }, 
							        NO_INSERT:	       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   }, 
							        NM_FILE:	       {
													    	type: "string", 
															editable: true,  
															nullable: false
							        				   },
							        M_NM_FILE:	       {
													    	type: "string", 
															editable: true,  
															nullable: false
							        				   }, 
							        DC_HTMLANSCTT:	   {
													    	type: "string", 
															editable: true,  
															nullable: false,
															validation: {
																dc_htmlanscttvalidation: function (input) {																		
																	if (input.is("[name='DC_HTMLANSCTT']") && !input.val()) {
																		input.attr("data-dc_htmlanscttvalidation-msg", "답변내용을 입력해 주세요.");
																	    return false;
																	};
																	if (input.is("[name='DC_HTMLANSCTT']") && input.val()) {
																		var inputInEditor = UtilSvc.removeHtmlTag(input.data("kendoEditor").value().trim()).length;
																		if(inputInEditor > 2000 || inputInEditor < 10){
																			input.attr("data-dc_htmlanscttvalidation-msg", "답변내용을 10자 이상 2000자 이내로 입력해 주세요.");
																		    return false;
																		};
																	};
																	return true;
																}
															}
							        				   }, 
							        CD_ANSSTAT:	       {
													    	type: "string", 
															editable: true,  
															nullable: false,
															validation: {
																cd_ansstatvalidation: function (input) {																		
																	if (input.is("[name='CD_ANSSTAT']") && !input.val()) {
																		input.attr("data-cd_ansstatvalidation-msg", "답변상태를 입력해 주세요.");
																	    return false;
																	};
																	return true;
																}
															}
							        				   }  
	                			}
	                		}
	                	}
                	}),                    	
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	selectable: "single, row",
                	columns: qaDataVO.columnProc,                			      
                	dataBound: function(e) {
                		
                    },
                    collapse: function(e) {
                        this.cancelRow();
                    },         	
                	editable: {
                		mode: "popup",
                		window : {
                	        title: "문의내용"
                	    },
                		template: kendo.template($.trim($("#qa-popup-template").html())),
                		confirmation: false,
                	    destroy: true
                	},	
                	edit: function (e) {
                		var fileLst, fileUrl, fileSlrDataVO, fileMngDataVO, btnSave, shwTitle, htmlcode = "";
                		
                		fileLst = (function(gubun, noC, noQa, cdAt){
                							var returnDta = qaDataVO.fileDtLst.filter(function(ele){
                								if(gubun === 'slr') {
                									return ((ele.NO_C === noC) && (ele.CD_REF1 === noQa) && (ele.CD_AT === cdAt));
                								}
                								if(gubun === 'mng') {
                									return ((ele.NO_C === '00000') && (ele.CD_REF1 === noC) && (ele.CD_REF2 === noQa) && (ele.CD_AT === cdAt));
                								}
				                			});
                							return returnDta;
				            			});
                		
				        fileUrl = APP_CONFIG.domain +"/ut05FileUpload";
				        
				        fileSlrDataVO = qaDataVO.fileSlrDataVO;
	        			fileMngDataVO = qaDataVO.fileMngDataVO;
                			
            			fileSlrDataVO.currentDataList = fileLst('slr', e.model.NO_C, e.model.NO_QA, fileSlrDataVO.CD_AT);
            			fileMngDataVO.currentDataList = fileLst('mng', e.model.NO_C, e.model.NO_QA, fileMngDataVO.CD_AT);
                			
            			angular.forEach(fileSlrDataVO.currentDataList, function (data, index) {
		                    htmlcode += "<span>"+(index+1)+".</span> <a href='"+fileUrl+"?NO_AT="+data.NO_AT+"&CD_AT="+data.CD_AT+"&U_NO_C="+data.NO_C+"' download="+data.NM_FILE+"> "+data.NM_FILE+" </a></br>";
		                });
            			
            			angular.element(document.querySelector("#qa-slr-file-list")).append((!htmlcode) ? "<p>없음</p>" : htmlcode);
                        angular.element(document.querySelector("#html-inq-ctt")).append(e.model.DC_HTMLINQCTT);
                                   
                        if(e.model.CD_ANSSTAT === "003"){
                        	$($("#k-qa-medtr").data().kendoEditor.body).attr("contenteditable", false);
                        	angular.element(document.querySelector("#k-qa-medtr")).addClass("k-state-disabled");
                        	angular.element(document.querySelector(".k-grid-update")).hide();
                        	angular.element(document.querySelector(".k-window-title")).text("문의내용");
                        }else{
                        	if(!e.model.DC_HTMLANSCTT){
                            	btnSave = "저장";
                            	shwTitle = "문의사항 등록";    
                            }else{
                            	btnSave = "수정";
                            	shwTitle = "문의사항 수정";   
                            	qaDataVO.kEditor.NO_QA = e.model.NO_QA;
                            }
                        	angular.element(document.querySelector(".k-grid-update")).text(btnSave);
                        	angular.element(document.querySelector(".k-window-title")).text(shwTitle);
                        }
                                                 	
                    	$timeout(function () {
                        	if(!page.isWriteable()) {
                        		$(".k-grid-update").addClass("k-state-disabled");
                        		$(".k-grid-update").click(qaDataVO.stopEvent);
                        	}
                        });
                	},
                	cancel: function(e) { //pop up 창 닫힐때 작동됨  
                		qaDataVO.fileSlrDataVO.currentDataList = [];
	        			qaDataVO.fileMngDataVO.currentDataList = [];
        		        
        		        $scope.$apply(function(){
        		        	qaDataVO.kEditor.NO_QA = "";
        		        });
                	},
                	resizable: true,
                	rowTemplate: kendo.template($.trim(angular.element(document.querySelector("#qa-template")).html())),
                	altRowTemplate: kendo.template($.trim(angular.element(document.querySelector("#qa-template")).html()).replace("class=\"k-grid-row\"","class=\"k-alt\"")),
                	height: 657                    	
        		}; 
                
                //그리드 셀 더블 클릭
                angular.element(document.querySelector("#divQaGrd")).delegate("tbody>tr", "dblclick", function(e){
	            	var grd = $scope.qakg;      
	         		
            		grd.editRow($(e.target).closest('tr'));
	            });
                
                //가입자 검색 UI
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
                       
                       if(qaDataVO.qaNocModel.indexOf("*") > -1){
                    	   $scope.treeView.element.find(".k-checkbox").removeAttr("checked").trigger("change");
                           for (var i = 0; i < $scope.memSearchGrd.dataSource.data().length; i++) {
                        	   var item = $scope.treeView.findByText($scope.memSearchGrd.dataSource.data()[i]["NM"]);
                               item.find(".k-checkbox").first().click();
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
        		    			qaDataVO.qaTgtBind("MarketManager.USP_MA_05MEMBERSEARCH01_GET", e, "noticeGet", $scope.memSearchGrd); 
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
       				   $(".k-grid-add").click(qaDataVO.stopEvent);
       				   $(".k-grid-delete").click(qaDataVO.stopEvent);
       			   };

            	   qaDataVO.initCdTarget();   
            	   qaDataVO.asrStsBind();
               });
               
            }]);
}());