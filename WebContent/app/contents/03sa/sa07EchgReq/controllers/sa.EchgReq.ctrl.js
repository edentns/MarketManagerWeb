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
	           
	            var grdField =  {
                    ROW_CHK       	: { type: "bolean"    , editable: true , nullable: false },
                    NO_ORD        	: { type: "string"    , editable: false, nullable: false },
                    NO_APVL       	: { type: "string"    , editable: false, nullable: false },
                    NM_MRK        	: { type: "string"    , editable: false, nullable: false },
                    NO_MRKORD     	: { type: "string"    , editable: false, nullable: false },
                    NO_MRKITEMORD   : { type: "string"    , editable: false, nullable: false },
                    NO_MRKITEM    	: { type: "string"    , editable: false, nullable: false },
                    NO_MRKREGITEM 	: { type: "string"    , editable: false, nullable: false },
                    NM_MRKITEM    	: { type: "string"    , editable: true , nullable: false },
                    NM_MRKOPT     	: { type: "string"    , editable: false, nullable: false },
                    QT_ORD        	: { type: "number"    , editable: false, nullable: false },
                    QT_ECHG       	: { type: "string"    , editable: false, nullable: false },                    
                    AM_ORDSALEPRC 	: { type: "number"    , editable: false, nullable: false },
                    NM_PCHR       	: { type: "string"    , editable: true , nullable: false },
                    NM_CONS      	: { type: "string"    , editable: false, nullable: false },
                    NO_PCHRPHNE  	: { type: "string"    , editable: false, nullable: false },                    
                    DC_PCHREMI    	: { type: "string"    , editable: false, nullable: false },
                    NO_CONSPHNE   	: { type: "string"    , editable: false, nullable: false },                    
                    DC_CONSNEWADDR	: { type: "string"    , editable: false, nullable: false },                    
                    CD_ORDSTAT    	: { type: "string"    , editable: false, nullable: false },
                    DC_SHPWAY     	: { type: "string"    , editable: false, nullable: false },
                    DTS_ORD       	: { type: "string"    , editable: false, nullable: false },                    
                    DTS_ECHGREQ   	: { type: "string"    , editable: false, nullable: false },
                    DT_SND        	: { type: "string"    , editable: false, nullable: false },
                    DTS_ECHGAPPRRJT : { type: "string"    , editable: false, nullable: false },
                    NO_ECHGAPPRRJT  : { type: "string"    , editable: false, nullable: false },
                    NO_ECHGCPLT   	: { type: "string"	  , editable: false, nullable: false },                    
                    YN_CONN       	: { type: "string"    , editable: false, nullable: false },
                    CD_ECHGSTAT   	: { type: "string"    , editable: false, nullable: false },
                    NO_ECHGREQ    	: { type: "string"    , editable: false, nullable: false },
                    DC_ECHGRSNCTT 	: { type: "string"    , editable: false, nullable: false },
                    NO_MRK        	: { type: "string"    , editable: false, nullable: false },
                    CODE		  	: { type: "string"	  , editable: false, nullable: false },
                    NO_MNGMRK	  	: { type: "string"	  , editable: false, nullable: false },
                    CD_ECHGHRNKRSN  : { type: "string"	  , editable: false, nullable: false },
                    NM_ECHGHRNKRSN	: { type: "string"	  , editable: false, nullable: false },
        			CD_ECHGLRKRSN	: { type: "string"	  , editable: false, nullable: false },
        			NM_ECHGLRKRSN	: { type: "string"	  , editable: false, nullable: false },
        			CD_PARS			: { type: "string"	  , editable: false, nullable: false },
        			NO_INVO			: { type: "string"	  , editable: false, nullable: false },
        			CD_PARS_ECHG	: { type: "string"	  , editable: false, nullable: false },
        			NO_INVO_ECHG	: { type: "string"	  , editable: false, nullable: false },
                    CD_ECHGRJTRSN 	: {
                    					 type: "string"    
                    					,editable: true
                    					,nullable: false
                    					,validation: {
											cd_echgrjtrsnvalidation: function (input) {
												if(echgDataVO.rejectShowCode.indexOf(echgDataVO.updateChange) > -1 && echgDataVO.curCode === '170106'){
													if (input.is("[name='CD_ECHGRJTRSN']") && input.val() === "") {
														input.attr("data-cd_echgrjtrsnvalidation-msg", "교환거부코드를 입력해 주세요.");
													    return false;
													};
												};
												return true;
											}
										}
                    	              },
	                DTS_RECER 		: {
						            	 type: "date"
									    ,editable: true
									    ,nullable: false
									    ,validation: {
											dts_recervalidation: function (input) {
												if(echgDataVO.completeShowCode.indexOf(echgDataVO.updateChange) > -1){
													if (input.is("[data-role=datepicker]")) {
														input.attr("data-dts_recervalidation-msg", "교환상품접수일자를 정확히 입력해 주세요.");
														manualDataBind(input, "DTS_RECER");
													    return input.data("kendoDatePicker").value();
													};
												};
												return true;
											}
										}
                      				  },
                    DC_ECHGRJTCTT 	: {
                    					 type: "string"
                    					,editable: true
                    					,nullable: false
                    					,validation: {
											dc_echgrjtcttvalidation: function (input) {
												if(echgDataVO.rejectShowCode.indexOf(echgDataVO.updateChange) > -1){
													if (input.is("[name='DC_ECHGRJTCTT']") && input.val() === "") {
														input.attr("data-dc_echgrjtcttvalidation-msg", "교한거부사유를 입력해 주세요.");
													    return false;
													};
													if (input.is("[name='DC_ECHGRJTCTT']") && input.val() !== "" && input.val().length > 1000) {
														input.attr("data-dc_echgrjtcttvalidation-msg", "교환거부사유를 1000자 이내로 입력해 주세요.");
													    return false;
													};
												};
												return true;
											}
										}
                                      },
                  	CD_PARS_INPUT	: {
				                    	type: "array"
					     			   ,editable: true
					     			   ,nullable: false
					                   ,validation: {
					                	   cd_pars_inputvalidation: function (input) {
					                		   if(echgDataVO.procShowCode.indexOf(echgDataVO.updateChange) > -1){
											    	if (input.is("[name='CD_PARS']") && input.val() === "") {
					                                	input.attr("data-cd_pars_inputvalidation-msg", "택배사를 입력해 주세요.");
					                                    return false;
					                                }
					                		   };
					                		   return true;
									    	}
										}
                				      },
                	NO_INVO_INPUT	: {
				                    	type: "string"
						     		   ,editable: true
						     		   ,nullable: false
						               ,validation: {
						            	   no_invo_inputvalidation: function (input) {
						            		   if(echgDataVO.procShowCode.indexOf(echgDataVO.updateChange) > -1){
						            			   if (input.is("[name='NO_INVO']") && input.val()){
						            				   var result = Util03saSvc.NoINVOValidation(input, 'NO_INVO', 'no_invo_inputvalidation');		
						            				   if(result){
						            					   echgDataVO.manualDataBind(input, "NO_INVO_INPUT");
						            				   };
						            				   return result;
					                               };						            			   
						            		   	};
						            		   	return true;
						            	   	}
						               	 }
                				       }
                	};
	            
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
						selected   : Util03saSvc.storedDatesettingLoad("echgDataVO"),
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
	        		echgStatusMo : "",
	        		cdEchgrsnOp: {
	        			dataSource: [],
	        			dataTextField:"NM_DEF",
	                    dataValueField:"CD_DEF",
                        enable: false,
	                    valuePrimitive: true
	        		},
	        		cdEchgrjtOp: [],
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
	        		param : "",	        		
	        		rejectDetailShowMrkCode : ['170106','170103'],
	        		rejectDivShowMrkCode : ['170106'],
	        		rejectShowCode : ['002'],
	        		procShowMrkCode : ['170106','170103','170104','170102'],
	        		procShowCode : ['001','003'],
	        		completeShowMrkCode : ['170104','170102','170106','170103'],
	        		completeShowCode : ['003'],
	        		shpList : "",
	        		curCode : "",
	        		menualShwWrn : ""
	            };
			       
	            echgDataVO.initLoad = function () {
	            	var me = this;
                	var ordParam = {
                			lnomngcdhd: "SYCH00048",
        					lcdcls: "SA_000007"
        				},
        				betParam = {
        					lnomngcdhd: "SYCH00067",
        					lcdcls: "SA_000026"
        				},
        				cdEchgrsnParm = {
	    					lnomngcdhd: "SYCH00052",
	    					lcdcls: "SA_000011"
                		},
                		cdEchgrjtParm = {
	    					lnomngcdhd: "SYCH00068",
	    					lcdcls: "SA_000027",
	    					customnoc: "00000"
                		},
                		cdEchgstsParm = {
	    					lnomngcdhd: "SYCH00054",
	    					lcdcls: "SA_000013"
                		};
                    $q.all([
            			UtilSvc.csMrkList().then(function (res) {
            				return res.data;
            			}),	
            			UtilSvc.getCommonCodeList(ordParam).then(function (res) {
            				return res.data;
            			}),
            			UtilSvc.getCommonCodeList(betParam).then(function (res) {
            				return res.data;
            			}),
            			//교환 사유 코드
	        			UtilSvc.getCommonCodeList(cdEchgrsnParm).then(function (res) {
	        				return res.data;
	        			}),    	            
    	            	//교환 거부 코드
	        			UtilSvc.getCommonCodeList(cdEchgrjtParm).then(function (res) {
	        				return res.data;
	        			}),    	            
    	            	//교환 상태 코드
	        			UtilSvc.getCommonCodeList(cdEchgstsParm).then(function (res) {
	        				return res.data;
	        			})
                    ]).then(function (result) {
                        me.ordMrkNameOp = result[0];
                        me.ordStatusOp = result[1];
                        me.betweenDateOptionOp = result[2];
                        me.betweenDateOptionMo = result[2][0].CD_DEF;
                        
                        me.cdEchgrsnOp.dataSource = result[3];
                        me.cdEchgrjtOp = result[4];
                        me.echgStatusOp = result[5];
                        me.echgStatusMo = result[5][0].CD_DEF;
                                                
                        $timeout(function(){
            				Util03saSvc.storedQuerySearchPlay(me, "echgDataVO");
                        },0);    
                    });
                };	            
	            
	            //조회
	            echgDataVO.inQuiry = function(){
	            	var self = this;
	            	self.param = {
        				    NM_MRKITEM : self.procName.value,
    					    NO_MRK : self.ordMrkNameMo, 
    					    CD_ORDSTAT : self.ordStatusMo,
    					    NO_MRKORD : self.orderNo.value,      
    					    NM_PCHR : self.buyerName.value,
    					    CD_ECHGSTAT : self.echgStatusMo,
    					    DTS_CHK : self.betweenDateOptionMo,  
    					    DTS_FROM : new Date(self.datesetting.period.start.y, self.datesetting.period.start.m-1, self.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
    					    DTS_TO : new Date(self.datesetting.period.end.y, self.datesetting.period.end.m-1, self.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis"),
    					    NM_MRK_SELCT_INDEX : self.ordMrkNameOp.allSelectNames,
    					    NM_ORDSTAT_SELCT_INDEX : self.ordStatusOp.allSelectNames,
    					    DTS_SELECTED : self.datesetting.selected,
    					    CASH_PARAM : "echgDataVO"
	            	};
	            	if(Util03saSvc.readValidation(self.param)){
	            		$scope.echgkg.dataSource.data([]);
		            	$scope.echgkg.dataSource.page(1);
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
	            
	            echgDataVO.isOpen = function (val) {
	            	if(val){
	            		$scope.echgkg.wrapper.height(616);
	            		$scope.echgkg.resize();
	            		if(echgDataVO.param !== "") {
	            			grdEchgVO.dataSource.pageSize(9);
	            		}
	            	}else{
	            		$scope.echgkg.wrapper.height(798);
	            		$scope.echgkg.resize();
	            		if(echgDataVO.param !== "") {
	            			grdEchgVO.dataSource.pageSize(12);
	            		}
	            	}
	            };
	            
	            echgDataVO.ngIfdata = function(showCode, eqCode, inCode){
	            	var me = this,
	            	   shkChk = false,
	            	   eqChk = false;
	            	
	            	shkChk = showCode.indexOf(me.updateChange) > -1;
	            	eqChk = eqCode.indexOf(inCode) > -1;
	            	
	            	return (shkChk && eqChk);
	            };
	            
	            //팝업에 입력창들이 NG-IF 인하여 데이터 바인딩이 안되서 수동으로 데이터 바인딩을 함
	            echgDataVO.manualDataBind = function(input, target){
	            	var getUid = input.parents("table").attr("data-uid"),
	            	    grid = $scope.echgkg,
	            	    viewToRow = $("[data-uid='" + getUid + "']", grid.table),
	            	    dataItem = grid.dataItem(viewToRow);				                	    
	            	
	            	if(target === "CD_PARS_INPUT" || target === "CD_HOLD"){
	            		var i, chosenPureData = input.data().handler.dataSource.data();
	            		for(i=0; i<chosenPureData.length; i++){
	            			if(chosenPureData[i]["CD_DEF"] === input.val()){
	            				dataItem[target] = chosenPureData[i];
	            			}
	            		};
	            	}else if(target === "NOW_YN"){
	            		dataItem[target] = input.is(":checked");
	            	}else if(target === "RECEIVE_SET"){
	            		dataItem[target] = $("#receive-group").find("[type=radio]:checked").val();
	            	}else{
	            		dataItem[target] = input.val();
	            	};
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
                    	messages: UtilSvc.gridPageableMessages
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
                    	var cntnr = e.container,
                    		dsModel = e.model,
                    		cdpars = cntnr.find("select[name=CD_PARS]"),
                    		cdechgrjtrsn = cntnr.find("select[name=CD_ECHGRJTRSN]"),
                    		chosenDS = "";
                 
                    	echgDataVO.curCode = dsModel.CODE;
                    	
                    	switch(echgDataVO.updateChange) {
                    		case "001" : {
                    			chosenDS = echgDataVO.shpList.filter(function(ele){
        	            			return (ele.DC_RMK1 === e.model.NO_MRK && ele.DC_RMK3 === '002');
        	            		});                    			
                    			break;
                    		} 
                    		case "002" : {
                    			chosenDS = echgDataVO.cdEchgrjtOp.filter(function(ele){
        	            			return (ele.DC_RMK1 === e.model.NO_MNGMRK);
        	            		});                           			
                    			break;
                    		}
                    		case "003" : {
                    			chosenDS = echgDataVO.shpList.filter(function(ele){
        	            			return (ele.DC_RMK1 === e.model.NO_MRK && ele.DC_RMK3 === '003');
        	            		});
                    			break;
                    		}
                    		default : {
                    			break;
                    		}                    		
                    	};             	
                    	
                    	cdechgrjtrsn.kendoDropDownList({
	            			dataSource : chosenDS,
		        			dataTextField:"NM_DEF",
		                    dataValueField:"CD_DEF",
	                		optionLabel : "교환거부코드를 선택해 주세요 ",	                    
		                    valuePrimitive: true
	            		});
                    	
                    	cdpars.kendoDropDownList({
	            			dataSource : !chosenDS.length ? [{NM_PARS_TEXT : "택배사 등록", CD_PARS : ""}] : chosenDS,
	                		dataTextField : "NM_PARS_TEXT",
	                		dataValueField : "CD_DEF",
	                		optionLabel : "택배사를 선택해 주세요 ",
	                		select : function(e){
	                			var me = this;
	                			$timeout(function(){
	                				if(me.selectedIndex > 0){
    	                				me.element.parents("table").find(".k-invalid-msg").hide();
    	                			}
	                			},0);
	                		},
                            change : function(e){
                            	if(this.text() === "택배사 등록" && this.selectedIndex === 1){
                            		$state.go("app.syPars", { menu: true, ids: null });
                            		$scope.echgkg.cancelRow();
                            	}
                            }
	            		});
                    },
                    cancel: function(e){
                    	angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
                    },
                	scrollable: true,
                	resizable: true,
                	rowTemplate: kendo.template($.trim($("#echg_template").html())),
                	altRowTemplate: kendo.template($.trim(angular.element(document.querySelector("#echg_template")).html()).replace("class=\"k-grid-row\"","class=\"k-alt\"")),
                	height: 616,
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#echg_toolbar_template").html()))}],
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				saEchgReqSvc.orderList(echgDataVO.param).then(function (res) {    						
            						e.success(res.data.queryList);			
            						echgDataVO.shpList = res.data.queryShipList;
            					}, function(err){
            						e.error([]);
            					});
                				
                			},
                			update: function(e){
                				var whereIn = ['004','005'],
            				    	echgGrd = $scope.echgkg;
                				
                				switch(echgDataVO.updateChange){
	                				case '001' : {
	            						if(confirm("선택하신 주문을 교환 승인하시겠습니까?")){
	            							var defer = $q.defer(),
	            								param = e.data.models.filter(function(ele){
	            									return (ele.ROW_CHK === true && whereIn.indexOf(ele.CD_ORDSTAT) > -1 && ele.CD_ECHGSTAT === "001" && (ele.NO_ORD) && ele.NO_ORD !== "");
	            								}); 
	            							
	            							if(e.data.models.length !== param.length){
	            								alert("배송처리 된 교환요청 주문만 승인 처리 할 수 있습니다.");
	                    						return;
	            							};
	            							
	            							alert("송장번호 체크로 인하여 처리시간이 다소 소요 될수 있습니다.");	            							
	            							
	            							saEchgReqSvc.echgConfirm(param[0]).then(function (res) {
	                    						var rtnV = res.data,
	                    							allV = rtnV.allNoOrd,
	    	        							    trueV = rtnV.trueNoOrd,	    	        							    
	    	        							    falseV = rtnV.falseNoOrd;
	                    						
	                    						if(!rtnV){
                        							alert("실패하였습니다.");
                        							e.error([]);
                        							return false;
                        						};
                        						
	    	        	            			if(trueV.length > 0){
	    	        	            				alert("교환승인 하였습니다.");
	    	        	            				defer.resolve();		         
	                    							Util03saSvc.storedQuerySearchPlay(echgDataVO, "echgDataVO");
	    	        	            			}else if(falseV.length > 0){
	    	        	            				echgDataVO.menualShwWrn = falseV;
	    	        	            				e.error([]);
	    	        	            				defer.resolve();            		
	    	        	            			}else if(allV.length < 1){
	    	        	            				alert("교환승인을 실패하였습니다.");
	                    							e.error();
	    	        	            				defer.resolve();            		
	    	        	            			};		                    		
	                    					}, function(err){
	                    						e.error([]);
	                    					});  
	            							return defer.promise;
	            						}else{
	            							echgGrd.cancelRow();
	            							angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
	            							return false;
	            						};	
	            						break;
	            					}; 
                					case '002' : {
                						if(confirm("선택하신 주문을 교환 거부하시겠습니까?")){
                							var defer = $q.defer(),	
                								param = e.data.models.filter(function(ele){
                									return (ele.ROW_CHK === true && whereIn.indexOf(ele.CD_ORDSTAT) > -1 && ele.CD_ECHGSTAT === "001" && (ele.NO_ORD) && ele.NO_ORD !== "");
                								});                             					
                        					if(param.length !== 1){
                        						alert("배송처리 된 교환 요청 주문만 거부 처리 할 수 있습니다.");
                        						return;
                        					};     
                        					saEchgReqSvc.echgReject(param[0]).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("교환거부 하였습니다.");                        					
            	            						$scope.echgkg.dataSource.read();
                        						}else{
                        							alert("교환거부를 실패하였습니다.");
                        							e.error();
                        						}
                        					}, function(err){
                        						alert("실패하였습니다.");
                        						e.error([]);
                        					});                         
        		                			return defer.promise;
                						}else{
	            							echgGrd.cancelRow();
	            							angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
	            						};  
                						break;
                					};        
                					case '003' : {
                						if(confirm("교환완료 하시겠습니까?")){
                        					var defer = $q.defer(),
        	                			 	    param = e.data.models.filter(function(ele){  	                			 	    	
        	                			 	    	return (ele.ROW_CHK === true && ['005','004','009'].indexOf(ele.CD_ORDSTAT) > -1 && ['001','002'].indexOf(ele.CD_ECHGSTAT) > -1) ;
        	                			 	    });                        					
                        					if(param.length !== 1){
                        						alert("마켓 및 주문 상태를 확인해 주세요.");
                        						return;
                        					};        
                        					
                        					param[0].DTS_RECER = kendo.toString(new Date(param[0].DTS_RECER), "yyyyMMddHHmmss");
                        					
                        					alert("송장번호 체크로 인하여 처리시간이 다소 소요 될수 있습니다.");
                        					
                        					saEchgReqSvc.echgCompleted(param[0]).then(function (res) {
                        						var rtnV = res.data,
	                    							allV = rtnV.allNoOrd,
	    	        							    trueV = rtnV.trueNoOrd,
	    	        							    falseV = rtnV.falseNoOrd;
                        						
                        						if(!rtnV){
                        							alert("실패하였습니다.");
                        							e.error([]);
                        							return false;
                        						};
	    	        	            			
	    	        	            			if(trueV.length > 0){
                        							alert("교환완료 하였습니다.");
	    	        	            				defer.resolve();		         
	                    							Util03saSvc.storedQuerySearchPlay(echgDataVO, "echgDataVO");
	    	        	            			}else if(falseV.length > 0){
	    	        	            				echgDataVO.menualShwWrn = falseV;
	    	        	            				e.error([]);
	    	        	            				defer.resolve();            		
	    	        	            			}else if(!allV.length < 1){
                        							alert("교환완료를 실패하였습니다.");
	                    							e.error();
	    	        	            				defer.resolve();            		
	    	        	            			};		   
                        					}, function(err){
                        						alert("실패하였습니다.");
                        						e.error([]);
                        					});                         					
        		                			return defer.promise;
                    	            	}else{
	            							echgGrd.cancelRow();
	            							angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
	            							return false;
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
                			angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
                		},                		
                		pageSize: 9,
                		batch: true,
                		schema: {
                			model: {
                    			id: "NO_ORD",
                				fields: grdField
                			}
                		},
                	}),
                	columns: [
              	            {
		                        field: "ROW_CHK",
		                        title: "<input class='ROW_CHK k-checkbox' type='checkbox' id='grd_chk_master' ng-click='onOrdGrdCkboxAllClick($event)'><label class='k-checkbox-label k-no-text' for='grd_chk_master' style='margin-bottom:0;'>​</label>",				                        
		                        width: 30,
		                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px; vertical-align:middle;"}			                          
            	            },                        
	                        {	
            	            	field: "NO_ORD",
	                            title: "관리번호",
	                            width: 100,
	                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
	                            columns : [	
	                                       		{
													field: "NO_APVL",
													title: "결제번호 / 주문번호",
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
	                            columns : [
											{
												field: "NO_MRKITEMORD",
												title: "상품주문번호",
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
		                        columns : [
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
                                title: "상품명",
                                width: 100,
		                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                        columns : [
											{
												field: "NM_MRKOPT",
												title: "옵션(상품구성)",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
                            },                   
	                        {
	                        	field: "QT_ORD",
	                            title: "주문수량",
	                            width: 100,
	                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
	                            columns : [
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
	                            columns : [
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
                                width: 110,
		                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                        columns : [
											{
												field: "NM_CONS",
												title: "수취인",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
                            },    
                            {
	                        	field: "CD_PARS_ECHG",
	                            title: "반품택배사",
	                            width: 100,
	                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
	                            columns : [
											{
												field: "NO_INVO_ECHG",
												title: "송장번호",
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
	                            columns : [
											{
												field: "NO_CONSPHNE",
												title: "수취인 전화번호",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
	                        },
                           	{
                                field: "DC_ECHGRSNCTT",
                                title: "교환사유",
                                width: 100,
		                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                        columns : [
											{
												field: "DC_CONSNEWADDR",
												title: "수취인주소",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
	                        },
	                        {
	                        	field: "CD_ORDSTAT",
	                            title: "주문상태",
	                            width: 100,
	                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
	                            columns : [
											{
												field: "DC_SHPWAY",
												title: "배송방법",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
	                        }, 
	                        {
	                        	field: "DTS_ORD",
	                            title: "주문일시",
	                            width: 100,
	                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
	                            columns : [
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
                                title: "배송일자",
                                width: 100,
		                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                        columns : [
											{
												field: "DTS_ECHGAPPRRJT",
												title: "교환상품접수일",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
                            }, 
                            {
                                field: "CD_PARS",
                                title: "재배송 택배사", 
                                width: 100,
		                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                        columns : [
											{
												field: "NO_INVO",
												title: "송장번호",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
                            },  
                           	{
                                field: "NO_ECHGCPLT",
                                title: "접수확인자",
                                width: 90,
		                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                        columns : [
											{
												field: "CD_ECHGSTAT",
												title: "교환상태",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}
                                     ]
                            },   
	                        {
	                        	field: "YN_CONN",
	                            title: "연동구분",
	                            width: 100,
	                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                        columns : [
											{
												field: "",
												title: "",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
										]
	                        }
	                 ]               
	        	};

	            UtilSvc.gridtooltipOptions.filter = "td div";
	            grdEchgVO.tooltipOptions = UtilSvc.gridtooltipOptions;
		        
	            //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
                	UtilSvc.grdCkboxClick(e, $scope.echgkg);
                };
                
                //kendo grid 체크박스 all click
                $scope.onOrdGrdCkboxAllClick = function(e){
                	UtilSvc.grdCkboxAllClick(e, $scope.echgkg);
                };		
                
                $scope.popupUtil = function(e){
                	Util03saSvc.popupUtil.blur(e);
                };
                
	            $scope.$on("kendoWidgetCreated", function(event, widget){
                	var grd = $scope.echgkg;
                	
	                if (widget === grd){
	                	
	                	widget.element.find(".k-grid-echg").on("click", function(e){         				
	                		if(grd.element.find(".k-grid-content input:checked").length != 1){
	                			alert("한 건의 주문을 선택해 주세요");
	                			return false;
	                		};	      	                		
	                		var	chked = grd.element.find(".k-grid-content input:checked"),
                				grdItem = grd.dataItem(chked.closest("tr")),
	                			vali = function (arg){
	                				switch(arg){
	                					case 1 : {
	                						if(['170104','170102','170902'].indexOf(grdItem.CODE) > -1){
	    			                    		alert("지마켓, 옥션, 쿠팡은 교환처리 기능을  사용할 수 없습니다.");
	    			                    		return false;
	    			                    	};
	    			                    	if(!(['004','005'].indexOf(grdItem.CD_ORDSTAT) > -1 && grdItem.CD_ECHGSTAT === '001')){			                				
	    		                				alert("교환요청 된 주문만  처리 할 수 있습니다.");
	    		                				return false;
	    		                			};
	    		                			return true;
	    		                			break;
	                					};
	                					case 2 : {
	                						if('170902' === grdItem.CODE){
	    			                    		alert("쿠팡은 교환 완료 기능을  사용할 수 없습니다.");
	    			                    		return false;
	    			                    	};
	    			                    	return true;
	    			                    	break;
	                					};
	                					default : {	                						
	                						break; 
	                					}
	                				}
	                			}, 
	                			proc = function (px, curCode){
	                				grd.options.editable.window.width = px;
		                			echgDataVO.updateChange = curCode;
				                    grd.editRow(chked.closest("tr"));	
	                			};
	                		
		                    if($(this).hasClass("confirm") && vali(1)){	//교환 처리		                    	
		                    	proc("550px", "001");	
		                    };
		                    if($(this).hasClass("reject") && vali(1)){ 	//교환거부	
		                    	proc("550px", "002");		
		                    };
		                    if($(this).hasClass("complete") && vali(2)){//교환완료		                    	
		                    	if((grdItem.CD_ORDSTAT == "009" && grdItem.CD_ECHGSTAT == "002") || (['004','005'].indexOf(grdItem.CD_ORDSTAT) > -1 && grdItem.CD_ECHGSTAT === "001" && ['170104','170102'].indexOf(grdItem.CODE) > -1)){				                			
		                    		grdItem.DTS_RECER = new Date();
		                    		proc("550px", "003");		
		                		}else{
		                			alert("마켓 및 주문 상태를 확인해 주세요.");
		                			return false;
		                		};
		                    };                		                			
	                	});
	                }
                });    
	            
	            echgDataVO.initLoad();
            }]);
}());
