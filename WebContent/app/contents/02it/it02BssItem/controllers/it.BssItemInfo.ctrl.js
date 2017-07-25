(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.Ord.controller : sa.OrdCtrl
     * 상품분류관리
     */
    angular.module("it.BssItem.controller")
        .controller("it.BssItemInfoCtrl", ["$stateParams", "$scope", "$state", "$http", "$q", "$log", "sa.OrdSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "it.BssItemSvc",
            function ($stateParams, $scope, $state, $http, $q, $log, saOrdSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, itBssItemSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();       	
            	
	            var bssInfoDataVO = $scope.bssInfoDataVO = {       	
	        		kind : "",
	        		ds : {},
	        		ordStatusOp : {},
	        		cancelCodeOptions : {
	        			dataSource: [],
    					dataTextField: "NM_DEF",
                        dataValueField: "CD_DEF",
                    	valuePrimitive: true
	        		},
	        		itemInfo : { boxTitle : "상품 정보" },
	        		sellInfo : { boxTitle : "판매 정보" },
	        		prodInfo : { boxTitle : "제조 정보" },
	        		transInfo : { boxTitle : "배송 정보" },
	        		opInfo : { boxTitle : "옵션 / 재고" },
	        		licenseInfo : { boxTitle : "인허가 / 고시정보" },
	        		inputs: {
	        			CD_CCLRSN : "001",
	        			DC_CCLCTT : ""
	        		},
	        		itemCtgrList1 : [],
	        		selectedCtgr1 : {ID_CTGR : "", NM_CTGR: ""},
	        		itemCtgrList2 : [],
	        		selectedCtgr2 : {ID_CTGR : "", NM_CTGR: ""},
	        		itemCtgrList3 : [],
	        		selectedCtgr3 : {ID_CTGR : "", NM_CTGR: ""},
	        		iClftList     : [],
	        		iKindList     : [],
	        		iStatList     : [],
	        		pscUnitList   : [],
	        		conList       : [],
	        		wetList       : [],
	        		dmstList      : [],
	        		shptpList     : [],
	        		ctfList       : [],
	        		ctfInList     : [],
	        		optList       : [],
	        		optClftList   : [],
	        		tax           : 0,
	        		taxValue      : 0,
	        		NM_COM        : "이든",  //임시값
	        		param :{
	        			// 상품정보
	        			CD_SIGNITEM   : "",
	        			NM_ITEM       : "",
	        			DC_ITEMABBR   : "",
	        			YN_BCD        : "N",
		        		DC_BCD        : "",
		        		CD_ITEMKIND   : "",
		        		CD_SIGNITEM   : "",
		        		CD_ITEMSTAT   : "",
		        		
		        		//판매정보
		        		B_ITEMPRC     : 0,
		        		CD_TAXCLFT    : "001",
		        		RT_TAX        : 0,
		        		S_ITEMPRC     : 0,   
		        		CD_PCSUNIT    : "",
		        		QT_MINPCS     : 0,
		        		YN_ADULCTFC   : "Y",
		        		DC_PUREWD     : "",
		        		
		        		//제조정보
		        		YN_MNFROWN    : "N",
		        		NM_MNFR       : "",
		        		YN_SPLYOWN    : "N",
		        		NM_SPLY       : "",
		        		NM_BRD        : "",
		        		DT_RLS        : "",
		        		YN_VLDPRDUSE  : "N",
		        		DTS_VLD       : "",
		        		CD_COONT      : "001",
		        		NM_COOAREA    : "",
		        		NM_SIZE       : "",
		        		VAL_WET       : "",
		        		NO_MD         : "",
		        		
		        		//배송정보
		        		YN_BSSSHPINFOUSE : "N",
		        		CD_DMSTFECTSHP: "001",
		        		NM_HSCD       : "",
		        		NM_CTCAITEMCLFT : "",
		        		NM_CLTH       : "",
		        		NM_ITEMMNFTMTRLKR : "",
		        		NM_ITEMMNFTMTRLENG: "",
		        		CD_ITEMSHPTP  : "001",
		        		NM_ITEMSHPTP  : "",
		        		
		        		//옵션/재고
		        		CD_OPTTP      : "002",
		        		
		        		//인허가/고시정보
		        		NM_MD         : "",
		        		NM_CTF        : "",
		        		NM_MNFCOO     : "",
		        		NM_MNFRER     : "",
		        		NO_CSMADVPHNE : "",
		        		CD_CTFOBJ     : "001",
		        		CD_CTFINFO    : ""
	        		},
	        		fileMainVO: {
	        			CD_AT:"004",
	        			limitCnt: 1,
	        			currentData:{
	        				CD_AT: "",
	        				CD_REF1: "",
	        				CD_REF2: "",
	        				CD_REF3: null,
	        				CD_REF4: null,
	        				CD_REF5: "",
	        				DTS_INSERT: null,
	        				DTS_UPDATE: null,
	        				NM_FILE: "",
	        				NO_AT: 1,
	        				NO_C: "",
	        				NO_INSERT: "",
	        				NO_UPDATE: null,
	        				SZ_FILE: "",
	        				YN_DEL: null
	        			}
	        		},
	        		fileSmallVO: {
	        			CD_AT:"007",
	        			limitCnt: 1,
	        			currentData:{
	        				CD_AT: "",
	        				CD_REF1: "",
	        				CD_REF2: "",
	        				CD_REF3: null,
	        				CD_REF4: null,
	        				CD_REF5: "",
	        				DTS_INSERT: null,
	        				DTS_UPDATE: null,
	        				NM_FILE: "",
	        				NO_AT: 1,
	        				NO_C: "",
	        				NO_INSERT: "",
	        				NO_UPDATE: null,
	        				SZ_FILE: "",
	        				YN_DEL: null
	        			}
	        		},
	        		fileDExVO: {
	        			CD_AT:"005",
	        			limitCnt: 10,
	        			currentData:{
	        				CD_AT: "",
	        				CD_REF1: "",
	        				CD_REF2: "",
	        				CD_REF3: null,
	        				CD_REF4: null,
	        				CD_REF5: "",
	        				DTS_INSERT: null,
	        				DTS_UPDATE: null,
	        				NM_FILE: "",
	        				NO_AT: 1,
	        				NO_C: "",
	        				NO_INSERT: "",
	        				NO_UPDATE: null,
	        				SZ_FILE: "",
	        				YN_DEL: null
	        			}
	        		},
	        		fileDImageVO: {
	        			CD_AT:"006",
	        			limitCnt: 10,
	        			currentData:{
	        				CD_AT: "",
	        				CD_REF1: "",
	        				CD_REF2: "",
	        				CD_REF3: null,
	        				CD_REF4: null,
	        				CD_REF5: "",
	        				DTS_INSERT: null,
	        				DTS_UPDATE: null,
	        				NM_FILE: "",
	        				NO_AT: 1,
	        				NO_C: "",
	        				NO_INSERT: "",
	        				NO_UPDATE: null,
	        				SZ_FILE: "",
	        				YN_DEL: null
	        			}
	        		}
		        };
	            
	            var gridOpt1VO = $scope.gridOpt1VO = {
	                    messages: {
	                        noRows: "옵션이 존재하지 않습니다.",
	                        loading: "옵션을 가져오는 중...",
	                        requestFailed: "요청 옵션을 가져오는 중 오류가 발생하였습니다.",
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
	                        	if(e.model.CD_OPT == ""){
	                        		e.model.set("CD_OPT", "001");
	                        	}
	                        }
	            		},
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	                				/*var param = {
	                						procedureParam:"USP_SY_09MRK02_GET&L_LIST01@s|L_LIST02@s|L_START_DATE@s|L_END_DATE@s",
	                						L_LIST01  :  dateVO.selectedMrkIds,
	                						L_LIST02  :  dateVO.selectedItlStatIds,
	                						L_START_DATE  : new Date(dateVO.datesetting.period.start.y, dateVO.datesetting.period.start.m-1, dateVO.datesetting.period.start.d).dateFormat("Ymd"),
	                						L_END_DATE : new Date(dateVO.datesetting.period.end.y, dateVO.datesetting.period.end.m-1, dateVO.datesetting.period.end.d).dateFormat("Ymd")
	                					};
	            					UtilSvc.getList(param).then(function (res) {
	            						e.success(res.data.results[0]);
	            					});*/
	                			},
		                		create: function(e) {
		                			syMrkSvc.saveUserMrk(e.data.models, "I").success(function () {
		                				gridOpt1VO.dataSource.read();
		                            });
		            			},
	                			update: function(e) {
	                				syMrkSvc.saveUserMrk(e.data.models, "U").success(function () {
	                					gridOpt1VO.dataSource.read();
	                                });
	                			},
	                			destroy: function(e) {
	                				var defer = $q.defer();
	                				syMrkSvc.saveUserMrk(e.data.models, "D").success(function () {
	            						defer.resolve();
	            						gridOpt1VO.dataSource.read();
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
	                		schema: {
	                			model: {
	                    			id: "CD_OPT",
	                				fields: {
	                					CD_OPT:     {  },
	                					NM_OPT:     {  },
	                					QT_SSQL:    {  },
	                					NO_MD:      {  },
	                					S_ITEMPRC:  {  },
	                				}
	                			}
	                		}
	                	}),
	                	navigatable: true,
	                	toolbar: 
	                		["create", "save", "cancel",{ template: "<kendo-button class='k-button k-button-icontext' value='옵션구분' ng-click='bssInfoDataVO.codeUpdateModal()'>옵션구분</kendo-button>" }],
	                	columns: [
	           		           {field: "CD_OPT",   title: "옵션구분", width: 150,
	   							headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
	           		        editor: 
	          		       		  function (container, options) {
		            		       		$('<input required name='+ options.field +' data-bind="value:' + options.field + '" />')
		            		    		.appendTo(container)
		            		    		.kendoDropDownList({
		            		    			autoBind: false,
		            		    			dataTextField: "NM_DEF",
		                                    dataValueField: "CD_DEF",
		            		    			dataSource: bssInfoDataVO.optClftList,
		            		    			valuePrimitive: true
		            		    		});
	          		       	   	  }	 ,  template: function(e){
	            		       		    var cd_opt = e.CD_OPT,
	            		       		    	nmd    = "";
	            		       		    if(cd_opt){
	            		       		    	var optData = bssInfoDataVO.optClftList;	
		                		       		for(var i = 0, leng=optData.length; i<leng; i++){
	                		       			   if(optData[i].CD_DEF === e.CD_OPT){
	                		       				 nmd = optData[i].NM_DEF;	
	                		       			   }
		                		       		}	
	            		       		    }
	    	            		        return nmd;
		            		        }},
	        		           {field: "NM_OPT",   title: "옵션명",  width: 100,
	   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	        		           {field: "QT_SSQL",      title: "재고수량",    width: 100,
	       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
	       	   					template:"<span style='float:right'>#: QT_SSQL #</span>"},
	        		           {field: "NO_MD",   title: "모델 NO",   width: 100, 
	           	   				headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	        		           {field: "S_ITEMPRC", title: "판매가(+,-)", width: 100,
	       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}}
	                	],
	                    collapse: function(e) {
	                        // console.log(e.sender);
	                        this.cancelRow();
	                    },
	                	editable: true,
	                	height: 180
	                };
	            	            	            
	            bssInfoDataVO.initBssItem = function(){
	            	var self = this,
	            		param = {
    					procedureParam: "MarketManager.USP_IT_02BSSITEMINFO01_GET&L_CD_ITEM@s",
    					L_CD_ITEM: this.ids
    				};	            	
        			UtilSvc.getList(param).then(function (res) {
        				if(res.data.results[0].length >= 1){
        					bssInfoDataVO.param = res.data.results[0][0];
        					bssInfoDataVO.NM_COM = res.data.results[0][0].NM_C;
        					if(res.data.results[1].length >= 1){
        						self.ctgrChange(0);
        						self.selectedCtgr1.ID_CTGR = res.data.results[1][0].ID_CTGR;
        						if(res.data.results[1].length >= 2){
        							self.ctgrChange(1);
            						self.selectedCtgr2.ID_CTGR = res.data.results[1][1].ID_CTGR;
        						}
        						if(res.data.results[1].length >= 3){
            						self.ctgrChange(2);
            						self.selectedCtgr3.ID_CTGR = res.data.results[1][2].ID_CTGR;
        						}
        					}
        				}
        			});
        			param = {
    					procedureParam: "MarketManager.USP_IT_02BSSITEMFILE_GET&L_CD_ITEM@s|L_CD_AT_1@s|L_CD_AT_2@s|L_CD_AT_3@s|L_CD_AT_4@s",
    					L_CD_ITEM: this.ids,
    					L_CD_AT_1: self.fileMainVO.CD_AT,
    					L_CD_AT_2: self.fileSmallVO.CD_AT,
    					L_CD_AT_3: self.fileDExVO.CD_AT,
    					L_CD_AT_4: self.fileDImageVO.CD_AT
        			};
        			UtilSvc.getList(param).then(function (res) { // 파일첨부 수정 해야함
        				if(res.data.results[0].length >= 1){
        					bssInfoDataVO.param = res.data.results[0][0];
        				}
        			});	
	            };
	            
	            bssInfoDataVO.getInitializeOrdInfo = function(){
	            	var self = this;
	            	
	            	self.kind = $stateParams.kind;
	            	self.ids = $stateParams.ids;
	            	
	            	self.taxList       = resData.taxCodeList;
	            	self.itemCtgrList1 = resData.itCtgrList;
	            	self.iClftList     = resData.iClftCodeList;
	            	self.iKindList     = resData.iKindCodeList;
	            	self.iStatList     = resData.iStatCodeList;
	            	self.pscUnitList   = resData.pcsCodeList;
	            	self.conList       = resData.conCodeList;
	            	self.wetList       = resData.wetCodeList;
	            	self.dmstList      = resData.dmstCodeList;
	            	self.shptpList     = resData.shptpCodeList;
	            	self.ctfList       = resData.ctfCodeList;
	            	self.ctfInList     = resData.ctfInCodeList;
	            	self.optList       = resData.optTypeCodeList;
	            	self.optClftList   = resData.optClftCodeList;
	            	
	            	if(self.kind == "detail"){
	            		self.initBssItem();
	            	}else if(self.kind == "insert"){
	            		
	            	}else{
	                    self.goBack();	                    
	            	}
		        };
		        
		        bssInfoDataVO.goBack = function() {
		        	$state.go('app.itBssItem', { kind: 'list', menu: null, ids: null });
		        };
	            
	            bssInfoDataVO.ctgrChange = function(flag){
	            	var self = this,
	            	    param = {
        					procedureParam: "MarketManager.USP_IT_01ITEMCFCT02_GET&IT_ID_CTGR@s",
        					IT_ID_CTGR: ""
        					};
	            	if(flag == 0){
	            		if(self.selectedCtgr1){
	            			param.IT_ID_CTGR = "";
	            			UtilSvc.getList(param).then(function (res) {
	            				self.itemCtgrList1 = res.data.results[0];
                            });
		            	}else{
		            		self.itemCtgrList2 = "";self.itemCtgrList3 = "";
		            	}
	            	}
	            	if(flag == 1){
	            		if(self.selectedCtgr1){
	            			param.IT_ID_CTGR = self.selectedCtgr1.ID_CTGR;
	            			UtilSvc.getList(param).then(function (res) {
	            				self.itemCtgrList2 = res.data.results[0];
                            });
		            	}else{
		            		self.itemCtgrList2 = "";self.itemCtgrList3 = "";
		            	}
	            	}else if(flag == 2){
	            		if(self.selectedCtgr2){
	            			param.IT_ID_CTGR = self.selectedCtgr2.ID_CTGR;
	            			UtilSvc.getList(param).then(function (res) {
	            				self.itemCtgrList3 = res.data.results[0];
                            });
		            	}else{
		            		self.itemCtgrList3 = "";
		            	}
	            	}
	            };
	            
	            bssInfoDataVO.bcdChange = function(){
	            	var self = this;
	            	if(self.param.YN_BCD == "Y"){
	            		self.param.DC_BCD = "";
	            		angular.element("#DC_BCD").attr("readonly", true);
	            	}
	            	else angular.element("#DC_BCD").attr("readonly", false);
	            };
	            
	            bssInfoDataVO.mrfrChange = function(){
	            	var self = this;
	            	if(self.param.YN_MNFROWN == "Y"){
	            		self.param.NM_MNFR = self.NM_COM;
	            		angular.element("#NM_MNFR").attr("readonly", true);
	            	}
	            	else {
	            		self.param.NM_MNFR = "";
	            		angular.element("#NM_MNFR").attr("readonly", false);
	            	}
	            };
	            
	            bssInfoDataVO.splyChange = function(){
	            	var self = this;
	            	if(self.param.YN_SPLYOWN == "Y"){
	            		self.param.NM_SPLY = self.NM_COM;
	            		angular.element("#NM_SPLY").attr("readonly", true);
	            	}
	            	else {
	            		self.param.NM_SPLY = "";
	            		angular.element("#NM_SPLY").attr("readonly", false);
	            	}
	            };
	            
	            bssInfoDataVO.vldChange = function(){
	            	var self = this;
	            	if(self.param.YN_VLDPRDUSE == "N"){
	            		self.param.DT_VLD = "";
	            		angular.element("#DT_VLD").attr("readonly", true);
	            	}
	            	else angular.element("#DT_VLD").attr("readonly", false);
	            };
	            
	            bssInfoDataVO.shptpChange = function(){
	            	var self = this;
	            	if(self.param.CD_ITEMSHPTP == "999"){
	            		angular.element("#NM_ITEMSHPTP").attr("readonly", false);
	            	}
	            	else {
	            		self.param.NM_ITEMSHPTP = "";
	            		angular.element("#NM_ITEMSHPTP").attr("readonly", true);
	            	}
	            };
	            
	            bssInfoDataVO.sprcCal = function(name){
	            	var self = this;
	            	
	            	// tax = 상품금액, taxValue = 과세금액, param.S_ITEMPRC = 판매가, param.RT_TAX = 과세비율
	            	if(name == "tax"){
	            		self.param.S_ITEMPRC = Math.ceil(Number(self.tax)*(Number(self.param.RT_TAX)+100)/100);
	            		self.taxValue = (self.param.RT_TAX/100) * self.param.S_ITEMPRC;
	            	}else{
		            	self.taxValue = (self.param.RT_TAX/100) * self.param.S_ITEMPRC;
		            	self.tax      = self.param.S_ITEMPRC - self.taxValue;
	            	}
	            };
	            
	            bssInfoDataVO.taxChange = function(){
	            	var self = this;
	            	if(self.param.CD_TAXCLFT == "001"){
	            		angular.element("#RT_TAX").attr("readonly", false);
	            	}else{
	            		self.tax = self.param.S_ITEMPRC;
	            		self.taxValue     = 0;
	            		self.param.RT_TAX = 0;
	            		angular.element("#RT_TAX").attr("readonly", true);
	            	}
	            };
	            
	            bssInfoDataVO.duplCheck = function(){
	            	var self = this;
	            	
            		if (!(self.param.CD_SIGNITEM).trim()) {
	                    return edt.invalidFocus("CD_SIGNITEM", "상품코드를 입력해주세요.");
                    }
	            	
	            	itBssItemSvc.duplCheck(self.param.CD_SIGNITEM).success(function (res) {
						alert(res);
                    });
	            };
	            
	            bssInfoDataVO.itemCopyModal = function(){
	            	itBssItemSvc.itemCopyModal().then(function(it_num) {
	            		var param = {
    					procedureParam: "MarketManager.USP_IT_02BSSITEMCOPY_GET&L_CD_ITEM@s",
    					L_CD_ITEM: it_num
	    				};	            	
	        			UtilSvc.getList(param).then(function (res) {
	        				if(res.data.results[0].length >= 1){
	        					bssInfoDataVO.param = res.data.results[0][0];
	        					bssInfoDataVO.NM_COM = res.data.results[0][0].NM_C;
	        					if(res.data.results[1].length >= 1){
	        						bssInfoDataVO.ctgrChange(0);
	        						bssInfoDataVO.selectedCtgr1.ID_CTGR = res.data.results[1][0].ID_CTGR;
	        						if(res.data.results[1].length >= 2){
	        							bssInfoDataVO.ctgrChange(1);
	            						bssInfoDataVO.selectedCtgr2.ID_CTGR = res.data.results[1][1].ID_CTGR;
	        						}
	        						if(res.data.results[1].length >= 3){
	            						bssInfoDataVO.ctgrChange(2);
	            						bssInfoDataVO.selectedCtgr3.ID_CTGR = res.data.results[1][2].ID_CTGR;
	        						}
	        					}
	        				}
	        			});
					});
	            };
	            
	            bssInfoDataVO.codeUpdateModal = function(){
	            	itBssItemSvc.codeUpdateModal().then(function(res) {
	            		alert(res);
	            	}, function() {
						alert("!!");
					});
	            };
	            
	            //validation tooltip
	            $scope.myValidatorOptions = {
            		messages: {
            			lengthy: function(input) {
                            return input.data("lengthy-msg");
                        },
                        required: function(input) {
                            return input.data("required-msg");
                        }                        
                    },
                    rules: {
                    	lengthy: function(input) {
	                        if (input.is("[name=DC_CCLCTT]")) {                   	
	                            return input.val().length < 1000;
	                        }
	                        return true;
                    	},
                    	required: function(input) {
                    		if (input.is("[name=DC_CCLCTT]")) {                   	
                    			return input.val() !== "";
                    		}
                    		if (input.is("[name=CD_CCLRSN]")) {                     	
                    			return input.val() !== "";
                    		}
                    		return true;
                        }
                    }
	            };
	            	      	            
		        //초기 화면 로드시 조회
		        bssInfoDataVO.getInitializeOrdInfo();
            }]);
}());