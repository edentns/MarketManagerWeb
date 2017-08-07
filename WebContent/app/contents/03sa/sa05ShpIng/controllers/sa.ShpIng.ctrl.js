(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.ShpIng.controller : sa.ShpIngCtrl
     * 상품분류관리
     */
    angular.module("sa.ShpIng.controller")
        .controller("sa.ShpIngCtrl", ["$scope", "$http", "$q", "$log", "sa.ShpIngSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "sa.OrdCclSvc",
            function ($scope, $http, $q, $log, saShpIngSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, saOrdCclSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
            	kendo.culture('ko-KR');// 이거 해야지 원화로 나옴
	            
	            //마켓명 드랍 박스 실행	
	            var mrkName = (function(){
        			UtilSvc.csMrkList().then(function (res) {
        				if(res.data.length >= 1){
        					shippingDataVO.ordMrkNameOp = res.data;
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
        					shippingDataVO.ordStatusOp = res.data;
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
        					shippingDataVO.betweenDateOptionOp = res.data;
        					shippingDataVO.betweenDateOptionMo = res.data[0].CD_DEF; //처음 로딩 때 초기 인덱스를 위하여
        				}
        			});
	            }());	
	            
	            //배송 상태 디렉시브	
	            var shipStatus = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00060",
    					lcdcls: "SA_000019"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					shippingDataVO.shipStatusOp = res.data;
        				}
        			});
	            }());
	            
	            //주문 취소 코드 드랍 박스
	            var cancelCodeOp = new kendo.data.DataSource({
                    transport: {
                        read: function(e) {
                        		var param = {
                					lnomngcdhd: "SYCH00056",
                					lcdcls: "SA_000015"
                				};
                    			UtilSvc.getCommonCodeList(param).then(function (res) {
                    				if(res.data.length >= 1){
                    					e.success(res.data);
                    				}else{
                    					e.error();
                    				}
                    			});	
                        }
                    }
	            });

	            //배송 지연 코드 드랍 박스
	            var delayCodeOp = new kendo.data.DataSource({
                    transport: {
                        read: function(e) {
                        		var param = {
                					lnomngcdhd: "SYCH00062",
                					lcdcls: "SA_000021"
                				};
                    			UtilSvc.getCommonCodeList(param).then(function (res) {
                    				if(res.data.length >= 1){
                    					e.success(res.data);
                    				}else{
                    					e.error();
                    				}
                    			});	
                        }
                    }
		        });
	            	            	            
	            var shippingDataVO = $scope.shippingDataVO = {
            		boxTitle : "배송중",
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
	        		updateChange : "",
	        		dataTotal : 0,
	        		resetAtGrd :"",
	        		delayCodeOp: {
	        			dataSource: delayCodeOp,
	        			dataTextField:"NM_DEF",
	                    dataValueField:"CD_DEF",
	                    valuePrimitive: true
	        		},
	        		cancelCodeOp:{
	        			dataSource: cancelCodeOp,
	        			dataTextField:"NM_DEF",
	                    dataValueField:"CD_DEF",
	                    valuePrimitive: true
	        		}
	            };   
	            
	            //조회
	            shippingDataVO.inQuiry = function(){
	            	//var me = this;
	            	$scope.shippingkg.dataSource.page(1);  // 페이지 인덱스 초기화              
	            	$scope.shippingkg.dataSource.read();
	            };
	            
	            //초기화버튼
	            shippingDataVO.inIt = function(){      	
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
                			        	
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.shippingkg;
                	me.resetAtGrd.dataSource.data([]);
	            };	
	            
	            //popup insert & update Validation
	            $scope.readValidation = function(idx){
	            	var result = true;
            		if(idx.NM_MRK === null || idx.NM_MRK === ""){ alert("마켓명을 입력해 주세요."); result = false; return; };
            		if(idx.CD_ORDSTAT === null || idx.CD_ORDSTAT === ""){ alert("주문상태를 입력해 주세요."); result = false; return;};
            		if(idx.DTS_CHK === null || idx.DTS_CHK === ""){ alert("기간을 선택해 주세요."); result = false; return;};			            
	            	return result;
	            };	 
	            	            
	            //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
	                var element = $(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.shippingkg,
	                	dataItem = grid.dataItem(row);    	               
	                	                
	                dataItem.ROW_CHK = checked;
	                dataItem.dirty = checked;
	                
	                if(checked){
	                	row.addClass("k-state-selected");
	                }else{
	                	row.removeClass("k-state-selected");
	                };
                };   
	            
                //검색 그리드
	            var grdShippngVO = $scope.grdShippngVO = {
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
                		template: kendo.template($.trim($("#shipping_popup_template").html())),
                		confirmation: false
                    },
                    edit: function(e){
                    	// ng-if가  edit보다 나오는 순서가 늦음어서 timeout 사용
                    	$timeout(function(){
                        	var ddl = (e.container.find("select[name=CD_CCLRSN]").length >= 1 ) ? e.container.find("select[name=CD_CCLRSN]").data("kendoDropDownList") : e.container.find("select[name=CD_SHPDLY]").data("kendoDropDownList"); 
                    		
                    		ddl.select(0);
                        	ddl.trigger("change");	
                    	},500);
                    },
                	scrollable: true,
                	resizable: true,
                	rowTemplate: kendo.template($.trim($("#shipping_template").html())),
                	altRowTemplate: kendo.template($.trim($("#shipping_alt_template").html())),
                	height: 550,
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#shipping_toolbar_template").html()))}],
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				var param = {
                				    NM_MRKITEM : shippingDataVO.procName.value,
            					    NO_MRK : shippingDataVO.ordMrkNameMo, 
            					    CD_ORDSTAT : shippingDataVO.ordStatusMo,
            					    NO_MRKORD : shippingDataVO.orderNo.value,      
            					    NM_PCHR : shippingDataVO.buyerName.value,
            					    DTS_CHK : shippingDataVO.betweenDateOptionMo,  
            					    DTS_FROM : new Date(shippingDataVO.datesetting.period.start.y, shippingDataVO.datesetting.period.start.m-1, shippingDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
            					    DTS_TO : new Date(shippingDataVO.datesetting.period.end.y, shippingDataVO.datesetting.period.end.m-1, shippingDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
                                };   
                				if($scope.readValidation(param)){
                					saShpIngSvc.orderList(param).then(function (res) {
	            						e.success(res.data);			                   				                    					
                					});                					
                				}else{
                					e.error();
                				};
                			},
                			update: function(e){
                				switch(shippingDataVO.updateChange){
                					case '001' : {
                						if(confirm("배송지연 사유를 저장 하시겠습니까?")){
                        					var defer = $q.defer(),
                        						whereIn = ["001","002","003","004","009"],
        	                			 	    param = e.data.models.filter(function(ele){
        	                			 	    	return ele.ROW_CHK === true && (whereIn.indexOf(ele.CD_ORDSTAT) > -1) ;
        	                			 	    }); 
                        					
                        					if(param.length !== 1){
                        						alert("배송지연을 등록할 수 있는 주문상태가 아닙니다.");
                        						return;
                        					};
                        					
                        					saShpIngSvc.delay(param[0]).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("배송지연을 등록 하였습니다.");
            	            						$scope.shippingkg.dataSource.read();
                        						}else{
                        							alert("배송지연을 등록하는데 실패 하였습니다.");
                        							e.error();
                        						}
                        					}); 
                        					
        		                			return defer.promise;
                    	            	}
                						break;
                					}
                					case '002' : {
                						if(confirm("주문 취소 사항을 저장 하시겠습니까?")){
                        					var defer = $q.defer(),
                        						whereIn = ["001","002","003","004","005"],	
                        						param = e.data.models.filter(function(ele){
        	                			 	    	return ele.ROW_CHK === true && (whereIn.indexOf(ele.CD_ORDSTAT) > -1) ;
        	                			 	    });    
                        					
                        					if(param.length !== 1){
                        						alert("취소 할 수 있는 주문상태가 아닙니다.");
                        						return;
                        					};
                        					
                        					saOrdCclSvc.orderCancel(param[0]).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							//alert("주문을 취소 하였습니다.");
                        							shippingDataVO.ordStatusMo = shippingDataVO.ordStatusMo + "^006";	
            	            						$scope.shippingkg.dataSource.read();
                        						}else{
                        							//alert("주문취소를 실패하였습니다.");
                        							e.error();
                        						}
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
                			shippingDataVO.dataTotal = data.length;
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
									AM_ORDSALEPRC: 	   {
						            						type: "number", 
															editable: false,
															nullable: false
													   },
									AM_PCHSPRC: 	   {
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
								    DTS_ORD: 	   	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    DT_SND: 	   	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    QT_ORD: 	   	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    CD_SHPSTAT: 	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },              			
									CD_PARS: 	   	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },                				    
			    				    NO_INVO: 	       {
					                				    	type: "string", 
															editable: false,
															nullable: false
								    				   },								    				   
								    CD_SHPDLY: 	   	   {
					                				    	type: "string",
															editable: true,
															nullable: false,
															validation: {
																cd_shpdlyvalidation: function (input) {
					  									    		if (input.is("[name='CD_SHPDLY']") && input.val() === "") {
			                                                        	input.attr("data-cd_shpdlyvalidation-msg", "배송지연코드를 입력해 주세요.");
			                                                            return false;
			                                                        }
				                                                  return true;
				  									    	  	}
															}
								    				   },
								    DC_SHPDLYRSN: 	   {
					                				    	type: "string",
															editable: true,
															nullable: false,
															validation: {
																dc_shpdlyrsnvalidation: function (input) {
					  									    		if (input.is("[name='DC_SHPDLYRSN']") && input.val() === "") {
			                                                        	input.attr("data-dc_shpdlyrsnvalidation-msg", "배송지연사유를 입력해 주세요.");
			                                                            return false;
			                                                        }
					  									    		if(input.is("[name='DC_SHPDLYRSN']") && input.val().length > 1000){
					  									    			input.attr("data-dc_shpdlyrsnvalidation-msg", "배송지연사유를 1000자 이내로 입력해 주세요.");
			                                                            return false;
					  									    		}
				                                                  return true;
				  									    	  	}
															},
								    				   },              			
								    CD_CCLRSN: 	   	   {
					                				    	type: "string",
															editable: true,
															nullable: false,
															validation: {
																cd_cclrsnvalidation: function (input) {
					  									    		if (input.is("[name='CD_CCLRSN']") && input.val() === "") {
			                                                        	input.attr("data-cd_cclrsnvalidation-msg", "주문취소코드를 입력해 주세요.");
			                                                            return false;
			                                                        }
				                                                  return true;
				  									    	  	}
															},
								    				   },                				    
								    DC_CCLRSNCTT: 	   {
					                				    	type: "string", 
															editable: true,
															nullable: false,
															validation: {
																dc_cclrsncttvalidation: function (input) {
					  									    		if (input.is("[name='DC_CCLRSNCTT']") && input.val() === "") {
			                                                        	input.attr("data-dc_cclrsncttvalidation-msg", "주문취소사유를 입력해 주세요.");
			                                                            return false;
			                                                        }
					  									    		if(input.is("[name='DC_CCLRSNCTT']") && input.val().length > 1000){
					  									    			input.attr("data-dc_cclrsncttvalidation-msg", "주문취소사유를 1000자 이내로 입력해 주세요.");
			                                                            return false;
					  									    		}
				                                                  return true;
				  									    	  	}
															},
								    				   }				   
                				}
                			}
                		},
                	}),                	
                	columns: [	
								{
								    field: "ROW_CHK",
								    title: "<span class='ROW_CHK'>선<br/>택</span>",					                        
								    width: "30px",
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
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
								    title: "상품명",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "NM_MRKOPT",
								                    title: "옵션(상품구성)",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "AM_ORDSALEPRC",	
								    title: "판매가",
								    width: 100,		                            
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "AM_PCHSPRC",
								                    title: "구입가",
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
								                    field: "NM_CONS",
								                    title: "수취인",
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
								                    field: "NO_CONSHDPH",
								                    title: "전화번호",
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
								                    field: "DC_CONSNEWADDR",
								                    title: "주소1",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								} ,                        
								{
									field: "DC_PCHRREQCTT",
								    title: "요청내용",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "DC_CONSOLDADDR",
								                    title: "주소2",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								} ,                        
								{
									field: "CD_ORDSTAT",
								    title: "주문상태",
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
								                    field: "DT_SND",
								                    title: "배송일시",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "CD_PARS",
								    title: "택배사",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [
								               	{
								                    field: "NO_INVO",
								                    title: "송장번호",
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
								    columns: [
								               	{
								                    field: "CD_SHPSTAT",
								                    title: "배송상태",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								}                	           
                    ]                	          	
	        	};
	            
	            $scope.$on("kendoWidgetCreated", function(event, widget){
                	var grd = $scope.shippingkg;
                	
	                if (widget === grd){
	                	//베송지연
	                	widget.element.find(".k-grid-delay").on("click", function(e){
	                		var chked = grd.element.find("input:checked");
	                		
	                		switch(chked.length){
	                			case 1 : {
	                				var dataItem = grd.dataItem(chked.closest("tr")), 
	                					 whereIn = ["001","002","003","004","009"];
	                				
	                				if(whereIn.indexOf(dataItem.CD_ORDSTAT) <= -1){
	            						alert("배송지연을 등록할 수 있는 주문상태가 아닙니다.");
	            						break;
	            					};
	                				
	                				if(dataItem.DC_SHPDLYRSN){
	                					if(confirm("이미 배송지연사유를 등록 하셨습니다. 수정하시겠습니까?!")){
	                						
	                					}else{
	                						break;
	                					}
	                				};	            					
	            					
            						shippingDataVO.updateChange = "001";
	    	                		grd.editRow(chked.closest("tr"));
	    	                		
	                				break;	
	                			}
	                			case 0 : {
	                				alert("배송지연 하실 주문을 선택해 주세요!");
	                				break;
	                			}
	                			default : {
	                				alert("배송지연 하실 주문을 1개만 선택해 주세요!");
	                				break;
	                			}	                			
	                		}
	                	});
	                	
	                	//주문취소
	                	widget.element.find(".k-grid-ocl").on("click", function(e){	 
	                		var chked = grd.element.find("input:checked");
	                		
	                		switch(chked.length){
	                			case 1 : {
	                				var dataItem = grd.dataItem(chked.closest("tr")), 
	                					 whereIn = ["006","007","008","009"];
	                				
	                				if(whereIn.indexOf(dataItem.CD_ORDSTAT) > -1){
	            						alert("취소 할  수 있는 주문상태가 아닙니다.");
	            						break;
	            					}; 					
	            					
	        						shippingDataVO.updateChange = "002";
	    	                		grd.editRow(chked.closest("tr"));
	    	                		
	                				break;	
	                			}
	                			case 0 : {
	                				alert("주문을 선택해 주세요!");
	                				break;
	                			}
	                			default : {
	                				alert("주문을 1개만 선택해 주세요!");
	                				break;
	                			}	                			
	                		}	                		
	                	});            
	                	
	                	//배송 완료 가져오기
	                	widget.element.find(".k-grid-open-finished").on("click", function(e){	 
	                		alert("배송완료 가져오기는 준비중입니다.");
	                	});   
	                }
                });  
            }]);
}());