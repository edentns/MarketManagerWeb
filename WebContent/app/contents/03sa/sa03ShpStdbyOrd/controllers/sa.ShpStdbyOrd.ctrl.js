(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.ShpStdbyOrd.controller : sa.ShpStdbyOrdCtrl
     * 상품분류관리
     */
    angular.module("sa.ShpStdbyOrd.controller")
        .controller("sa.ShpStdbyOrdCtrl", ["$scope", "$http", "$window", "$q", "$log", "$state", "sa.ShpStdbyOrdSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc",  "Util03saSvc", "APP_SA_MODEL", "sa.OrdSvc", 
            function ($scope, $http, $window, $q, $log, $state, saShpStdbyOrdSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util03saSvc, APP_SA_MODEL, saOrdSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            menuId = MenuSvc.getNO_M($state.current.name);
	            
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
						selected   : resData.selected,
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
	        		cancelCodeOp : [],   				
	        		cancelCodeLowOp : [],
	        		cancelCodeSel : [],   				
	        		cancelCodeLowSel : [],
	        		cancelCodeMo : "",
	        		shipCodeTotal : "",
	        		updateChange : "",
	        		dataTotal : 0,
	        		resetAtGrd :"",
	        		param : "",
	        		menualShwWrn : "",
	        		importCnt : 10,
	        		chkOrdStatList : ""
	            };
	            
	            //초기값 설정
	            shpbyordDataVO.initLoad = function(){
	            	var me = this;
                	var ordParam = {
                			lnomngcdhd: "SYCH00048",
        					lcdcls: "SA_000007",
        					mid: menuId
        				},
        				betParam = {
        					lnomngcdhd: "SYCH00055",
        					lcdcls: "SA_000014"
        				},
        				cclCodeParam = {
                			lnomngcdhd: "SYCH00056",
        					lcdcls: "SA_000015",
	    					customnoc: "00000"
                		},
                		externalParam = "app/contents/03sa/sa02Ord/templates/sa.OrdCclPop.tpl.html";	//주문취소 팝업 다른곳에서 가져옴
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
            			//취소 사유 코드 드랍 박스 실행	
            			UtilSvc.getCommonCodeList(cclCodeParam).then(function (res) {
            				return res.data;
            			}),
    	            	Util03saSvc.externalKmodalPopup(externalParam).then(function (res) {
    	            		return res.data;
    	            	})
                    ]).then(function (result) {
                        me.ordMrkNameOp = result[0];
                        me.ordStatusOp = result[1];
                        me.betweenDateOptionOp = result[2];
                        me.betweenDateOptionMo = result[2][0].CD_DEF; 
                        me.cancelCodeOp = result[3].filter(function(ele){
    						return (!ele.DC_RMK2);
    					});
                        me.cancelCodeLowOp = result[3].filter(function(ele){
    						return (ele.DC_RMK2);
    					});
                        
                        $timeout(function(){
            				Util03saSvc.storedQuerySearchPlay(me, resData.storage);
                        },0);
                    });
                };
	            
	            //조회
	            shpbyordDataVO.inQuiry = function(){
	            	var me = this;
	            	me.param = {	  
    				    NM_MRKITEM : me.procName.value,
					    NO_MRK : me.ordMrkNameMo, 
					    CD_ORDSTAT : me.ordStatusMo,
					    NM_MRK_SELCT_INDEX : me.ordMrkNameOp.allSelectNames,
					    NM_ORDSTAT_SELCT_INDEX : me.ordStatusOp.allSelectNames,
					    NO_MRKORD : me.orderNo.value,      
					    NM_PCHR : me.buyerName.value,
					    DTS_CHK : me.betweenDateOptionMo,  
					    DTS_FROM : new Date(me.datesetting.period.start.y, me.datesetting.period.start.m-1, me.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
					    DTS_TO : new Date(me.datesetting.period.end.y, me.datesetting.period.end.m-1, me.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis"),
					    DTS_SELECTED : me.datesetting.selected,
    					DTS_STORAGE_FROM: me.datesetting.period.start,
    					DTS_STORAGE_TO: me.datesetting.period.end,
					    CASH_PARAM : resData.storageKey
                    };   
    				if(Util03saSvc.readValidation(me.param)){
    					$scope.shpbyordkg.dataSource.data([]);
        				$scope.shpbyordkg.dataSource.page(1); 
    				}; 					
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
	            
	            //반응형 그리드	            
	            shpbyordDataVO.isOpen = function (val) {
            		Util03saSvc.isOpen($scope.shpbyordkg, shpbyordDataVO, grdShpbyordVO, val);
	            };
	            
	            //팝업창을 켜도 초기확 되지 않게 설정함
	            shpbyordDataVO.flagFnc = function(){
	            	if(shpbyordDataVO.flag){
                    	var grid = $("#divShpbyordGrd").data("kendoGrid"),
            		         op1 = { editable : true },
            		        data = grid._data;
                    	
                    	grid.setOptions(op1);
                    	$scope.shpbyordkg.dataSource.data(data);
                    	shpbyordDataVO.flag = false;
                	}
	            };
	            
	            //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
                	UtilSvc.grdCkboxClick(e, $scope.shpbyordkg);
                };
                
                //kendo grid 체크박스 all click
                $scope.onOrdGrdCkboxAllClick = function(e){
                	UtilSvc.grdCkboxAllClick(e, $scope.shpbyordkg);
                };
                
	            //그리드 셀 더블 클릭
	            $("#divShpbyordGrd").delegate("tbody>tr", "dblclick", function(ev){
	            	var grd = $scope.shpbyordkg;
	            	var getCurrentCell = "",
	         		     getCurrentRow = "",
	         		           getData = "";
	         		
	         		getCurrentCell = $(ev.target).is("td") ? $(ev.target) : $(ev.target).parents("td");
	         		getCurrentRow = $(ev.target).parents("tr");           
	         		getData = grd.dataItem(getCurrentRow);           
	         		
	         		//택배사 수정 하다가 넘어가면 짜증 나니까 택배사및 송장번호 더블클릭은 막음
	         		if(getCurrentCell.closest("td").hasClass("dnt-clk")){	         			
	         			return false;
	         		};
	         		$state.go("app.saOrd", { kind: null, menu: null, rootMenu : "saShpStdbyOrd", noOrd : getData.NO_ORD, noMrkord: getData.NO_MRKORD });
	            });
	            	            	            
		        //검색 그리드 옵션들
	            var grdShpbyordVO = $scope.grdShpbyordVO = {
	            	ordCancel: function() {
	            		var grd = $scope.shpbyordkg,
	            			chked = grd.element.find(".k-grid-content input:checked"),
            				chkedLeng = grd.element.find(".k-grid-content input:checked").length,
            				element = $(event.currentTarget),
            				row = element.parents("div").find(".k-grid-content input:checked"),
            				dataItem = grd.dataItems(row);
            		
	            		var grid = $("#divShpbyordGrd").data("kendoGrid"),
	            		    op1 = {
	            					editable : {
			                    		mode: "popup",
			                    		window : {
			                    	        title : ""
			                    	    },
			                    		template: function(data){
			                    			return kendo.template($.trim($("#ord-cclpop-template").html()))(data);
			                    		},
			                    		confirmation: false
	            					}
	            			},
	                    	data = grid._data;
	            		
	            	    grid.setOptions(op1);   // 데이터 셋 옵션하면 그리드안에 데이터들이 없어져서 담아놧다가 다시 할당해줌
	            	    $scope.shpbyordkg.dataSource.data(data);
	            		/*var selected = grid.dataItem(grid.select()).NO_MRK;*/
	                    if(chkedLeng === 1){
	                    	var gridItem = grid.dataItem(chked.closest('tr'));
	                    	
	                    	shpbyordDataVO.flag = true;
	                    	shpbyordDataVO.updateChange = "003";
	                    	
	                    	shpbyordDataVO.cancelCodeSel = shpbyordDataVO.cancelCodeOp.filter(function(ele){
		            			return (ele.DC_RMK1 === gridItem.NO_MNGMRK);
		            		});
	                		
	                    	shpbyordDataVO.cancelCodeLowSel = shpbyordDataVO.cancelCodeLowOp.filter(function(ele){
		            			return (ele.DC_RMK1 === gridItem.NO_MNGMRK);
		            		});   
	                    	
	                		grd.editRow(chked.closest('tr'));
	                	}
	                    else if(chkedLeng > 1){
	                		alert("취소할 주문을 1개만 선택해 주세요!");
	                	}
	                    else if(chkedLeng < 1){
	                		alert("취소할 주문을 선택해 주세요!");
                	}},
                	deliveryInfo : function() {
                		var grd = $scope.shpbyordkg;
                		var chkedLeng = grd.element.find(".k-grid-content input:checked").length;
                		
	                	if(chkedLeng < 1){
	                		alert("배송 정보를 등록 하실 주문을 선택해 주세요!");
	                		return false;
	                	};
	                	if(chkedLeng > shpbyordDataVO.importCnt){
	                		alert("배송 정보를 등록 하실 주문을 "+shpbyordDataVO.importCnt+"개 이하로 선택해 주세요!");
	                		return false;
	                	};
	                	shpbyordDataVO.updateChange = "002";
                		grd.saveChanges();
					},
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
                    edit: function(e){                    	
                		var cdcclrsn = e.container.find("select[name=CD_CCLRSN]"),
            					lf = e.container.find("select[name=CD_CCLLRKRSN]"),
                    		    tx = e.container.find("[name=DC_CCLRSNCTT]"),
            					lfData = "",
            					cdcclrsnData = "";
                		              	
                		//하위취소사유코드 셋팅
                    	if(lf.length > 0){
                			lf.kendoDropDownList({
                				dataSource : [],
    		        			dataTextField : "NM_DEF",
    		                    dataValueField : "CD_DEF",
    	                		optionLabel : "하위 취소사유코드를 선택해 주세요 ",	                    
    		                    valuePrimitive : true
    	            		});
                			lfData = lf.data("kendoDropDownList");
                			lfData.value(0);
                		};
                		 //취소사유코드 DDL 셋팅
                		if(cdcclrsn.length > 0){                        	
                    		cdcclrsn.kendoDropDownList({
    	            			dataSource : shpbyordDataVO.cancelCodeSel,
    		        			dataTextField:"NM_DEF",
    		                    dataValueField:"CD_DEF",
    	                		optionLabel : "취소사유코드를 선택해 주세요 ",	                    
    		                    valuePrimitive: true,
    		                    change : function(e){
    		                    	var cdDef = this.dataItem().CD_DEF,
    		                    		dcRmk1 = this.dataItem().DC_RMK1;
    		                    	
    		                    	if(lfData){
    		                    		lfData.dataSource.data(shpbyordDataVO.cancelCodeLowSel.filter(function(ele){
    		                    			return (ele.DC_RMK2 === cdDef) && (ele.DC_RMK1 === dcRmk1);
    		                    		}));
    		                    	}
    		                    }
    	            		}); 
                    		cdcclrsnData = cdcclrsn.data("kendoDropDownList");
                    		cdcclrsnData.value(0);
                		}; 
                		
                		if(tx.length){	tx.val(""); };
                	},
            		cancel: function(e){
            			e.preventDefault();	
            			shpbyordDataVO.flagFnc();
            		},            		
            		excelVO: {
            			gridTitle:["배송대기자료","택배사코드"],
            			gridInfo:[],
            			procedureParam:"USP_SA_03SHPSTDBYORD01_GET&NO_MRK@s|NM_MRKITEM@s|CD_ORDSTAT@s|NO_MRKORD@s|NM_PCHR@s|DTS_CHK@s|DTS_FROM@s|DTS_TO@s"
            		}, 
            		exportExcel: function(e){	//엑셀 추출
            			var grid = $("#divShpbyordGrd").data("kendoGrid");
            			if( !grid.dataSource._total || grid.dataSource._total == 0){
            				alert("그리드에 데이터가 없습니다.");
            			}else{
            				Util03saSvc.localStorage.getItem(resData.storageKey).then(function (res) {
            					var getParam = res.data,
            					    colVo = angular.copy($scope.grdShpbyordVO.columns);
                				colVo.splice(0,1);
                				getParam.gridInfo       = [colVo,[{field:"NM_MRK",title:"마켓명"},{field:"CD_DEF",title:"택배사코드"},{field:"NM_DEF",title:"택배사명"},{field:"NM_SHPCLFT",title:"택배사구분"}]];
                				getParam.procedureParam = $scope.grdShpbyordVO.excelVO.procedureParam;
                				getParam.gridTitle      = $scope.grdShpbyordVO.excelVO.gridTitle;   
                				getParam.downfilename   = $scope.grdShpbyordVO.excel.fileName;
                				UtilSvc.getExcelDownload(getParam);
                			}, function(err){
        						e.error([]);
        					});            				
            			}
            		},
                    editable : true,
                	scrollable: true,
                	resizable: true,
                	//rowTemplate: kendo.template($.trim($("#shpbyord-template").html())),
                	height: 616,
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#shpbyord-toolbar-template").html()))}],
                	excel: {
                		fileName: "배송대기.xlsx"
                	},
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {	
                				saShpStdbyOrdSvc.shpbyordList(shpbyordDataVO.param).then(function (res) {
            						shpbyordDataVO.shipCodeTotal = res.data.shpList;
            						e.success(res.data.searchList);            						
                    			}, function(err){
            						e.error([]);
            					});
                			},
                			update: function(e){
        						var defer = $q.defer(),
        						 	code = shpbyordDataVO.updateChange;
                				
                				if(code === "002"){    //배송정보 등록            						
                					if(confirm("배송정보를 등록 하시겠습니까?\n송장번호 체크로 인하여 처리시간이 다소 소요 될수 있습니다.")){
                						var param = e.data.models.filter(function(ele){
	                							if(ele.ROW_CHK === true){
		                			 	    		ele.NO_INVO = ele.NO_INVO.trim();	                			 	    		
		                			 	    		return ele;
		                			 	    	}
        	                		 	    }),
        	                		 	    itfRst = param.filter(function(ele){
        	                		 	    	return ele.ITF_RST !== '1' && ele.ITF_RST !== 1;
        	                		 	    }),
        	                		 	    startTime = new Date();                        			
                        				
                        				if(!saShpStdbyOrdSvc.updateValidation(param, shpbyordDataVO.updateChange)){
                        					e.success();
                        					return false;
                        				}       
                        				
                        				if(itfRst.length > 0){
	                    					if(!confirm("주문확정에 대한 연동결과가 없는 주문이 있습니다.\n계속 진행하시겠습니까?\n연동결과가 없는 주문은 해당마켓과 주문상태가 차이 날 수도 있습니다.")){
	                        					e.success();
	                        					return false;
	                        				}
                        				}   
                        				
                    					saShpStdbyOrdSvc.shpInReg(param).then(function (res) {                 						
                    						var rtnV = res.data,
                    						    falseV = rtnV.falseNoOrd,
                    						    trueV = rtnV.trueNoOrd,
                    						    allV = rtnV.allNoOrd,
                    						    endTime = new Date(),
                    						    crTime = (endTime - startTime)/1000;
                    						
                							//$log.info("경과시간 = "+crTime+"초");
                							
                    						alert("총 "+allV.length+"건 중 "+trueV.length+"건 배송정보등록 완료");
                    						//Util03saSvc.storedQuerySearchPlay(shpbyordDataVO, resData.storage);
                    						shpbyordDataVO.inQuiry();
                    		                shpbyordDataVO.menualShwWrn = falseV;// 디렉티브를 쓰기 위해서 모델에 값 삽입
                						                    						
                    		                defer.resolve();
    		                			}, function(err){
    		                				if(err.status !== 412){
    		                					var errMsg = err.data;
    		                					if(errMsg === '1'){
    		                						alert("배송정보등록 처리 실패");
    		                					}else if(errMsg === '2'){
    		                						alert("배송정보등록 전체 실패");
    		                					}else{    		                						
    		                						shpbyordDataVO.chkOrdStatList = errMsg;
            		                				$scope.win2.open();
    		                					}
                                           	} 
                                           	$log.error(err.data);
    	            						e.error([]);
    	            						defer.reject(err.data);
    	            					});     
    		                			return defer.promise;
            						}else{
            							e.success();
            							defer.resolve(); 
            							return defer.promise;
            						};
                				}else if(code === "003"){	//주문 취소
	                				if(confirm("주문취소를 하시겠습니까?")){
	                					var param = e.data.models;
	                					
	                			 	    param = e.data.models.filter(function(ele){
	                			 	    	if(ele.ROW_CHK === true){
	                			 	    		ele.DC_CCLRSNCTT = ele.DC_CCLRSNCTT.trim();	                			 	    		
	                			 	    		return ele;
	                			 	    	}
	                			 	    });     
	                					
	                					saOrdSvc.orderCancel(param[0]).then(function (res) {
			                				defer.resolve(); 
			                				e.success();
			                				shpbyordDataVO.flagFnc();  
			                				//Util03saSvc.storedQuerySearchPlay(shpbyordDataVO, resData.storage);
			                				shpbyordDataVO.inQuiry();
			                			}, function(err){
			                				if(err.status !== 412){
                                            	alert(err.data);
                                           	} 
                                           	$log.error(err.data);
    	            						e.error([]);
    	            						defer.reject(err.data);
		            					});
			                			return defer.promise;
	        						}else{
	        							e.success();
	        							shpbyordDataVO.flagFnc(); 
	        							defer.resolve(); 
	        							return defer.promise;
	        						};
                				};
                			},                			
                			parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
                		},
                		//saveChanges: function(e) {
                			//console.log("1");
                		//},
                		change: function(e){
                			if(e.field === "CD_PARS" || e.field === "NO_INVO"){
                				return false;	
                			};		
                			var data = this.data();
                			shpbyordDataVO.dataTotal = data.length;                			
                			angular.element($("#grd_chk_master")).prop("checked",false);
                		},
                		batch: true,
                		schema: {
                			model: {
                    			id: "NO_ORD",
                				fields: {
                					ROW_CHK: 		   { type: "boolean", 					editable:false, nullable:false },
								    NO_ORD:	   	   	   { type: "string", 					editable:false, nullable:false },                    					
								    NO_APVL:		   { type: "string", 					editable:false, nullable:false },
                			        NM_MRK: 	   	   { type: "string", 					editable:false, nullable:false },
						    	    NO_MRKORD: 	   	   { type: "string", 					editable:false, nullable:false },
						    	    NO_MRK: 	   	   { type: "string", 					editable:false, nullable:false },						    	    				   
						    	    NO_MRKITEM: 	   { type: "string", 					editable:false, nullable:false },
	    	    				   	NO_MRKREGITEM: 	   { type: "string", 					editable:false, nullable:false },                    									   
								    NM_MRKITEM:	   	   { type: "string", 					editable:false, nullable:false },
								    NM_MRKOPT:	   	   { type: "string", 					editable:false, nullable:false },
				   					AM_ORDSALEPRC: 	   { type: "number", 					editable:false, nullable:false },
                					AM_CJM: 	       { type: "number", 					editable:false, nullable:false },
                					AM_PCHSPRC: 	   { type: "number", 					editable:false, nullable:false },
                					NM_PCHR: 	       { type: "string", 					editable:false, nullable:false },
                					NM_CONS: 		   { type: "string", 					editable:false, nullable:false },
                					NO_PCHRPHNE: 	   { type: "string", 					editable:false, nullable:false },	
                				    NO_CONSHDPH: 	   { type: "string", 					editable:false, nullable:false },
                				    DC_PCHREMI: 	   { type: "string", 					editable:false, nullable:false },	
                				    NO_CONSPOST:	   { type: "string", 					editable:false, nullable:false },				   
                				    DC_CONSNEWADDR:    { type: "string", 					editable:false, nullable:false },	
                				    DC_PCHRREQCTT: 	   { type: "string", 					editable:false, nullable:false },	
                				    DC_CONSOLDADDR:    { type: "string", 					editable:false, nullable:false },	
                				    CD_ORDSTAT: 	   { type: "string", 					editable:false, nullable:false },
                				    NM_ORDSTAT: 	   { type: "string", 					editable:false, nullable:false },	
                				    DC_SHPWAY: 	   	   { type: "string", 					editable:false, nullable:false },	
                				    QT_ORD:			   { type: "number", 					editable:false, nullable:false },
                				    DTS_APVL: 	   	   { type: "string", 					editable:false, nullable:false },	
                				    DTS_ORD: 	   	   { type: "string",					editable:false, nullable:false },
                				    YN_CONN: 	   	   { type: "string", 					editable:false, nullable:false },	
                				    DTS_ORDDTRM: 	   { type: "string", 					editable:false, nullable:false },      
							    	NO_MRKITEMORD: 	   { type: "string", 					editable:false,	nullable:false },   
				                    ITF_RST:		   { type: APP_SA_MODEL.ITF_RST.type, 	editable:false, nullable:false },	
                				    CD_PARS: 	   	   {
					                				    	type: "array",
															editable: true,
															nullable: false,
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
																no_invo_non_blank_validation: function (input) {
																	if (input.is("[name='NO_INVO']")) {
																		return Util03saSvc.NoINVOValidation(input, 'NO_INVO', 'no_invo_non_blank_validation',3);
																	};
																	return true;
				  									    	  	}
															}
								    				   },
								    CD_CCLRSN     :    { 
								    						type: "array", 
									                        validation: {
									                            cd_cclrsnvalidation: function (input) {
									                                if (input.is("[name='CD_CCLRSN']") && !input.val()) {
									                                    input.attr("data-cd_cclrsnvalidation-msg", "취소사유코드를 입력해 주세요.");
									                                    return false;
									                                }
									                              return true;
									                           }
									                        }
					                                    },					                                    
	                                CD_CCLLRKRSN :  	{ 
	                                    				  type: "string",  
	                                    				  editable: true, 
	                                    				  nullable: false,
	                				                      validation: {
	                				                    	  cd_ccllrkrsnvalidation: function (input) {
	                				                            	if (input.is("[name='CD_CCLLRKRSN']") && !input.val()) {
	                				                                    input.attr("data-cd_ccllrkrsnvalidation-msg", "하위 취소사유코드를 입력해 주세요.");
	                				                                    return false;
	                				                                };
	                				                                return true;
	                				                            }
	                				                        }
	                                                    },                    	
					                DC_CCLRSNCTT  :     { 
					                						type: APP_SA_MODEL.DC_CCLRSNCTT.type,   
					                						editable: true, 
					                						nullable: false,
									                    	validation: {
									                            dc_cclrsncttvalidation: function (input) {
									                                if (input.is("[name='DC_CCLRSNCTT']") && !input.val().trim()) {
									                                    input.attr("data-dc_cclrsncttvalidation-msg", "주문취소사유를 입력해 주세요.");
									                                    return false;
									                                }
									                                if(input.is("[name='DC_CCLRSNCTT']") && (input.val().length > 1000 || input.val().length < 8)){
									                                    input.attr("data-dc_cclrsncttvalidation-msg", "주문취소사유를 8자 이상 1000자 이내로 입력해 주세요.");
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
			                        attributes: { "class": "dnt-clk ta-c" }, 
			                        template: "<input class='k-checkbox' data-role='checkbox' type='checkbox' ng-click='onOrdGrdCkboxClick($event)' id='#= uid #'><label class='k-checkbox-label k-no-text' for='#= uid #'></label>",
			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}			                          
                	            },    
                               	{
                                    field: "NO_MRK",
                                    title: "관리자마켓번호",
                                    width: 0,
                                    hidden: true
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
	                                title: "결제번호 / 주문번호",
	                                width: 100,
	                                template: function(e){
	                                   	return ((e.NO_APVL) ? e.NO_APVL : '')+' / '+ ((e.NO_MRKORD) ? e.NO_MRKORD : '');                                   	
                                    },
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
	                                   	return ((e.NM_MRKITEM) ? e.NM_MRKITEM : '') + " / " 
	                                   	+ ((e.NM_MRKOPT) ? e.NM_MRKOPT : '') + " / " + ((e.QT_ORD) ? e.QT_ORD : '') +" 개";                        	
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
		                            attributes: { "class" : "dnt-clk" }, 
		                            editor: function shipCategoryDropDownEditor(container, options) {
		                            	var db = "",
		                            		noMrk = options.model.NO_MRK;
		                            	
		                            	db = saShpStdbyOrdSvc.filteringShpbox(noMrk, shpbyordDataVO);
		                            	//택배사를 등록하지 않았으면 택배사가 등록되지 않았다고  라벨을 넣어줌
		                            	if(!db.length){
		                            		db = [{NM_PARS_TEXT : "택배사 등록", CD_PARS : ""}];
		                            	}
		                            	//택배사 input 박스 생성 
		                            	$('<input name="' + options.field + '" data-bind="value: CD_PARS"/>').appendTo(container).kendoDropDownList({
		                                    dataTextField: "NM_PARS_TEXT",
		                                    dataValueField: "CD_PARS",
		                                    optionLabel : "택배사를 선택해 주세요 ",
		                                    dataSource: db,
		                                    change : function(e){
		                                    	if(this.text() === "택배사 등록" && this.selectedIndex === 1){
		                                    		$state.go("app.syPars", { mrk: noMrk, menu: true, ids: null });
		                                    	}
		                                    }
		                                });		                            	
		                            	$('<span class="k-invalid-msg" data-for="CD_PARS"></span>').appendTo(container);
		                            },
		                            template: function(e){
		                            	var nmd = e.CD_PARS,
		                            	  	dbbox = "",
		                            	  	input = "";
		                            	//택배사 이름 보여주기
	                            		if(nmd){
	                            			if(!nmd.hasOwnProperty("CD_PARS")){
	                            				input = e.NO_MRK;
		                            			
			                            		dbbox = saShpStdbyOrdSvc.filteringShpbox(input, shpbyordDataVO);
			                            		
			                            		for(var i=0, leng=dbbox.length; i<leng; i++){
		                                    		if(dbbox[i].CD_PARS === nmd){
		                                    			e.CD_PARS = dbbox[i];
		                                    		};
		                                    	};
	                            			};
	                            			return e.CD_PARS.NM_PARS_TEXT;
	                            		};
	                            		return "";
		                            },
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        },
                               	{
                                    field: "NO_INVO",
                                    title: "<span class='form-required'>* </span>송장번호",
                                    width: 150,
                                    attributes:  {
                    					"class" : "dnt-clk",
                    					"menual-shw-wrn" : "shpbyordDataVO.menualShwWrn",
                    					"menual-shw-wrn-no-ord" : "{{dataItem.NO_ORD}}",
                    					"menual-shw-wrn-list-yn" : "Y"
                                    },
                                	editor: function(container, options){
                                    	$('<input class="k-textbox" name="' + options.field + '" data-bind="value: '+options.field+'" autocomplete=off />').appendTo(container);                                    	
                                    },
			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        },
		                        {
		                        	field: "NM_PCHR",
		                            title: "구매자 (수취인)",
		                            width: 100,
		                            template: function(e){
	                                   	return (e.NM_CONS) ? e.NM_PCHR +"("+e.NM_CONS+")" : e.NM_PCHR;	                                   	
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
                                    	var vwTxt = "";
                                    	vwTxt = e.NO_CONSHDPH ? e.NO_CONSHDPH.toString() : '';
                                    	vwTxt += e.NO_PCHRHDPH ? '(' + e.NO_PCHRHDPH.toString() + ')' : '';
                                    	if(!vwTxt){
                                    		vwTxt = e.NO_CONSPHNE ? e.NO_CONSPHNE.toString() : '';
                                    		vwTxt += e.NO_PCHRPHNE ? '(' + e.NO_PCHRPHNE.toString() + ')' : '';
                                    	};            
                                    	return vwTxt;
                                    },
			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
                                }, 
                                {
                                    field: "DC_CONSNEWADDR",
                                    title: "주소1 (주소2)", 
                                    width: 100,
                                    template: function(e){
                                    	var vwAddr = "";
                                    	vwAddr = e.DC_CONSNEWADDR ? e.DC_CONSNEWADDR.toString() : '';
                                    	vwAddr += e.DC_CONSOLDADDR ? '('+e.DC_CONSOLDADDR.toString() + ')' : '';
                                    	return vwAddr;
                                    },
			                        headerAttributes: {"class" : "table-header-cell", style: "text-align : center; font-size : 12px"}
                                },  
                               	{
                                    field: "NO_MRKREGITEM",
                                    title: "상품번호",
                                    width: 90,
			                        headerAttributes: {"class" : "table-header-cell", style: "text-align : center; font-size : 12px"}
                                },      
		                        {
		                        	field: "AM_ORDSALEPRC",	
		                            title: "판매가",
		                            width: 100,
		                            format: '{0:c}',
		                            attributes: { "class" : "ta-r" }, 
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        },
	                           	{
	                                field: "AM_CJM",
	                                title: "정산예정금액",
	                                width: 100,
	                                format: '{0:c}',
	                                attributes: { "class" : "ta-r" }, 
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
		                            width: 70,
		                            attributes: { "class" : "ta-c" }, 
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        },       
		                        {
		                        	field: "ITF_RST",
		                            title: "주문확정연동결과",
		                            width: 70,
		                            attributes: { "class" : "ta-c" }, 
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                            template : function(e){
		                            	var input = e.ITF_RST;
		                            	return input === '1' ? 'Y' : 'N';		                            	
		                            }
		                        }
		                ]
	        	};

	            shpbyordDataVO.initLoad();
            }]);
}());
		
