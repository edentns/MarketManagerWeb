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
		            today = edt.getToday();
	            
	            
	            var now = new Date();
                var firstDay = kendo.date.firstDayOfMonth(now);
                var beforeLastDay = kendo.date.addDays(firstDay,-1);
                var day1 = new Date(beforeLastDay.getFullYear(), beforeLastDay.getMonth(), 15);
                var day2 = new Date(now.getFullYear(), now.getMonth(), 10);
                var day3 = new Date(now.getFullYear(), now.getMonth(), 15);
                /**
                 * searchVO
                 * # 검색과 관련된 정보.
                 * # 고객사 정보를 검색한다.
                 */
                var dateVO = $scope.dateVO = {
                    boxTitle : "검색",
                    procedureParam        : "BX.GW_SPENDING_RESOLUTIONS_S&sFromDt@s|sToDt@s|sReqDt@s|sDocSts@s",
                    procedureParam_update : "BX.GW_SPENDING_RESOLUTIONS_02U&sFromDt@s|sToDt@s",
                    docstsString : "30",
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
	        		ItlStatCodeList: [],
	        		datesetting : {
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month'],
						selected   : 'current',
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
					dateVO.datesetting.selected = "current";
				};

				dateVO.isOpen = function (val) {
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
                };
                

                dateVO.doUpdate = function () {// 전자문서명 수정
                    var param = {
                    	procedureParam:dateVO.procedureParam_update,
                    	data:[{
	                    	sFromDt:dateVO.dateObject1.dateFormat("Ymd"),
	                    	sToDt:dateVO.dateObject2.dateFormat("Ymd")
                    	}]
                    };
                    
					UtilSvc.getGWExec(param).then(function (res) {
					});
                };
                
//                var startDate = new kendo.ui.DatePicker($("#startDate"), {});
//                var today = new Date();
//                startDate.value(today);
                
                $scope.dateOptions = {
					format: "yyyy/MM/dd"
                };
                
                var gridMrkVO = $scope.gridMrkVO = {
                    messages: {
                        noRows: "ERP 사용자정보가 존재하지 않습니다.",
                        loading: "ERP 사용자정보를 가져오는 중...",
                        requestFailed: "요청 ERP 사용자정보를 가져오는 중 오류가 발생하였습니다.",
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
                        		e.model.set("CD_MRKDFT", "001");
                        		e.model.set("CD_NT", "001");
                        		e.model.set("YN_USE", "Y");
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
                						procedureParam:"USP_SY_09MRK02_GET&L_LIST01@s|L_LIST02@s|L_START_DATE@s|L_END_DATE@s",
                						L_LIST01  :  dateVO.selectedMrkIds,
                						L_LIST02  :  dateVO.selectedItlStatIds,
                						L_START_DATE  : new Date(dateVO.datesetting.period.start.y, dateVO.datesetting.period.start.m-1, dateVO.datesetting.period.start.d).dateFormat("Ymd"),
                						L_END_DATE : new Date(dateVO.datesetting.period.end.y, dateVO.datesetting.period.end.m-1, dateVO.datesetting.period.end.d).dateFormat("Ymd")
                					};
            					UtilSvc.getList(param).then(function (res) {
            						e.success(res.data.results[0]);
            					});
                			},
	                		create: function(e) {
	                			syMrkSvc.saveUserMrk(e.data.models, "I").success(function () {
	                				gridMrkVO.dataSource.read();
	                            });
	            			},
                			update: function(e) {
                				syMrkSvc.saveUserMrk(e.data.models, "U").success(function () {
                					gridMrkVO.dataSource.read();
                                });
                			},
                			destroy: function(e) {
                				var defer = $q.defer();
                				syMrkSvc.saveUserMrk(e.data.models, "D").success(function () {
            						defer.resolve();
            						gridMrkVO.dataSource.read();
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
                					ROW_NUM:     { editable: false },
                					NO_MNGMRK:   { validation: { required: true } },
                					NM_MRK:      { validation: { required: true } },
                					CD_MRKDFT:   {},
                					DT_ITLSTART: { editable: false },
                					CD_ITLSTAT:  { editable: false },
                					DC_MRKID:    {},
                					DC_PWD:      {},
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
        							  	  ,nullable: true
        							},
                					API_KEY:     {},
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
                					DC_SALEMNGURL: {},
                					YN_USE:      {},
                					CD_NT:       {},
                					NO_CEPH:     {},
                				}
                			}
                		}
                	}),
                	navigatable: true,
                	toolbar: 
                		["create", "save", "cancel"],
                	columns: [
           		           {field: "ROW_NUM",     title: "No",      width: 50, template: "<span class='row-number'></span>",
   							headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		           {field: "NO_MNGMRK",   title: "관리마켓",  width: 100,
   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
           		        	editor: 
          		       		  function (container, options) {
	            		       		$('<input required name='+ options.field +' data-bind="value:' + options.field + '" />')
	            		    		.appendTo(container)
	            		    		.kendoDropDownList({
	            		    			autoBind: false,
	            		    			dataTextField: "NM_MRK",
	                                    dataValueField: "NO_MNGMRK",
	            		    			dataSource: dateVO.MrkCodeList,
	            		    			valuePrimitive: true
	            		    		});
          		       	   	  }	 , template:  function(e){
          		       		    var nmd = e.NM_MRK;
          		       		    var grdData = dateVO.MrkCodeList;	
            		       		  for(var i = 0, leng=grdData.length; i<leng; i++){
            		       			  if(grdData[i].NO_MNGMRK === e.NO_MNGMRK){
            		       				nmd = grdData[i].NM_MRK;	
            		       			  }
            		       		  }	
	            		        return nmd;
          		       	  	}},
        		           {field: "NM_MRK",      title: "마켓명",    width: 100,
       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		           {field: "CD_MRKDFT",   title: "마켓구분",   width: 100, template: 
        		        		    '#if (CD_MRKDFT == "001") {# #="오픈마켓"# #}' +
        		        	   	    'else if (CD_MRKDFT == "002") {# #="홈쇼핑"# #}'+
	        		        	   	'else if (CD_MRKDFT == "003") {# #="종합몰"# #}'+
	        		        	   	'else if (CD_MRKDFT == "004") {# #="전문몰"# #}'+
	        		        	   	'else if (CD_MRKDFT == "005") {# #="그룹몰"# #}'+
        		        		    'else {# #="기타"# #} #', editor: DropDownEditorMrk,
           	   				headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		           {field: "DT_ITLSTART", title: "연동시작일자", width: 100,
       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		           {field: "CD_ITLSTAT",  title: "연동상태",    width: 100,  template: 
        		        		    '#if (CD_ITLSTAT == "001") {# #="미연동"# #}' +
		   		        	   	    'else if (CD_ITLSTAT == "002") {# #="연동성공"# #}'+
		   		        		    'else {# #="연동실패"# #} #', editor: DropDownEditorItl,
		   	   				headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		           {field: "DC_MRKID",    title: "마켓ID",    width: 100},
        		           {field: "NEW_DC_PWD",  title: "비밀번호",   width: 100,
        		        	   editor: function (container, options) {
          		                 $('<input type="password" class="k-textbox" name="' + options.field + '"/>').appendTo(container);
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
    	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
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
	    	   				headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		           {field: "DC_SALEMNGURL", title: "판매관리URL", width: 100,
	   	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		           {field: "YN_USE",      title: "사용여부",    width: 100, template: 
	        		        	    '#if (YN_USE == "Y") {# #="사용"# #} else {# #="사용안함"# #} #', 
	        		        	    editor: DropDownEditorYN,
	       	   				headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		           {field: "CD_NT",       title: "국가",       width: 100, template: 
            		        		'#if (CD_NT == "001") {# #="한국"# #}' +
       		        	   	        'else if (CD_NT == "002") {# #="중국"# #}'+
	        		        	   	'else if (CD_NT == "003") {# #="미국"# #}'+
       		        		        'else {# #="기타"# #} #', editor: DropDownEditorNt,
       	   	   				headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		           {field: "NO_CEPH",     title: "핸드폰번호",   width: 100,
       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		           {command: [ "destroy" ]}
                	],
                    collapse: function(e) {
                        // console.log(e.sender);
                        this.cancelRow();
                    },
                    dataBound: function () {
                        var rows = this.items();
                        $(rows).each(function () {
                            var index = $(this).index() + 1;
                            var rowLabel = $(this).find(".row-number");
                            $(rowLabel).html(index);
                        });
                    },
                	editable: true,
                	height: 657
                };
                
                
                function DropDownEditorMrk(container, options) {
            		$('<input data-text-field="text" data-bind="value:' + options.field + '"/>')
                        .appendTo(container)
                        .kendoDropDownList({
                        	dataTextField: 'text',
                            dataValueField: 'CD_MRKDFT',
                            dataSource: [{
                	                	   "text": '오픈마켓', "CD_MRKDFT": '001'
                	                      }, {
                	                       "text": '홈쇼핑',  "CD_MRKDFT": '002'
                	                      }, {
                	                       "text": '종합몰',  "CD_MRKDFT": '003'
                	                      }, {
                	                       "text": '전문몰',  "CD_MRKDFT": '004'
                	                      }, {
                	                       "text": '그룹몰',  "CD_MRKDFT": '005'
                	                      }, {
                	                       "text": '기타',   "CD_MRKDFT": '999'
                	                      }]
                        });
                }
                
                function DropDownEditorItl(container, options) {
            		$('<input data-text-field="NM_DEF" data-bind="value:' + options.field + '"/>')
                        .appendTo(container)
                        .kendoDropDownList({
                        	dataTextField: 'NM_DEF',
                            dataValueField: 'CD_DEF',
                            dataSource: dateVO.ItlStatCodeList
                        });
                }
                
                function DropDownEditorYN(container, options) {
            		$('<input data-text-field="text" data-bind="value:' + options.field + '"/>')
                        .appendTo(container)
                        .kendoDropDownList({
                        	dataTextField: 'text',
                            dataValueField: 'YN_USE',
                            dataSource: [{
                	                       "text": '사용',
                	                       "YN_USE": 'Y'
                	                      },{
                	                	   "text": '사용안함',
                	                       "YN_USE": 'N'
                	                      }]
                        });
                }
                
                function DropDownEditorNt(container, options) {
            		$('<input data-text-field="text" data-bind="value:' + options.field + '"/>')
                        .appendTo(container)
                        .kendoDropDownList({
                        	dataTextField: 'text',
                            dataValueField: 'CD_NT',
                            dataSource: [{
                	                	   "text": '한국', "CD_NT": '001'
                	                      }, {
                	                       "text": '중국',  "CD_NT": '002'
                	                      }, {
                	                       "text": '미국',  "CD_NT": '003'
                	                      }, {
                	                       "text": '기타',  "CD_NT": '999'
                	                      }]
                        });
                }
                
                dateVO.doInit();
            }]);
}());