(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.EchgReq.controller : sa.EchgReqCtrl
     * 상품분류관리
     */
    angular.module("sa.EchgReq.controller")
        .controller("sa.EchgReqCtrl", ["$scope", "$http", "$q", "$log", "sa.EchgReqSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "$window",  "Util03saSvc",
            function ($scope, $http, $q, $log, saEchgReqSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, $window, Util03saSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
        		kendo.culture('ko-KR');// 이거 해야지 원화로 나옴	            
	            
            	//마켓명 드랍 박스 실행	
        		var mrkName = (function(){
        			UtilSvc.csMrkList().then(function (res) {
        				if(res.data.length >= 1){
        					echgDataVO.ordMrkNameOp = res.data;
        				}
        			});
	            }());
        		
	            //주문상태 드랍 박스 실행
	            var orderStatus = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00048",
    					lcdcls: "SA_000007"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					echgDataVO.ordStatusOp = res.data;
        				}
        			});
	            }());
	            
	            //기간 상태 드랍 박스 실행
	            var betweenDate = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00067",
    					lcdcls: "SA_000026"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					echgDataVO.betweenDateOptionOp = res.data;
        					echgDataVO.betweenDateOptionMo = res.data[0].CD_DEF; //처음 로딩 때 초기 인덱스를 위하여
        				}
        			});
	            }());
	            
	            //교환 사유 코드
	            var cdEchgrsn = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00052",
    					lcdcls: "SA_000011"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					echgDataVO.cdEchgrsnOp.dataSource = res.data;
        				}
        			});
	            }());
	            
	            //교환 거부 코드
	            var cdEchgrjt = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00065",
    					lcdcls: "SA_000024"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					echgDataVO.cdEchgrjtOp.dataSource = res.data;
        				}
        			});
	            }());
	            
	            //교환 상태 코드
	            var cdEchgrjt = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00054",
    					lcdcls: "SA_000013"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					echgDataVO.echgStatusOp = res.data;
        				}
        			});
	            }());
	            
	            var echgDataVO = $scope.echgDataVO = {
            		boxTitle : "교환요청",
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
	        		procName : { value: "" , focus: false },
	        		buyerName: { value: "" , focus: false },
	        		orderNo : { value: "" , focus: false },
	        		ordMrkNameOp : [],
	        		ordMrkNameMo : "*",
	        		ordStatusOp : [],
	        		ordStatusMo : "*",
	        		betweenDateOptionOp : [],
	        		betweenDateOptionMo : "",
	        		shipStatusOp : [],
	        		echgStatusOp : [],
	        		cdEchgrsnOp: {
	        			dataSource: [],
	        			dataTextField:"NM_DEF",
	                    dataValueField:"CD_DEF",
                        enable: false,
	                    valuePrimitive: true
	        		},
	        		cdEchgrjtOp:{
	        			dataSource: [],
	        			dataTextField:"NM_DEF",
	                    dataValueField:"CD_DEF",
	                    valuePrimitive: true
	        		},
	        		dateOptions : {										//DATE PICKER
	        			parseFormats: ["yyyyMMddHHmmss"], 				//이거 없으면 값이 바인딩 안됨
        	            animation: {
        	                close: {
        	                    effects: "fadeOut zoom:out",
        	                    duration: 300
        	                },
        	                open: {
        	                    effects: "fadeIn zoom:in",
        	                    duration: 300
        	                }
        	            },
	        		},
	        		userInfo : JSON.parse($window.localStorage.getItem("USER")).NM_EMP,
	        		updateChange : "",
	        		dataTotal : 0,
	        		resetAtGrd : "",
	        		param : ""
	            };   
			            
	            //조회
	            echgDataVO.inQuiry = function(){
	            	var self = this;
	            	self.param = {
        				    NM_MRKITEM : echgDataVO.procName.value,
    					    NO_MRK : echgDataVO.ordMrkNameMo, 
    					    CD_ORDSTAT : echgDataVO.ordStatusMo,
    					    NO_MRKORD : echgDataVO.orderNo.value,      
    					    NM_PCHR : echgDataVO.buyerName.value,
    					    DTS_CHK : echgDataVO.betweenDateOptionMo,  
    					    DTS_FROM : new Date(echgDataVO.datesetting.period.start.y, echgDataVO.datesetting.period.start.m-1, echgDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
    					    DTS_TO : new Date(echgDataVO.datesetting.period.end.y, echgDataVO.datesetting.period.end.m-1, echgDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
	            	};                   				
	            	if(Util03saSvc.readValidation(self.param)){
	            		$scope.echgkg.dataSource.data([]);
		            	$scope.echgkg.dataSource.page(1);
		            	//$scope.echgkg.dataSource.read();
        			};
	            };
		            
	            //초기화버튼
	            echgDataVO.inIt = function(){      	
            		var me  = this;
                	
	            	me.procName.value = "";
                	me.buyerName.value = "";
                	me.orderNo.value = "";
                	me.betweenDateOptionMo = me.betweenDateOptionOp[0].CD_DEF;
                	        			
                	$timeout(function(){
                		angular.element(".frm-group").find("button:eq(0)").triggerHandler("click");
                		angular.element(".frm-group").find("button:eq(2)").triggerHandler("click");
                	},0);                	
                	        			
                	me.ordStatusOp.bReset = true;
                	me.ordMrkNameOp.bReset = true;
                			        
                	angular.element($("#grd_chk_master")).prop("checked",false);
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.echgkg;
                	me.resetAtGrd.dataSource.data([]);
	            };	
		            
                //검색 그리드
	            var grdEchgVO = $scope.grdEchgVO = {
            		autoBind: false,
                    messages: {                        	
                        requestFailed: "주문정보를 가져오는 중 오류가 발생하였습니다.",
                        commands: {
                            update: "저장",
                            canceledit: "닫기"
                        }
                        ,noRecords: "검색된 데이터가 없습니다."
                    },
                	boxTitle : "주문 목록",
                	pageable: {
                    	messages: {
                    		empty: "표시할 데이터가 없습니다.",
                    		display: "총 {2}건 중 {0}~{1}건의 자료 입니다."
                    	}
                    },
                    noRecords: true,
                    dataBound: function(e) {
                        this.expandRow(this.tbody.find("tr.k-master-row").first());// 마스터 테이블을 확장하므로 세부행을 볼 수 있음     
                    },
                    collapse: function(e) {
                        this.cancelRow();
                    },       
                    editable: {
                    	mode: "popup",
                		window : {
                	        title: ""
                	    },
                		template: kendo.template($.trim($("#echg_popup_template").html())),
                		confirmation: false
                    },
                    edit: function(e){                    	 
                    	// ng-if가  edit보다 나오는 순서가 늦음어서 timeout 사용
                    	if(echgDataVO.updateChange === "002"){
		            		$timeout(function(){                			
		                    	var ddlRjt = e.container.find("select[name=CD_ECHGRJTRSN]").data("kendoDropDownList");                    		          
		                    	
		                    	ddlRjt.select(0);
		                    	ddlRjt.trigger("change");                			
		                	},50);
                    	}
                    },
                	scrollable: true,
                	resizable: true,
                	rowTemplate: kendo.template($.trim($("#echg_template").html())),
                	altRowTemplate: kendo.template($.trim($("#echg_alt_template").html())),
                	height: 550,
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#echg_toolbar_template").html()))}],
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				/*var param = {
                				    NM_MRKITEM : echgDataVO.procName.value,
            					    NO_MRK : echgDataVO.ordMrkNameMo, 
            					    CD_ORDSTAT : echgDataVO.ordStatusMo,
            					    NO_MRKORD : echgDataVO.orderNo.value,      
            					    NM_PCHR : echgDataVO.buyerName.value,
            					    DTS_CHK : echgDataVO.betweenDateOptionMo,  
            					    DTS_FROM : new Date(echgDataVO.datesetting.period.start.y, echgDataVO.datesetting.period.start.m-1, echgDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
            					    DTS_TO : new Date(echgDataVO.datesetting.period.end.y, echgDataVO.datesetting.period.end.m-1, echgDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
                                };                   				
                				if(Util03saSvc.readValidation(param)){
                					saEchgReqSvc.orderList(param).then(function (res) {         						
	            						e.success(res.data);			                   				                    					
                					});                					
                				}else{
                					e.error();
                				};*/
                				saEchgReqSvc.orderList(echgDataVO.param).then(function (res) {         						
            						e.success(res.data);			                   				                    					
            					})
                			},
                			update: function(e){                				
                				switch(echgDataVO.updateChange){
                					case '001' : {
                						if(confirm("교환상품을 접수 하시겠습니까?")){
                        					var defer = $q.defer(),
        	                			 	    param = e.data.models.filter(function(ele){
        	                			 	    	//ele.DTS_ECHGCPLT = kendo.toString(ele.DTS_ECHGCPLT , "yyyyMMddHHmmss");         	                			 	    	
        	                			 	    	return (ele.ROW_CHK === true && ele.CD_ORDSTAT === "008" && ele.CD_ECHGSTAT === "002" && (ele.NO_ORD) && ele.NO_ORD !== "") ;
        	                			 	    });                        					
                        					if(param.length !== 1){
                        						alert("교환승인 된 주문만 접수 처리 할 수 있습니다.");
                        						return;
                        					};                                       					
                        					saEchgReqSvc.echgCompleted(param[0]).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("교환상품을 접수 하였습니다.");
                        							//echgDataVO.ordStatusMo = (echgDataVO.ordStatusMo === '*') ? echgDataVO.ordStatusMo : echgDataVO.ordStatusMo + "^008";
            	            						$scope.echgkg.dataSource.read();
                        						}else{
                        							alert("교환상품접수를 실패하였습니다.");
                        							e.error();
                        						}
                        					});                         					
        		                			return defer.promise;
                    	            	}
                						break;
                					};
                					case '002' : {
                						if(confirm("선택하신 주문을 교환 거부하시겠습니까?")){
                							var defer = $q.defer(),	
                								param = e.data.models.filter(function(ele){
                									return (ele.ROW_CHK === true && ele.CD_ORDSTAT === "005" && ele.CD_ECHGSTAT === "001" && (ele.NO_ORD) && ele.NO_ORD !== "");
                								});                             					
                        					if(param.length !== 1){
                        						alert("배송이 완료되고, 교환 요청된 주문만 거부 처리 할 수 있습니다.");
                        						return;
                        					};                        					
                        					saEchgReqSvc.echgReject(param[0]).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("교환거부 하였습니다.");
                        							//echgDataVO.ordStatusMo = (echgDataVO.ordStatusMo === '*') ? echgDataVO.ordStatusMo : echgDataVO.ordStatusMo + "^005";
            	            						$scope.echgkg.dataSource.read();
                        						}else{
                        							alert("교환거부를 실패하였습니다.");
                        							e.error();
                        						}
                        					});                         
        		                			return defer.promise;
                						}  
                						break;
                					};
                					case '003' : {
                						if(confirm("선택하신 주문을 교환 승인하시겠습니까?")){
                							var defer = $q.defer(),
                								param = e.data.models.filter(function(ele){
                									return (ele.ROW_CHK === true && ele.CD_ORDSTAT === "005" && ele.CD_ECHGSTAT === "001" && (ele.NO_ORD) && ele.NO_ORD !== "");
                								}); 
                							
                							if(e.data.models.length !== param.length){
                								alert("배송이 완료되고, 교환요청 된 주문만 승인 처리 할 수 있습니다.");
                        						return;
                							};
                							saEchgReqSvc.echgConfirm(param).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("교환승인 하였습니다.");                        				
                        							//echgDataVO.ordStatusMo = (echgDataVO.ordStatusMo === '*') ? echgDataVO.ordStatusMo : echgDataVO.ordStatusMo + "^008";
            	            						$scope.echgkg.dataSource.read();
                        						}else{
                        							alert("교환승인을 실패하였습니다.");
                        							e.error();
                        						}
                        					});  
                							return defer.promise;
                						};	
                						break;
                					};                					
                					default : {
                						break;
                					};
                				};
                			},
                			parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
                		},
                		change: function(e){
                			var data = this.data();
                			echgDataVO.dataTotal = data.length;
                			angular.element($("#grd_chk_master")).prop("checked",false);
                		},                		
                		pageSize: 7,
                		batch: true,
                		schema: {
                			model: {
                    			id: "NO_ORD",
                				fields: {						                    
                					ROW_CHK: 		   {
				                    						type: "boolean", 
															editable: false,
															nullable: false
            										   },
            						NO_ORD: 		   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
									NO_APVL: 		   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
								    NM_MRK: 		   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
									NO_MRKORD: 		   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
									NO_MRKITEM: 	   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
									NO_MRKREGITEM: 	   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
									NM_MRKITEM: 	   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
									NM_MRKOPT: 		   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
								    QT_ORD: 	   	   {
					                				    	type: "string",
															editable: false,
															nullable: false
			   					      				   },
			   					    QT_ECHG:           {
					                				    	type: "string",
															editable: false,
															nullable: false
				      				   				   },				      				   				   
									AM_ORDSALEPRC: 	   {
						            						type: "number", 
															editable: false,
															nullable: false
													   },
									NM_PCHR: 		   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },													   
									NM_CONS: 		   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
									NO_PCHRPHNE: 	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },								    				   
								    DC_PCHREMI: 	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    NO_CONSPHNE: 	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    DC_CONSNEWADDR:    {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    CD_ORDSTAT: 	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    DC_SHPWAY: 	   	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },								    				   
								    DTS_ORD: 	   	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },			    				   
								    DTS_ECHGREQ:	   {
													    	type: "string",
															editable: false,
															nullable: false
								    				   },								    				   
								    DT_SND: 		   {
													    	type: "string",
															editable: false,
															nullable: false
								    				   },								    					
								    NO_INVO: 		   {
													    	type: "string",
															editable: false,
															nullable: false
								    				   }, 		
			    					DTS_ECHGAPPRRJT:   {
													    	type: "string",
															editable: false,
															nullable: false
								    				   },	
		    					    CD_PARS: 		   {
													    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    NO_ECHGCPLT:	   {
													    	type: "string",
															editable: false,
															nullable: false
			    									   },
									YN_CONN: 		   {
													    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    CD_ECHGSTAT: 	   {
													    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    NO_ECHGREQ: 	   {
													    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    CD_ECHGRSN: 	   {
													    	type: "string",						 //교환 사유 코드
															editable: false,
															nullable: false
								    				   },
								    DC_ECHGRSNCTT: 	   {
													    	type: "string",						 //교환요청내용 
															editable: false,
															nullable: false
			    				    				   },
			    				    CD_ECHGRJTRSN: 	   {
													    	type: "string",						 //교환요청거부코드 
															editable: true,
															nullable: false,
															validation: {
																cd_echgrjtrsnvalidation: function (input) {
					  									    		if (input.is("[name='CD_ECHGRJTRSN']") && input.val() === "") {
			                                                        	input.attr("data-cd_echgrjtrsnvalidation-msg", "교환거부코드를 입력해 주세요.");
			                                                            return false;
			                                                        };
			                                                        return true;
				  									    	  	}
															}
			    				    				   },
			    				    DC_ECHGRJTCTT: 	   {
													    	type: "string",						 //교환요청거부사유 
															editable: true,
															nullable: false,
															validation: {
																dc_echgrjtcttvalidation: function (input) {
					  									    		if (input.is("[name='DC_ECHGRJTCTT']") && input.val() === "") {
			                                                        	input.attr("data-dc_echgrjtcttvalidation-msg", "교한거부사유를 입력해 주세요.");
			                                                            return false;
			                                                        };
					  									    		if (input.is("[name='DC_ECHGRJTCTT']") && input.val() !== "" && input.val().length > 1000) {
			                                                        	input.attr("data-dc_echgrjtcttvalidation-msg", "교환거부사유를 1000자 이내로 입력해 주세요.");
			                                                            return false;
			                                                        };
			                                                        return true;
				  									    	  	}
															}
			    				    				   },
			    				    NO_RECE: 	   	   {
													    	type: "string",						 //접수자 
															editable: false,
															nullable: false
			    				    				   },
			    				    DTS_RECER: 	   	   {
													    	type: "date",						 //접수 일자 
															editable: true,
															nullable: false,
															validation: {
																dts_recervalidation: function (input) {
					  									    		if (input.is("[data-role=datetimepicker]")) {
			                                                        	input.attr("data-dts_recervalidation-msg", "교환상품접수일자를 정확히 입력해 주세요.");			                                                        	
			                                                            return input.data("kendoDateTimePicker").value();
			                                                        };
			                                                        return true;
				  									    	  	}
															}
			    				    				   }
                				}
                			}
                		},
                	}),                	
                	columns: [	
								{
								    field: "ROW_CHK",
								    title: "<input class='k-checkbox' type='checkbox' id='grd_chk_master' ng-click='onOrdGrdCkboxAllClick($event)'><label class='k-checkbox-label k-no-text' for='grd_chk_master' style='margin-bottom:0;'>​</label>",				                        
								    width: "30px",
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px; vertical-align:middle;"}
								},                        
								{	
									field: "NO_ORD",
								    title: "관리번호",
								    width: "100px",
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "NO_APVL",
								                    title: "결제번호",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								             ]
								},
								{
									field: "NM_MRK",	
								    title: "마켓명",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "NO_MRKORD",
								                    title: "주문번호",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "NO_MRKITEM",
								    title: "마켓상품번호",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "NO_MRKREGITEM",
								                    title: "상품번호",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "NM_MRKITEM",
								    title: "상품명 / 옵션(상품구성)",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "CD_ECHGSTAT",
								                    title: "교환상태",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},    
								{
									field: "QT_ORD",	
								    title: "판매수량",
								    width: 100,		                            
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "QT_ECHG",
								                    title: "교환 요청 수량",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                 
								{
									field: "NM_PCHR",
								    title: "구매자",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "AM_ORDSALEPRC",
								                    title: "판매가",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "NO_PCHRPHNE",
								    title: "전화번호",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "NM_CONS",
								                    title: "수취인",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "DC_PCHREMI",
								    title: "이메일",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "NO_CONSPHNE",
								                    title: "수취인 전화번호",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								} ,                        
								{
									field: "DC_ECHGRSNCTT",
								    title: "교환사유",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "DC_CONSNEWADDR",
								                    title: "수취인주소",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								} ,                        
								{
									field: "CD_ORDSTAT",
								    title: "진행상태",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "DC_SHPWAY",
								                    title: "배송방법",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								} ,                        
								{
									field: "DTS_ORD",
								    title: "주문일시",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "DTS_ECHGREQ",
								                    title: "교환요청일시",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "DT_SND",
								    title: "재발송일시",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [
								               	{
								                    field: "NO_INVO",
								                    title: "교환상품 송장번호",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "DTS_ECHGAPPRRJT",
								    title: "교환상품접수일",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [
								               	{
								                    field: "CD_PARS",
								                    title: "택배사",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "NO_ECHGCPLT",
								    title: "접수확인자",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [
								               	{
								                    field: "YN_CONN",
								                    title: "연동구분",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								}                	           
                    ]                	          	
	        	};
	            
	            //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
	                var i = 0,
	                	element = $(e.currentTarget),
	                	checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.echgkg,
	                	dataItem = grid.dataItem(row),
	                	allChecked = true;
	                 	                
	                dataItem.ROW_CHK = checked;
	                dataItem.dirty = checked;
	                
	                for(i; i<element.parents('tbody').find("tr").length; i+=1){
	                	if(!element.parents('tbody').find("tr:eq("+i+")").find(".k-checkbox").is(":checked")){
	                		allChecked = false;
	                	}
	                }
	                
	                angular.element($("#grd_chk_master")).prop("checked",allChecked);
	                
	                if(checked){
	                	row.addClass("k-state-selected");
	                }else{
	                	row.removeClass("k-state-selected");
	                };
                };
                
                //kendo grid 체크박스 all click
                $scope.onOrdGrdCkboxAllClick = function(e){
	                var i = 0,
	                	element = $(e.currentTarget),
	                	checked = element.is(':checked'),
	                	row = element.parents("div").find(".k-grid-content table tr"),
	                	grid = $scope.echgkg,
	                	dataItem = grid.dataItems(row),
	                	dbLength = dataItem.length;
	                
	                if(dbLength < 1){	                	
	                	alert("전체 선택 할 데이터가 없습니다.");
	                	angular.element($("#grd_chk_master")).prop("checked",false);
	                	return;
	                };   
	                
	                for(i; i<dbLength; i += 1){
	                	dataItem[i].ROW_CHK = checked;
	                	dataItem[i].dirty = checked;
	                };
	                
	                if(checked){
	                	row.addClass("k-state-selected");
	                	row.find(".k-checkbox").prop( "checked", true );
	                }else{
	                	row.removeClass("k-state-selected");
	                	row.find(".k-checkbox").prop( "checked", false );
	                };
                };	            
	            $scope.$on("kendoWidgetCreated", function(event, widget){
                	var grd = $scope.echgkg;
                	
	                if (widget === grd){
	                	//교환접수
	                	widget.element.find(".k-grid-echg-accept").on("click", function(e){
	                		var	chked = grd.element.find(".k-grid-content input:checked"),
	                			grdItem = grd.dataItem(chked.closest("tr")),
		            			chkedLeng = grd.element.find("input:checked").length;
	                    		                    
		                    if(chkedLeng === 1){
		                    	if(grdItem.CD_ORDSTAT === "008" && grdItem.CD_ECHGSTAT === "002"){
		                    		//if(!(grdItem.DTS_ECHGCPLT)){
		                				grdItem.DTS_RECER = kendo.toString(new Date(), "yyyyMMddHHmmss");
		                    			//grdItem.DTS_RECER = kendo.toString(new Date());
		                			//};
		                			grd.options.editable.window.width = "550px";
		                			echgDataVO.updateChange = "001";
		                			grd.editRow(chked.closest("tr"));
	                			}else{
	                				alert("교환승인 된 주문만 접수 처리 할 수 있습니다.");	
	                				return;
	                			};			                    	
		                	}else{
		                		alert("한 건의 주문을 선택해 주세요");
		                	}
	                	}); 
	                	
	                	//교환거부
	                	widget.element.find(".k-grid-echg-reject").on("click", function(e){
	                		var	chked = grd.element.find(".k-grid-content input:checked"),
	                			grdItem = grd.dataItem(chked.closest("tr")),	
		            			chkedLeng = grd.element.find(".k-grid-content input:checked").length;
	                    		                    
		                    if(chkedLeng === 1){
		                    	if(grdItem.CD_ORDSTAT === "005" && grdItem.CD_ECHGSTAT === "001"){
		                    		grd.options.editable.window.width = "900px";
		                			echgDataVO.updateChange = "002";
		                			grd.editRow(chked.closest("tr"));
	                			}else{
	                				alert("교환요청 된 주문만 거부 처리 할 수 있습니다.");
	                				return;
	                			}
		                	}else{
		                		alert("한 건의 주문을 선택해 주세요");
		                	}
	                	}); 
	                	
	                	//교환 승인
	                	widget.element.find(".k-grid-echg-confirm").on("click", function(e){  
	                		var chkedLeng = grd.element.find(".k-grid-content input:checked").length;
	                		
	                		if(chkedLeng < 1){
                				alert("주문을 선택해 주세요.");	
                				return;
                			};
	                		echgDataVO.updateChange = "003";
	                		grd.saveChanges();
	                	});
	                		                	
	                	//교환요청 가져오기 
	                	widget.element.find(".k-grid-echg-open").on("click", function(e){
	                		alert("교환요청 가져오기는 [공사중]입니다.");
	                	});
	                }
                });    
	            
            }]);
}());