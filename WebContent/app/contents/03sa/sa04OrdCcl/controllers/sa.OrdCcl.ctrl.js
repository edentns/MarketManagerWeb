(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.OrdCcl.controller : sa.OrdCclCtrl
     * 상품분류관리
     */
    angular.module("sa.OrdCcl.controller")
        .controller("sa.OrdCclCtrl", ["$scope", "$http", "$q", "$log", "sa.OrdCclSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc",
            function ($scope, $http, $q, $log, saOrdCclSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            kendo.culture('ko-KR');// 이거 해야지 원화로 나옴
	            
	            //마켓명 드랍 박스 실행	
	            var mrkName = (function(){
        			UtilSvc.csMrkList().then(function (res) {
        				if(res.data.length >= 1){
        					ordCancelManagementDataVO.ordMrkNameOp = res.data;
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
        					ordCancelManagementDataVO.ordStatusOp = res.data;
        				}
        			});		
	            }());
	            
	            //기간 상태 드랍 박스 실행	
	            var betweenDate = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00072",
    					lcdcls: "SA_000028"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					ordCancelManagementDataVO.betweenDateOptionOp = res.data;
        					ordCancelManagementDataVO.betweenDateOptionMo = res.data[0].CD_DEF; //처음 로딩 때 초기 인덱스를 위하여
        				}
        			});		
	            }());
	            
	            //취소 사유 코드 드랍 박스 실행	
	            var cancelReasonCode = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00056",
    					lcdcls: "SA_000015"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					ordCancelManagementDataVO.cancelCodeOp.dataSource = res.data;
        				}
        			});
	            }());
	            
	            //취소 커부 코드 드랍 박스 실행	
	            var cancelRejectCode = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00063",
    					lcdcls: "SA_000022"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					ordCancelManagementDataVO.cancelRejectCodeOp.dataSource = res.data;
        				}
        			});
	            }());
	            
	            //취소 상태 코드 드랍 박스 실행	
	            var cancelReasonCode = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00057",
    					lcdcls: "SA_000016"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					ordCancelManagementDataVO.cancelStatusOp = res.data;
        				}
        			});
	            }());
	            
	            var ordCancelManagementDataVO = $scope.ordCancelManagementDataVO = {
	            		boxTitle : "주문취소관리",
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
		        		orderNo: { value: "" , focus: false },
		        		buyerName : { value: "" , focus: false },
		        		
		        		ordMrkNameOp : [],
		        		ordMrkNameMo : "*",
		        		ordStatusOp : [],
		        		ordStatusMo : "*",
		        		betweenDateOptionOp : [],
		        		betweenDateOptionMo : "",
		        		cancelStatusOp : [],
		        		cancelStatusMo : "",
		        		cancelCodeOp : {
	    					dataSource: [],
	    					dataTextField: "NM_DEF",
	                        dataValueField: "CD_DEF",
	                        optionLabel : "주문취소코드를 선택해 주세요 ",
	                        enable: false,
	                    	valuePrimitive: true,
	    				},    
	    				cancelRejectCodeOp : {
	    					dataSource: [],
	    					dataTextField: "NM_DEF",
	                        dataValueField: "CD_DEF",
	                        optionLabel : "취소거부코드를 선택해 주세요 ",
	                    	valuePrimitive: true,
	    				}, 
		        		cancelCodeMo : "",
		        		shipCodeTotal : "",
		        		dataTotal : 0,
		        		resetAtGrd :""
		        };
	            
	            //조회
	            ordCancelManagementDataVO.inQuiry = function(){
	            	//var me = this;
	            	$scope.ordCancelManagementkg.dataSource.page(1);
	            	$scope.ordCancelManagementkg.dataSource.read();
	            };	
	            
	            //초기화버튼
	            ordCancelManagementDataVO.inIt = function(){	
            		var me  = this;
                	
	            	me.procName.value = "";
                	me.orderNo.value = "";
                	me.buyerName.value = "";
                	
                	me.betweenDateOptionMo = me.betweenDateOptionOp[0].CD_DEF;
                	               			        	
                	$timeout(function(){
                		angular.element(".frm-group").find("button:eq(0)").triggerHandler("click");
                		angular.element(".frm-group").find("button:eq(2)").triggerHandler("click");
                	},0);                	
                	        			
                	me.ordStatusOp.bReset = true;
                	me.ordMrkNameOp.bReset = true;  
		        	                	                	
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.ordCancelManagementkg;
                	me.resetAtGrd.dataSource.data([]);	            		            	
	            };	

	            ordCancelManagementDataVO.isOpen = function (val) {
	            	if(val) {
	            		$scope.ordCancelManagementkg.wrapper.height(552);
	            		$scope.ordCancelManagementkg.resize();
	            		grdOrdCancelManagementVO.dataSource.pageSize(7);
	            	}
	            	else {
	            		$scope.ordCancelManagementkg.wrapper.height(798);
	            		$scope.ordCancelManagementkg.resize();
	            		grdOrdCancelManagementVO.dataSource.pageSize(12);
	            	}
	            };
	            
	            //조회 유효성 검증
	            $scope.readValidation = function(idx){       	
            		if(idx.NM_MRK === null || idx.NM_MRK === ""){ alert("마켓명을 입력해 주세요."); return false; };
            		if(idx.CD_ORDSTAT === null || idx.CD_ORDSTAT === ""){ alert("주문상태를 입력해 주세요."); return false;};
            		if(idx.DTS_CHK === null || idx.DTS_CHK === ""){ alert("기간을 선택해 주세요."); return false;};		
            		if(idx.CD_CCLSTAT === null || idx.CD_CCLSTAT === ""){ alert("취소상태를 선택해 주세요."); return false;};
	            	return true;
	            };
	            	            
	            //주문 검색 그리드
	            var grdOrdCancelManagementVO = $scope.grdOrdCancelManagementVO = {
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
                	/*sortable: true,   윗 컬럼으로 소트가 되지 않아서 빼버림    
            	    columnMenu: {
            		    sortable: false
            		},*/
                    pageable: {
                    	messages: UtilSvc.gridPageableMessages
                    },
                    noRecords: true,
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				var param = {	  
                				    NM_MRKITEM : ordCancelManagementDataVO.procName.value,
            					    NM_MRK : ordCancelManagementDataVO.ordMrkNameMo, 
            					    CD_ORDSTAT : ordCancelManagementDataVO.ordStatusMo,
            					    NO_MRKORD : ordCancelManagementDataVO.orderNo.value,      
            					    NM_CONS : ordCancelManagementDataVO.buyerName.value,
            					    CD_CCLSTAT : ordCancelManagementDataVO.cancelStatusMo,
            					    DTS_CHK : ordCancelManagementDataVO.betweenDateOptionMo,  
            					    DTS_FROM : new Date(ordCancelManagementDataVO.datesetting.period.start.y, ordCancelManagementDataVO.datesetting.period.start.m-1, ordCancelManagementDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
            					    DTS_TO : new Date(ordCancelManagementDataVO.datesetting.period.end.y, ordCancelManagementDataVO.datesetting.period.end.m-1, ordCancelManagementDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
                                }; 
                				if($scope.readValidation(param)){
                					saOrdCclSvc.ocmList(param).then(function (res) {
                    					e.success(res.data);
                        			});
                				}else{
                					e.error();
                				};
                			},
                			update: function(e){
        						if(confirm("취소거부 하시겠습니까?")){                					
                					var defer = $q.defer(),
                					param = e.data.models.filter(function(ele){
	                			 		return ele.ROW_CHK === true;
	                			 	});
                				
                					if(param.length > 1){
                						alert("한 건의 주문만 선택할 수 있습니다.");
                						return false;
                					};                					
                        			if(param.CD_CCLSTAT !== "001"){
                        				alert("취소요청 된 주문만 취소거부 처리 할 수 있습니다.");
                        				return false;
                        			};           					
                					saOrdCclSvc.ocmReject(param).then(function (res) {
		                				defer.resolve(); 
		                				e.success(res.data.results);
		                				ordCancelManagementDataVO.cancelStatusMo = ordCancelManagementDataVO.cancelStatusMo + "^003";
		                				$scope.ordCancelManagementkg.dataSource.read();
		                			});
		                			return defer.promise;
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
                			ordCancelManagementDataVO.dataTotal = data.length;
                		},
                		pageSize: 7,
                		batch: true,
                		schema: {
                			model: {
                    			id: "NO_ORD",
                				fields: {						                    
                					ROW_CHK: 		   {	
				                    						type: "boolean", 
															editable: true,  
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
			        										defaultValue: "",
			        										nullable: false //true 일때 defaultValue가 안 됨
						    	    				   },
	    	    				   	NO_MRKREGITEM: 	   {
                											type: "string",                     										
                											editable: false,
                    										nullable: false
                									   },                    									   
								    NM_MRKITEM:	   	   {	
			    									    	type: "string", 
								    						editable: true,
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
                					QT_ORD: 	   	   {
                											type: "string",
                    										editable: false, 
                    										nullable: false //true 일때 defaultValue가 안 됨	                    										
                									   },
                					NM_PCHR: 	       {
                    										type: "string",
                    										editable: true,
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
                				    QT_CCL: 	       {
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
                				    DC_CCLCTT:    	   { 	
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
                				    DTS_APVL: 	   	   {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },	
                				    DC_APVLWAY: 	   {
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
                				    NO_UPDATE: 	       {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },  	
                				    DTS_CCLREQ: 	   {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },                  
                				    DTS_CCLAPPRRJT:    {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },
                				    CD_CCLSTAT:		   {
					                				    	type: "string", 
															editable: false,
															nullable: false
								    				   },		
                				    CD_CCLRSN: 	       {
				                    				    	type: "string", 
															editable: false,
															nullable: false
                				    				   },
                				    DC_CCLRSNCTT: 	   {
					                				    	type: "string", 
															editable: false,
															nullable: false
                				    				   },	
                				    CD_CCLRJT: 	       {
				                    				    	type: "string", 
															editable: true,
															validation: {
																cd_cclrjtvalidation: function (input) {
					  									    		if (input.is("[name='CD_CCLRJT']") && input.val() === "") {
			                                                        	input.attr("data-cd_cclrjtvalidation-msg", "취소거부코드를 입력해 주세요.");
			                                                            return false;
			                                                        }
				                                                  return true;
				  									    	  	}
															}, 
															nullable: false
               				    				   		},
               				        DC_CCLRJTCTT: 	    {
				                    				    	type: "string",
															editable: true,
															validation: {
																dc_cclrjtcttvalidation: function (input) {
					  									    		if (input.is("[name='DC_CCLRJTCTT']") && input.val() === "") {
			                                                        	input.attr("data-dc_cclrjtcttvalidation-msg", "취소거부사유를 입력해 주세요.");
			                                                            return false;
			                                                        }
					  									    		if(input.is("[name='DC_CCLRJTCTT']") && input.val().length > 1000){
					  									    			input.attr("data-dc_cclrjtcttvalidation-msg", "취소거부사유룰 1000자 이내로 입력해 주세요.");
			                                                            return false;
					  									    		}
				                                                  return true;
				  									    	  	}
															}, 
															nullable: false
               				    				         },
               				    	ITF_CHK: 		  	{
               				    							type: "string",
               				    							editable: false,
               				    							nullable: true
               				    						}
                				}
                			}
                		},
                	}),
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#ocm-toolbar-template").html()))}],
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
		                        	field: "QT_ORD",	
		                            title: "판매수량",
		                            width: 100,		                            
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                            columns: [ 
		                                       	{
				                                    field: "QT_CCL",
				                                    title: "취소수량",
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
				                                    field: "DC_APVLWAY",
				                                    title: "결제방법",
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
				                                    field: "NM_CONS",
				                                    title: "수취인",
				                                    width: 100,
							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
				                                }
			                                ]
		                        } ,                        
		                        {
		                        	field: "CD_CCLRSN",
		                            title: "취소사유",
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
				                                    field: "DTS_CCLREQ",
				                                    title: "취소일시",
				                                    width: 100,
							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
				                                }
			                                ]
		                        },                        
		                        {
		                        	field: "DTS_CCLAPPRRJT",
		                            title: "취소 확인일시",
		                            width: 100,
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                            columns: [
		                                       	{
				                                    field: "NO_UPDATE",
				                                    title: "접수확인자",
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
		                            columns: [
		                                       	{
				                                    field: "CD_CCLSTAT",
				                                    title: "취소상태",
				                                    width: 100,
							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
				                                }
			                                ]
		                        }
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
                	        title: ""
                	    },
                		template: kendo.template($.trim($("#ocm_popup_template").html())),
                		confirmation: false
                	},
                	edit: function(e){                	
                		//그리드에서는 그리드 모델과 연결되어 있어서  처음에  selected 되는 값이 null로 되어 강제로 불러와서 셀렉팅을 해줌                		
                		/*var ddl = $("select[name=CD_CCLRJT]").data("kendoDropDownList"),
                			 ta = $("input[name=DC_CCLRJTCTT]");
                		if(ddl.CD_DEF !== "001"){
                			ddl.enable = false;
                			ta.attr("disabled","disabled");
                		}      */        		
                	},
                	resizable: true,
                	rowTemplate: kendo.template($.trim($("#ocm_template").html())),
                	altRowTemplate: kendo.template($.trim($("#ocm_alt_template").html())),
                	height: 552                  	
	        	};
	            
	            //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
	                var element =$(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.ordCancelManagementkg,
	                	dataItem = grid.dataItem(row);
	                 	                
	                dataItem.ROW_CHK = checked;
	                dataItem.dirty = checked;
	                
	                if(checked){
	                	row.addClass("k-state-selected");
	                }else{
	                	row.removeClass("k-state-selected");
	                };
                };                                
                
                $scope.$on("kendoWidgetCreated", function(event, widget){
                	var grd = $scope.ordCancelManagementkg;
                	
	                if (widget === grd){ 
	                	//주문취소 팝업 가져오기
	                	widget.element.find(".k-grid-edit").on("click", function(e){
	                		var	chked = grd.element.find("input:checked"),
		            			chkedLeng = grd.element.find("input:checked").length;
	                    		                    
		                    if(chkedLeng === 1){
		                		grd.editRow(chked.closest('tr'));
		                	}else{
		                		alert("한 건의 주문을 선택해 주세요");
		                	}
	                	});                	
	                	
	                	//취소 승인, 취소결과 전송
	                	widget.element.find(".k-grid-cclinfo").on("click", function(e){
	                		e.preventDefault();
	                		
	                		var	chkedLeng = grd.element.find("input:checked").length,
	            				    param = "",
	            				 hasClass = $(this);			
	                		
	                		if(chkedLeng === 1){      			
		                		if(hasClass.hasClass("ccl-confirm")){
		                			param = grd.dataSource.data().filter(function(ele){
			                			return ele.ROW_CHK === true && ele.CD_CCLSTAT === "001";
			                		});		                			
		                			if(param.length !== chkedLeng){
		                				alert("취소요청 된 주문만 취소승인 처리 할 수 있습니다.");	
		                				return;
		                			}		                			
		                			//if(confirm("총 "+param.length+"건의 주문을 취소 승인 하시겠습니까?")){
		                			if(confirm("주문을 취소 승인 하시겠습니까?")){
		                				var defer = $q.defer();		
		                				saOrdCclSvc.orderCancel(param).then(function (res) {
			                				defer.resolve(); 
			                				$scope.ordCancelManagementkg.dataSource.read();
			                			});			                			
			                			return defer.promise;
			                		}
		                			return false;
		                		}
		                		
		                		if(hasClass.hasClass("ccl-send")){
		                			param = grd.dataSource.data().filter(function(ele){
			                			return (ele.ROW_CHK === true && ele.ITF_CHK === 'N' &&(ele.CD_CCLSTAT === "002" || ele.CD_CCLSTAT === "003" || ele.CD_CCLSTAT === "004"));
			                		});		                			
		                			if(param.length !== chkedLeng){
		                				alert("취소처리가 완료되지 않았거나 이미 전송되었습니다.");	
		                				return;
		                			};	
		                			//if(confirm("총 "+param.length+"건의 취소결과를 전송 하시겠습니까?")){
		                			if(confirm("취소결과를 전송 하시겠습니까?")){
		                        		var defer = $q.defer();		                						                				
			                			
		                        		saOrdCclSvc.ocmSend(param).then(function (res) {
		                					defer.resolve(); 
		                					/*$timeout(function(){
		                						$scope.ordCancelManagementkg.dataSource.read();	  
		            						}, 0);*/
		                					$scope.ordCancelManagementkg.dataSource.read();
		                    			});
			                			
			                			return defer.promise;
			                		}
		                			return false;
		                		}  
		                	}else{
		                		alert("주문을 한 건만 선택하세요.");
		                	};
	                	});
	                	
	                	//취소정보 가져오기
	                	widget.element.find(".k-grid-openccl").on("click", function(e){
	                		e.preventDefault();
	                		                		       
	                		alert("취소정보 가져오기는 [공사중]입니다.");
	                	});
	                }
                });
                
            }]);    
}());