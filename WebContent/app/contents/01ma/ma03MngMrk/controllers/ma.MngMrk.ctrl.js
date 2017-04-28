(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.MngMrk.controller : ma.MngMrkCtrl
     * 코드관리
     */
    angular.module("ma.MngMrk.controller", [ 'kendo.directives' ])
        .controller("ma.MngMrkCtrl", ['APP_CONFIG', 'UtilSvc',"$scope", "$http", "$q", "$log", "ma.MngMrkSvc", "APP_CODE", "$timeout", "resData", "Page",
            function (APP_CONFIG, UtilSvc, $scope, $http, $q, $log, MaMngMrkSvc, APP_CODE, $timeout, resData, Page) {
        	
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            //var menuId = MenuSvc.getMenuId($state.current.name);
	            
	            var now = new Date(),
	            	dayFromMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
	            	dayToMonth = new Date(now.getFullYear(), now.getMonth()+1, now.getDate());
	            	           	            
	            var mngMrkDateVO = $scope.mngMrkDateVO = {
	            	boxTitle : "검색",
	            	dateObject1 : dayFromMonth,
	            	dateObject2 : dayToMonth,
                    dateString1 : dayFromMonth.dateFormat("Y/m/d"),
                    dateString2 : dayToMonth.dateFormat("Y/m/d"),
                    docstsString : "30",
                    searchText: "",				//검색어
             	    methodDataCode : "",			//연동방법
             	    statusDataCode : "",			//연동상태 	
             	    dataTotal : 0
	            };
	            
	            kendo.culture("ko-KR");
	            
	            //날짜 버튼 셋팅
	            mngMrkDateVO.addDays = function(nextDay){
	            	var one = new Date(mngMrkDateVO.dateObject1);
	            	var setDay = {
	            		year : one.getFullYear(),
	            		month : function (days){
	            			return (days > 7) ? one.getMonth() + 1 : one.getMonth();
	            		},
	            		date : function (days){
	            			return (days < 8) ? one.getDate() + days : one.getDate();
	            		}
	            	};         
	            	mngMrkDateVO.dateObject2 = new Date(setDay.year, setDay.month(nextDay), setDay.date(nextDay));
	            };
	                            
                $scope.dateOptions = {
    				format: "yyyy/MM/dd"
                };
                
                var subCodeSetting = {
	            	procParam: "MarketManager.USP_SY_10CODE02_GET&lnoc@s|lnoemp@s|lnomngcdhd@s|lcdcls@s",
            		indexCode: {'CD_DEF':'','NM_DEF':'전체'}
	            };
    	            
	            //연동 방법 셋팅
	            var methodDataSource = $scope.methodDataSource = function(sel){
	            	return {	
	            		dataTextField: "NM_DEF",
	                    dataValueField: "CD_DEF",
	                    dataSource: new kendo.data.DataSource({
	                    	transport: {
	                			read: function(e) {
	                				var param = {
	                					procedureParam: subCodeSetting.procParam,
	                					lnoc: "00000",
	                					lnoemp: "",
	                					lnomngcdhd: "SYCH00016",
	                					lcdcls: "SY_000016"
	                				};
	                				UtilSvc.getGWList(param).then(function (res) {
	            						if(sel){res.data.results[0].unshift(subCodeSetting.indexCode)}; //코드 초기값 설정
	            						//e.success(res.data.results[0].sort(function(a, b){return parseInt(b.SQ_DEF) - parseInt(a.SQ_DEF)}));
	            						e.success(res.data.results[0]);
	            					});
	                			}
	                    	}
	                    }),
		            	index: 0
	            	}
	            };
	            
	            //연동 상태 셋팅
	            var statusDataSource = $scope.statusDataSource = function(sel){
	            	return {
	            		dataTextField: "NM_DEF",
	                    dataValueField: "CD_DEF",
	                    dataSource: new kendo.data.DataSource({
	                    	transport: {
	                			read: function(e) {
	                				var param = {
	                					procedureParam: subCodeSetting.procParam,
	                					lnoc: "00000",
	                					lnoemp: "",
	                					lnomngcdhd: "SYCH00017",
	                					lcdcls: "SY_000017"
	                				};
	                				UtilSvc.getGWList(param).then(function (res) {
	            						if(sel){res.data.results[0].unshift(subCodeSetting.indexCode)}; //코드 초기값 설정
	            						//e.success(res.data.results[0].sort(function(a, b){return parseInt(a.SQ_DEF) - parseInt(b.SQ_DEF)}));
	            						e.success(res.data.results[0]);
	            					});
	                			}
	                    	}
	                    }),
		            	index: 0
	            	};
		        };
	            
	            //검색
	            var doInquiry = $scope.doInquiry = function () {
	            	gridMngMrkUserVO.dataSource.read();
                };
                
                //초기화 
	            mngMrkDateVO.init = function(){
                	var me  = this;
                	me.methodDataCode = "";
                	me.statusDataCode = "";
                	me.searchText = "";
                	me.dateString1 = dayFromMonth; 
                	me.dateString2 = dayToMonth;
                	me.dateObject1 = dayFromMonth; 
                	me.dateObject2 = dayToMonth;
                	
                	$timeout(function () {
                        doInquiry();
                    }, 0);
                };      
                                            
                // 마켓 검색 그리드
                var gridMngMrkUserVO = $scope.gridMngMrkUserVO = {
                        messages: {
                            //noRows: "마켓정보가 존재하지 않습니다.",
                            //loading: "마켓정보를 가져오는 중...",
                            requestFailed: "마켓정보를 가져오는 중 오류가 발생하였습니다.",
                            //retry: "갱신",
                            commands: {
                                create: '추가',
                                destroy: '삭제',
                                save: '저장',
                                cancel: '취소'
                            }
                            ,noRecords: "검색된 데이터가 없습니다."
                        },
                    	boxTitle : "마켓 리스트",
                    	sortable: true,
                        pageable: true,
                        noRecords: true,
                        //scrollable: false,
                    	dataSource: new kendo.data.DataSource({
                    		transport: {
                    			read: function(e) {
                    				var param = {
                                    	procedureParam: "MarketManager.USP_MA_03SEARCH01_GET&MA_NM_MRK@s|MA_CD_ITLWY@s|MA_ITLSTAT@s|MA_DT_START@s|MA_DT_END@s",                    					
                                    	MA_NM_MRK: mngMrkDateVO.searchText,
                                    	MA_CD_ITLWY: mngMrkDateVO.methodDataCode,
                                    	MA_ITLSTAT: mngMrkDateVO.statusDataCode,
                                    	MA_DT_START: mngMrkDateVO.dateObject1.dateFormat("Ymd"),
                                    	MA_DT_END: mngMrkDateVO.dateObject2.dateFormat("Ymd")
                                    };
                					UtilSvc.getGWList(param).then(function (res) {
                						mngMrkDateVO.dataTotal = res.data.results[0].length;
                						e.success(res.data.results[0]);
                					});
                    			},
    	                		create: function(e) {
    	                			var defer = $q.defer();
    	                			var param = {
                                    	data: e.data.models
                                    };
    	                			MaMngMrkSvc.mngmrkInsert(param).then(function(res) {
    	                				defer.resolve();
    	                				mngMrkDateVO.init();
    	                				gridMngMrkUserVO.dataSource.read();
    	                			});
    	                			return defer.promise;
    	            			},
                    			update: function(e) {
                    				var defer = $q.defer();
    	                			var param = {
                                    	data: e.data.models
                                    };
    	                			MaMngMrkSvc.mngmrkUpdate(param).then(function(res) {
    	                				defer.resolve();
    	                				mngMrkDateVO.init();
    	                				gridMngMrkUserVO.dataSource.read();
    	                			});
    	                			return defer.promise;
                    			},
                    			destroy: function(e) {
                    				var defer = $q.defer();
    	                			var param = {
    	                				data: e.data.models	
                                    };
    	                			MaMngMrkSvc.mngmrkDelete(param).then(function(res) {
    	                				defer.resolve();
    	                				mngMrkDateVO.init();
    	                				gridMngMrkUserVO.dataSource.read();
    	                			});
    	                			return defer.promise;
                    			},
                    			parameterMap: function(e, operation) {
                    				if(operation !== "read" && e.models) {
                    					//console.log("파라미터 맵",{models:kendo.stringify(e.models)});
                    					return {models:kendo.stringify(e.models)};
                    				}
                    			}
                    		},
                            //serverPaging: true,
                            //serverSorting: true,
                    		pageSize: 11,
                    		batch: true,
                    		schema: {
                    			model: {
                        			id: "NM_MRK",
                    				fields: {
                    					//ROW_NUM: {type: "number", editable: false, nullable: false, validation: {required: true, min : mngMrkDateVO.dataRows}},
                    					ROW_NUM: {type: "number", editable: false},
                    					NO_MNGMRK: {type: "string", editable: false},                    					
                    					NM_MRK: {
                    								validation: {
                    											nm_mrkvalidation: function (input) {
                                                                    if (input.is("[name='NM_MRK']") && input.val() != "") {
                                                                    	input.attr("data-nm_mrkvalidation-msg", "5~50자 사이의 영문, 한글, 숫자, '-','_' 조합으로 이루어진 아이디를 생성해야 합니다.");                                                                    	
                                                                    	var regex = /^(?=.*[a-zA-Z])(?=.*[-])(?=.*[0-9])(?=.*[가-힁ㄱ-ㅎ]).{5,50}$/g;       
                                                                        return regex.test(input.val());
                                                                    }
                                                                    if (input.is("[name='NM_MRK']") && input.val() === "") {
                                                                    	input.attr("data-nm_mrkvalidation-msg", "마켓명을 입력해 주세요.");
                                                                        return false;
                                                                    }
                                                                    return true;
                                                                }
                    										  }
                    							 	,editable: true
                    							 	,nullable: false
                    							 },
                    					CD_ITLWAY : {
                    									defaultValue: { CD_DEF: '', NM_DEF: "선택"}
				                    				   ,validation: {
				                    					   		cd_itlwayvalidation: function (input) {
					                                                if (input.is("[name='CD_ITLWAY']") && input.val() === "") {
					                                                	input.attr("data-cd_itlwayvalidation-msg", "연동방법을 입력해 주세요.");
					                                                    return false;
					                                                }
					                                               return true;
					        								   	}
				        							   }
				        							   ,editable: true
				        							   ,nullable: false
				        						 },
                    					DT_ITLSTART: {type: "date", validation: {required: true}, editable: true, nullable: false},
                    					CD_ITLSTAT: {
                    									defaultValue: { CD_DEF: '', NM_DEF: "선택"}
				                    				   ,validation: {
				        								   cd_itlstatvalidation: function (input) {
				                                                if (input.is("[name='CD_ITLSTAT']") && input.val() === "") {
				                                                	input.attr("data-cd_itlstatvalidation-msg", "연동상태를 입력해 주세요.");
				                                                    return false;
				                                                }
				                                               return true;
				        								   	}
				        							   }
				        							   ,editable: true
				        							   ,nullable: false
                    							},                    					
                    					DC_MRKID: {
                    								type: "string"
                    							   ,validation: {
                    								   dc_mrkidvalidation: function (input) {
                                                            if (input.is("[name='DC_MRKID']") && input.val() != "") {
                                                            	input.attr("data-dc_mrkidvalidation-msg", "관리자 아이디를 50자 이하로 설정하세요.")
                                                                return input.val().length <= 50;
                                                            }
                                                            if (input.is("[name='DC_MRKID']") && input.val() === "") {
                                                            	input.attr("data-dc_mrkidvalidation-msg", "관리자 아이디를 입력해 주세요.");
                                                                return false;
                                                            }
                                                           return true;
                    								   	}
                    							   }
                    							   ,editable: true
                    							   ,nullable: false
                    							  },
                    					DC_PWD: {
                    								type: "string"
                    							   ,validation: {
                    								   dc_pwdvalidation: function (input) {
                                                            if (input.is("[name='DC_PWD']") && input.val() != "") {
                                                            	input.attr("data-dc_pwdvalidation-msg", "비밀번호를 50자 이하로 설정하세요.")
                                                                return input.val().length <= 50;
                                                            }
                                                            if (input.is("[name='DC_PWD']") && input.val() === "") {
                                                            	input.attr("data-dc_pwdvalidation-msg", "비밀번호를 입력해 주세요.");
                                                                return false;
                                                            }
                                                           return true;
                    								   	}
                    							    }
                    							   ,editable: true
                    							   ,nullable: false
                    							  },
                    					API_KEY: {
                    							  type: "string" 
            								     ,validation: {
            								    	 api_keyvalidation: function (input) {
	                                                     if (input.is("[name='API_KEY']") && input.val() != "") {
	                                                    	 input.attr("data-api_keyvalidation-msg", "API키를 50자 이하로 설정하세요.");
	                                                          return (input.val().length <= 50);
	                                                     }
	                                                     return true;
              								   		}
            								      }	  
                    						     ,editable: true
                    						     },
                    					DC_SALEMNGURL: {
                    							type: "string"
                							   ,validation: {
                								   	required: true
                								   ,dc_salemngurlvalidation: function (input) {
                                                        if (input.is("[name='DC_SALEMNGURL']") && input.val() != "") {
                                                        	input.attr("data-dc_salemngurlvalidation-msg", "URL을 50자 이하로 설정하세요.");
                                                            return (input.val().length <= 100);
                                                        }
                                                       return true;
                								   	}
                							    }	
                    							,editable: true} 
                    				}
                    			}
                    		},
                    	}),
                    	navigatable: true, //키보드로 그리드 셀 이동 가능
                    	toolbar: 
                    		/*[{template: '<a class="k-button" onclick="create" style = "float:right;">생성</a>'+
                    		'<a class="k-button" onclick="save" style = "float:right;">저장</a>'+
                    		'<a class="k-button" onclick="cancel" style = "float:right;">취소</a>'}],
                    		*/
                    		["create", "save", "cancel"]
                    	,columns: [
               		           {
								   field: "ROW_NUM"
								  ,title: "순서"
								  ,width: 50
								  ,headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
               		           },
            		           {
               		        	   field: "NM_MRK"
               		        	  ,title: "<code>*</code>마켓명"
               		        	  ,width: 200
               		        	  ,headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
            		           },
            		           {
               		        	   field: "CD_ITLWAY"
               		        	  ,title: "<code>*</code>연동방법"
               		        	  ,width: 100
               		        	  ,headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
	            		          /*,editor: function(container, options){
          		        	    	$('<select kendo-drop-down-list title="연동방법" k-options="methodDataSource(false)" required name="' + options.field + '"/>')
          	                        .appendTo(container);
	          		        	  }*/
	          		        	/*  ,template: function(e){
           		        	    	 return e.CD_ITLWAY.NM_DEF;
           		        	     }*/
               		           },
	            		       {
           		        	      field: "DT_ITLSTART"
           		        	     ,title: "<code>*</code>연동시작일자"
           		        	     ,width: 100
           		        	     ,headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
           		        	     ,format: "{0:yyyy-MM-dd}"
           		        	   },
            		           {
            		        	  field: "CD_ITLSTAT"
            		             ,title: "<code>*</code>연동상태코드"
            		             ,width: 100
            		             ,headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
	           		        	/* ,editor:  function categoryDropDownEditor(container, options) {
		           	                    $('<input required name="' + options.field + '"/>')
		                                .appendTo(container)
		                                .kendoDropDownList({
		                                	dataTextField: "NM_DEF",
		            	                    dataValueField: "CD_DEF",
		            	                    dataSource: new kendo.data.DataSource({
		            	                    	transport: {
		            	                			read: function(e) {
		            	                				var param = {
		            	                					procedureParam: subCodeSetting.procParam,
		            	                					lnoc: "00000",
		            	                					lnoemp: "",
		            	                					lnomngcdhd: "SYCH00017",
		            	                					lcdcls: "SY_000017"
		            	                				};
		            	                				UtilSvc.getGWList(param).then(function (res) {
		            	            						//if(sel){res.data.results[0].unshift(subCodeSetting.indexCode)}; //코드 초기값 설정
		            	            						//e.success(res.data.results[0].sort(function(a, b){return parseInt(a.SQ_DEF) - parseInt(b.SQ_DEF)}));
		            	            						e.success(res.data.results[0]);
		            	            						console.log(res.data.results[0]);
		            	            					});
		            	                			}
		            	                    	}
		            	                    })
		                                });
		                        }*/
	           		        	/*,template: function(e){
		                        	//e.fields.CD_ITLWAY = e.fields.CD_ITLWAY.CD_DEF;
		                        	return e.CD_ITLSTAT.NM_DEF;
		                        }*/
            		           },
            		           {
            		        	  field: "DC_MRKID"
            		             ,title: "<code>*</code>관리자ID"
            		             ,width: 100
            		             ,headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
            		           },
            		           {
            		        	  field: "DC_PWD"
            		             ,title: "<code>*</code>비밀번호"
            		             ,width: 100
            		             ,headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
            		           	 ,editor: function (container, options) {
            		                 $('<input class="k-textbox" type="password" required name="' + options.field + '"/>').appendTo(container);
            	                 }
            		           	 ,template: function(e){      		           		
            		           		return e.DC_PWD == null ? '':'*'.repeat(e.DC_PWD.length);            		           		
            		           	 }
            		           },
            		           {
            		        	  field: "API_KEY"
            		             ,title: "API_KEY"
            		             ,width: 150
            		             ,headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
	            		         ,editor: function (container, options) {
	          		                 $('<input class="k-textbox" type="password" required name="' + options.field + '"/>').appendTo(container);
	          	                 }
	          		           	 ,template: function(e){      		           		
	          		           		return e.API_KEY == null ? '':'*'.repeat(e.API_KEY.length);            		           		
	          		           	 }
            		           },
            		           {
            		        	  field: "DC_SALEMNGURL"
            		        	 ,title: "판매관리URL"
            		        	 ,width: 200
            		        	 ,headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
           		        	   },          		           
            		           {
           		        	      command: [ "destroy" ]
           		        	   }
                    	],
                        collapse: function(e) {
                            // console.log(e.sender);
                            this.cancelRow();
                        },         	
                    	editable: {
                    	    confirmation: "삭제 하시겠습니까?"
                    	},
                    	height: 450                    	                     
        		};         
                
            }]);
}());