(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.MngMrk.controller : ma.MngMrkCtrl
     * 코드관리
     */
    angular.module("ma.MngMrk.controller", [ 'kendo.directives' ])
        .controller("ma.MngMrkCtrl", ['APP_CONFIG', 'UtilSvc',"$scope", "$state", "$http", "$q", "$log", "ma.MngMrkSvc", "APP_CODE", "$timeout", "resData", "Page", "MenuSvc",
            function (APP_CONFIG, UtilSvc, $scope, $state, $http, $q, $log, MaMngMrkSvc, APP_CODE, $timeout, resData, Page, MenuSvc) {
        	
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            var menuId = MenuSvc.getNO_M($state.current.name);
	            
	            var subCodeSetting = function (subcode1, subcode2, e){
					var param = {
    					procedureParam: "MarketManager.USP_SY_10CODE02_GET&lnomngcdhd@s|lcdcls@s",
    					lnomngcdhd: subcode1,
    					lcdcls: subcode2
    				};
    				UtilSvc.getList(param).then(function (res) {
						res.data.results[0].unshift({'CD_DEF':'','NM_DEF':'전체'}); //코드 초기값 설정
						//e.success(res.data.results[0].sort(function(a, b){return parseInt(b.SQ_DEF) - parseInt(a.SQ_DEF)}));
						e.success(res.data.results[0]);
					});
    			};	           	            
    			
	            var mngMrkDateVO = $scope.mngMrkDateVO = {
	            	boxTitle : "검색",
	            	datesetting : {
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month'],
						selected   : 'current',
						period : {
							start : angular.copy(today),
							end   : angular.copy(today)
						}
	        		},
                    searchText: {value: "", focus: false},				    //검색어
             	    methodDataCode : [""],			//연동방법
             	    statusDataCode : [""],			//연동상태 	
             	    methodDataSource : {
             	    	autoBind: true,
		    			dataTextField: "NM_DEF",
                        dataValueField: "CD_DEF",
		    			dataSource: new kendo.data.DataSource({
		    				transport: {
		    					read: function(e){ subCodeSetting("SYCH00016", "SY_000016", e) }
		    				}
		    			}),
		    			valuePrimitive: true
             	    },
             	    statusDataSoruce : {
             	    	autoBind: true,
		    			dataTextField: "NM_DEF",
                        dataValueField: "CD_DEF",
                        dataSource: new kendo.data.DataSource({
		    				transport: {
		    					read: function(e){ subCodeSetting("SYCH00017", "SY_000017", e) }
		    				}
		    			}),
		    			valuePrimitive: true
             	    },
             	    dataTotal : 0,
             	    resetAtGrd : ""
	            };
	            	            
	            kendo.culture("ko-KR");    
		        
	            //검색
	            mngMrkDateVO.doInquiry = function () {
		        	var me  = this;
	            	if(me.searchText.value === ""){me.searchText.focus = !me.searchText.focus; alert("마켓명을  입력해 주세요."); return false;};
	            	if(me.methodDataCode === ""){alert("연동방법을 입력해 주세요."); return false;};
                	if(me.statusDataCode === ""){alert("연동상태를 입력해 주세요."); return false;};
                	
	            	gridMngMrkUserVO.dataSource.read();
                };
                
                //새로 저장시 유효성 검사 (수정 할 땐 비밀번호를 따로 입력할 필요할 없어서 required 하지 않아서 저장시 따로 함수를 만듦 kendo로는  editable true 일때만 됨)
                var isValid = function(inputs){
                	let checkReturn = true;
                	angular.forEach(inputs.data, function (obj) {
                		if (!checkReturn) return;
                        if (obj.NM_MRK === null || obj.NM_MRK === "") {alert("마켓명을 설정해 주세요"); checkReturn = false;}
                        else if(obj.CD_ITLWAY === null || obj.CD_ITLWAY === ""){alert("연동방법을 설정해 주세요"); checkReturn = false;}
                        else if(obj.DC_MRKID === null || obj.DC_MRKID === ""){alert("관리자ID를 설정해 주세요"); checkReturn = false;}
                        else if((obj.NEW_DC_PWD === null || obj.NEW_DC_PWD === "") && (obj.DC_PWD === null || obj.DC_PWD === "")){alert("비밀번호를 설정해 주세요"); checkReturn = false;};
                    });
                	return checkReturn;
                };           
                
                //초기화 
	            mngMrkDateVO.init = function(){
                	var me  = this;
                	me.methodDataCode = [""];
                	me.statusDataCode = [""];
                	me.searchText.value = "";
                	me.datesetting.selected = "current";
                	me.resetAtGrd = $scope.gridMngMrkUserVO;
                	me.resetAtGrd.dataSource.data([]);
                };
                                                            
                //마켓 검색 그리드
                var gridMngMrkUserVO = $scope.gridMngMrkUserVO = {
                		autoBind: false,
                        messages: {                        	
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
                        pageable: {
                        	messages: {
                        		empty: "표시할 데이터가 없습니다."
                        	}
                        },
                        noRecords: true,
                        //scrollable: false,
                    	dataSource: new kendo.data.DataSource({
                    		transport: {
                    			read: function(e) {                    				
                    				var param = {
                                    	procedureParam: "MarketManager.USP_MA_03SEARCH01_GET&NO_M@s|MA_NM_MRK@s|MA_CD_ITLWY@s|MA_ITLSTAT@s|MA_DT_START@s|MA_DT_END@s",
                                    	NO_M: menuId,
                                    	MA_NM_MRK: mngMrkDateVO.searchText.value,
                                    	MA_CD_ITLWY: (MaMngMrkSvc.arrayIndexCheck(mngMrkDateVO.methodDataCode,"") === true) ? [""] : mngMrkDateVO.methodDataCode,
                                    	MA_ITLSTAT: (MaMngMrkSvc.arrayIndexCheck(mngMrkDateVO.statusDataCode,"") === true) ? [""] : mngMrkDateVO.statusDataCode,
                                    	MA_DT_START: new Date(mngMrkDateVO.datesetting.period.start.y, mngMrkDateVO.datesetting.period.start.m-1, mngMrkDateVO.datesetting.period.start.d).dateFormat("Ymd"),
                                    	MA_DT_END: new Date(mngMrkDateVO.datesetting.period.end.y, mngMrkDateVO.datesetting.period.end.m-1, mngMrkDateVO.datesetting.period.end.d).dateFormat("Ymd")
                                    };                    				                    				
                					UtilSvc.getList(param).then(function (res) {
                						mngMrkDateVO.dataTotal = res.data.results[0].length;                						
                						e.success(res.data.results[0]);
                					});
                    			},
    	                		create: function(e) {
    	                			var defer = $q.defer();
    	                			var param = {
                                    	data: e.data.models
                                    };
    	                			if(!isValid(param)) { return };
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
    	                			if(!isValid(param)) { return };
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
                    					ROW_NUM: {type: "number", editable: false},
                    					NO_MNGMRK: {type: "string", editable: false},                    					
                    					NM_MRK: {
	                    								validation: {
                											nm_mrkvalidation: function (input) {
                                                                if (input.is("[name='NM_MRK']") && input.val() != "") {
                                                                	input.attr("data-nm_mrkvalidation-msg", "50자 이하의 영문, 한글, 숫자, 특수기호('-','_') 내에서만  마켓명을 생성해야 합니다.");                                                                    	
                                                                	//var regex = /^(?=.*[a-zA-Z])(?=.*[-])(?=.*[0-9])(?=.*[가-힁ㄱ-ㅎ]).{5,50}$/g;                                                                    	
                                                                	var regex = /([^\wㄱ-ㅎ가-힁0-9_-])/g; 
                                                                	return (regex.test(input.val()) === true || input.val().length > 50) ? false : true;
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
                    								   //defaultValue: { CD_DEF: '', NM_DEF: "선택"},
				                    				  /*validation: {
			                    					   		cd_itlwayvalidation: function (input) {
			                    					   			//경고문에 잘 안보여서 삭제
				                                                if (input.is("[name='CD_ITLWAY']") && input.val() === "" || input.val() === "선택") {
				                                                	input.attr("data-cd_itlwayvalidation-msg", "연동방법을 입력해 주세요.");
				                                                    return false;
				                                                }
				                                               return true;
				        								   	}
				        							   },*/
				        							   editable: true
				        						 },
                    					DT_ITLSTART:{
                    								   //type: "string", 
                    								   //validation: {required: true}, 
                    								   editable: false//, 
                    								   //nullable: false
                    						     },
                    					CD_ITLSTAT: {
                    								   //defaultValue: "미연동",
				        							  editable: false
                    							},                    					
                    					DC_MRKID: {
                    								   type: "string"
                    							      ,validation: {
                    							    	  dc_mrkidvalidation: function (input) {
                                                            if (input.is("[name='DC_MRKID']") && input.val() != "") {
                                                            	input.attr("data-dc_mrkidvalidation-msg", "관리자 아이디를 50자 이하로 설정하세요.");
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
                    							      ,editable: false
                    							      ,nullable: true
                    							  },
                    					NEW_DC_PWD: {
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
                    					API_KEY: {
                    							       type: "string" 
                    							  	  ,editable: false
                    						          ,nullable: true
                    						     },
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
                    					DC_SALEMNGURL: {
                    							       type: "string"
                							          ,validation: {                								   
                							        	  dc_salemngurlvalidation: function (input) {
		                                                        if (input.is("[name='DC_SALEMNGURL']") && input.val() != "") {
		                                                        	input.attr("data-dc_salemngurlvalidation-msg", "URL을 50자 이하로 설정하세요.");
		                                                            return (input.val().length <= 100);
		                                                        }
		                                                       return true;
		                								  }
		                							   }	
                    							      ,editable: true
                    							      ,nullable: true
                    						     } 
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
	            		       	  ,editor: 
	            		       		  function (container, options) {
		            		       		$('<input name='+ options.field +' data-bind="value:' + options.field + '" />')
		            		    		.appendTo(container)
		            		    		.kendoDropDownList({
		            		    			autoBind: true,
		            		    			dataTextField: "NM_DEF",
		                                    dataValueField: "CD_DEF",
		            		    			dataSource: mngMrkDateVO.methodDataSource.dataSource.data(),
		            		    			valuePrimitive: true
		            		    		});
	            		       	   	  }	            		       		   
	            		       	  ,template: 
	            		       		 function(e){		
	            		       		    var nmd = (!e.CD_ITLWAY.hasOwnProperty("CD_DEF")) ?  e.CD_ITLWAY : "";
	            		       		    var grdData = mngMrkDateVO.methodDataSource.dataSource.data();
	            		       		    if(nmd === ""){
	            		       		    	return "";
	            		       		    }else{
	            		       		    	for(var i = 0, leng = grdData.length; i<leng; i++){
	  	            		       			  if(grdData[i].CD_DEF === e.CD_ITLWAY){
	  	            		       				nmd = grdData[i].NM_DEF;	
	  	            		       			  }
	  	            		       		    }
	            		       		    	return nmd;
	            		       		    }
	            		       	  	}
               		           },
	            		       {
           		        	      field: "DT_ITLSTART"
           		        	     ,title: "연동시작일자"
           		        	     ,width: 100
           		        	     ,headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
           		        	   },
            		           {
            		        	  field: "CD_ITLSTAT"
            		             ,title: "연동상태코드"
            		             ,width: 100
            		             ,headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}	
	           		        	 ,template: function(e){	       
	           		        		 var nmd = "";//e.CD_ITLSTAT; 
	           		        		 var grdData = mngMrkDateVO.statusDataSoruce.dataSource.data();
	            		       		 	for(var i = 0, leng = grdData.length; i<leng; i++){
	            		       			  if(grdData[i].CD_DEF === e.CD_ITLSTAT && e.CD_ITLSTAT != ""){	            		       				 
	            		       				  nmd = grdData[i].NM_DEF;	            		       				  
	            		       			  }
	            		       		    }
	           		        		 return nmd;
		                         }
            		           },
            		           {
            		        	  field: "DC_MRKID"
            		             ,title: "<code>*</code>관리자ID"
            		             ,width: 100
            		             ,headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
            		           },
            		           {
            		        	  field: "NEW_DC_PWD"
            		             ,title: "<code>*</code>비밀번호"
            		             ,width: 100
            		             ,headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
            		           	 ,editor: function (container, options) {
            		                 $('<input type="password" class="k-textbox" name="' + options.field + '"/>').appendTo(container);
            	                 }
            		           	 ,template: function(e){
            		           		 var returnPWDMsg = "";
            		           		 if(e.NEW_DC_PWD === "" || e.NEW_DC_PWD === null && e.DC_PWD != ""){
            		           			 returnPWDMsg = "*".repeat(e.DC_PWD_LEN);
	          		           		 }else if(e.NEW_DC_PWD != "" && e.NEW_DC_PWD  != null){
	          		           			 returnPWDMsg = "*".repeat(e.NEW_DC_PWD.length);
	          		           		 }
	          		           		 return returnPWDMsg;
            		           	 }
            		           },
            		           {
            		        	  field: "NEW_API_KEY"
            		             ,title: "API_KEY"
            		             ,width: 150
            		             ,headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
	            		         ,editor: function (container, options) {
	          		                 $('<input type="password" class="k-textbox" name="' + options.field + '"/>').appendTo(container);
	          	                 }
	          		           	 ,template: function(e){  
	          		           		 var returnAPIMsg = "";
	          		           		 if(e.NEW_API_KEY === "" || e.NEW_API_KEY === null && e.API_KEY != ""){
	          		           			 returnAPIMsg = "*".repeat(e.API_KEY_LEN);
	          		           		 }else if(e.NEW_API_KEY != "" && e.NEW_API_KEY != null){
	          		           			 returnAPIMsg = "*".repeat(e.NEW_API_KEY.length);
	          		           		 }
	          		           		 return returnAPIMsg;
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
                    	dataBound: function() {
                            this.expandRow(this.tbody.find("tr.k-master-row").first());
                        },
                        collapse: function(e) {
                            // console.log(e.sender);
                            this.cancelRow();
                        },         	
                    	editable: {
                    	    confirmation: "삭제 하시겠습니까?",
                    	},
                    	height: 450
        		};        
            }]);
}());
