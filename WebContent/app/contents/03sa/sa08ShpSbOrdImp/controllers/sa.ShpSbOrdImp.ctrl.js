(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.ShpSbOrdImp.controller : sa.ShpSbOrdImpCtrl
     * 
     */
    angular.module("sa.ShpSbOrdImp.controller")
        .controller("sa.ShpSbOrdImpCtrl", ["$scope", "$window", "$cookieStore", "$http", "$q", "$log", "$state", "sa.ShpSbOrdImpSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc",  "Util03saSvc", "APP_CONFIG", "$analytics",  
            function ($scope, $window, $cookieStore, $http, $q, $log, $state, saShpSbOrdImpSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util03saSvc, APP_CONFIG, $analytics) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            menuId = MenuSvc.getNO_M($state.current.name);
	            
	            //파일업로드 후 그리드에 표시   	
	        	$scope.onComplete = function() {
	        		$scope.$apply(function(){
	        			$scope.shpbyordekg.dataSource.read();
	        		});
	            };
	            
	            //주문상태 드랍 박스 실행	
	           var orderStatus = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00048",
    					lcdcls: "SA_000007",
	    				customnoc: "00000",
	    				mid: menuId
    				};
    				UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					shpbyordDataVO.ordStatusOp = res.data;
        				}
        			});		   				

    				$analytics.pageTrack('/ShpSbOrdImp');
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
	        		url : APP_CONFIG.domain,
	        		dataTotal : 0,
	        		importCnt : 30
	            };
	            
	            shpbyordDataVO.isOpen = function (val) {
	            	var searchIdHeight = $("#searchId").height();
	            	var settingHeight = $(window).height() - searchIdHeight - 90;
	            	
	            	$scope.shpbyordekg.wrapper.height(settingHeight);
            		$scope.shpbyordekg.resize();
	            };   
	            
	            shpbyordDataVO.excelExecute = function () {		
	            	var startTime = new Date(),
						dataItem = $scope.shpbyordekg._data;
	            	
	            	if(!dataItem){
						alert("그리드에 데이터가 없습니다.");
						return false;
					}
			
					if(dataItem.length > shpbyordDataVO.importCnt){
						alert(shpbyordDataVO.importCnt+"건 이상은 등록할 수 없습니다.");
						return false;
					}
					
					angular.forEach(dataItem, function(item){
						if(!item.CD_PARS || ($.type(item.CD_PARS) === "string")){
							item.CD_PARS = angular.copy({CD_PARS : ""});
						};
					});
										
	            	saShpSbOrdImpSvc.excelExecute(dataItem).then(function (resData) {
	            		var endTime = new Date(),
					    	crTime = ((endTime - startTime)/1000);
	            		
	            		//$log.info("경과시간 = "+crTime+"초");
	            		$scope.shpbyordekg.dataSource.success(resData.data.failList);
	    				alert("요청하신 총 "+resData.data.totalCnt+"건 중 "+resData.data.successCnt+"건 등록완료");
	                },function(err){
	                	if(err.status !== 412){
	                    	alert(err.data);
	                   	};
	                   	$log.error(err.data);
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
                				saShpSbOrdImpSvc.excelImport().then(function (resData) {            	    				
            	    				e.success(resData.data.results[0]);
            	                });                				
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
                		batch: true,
                		schema: {
                			model: {
                    			id: "NO_ORD",
                				fields: {
                					RS_ERR:	   	   	   {	type: "string", editable: false, nullable: false   },
								    NO_ORD:	   	   	   {	type: "string", editable: false, nullable: false   },                    					
								    NO_APVL:		   {	type: "string", editable: false, nullable: false   },
                			        NM_MRK: 	   	   {	type: "string", editable: false, nullable: false   },
						    	    NO_MRKORD: 	   	   {	type: "string", editable: false, nullable: false   },
						    	    NO_MRKITEMORD: 	   {	type: "string", editable: false, nullable: false   },
						    	    NO_MRK: 	   	   {	type: "string", editable: false, nullable: false   },						    	    				   
						    	    NO_MRKITEM: 	   {	type: "string",	editable: false, nullable: false   },
	    	    				   	NO_MRKREGITEM: 	   {	type: "string", editable: false, nullable: false   },                    									   
								    NM_MRKITEM:	   	   {	type: "string", editable: false, nullable: false   },
								    NM_MRKOPT:	   	   {	type: "string", editable: false, nullable: false   },
				   					AM_ORDSALEPRC: 	   {	type: "number", editable: false, nullable: false   },
                					NM_PCHR: 	       {	type: "string", editable: false, nullable: false   },
                					NM_CONS: 		   {	type: "string", editable: false, nullable: false   },
                					NO_PCHRPHNE: 	   {	type: "string", editable: false, nullable: false   },	
                				    NO_CONSHDPH: 	   {	type: "string", editable: false, nullable: false   },
                				    NO_CONSPOST:	   {	type: "string", editable: false, nullable: false   },				   
                				    DC_CONSNEWADDR:    {	type: "string", editable: false, nullable: false   },
                				    DC_CONSOLDADDR:    { 	type: "string", editable: false, nullable: false   },	
                				    CD_ORDSTAT: 	   {	type: "string", editable: false, nullable: false   },	
                				    DC_SHPWAY: 	   	   {	type: "string", editable: false, nullable: false   },	
                				    QT_ORD:			   {	type: "number",	editable: false, nullable: false   },
                				    DTS_APVL: 	   	   {	type: "string", editable: false, nullable: false   },	
                				    DTS_ORD: 	   	   {	type: "string", editable: false, nullable: false   },
                				    DTS_ORDDTRM: 	   {	type: "string", editable: false, nullable: false   },       
                				    CD_PARS: 	   	   {
					                				    	type: "array",
															editable: true,
															nullable: true,
															validation: {
																cd_parsvalidation: function (input) {
					  									    		if (input.is("[name='CD_PARS']") && !input.val()) {
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
					  									    		if (input.is("[name='NO_INVO']")) {
					  									    			return Util03saSvc.NoINVOValidation(input, 'NO_INVO', 'no_invovalidation');
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
		                            width: 150,
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
                                    field: "NO_MRKITEMORD",
                                    title: "상품주문번호",
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
		                            	var db = filteringShpbox(options.model.NO_MRK);
		                            	
		                            	if(!db.length){
		                            		db = [{NM_PARS_TEXT : "택배사 등록", CD_PARS : "택"}];
		                            	}
		                            	
		                            	$('<input name='+ options.field +' data-bind="value:' + options.field + '" />')
		                                .appendTo(container)
		                                .kendoDropDownList({
		                                    dataTextField: "NM_PARS_TEXT",
		                                    dataValueField: "CD_PARS",
		                                    optionLabel : "택배사를 선택해 주세요 ",
		                                    dataSource: db,
		                                    change : function(e){
		                                    	if(this.text() === "택배사 등록" && this.selectedIndex === 1){
		                                    		$state.go("app.syPars", { menu: true, ids: null });
		                                    	}
		                                    }
		                                });		
		                            	
		                            	$('<span class="k-invalid-msg" data-for="CD_PARS"></span>').appendTo(container);
		                            },
		                            template: function(e){
		                            	var nmd = e.CD_PARS,		                            	
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
	                            			return (e.CD_PARS.NM_PARS_TEXT) ? e.CD_PARS.NM_PARS_TEXT : "";
	                            		};
	                            		return "";
		                            }, 
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        },
                               	{
                                    field: "NO_INVO",
                                    title: "<span class='form-required'>* </span>송장번호",
                                    width: 150,
                                    editor: function(container, options){
                                    	$('<input class="k-textbox" name="' + options.field + '" data-bind="value: NO_INVO" autocomplete=off />').appendTo(container);                                    	
                                    },
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
		                        	field: "NM_ORDSTAT",
		                            title: "주문상태",
		                            width: 100,
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
		