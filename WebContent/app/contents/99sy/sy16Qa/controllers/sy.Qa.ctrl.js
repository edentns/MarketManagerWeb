(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Notice.controller : sy.NoticeCtrl
     * 공지사항
     */
    angular.module("sy.Qa.controller")
        .controller("sy.QaCtrl", ["$scope", "$window", "$http", "$q", "$log", "sy.QaSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "APP_CONFIG", "APP_SA_MODEL",
            function ($scope, $window, $http, $q, $log, syQaSvc, APP_CODE, $timeout, resData, Page, UtilSvc, APP_CONFIG, APP_SA_MODEL) {
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
                    answerStatusBind : [],                     	    	//답변처리상태 옵션
                    fileMngDataVO : {
	        			CD_AT:'009',
	        			limitCnt: 5,
	        			bImage: true
    				},	 
    				fileSlrDataVO : {
	        			CD_AT:'008',
	        			limitCnt: 5,
	        			bImage: true
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
	            	var me = this, dateSts = this.datesetting.period.start, dateSte = this.datesetting.period.end;
	            	me.param = {
                    	CONT: syQaDataVO.contentText.value,
                    	CD_ANSSTAT : syQaDataVO.answerStatusModel,
                    	NO_C_S : syQaDataVO.qaNocModel.toString(),                    	
                    	DTS_FROM : (qa)? new Date(today.y, today.m, today.d-1, 23, 59, 58).dateFormat("YmdHis") : new Date(dateSts.y, dateSts.m-1, dateSts.d-1, 23, 59, 58).dateFormat("YmdHis"),
                    	DTS_TO : (qa)? new Date(today.y, today.m, today.d, 23, 59, 58).dateFormat("YmdHis") : new Date(dateSte.y, dateSte.m-1, dateSte.d, 23, 59, 59).dateFormat("YmdHis"),
                    	NO_QA : qa
                    }; 
	            	
	            	if(!me.answerStatusModel){ alert("답변처리상태를 입력해 주세요."); return false; };
	            	if(!me.qaNocModel){ alert("문의대상을 입력해 주세요."); return false; };	            	
	            	if(me.param.NOTI_TO > me.param.NOTI_FROM){ alert("공지일자를 올바르게 선택해 주세요."); return false; };
	            	
	            	$scope.syqakg.dataSource.data([]);
	            	$scope.syqakg.dataSource.page(1);
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
                        noRecords: true,
                		currentFileList:[],
                    	dataSource: new kendo.data.DataSource({
                    		transport: {
                    			read: function(e) {
                					UtilSvc.getList(param).then(function (res) {
                						noticeDataVO.dataTotal = res.data.results[0].length;
                						e.success(res.data.results[0]);
                					});
                    			}
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
    															editable: false,  
    															nullable: false,
    															validation: {
    																dc_htmlanscttvalidation: function (input) {																		
    																	if (input.is("[name='DC_INQTITLE']") && !input.val()) {
    																		input.attr("data-dc_inqtitlevalidation-msg", "문의 제목을 입력해 주세요.");
    																	    return false;
    																	};
    																	if (input.is("[name='DC_INQTITLE']") && input.val()) {
    																		var inputInEditor = UtilSvc.removeHtmlTag(input.data("kendoEditor").value().trim()).length;
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
    															editable: false,  
    															nullable: false,
    															validation: {
    																dc_htmlanscttvalidation: function (input) {																		
    																	if (input.is("[name='DC_HTMLINQCTT']") && !input.val()) {
    																		input.attr("data-dc_htmlinqcttvalidation-msg", "문의내용을 입력해 주세요.");
    																	    return false;
    																	};
    																	if (input.is("[name='DC_HTMLINQCTT']") && input.val()) {
    																		var inputInEditor = UtilSvc.removeHtmlTag(input.data("kendoEditor").value().trim()).length;
    																		if(inputInEditor > 2000 || inputInEditor < 10){
    																			input.attr("data-dc_htmlinqcttvalidation-msg", "문의내용을 10자 이상 2000자 이내로 입력해 주세요.");
    																		    return false;
    																		};
    																	};
    																	return true;
    																}
    															}
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
    							        DC_HTMLANSCTT:	   {
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
                    	    }/*,
                    		template: kendo.template($.trim($("#ma_notice_popup_template").html()))*/
                    	},
                    	edit: function(e) {
                    		e.container.find(".k-button.k-grid-update").hide();
                    		e.container.find(".k-button.k-grid-cancel").text("확인");
						},
                    	resizable: true,
                    	rowTemplate: kendo.template($.trim($("#sy_qa_template").html())),
                    	altRowTemplate: kendo.template($.trim(angular.element(document.querySelector("#sy_qa_template")).html()).replace("class=\"k-grid-row\"","class=\"k-alt\"")),
                    	height: 657
        		};
               
                //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
                	UtilSvc.grdCkboxClick(e, $scope.syqakg);
                };
                
                //kendo grid 체크박스 all click
                $scope.onOrdGrdCkboxAllClick = function(e){
                	UtilSvc.grdCkboxAllClick(e, $scope.syqakg);
                };	
            }]);
}());