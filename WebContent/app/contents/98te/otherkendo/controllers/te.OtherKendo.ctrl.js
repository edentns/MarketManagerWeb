(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name te.OtherKendo.controller : te.OtherKendoCtrl
     * 부서관리
     */
    angular.module("te.OtherKendo.controller", [ 'kendo.directives', 'ngGrid' ])
        .controller("te.OtherKendoCtrl", ["$timeout", "$log", "APP_CONFIG", "$http", "$scope", "$q", "sy.CodeSvc", "te.OtherKendoSvc", "resData", "Page", "$state", 'MenuSvc', "$location", "$window", "UtilSvc", "APP_CODE", "sa.ShpSbOrdImpSvc", "Util03saSvc", 
            function ($timeout, $log, APP_CONFIG, $http, $scope, $q, SyCodeSvc, TeOtherKendoSvc, resData, Page, $state, MenuSvc, $location, window, UtilSvc, APP_CODE, saShpSbOrdImpSvc, Util03saSvc) {
	        	var page  = $scope.page = new Page({ auth: resData.access }),
	            today = edt.getToday();

	        	var otherKendoVO1 = $scope.otherKendoVO1 = {
	        		menualShwWrn : "",	
	        		boxTitle : "검색",
	        		mcb01Data : [],
	        		mcb01Model : "",
	        		setting : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 2
	        		},
	        		mcb02Data : [],
	        		mcb02Model : "",
	        		selectedSaStatIds : [],
	        		saStatDataSource : [],
	        		datesetting : {
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month'],
						selected   : 'current',
						period : {
							start : angular.copy(today),
							end   : angular.copy(today)
						}
	        		},
	        		perTpCdList : [{CD:'1',NAME:'주문일자'},{CD:'2',NAME:'결제일자'}],
	        		file999VO: {
	        			CD_AT:'999',
	        			limitCnt: 1,
	        			bImage: true,
	        			imgWidth: '211px',
	        			imgHeight: '100px',
	        			bDisabled: true,
	        			currentData:{
	        				CD_AT: "999",
	        				CD_REF1: "SYEM00000001",
	        				CD_REF2: "",
	        				CD_REF3: null,
	        				CD_REF4: null,
	        				CD_REF5: "",
	        				DTS_INSERT: null,
	        				DTS_UPDATE: null,
	        				NM_FILE: "logo.png",
	        				NM_FILEPATH: "http://localhost:8090/img/999/201706/27c862e752414ad197ecc9a9b0b52236.png",
	        				NO_AT: 13,
	        				NO_C: "10000",
	        				NO_INSERT: "SYEM00000001",
	        				NO_UPDATE: null,
	        				SZ_FILE: "15858",
	        				YN_DEL: null
	        			}
	        		},
	        		file998VO: {
	        			CD_AT:'998',
	        			limitCnt: 1
//	        			currentData:{
//	        				CD_AT: "999",
//	        				CD_REF1: "SYEM00000001",
//	        				CD_REF2: "",
//	        				CD_REF3: null,
//	        				CD_REF4: null,
//	        				CD_REF5: "",
//	        				DTS_INSERT: null,
//	        				DTS_UPDATE: null,
//	        				NM_FILE: "BreezeWay-master-4386c9670a30e7e940713918b16274bf3f7ea068.zip",
//	        				NO_AT: 2,
//	        				NO_C: "10000",
//	        				NO_INSERT: "SYEM00000001",
//	        				NO_UPDATE: null,
//	        				SZ_FILE: "6342204",
//	        				YN_DEL: null
//	        			}
	        		},
	        		file997VO: {
	        			CD_AT:'997',
	        			limitCnt: 10,
	        			bDisabled: true,
	        			currentDataList:[{
	        				CD_AT: "997",
	        				CD_REF1: "SYEM00000001",
	        				CD_REF2: "",
	        				CD_REF3: null,
	        				CD_REF4: null,
	        				CD_REF5: "",
	        				DTS_INSERT: null,
	        				DTS_UPDATE: null,
	        				NM_FILE: "SmsBackup.csv",
	        				NO_AT: 6,
	        				NO_C: "10000",
	        				NO_INSERT: "SYEM00000001",
	        				NO_UPDATE: null,
	        				SZ_FILE: "1733624",
	        				YN_DEL: null
	        			},
	        			{
	        				CD_AT: "997",
	        				CD_REF1: "SYEM00000001",
	        				CD_REF2: "",
	        				CD_REF3: null,
	        				CD_REF4: null,
	        				CD_REF5: "",
	        				DTS_INSERT: null,
	        				DTS_UPDATE: null,
	        				NM_FILE: "my.ini",
	        				NO_AT: 8,
	        				NO_C: "10000",
	        				NO_INSERT: "SYEM00000001",
	        				NO_UPDATE: null,
	        				SZ_FILE: "447",
	        				YN_DEL: null
	        			}]
	        		},
	        	};
	        	
	        	otherKendoVO1.fileSave = function() {
	        		if(otherKendoVO1.file999VO.dirty) {
		        		otherKendoVO1.file999VO.CD_REF1 = 'SYEM00000001';
		        		otherKendoVO1.file999VO.doUpload(function(){
//			        		if(otherKendoVO1.file998VO.dirty) {
//				        		otherKendoVO1.file998VO.CD_REF1 = 'SYEM00000001';
//				        		otherKendoVO1.file998VO.doUpload(function(){
//				        			alert('성공하였습니다.');
//				        		}, function() {
//				        			alert('998 첨부파일업로드 실패하였습니다.');
//				        		});
//			        		}
//			        		else {
//			        			alert('성공하였습니다.');
//			        		}
		        			alert('성공하였습니다.');
		        		}, function() {
		        			alert('999 첨부파일업로드 실패하였습니다.');
		        		});
	        		}
	        		else {
	        			alert('성공하였습니다.');
	        		}
//	        		if(otherKendoVO1.file997VO.dirty) {
//		        		otherKendoVO1.file997VO.CD_REF1 = 'SYEM00000001';
//		        		otherKendoVO1.file997VO.doUpload(function(){
//			        		alert('성공하였습니다.');
//		        		}, function() {
//		        			alert('997 첨부파일업로드 실패하였습니다.');
//		        		});
//	        		}
//	        		else {
//	        			alert('성공하였습니다.');
//	        		}
	        	};
	        	
	        	otherKendoVO1.initLoad = function() {
	        		var self = this;
	        		self.inquiry();
	        		
					var param = {
						procedureParam:"USP_SY_10CODE02_GET&L_NO_MNGCDHD@s|L_CD_CLS@s",
						L_NO_MNGCDHD:"SYCH00001",
						L_CD_CLS:"SY_000001"
					};
					UtilSvc.getList(param).then(function (res) {
						otherKendoVO1.mcb01Data = res.data.results[0];
						otherKendoVO1.mcb02Data = res.data.results[0];
					});
					
					var parcelParam = {
							procedureParam:"USP_TE_OTHERKENDO04_GET"
						};
					UtilSvc.getList(parcelParam).then(function (res) {
						otherKendoVO1.mcb03Data = res.data.results[0].filter(function(ele){
							return (ele.DC_RMK2);
						});
					});
	        	};
	        	
	        	otherKendoVO1.inquiry = function() {
	        		var self = this;
	        		var param = {
						procedureParam:"USP_TE_OTHERKENDO01_GET&sFromDt@s|L_LIST01@s|L_LIST02@s",
						sFromDt:"20161215",
						L_LIST01:self.mcb01Model,
						L_LIST02:self.mcb02Model
					};
					UtilSvc.getList(param).then(function (res) {
						gridSampleVO.dataSource.data(res.data.results[0]);
						gridSampleVO_test.dataSource.data(res.data.results[0]);
					});
	        	};
	        	
	        	otherKendoVO1.initParam = function() {
	        	};
	        	
	        	var gridSampleVO = $scope.gridSampleVO = {
        			messages: {
        				noRows: "정보가 존재하지 않습니다.",
        				loading: "정보를 가져오는 중...",
        				requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
        				retry: "갱신",
        			},
        			boxTitle: "Sample grid",
        			dataSource: new kendo.data.DataSource({
        				autoBind: false,
        				transport: {
        					read: function(e) {
        					}
        				},
        				pageSize: 6,
        				schema: {
        					model: {
        						NO_C: {},
        						CD_CLS: {},
        						CD_DEF: {},
        						NM_DEF: {}
        					}
        				}
        			}),
        			columns: [
              			    {field: "NO_C"  , width: 100, title: "가입자번호"},
            			    {field: "CD_CLS", width: 100, title: "코드해더"},
            			    {field: "CD_DEF", width: 100, title: "코드디테일"},
            			    {field: "NM_DEF", width: 100, title: "코드명"}
            		],
        			pageable: {
        				buttonCount: 10
        			},
        			selectable: "multiple cell",
        			allowCopy: true,
        			navigatable: true,
        			editable: true,
        			resizable: true,
        			columnMenu: true,
        			height: 450
	        	};
	        	var gridSampleVO_test = $scope.gridSampleVO_test = {
	        			messages: {
	        				noRows: "정보가 존재하지 않습니다.",
	        				loading: "정보를 가져오는 중...",
	        				requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
	        				retry: "갱신",
	        			},
	        			boxTitle: "Sample grid",
	        			dataSource: new kendo.data.DataSource({
	        				autoBind: false,
	        				transport: {
	        					read: function(e) {
	        						var param = {
        								procedureParam:"USP_TE_OTHERKENDO01_GET&sFromDt@s|L_LIST01@s|L_LIST02@s",
        								sFromDt:"20161215",
        								L_LIST01:self.mcb01Model,
        								L_LIST02:self.mcb02Model
        							};
        							UtilSvc.getList(param).then(function (res) {
        								//e.success()
        								gridSampleVO.dataSource.data(res.data.results[0]);
        								gridSampleVO_test.dataSource.data(res.data.results[0]);
        							})
	        					},
	                			parameterMap: function(e, operation) {
	                				if(operation !== "read" && e.models) {
	                					return {models:kendo.stringify(e.models)};
	                				}
	                			}
	        				},
	        				pageSize: 6,
	        				schema: {
	        					model: {
	        						DC_CHECK: {},
	        						NO_C: {},
	        						CD_CLS: {},
	        						CD_DEF: {},
	        						NM_DEF: {}
	        					}
	        				}
	        			}),
	                	dataBound:function(e) {
	                		//var grid = e.sender;
	                		//grid.select("tr:eq(1)");
	                	},
	        			columns: [
	        			    {field: "DC_CHECK" , width: 20, title: "선택"},
	        			    {field: "NO_C"  , width: 100, title: "가입자번호",
	        			     columns: [{field: "CD_DEF", width: 100, title: "코드디테일"}]},
	        			    {field: "CD_CLS", width: 100, title: "코드해더",
	        			     columns: [{field: "NM_DEF", width: 100, title: "코드명"}]}
	        			],
	        			pageable: {
	        				buttonCount: 10
	        			},
	        			rowTemplate: '<tr><td rowspan="2"><input type="checkbox" name="#=DC_CHECK#" value="0" id="#=DC_CHECK#"></td><td title="1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"><div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap">1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890</div></td><td>#=CD_CLS#</td></tr><tr><td>#=CD_DEF#</td><td>#=NM_DEF#</td></tr>',
	        			altRowTemplate: '<tr class="k-alt"><td rowspan="2"><input type="checkbox" name="#=DC_CHECK#" value="0" id="#=DC_CHECK#"></td><td>#=NO_C#</td><td>#=CD_CLS#</td></tr><tr class="k-alt"><td>#=CD_DEF#</td><td>#=NM_DEF#</td></tr>',
	        			height: 450
		        	};
	        	
	        	var tstShpVo = $scope.tstShpVo = {
            		//autoBind: true,
                    messages: {                        	
                        requestFailed: "주문정보를 가져오는 중 오류가 발생하였습니다.",
                        commands: {
                            save: "저장",
                            canceledit: "닫기",
                            create : "추가"
                        }
                        ,noRecords: "검색된 데이터가 없습니다."
                    },
                	boxTitle : "주문 목록",           
                    collapse: function(e) {
                        this.cancelRow();
                    },
                    pageable: true,
                    scrollable: false,
                    persistSelection: true,
                    sortable: true,                    
                	resizable: true,
                    editable: true,
                	height: 300,
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: ["create","save","cancel"],
                	dataSource: new kendo.data.DataSource({
                		transport: {
                		/*	read: function(e){
                				var db = [{NO_ORD: "", CD_PARS: {NM_DEF : "", DC_RMK2 : ""}, NO_INVO : ""}, 
                     			          {NO_ORD: "", CD_PARS: {NM_DEF : "", DC_RMK2 : ""}, NO_INVO : ""}, 
                    			          {NO_ORD: "", CD_PARS: {NM_DEF : "", DC_RMK2 : ""}, NO_INVO : ""}];
                				e.success(db);
                			},     */         		
                			read: function(e){
                				e.success([]);
                			},
                			create : function(e){
                				var param = [],
	            					startTime = new Date(),
	            					defer = $q.defer();		
                				
                				param = e.data.models.filter(function(ele){
                					return otherKendoVO1.selectedSequance.indexOf(ele.NO_ORD) > -1;
                				});                				
                				
            					TeOtherKendoSvc.parcelUpdate(param).then(function (res) {                 						
            						var rtn = res.data,
            							f = [], t=[];
            						
            						angular.forEach(rtn, function(item, index){
            							if(item.result === 'Y'){
            								 t.push(angular.copy(item.noOrd))
            							}else{
            								 f.push(angular.copy(item.noOrd))
            							}
            						});
            						
            						alert("성공 번호 = "+t+" 실패 번호 = "+f);
            						
            						var endTime = new Date(),
    						    		crTime = (endTime - startTime)/1000;
            					
	            					$log.info("경과시간 = "+crTime+"초");
	            					alert("경과시간 = "+crTime+"초");
	            					
	                				e.success([]);
	                			}, function(err){
	                				if(err.status !== 412){
                                    	alert(err.data);
                                   	} 
                                   	$log.error(err.data);
            						e.error([]);
            					});  
	            				return defer.promise;
                			},  
                			parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
                		},
                		batch: true,
                        change: function(e){
                        	var data = this.data(),
         			   	   		i = 0,
         			   	   		sum = 0;
         			
		 					for(i; i<data.length; i+=1){
		 						sum += 1;
		 						data[i].NO_ORD = sum;
		 					};		   
                        },
                		schema: {
                			model: {
                    			id: "NO_ORD",
                				fields: {   
                					NO_ORD : 		   {
                											type : "string",
                											editable: false,
															nullable: false,
                									   },
                				    CD_PARS: 	   	   {
					                				    	type: "array",
															editable: true,
															nullable: false,
															defaultValue : {NM_DEF : "", DC_RMK2 : ""}
								    				   },
			    				    NO_INVO: 	       {
					                				    	type: "string", 
															editable: true,
															nullable: false,
															validation: {
																no_invo_non_blank_validation: function (input) {
																	if (input.is("[name='NO_INVO']")) {
																		return Util03saSvc.NoINVOValidation(input, 'NO_INVO', 'no_invo_non_blank_validation');
																	};
																	return true;
				  									    	  	}
															}
															
								    				   }
                				}
                			}
                		},
                	}),
                	change: function(e){
                      	$log.info("The selected product ids are: [" + this.selectedKeyNames().join(", ") + "]");
                      	otherKendoVO1.selectedSequance = this.selectedKeyNames().join(", ");
                	},
                	columns: [	
                	          	{ 
                	          		selectable: true, 
                	          		width: "30px" 
                	          	},
                	          	{
                	          		field: "NO_ORD",
                                    title: "번호",
                                    width: 50,
			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
                	          	},	
                                {
		                        	field: "CD_PARS",
		                            title: "<span class='form-required'>*</span>택배사",
		                            width: 100,
		                            editor: function shipCategoryDropDownEditor(container, options) {		                            	
		                            	$('<input name="' + options.field + '" data-bind="value:' + options.field + '"/>').appendTo(container).kendoDropDownList({
		                                    dataTextField: "NM_DEF",
		                                    dataValueField: "DC_RMK2",
		                                    valuePrimitive: false,
		                                    optionLabel : "택배사를 선택해 주세요 ",
		                                    dataSource: otherKendoVO1.mcb03Data
		                                });
		                            },
		                            template : "#=CD_PARS.NM_DEF#",
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
		                        },
                               	{
                                    field: "NO_INVO",
                                    title: "<span class='form-required'>*</span>송장번호",
                                    width: 150,
                                    attributes: {                                    	
                                    	"menual-shw-wrn" : "otherKendoVO1.menualShwWrn" 
                                    }, 
                                    editor: function(container, options){
                                    	$('<input class="k-textbox" name="' + options.field + '" data-bind="value: NO_INVO" autocomplete=off />').appendTo(container);                                    	
                                    },
			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}                  
		                        }  
                    ]                	          	
	        	};     
	        	
	        	function testDropDownEditor(container, options) {
	        		$('<input required name="' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                        autoBind: false,
                        dataTextField: "CD_DEF",
                        dataValueField: "NM_DEF",
                        dataSource: {
                            type: "odata",
                            read: function(e) {
        						var param = {
        							procedureParam:"USP_TE_OTHERKENDO02_GET&L_CD_CLS@s",
        							L_CD_CLS:"SY_000001"
        						};
        						UtilSvc.getList(param).then(function (res) {
        							e.success(res.data.results[0]);
        						});
        					},
        					schema: {
        						model: {
            						CD_DEF: {},
            						NM_DEF: {}        							
        						}
        					}
                        }
                    });
	        	}
	        	otherKendoVO1.initLoad();
        	}
        ]);
}());