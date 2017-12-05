(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Notice.controller : sy.NoticeCtrl
     * 공지사항
     */
    angular.module("sy.Qa.controller")
        .controller("sy.QaCtrl", ["$compile", "$scope", "$window", "$http", "$q", "$log", "sy.QaSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "APP_CONFIG", "APP_SA_MODEL",
            function ($compile, $scope, $window, $http, $q, $log, syQaSvc, APP_CODE, $timeout, resData, Page, UtilSvc, APP_CONFIG, APP_SA_MODEL) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            var syQaDataVO = $scope.syQaDataVO = {
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
						selected   : 'current',
						period : {
							start : angular.copy(today),
							end   : angular.copy(today)
						}
	        		},
                    contentText: { value: "" , focus: false},			//제목,내용
                    answerStatusModel : "*",                     	    //답변처리상태 모델
                    answerStatusBind : [], 
                    customOptions : {
                    	dataSource: [],
                        dataTextField: "NM_DEF",
                        dataValueField: "CD_DEF",
                        valuePrimitive: true
                    },//답변처리상태 옵션
                    fileMngDataVO : {
	        			CD_AT:'009',
	        			limitCnt: 5,
	        			currentDataList:[]
    				},	 
    				fileSlrDataVO : {     
	        			CD_AT:'008',
	        			limitCnt: 5,
	        			currentDataList:[]
    				},	 
    				fileDtLst : "",
    				dataTotal : 0,
             	    resetAtGrd : ""
		        };
	            
	            //답변 상태 바인딩
	            syQaDataVO.asrStsBind = (function(){
	            	var self = this, param = {
    					lnomngcdhd: "SYCH00091",
    					lcdcls: "SY_000031"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
    						self.answerStatusBind = res.data;
    						self.customOptions.dataSource = res.data;
        				}
	        		},function(err) {
	 				    e.error([]);	 				       
	 				});
	            });
	            
	            //조회
	            syQaDataVO.inQuiry = function(){
	            	var param = {
    						procedureParam: "USP_SY_16QA_GET&L_CONT@s|L_CD_ANSSTAT@s|L_START_DATE@s|L_END_DATE@s",
    						L_CONT: syQaDataVO.contentText.value,
    						L_CD_ANSSTAT : syQaDataVO.answerStatusModel, 
    						L_START_DATE  : new Date(syQaDataVO.datesetting.period.start.y, syQaDataVO.datesetting.period.start.m-1, syQaDataVO.datesetting.period.start.d).dateFormat("Ymd"),
    						L_END_DATE    : new Date(syQaDataVO.datesetting.period.end.y  , syQaDataVO.datesetting.period.end.m-1  , syQaDataVO.datesetting.period.end.d).dateFormat("Ymd")
    					};
					UtilSvc.getList(param).then(function (res) {
						if(res.data.results[0].length >= 1){
							$scope.syqakg.dataSource.data(res.data.results[0]);
			            	$scope.syqakg.dataSource.page(1);
						}else{
							$scope.syqakg.dataSource.data([]);
							$scope.syqakg.dataSource.error();
						}
						
	    				setTimeout(function () {
	                       	if(!page.isWriteable()) {
	               				$(".k-grid-delete").addClass("k-state-disabled");
	               				$(".k-grid-delete").click(stopEvent);
	               				$(".k-grid-연동체크").addClass("k-state-disabled");
	               				$(".k-grid-연동체크").click(stopEvent);
	               			}
	                    });
					});
	            	
	            	//$scope.nkg.dataSource.read();
	            };	    
	            
	            //초기화버튼
	            syQaDataVO.inIt = function(){
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
                	me.resetAtGrd = $scope.syqakg;
                	me.resetAtGrd.dataSource.data([]);                	
	            };

	            syQaDataVO.isOpen = function (val) {
	            	if(val) {
	            		$scope.syqakg.wrapper.height(657);
	            		$scope.syqakg.resize();
	            		gridSyQaVO.dataSource.pageSize(20);
	            	}
	            	else {
	            		$scope.syqakg.wrapper.height(798);
	            		$scope.syqakg.resize();
	            		gridSyQaVO.dataSource.pageSize(24);
	            	}
	            };
	            
	            //각 컬럼에 header 정보 넣어줌, 공통 모듈이 2줄 위주로 작성 되어 있기 떄문에  일부러 일케 했음 
	            syQaDataVO.columnProc = (function(){
            		var tpl = [ APP_SA_MODEL.ROW_CHK,
		                        APP_SA_MODEL.ROW_NUM,
		                        APP_SA_MODEL.DC_INQTITLE,
		                        APP_SA_MODEL.DC_INQCTT,
		                        APP_SA_MODEL.DTS_INQREG,                                   
		                        APP_SA_MODEL.NO_INSERT,
		                        APP_SA_MODEL.DC_ANSCTT,
		                        APP_SA_MODEL.CD_ANSSTAT],
            			extTpl = {headerAttributes : {"class": "table-header-cell", style: "text-align: center; font-size: 12px; vertical-align:middle;"}},
            			returnTpl = [];
            		
            			tpl[0].title = "선택";
            			tpl[5].title = "작성자";
            			
        				for(var i=0; i<tpl.length; i++){
        					var temp = angular.extend(extTpl, tpl[i]);
        					returnTpl.push(angular.copy(temp));
            			};
            			return returnTpl;
            	}());
	            
	            syQaDataVO.kEditor = {
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
	            
	          //그리드 셀 더블 클릭
                angular.element(document.querySelector("#divSyQaGrd")).delegate("tbody>tr", "dblclick", function(e){
	            	var grd = $scope.syqakg;
	            	var dataItem = grd.dataItem($(e.currentTarget).closest("tr"));
            		grd.editRow($(e.target).closest('tr'));
	            });
	            
                var gridSyQaVO = $scope.gridSyQaVO = {
                		autoBind: false,
                        messages: {            	
                            requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
                            noRecords: "검색된 데이터가 없습니다."
                        },
                    	boxTitle : "QA 리스트",
                    	fileUrl : APP_CONFIG.domain +"/ut05FileUpload",
                    	sortable: true,                    	
                        pageable: {
                        	messages: UtilSvc.gridPageableMessages
                        },
                        toolbar: [{template: kendo.template($.trim($("#sy-qa-toolbar-template").html()))}],
                        noRecords: true,
                		currentFileList:[],
                    	dataSource: new kendo.data.DataSource({
                    		transport: {
                    			read: function(e) {
                					/*UtilSvc.getList(param).then(function (res) {
                						noticeDataVO.dataTotal = res.data.results[0].length;
                						e.success(res.data.results[0]);
                					});*/
                    			},
                    			create: function(e) {
    	                			var defer = $q.defer();
	                			
    	                			syQaSvc.qaSave(e.data.models, "I").then(function(res) {
		                				if(res.data) {
		                					if(syQaDataVO.fileSlrDataVO.dirty) {
		                						syQaDataVO.fileSlrDataVO.CD_REF1 = res.data;
		                						syQaDataVO.fileSlrDataVO.doUpload(function(){
	                			        			alert('저장 되었습니다.');
	                			        		}, function() {
	                			        			alert('첨부파일업로드 실패하였습니다.');
	                			        		});
	                		        		}else{
	                		        			alert('저장 되었습니다.');
	                		        		}    	                					
		                					syQaDataVO.inQuiry();           		
		                				}else{
		                					e.error([]);
		                					alert(res.data);
		                					alert("저장 실패 하였습니다 새 글을 써주세요.");
		                				}    	                				
		                				defer.resolve(); 
		                			},function(err){
		                				e.error([]);
		                			});
    	                			syQaDataVO.fileSlrDataVO.currentDataList=[];
		                			return defer.promise;     	                			        				
		            			},
                			update: function(e) {
                				var defer = $q.defer();
	                			
	                			syQaSvc.qaSave(e.data.models, "U").then(function(res) {
	                				if(res.data) {
	                					if(syQaDataVO.fileSlrDataVO.dirty) {
	                						syQaDataVO.fileSlrDataVO.CD_REF1 = res.data;
	                						syQaDataVO.fileSlrDataVO.doUpload(function(){
                			        			alert('저장 되었습니다.');
                			        		}, function() {
                			        			alert('첨부파일업로드 실패하였습니다.');
                			        		});
                		        		}else{
                		        			alert('저장 되었습니다.');
                		        		}    	                					
	                					syQaDataVO.inQuiry();           		
	                				}else{
	                					e.error([]);
	                					alert(res.data);
	                					alert("저장 실패 하였습니다 새 글을 써주세요.");
	                				}    	                				
	                				defer.resolve(); 
	                			},function(err){
	                				e.error([]);
	                			});
	                			syQaDataVO.fileSlrDataVO.currentDataList=[];
	                			syQaDataVO.fileMngDataVO.currentDataList=[];
	                			return defer.promise;     	
                			},
                    		},
                    		pageSize: 11,
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
    															editable: true,  
    															nullable: false,
    															validation: {
    																dc_inqtitlevalidation: function (input) {																		
    																	if (input.is("[name='DC_INQTITLE']") && !input.val()) {
    																		input.attr("data-dc_inqtitlevalidation-msg", "문의 제목을 입력해 주세요.");
    																	    return false;
    																	};
    																	if (input.is("[name='DC_INQTITLE']") && input.val()) {
    																		var inputInEditor = UtilSvc.removeHtmlTag(input.val().trim()).length;
    																		if(inputInEditor > 100 || inputInEditor < 10){
    																			input.attr("data-dc_inqtitlevalidation-msg", "답변제목을 10자 이상 100자 이내로 입력해 주세요.");
    																		    return false;
    																		};
    																	};
    																	return true;
    																}
    															}
    							        				   },      
    							        DC_HTMLINQCTT:	   {
    													    	type: "string", 
    															editable: true,  
    															nullable: false,
    															validation: {
    																dc_htmllinqcttvalidation: function (input) {																		
    																	if (input.is("[name='DC_HTMLINQCTT']") && !input.val()) {
    																		input.attr("data-dc_htmllinqcttvalidation-msg", "문의내용을 입력해 주세요.");
    																	    return false;
    																	};
    																	if (input.is("[name='DC_HTMLINQCTT']") && input.val()) {
    																		var inputInEditor = UtilSvc.removeHtmlTag(input.data("kendoEditor").value().trim()).length;
    																		if(inputInEditor > 2000 || inputInEditor < 10){
    																			input.attr("data-dc_htmllinqcttvalidation-msg", "문의내용을 10자 이상 2000자 이내로 입력해 주세요.");
    																		    return false;
    																		};
    																	};
    																	return true;
    																}
    															}
    							        				   },       
    							        DC_INQCTT:	   	   {
    													    	type: "string", 
    															editable: true,  
    															nullable: false
    							        				   }, 
    							        NO_INQPHNE:	       {
    													    	type: "string", 
    															editable: true,  
    															nullable: false
    							        				   },
    							        DC_INQEMI:	       {
    													    	type: "string", 
    															editable: true,  
    															nullable: false,
    															validation: {
    																dc_inqemivalidation: function (input) {																		
    																	if (input.is("[name='DC_INQEMI']") && !input.val()) {
    																		input.attr("data-dc_inqemivalidation-msg", "이메일을 입력해 주세요.");
    																	    return false;
    																	};
    																	if (input.is("[name='DC_INQEMI']") && input.val()) {
    																		if(!/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/.test(input.val())){
    																			input.attr("data-dc_inqemivalidation-msg", "이메일 형식이 맞지않습니다.");
    																		    return false;
    																		};
    																	};
    																	return true;
    																}
    															}
    							        				   },
    							        NO_INQCEPH:	   	   {
    													    	type: "string", 
    															editable: true,  
    															nullable: false
    							        				   },
    							        NM_ANS:	   	       {
    													    	type: "string", 
    															editable: false,  
    															nullable: false
    							        				   },
    							        DC_HTMLANSCTT:	   {
    													    	type: "string", 
    															editable: true,  
    															nullable: false
    							        				   },
    							        DC_ANSCTT:	   	   {
    													    	type: "string", 
    															editable: true,  
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
    							        CD_ANSSTAT:	       {
    													    	type: "string", 
    															editable: true,  
    															nullable: false
    							        				   }  
    	                			}
    	                		}
                    		},
                    	}),
                    	/*selectable: "row",*/
                    	columns: syQaDataVO.columnProc,  	
                    	editable: {
                    		mode: "popup",
                    		window : {
                    	        title: "공지 사항"
                    	    },
                    		template: kendo.template($.trim($("#sy_qa_popup_template").html()))
                    	},
                    	edit: function(e) {
                    		$($('#k-qa-medtr').data().kendoEditor.body).attr('contenteditable', false);
                    		
                    		//새 글 일때
                		    if (e.model.isNew()) { 		    	
                		        $(".k-grid-update").text("저장");
                		        $(".k-grid-cancel").text("취소");
                		        $(".k-window-title").text("QA 등록");
                		        
                		        e.model.set("NO_INQCEPH", syQaDataVO.userInfo.NO_CEPH);
                		        e.container.find("input[name=DC_INQEMI]").val(syQaDataVO.userInfo.DC_EMIADDR).trigger("change");
                		        e.model.set("DC_INQEMI", syQaDataVO.userInfo.DC_EMIADDR);
                		        
                		    //수정 할 글일때
                		    }else{                		    	                		    	
                		    	$(".k-grid-update").text("수정");
                		    	$(".k-grid-cancel").text("취소");
                		    	$(".k-window-title").text("QA 등록");
                		    	
                		    	$(".k-grid-update").attr("onClick", function () {       // 익명클래스로 생성해야 팝업창 띄울시 펑션이 호출안댐. 호출식으로 생성하면 팝업창 띄울시 들어갔다나옴
	                		    	e.model.dirty = true;
	                		    });
                		    	
                		    	if(e.model.CD_ANSSTAT == "002" || e.model.CD_ANSSTAT == "003"){
                		    		$($('#k-edi').data().kendoEditor.body).attr('contenteditable', false);
                		    		angular.element("#DC_INQTITLE").attr("readonly", true);
                		    		angular.element("#DC_INQEMI").attr("readonly", true);
                		    		angular.element("#NO_INQCEPH").attr("readonly", true);
                		    		angular.element("#NO_INQPHNE").attr("readonly", true);
                		    		$(".k-grid-update").hide();
                		    		$(".k-grid-cancel").text("확인");
	                		    	var fileLsit = [];
	                        		var htmlcode = "";
	                        		var param = {
	                                    	procedureParam: "USP_SY_16QAMNGFILES_GET&L_CD_REF1@s",
	                                    	L_CD_REF1: e.model.NO_QA
	                                    };
	                					UtilSvc.getList(param).then(function (res) {
	                						fileLsit = res.data.results[0];
	                						angular.forEach(fileLsit, function (data) {
	                                            htmlcode += "<a href='"+gridSyQaVO.fileUrl+"?NO_AT="+data.NO_AT+"&CD_AT="+data.CD_AT+"' download="+data.NM_FILE+"> "+data.NM_FILE+" </a></br>";
	                                        });
	                						$("#fileSlrInfo").append(htmlcode);
	                						fileLsit = res.data.results[1];
	                						htmlcode = "";
	                						angular.forEach(fileLsit, function (data) {
	                                            htmlcode += "<a href='"+gridSyQaVO.fileUrl+"?NO_AT="+data.NO_AT+"&CD_AT="+data.CD_AT+"' download="+data.NM_FILE+"> "+data.NM_FILE+" </a></br>";
	                                        });
	                                        $("#fileMngInfo").append(htmlcode);
	                					});
	                					if( e.model.CD_ANSSTAT == "003" && e.model.NM_ANSCFM == "" && e.model.DTS_ANSCFM == "" ){
	                						var param = {
	    	                                    	procedureParam: "USP_SY_16QA_ANSCFM_UPDATE&L_NM_EMP@s|L_NO_QA@s",
	    	                                    	L_NM_EMP : syQaDataVO.userInfo.NM_EMP,
	    	                                    	L_NO_QA  : e.model.NO_QA
	    	                                    };
	    	                				UtilSvc.getList(param);
	                					}
                		    	}else if(e.model.CD_ANSSTAT == "001"){
                		    		var param = {
	                                    	procedureParam: "USP_SY_16QASLRFILES_GET&L_CD_REF1@s",
	                                    	L_CD_REF1: e.model.NO_QA
	                                    };
	                					UtilSvc.getList(param).then(function (res) {
	                						syQaDataVO.fileSlrDataVO.currentDataList = res.data.results[0];
	                					});
                		    	}
                		    	$timeout(function () {
                                	if(!page.isWriteable()) {
                                		$(".k-grid-update").hide();
                                	}
                                });
                		    }
                    	},
                    	resizable: true,
                    	rowTemplate: kendo.template($.trim($("#sy_qa_template").html())),
                    	altRowTemplate: kendo.template($.trim(angular.element(document.querySelector("#sy_qa_template")).html()).replace("class=\"k-grid-row\"","class=\"k-alt\"")),
                    	height: 657
        		};
                
                $timeout(function () {
             	    if(!page.isWriteable()) {            		   
    					$("#divSyQaGrd .k-grid-toolbar").hide();
        		    };
        			   
        			syQaDataVO.asrStsBind();
                });
               
                //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
                	var element =$(e.currentTarget);
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.syqakg,
	                	dataItem = grid.dataItem(row);
	                 	                
	                dataItem.ROW_CHK = checked;
	                
	                if (checked) {
	                	row.addClass("k-state-selected");
	                } else {
	                	row.removeClass("k-state-selected");
	                };
                };
                
                //kendo grid 체크박스 all click
                $scope.onOrdGrdCkboxAllClick = function(e){
                	UtilSvc.grdCkboxAllClick(e, $scope.syqakg);
                };	
                
                $scope.qaDelete = function() {
                	var grid = $scope.syqakg,
                	    dataItem = grid._data,
                	    deleteItem = [];
                	
                	angular.forEach(dataItem, function (data) {
                        if(data.ROW_CHK){
                        	deleteItem.push(data.NO_QA);
                        }
                    });
                	if(deleteItem.length == 0){
                		alert("삭제할 질문을 선택해주세요.");
                	}else{
                		if(confirm('정말로 삭제하시겠습니까?')){
                			syQaSvc.qaDelete(deleteItem).then(function(res) {
                				syQaDataVO.inQuiry(); 
                			});  
                    	}
                	}
				};
            }]);
}());