(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.ShpSbOrdImp.controller : sa.ShpSbOrdImpCtrl
     * 
     */
    angular.module("sa.ShpSbOrdImp.controller")
        .controller("sa.ShpSbOrdImpCtrl", ["$scope", "$cookieStore", "$http", "$q", "$log", "$state", "sa.ShpSbOrdImpSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc",  "Util03saSvc", "APP_CONFIG",  
            function ($scope, $cookieStore, $http, $q, $log, $state, saShpSbOrdImpSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util03saSvc, APP_CONFIG) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            menuId = MenuSvc.getNO_M($state.current.name);
	            
	          //파일업로드 후 그리드에 표시   	
	        	$scope.onComplete = function() {
	        		saShpSbOrdImpSvc.excelImport().then(function (resData) {
	    				$scope.shpbyordkg.dataSource.data(resData.data.results[0]);
	                });
	            };
	            //주문상태 드랍 박스 실행	
	           var orderStatus = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00048",
    					lcdcls: "SA_000007",
    					mid: menuId
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					shpbyordDataVO.ordStatusOp = res.data;
        				}
        			});		
	            }());
	           
		            var shpbyordDataVO = $scope.shpbyordDataVO = {
		        		cancelCodeOp : {
	    					dataSource: [],
	    					dataTextField: "NM_DEF",
	                        dataValueField: "CD_DEF",
	                    	valuePrimitive: true
	    				},    				
		        		shipCodeTotal : resData.parsDataSource,
		        		ordStatusOp : [],
		        		url : APP_CONFIG.domain
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
		            
		            shpbyordDataVO.excelExecute = function () {
		            	var grid = $scope.shpbyordkg,
	                		dataItem = grid._data;
		            	
		            	if(dataItem == "undefined" || dataItem == null || dataItem == ""){
		            		alert("그리드에 데이터가 없습니다");
		            		return false;
		            	}
		            	
		            	angular.forEach(dataItem, function (dataItem) {  // 택배사, 송장번호 없는것 거름
	                		if(dataItem.CD_PARS == "" || jQuery.type(dataItem.CD_PARS) === "string"){
	                			var temp = new Object();
	                			temp.CD_PARS = "";
	                			dataItem.CD_PARS = temp;
	                		}
	                    });
		            	
		            	saShpSbOrdImpSvc.excelExecute(dataItem).then(function (resData) {
		    				$scope.shpbyordkg.dataSource.data(resData.data.failList);
		    				alert("요청하신 총 "+resData.data.totalCnt+"건 중 "+resData.data.successCnt+"건 등록완료");
		                });
		            }; 
		            
		            // 택배사 객체 필터링
		            var filteringShpbox = function(inputc){
		            	var changDbbox = "";
		            	changDbbox = shpbyordDataVO.shipCodeTotal.filter(function(element){
							return (element.NO_MRK === inputc);
						});
		            	return changDbbox;
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
	                    collapse: function(e) {
	                        this.cancelRow();
	                    },
	                	resizable: true,
	                    editable: true,
	                	scrollable: true,
	                	sortable: true,
	                	height: 828,
	                	navigatable: true, //키보드로 그리드 셀 이동 가능
	                	toolbar: [{template: kendo.template($.trim($("#shpbyord-toolbar-template").html()))}],
	                	excel: {
	                		fileName: "배송대기.xlsx"
	                	},
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	                			},
	                			update: function(e){				
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
	                					RS_ERR:	   	   	   {	
																type: "string", 
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
							    	    NO_MRKITEMORD: 	   {
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
																nullable: false,
																validation: {
																	cd_parsvalidation: function (input) {
						  									    		if (input.is("[name='CD_PARS']") && input.val() == "") {
				                                                        	input.attr("data-cd_parsvalidation-msg", "택배사를 입력해 주세요.");
				                                                            return false;
				                                                        }
					                                                  return true;
					  									    	  	}
																}
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
	                	            	field: "RS_ERR",
			                            title: "실패사유",
			                            width: 100,
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
			                            title: "<span class='form-required'>* </span>택배사",
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
	                                    title: "<span class='form-required'>* </span>송장번호",
	                                    width: 150,
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
	                    ]                	          	
		        	};
	                           
		                         
	            }]);                              
}());
		