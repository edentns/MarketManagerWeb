(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.ShpIng.controller : sa.ShpIngCtrl
     * 상품분류관리
     */
    angular.module("sa.ShpIng.controller")
        .controller("sa.ShpIngCtrl", ["$scope", "$state","$http", "$q", "$log", "sa.ShpIngSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "sa.OrdCclSvc", "Util03saSvc", "APP_SA_MODEL", "sa.ShpStdbyOrdSvc", 
            function ($scope, $state, $http, $q, $log, saShpIngSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, saOrdCclSvc, Util03saSvc, APP_SA_MODEL, ShpStdbyOrdSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            menuId = MenuSvc.getNO_M($state.current.name);
	            
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
    					lcdcls: "SA_000007",
    					mid: menuId
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
	            
	            var parsCodeOp = new kendo.data.DataSource({
                    transport: {
                    	read: function(e){
    	                	var param = {	  
    	                		NO_MRK: shippingDataVO.selectedNoMrk
                            };
    	                	ShpStdbyOrdSvc.shplist(param).then(function (res) {
    	                		if(res.data.length >= 1){  
    	                			e.success(res.data);    
    	                		}
                			});
    	                }
                    }
	            });
	            
	            var grdField =  {
                    ROW_CHK       : { type: APP_SA_MODEL.ROW_CHK.type        , editable: true , nullable: false },
                    NO_ORD        : { type: APP_SA_MODEL.NO_ORD.type         , editable: false, nullable: false },
                    NO_APVL       : { type: APP_SA_MODEL.NO_APVL.type        , editable: false, nullable: false },
                    NM_MRK        : { type: APP_SA_MODEL.NM_MRK.type         , editable: false, nullable: false },
                    NO_MRKORD     : { type: APP_SA_MODEL.NO_MRKORD.type      , editable: false, nullable: false },
                    NO_MRKITEMORD : { type: APP_SA_MODEL.NO_MRKITEMORD.type  , editable: false, nullable: false },
                    
                    NO_MRKITEM    : { type: APP_SA_MODEL.NO_MRKITEM.type     , defaultValue: "", nullable: false},
                    NO_MRKREGITEM : { type: APP_SA_MODEL.NO_MRKREGITEM.type  , editable: false, nullable: false },
                    NM_MRKITEM    : { type: APP_SA_MODEL.NM_MRKITEM.type     , editable: true , nullable: false },
                    NM_MRKOPT     : { type: APP_SA_MODEL.NM_MRKOPT.type      , editable: false, nullable: false },
                    
                    AM_ORDSALEPRC : { type: APP_SA_MODEL.AM_ORDSALEPRC.type  , editable: false, nullable: false },
                    AM_PCHSPRC    : { type: APP_SA_MODEL.AM_PCHSPRC.type     , editable: false, nullable: false },
                    NM_PCHR       : { type: APP_SA_MODEL.NM_PCHR.type        , editable: true , nullable: false },
                    NM_CONS       : { type: APP_SA_MODEL.NM_CONS.type        , editable: false, nullable: false },
                    NO_PCHRPHNE   : { type: APP_SA_MODEL.NO_PCHRPHNE.type    , editable: false, nullable: false },
                    NO_CONSHDPH   : { type: APP_SA_MODEL.NO_CONSHDPH.type    , editable: false, nullable: false },
                    
                    DC_PCHREMI    : { type: APP_SA_MODEL.DC_PCHREMI.type     , editable: false, nullable: false },
                    DC_CONSNEWADDR: { type: APP_SA_MODEL.DC_CONSNEWADDR.type , editable: false, nullable: false },
                    DC_PCHRREQCTT : { type: APP_SA_MODEL.DC_PCHRREQCTT.type  , editable: false, nullable: false },
                    DC_CONSOLDADDR: { type: APP_SA_MODEL.DC_CONSOLDADDR.type , editable: false, nullable: false },
                    CD_ORDSTAT    : { type: APP_SA_MODEL.CD_ORDSTAT.type     , editable: false, nullable: false },
                    DC_SHPWAY     : { type: APP_SA_MODEL.DC_SHPWAY.type      , editable: false, nullable: false },
                    DTS_ORD       : { type: APP_SA_MODEL.DTS_ORD.type        , editable: false, nullable: false },
                    DT_SND        : { type: APP_SA_MODEL.DT_SND.type         , editable: false, nullable: false },                    
                    QT_ORD        : { type: APP_SA_MODEL.QT_ORD.type         , editable: false, nullable: false },
                    CD_SHPSTAT    : { type: APP_SA_MODEL.CD_SHPSTAT.type     , editable: false, nullable: false },
                    CD_PARS       : { type: APP_SA_MODEL.CD_PARS.type        , editable: false, nullable: false },
                    CD_PARS_INPUT : { 
                    					type: "string", 
                    					editable: true,
                    					nullable: false,
				                    	validation: {
				                    		cd_pars_inputvalidation: function (input) {
												if (input.is("[name='CD_PARS_INPUT']") && !input.val()) {
													input.attr("data-cd_pars_inputvalidation-msg", "택배사를 선택해 주세요.");
												    return false;
												}
												return true;
											}
										}
                    				},
                    NO_INVO       : { 
                    					type: APP_SA_MODEL.NO_INVO.type, 
                    					editable: true,
                    					nullable: false,
				                    	validation: {
				                    		no_invovalidation: function (input) {
				                    			return Util03saSvc.NoINVOValidation(input, 'NO_INVO', 'no_invovalidation');													
											}
										}
				    				}
                };

                APP_SA_MODEL.CD_ORDSTAT.fNm = "shippingDataVO.ordStatusOp";
                APP_SA_MODEL.CD_SHPSTAT.fNm = "shippingDataVO.shipStatusOp";
                
                var grdCol = [[APP_SA_MODEL.ROW_CHK],                              
                              [APP_SA_MODEL.NO_ORD         , [APP_SA_MODEL.NO_APVL, APP_SA_MODEL.NO_MRKORD]],
                              [APP_SA_MODEL.NM_MRK       , APP_SA_MODEL.NO_MRKITEMORD ],
                              [APP_SA_MODEL.NO_MRKITEM   , APP_SA_MODEL.NO_MRKREGITEM ],
                              [APP_SA_MODEL.NM_MRKITEM   , APP_SA_MODEL.NM_MRKOPT     ],
                              [APP_SA_MODEL.AM_ORDSALEPRC, APP_SA_MODEL.AM_PCHSPRC    ],
                              [APP_SA_MODEL.NM_PCHR      , APP_SA_MODEL.NM_CONS       ],
                              [APP_SA_MODEL.NO_PCHRPHNE  , APP_SA_MODEL.NO_CONSHDPH   ],
                              [APP_SA_MODEL.DC_PCHREMI   , APP_SA_MODEL.DC_CONSNEWADDR],
                              [APP_SA_MODEL.DC_PCHRREQCTT, APP_SA_MODEL.DC_CONSOLDADDR],
                              [APP_SA_MODEL.CD_ORDSTAT   , APP_SA_MODEL.DC_SHPWAY     ],
                              [APP_SA_MODEL.DTS_ORD      , APP_SA_MODEL.DT_SND        ],
                              [APP_SA_MODEL.CD_PARS      , APP_SA_MODEL.NO_INVO       ],
                              [APP_SA_MODEL.QT_ORD       , APP_SA_MODEL.CD_SHPSTAT    ]
                             ],
                    grdDetOption      = {},
                    grdRowTemplate    = "<tr data-uid=\"#= uid #\">\n",
                    grdAltRowTemplate = "<tr class=\"k-alt\" data-uid=\"#= uid #\">\n",
                    grdCheckOption    = {clickNm:"onOrdGrdCkboxClick",
                		                 allClickNm:""};
                
                grdDetOption       = UtilSvc.gridDetOption(grdCheckOption, grdCol);
                grdRowTemplate     = grdRowTemplate    + grdDetOption.gridContentTemplate;
                grdAltRowTemplate  = grdAltRowTemplate + grdDetOption.gridContentTemplate;
	            
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
	        		selectedNoMrk : "",
	        		parsCodeOptions : {
	        			dataSource: parsCodeOp,
	        			dataTextField: "NM_PARS_TEXT",
                        dataValueField: "CD_PARS",
                    	valuePrimitive: true
	        		},
	        		param : ""
	            };   
	            
	            //조회
	            shippingDataVO.inQuiry = function(){
	            	var me = this;
	            	me.param = {
    				    NM_MRKITEM : shippingDataVO.procName.value,
					    NO_MRK : shippingDataVO.ordMrkNameMo, 
					    CD_ORDSTAT : shippingDataVO.ordStatusMo,
					    NO_MRKORD : shippingDataVO.orderNo.value,      
					    NM_PCHR : shippingDataVO.buyerName.value,
					    DTS_CHK : shippingDataVO.betweenDateOptionMo,  
					    DTS_FROM : new Date(shippingDataVO.datesetting.period.start.y, shippingDataVO.datesetting.period.start.m-1, shippingDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
					    DTS_TO : new Date(shippingDataVO.datesetting.period.end.y, shippingDataVO.datesetting.period.end.m-1, shippingDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
                    };   
    				if(Util03saSvc.readValidation(me.param)){
    					$scope.shippingkg.dataSource.data([]);  
    	            	$scope.shippingkg.dataSource.page(1);  // 페이지 인덱스 초기화              
    	            	//$scope.shippingkg.dataSource.read();
    				};
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
                			        
                	angular.element($("#grd_chk_master")).prop("checked",false);
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.shippingkg;
                	me.resetAtGrd.dataSource.data([]);
	            };	

	            shippingDataVO.isOpen = function (val) {
	            	if(val) {
	            		$scope.shippingkg.wrapper.height(616);
	            		$scope.shippingkg.resize();
	            		if(shippingDataVO.param !== "") grdShippngVO.dataSource.pageSize(9);
	            	}
	            	else {
	            		$scope.shippingkg.wrapper.height(798);
	            		$scope.shippingkg.resize();
	            		if(shippingDataVO.param !== "") grdShippngVO.dataSource.pageSize(12);
	            	}
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
                    	messages: UtilSvc.gridPageableMessages
                    },
                    noRecords: true,
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
                    		var ddl = $("select[name=CD_PARS_INPUT]").data("kendoDropDownList");
                    		
                    		ddl.value(shippingDataVO.selectedCdPars);
                        	ddl.trigger("change");
                    	},500);
                    },
                	scrollable: true,
                	resizable: true,
                	rowTemplate: kendo.template($.trim(grdRowTemplate)),
                	altRowTemplate: kendo.template($.trim(grdAltRowTemplate)),
                	height: 616,
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#shipping_toolbar_template").html()))}],
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				saShpIngSvc.orderList(shippingDataVO.param).then(function (res) {
            						e.success(res.data);			                   				                    					
            					});  
                			},
                			update: function(e){
                				var shpingGrd = $scope.shippingkg;
                				// 배송정보 수정
                				if(confirm("배송정보를 수정 하시겠습니까?")){
                					var defer = $q.defer(),
	                			 	    param = e.data.models.filter(function(ele){
	                			 	    	return ele.ROW_CHK === true;
	                			 	    }); 
                					
                					if(param.length !== 1){
                						alert("배송정보를 수정할 수 있는 주문상태가 아닙니다.");
                						return;
                					};
                					
                					saShpIngSvc.edit(param[0]).then(function (res) {
                						defer.resolve();
                						if(res.data === "success"){
                							alert("배송정보를 수정 하였습니다.");
    	            						$scope.shippingkg.dataSource.read();
                						}else{
                							alert("배송정보를 수정하는데 실패 하였습니다.");
                							e.error();
                						}
                					});                 					
		                			return defer.promise;
            	            	}else{
            	            		shpingGrd.cancelChanges();
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
                		pageSize: 9,
                		batch: true,
                		schema: {
                			model: {
                    			id: "NO_ORD",
                				fields: grdField
                			}
                		},
                	}),                	
                	columns: grdDetOption.gridColumn      	          	
	        	};

	            UtilSvc.gridtooltipOptions.filter = "td div";
	            grdShippngVO.tooltipOptions = UtilSvc.gridtooltipOptions;
		        
	            //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
	                var element = $(e.currentTarget),
	                	checked = element.is(':checked'),
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

                //한번 틀리고 원래 값으로 변경 하면 경고문구가 사라지지 않음
                $scope.popupUtil = {
                	blur : function(e){
                		var element = $(e.currentTarget),
                			msg = element.closest("tr").find(".k-invalid-msg"),
                		    inputText = element.closest("input").val(),
                		    //regTest = /^[0-9]{1}[0-9\-]+[0-9]{1}$/;
                    	    regTest = /^(([\d]+)\-|([\d]+))+(\d)+$/;
                		
                		if(regTest.test(inputText) && msg.length > 0){
                			msg.hide();
                		}
                	}
                };
                
	            $scope.$on("kendoWidgetCreated", function(event, widget){
                	var grd = $scope.shippingkg;
                	
	                if (widget === grd){
	                	//배송정보 수정
	                	widget.element.find(".k-grid-edit").on("click", function(e){
	                		var chked = grd.element.find(".k-grid-content input:checked");
	                		
	                		switch(chked.length){
	                			case 1 : {
	                				var dataItem = grd.dataItem(chked.closest("tr"));
	                				shippingDataVO.selectedNoMrk = dataItem.NO_MRK;
	                				shippingDataVO.selectedCdPars = dataItem.TEMP_CD_PARS;
	                				parsCodeOp.read();
	    	                		grd.editRow(chked.closest("tr"));	    	                		
	                				break;	
	                			}
	                			case 0 : {
	                				alert("배송정보 수정하실 주문을 선택해 주세요!");
	                				break;
	                			}
	                			default : {
	                				alert("배송정보 수정하실 주문을 1개만 선택해 주세요!");
	                				break;
	                			}	                			
	                		}
	                	});	                	
	                }
                });  
            }]);
}());