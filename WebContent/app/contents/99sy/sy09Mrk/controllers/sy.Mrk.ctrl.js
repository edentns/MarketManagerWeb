(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Mrk.controller : sy.MrkCtrl
     * 마켓관리
     */
    angular.module("sy.Mrk.controller")
        .controller("sy.MrkCtrl", ["$scope", "$http", "$q", "$log", "sy.MrkSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "sy.CodeSvc",
            function ($scope, $http, $q, $log, syMrkSvc, APP_CODE, $timeout, resData, Page, UtilSvc, SyCodeSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            gridHeaderAttributes = {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		            bgColor = "\\#e6f2f8";
                /**
                 * searchVO
                 * # 검색과 관련된 정보.
                 * # 고객사 정보를 검색한다.
                 */
                var dateVO = $scope.dateVO = {
                    boxTitle : "검색",
                    selectedMrkIds     : resData.selectedMrkIds,
                    selectedItlStatIds : resData.selectedItlStatIds,
                    settingMrk : {
	        			id: "NO_MNGMRK",
	        			name: "NM_MRK",
	        			maxNames: 3,
	        		},
	        		settingItlStat : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 2,
	        		},
	        		MrkCodeList    : resData.MrkCodeList,
	        		cdMrkDftDataSource : resData.cdMrkDftDataSource,
	        		cdNtDataSource : resData.cdNtDataSource,
	        		ynUseDataSource : [{
						"NM_DEF": '사용',
						"CD_DEF": 'Y'
						},{
						"NM_DEF": '사용안함',
						"CD_DEF": 'N'
	                }],
	        		ItlStatCodeList: resData.ItlStatCodeList,
	        		datesetting : {
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month'],
						selected   : resData.selectDate.selected,
						period : {
							start : resData.selectDate.start,
							end   : resData.selectDate.end
						}
	        		}
                };
                
                dateVO.doInit = function() {
            		$timeout(function() {
	            		if(!page.isWriteable()){
	    					$("#mrkKg .k-grid-toolbar").hide();
	    				}
	            		
	            		dateVO.isOpen(false);
        			});
					
					$scope.gridMrkVO.dataSource.read();
				};
				
				dateVO.reset = function() {
					dateVO.MrkCodeList.bReset     = true;
					dateVO.ItlStatCodeList.bReset = true;
					dateVO.datesetting.selected   = "1Day";
				};

				dateVO.isOpen = function (val) {
					setTimeout(function () {
                       	if(!page.isWriteable()) {
               				$(".k-grid-delete").addClass("k-state-disabled");
               				$(".k-grid-delete").click(stopEvent);
               				$(".k-grid-연동체크").addClass("k-state-disabled");
               				$(".k-grid-연동체크").click(stopEvent);
               			}
                    });
					
					var searchIdHeight = $("#searchId").height();
	            	var settingHeight = $(window).height() - searchIdHeight - 90;
	            	var pageSizeValue = val? 20 : 24;
	            	
            		$scope.mrkKg.wrapper.height(settingHeight);
            		$scope.mrkKg.resize();
            		gridMrkVO.dataSource.pageSize(pageSizeValue);
	            };
	             
                dateVO.doInquiry = function () {// 검색조건에 해당하는 유저 정보를 가져온다.
                	gridMrkVO.dataSource.read();
                	var param = {
            			MRK_LIST     : dateVO.selectedMrkIds,
            			MRK_SELECT_INDEX : dateVO.MrkCodeList.allSelectNames,
						STAT_LIST    : dateVO.selectedItlStatIds,
						STAT_SELECT_INDEX : dateVO.ItlStatCodeList.allSelectNames,
						PERIOD : UtilSvc.grid.getDateSetting(dateVO.datesetting)
	                };
        			// 검색조건 세션스토리지에 임시 저장
        			UtilSvc.grid.setInquiryParam(param);
                };
                		        
                //새로 저장시 유효성 검사 (수정 할 땐 비밀번호를 따로 입력할 필요할 없어서 required 하지 않아서 저장시 따로 함수를 만듦 kendo로는  editable true 일때만 됨)
                var isValid = function(inputs){
                	var checkReturn = true;
                	angular.forEach(inputs.data, function (obj) {
                		if (!checkReturn) return;
                        if (obj.NM_MRK === null || obj.NM_MRK === "") {alert("마켓명을 입력해 주세요"); checkReturn = false;}
                        else if(obj.DC_MRKID === null || obj.DC_MRKID === ""){alert("마켓ID를 입력해 주세요"); checkReturn = false;}
                        else if(obj.NEW_DC_PWD === null || obj.NEW_DC_PWD === ""){alert("비밀번호를 입력해 주세요"); checkReturn = false;}
                    });
                	return checkReturn;
                };    
                
                var gridMrkVO = $scope.gridMrkVO = {
                    messages: {
                        noRows: "마켓정보가 존재하지 않습니다.",
                        loading: "마켓정보를 가져오는 중...",
                        requestFailed: "요청 마켓정보를 가져오는 중 오류가 발생하였습니다.",
                        retry: "갱신",
                        commands: {
                            create: '추가',
                            destroy: '삭제',
                            save: '저장',
                            cancel: '취소'
                        }
                    },
                    edit: function (e) {
                        if (e.model.isNew()) {
                        	if(e.model.YN_USE == ""){
                        		e.model.set("YN_USE", "Y");
                        		e.model.set("CD_ITLSTAT", "001");
                        	}
                        }
            		},
                	boxTitle : "마켓 정보",                 	
                    pageable: {
                    	messages: UtilSvc.gridPageableMessages
                    },
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				var param = {
                						procedureParam: "USP_SY_09MRK02_GET&L_LIST01@s|L_LIST02@s|L_START_DATE@s|L_END_DATE@s",
                						L_LIST01      : dateVO.selectedMrkIds,
                						L_LIST02      : dateVO.selectedItlStatIds,
                						L_START_DATE  : new Date(dateVO.datesetting.period.start.y, dateVO.datesetting.period.start.m-1, dateVO.datesetting.period.start.d).dateFormat("Ymd"),
                						L_END_DATE    : new Date(dateVO.datesetting.period.end.y  , dateVO.datesetting.period.end.m-1  , dateVO.datesetting.period.end.d).dateFormat("Ymd")
                					};
            					UtilSvc.getList(param).then(function (res) {
            						e.success(res.data.results[0]);

            	    				setTimeout(function () {
            	                       	if(!page.isWriteable()) {
            	               				$(".k-grid-delete").addClass("k-state-disabled");
            	               				$(".k-grid-delete").click(stopEvent);
            	               				$(".k-grid-연동체크").addClass("k-state-disabled");
            	               				$(".k-grid-연동체크").click(stopEvent);
            	               			}
            	                    });
            					});
                			},
	                		create: function(e) {
	                			var defer = $q.defer();
	                			var param = {
                                	data: e.data.models
                                };
	                			
	                			if(!isValid(param)) {
	                				e.error([]);
	                				return false; 
	                			};
	                			
	                			syMrkSvc.saveUserMrk(e.data.models, "I").success(function () {
	                				defer.resolve();
	                				gridMrkVO.dataSource.read();
	                            }).error(function() {
                                	defer.resolve();
	                				e.error([]);
								});
	                			
	                			return defer.promise;
	            			},
                			update: function(e) {
                				var defer = $q.defer();
	                			var param = {
                                	data: e.data.models
                                };
	                			
	                			if(!isValid(param)) { 
            						e.error([]);
	                				return false; 
	                			};
	                			syMrkSvc.saveUserMrk(e.data.models, "U").success(function () {
	                				defer.resolve();
	                				gridMrkVO.dataSource.read();
	                            }).error(function() {
                                	defer.resolve();
	                				e.error([]);
								});;
	                			
	                			return defer.promise;
                			},
                			destroy: function(e) {
                				var defer = $q.defer();
                				syMrkSvc.saveUserMrk(e.data.models, "D").success(function () {
            						defer.resolve();
            						gridMrkVO.dataSource.read();
                                }).error(function() {
                                	defer.resolve();
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
                		pageSize: 20,
                		schema: {
                			model: {
                    			id: "NO_MNGMRK",
                				fields: {
                					ROW_NUM:     	{ 
				                						type: "number"
				                					   ,editable: false 
                					},
                					NO_MNGMRK:   	{ 
				                						 type: "string" 
					                					,editable: true
					    								,validation: {
					    									no_mngmrkvalidation: function (input) {
											    	    	     if (input.is("[name='NO_MNGMRK']") && !input.val()) {
				                                                	 input.attr("data-no_mngmrkvalidation-msg", "관리마켓을 설정해 주세요.");
				                                                	 return false;
					                                             }
					                                             return true;
												    	    }
											             }
                					},
                					NM_MRK:      	{ 
				                						 type: "string"
					                					,editable: true
					    								,validation: {
					    									nm_mrkvalidation: function (input) {
											    	    	     if (input.is("[name='NM_MRK']") && !input.val()) {
					                                            	 input.attr("data-nm_mrkvalidation-msg", "마켓명을 입력하여 주세요.");
					                                            	 return false;
					                                             }
					                                             return true;
												    	    }
											             }
									},
                					NM_MRKDFT:   	{ type: "string", editable: false },
                					DT_ITLSTART: 	{ type: "string", editable: false },
                					DT_ITLSTART_RE: { type: "string", editable: false },
                					CD_ITLSTAT:  	{ type: "string", editable: false },
                					DC_MRKID:    	{ type: "string", editable: true, validation: { required: {message: "마켓ID를 입력하여 주세요."} } },
                					DC_PWD:      	{ type: "string" },
                					NEW_DC_PWD:  	{
				                						type: "string"
													   ,validation: {
														    new_dc_pwdvalidation: function (input) {													    	
																if (input.is("[name='NEW_DC_PWD']") && input.val()){
																	var regex = /\s/g;
																	input.attr("data-new_dc_pwdvalidation-msg", "비밀번호를 50자 이하로 설정하거나, 공백을 제거하고 설정해 주세요.");
																	return regex.test(input.val()) === true || input.val().length > 50 ? false : true;
																}
																return true;
															}
														}
														,editable: true
														,nullable: false
        							},
                					NM_SHOP   : 	{
		                								 type: "string"
		                								,editable: true
		                								,nullable: true
		                								,validation: {
												    	     nm_shopvalidation: function (input) {
											    	    	     if (input.is("[name='NM_SHOP']") && input.val() != "") {
											    	    	    	 var row = input.closest("tr");
											    	    	         var grid = row.closest("[data-role=grid]").data("kendoGrid");
											    	    	         var dataItem = grid.dataItem(row);
											    	    	         
			                                                    	 if(dataItem.NO_MNGMRK != "SYMM170101_00002") {
			                                                        	 input.attr("data-nm_shopvalidation-msg", "샵명칭은 스토어팜일경우만 입력가능합니다.");
				                                                    	 return false;
			                                                    	 }
			                                                    	 return true;
			                                                     }
			                                                     return true;
												    	     }
											             }
        							},
                					API_KEY:     	{ 
                										type: "string" 
                								 	},
                					NEW_API_KEY: 	{
	     				    			   				type: "string"
	     				    			   			   ,defaultValue: ""
	     				    			   			   ,validation: {
	     				    			   				   new_api_keydvalidation: function (input) {
	     				    			   					   if (input.is("[name='NEW_API_KEY']") && input.val() != "") {
	     				    			   						   var regex = /\s/g;
	     				    			   						   input.attr("data-new_api_keydvalidation-msg", "API KEY를 50자 이하로 설정하거나, 공백을 제거하고 설정해 주세요.");			                                                	  
	     				    			   						   return regex.test(input.val()) === true || input.val().length > 50 ? false : true;
	     				    			   					   	}			                                                  
	     				    			   					   return true;
	     				    			   				   }
	     				    			   			   	}
				       							  	  ,editable: true
				       							  	  ,nullable: true
                								  	},
                					DC_SALEMNGURL: 	{type: "string", editable: false},
                					YN_USE:     	{type: "string" },
                					NM_NT:      	{type: "string", editable: false},
                					DTS_INSERT: 	{type: "string", editable: false},
                					DTS_UPDATE: 	{type: "string", editable: false},
                					NM_UPDATE : 	{type: "string", editable: false}
                				}
                			}
                		}
                	}),
                	navigatable: true,
                	autoBind: false,
                	resizable: true,
                	toolbar: 
                		["create", "save", "cancel"],
                	columns: [
								{
									field : "ROW_NUM",
									title : "No",
									width : 50,
									template : "<span class='row-number'></span>",
									headerAttributes : gridHeaderAttributes
								},
								{
									field : "NO_MNGMRK",
									title : "<span class='form-required'>* </span>관리마켓",
									width : 100,
									headerAttributes : gridHeaderAttributes,
									attributes : {
										style : "background-color:"+ bgColor + ";"
									},
									editor : function(container, options) {
										gridMrkVO.dropDownEditor(container,options,dateVO.MrkCodeList,[ "NM_MRK",	"NO_MNGMRK" ]);
									},
									template : function(e) {
										var nmd = (!e.NM_MRK.hasOwnProperty("NO_MNGMRK")) ? e.NM_MRK : "";
										var grdData = dateVO.MrkCodeList;
										
										for (var i = 0, leng = grdData.length; i < leng; i++) {
											if (grdData[i].NO_MNGMRK === e.NO_MNGMRK) {
												nmd = grdData[i].NM_MRK;
												if (e.DC_SALEMNGURL === '')
													e.DC_SALEMNGURL = grdData[i].DC_SALEMNGURL;
												if (e.NM_MRKDFT === '')
													e.NM_MRKDFT = grdData[i].NM_MRKDFT;
												if (e.NM_NT === '')
													e.NM_NT = grdData[i].NM_NT;
											}
										}
										return nmd;
									}
								},
								{
									field : "NM_MRK",
									title : "<span class='form-required'>* </span>마켓명",
									width : 100,
									headerAttributes : gridHeaderAttributes,
									attributes : {
										style : "background-color:"+ bgColor + ";"
									}
								},
								{
									field : "NM_MRKDFT",
									title : "마켓구분",
									width : 100,
									headerAttributes : gridHeaderAttributes
								},
								{
									field : "DT_ITLSTART",
									title : "최초연동일자",
									width : 90,
									headerAttributes : gridHeaderAttributes
								},
								{
									field : "DT_ITLSTART_RE",
									title : "재연동일자",
									width : 90,
									headerAttributes : gridHeaderAttributes
								},
								{
									field : "CD_ITLSTAT",
									title : "연동상태",
									width : 80,
									editor : function(container,options) {
										gridMrkVO.dropDownEditor(container, options, dateVO.ItlStatCodeList,[ "NM_DEF","CD_DEF" ]);
									},
									template : function(e) {
										return gridMrkVO.fTemplate(e, dateVO.ItlStatCodeList,["CD_DEF", "NM_DEF","CD_ITLSTAT" ]);
									},
									headerAttributes : gridHeaderAttributes
								},
								{
									field : "DC_MRKID",
									title : "<span class='form-required'>* </span>마켓ID",
									width : 100,
									headerAttributes : gridHeaderAttributes,
									attributes : {
										class : "ta-l",
										style : "background-color:"+ bgColor + ";"
									}
								},
								{
									field : "NEW_DC_PWD",
									title : "<span class='form-required'>* </span>비밀번호",
									width : 140, 
									editor : function(container, options) {
										$('<input type="password" class="k-textbox"' + 
													' is-caps-lock ' +													
														'required="required" data-required-msg="비밀번호를 입력하여 주세요." name="'+ options.field+ '"/>').appendTo(container);										
									},
									template : function(e) {
										var returnPWDMsg = "";
										if (e.NEW_DC_PWD == ""|| e.NEW_DC_PWD == null&& e.DC_PWD != "") {
											if (e.DC_PWD_LEN != null)returnPWDMsg = Array(e.DC_PWD_LEN + 1).join("*");
										} 
										else if (e.NEW_DC_PWD != "" && e.NEW_DC_PWD != null) {
											returnPWDMsg = Array(e.NEW_DC_PWD.length + 1).join("*");
										}
										return returnPWDMsg;
									},
									headerAttributes : gridHeaderAttributes,
									attributes : {
										class : "ta-l",
										style : "background-color:"+ bgColor + ";"
									}
								},
							    {
		    	   					field: "NM_SHOP",      
		    	   					title: "샵명칭",    
		    	   					width: 100,
		           	   				headerAttributes: gridHeaderAttributes, 
		           	   				attributes:{
		           	   					class:"ta-l nm-shop", 
		           	   					style:"background-color:"+bgColor+";"
		           	   				}
	    	   				    },
	        		            {		
	       	   						field: "NEW_API_KEY",     
	       	   						title: "API_KEY",  
	       	   						width: 100,
	       	   						editor: function (container, options) {
	       	   							$('<input type="password" class="k-textbox" name="' + options.field + '"/>').appendTo(container);
	       	   						},
           	   						template: function(e){
           	   							var returnAPIMsg = "";
           	   								if(e.NEW_API_KEY == "" || e.NEW_API_KEY == null && e.API_KEY != ""){
           	   									if(e.API_KEY_LEN != null) returnAPIMsg = Array(e.API_KEY_LEN + 1).join("*");
           	   								}
           	   								else if(e.NEW_API_KEY != "" && e.NEW_API_KEY != null){
           	   									returnAPIMsg = Array(e.NEW_API_KEY.length + 1).join("*");
           	   								}
           	   							return returnAPIMsg;
           	   						},
           	   						headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l", style:"background-color:"+bgColor+";"}
           	   					},
           	   					{
           	   						field: "DC_SALEMNGURL", 
           	   						title: "판매관리URL", 
           	   						width: 250,
           	   						headerAttributes: gridHeaderAttributes,
           	   						attributes: {class:"ta-l", style:"text-overflow:ellipsis; white-space:nowrap; overflow:hidden;"},
           	   						template: "<a href='#: DC_SALEMNGURL #' target='_blank'>#: DC_SALEMNGURL #</a>"
           	   					},
           	   					{
           	   						field: "YN_USE",      
           	   						title: "사용여부",    
           	   						width: 80,
		          		       	  	editor: function(container, options) {
		          		       	  		gridMrkVO.dropDownEditor(container, options, dateVO.ynUseDataSource, ["NM_DEF","CD_DEF"]);
		           		        	},   
			   	   				    template: function(e){
		          		       	   		return gridMrkVO.fTemplate(e, dateVO.ynUseDataSource, ["CD_DEF", "NM_DEF", "YN_USE"]);
		          		       	  	},
		          		       	  	headerAttributes: gridHeaderAttributes, attributes:{style:"background-color:"+bgColor+";"}
		          		       	 },
		          		       	 {
		          		       		 field: "NM_NT",      
		          		       		 title: "국가",   
		          		       		 width: 80, 
		          		       		 headerAttributes: gridHeaderAttributes
		          		       	 },
	        		            {command: [{text:"연동체크", click: checkCon }, "destroy"], width: 160, attributes:{class:"ta-l"}},
                	],
                    collapse: function(e) {
                        // console.log(e.sender);
                        this.cancelRow();
                    },
                    editable: {confirmation:!page.isWriteable()?false:"삭제하시겠습니까?\n삭제 후 저장버튼을 클릭하셔야 삭제 됩니다."},
                    dataBound: function () {
                        var rows = this.items();
                        $(rows).each(function () {
                            var index = $(this).index() + 1;
                            var rowLabel = $(this).find(".row-number");
                            $(rowLabel).html(index);
                        });
                    },
                	height: 657
                };
                
                gridMrkVO.tooltipOptions = {
            		filter: "td:nth-child(9)",
            		position: "right",
            		content: "샵명칭은 오픈마켓과 동일하게 입력하셔야 연동성공이 이루어집니다.",
            	    width: 400,
            	    height: 30
        	    };
                
                gridMrkVO.dropDownEditor = function(container, options, objDataSource, arrField) {
		       		$('<input required name='+ options.field +' data-bind="value:' + options.field + '" />')
		    		.appendTo(container)
		    		.kendoDropDownList({
		    			autoBind: true,
		    			dataTextField: arrField[0],
                        dataValueField: arrField[1],
		    			dataSource: objDataSource,
		    			valuePrimitive: true
		    		});
                };
                
                gridMrkVO.fTemplate = function(e, objDataSource, arrField) {
                	var nmd = (!e[arrField[2]].hasOwnProperty(arrField[0])) ?  e[arrField[2]] : "";
	       		    var grdData = objDataSource;	
		       		for(var i = 0, leng=grdData.length; i<leng; i++){
		       			if(grdData[i][arrField[0]] === e[arrField[2]]){
		       				nmd = grdData[i][arrField[1]];
		       				break;
		       			}
		       		}
                	return nmd;
                };
                
                function checkCon(e) {
                	e.preventDefault();
                	var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                	
                	if(dataItem.NO_MRK == undefined || dataItem.NO_MRK == '') {
                		alert('저장 후에 연동 버튼을 클릭하여 주세요.');
                		return;
                	}
                	/*if(dataItem.CD_ITLSTAT == '003' && dataItem.YN_IDPWDCHG == 'N') {
                		alert('오픈마켓 비밀번호를 수정하신 후 연동체크를 해주세요.');
                		return;
                	}*/
                	
                	var param = {
                    	NO_MNGMRK: dataItem.NO_MNGMRK,
                    	DC_MRKID: dataItem.DC_MRKID,
                    	NM_SHOP: dataItem.NM_SHOP
                    };
                	
                	syMrkSvc.conMrk(param, e).then(function(res) {
        				//defer.resolve();
        				alert( res.data );
        				gridMrkVO.dataSource.read();
        			},function(res){
        				gridMrkVO.dataSource.read();
        			});
                };

                dateVO.doInit();

                function stopEvent(e) {
                	e.preventDefault();
                	e.stopPropagation();
                }
                                
                setTimeout(function () {
                	if(!page.isWriteable()) {
        				$(".k-grid-add").addClass("k-state-disabled");
        				$(".k-grid-save-changes").addClass("k-state-disabled");
        				$(".k-grid-cancel-changes").addClass("k-state-disabled");
        				$(".k-grid-add").click(stopEvent);
        				$(".k-grid-save-changes").click(stopEvent);
        				$(".k-grid-cancel-changes").click(stopEvent);
        			}
                });
            }]);
}());