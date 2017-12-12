(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Notice.controller : ma.NoticeCtrl
     * 코드관리
     */
    angular.module("ma.Notice.controller")
        .controller("ma.NoticeCtrl", ["$window", "$scope", "$http", "$q", "$log", "ma.NoticeSvc", "APP_CONFIG", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "Util01maSvc",
            function ($window, $scope, $http, $q, $log, MaNoticeSvc, APP_CONFIG, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util01maSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            $scope.userInfo = JSON.parse($window.localStorage.getItem("USER"));
	            		      
	            //공지사항 구분 드랍 박스 실행	
	            var connSetting = (function(){
    				var param = {
    					procedureParam: "MarketManager.USP_SY_10CODE02_GET&lnomngcdhd@s|lcdcls@s",
    					lnomngcdhd: "SYCH00014",
    					lcdcls: "SY_000014"
    				};
        			UtilSvc.getList(param).then(function (res) {
        				if(res.data.results[0].length >= 1){
        					noticeDataVO.noticeCdVO = res.data.results[0];
        					noticeDataVO.popUpNoticeCdVO.dataSource = res.data.results[0];
        				}
        			});
	            }());
	            
	            //공지 대상
	            var connSetting2 = (function(proparam, e, seq, view){
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
        			});
	            });
	            
	            var initCdTarget = (function(){
	            	var multiSelect = angular.element(document.querySelector("#nkms")).data("kendoMultiSelect");                   
	                multiSelect.dataSource.data([]);
	                
	                var multiData = multiSelect.dataSource.data();
	                multiData.push({NM: "전체", NO_C: "*"});
	                multiSelect.dataSource.data(multiData);    
	            	multiSelect.value(["*"]);
	            	multiSelect.trigger("change"); //트리거를 안하면 모델에 안들어감!
	            });
	            	            
	            //팝업 파일 리스트
	            var fileList = (function(no){
	            	var param = {
    					procedureParam: "MarketManager.USP_MA_05NOTICE_FILELIST_GET&no@s",
    					no: no
    				};
            		UtilSvc.getList(param).then(function (res) {
        				if(res.data.results[0].length >= 1){
        					$scope.noticeDataVO.fileDataVO.currentDataList = res.data.results[0];
        				}
        			});
	            });	            

	            var stopEvent = function(e){
	            	e.preventDefault();
	            	e.stopPropagation();
                };               
	            
	            var noticeDataVO = $scope.noticeDataVO = {
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
	        		writeText: { value: "" , focus: false},				//작성자
                    contentText: { value: "" , focus: false},			//제목/내용
                    noticeCdModel : "*",								//공지구분	                    
                    noticeTargetModel : ["*"],			   				//공지대상                    
                    allSelectTargetModel : [],							//전체 선택시 공지대상자들 아이디를 담아 놓는 모델 
                    noticeCdVO : [],		 							//조회시 필요한 공지구분 드랍다운
                    noticeTargetVO : {									//조회시 필요한 공지대상 드랍다운
                    	tagTemplate: kendo.template($.trim($("#ma-notice-select-template").html())),
                    	tagMode: "single",
                        placeholder: "가입자를 선택해 주세요.",
                        dataTextField: "NM",
                        dataValueField: "NO_C",
                        valuePrimitive: true /*,
                        minLength: 1000000,				//아래로 목록이 안 뜨게 하기 위함;
                        enforceMinLength: true	        //아래로 목록이 안 뜨게 하기 위함; */
                    },
                    popUpNoticeTargetVO : {
                    	tagTemplate: kendo.template($.trim($("#ma-notice-select-template").html())),
                        placeholder: "가입자를 선택해 주세요.",
                    	tagMode: "single",
                        dataTextField: "NM",
                        dataValueField: "NO_C",
                        valuePrimitive: true      
                    },
                    popUpNoticeCdVO : {
    					dataSource: [],
    					dataTextField: "NM_DEF",
                        dataValueField: "CD_DEF",
                      /*  optionLabel: {"NM_DEF": "공지구분을 선택해 주세요.", "CD_DEF": ""},*/
                    	valuePrimitive: true
    				},
    				fileDataVO : {
	        			CD_AT:'007',
	        			limitCnt: 5
    				},	 
    				dataTotal : 0,
             	    resetAtGrd : "",
             	    deleteOrdUpdate : ""
		        };

	            UtilSvc.gridtooltipOptions.filter = "td";
	            noticeDataVO.tooltipOptions = UtilSvc.gridtooltipOptions;
	            
	            noticeDataVO.kEditor = {
	            	noNotice : "",
                    path: "",
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
                       "outdent"/*,
        	    	   "insertImage"*/
                    ],
                    imageBrowser: {
                    	messages: {
                    		dropFilesHere: "드래그 한 파일을 여기에 놓아 주세요.",
                            empty: "비었음",
                            uploadFile: "그림 파일 업로드"
                        },
                        change: function(е) {
                            var selectedImage = e.sender._selectedItem();
                            console.log('selectedImage', selectedImage);
                        },
                        transport: {
                        	  read: function(e){
                        		  var param = {
                        			  procedureParam: "MarketManager.USP_MA_05NOTICE_FILELIST_GET&no@s",
              	    				  no: noticeDataVO.kEditor.noNotice
              	    			  };
          	            		  UtilSvc.getList(param).then(function (res) {
          	            			  if(res.data.results[0].length >= 1){
          	            				  e.success(res.data.results[0]);		  
          	            			  }else{
          	            				  e.success([]);          	            				  
          	            			  }
          	            		  });
              		          },
                              destroy: {
                            	  url: APP_CONFIG.domain + "/ut05FileUpload",
                                  type: "DELETE"
                              },
                              uploadUrl : APP_CONFIG.domain + "/ut05FileUpload",
                              thumbnailUrl: function(path, file){
                            	  console.log(path, file);
                              },
                              imageUrl: function(e){
                            	  /*console.log(e);
                            	  return e;*/
                              }
                        }
                    }
         	    };
	            	            
	            //조회
	            noticeDataVO.inQuiry = function(){
	            	var me = this;
	            	me.param = {
                    	procedureParam: "MarketManager.USP_MA_05NOTICE_SEARCH01_GET&NO_WR@s|ARR_CD_NO@s|ARR_NO_C@s|SB_NM@s|NOTI_TO@s|NOTI_FROM@s",    
                    	NO_WR: noticeDataVO.writeText.value,
                    	ARR_CD_NO: noticeDataVO.noticeCdModel,                                    	
                    	ARR_NO_C: noticeDataVO.noticeTargetModel.toString().replace(/,/g,'^'),
                    	SB_NM: noticeDataVO.contentText.value,
                    	NOTI_TO: new Date(noticeDataVO.datesetting.period.start.y, noticeDataVO.datesetting.period.start.m-1, noticeDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),
                    	NOTI_FROM: new Date(noticeDataVO.datesetting.period.end.y, noticeDataVO.datesetting.period.end.m-1, noticeDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
                    }; 
	            		          
	            	if(!me.noticeTargetModel){ alert("공지대상을 입력해 주세요."); return; };
	            	if(!me.noticeCdModel){ alert("공지구분을 입력해 주세요."); return; };
	            	if(me.param.NOTI_TO > me.param.NOTI_FROM){ alert("공지일자를 올바르게 선택해 주세요."); return; };
	            	
	            	$scope.nkg.dataSource.data([]);
	            	$scope.nkg.dataSource.page(1);
	            	//$scope.nkg.dataSource.read();
	            };	        
	            
	            //초기화버튼
	            noticeDataVO.inIt = function(){
	            	var me  = this;
                	
	            	me.writeText.value = "";
                	me.contentText.value = "";
                	
                	me.noticeTargetModel = ["*"];
                	me.allSelectTargetModel = [];
                	me.fileDataVO.currentDataList = [];
                	
                	me.noticeCdVO.bReset = true;
                	
                	$timeout(function(){
                		angular.element(".frm-group").find("button:eq(0)").triggerHandler("click");
                		angular.element(".frm-group").find("button:eq(2)").triggerHandler("click");
                	},0);                	
                	        			                	
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.nkg;
                	me.resetAtGrd.dataSource.data([]);
                	
                	$scope.memSearchGrd.selectAll = false;
                	$scope.memSearchGrd.selectAllItems();              	
                	$scope.memSearchGrd.searchValue = ""; 	//공지대상 검색 팝업창 초기화 
                	                	 
                	$scope.memSearchPopGrd.selectAll = false;
                	$scope.memSearchPopGrd.selectAllItems();
                	$scope.memSearchPopGrd.searchValue = ""; 	//공지대상 검색 팝업창 초기화
                	
                	initCdTarget();
	            };
	            
	            //open
	            noticeDataVO.isOpen = function(val){
	            	if(val) {
	            		$scope.nkg.wrapper.height(657);
	            		$scope.nkg.resize();
	            		gridNoticeVO.dataSource.pageSize(20);
	            	}else {
	            		$scope.nkg.wrapper.height(798);
	            		$scope.nkg.resize();
	            		gridNoticeVO.dataSource.pageSize(24);
	            	}
	            };	            
	            	            
	            //저장 후 조회
	            noticeDataVO.afterSaveQuery = function(param){
	            	var me = this;
	            		            		            	
	            	me.param = {
                    	procedureParam: "MarketManager.USP_MA_05NOTICE_SEARCH01_GET&NO_WR@s|ARR_CD_NO@s|ARR_NO_C@s|SB_NM@s|NOTI_TO@s|NOTI_FROM@s",    
                    	NO_WR: param.NO_WRITE,
                    	ARR_CD_NO: param.CD_NOTICE,                                    	
                    	ARR_NO_C: param.ARR_NO_C.toString().replace(/,/g,'^'),
                    	SB_NM: param.NM_SUBJECT,
                    	NOTI_TO: new Date(today.y, today.m-1, today.d, "00", "00", "00").dateFormat("YmdHis"),
                    	NOTI_FROM: new Date(today.y, today.m-1, today.d, "00", "00", "00").dateFormat("YmdHis")
	                }; 
	            	
	            	$scope.nkg.dataSource.data([]);
	            	$scope.nkg.dataSource.page(1);
	            };	
	            
	            noticeDataVO.paramFunc =  function(param){
					var inputParam = angular.copy(param);
					
					if(param.data[0].ARR_NO_C.indexOf('*') > -1){
						inputParam.data[0].ARR_NO_C = $scope.noticeDataVO.allSelectTargetModel;    
						$scope.noticeDataVO.allSelectTargetModel = [];
					}
					inputParam.data[0].NO_WRITE = $scope.userInfo.NO_EMP;
					return inputParam;
				};
	            	                      
	            //마켓 검색 그리드
                var gridNoticeVO = $scope.gridNoticeVO = {
                		autoBind: false,
                        messages: {                        	
                            requestFailed: "마켓정보를 가져오는 중 오류가 발생하였습니다.",
                            commands: {
                                update: "저장",
                                canceledit: "취소"
                            }
                            ,noRecords: "검색된 데이터가 없습니다."
                        },
                    	boxTitle : "공지 리스트",
                    	sortable: true,                    	
                        pageable: {
                        	messages: UtilSvc.gridPageableMessages
                        },
                        noRecords: true,
                    	dataSource: new kendo.data.DataSource({
                    		transport: {
                    			read: function(e) {                   
                					UtilSvc.getList(noticeDataVO.param).then(function (res) {
                						if(res.data.results[0]){
                							e.success(res.data.results[0]);
                						}else{
                							e.error([]);
                						}
                					});                					
                    			},
                    			create: function(e) {
    	                			var defer = $q.defer(),
    	                			    param = { data: [e.data.models[0]]}, //왜  리스트만 인식할까?    	
    	                			    paramFunction =  noticeDataVO.paramFunc(param);
    	                			
    	                			MaNoticeSvc.noticeInsert(paramFunction).then(function(res) {
    	                				if(res.data) {
    	                					if(noticeDataVO.fileDataVO.dirty) {
	                							noticeDataVO.fileDataVO.CD_REF1 = res.data;
	                							noticeDataVO.fileDataVO.doUpload(function(){
	                			        			alert('저장 되었습니다.');
	                			        		}, function() {
	                			        			alert('첨부파일업로드 실패하였습니다.');
	                			        		});
	                		        		}else{
	                		        			alert('저장 되었습니다.');
	                		        		}    	                					
    	                					noticeDataVO.afterSaveQuery(param.data[0]); // 저장값으로 조회             		
    	                				}else{
    	                					e.error([]);
    	                					alert(res.data);
    	                					alert("저장 실패 하였습니다 새 글을 써주세요.");
    	                				}    	                				
    	                				defer.resolve(); 
    	                			},function(err){
    	                				e.error([]);
    	                			});
    	                			return defer.promise;     	                			        				
    	            			},
                    			update: function(e) {
                    				var defer = $q.defer();
    	                			 	
                    				if(noticeDataVO.deleteOrdUpdate === "d"){
                    					var param = { data: e.data.models },
                						    paramFunction = noticeDataVO.paramFunc(param);;
                    					
                    					MaNoticeSvc.noticeDelete(paramFunction).then(function(res) {
                    						if(res.data){
        	    	                			$scope.gridNoticeVO.dataSource.read();
                    						}else{
                	                			e.error([]);                	                			
                    						}
    	    	                			defer.resolve();	
        	                			});
                    					noticeDataVO.deleteOrdUpdate = "";
                    				}else{
                    					var param = {data: [e.data.models[0]]},
	                						paramFunction =  noticeDataVO.paramFunc(param);
                    					
        	                			MaNoticeSvc.noticeUpdate(paramFunction).then(function(res) {   	                				
        	                				if(res.data) {
        	                					if(noticeDataVO.fileDataVO.dirty) {
    	                							noticeDataVO.fileDataVO.CD_REF1 = param.data[0].NO_NOTICE;
    	                							noticeDataVO.fileDataVO.doUpload(function(){
    	                			        			alert("수정 되었습니다.");
    	                			        		}, function() {
    	                			        			alert('첨부파일업로드 실패하였습니다.');
    	                			        		});
    	                		        		}else{
    	                		        			alert('성공하였습니다.');
    	                		        		}    	          
        	                					
    	                						$scope.nkg.dataSource.read();    	        	                		
        	                				}else{
        	                					e.error([]);
        	                					alert("수정 실패하였습니다.!! 연구소에 문의 부탁드립니다.");
        	                				}
        	                				defer.resolve(); 
        	                			});
        	                			
                    				}                    				
    	                			return defer.promise;			
                    			},
                    			/*destroy: function(e) 
                    				//단일 로우만 타는 것 같음
                    				var defer = $q.defer(),
	                			 			param = {
	                			 				data: e.data.models
	                			 			};
                    					
                					MaNoticeSvc.noticeDelete(param).then(function(res) {
	    	                			$scope.gridNoticeVO.dataSource.read();
	    	                			defer.resolve();
    	                			});                   				
                					return defer.promise;	
                    			},   */ 	                		
                    			parameterMap: function(e, operation) {
                    				if(operation !== "read" && e.models) {
                    					return {models:kendo.stringify(e.models)};
                    				}
                    			}
                    		},
                    		change: function(e){
                    			var data = this.data();
                    			noticeDataVO.dataTotal = data.length;
                    		},
                    		pageSize: 20,
                    		batch: true,
                    		schema: {
                    			model: {
                        			id: "NO_NOTICE",
                    				fields: {
                    					ROW_CHK: 		   {	
					                    						type: "boolean", 
																editable: true,  
																nullable: false
                										   },
                    					ROW_NUM:		   {	
                    											type: "string", 
                												editable: false, 
                												nullable: false
            											   },                    					
                    					NO_NOTICE:		   {	
                    											type: "string", 
                    											editable: true, 
                    											nullable: false,
                    											validation: {
                    												no_noticevalidation: function (input) {																		
																		if (input.is("[name='NO_NOTICE']") && !input.val()) {
																			input.attr("data-no_noticevalidation-msg", "공지번호가 없습니다. 창을 닫고 다시 켜주세요 .");
																		    return false;
																		};
																		return true;
																	}
																}
                    									   },
                    				    ARR_NO_C: 		   {	
																type: "array", 
																editable: true, 
																nullable: true,
																validation: {
																	arr_no_cvalidation: function (input) {																		
																		if (input.is("[name='ARR_NO_C']") && !input.val()) {
																			input.attr("data-arr_no_cvalidation-msg", "공지대상을 입력해 주세요.");
																		    return false;
																		};
																		return true;
																	}
																}
	                    						    	   },
	                   				    NO_C: 		   	   {
																type: "string", 
																editable: false, 
																nullable: false
												    	   },
	                   				    NM_C: 		   	   {
																type: "string", 
																editable: false, 
																nullable: false
												    	   },
                    					CD_NOTICE: 		   {
	                    										type: "string",
	                    										defaultValue: "001",
	                    										nullable: false //true 일때 defaultValue가 안 됨	                    										
                    									   },
                    					NM_SUBJECT: 	   {
	                											type: "string",                     										
	                    										editable: true, 
	                    										nullable: false,
																validation: {
																	nm_subjectvalidation: function (input) {																		
																		if (input.is("[name='NM_SUBJECT']") && !input.val()) {
																			input.attr("data-nm_subjectvalidation-msg", "공지제목을 입력해 주세요.");
																		    return false;
																		};
																		if (input.is("[name='NM_SUBJECT']") && input.val().trim().length < 10 && input.val().trim().length > 800) {
																			input.attr("data-nm_subjectvalidation-msg", "공지제목을 10자 이상 800자 이내로 입력해 주세요.");
																		    return false;
																		};
																		return true;
																	}
																}
                    									   },                    									   
                    					DC_HTMLCONTENT:	   {	type: "string", 
                    											editable: true, 
                    											nullable: true,
																validation: {
																	dc_htmlcontentvalidation: function (input) {																		
																		if (input.is("[name='DC_HTMLCONTENT']") && !input.val()) {
																			input.attr("data-dc_htmlcontentvalidation-msg", "공지내용을 입력해 주세요.");
																		    return false;
																		};		
																		if (input.is("[name='DC_HTMLCONTENT']") && input.val()) {
																			var inputInEditor = UtilSvc.removeHtmlTag(input.data("kendoEditor").value().trim()).length;
																			if(inputInEditor > 2000 || inputInEditor < 10){
																				input.attr("data-dc_htmlcontentvalidation-msg", "공지내용을 10자 이상 2000자 이내로 입력해 주세요.");
																			    return false;
																			};
																		};
																		return true;
																	}
																}
                    									   },
                       					DC_CONTENT:	   	   {	
	                       										type: "string", 
																editable: true, 
																nullable: false
                       									   },
                    					DTS_INSERT: 	   {	type: "string", 
                    											editable: false,
                    											nullable: false
                    									   },                    					
                    					NO_WRITE: 		   {
	                											type: "string",
	                    										defaultValue: $scope.userInfo.NM_EMP,
	                    										editable: false, 
	                    										nullable: false, //true 일때 defaultValue가 안 됨
	                    										validation: {
	                    											no_writevalidation: function (input) {																		
																		if (input.is("[name='NO_WRITE']") && !input.val()) {
																			input.attr("data-no_writevalidation-msg", "작성자를 입력해 주세요.");
																		    return false;
																		};
																		return true;
																	}
																}
                    									   },
                    					SQ_NOTICE: 	       {
	                    										type: "number",
	                    									    defaultValue: 1,
	                    									    nullable: false,
	                    									    validation: {
	                    									    	sq_noticevalidation: function (input) {																		
																		if (input.is("[name='SQ_NOTICE']") && !input.val()) {
																			input.attr("data-sq_noticevalidation-msg", "우선 순위를 입력해 주세요.");
																		    return false;
																		};
																		return true;
																	}
																}
                    									   },
                    					SY_FILES: 		   {
                    											type: "string", 
                    											editable: true, 
                    											nullable: false
                    									   }
                    				}
                    			}
                    		},
                    	}),                    	
                    	navigatable: true, //키보드로 그리드 셀 이동 가능
                    	toolbar: [{template: kendo.template($.trim($("#ma-notice-toolbar-template").html()))}],
                    	/*selectable: "multiple, row",*/
                    	columns: [
								{
								   field: "ROW_CHK",
								   title: "선택",
								   width: 40,
								   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
							    },    
               		            {
								   field: "ROW_NUM",
								   title: "번호",
								   width: 50,
								   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
               		            },
            		            {
               		        	   field: "NO_C",
               		        	   title: "공지대상",
               		        	   width: 200,
               		        	   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
            		            },
            		            {
               		        	   field: "CD_NOTICE",
               		        	   title: "공지구분",
               		        	   width: 70,
               		        	   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}            		            
               		            },
	            		        {
           		        	       field: "NM_SUBJECT",
           		        	       title: "제목",
           		        	       width: 200,
           		        	       headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
           		        	    },
            		            {
            		        	   field: "DC_HTMLCONTENT",
            		               title: "공지내용",
            		               headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
            		            },
            		            {
            		        	   field: "DTS_INSERT",
            		               title: "공지일시",
            		               width: 120,
            		               headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
            		               //format: "{0: yyyy-MM-dd HH:mm:ss}"
            		            },
            		            {
            		        	   field: "NO_WRITE",
            		               title: "작성자",
            		               width: 70,
            		               headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
            		            },
            		            {
            		        	   field: "SQ_NOTICE",
            		               title: "우선순위",
            		               width: 70,
            		               headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
            		               format: "{0:0}"
            		            },
           		        	    { command: ["edit", "destroy"], width: 100 }
                    	],
                    	dataBound: function(e) {
                            this.expandRow(this.tbody.find("tr.k-master-row").first());// 마스터 테이블을 확장하므로 세부행을 볼 수 있음                            
                        },
                        collapse: function(e) {
                            this.cancelRow();
                        },         	
                    	editable: {
                    		mode: "popup",
                    		window : {
                    	        title: "공지 사항",
                    	        open: function(e){
	                	        	$scope.treeViewPop.element.find(".k-checkbox").removeAttr("checked").trigger("change");	                                  
                    	        }
                    	    },
                    		template: kendo.template($.trim($("#ma_notice_popup_template").html())),
                    		confirmation: false
                    	},	
                    	edit: function (e) {
                    		$scope.memSearchPopGrd.repeaterItems = [];
                    		/*var editor = $("#k-edi").data("kendoEditor");

                            // attach a click handler on the tool button, which opens the ImageBrowser dialog
                            editor.toolbar.element.find(".k-i-image").parent().click(function(){
                                // a setTimeout is required, otherwise the ImageBrowser widget will still not be initialized
                                $timeout(function(){
            	            		  
      	          	       		  var onUpload = function onUpload(e) {
  		    	          	       	    e.formData = new FormData();
  			    	          	       	e.formData.append("cd_at", "007");
  			    	          	        e.formData.append("cd_ref1", "");
  			    	          	        e.formData.append("cd_ref2", "");
  			    	          	        e.formData.append("cd_ref3", "");
  			    	          	        e.formData.append("cd_ref4", "");
  			    	          	        e.formData.append("cd_ref5", "");
  			    	          	        e.formData.append("bimage", true);
      	          	       		  };
            	            		  
	  		    	          	    $("[data-role='upload']").kendoUpload({
	      	          	       			  async: {
	      	          	       				  saveUrl: APP_CONFIG.domain + "/ut05FileUpload"
	  		    	          	          },
	  		    	          	         upload: onUpload
	  		    	          	    });       	       	
	      	          	       		  
                                    // retrieve the ImageBrowser widget object
                                    var imageBrowser = $(".k-imagebrowser").data("kendoImageBrowser");
                                    console.log(imageBrowser);
                                    
                                    // retrieve the ListView widget object
                                    var listView = imageBrowsser.listView;
                                    console.log(listView);

                                    // retrieve the Upload widget object
                                    var upload = imageBrowser.upload;
                                    console.log(upload);

                                    // retrieve the DropDownList widget object
                                    var dropdownlist = imageBrowser.arrangeBy;
                                    console.log(dropdownlist);                                   
                                });
                            });*/
                            
                		    //새 글 일때
                		    if (e.model.isNew()) { 		    	
                		        $(".k-grid-update").text("저장");
                		        $(".k-window-title").text("공지 사항 등록");
                		        
                		       /* $scope.$apply(function(){
                		        	e.model.NO_NOTICE = "123456798";
                		        	console.log($scope.gridNoticeVO.dataSource.data()[0].NO_NOTICE);
                		        }); */              		        
                		        
                		        if(!e.model.NO_NOTICE){
                		        	var getUrl = location.href.toString(),
                			    	    param = { data : getUrl };
                			
		                			MaNoticeSvc.noticeGetseq(param).then(function(res) {
		                				if(res.data) {
		                					e.model.NO_NOTICE = res.data;	
		                					e.model.dirty = true;
		                				}else{
		                					alert("공지사항 등록 창을 다시 열어 주세요.");
		                				}    	           
		                			},
	            				    function(err) {
		                				alert("공지사항 등록 창을 다시 열어 주세요.");
	            				    });             
                		        }
                		    //수정 할 글일때
                		    }else{                		    	                		    	
                		    	$(".k-grid-update").text("수정");
                		    	$(".k-window-title").text("공지 사항 수정");
                		    	
                		    	noticeDataVO.kEditor.noNotice = e.model.NO_NOTICE; 
                		    	// 파일 리스트 출력
                		    	fileList(e.model.NO_NOTICE);
                		    	
                		    	// 공지사항 수정시 역으로 공지대상 설정
                		    	var multiSelect = angular.element(document.querySelector("#pnkms")).data("kendoMultiSelect"),
                		    	    multiData = multiSelect.dataSource.data(),
                		    	    arraySplit = e.model.NO_C.split(",");    
                		    	
                		    	multiSelect.dataSource.data([]);
                                
                                for (var i = 0; i < arraySplit.length; i++) {                             	
                                    multiData.push({ "NM": arraySplit[i], "NO_C": arraySplit[i]});
                                };
                                
                                multiSelect.dataSource.data(multiData);
                                multiSelect.dataSource.filter({});
                                multiSelect.value(arraySplit);
                                multiSelect.trigger("change");
                                

                                $scope.memSearchPopGrd.repeaterItems = e.model.NM_C.split(",");
                               
                                $timeout(function () {
                                	if(!page.isWriteable()) {
                                		$(".k-grid-update").addClass("k-state-disabled");
                                		$(".k-grid-update").click(stopEvent);
                                	}
                                });
                		    }
                    	},
                    	cancel: function(e) { //pop up 창 닫힐때 작동됨  
                    		// 파일 리스트 출력 초기화 
            		        $scope.noticeDataVO.fileDataVO.currentDataList = [];           		        
            		        
            		        $scope.$apply(function(){
            		        	noticeDataVO.kEditor.noNotice = "";
            		        });
                    	},
                    	resizable: true,
                    	rowTemplate: kendo.template($.trim($("#ma_notice_template").html())),
                    	altRowTemplate: kendo.template($.trim($("#alt_ma_notice_template").html())),
                    	height: 657                    	
        		};
                
                //$scope.checkedIds = [];
                //$scope.deStroyCheck = false;
                
                //체크박스 옵션
                $scope.onNoticeGrdClick = function(e){
	                var element =$(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.nkg,
	                	dataItem = grid.dataItem(row);
	
	               // $scope.checkedIds[dataItem.ROW_NUM] = checked;	                	                
	                dataItem.ROW_CHK = checked;
	                dataItem.dirty = checked;
	                
	                if (checked) {
	                	row.addClass("k-state-selected");
	                } else {
	                	row.removeClass("k-state-selected");
	                }
                };               
                                                    
                $scope.onDeleteGrd = function(){
                	var grid = $scope.nkg,
                		chked = grid.element.find("input:checked"),
                		chkedLeng = grid.element.find("input:checked").length,
                		row = chked.closest('tr');
                	
                	if(!page.isWriteable()){
                		return;
                	}                	
                	if(chkedLeng < 1){
                		alert("삭제할 데이터를 선택해 주세요.");
                		return false;
                	};
                	                	
                	if(confirm(chkedLeng+"개 의 데이터를 삭제 하시겠습니까?")){       
                		grid.dataSource.fetch(function(){
                			noticeDataVO.deleteOrdUpdate = "d";
                			grid.dataSource.remove(grid.dataItems(row));
                			grid.dataSource.sync();
            			});
                	};
                };
                              
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
                       
                       if(noticeDataVO.noticeTargetModel.indexOf("*") > -1){
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
        		    			connSetting2("MarketManager.USP_MA_05MEMBERSEARCH01_GET", e, "noticeGet", $scope.memSearchGrd); 
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
                
                //업데이트용(수정 & 삽입 용)
                $scope.memSearchPopGrd = {
                	id: "memSearchPopGrd",
                	initTotalCount : 0, 			// 초기 로드시 데이터의 총 갯수
        			repeaterItems : [],
        			searchTotal : 0,
        			selectAll : false,
        			selectedCount : 0,
        			searchValue : "",
        			modal: true,
        			visible: false,
        			actionChk : 'h',
        			height: "500",
        			width: "400",
        			title: "가입자 검색",
        			show: function(e){        		           
        				angular.element(document.querySelector("#memberSearchSub")).focus();
        			        				        				
    					$scope.treeViewPop.element.find(".k-checkbox").removeAttr("checked").trigger("change");
                        for (var i = 0; i < $scope.memSearchPopGrd.repeaterItems.length; i++) {
                        	var item = $scope.treeViewPop.findByText($scope.memSearchPopGrd.repeaterItems[i]);
                            item.find(".k-checkbox").first().click();
                        };        				          	    
        			},
        			searchKeyUp: function(keyEvent){
        				var scopeTreeView = $scope.treeViewPop;
        				var grdView = $scope.memSearchPopGrd;
        				filter(scopeTreeView.dataSource, keyEvent.target.value.toLowerCase(), grdView.searchTotal);
        				grdView.selectedCount = 0;
        				scopeTreeView.element.find(".k-checkbox").prop("checked", false);
        				scopeTreeView.element.find(".k-checkbox").trigger("change");
        			},
        			actions : [
        			            { 
        			        	   text: '취소'
        	                    },
        	                    {
        	                	   text: '확인',
        	                	   action: function () {
        	                            $scope.$apply(function (e) {                            	
        	                            	var view = $scope.memSearchPopGrd; 
        	                            	view.repeaterItems = getCheckedItems($scope.treeViewPop, view);
        	                            	
        	                            	//전체 조회 시의 체크시 "전체"로 표시함
    		                                if(view.selectAll && view.repeaterItems.length === view.initTotalCount){    		                                	
    		                                	var multiSelect = angular.element(document.querySelector("#pnkms")).data("kendoMultiSelect"),
    		                                	    item = view.repeaterItems,
    		                                	    multiData = multiSelect.dataSource.data();
    		                                	    
        		                                //multiSelect.dataSource.data([]);
    		                                	    
    		                                	multiData = [];    
        		                                
        		                                multiData.push({NM: "전체", NO_C: "*"});
        		                                multiSelect.dataSource.data(multiData);    
    		                                	multiSelect.value(["*"]);
    		                                	multiSelect.trigger("change"); //트리거를 안하면 모델에 안들어감!
    		                                	
    		                                	for (var i = 0, cnt = item.length; i < cnt; i++) {
    		                                		$scope.noticeDataVO.allSelectTargetModel.push(item[i].NO_C.toString());
    		                                    }
    		                                }else{
    		                                	populateMultiSelect(view.repeaterItems, "#pnkms");
    		                                }
        	                            });
        	                        }
        	                    }
        	        ],
        	        dataSource: new kendo.data.HierarchicalDataSource ({ 
        		    	transport : {
        		    		read : function(e){
        		    			connSetting2("MarketManager.USP_MA_05MEMBERSEARCH01_GET", e, "noticeGet", $scope.memSearchPopGrd);
        		    		}
        		    	}
        		    }),
	    			autoBind: true,
                    dataTextField: "NM", //유기적으로 바뀌는 값
                    checkboxes: true,
                    loadOnDemand: false,
                    expandAll: true, 
                    dataBound: function (e) {
                        e.sender.expand(e.node);
                    },
                    check: function (e) {
                        $timeout(function () {
                        	$scope.$apply(function(){
                        		var view = $scope.memSearchPopGrd;
                        		var liList = $scope.treeViewPop.element.find("li").length; 
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
                        $scope.treeViewPop.element.find(".k-checkbox").prop("checked", $scope.memSearchPopGrd.selectAll);
                        $scope.treeViewPop.element.find(".k-checkbox").trigger("change");
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
       				   $(".k-grid-add").click(stopEvent);
       				   $(".k-grid-delete").click(stopEvent);
       				}

            	   initCdTarget();            	  
               });
               
            }]);
}());