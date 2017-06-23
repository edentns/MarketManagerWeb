(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name cs.Inq.controller : cs.InqCtrl
     * C/S관리
     */
    angular.module("cs.Inq.controller")
        .controller("cs.InqCtrl", ["$scope", "$http", "$q", "$log", "cs.InqSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc",
            function ($scope, $http, $q, $log, csInqSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            //문의 구분 드랍 박스 실행	
	            var connSetting = (function(){
    				var param = {
    					procedureParam: "MarketManager.USP_SY_10CODE02_GET&lnomngcdhd@s|lcdcls@s",
    					lnomngcdhd: "SYCH00070",
    					lcdcls: "CS_000003"
    				};
        			UtilSvc.getList(param).then(function (res) {
        				if(res.data.results[0].length >= 1){
        					csDataVO.csQuestionCodeOp = res.data.results[0];
        				}
        			});		
	            }());

	            //주문 상태 드랍 박스 실행	
	            var connSetting2 = (function(){
    				var param = {
    					procedureParam: "MarketManager.USP_SY_10CODE02_GET&lnomngcdhd@s|lcdcls@s",
    					lnomngcdhd: "SYCH00069",
    					lcdcls: "CS_000001"
    				};
        			UtilSvc.getList(param).then(function (res) {
        				if(res.data.results[0].length >= 1){
        					csDataVO.csStatusOp = res.data.results[0];
        				}
        			});		
	            }());

	            //마켓명 드랍 박스 실행	
	            var connSetting3 = (function(){
	            	csInqSvc.csMrkList().then(function (res) {
        				if(res.data.length >= 1){
        					csDataVO.csMrkNameOp = res.data;
        				}
        			});		
	            }());
	            	            
	            var csDataVO = $scope.csDataVO = {
	            	boxTitle : "C/S 관리",
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
	        		csMrkNameOp : [],
	        		csMrkNameMo : "*",
	        		csStatusOp : [],
	        		csStatusMo : "*",
	        		csQuestionCodeOp : [],
	        		csQuestionCodeMo : "*",
	        		dataTotal : 0
	            };	            
	            //조회
	            csDataVO.inQuiry = function(){	
	            	//var me = this;	            	
	            	$scope.cskg.dataSource.read();
	            };	            
	            //초기화버튼
	            csDataVO.inIt = function(){
	            	var me  = this;
                	
	            	me.procName.value = "";
                	me.buyerName.value = "";
                	me.orderNo.value = "";
                	me.csMrkNameMo = "*";
                	me.csStatusMo = "*";
                	me.csQuestionCodeMo = "*";
                	
                	me.datesetting.selected = "1Week";
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.cskg;
                	me.resetAtGrd.dataSource.data([]);
	            };	
	            //popup insert & update Validation
	            $scope.readValidation = function(idx){
	            	var result = true;
	            	
            		if(idx.I_NO_MRK === null || idx.I_NO_MRK === ""){ $scope.showPopup("마켓명을 입력해 주세요."); result = false; return; };
            		if(idx.I_CD_INQSTAT === null || idx.I_CD_INQSTAT === ""){ $scope.showPopup("상태값을 입력해 주세요."); result = false; return;};
            		if(idx.I_CD_INQCLFT === null || idx.I_CD_INQCLFT === ""){ $scope.showPopup("문의 구분을 입력해 주세요."); result = false; return;};		
	            
	            	return result;
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
                    	boxTitle : "CS 리스트",
                    	sortable: true,                    	
                        pageable: {
                        	messages: {
                        		empty: "표시할 데이터가 없습니다."
                        	}
                        },
                        noRecords: true,
                    	dataSource: new kendo.data.DataSource({
                    		transport: {
                    			read: function(e) {
                    				var param = {
                    					I_NO_MRK: csDataVO.csMrkNameMo,
                    					I_NM_MRKITEM: csDataVO.procName.value,                                    	
                    					I_CD_INQSTAT: csDataVO.csStatusMo,
                    					I_CD_INQCLFT: csDataVO.csQuestionCodeMo,
                    					I_NM_INQ: csDataVO.buyerName.value,
                    					I_NO_MRKORD: csDataVO.orderNo.value,
                    					I_DTS_INQREG_F: new Date(csDataVO.datesetting.period.start.y, csDataVO.datesetting.period.start.m-1, csDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),
                    					I_DTS_INQREG_T: new Date(csDataVO.datesetting.period.end.y, csDataVO.datesetting.period.end.m-1, csDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
                                    };   
                    				if(!$scope.readValidation(param)){
                    					e.error();
                    				}
                    				csInqSvc.csList(param).then(function (res) {      						
                						e.success(res.data);
                					});
                    			},                    			
                    			update: function(e) {
                    				var defer = $q.defer(),
    	                			 	param = e.data.models[0];                    				
                    				csInqSvc.csUpdate(param).then(function(res) {
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
                    			//console.log("변화된 데이터 => ",data.length);
                    		},
                    		pageSize: 11,
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
									    DTS_INQREG: 	   {	
																type: "string", 
																editable: false,
																nullable: true
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
						  									    		if (input.is("[name='DC_ANSCTT']") && input.val() === "") {
			                                                            	input.attr("data-dc_anscttvalidation-msg", "답변 내용을 입력해 주세요.");
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
                       					CD_INQCLFT: 	   {	type: "string", 
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
								   width: 30,
								   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
							    },    
               		            {
								   field: "NO_INQ",
								   title: "문의 번호",
								   width: 30,
								   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"},
               		            },
            		            {
               		        	   field: "NM_MRK",
               		        	   title: "마켓명",
               		        	   width: 100,
               		        	   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
            		            },
            		            {
               		        	   field: "DTS_INQREG",
               		        	   title: "문의등록일시",
               		        	   width: 100,
               		        	   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}            		            
               		            },
	            		        {
           		        	       field: "CD_INQSTAT",
           		        	       title: "상태",
           		        	       width: 50,
           		        	       headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
           		        	    },
            		            {
            		        	   field: "DC_INQTITLE",
            		               title: "문의제목",
            		               width: 120,
            		               headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
            		            },
            		            {
            		        	   field: "DC_INQCTT",
            		               title: "문의내용",
            		               width: 70,
            		               headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}            		            },
            		            {
            		        	   field: "DC_ANSCTT",
            		               title: "답변내용",
            		               width: 80,
            		               headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
            		            },
            		            {
            		        	   field: "DTS_ANSREG",
            		               title: "답변일시",
            		               width: 50,
            		               headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"},           		               
            		            },
            		            {
            		        	   field: "CD_INQCLFT",
            		        	   title: "문의구분",
            		        	   width: 50,
            		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
           		        	    },
           		        	    {
             		        	   field: "NM_INQ",
             		        	   title: "문의자",
             		        	   width: 50,
             		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
            		        	},
        		        	    {
             		        	   field: "NM_MRKITEM",
             		        	   title: "상품명",
             		        	   width: 50,
             		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
            		        	},
        		        	    {
             		        	   field: "NO_MRKORD",
             		        	   title: "주문번호",
             		        	   width: 50,
             		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
            		        	}            		        	
                    	],
                    	dataBound: function(e) {
                            this.expandRow(this.tbody.find("tr.k-master-row").first());// 마스터 테이블을 확장하므로 세부행을 볼 수 있음                                                  
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
                    	resizable: true,
                    	rowTemplate: kendo.template($.trim($("#cs_template").html())),
                    	height: 500       
                    	//모델과 그리드 셀을 제대로 연동 안시키면 수정 팝업 연 후 닫을 때 로우가 사라짐(즉 크레에이트인지 에딧인지 구분을 못함)
                    	//id는 유니크한 모델값으로 해야함 안그러면 cancel 시에 row grid가 중복 되는 현상이 발생
        		};
                                
                //kendo grid 체크박스 옵션
                $scope.onCsGrdCkboxClick = function(e){
	                var element =$(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.cskg,
	                	dataItem = grid.dataItem(row);
	                 	                
	                dataItem.ROW_CHK = checked;
	                
	                if (checked) {
	                	row.addClass("k-state-selected");
	                } else {
	                	row.removeClass("k-state-selected");
	                };
                };
                
                $scope.onCsGridEditClick = function(){            	
                	let grd = $scope.cskg,
	            		chked = grd.element.find("input:checked"),
	            		chkedLeng = grd.element.find("input:checked").length;
                	
                	if(chkedLeng === 1){
                		grd.editRow(chked.closest('tr'));
                	}else if(chkedLeng > 1){
                		//alert("답변 하실 데이터를 1개만 선택해 주세요.");
                		$scope.showPopup("답변 하실 데이터를 1개만 선택해 주세요.");
                	}else if(chkedLeng < 1){
                		//alert("답변 하실 데이터를 선택해 주세요.");
                		$scope.showPopup("답변 하실 데이터를 선택해 주세요.");
                	}
                };	
                
                //alert 경고
                $scope.notf1Options = {
            		position: {
                        // notification popup will scroll together with the other content
                        pinned: false,
                        // the first notification popup will appear 30px from the viewport's top and right edge
                        top: 30,
                        left: 30,
                        height: 300,
                        width: 250
                    },	
                    templates: [{                    	
                        type: "warning",
                        template: $("#notificationTemplate").html()
                    }]
                };

                $scope.ngValue = "[닫기]";

                $scope.showPopup = function (msg) {
                    $scope.notf1.show({
                      kValue: msg
                    }, "warning");
                };               
                
            }]);
}());