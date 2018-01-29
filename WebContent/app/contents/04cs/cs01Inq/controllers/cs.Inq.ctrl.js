(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name cs.Inq.controller : cs.InqCtrl
     * C/S관리
     */
    angular.module("cs.Inq.controller")
        .controller("cs.InqCtrl", ["$scope", "$http", "$q", "$log", "cs.InqSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "Util03saSvc",
            function ($scope, $http, $q, $log, csInqSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util03saSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();	            
	            
	            var csDataVO = $scope.csDataVO = {
	            	boxTitle : "C/S 관리",
	            	setting : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 2
	        		},
	            	datesetting : {
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month', 'range'],
						selected   : resData.selected,
						period : {
							start : angular.copy(today),
							end   : angular.copy(today)
						}
	        		},
	        		procName : { value: "" , focus: false },
	        		buyerName: { value: "" , focus: false },
	        		orderNo : { value: "" , focus: false },
	        		csMrkNameOp : [],
	        		csMrkNameMo : "*",
	        		csStatusOp : [],
	        		csStatusMo : "*",
	        		csQuestionCodeMo : { value: "" , focus: false },
	        		dataTotal : 0,
	        		resetAtGrd:"",
	        		param : "",
	        		popupDisAble: "k-textbox"
	            };	        
	            
	            csDataVO.initLoad = function(){
	            	var me = this;
	            	var ordArg = {
	            			procedureParam: "MarketManager.USP_SY_10CODE02_GET&lnomngcdhd@s|lcdcls@s",
	    					lnomngcdhd: "SYCH00069",
	    					lcdcls: "CS_000001"
	            		};
	            	$q.all([
						UtilSvc.getList(ordArg).then(function (res) {
							if(res.data.results[0].length >= 1){
								return res.data.results[0]; 
							}
						}),	
						//마켓명 드랍 박스 실행
						csInqSvc.csMrkList().then(function (res) {
							if(res.data.length >= 1){
								return res.data; 
							}
						})		
	            	]).then(function(result){
	            		me.csStatusOp = result[0];
	            		me.csMrkNameOp = result[1];
	            		
	            		$timeout(function(){
            				Util03saSvc.storedQuerySearchPlay(me, resData.storage);
                        },0);  
	            	});
	            };
	            
	            //조회
	            csDataVO.inQuiry = function(){	
	            	var me = this;
	            	me.param = {
    					I_NO_MRK: me.csMrkNameMo,
    					I_NM_MRKITEM: me.procName.value,                                    	
    					I_CD_INQSTAT: me.csStatusMo,
    					I_NM_INQCLFT: me.csQuestionCodeMo.value,
    					I_NM_INQ: me.buyerName.value,
    					I_NO_MRKORD: me.orderNo.value,
    					I_DTS_INQREG_F: new Date(me.datesetting.period.start.y, me.datesetting.period.start.m-1, me.datesetting.period.start.d).dateFormat("Ymd"),
    					I_DTS_INQREG_T: new Date(me.datesetting.period.end.y, me.datesetting.period.end.m-1, me.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis"),
    					CS_NM_MRK_SELCT_INDEX : me.csMrkNameOp.allSelectNames,
    					CS_NM_ORDSTAT_SELCT_INDEX : me.csStatusOp.allSelectNames,
    					DTS_SELECTED : me.datesetting.selected,
    					DTS_STORAGE_FROM: me.datesetting.period.start,
    					DTS_STORAGE_TO: me.datesetting.period.end,
    					CASH_PARAM : resData.storageKey
                    };   
    				if(Util03saSvc.readValidation(csDataVO.param)){
    					$scope.cskg.dataSource.data([]);
    	            	$scope.cskg.dataSource.page(1);
    	            	//$scope.cskg.dataSource.read();
    				};	            	
	            };	            
	            
	            //초기화버튼
	            csDataVO.inIt = function(){
	            	var me  = this;
                	
	            	me.procName.value = "";
                	me.buyerName.value = "";
                	me.orderNo.value = "";
                	                	                	
                	$timeout(function(){
                		angular.element(".frm-group").find("button:eq(0)").triggerHandler("click");
                		angular.element(".frm-group").find("button:eq(2)").triggerHandler("click");
                	},0);                	
                	        			
                	me.csMrkNameOp.bReset = true;
                	me.csStatusOp.bReset = true;     
                	//me.csQuestionCodeOp.bReset = true;
                	
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.cskg;
                	me.resetAtGrd.dataSource.data([]);
	            };	
	            
	            csDataVO.isOpen = function (val) {
	            	if(val) {
	            		$scope.cskg.wrapper.height(616);
	            		$scope.cskg.resize();
	            		if(csDataVO.param !== "") gridCsVO.dataSource.pageSize(16);
	            	}
	            	else {
	            		$scope.cskg.wrapper.height(798);
	            		$scope.cskg.resize();
	            		if(csDataVO.param !== "") gridCsVO.dataSource.pageSize(25);
	            	}
	            };	    
	            
	            //cs 검색 그리드
                var gridCsVO = $scope.gridCsVO = {
                		autoBind: false,
                        messages: {                        	
                            requestFailed: "마켓정보를 가져오는 중 오류가 발생하였습니다.",
                            commands: {
                                update: "저장",
                                canceledit: "닫기"
                            }
                            ,noRecords: "검색된 데이터가 없습니다."
                        },                    	
                    	pageable: {
                        	messages: UtilSvc.gridPageableMessages
                        },
                    	boxTitle : "CS 리스트",
                    	sortable: true,    
                        noRecords: true,
                    	dataSource: new kendo.data.DataSource({
                    		transport: {
                    			read: function(e) {
                    				csInqSvc.csList(csDataVO.param).then(function (res) {      						
                						e.success(res.data);
                					});
                    			},                    			
                    			update: function(e) {
                    				var defer = $q.defer(),
    	                			 	param = e.data.models[0];       
                    				if(param.CD_INQSTAT === "002"){
                    					alert("이미 답변이 등록되어 있습니다.");
                    					return false;
                    				};
                    				csInqSvc.csUpdate(param, e).then(function(res) {
    	                				defer.resolve();
    	                				$scope.cskg.dataSource.read();
    	                			});
                    				return defer.promise;
                    			}, 	                		
                    			parameterMap: function(e, operation) {
                    				if(operation !== "read" && e.models) {
                    					return {models:kendo.stringify(e.models)};
                    				}
                    			}
                    		},
                    		change: function(e){
                    			var data = this.data();
                    			csDataVO.dataTotal = data.length;
                    		},
                    		pageSize: 16,
                    		batch: true,
                    		schema: {
                    			model: {
                        			id: "NO_INQ",
                    				fields: {
					                    NO_MRK : 		   {
					                    						type: "string", 
																editable: false,  
																nullable: false
					                    				   },
                    					ROW_CHK: 		   {	
					                    						type: "boolean", 
																editable: false,  
																nullable: false
                										   },
                						NO_INQ:		   	   {	
                    											type: "string", 
                    											editable: false,
                												nullable: false
            											   },                    					
    									NM_MRK:		   	   {	
                    											type: "string", 
                    											editable: false, 
                    											nullable: false
                    									   },
									    NO_MNGMRK:		   {	
	                   											type: "string", 
	                   											editable: false, 
	                   											nullable: false
                   									       },
									    DTS_INQREG: 	   {	
																type: "string", 
																editable: false,
																nullable: false
	                    						    	   },
	                    				CD_INQSTAT: 	   {
																type: "string", 
																defaultValue: "001",	
																editable: false, 
																nullable: false
												    	   },
							    	    DC_INQTITLE: 	   {
	                    										type: "string",
	                    										defaultValue: "",
	                    										nullable: false //true 일때 defaultValue가 안 됨
                    									   },
                    					DC_INQCTT: 	   	   {
	                											type: "string",                     										
	                											editable: false,
	                    										nullable: false
                    									   },                    									   
									    DC_ANSCTT:	   	   {	type: "string", 
														    	validation: {
														    		dc_anscttvalidation: function (input) {
						  									    		if (input.is("[name='DC_ANSCTT']") && !input.val()) {
			                                                            	input.attr("data-dc_anscttvalidation-msg", "답변 내용을 입력해 주세요.");
			                                                                return false;
			                                                            }
						  									    		if (input.is("[name='DC_ANSCTT']") && ($.trim(input.val()).length < 4 || $.trim(input.val()).length > 30000)){
			                                                            	input.attr("data-dc_anscttvalidation-msg", "답변 내용을 4자 이상 30000자 이하로 써주세요.");
			                                                                return false;
			                                                            }
						  									    		return true;
					  									    	  	}
					  									        },
									    						editable: true
                    									   },
                    				    DTS_ANSREG:	   	   {	
	                       										type: "string", 
	                       										editable: false,
																nullable: false
                       									   },
                       					NM_INQCLFT: 	   {	type: "string", 
                    											editable: false,
                    											nullable: false
                    									   },                    					
                    					NM_INQ: 		   {
	                											type: "string",
	                    										editable: false, 
	                    										nullable: false //true 일때 defaultValue가 안 됨	                    										
                    									   },
                    					NM_MRKITEM: 	   {
	                    										type: "string",
	                    										editable: false,
	                    									    nullable: false
                    									   },
                    					NO_MRKORD: 		   {
                    											type: "string", 
                    											editable: false, 
                    											nullable: false
                    									   },
                    				    CD_MRKITEM: 	   {
					                    				    	type: "string", 
																editable: false, 
																nullable: false
                    				    				    }				   		
                    				}
                    			}
                    		},
                    	}),                    	
                    	navigatable: true, //키보드로 그리드 셀 이동 가능
                    	toolbar: [{template: kendo.template($.trim($("#cs-toolbar-template").html()))}],
                    	columns: [
								{
								   field: "ROW_CHK",
								   title: "선택",
								   width: 40,
								   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
							    }, 							
               		            {
								   field: "NO_INQ",
								   title: "문의 번호",
								   width: 130,
								   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
               		            },
            		            {
               		        	   field: "NM_MRK",
               		        	   title: "마켓명",
               		        	   width: 100,
               		        	   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
            		            },
            		            {
               		        	   field: "DTS_INQREG",
               		        	   title: "문의등록일시",
               		        	   width: 130,
               		        	   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}            		            
               		            },
	            		        {
           		        	       field: "CD_INQSTAT",
           		        	       title: "상태",
           		        	       width: 90,
           		        	       headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
           		        	    },
            		            {
            		        	   field: "DC_INQTITLE",
            		               title: "문의제목",
            		               width: 200,
            		               headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
            		            },
            		            {
            		        	   field: "DC_INQCTT",
            		               title: "문의내용",
            		               width: 200,
            		               headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}            		            },
            		            {
            		        	   field: "DC_ANSCTT",
            		               title: "답변내용",
            		               width: 200,
            		               headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
            		            },
            		            {
            		        	   field: "DTS_ANSREG",
            		               title: "답변일시",
            		               width: 130,
            		               headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},           		               
            		            },
            		            {
            		        	   field: "NM_INQCLFT",
            		        	   title: "문의구분",
            		        	   width: 80,
            		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
           		        	    },
           		        	    {
             		        	   field: "NM_INQ",
             		        	   title: "문의자",
             		        	   width: 100,
             		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
            		        	},
        		        	    {
             		        	   field: "NM_MRKITEM",
             		        	   title: "상품명",
             		        	   width: 200,
             		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
            		        	},
        		        	    {
             		        	   field: "NO_MRKORD",
             		        	   title: "주문번호",
             		        	   width: 110,
             		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
            		        	}            		        	
                    	],
                    	dataBound: function(e) {
                           // this.expandRow(this.tbody.find("tr.k-master-row").first());                                                  
                        },
                        /*selectable: "row",*/
                        collapse: function(e) {
                            this.cancelRow();
                        },         	
                    	editable: {
                    		mode: "popup",
                    		window : {
                    	        title: ""
                    	    },
                    		template: kendo.template($.trim($("#cs_popup_template").html())),
                    		confirmation: false
                    	},	
                    	edit: function(e){
                    		if(e.model.CD_INQSTAT === "002"){
                    			csDataVO.popupDisAble = "k-textbox k-state-disabled";
                        		e.container.find(".k-grid-update").hide();  
                        		e.container.find(".k-edit-buttons").prepend("<p style='text-align:right;'><code>*</code>이미 답변이 등록되어 있습니다.</p>");                      		
                    		}else{
                    			csDataVO.popupDisAble = "k-textbox";                    			
                    		};          
                    	},
                    	resizable: true,
                    	rowTemplate: kendo.template($.trim($("#cs_template").html())),      
                    	height: 616       
                    	//모델과 그리드 셀을 제대로 연동 안시키면 수정 팝업 연 후 닫을 때 로우가 사라짐(즉 크레에이트인지 에딧인지 구분을 못함)
                    	//id는 유니크한 모델값으로 해야함 안그러면 cancel 시에 row grid가 중복 되는 현상이 발생
        		};

	            UtilSvc.gridtooltipOptions.filter = "td";
	            gridCsVO.tooltipOptions = UtilSvc.gridtooltipOptions;
	            
                //kendo grid 체크박스 옵션
                $scope.onCsGrdCkboxClick = function(e){
	                var element =$(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.cskg,
	                	dataItem = grid.dataItem(row);
	                 	                
	                dataItem.ROW_CHK = checked;
	                dataItem.dirty = checked;
	                
	                checked ? row.addClass("k-state-selected") : row.removeClass("k-state-selected");
	                
                };
                
                $scope.onCsGridEditClick = function(){            	
                	var grd = $scope.cskg,
	            		chked = grd.element.find("input:checked"),
	            		chkedLeng = grd.element.find("input:checked").length;
                	
                	if(chkedLeng === 1){
                		grd.editRow(chked.closest('tr'));
                	}else{
                		//alert("답변 하실 데이터를 1개만 선택해 주세요.");
                		alert("답변 하실 데이터를 1개만 선택해 주세요.");
                		return false;
                	}
                };	
                
                $scope.onOpen = function(){
                	alert("문의정보 가져오기는 준비중 입니다.");
                	return false;
                };
                
                $scope.onSend = function(){
                	alert("답변 전송하기는 준비중 입니다.");
                	return false;
                };                
                
                csDataVO.initLoad();
            }]);
}());