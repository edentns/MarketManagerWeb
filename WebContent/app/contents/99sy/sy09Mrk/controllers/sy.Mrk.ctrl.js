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
		            gridHeaderAttributes = {"class": "table-header-cell", style: "text-align: center; font-size: 12px"};
                /**
                 * searchVO
                 * # 검색과 관련된 정보.
                 * # 고객사 정보를 검색한다.
                 */
                var dateVO = $scope.dateVO = {
                    boxTitle : "검색",
                    selectedMrkIds     : '*',
                    selectedItlStatIds : '*',
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
	        		MrkCodeList    : [],
	        		cdMrkDftDataSource : resData.cdMrkDftDataSource,
	        		cdNtDataSource : resData.cdNtDataSource,
	        		ynUseDataSource : [{
						"NM_DEF": '사용',
						"CD_DEF": 'Y'
						},{
						"NM_DEF": '사용안함',
						"CD_DEF": 'N'
	                }],
	        		ItlStatCodeList: [],
	        		datesetting : {
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month'],
						selected   : '1Day',
						period : {
							start : angular.copy(today),
							end   : angular.copy(today)
						}
	        		}
                };
                
                dateVO.doInit = function() {
					var param = {
                            procedureParam: "USP_SY_09MRK01_GET"
                    	};
					dateVO.getSubCodeList( {cd: "SY_000017", search: "all"} );
					dateVO.getSubCodeList( param );
					
					// 이전에 검색조건을 세션에 저장된 것을 가져옴
            		var history = UtilSvc.grid.getInquiryParam();
					
            		$timeout(function() {
	            		if(!page.isWriteable()){
	    					$("#mrkKg .k-grid-toolbar").hide();
	    				}
        			});
					
            		$timeout(function() {
						if(history){
		            		dateVO.selectedMrkIds = history.MRK_LIST;
	            			dateVO.MrkCodeList.setSelectNames = history.MRK_SELECT_INDEX;
							dateVO.selectedItlStatIds = history.STAT_LIST;
							dateVO.ItlStatCodeList.setSelectNames = history.STAT_SELECT_INDEX;
							dateVO.datesetting.period.start = history.START_DATE;
							dateVO.datesetting.period.end = history.END_DATE;
		            		
							$scope.gridMrkVO.dataSource.read();
		            	}
            		},1000);
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
					
	            	if(val) {
	            		$scope.mrkKg.wrapper.height(657);
	            		$scope.mrkKg.resize();
	            		gridMrkVO.dataSource.pageSize(20);
	            	}
	            	else {
	            		$scope.mrkKg.wrapper.height(798);
	            		$scope.mrkKg.resize();
	            		gridMrkVO.dataSource.pageSize(24);
	            	}
	            };
	                  
				dateVO.getSubCodeList = function (param) {
                    var self = this;
                    SyCodeSvc.getSubcodeList(param).then(function (result) {
                    	if(param.cd == "SY_000017"){
                    		self.ItlStatCodeList = result.data;
                    	}else if(param.procedureParam == "USP_SY_09MRK01_GET"){
                    		UtilSvc.getList(param).then(function (result) {
                                self.MrkCodeList = result.data.results[0];
                            });
                    	}
                    });
                };
                
                dateVO.doInquiry = function () {// 검색조건에 해당하는 유저 정보를 가져온다.
                	gridMrkVO.dataSource.read();
                	var param = {
                			MRK_LIST     : dateVO.selectedMrkIds,
                			MRK_SELECT_INDEX : dateVO.MrkCodeList.allSelectNames,
    						STAT_LIST    : dateVO.selectedItlStatIds,
    						STAT_SELECT_INDEX : dateVO.ItlStatCodeList.allSelectNames,
    						START_DATE   : dateVO.datesetting.period.start,
    						END_DATE     : dateVO.datesetting.period.end
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
	                			
	                			if(!isValid(param)) { return false; };
	                			syMrkSvc.saveUserMrk(e.data.models, "I").success(function () {
	                				defer.resolve();
	                				gridMrkVO.dataSource.read();
	                            }).error(function() {
                                	defer.resolve();
                                	e.error();
								});;
	                			
	                			return defer.promise;
	            			},
                			update: function(e) {
                				var defer = $q.defer();
	                			var param = {
                                	data: e.data.models
                                };
	                			
	                			if(!isValid(param)) { return false; };
	                			syMrkSvc.saveUserMrk(e.data.models, "U").success(function () {
	                				defer.resolve();
	                				gridMrkVO.dataSource.read();
	                            }).error(function() {
                                	defer.resolve();
                                	e.error();
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
                                	e.error();
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
                					ROW_NUM:     { type: "number", editable: false },
                					NO_MNGMRK:   { type: "string", 
                						validation: { 
                							required: {message: "관리마켓을 입력하여 주세요."}
                						}
                					},
                					NM_MRK:      { type: "string", 
                						validation: {
                							required: {message: "마켓명을 입력하여 주세요."}
                						}  
									},
                					NM_MRKDFT:   { type: "string", editable: false },
                					DT_ITLSTART: { type: "string", editable: false },
                					CD_ITLSTAT:  { type: "string", editable: false },
                					DC_MRKID:    { type: "string", editable: true, validation: { required: {message: "마켓ID를 입력하여 주세요."} } },
                					DC_PWD:      { type: "string" },
                					NEW_DC_PWD:  {
                						type: "string"
										,validation: {
											new_dc_pwdvalidation: function (input) {
												if (input.is("[name='NEW_DC_PWD']") && input.val() != "") {
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
                					API_KEY:     { type: "string" },
                					NEW_API_KEY: {
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
                					DC_SALEMNGURL: {type: "string", editable: false},
                					YN_USE:     {type: "string" },
                					NM_NT:      {type: "string", editable: false},
                					DTS_INSERT: {type: "string", editable: false},
                					DTS_UPDATE: {type: "string", editable: false},
                					NM_UPDATE : {type: "string", editable: false}
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
           		           {field: "ROW_NUM",     title: "No",    width: 50, template: "<span class='row-number'></span>",
   							headerAttributes: gridHeaderAttributes},
        		           {field: "NO_MNGMRK",   title: "<span class='form-required'>* </span>관리마켓",  width: 100,
   	   						headerAttributes: gridHeaderAttributes,
           		        	editor: function(container, options) {
           		        		gridMrkVO.dropDownEditor(container, options, dateVO.MrkCodeList, ["NM_MRK","NO_MNGMRK"]);
           		        	},
          		       	   	template:  function(e){
          		       		    var nmd = (!e.NM_MRK.hasOwnProperty("NO_MNGMRK")) ?  e.NM_MRK : "";
          		       		    var grdData = dateVO.MrkCodeList;	
								for(var i = 0, leng=grdData.length; i<leng; i++){
									if(grdData[i].NO_MNGMRK === e.NO_MNGMRK){
										nmd = grdData[i].NM_MRK;
										if(e.DC_SALEMNGURL === '') e.DC_SALEMNGURL = grdData[i].DC_SALEMNGURL;
										if(e.NM_MRKDFT === '') e.NM_MRKDFT = grdData[i].NM_MRKDFT;
										if(e.NM_NT === '') e.NM_NT = grdData[i].NM_NT;
									}
								}
	            		        return nmd;
          		       	  	}},
        		           {field: "NM_MRK",      title: "<span class='form-required'>* </span>마켓명",    width: 100,
       	   					headerAttributes: gridHeaderAttributes},
        		           {field: "NM_MRKDFT",   title: "마켓구분", width: 100,  headerAttributes: gridHeaderAttributes},
        		           {field: "DT_ITLSTART", title: "연동시작일자", width: 90, headerAttributes: gridHeaderAttributes},
        		           {field: "CD_ITLSTAT",  title: "연동상태",    width: 80,
          		       	  	editor: function(container, options) {
          		       	  		gridMrkVO.dropDownEditor(container, options, dateVO.ItlStatCodeList, ["NM_DEF","CD_DEF"]);
           		        	},   
	   	   				    template: function(e){
          		       	   		return gridMrkVO.fTemplate(e, dateVO.ItlStatCodeList, ["CD_DEF", "NM_DEF", "CD_ITLSTAT"]);
          		       	  	},
		   	   				headerAttributes: gridHeaderAttributes},
        		           {field: "DC_MRKID", title: "<span class='form-required'>* </span>마켓ID", width: 100, headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l"}},
        		           {field: "NEW_DC_PWD",  title: "<span class='form-required'>* </span>비밀번호",   width: 140,
        		        	editor: function (container, options) {
          		                 $('<input type="password" class="k-textbox" required="required" data-required-msg="비밀번호를 입력하여 주세요." name="' + options.field + '"/>').appendTo(container);
          	                 },
          	                 template: function(e){
        		           		 var returnPWDMsg = "";
        		           		 if(e.NEW_DC_PWD == "" || e.NEW_DC_PWD == null && e.DC_PWD != ""){
        		           			 if(e.DC_PWD_LEN != null) returnPWDMsg = Array(e.DC_PWD_LEN + 1).join("*");
          		           		 }else if(e.NEW_DC_PWD != "" && e.NEW_DC_PWD  != null){
          		           			 returnPWDMsg = Array(e.NEW_DC_PWD.length + 1).join("*");
          		           		 }
          		           		 return returnPWDMsg;
        		           	 },
    	   					headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l"}},
        		           {field: "NEW_API_KEY",     title: "API_KEY",  width: 100
        		           		,editor: function (container, options) {
	          		                 $('<input type="password" class="k-textbox" name="' + options.field + '"/>').appendTo(container);
	          	                 }
	          		           	 ,template: function(e){  
	          		           		 var returnAPIMsg = "";
	          		           		 if(e.NEW_API_KEY == "" || e.NEW_API_KEY == null && e.API_KEY != ""){
	          		           		     if(e.API_KEY_LEN != null) returnAPIMsg = Array(e.API_KEY_LEN + 1).join("*");
	          		           		 }else if(e.NEW_API_KEY != "" && e.NEW_API_KEY != null){
	          		           			 returnAPIMsg = Array(e.NEW_API_KEY.length + 1).join("*");
	          		           		 }
	          		           		 return returnAPIMsg;
	          		           	 },
	    	   				headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l"}},
        		           {field: "DC_SALEMNGURL", title: "판매관리URL", width: 250,
	   	   					headerAttributes: gridHeaderAttributes,
	   	   				    attributes: {class:"ta-l", style:"text-overflow:ellipsis; white-space:nowrap; overflow:hidden;"}},
        		           {field: "YN_USE",      title: "사용여부",    width: 80,
          		       	  	editor: function(container, options) {
          		       	  		gridMrkVO.dropDownEditor(container, options, dateVO.ynUseDataSource, ["NM_DEF","CD_DEF"]);
           		        	},   
	   	   				    template: function(e){
          		       	   		return gridMrkVO.fTemplate(e, dateVO.ynUseDataSource, ["CD_DEF", "NM_DEF", "YN_USE"]);
          		       	  	},
	       	   				headerAttributes: gridHeaderAttributes},
	       	   			    {field: "NM_NT",      title: "국가",   width: 80, headerAttributes: gridHeaderAttributes},
       	   	   				{field: "DTS_INSERT", title: "등록일자", width: 80, headerAttributes: gridHeaderAttributes},
       	   	   				{field: "DTS_UPDATE", title: "수정일자", width: 80, headerAttributes: gridHeaderAttributes},
       	   	   				{field: "NM_UPDATE",  title: "수정자" , width: 80, headerAttributes: gridHeaderAttributes},
        		            {command: [{text:"연동체크", click: checkCon }, "destroy"], attributes:{class:"ta-l"}},
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
                	
                	if(dataItem.NO_MRK == undefined ||
                	   dataItem.NO_MRK == '') {
                		alert('저장 후에 연동 버튼을 클릭하여 주세요.');
                		return;
                	}
                	
                	var param = {
                    	NO_MNGMRK: dataItem.NO_MNGMRK,
                    	DC_MRKID: dataItem.DC_MRKID
                    };
                	
                	syMrkSvc.conMrk(param, e).then(function(res) {
        				//defer.resolve();
        				alert( res.data );
        				$scope.kg.dataSource.read();
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