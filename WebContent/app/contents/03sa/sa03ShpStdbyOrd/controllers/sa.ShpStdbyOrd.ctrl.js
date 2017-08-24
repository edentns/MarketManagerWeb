(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.ShpStdbyOrd.controller : sa.ShpStdbyOrdCtrl
     * 상품분류관리
     */
    angular.module("sa.ShpStdbyOrd.controller")
        .controller("sa.ShpStdbyOrdCtrl", ["$scope", "$http", "$q", "$log", "$state", "sa.ShpStdbyOrdSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc",  "Util03saSvc", 
            function ($scope, $http, $q, $log, $state, saShpStdbyOrdSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util03saSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            kendo.culture('ko-KR');// 이거 해야지 원화로 나옴
	            
	            //마켓명 드랍 박스 실행	
	            var mrkName = (function(){
        			UtilSvc.csMrkList().then(function (res) {
        				if(res.data.length >= 1){
        					shpbyordDataVO.ordMrkNameOp = res.data;
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
        					shpbyordDataVO.ordStatusOp = res.data;
        				}
        			});		
	            }()); 
	            
	            //기간 상태 드랍 박스 실행	
	            var betweenDate = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00055",
    					lcdcls: "SA_000014"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					shpbyordDataVO.betweenDateOptionOp = res.data;
        					shpbyordDataVO.betweenDateOptionMo = res.data[0].CD_DEF; //처음 로딩 때 초기 인덱스를 위하여
        				}
        			});		
	            }());
	            
	            var shpbyordDataVO = $scope.shpbyordDataVO = {
            		boxTitle : "배송대기주문",
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
	        		cancelCodeOp : {
    					dataSource: [],
    					dataTextField: "NM_DEF",
                        dataValueField: "CD_DEF",
                    	valuePrimitive: true,
    				},    				
	        		cancelCodeMo : "",
	        		shipCodeTotal : "",
	        		updateChange : "",
	        		dataTotal : 0,
	        		resetAtGrd :"",
	        		param : ""
	            };
	            
	            //조회
	            shpbyordDataVO.inQuiry = function(){
	            	var me = this;
	            	me.param = {	  
    				    NM_MRKITEM : shpbyordDataVO.procName.value,
					    NO_MRK : shpbyordDataVO.ordMrkNameMo, 
					    CD_ORDSTAT : shpbyordDataVO.ordStatusMo,
					    NO_MRKORD : shpbyordDataVO.orderNo.value,      
					    NM_PCHR : shpbyordDataVO.buyerName.value,
					    DTS_CHK : shpbyordDataVO.betweenDateOptionMo,  
					    DTS_FROM : new Date(shpbyordDataVO.datesetting.period.start.y, shpbyordDataVO.datesetting.period.start.m-1, shpbyordDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
					    DTS_TO : new Date(shpbyordDataVO.datesetting.period.end.y, shpbyordDataVO.datesetting.period.end.m-1, shpbyordDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
                    };   
    				if(Util03saSvc.readValidation(me.param)){
    					$scope.shpbyordkg.dataSource.data([]);
        				$scope.shpbyordkg.dataSource.page(1);
    	            	//$scope.shpbyordkg.dataSource.read();
    				}	            	
	            };	            
	            
	            //초기화버튼
	            shpbyordDataVO.inIt = function(){      	
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
                	me.resetAtGrd = $scope.shpbyordkg;
                	me.resetAtGrd.dataSource.data([]);
	            };

	            shpbyordDataVO.isOpen = function (val) {
	            	if(val) {
	            		$scope.shpbyordkg.wrapper.height(616);
	            		$scope.shpbyordkg.resize();
	            	}
	            	else {
	            		$scope.shpbyordkg.wrapper.height(798);
	            		$scope.shpbyordkg.resize();
	            	}
	            };
	            
	            
	            // 유효성 검사
	            var updateValidation = function(param, btnCase){
	            	var tempParam = "",
	            	       result = true;
	            	tempParam = param.filter(function(ele){
						return ele.ROW_CHK === true;
					});
	            	if(tempParam.length < 1){
	            		alert("등록 하실 행을 선택해 주세요");
						return false;
	            	}
	            	switch(btnCase){
	            		case '001' : {
	            			var i = 0;
	            			for(i; i< tempParam.length; i+=1){
	            				if(tempParam[i].CD_ORDSTAT > '002'){
	    	            			alert('주문상태가 신규주문, 상품준비중 일때 가능 합니다.');
	    	            			result = false;
	        						return;
	    	            		}
	            			};
	            			break;
	            		}
	            		case '002' : {
	            			var i = 0;
	            			for(i; i< tempParam.length; i+=1){
	            				if(tempParam[i].CD_ORDSTAT !== '003'){
	    	            			alert('주문상태가 배송준비 일때 가능 합니다.');
	    	            			result = false;
	        						return;
	    	            		}
	    	            		if(!tempParam[i].CD_PARS){
	    	            			alert('택배사를 입력해 주세요.');
	    	            			result = false;
	        						return;
	    	            		}
	    	            		if(!tempParam[i].NO_INVO){
	    	            			alert('송장 번호를 입력해 주세요.');
	    	            			result = false;
	        						return;
	    	            		}
	            			};
	            			break;
	            		}
	            		case '003' : {
	            			var i = 0;
	            			for(i; i< tempParam.length; i+=1){
	            				if(tempParam[i].CD_ORDSTAT !== '004'){
	    	            			alert('주문상태가 배송중 일때 가능 합니다.');
	    	            			result = false;
	        						return;
	    	            		}
	    	            		if(!tempParam[i].CD_PARS){
	    	            			alert('택배사를 입력해 주세요.');
	    	            			result = false;
	        						return;
	    	            		}
	    	            		if(!tempParam[i].NO_INVO){
	    	            			alert('송장 번호를 입력해 주세요.');
	    	            			result = false;
	        						return;
	    	            		}
	    	            		if(!tempParam[i].NO_APVL){
	    	            			alert('마켓 결제번호가 있는 주문만 전송 가능합니다.');
	    	            			result = false;
	        						return;
	    	            		}
	    	            		if(tempParam[i].INVO_YN === tempParam[i].NO_ORD){
	    	            			alert('이미 전송 주문이 있습니다.');
	    	            			result = false;
	    	            			return;
	    	            		}
	            			};
	            			break;
	            		} 	
	            		default : {
	            			break;
	            		}
	            	}	  
	            	return result;
	            };	            
	            
	            // 택배사 객체 필터링
	            var filteringShpbox = function(inputc){
	            	var changDbbox = "";
	            	changDbbox = shpbyordDataVO.shipCodeTotal.filter(function(element){
						return (element.NO_MRK === inputc);
					});	 
	            	return changDbbox;
	            };
	            
	            //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
	                var element = $(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.shpbyordkg,
	                	dataItem = grid.dataItem(row);    	               
	                	                
	                dataItem.ROW_CHK = checked;
	                dataItem.dirty = true;
	                
	                if(checked){
	                	row.addClass("k-state-selected");
	                }else{
	                	row.removeClass("k-state-selected");
	                };
                };   
	            	            
		        //검색 그리드
	            var grdShpbyordVO = $scope.grdShpbyordVO = {
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
                    noRecords: true,                   
                    collapse: function(e) {
                        this.cancelRow();
                    },       
                    editable: true,
                	scrollable: true,
                	resizable: true,
                	//rowTemplate: kendo.template($.trim($("#shpbyord-template").html())),
                	height: 616,
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#shpbyord-toolbar-template").html()))}],
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				/*var param = {	  
                				    NM_MRKITEM : shpbyordDataVO.procName.value,
            					    NO_MRK : shpbyordDataVO.ordMrkNameMo, 
            					    CD_ORDSTAT : shpbyordDataVO.ordStatusMo,
            					    NO_MRKORD : shpbyordDataVO.orderNo.value,      
            					    NM_PCHR : shpbyordDataVO.buyerName.value,
            					    DTS_CHK : shpbyordDataVO.betweenDateOptionMo,  
            					    DTS_FROM : new Date(shpbyordDataVO.datesetting.period.start.y, shpbyordDataVO.datesetting.period.start.m-1, shpbyordDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
            					    DTS_TO : new Date(shpbyordDataVO.datesetting.period.end.y, shpbyordDataVO.datesetting.period.end.m-1, shpbyordDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
                                };   
                				if(Util03saSvc.readValidation(param)){
                					saShpStdbyOrdSvc.shpbyordList(param).then(function (res) {
                						shpbyordDataVO.shipCodeTotal = res.data.shpList;
                						e.success(res.data.searchList);	                    					                   				                    					
                        			});
                				}else{
                					e.error();
                				};*/
                				saShpStdbyOrdSvc.shpbyordList(shpbyordDataVO.param).then(function (res) {
            						shpbyordDataVO.shipCodeTotal = res.data.shpList;
            						e.success(res.data.searchList);	                    					                   				                    					
                    			});
                			},
                			update: function(e){
                				switch(shpbyordDataVO.updateChange){
                					case '001' : {
                						if(confirm("송장정보를 출력 하시겠습니까?")){
                        					var defer = $q.defer(),
        	                			 	    param = e.data.models.filter(function(ele){
        	                			 	    	return ele.ROW_CHK === true;
        	                			 	    });                        					
                        					if(!updateValidation(param, shpbyordDataVO.updateChange)){
                        						return;
                        					}	                					                          					
                        					saShpStdbyOrdSvc.noout(param).then(function (res) {
        		                				defer.resolve(); 
        		                				e.success(res.data.results);
        		                				//shpbyordDataVO.ordStatusMo = (shpbyordDataVO.ordStatusMo === '*') ? shpbyordDataVO.ordStatusMo : shpbyordDataVO.ordStatusMo + "^003";
        		                				$scope.shpbyordkg.dataSource.read();
        		                			});
        		                			return defer.promise;
                    	            	}	
                						break;
                					}
                					case '002' : {
                						if(confirm("배송정보를 등록 하시겠습니까?")){
                        					var defer = $q.defer(),
        	                			 	    param = e.data.models.filter(function(ele){
        	                			 	    	return ele.ROW_CHK === true;
        	                			 	    });                        					
                        					if(!updateValidation(param, shpbyordDataVO.updateChange)){
                        						return;
                        					}	                					                          					
                        					saShpStdbyOrdSvc.shpInReg(param).then(function (res) {
        		                				defer.resolve(); 
        		                				e.success(res.data.results);
        		                				//shpbyordDataVO.ordStatusMo = (shpbyordDataVO.ordStatusMo === '*') ? shpbyordDataVO.ordStatusMo : shpbyordDataVO.ordStatusMo + "^004";
        		                				$scope.shpbyordkg.dataSource.read();
        		                			});
        		                			return defer.promise;
                						}  
                						break;
                					}
                					case '003' : {
                						if(confirm("배송정보를 전송 하시겠습니까?")){
                        					var defer = $q.defer(),
        	                			 	    param = e.data.models.filter(function(ele){
        	                			 	    	return ele.ROW_CHK === true;
        	                			 	    });                        					
                        					if(!updateValidation(param, shpbyordDataVO.updateChange)){
                        						return;
                        					}	                					                          					
                        					saShpStdbyOrdSvc.shpinsend(param).then(function (res) {
        		                				defer.resolve(); 
        		                				e.success(res.data.results);
        		                				//shpbyordDataVO.ordStatusMo = (shpbyordDataVO.ordStatusMo === '*') ? shpbyordDataVO.ordStatusMo : shpbyordDataVO.ordStatusMo + "^004";
        		                				$scope.shpbyordkg.dataSource.read();
        		                			});
        		                			return defer.promise;
                						}
                						break;
                					}
                					default : {
                						break;
                					}
                				}                				
                				              					
                			},                			
                			parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
                		},
                		change: function(e){
                			var data = this.data();
                			shpbyordDataVO.dataTotal = data.length;
                			angular.element($("#grd_chk_master")).prop("checked",false);
                		},
                		/*pageSize: 6,*/
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
								    NO_ORD:	   	   	   {	
                											type: "string", 
                											editable: false,
            												nullable: false
        											   },                    					
								    NO_APVL:		   {	
                											type: "string", 
                											editable: false, 
                											nullable: false
                									   },
                			        NM_MRK: 	   	   {	
															type: "string", 
															editable: false,
															nullable: false
                    						    	   },
						    	    NO_MRKORD: 	   	   {
															type: "string", 
															editable: false, 
															nullable: false
						    	    				   },
						    	    NO_MRK: 	   	   {
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
								    NM_MRKITEM:	   	   {	
			    									    	type: "string", 
								    						editable: false,
								    						nullable: false
								    				   },
								    NM_MRKOPT:	   	   {	
				       										type: "string", 
				       										editable: false,
															nullable: false
				   									   },
				   					AM_ORDSALEPRC: 	   {	
                   											type: "number", 
                											editable: false,
                											nullable: false
                									   },                    					
                					AM_PCHSPRC: 	   {
                											type: "number",
                    										editable: false, 
                    										nullable: false //true 일때 defaultValue가 안 됨	                    										
                									   },
                					NM_PCHR: 	       {
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
                				    NO_CONSHDPH: 	   {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },
                				    DC_PCHREMI: 	   {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },	
                				    NO_CONSPOST:	   {
					                				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },				   
                				    DC_CONSNEWADDR:    {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },	
                				    DC_PCHRREQCTT: 	   {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },	
                				    DC_CONSOLDADDR:    { 	
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
                				    QT_ORD:			   {
					                				    	type: "number",
															editable: false, 
															nullable: false	
                				    				   },
                				    DTS_APVL: 	   	   {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },	
                				    DTS_ORD: 	   	   {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },
                				    YN_CONN: 	   	   {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },	
                				    DTS_ORDDTRM: 	   {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },    
			    				    INVO_YN: 	   	   {
					                				    	type: "string", 
															editable: false, 
															nullable: false
							    				   	   },     
                				    CD_PARS: 	   	   {
					                				    	type: "array",
															editable: true,
															nullable: false/*,
															validation: {
																cd_parsvalidation: function (input) {
					  									    		if (input.is("[name='CD_PARS']")) {
			                                                        	input.attr("data-cd_parsvalidation-msg", "택배사를 입력해 주세요.");
			                                                            return false;
			                                                        }
				                                                  return true;
				  									    	  	}
															}*/
								    				   },                				    
			    				    NO_INVO: 	       {
					                				    	type: "string", 
															editable: true,
															nullable: false,
															validation: {
																no_invovalidation: function (input) {
					  									    		if (input.is("[name='NO_INVO']") && input.val().length > 100) {
			                                                        	input.attr("data-no_invovalidation-msg", "송장번호를 100자 이내로 입력해 주세요.");
			                                                            return false;
			                                                        }
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
			                        title: "<input class='ROW_CHK k-checkbox' type='checkbox' id='grd_chk_master' ng-click='onOrdGrdCkboxAllClick($event)'><label class='k-checkbox-label k-no-text' for='grd_chk_master' style='margin-bottom:0;'>​</label>",				                        
			                        width: 50,
			                        template: "<input class='k-checkbox' data-role='checkbox' type='checkbox' ng-click='onOrdGrdCkboxClick($event)' id='#= uid #_alt'><label class='k-checkbox-label k-no-text' for='#= uid #_alt'></label>",
			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}			                          
                	            },                        
		                        {	
                	            	field: "NO_ORD",
		                            title: "관리번호",
		                            width: 100,
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        },
		                        {
		                        	field: "NM_MRK",	
		                            title: "마켓명",
		                            width: 100,
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                        },
	                           	{
	                                field: "NO_APVL",
	                                title: "결제번호",
	                                width: 100,
			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}		                                       		
	                            },		                        
                               	{
                                    field: "NO_MRKORD",
                                    title: "주문번호",
                                    width: 100,
			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
                                },                   
		                        {
		                        	field: "NO_MRKITEM",
		                            title: "마켓상품번호",
		                            width: 100,
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        },
		                        {
		                        	field: "NM_MRKITEM",
		                            title: "상품명 / 옵션(상품구성) / 주문수량",
		                            width: 100,
		                            template: function(e){
	                                   	return e.NM_MRKOPT == true ? e.NM_MRKITEM + " / ("+e.NM_MRKOPT+") / (" + e.QT_ORD+ ")" : e.NM_MRKITEM + " / "+e.QT_ORD+" 개";                                   	
                                    },
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        },
                               	{
                                    field: "DTS_ORD",
                                    title: "주문일시",
                                    width: 110,
			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
                                },    
                                {
		                        	field: "CD_PARS",
		                            title: "<code>*</code>택배사",
		                            width: 100,
		                            editor: function shipCategoryDropDownEditor(container, options) {	
		                            	var db = "";
		                            	db = filteringShpbox(options.model.NO_MRK);
		                            	$('<input name="' + options.field + '" data-bind="value: CD_PARS"/>')
		                                .appendTo(container)
		                                .kendoDropDownList({
		                                    autoBind: false,
		                                    dataTextField: "NM_PARS",
		                                    dataValueField: "CD_PARS",
		                                    optionLabel : "택배사를 선택해 주세요 ",
		                                    dataSource: db               
		                                });
		                            	
		                            	$('<span class="k-invalid-msg" data-for="CD_PARS"></span>').appendTo(container);
		                            	//options.model.defaults.CD_PARS = dbBox[0];
		                            },
		                            template: function(e){		                            	
		                            	var nmd = e.CD_PARS || false,		                            	
		                            	  dbbox = "",
		                            	  input = "";
		                            			                            	
	                            		if(nmd){        
	                            			if(!nmd.hasOwnProperty("CD_PARS")){
	                            				input = e.NO_MRK;
		                            			
			                            		dbbox = filteringShpbox(input);
			                            		
			                            		for(var i=0, leng=dbbox.length; i<leng; i++){
		                                    		if(dbbox[i].CD_PARS === nmd){
		                                    			e.CD_PARS = dbbox[i];
		                                    		};
		                                    	};
	                            			};
	                            			return e.CD_PARS.NM_PARS;
	                            		};
	                            		return "";
		                            },
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        },
                               	{
                                    field: "NO_INVO",
                                    title: "<code>*</code>송장번호",
                                    width: 100,
			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}                  
		                        },
		                        {
		                        	field: "NM_PCHR",
		                            title: "구매자 (수취인 )",
		                            width: 100,
		                            template: function(e){
	                                   	return e.NM_CONS == true ? e.NM_PCHR + +"("+e.NM_CONS+")" : e.NM_PCHR;	                                   	
                                    },
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        }, 
		                        {
		                        	field: "CD_ORDSTAT",
		                            title: "주문상태",
		                            width: 100,
		                            template: "<co04-cd-to-nm cd='#:CD_ORDSTAT#' nm-box='shpbyordDataVO.ordStatusOp'>",
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        },
                               	{
                                    field: "NO_CONSHDPH",
                                    title: "전화번호 (구매자 )",
                                    width: 100,
                                    template: function(e){
                                    	return e.NO_PCHRPHNE == true ? e.NO_CONSHDPH + +"("+e.NO_PCHRPHNE+")" : e.NO_CONSHDPH;                                    
                                    },
			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
                                }, 
                                {
                                    field: "DC_CONSNEWADDR",
                                    title: "주소1 (주소2)", 
                                    width: 100,
                                    template: function(e){
                                    	return e.DC_CONSOLDADDR == true ? e.DC_CONSNEWADDR + +"("+e.DC_CONSOLDADDR+")" : e.DC_CONSNEWADDR;	                                   
                                    },
			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
                                },  
                               	{
                                    field: "NO_MRKREGITEM",
                                    title: "상품번호",
                                    width: 90,
			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
                                },      
		                        {
		                        	field: "AM_ORDSALEPRC",	
		                            title: "판매가",
		                            width: 100,
		                            format: '{0:c}',
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        },
	                           	{
	                                field: "AM_PCHSPRC",
	                                title: "구입가",
	                                width: 100,
	                                format: '{0:c}',
			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        },                  
		                        {
		                        	field: "DC_PCHREMI",
		                            title: "이메일",
		                            width: 100,
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        },                               	                      
		                        {
		                        	field: "DC_PCHRREQCTT",
		                            title: "요청내용",
		                            width: 100,
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        }, 
                               	{
                                    field: "DC_SHPWAY",
                                    title: "배송방법",
                                    width: 100,
			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}                                
		                        },                        
		                        {
		                        	field: "DTS_ORDDTRM",
		                            title: "주문확정일시",
		                            width: 100,
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        },       
		                        {
		                        	field: "YN_CONN",
		                            title: "연동구분",
		                            width: 100,
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        },       
		                        {	// 기획서에 없어지만 내가 추가함
		                        	field: "INVO_YN",
		                            title: "전송 유무",
		                            width: 100,
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                            template: function(e){
		                            	if(e.INVO_YN === e.NO_ORD){
		                            		return "전송";
		                            	}else{
		                            		return "미전송";
		                            	}
		                            }
		                        }
                    ]                	          	
	        	};
	            
	            $scope.$on("kendoWidgetCreated", function(event, widget){
                	var grd = $scope.shpbyordkg;
                	
	                if (widget === grd){
	                	//송장출력
	                	widget.element.find(".k-grid-no-out").on("click", function(e){
	                		var chkedLeng = grd.element.find(".k-grid-content input:checked").length;
	                		
		                	if(chkedLeng < 1){
		                		alert("송장 정보를 출력 하실 주문을 선택해 주세요!");
		                		return;
		                	}
		                	shpbyordDataVO.updateChange = "001";
	                		grd.saveChanges();
	                	});
	                	
	                	//배송정보등록
	                	widget.element.find(".k-grid-delivery-info").on("click", function(e){	 
	                		var chkedLeng = grd.element.find(".k-grid-content input:checked").length;
	                		
		                	if(chkedLeng < 1){
		                		alert("배송 정보를 등록 하실 주문을 선택해 주세요!");
		                		return;
		                	}
		                	shpbyordDataVO.updateChange = "002";
	                		grd.saveChanges();
	                	});            
	                	
	                	//배송정보전송
	                	widget.element.find(".k-grid-delivery-info-send").on("click", function(e){	 
	                		var chkedLeng = grd.element.find(".k-grid-content input:checked").length;
	                		
		                	if(chkedLeng < 1){
		                		alert("배송 정보를 전송 하실 주문을 선택해 주세요!");
		                		return;
		                	}
		                	shpbyordDataVO.updateChange = "003";
	                		grd.saveChanges();
	                	});      
	                	
	                	//주문 상세 정보
	                	widget.tbody.dblclick(function(ev){
	                		var getCurrentCell = "",
	                		     getCurrentRow = "",
	                		           getData = "";
	                		
	                		getCurrentCell = $(ev.target).is("td") ? $(ev.target) : $(ev.target).parents("td");
	                		getCurrentRow = $(ev.target).parents("tr");           
	                		getData = grd.dataItem(getCurrentRow);           
	                		
	                		//택배사 수정 하다가 넘어가면 짜증 나니까 택배사및 송장번호 더블클릭은 막음
	                		if(getCurrentCell.find(".k-checkbox").length || getCurrentCell.find("[name='CD_PARS']").length || getCurrentCell.find("[name='NO_INVO']").length){
	                			return;
	                		}
	                		$state.go("app.saShpStdbyOrd", { kind: null, menu: null, noOrd : getData.NO_ORD, noMrkord: getData.NO_MRKORD, noMrk: getData.NO_MRK });
	                    });
	                }
                });            
	           
	            //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
	                var i = 0,
	                	element = $(e.currentTarget),
	                	checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.shpbyordkg,
	                	dataItem = grid.dataItem(row),
	                	allChecked = true;
	                 	                
	                dataItem.ROW_CHK = checked;
	                dataItem.dirty = checked;
	                
	                for(i; i<grid.dataSource.data().length; i+=1){
	                	if(!grid.dataSource.data()[i].ROW_CHK){
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
	                	grid = $scope.shpbyordkg,
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
	                         
            }]);                              
}());
		