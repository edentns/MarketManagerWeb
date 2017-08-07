(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.Ord.controller : sa.OrdCtrl
     * 상품분류관리
     */
    angular.module("it.BssItem.controller")
        .controller("it.BssItemInfoCtrl", ["$stateParams", "$scope", "$state", "$http", "$q", "$log", "sa.OrdSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "it.BssItemSvc", "sy.CodeSvc",
            function ($stateParams, $scope, $state, $http, $q, $log, saOrdSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, itBssItemSvc, SyCodeSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();       	
            	
	            var bssInfoDataVO = $scope.bssInfoDataVO = {       	
	        		kind : "",
	        		CD_ITEM : "",
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
	        		NM_COM        : "",
	        		oriOPTTP      : "",
	        		duplFlag      : false,
	        		param :{
	        			// 상품정보
	        			CD_SIGNITEM   : "",
	        			NM_ITEM       : "",
	        			DC_ITEMABBR   : "",
	        			YN_BCD        : "N",
		        		DC_BCD        : "",
		        		CD_ITEMKIND   : "",
		        		CD_ITEMSTAT   : "",
		        		ID_CTGR       : "",
		        		
		        		//판매정보
		        		B_ITEMPRC     : 0,
		        		CD_TAXCLFT    : "001",
		        		RT_TAX        : 0,
		        		S_ITEMPRC     : 0,
		        		CD_PCSUNIT    : "001",
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
		        		CD_WETUNIT    : "",
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
	        			bImage: true,
	        			imgWidth: '0px',
	        			imgHeight: '0px',
	        			currentData:{
	        				
	        			}
	        		},
	        		fileSmallVO: {
	        			CD_AT:"007",
	        			limitCnt: 1,
	        			bImage: true,
	        			imgWidth: '0px',
	        			imgHeight: '0px',
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
	        			bImage: true,
	        			imgWidth: '0px',
	        			imgHeight: '0px',
	        			currentDataList:[]
	        		},
	        		fileDImageVO: {
	        			CD_AT:"006",
	        			limitCnt: 10,
	        			bImage: true,
	        			imgWidth: '0px',
	        			imgHeight: '0px',
	        			currentDataList:[]
	        		}
		        };
	            
	            var gridOpt002VO = $scope.gridOpt002VO = {
	                    messages: {
	                        noRows: "옵션이 존재하지 않습니다.",
	                        loading: "옵션을 가져오는 중...",
	                        requestFailed: "요청 옵션을 가져오는 중 오류가 발생하였습니다.",
	                        retry: "갱신",
	                        commands: {
	                            create: '추가',
	                            destroy: '삭제',
	                            cancel: '취소'
	                        }
	                    },
	                    edit: function (e) {
	                        if (e.model.isNew()) {
	                        	if(e.model.CD_OPT == ""){
	                        		e.model.set("CD_ITEM" ,  bssInfoDataVO.ids);
	                        	}
	                        }
	            		},
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	                				var param = {
                						procedureParam:"MarketManager.USP_IT_02BSSITEMOPT_GET&L_CD_ITEM@s|L_FLAG@s",
                						L_CD_ITEM  :  bssInfoDataVO.ids,
                						L_FLAG     :  "1"
                					};
	            					UtilSvc.getList(param).then(function (res) {
	            						e.success(res.data.results[0]);
	            						bssInfoDataVO.NM_COM = res.data.results[1][0].NM_C;
	            					});
	                			},
	                			create: function(e) {
	                				if(bssInfoDataVO.oriOPTTP != bssInfoDataVO.param.CD_OPTTP){
	                					e.data.models[0].TEMP = bssInfoDataVO.oriOPTTP;
	                				}
	                				for(var i = 0 ; i < e.data.models.length ; i++){
	                					e.data.models[i].CD_ITEM = bssInfoDataVO.CD_ITEM;
	                				}
	                				itBssItemSvc.saveOpt(e.data.models, "I").success(function () {
		                            });
	                	        },
	                			update: function(e) {
	                				itBssItemSvc.saveOpt(e.data.models, "U").success(function () {
		                            });
	                			},
	                			destroy: function(e) {
	                				var defer = $q.defer();
	                				itBssItemSvc.saveOpt(e.data.models, "D").success(function () {
	            						defer.resolve();
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
	                    			id: "CD_ITEM",
	                				fields: {
	                					CD_ITEM:    {  },
	                					CD_OPT:     {  },
	                					CD_OPTCLFT: {  },
	                					NM_OPT:     {  },
	                					QT_SSPL:    { type : "number" },
	                					NO_MD:      {  },
	                					S_ITEMPRC:  { type : "number" },
	                					TEMP:       {  },
	                				}
	                			}
	                		}
	                	}),
	                	navigatable: true,
	                	toolbar: 
	                		["create", "cancel",{ template: "<kendo-button class='k-button k-button-icontext' value='옵션구분' ng-click='bssInfoDataVO.codeUpdateModal()'>옵션구분</kendo-button>" }],
	                	columns: [
	           		           {field: "CD_OPTCLFT",   title: "옵션구분", width: 150,
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
	            		       		    var cd_opt = e.CD_OPTCLFT,
	            		       		    	nmd    = "";
	            		       		    if(cd_opt){
	            		       		    	var optData = bssInfoDataVO.optClftList;	
		                		       		for(var i = 0, leng=optData.length; i<leng; i++){
	                		       			   if(optData[i].CD_DEF === e.CD_OPTCLFT){
	                		       				 nmd = optData[i].NM_DEF;	
	                		       			   }
		                		       		}	
	            		       		    }
	    	            		        return nmd;
		            		        }},
	        		           {field: "NM_OPT",   title: "옵션명",  width: 100,
	   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	        		           {field: "QT_SSPL",      title: "재고수량",    width: 100,
	       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
	       	   					template:"<span style='float:right'>#: QT_SSPL #</span>"},
	        		           {field: "NO_MD",   title: "모델 NO",   width: 100, 
	           	   				headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	        		           {field: "S_ITEMPRC", title: "판매가 (+,-)", width: 100,
	       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
	           	   				template:"<span style='float:right'>#: S_ITEMPRC #</span>"},
	           	   				{command: [ "destroy" ]}
	                	],
	                    collapse: function(e) {
	                        // console.log(e.sender);
	                        this.cancelRow();
	                    },
	                	editable: true,
	                	height: 180
	                };
	            
	            var gridOpt003VO = $scope.gridOpt003VO = {
	                    messages: {
	                        noRows: "옵션이 존재하지 않습니다.",
	                        loading: "옵션을 가져오는 중...",
	                        requestFailed: "요청 옵션을 가져오는 중 오류가 발생하였습니다.",
	                        retry: "갱신",
	                        commands: {
	                            create: '추가',
	                            destroy: '삭제',
	                            cancel: '취소'
	                        }
	                    },
	                    edit: function (e) {
	                        if (e.model.isNew()) {
	                        	if(e.model.CD_OPT == ""){
	                        		e.model.set("CD_ITEM" ,  bssInfoDataVO.ids);
	                        	}
	                        }
	            		},
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	                				var param = {
                						procedureParam:"MarketManager.USP_IT_02BSSITEMOPT_GET&L_CD_ITEM@s|L_FLAG@s",
                						L_CD_ITEM  :  bssInfoDataVO.ids,
                						L_FLAG     :  "2"
                					};
	            					UtilSvc.getList(param).then(function (res) {
	            						e.success(res.data.results[0]);
	            					});
	                			},
	                			create: function(e) {
	                				if(bssInfoDataVO.oriOPTTP != bssInfoDataVO.param.CD_OPTTP){
	                					e.data.models[0].TEMP = bssInfoDataVO.oriOPTTP;
	                				}
	                				for(var i = 0 ; i < e.data.models.length ; i++){
	                					e.data.models[i].CD_ITEM = bssInfoDataVO.CD_ITEM;
	                				}
	                				itBssItemSvc.saveOpt(e.data.models, "I").success(function () {
		                            });
	                	        },
	                			update: function(e) {
	                				itBssItemSvc.saveOpt(e.data.models, "U").success(function () {
		                            });
	                			},
	                			destroy: function(e) {
	                				var defer = $q.defer();
	                				itBssItemSvc.saveOpt(e.data.models, "D").success(function () {
	            						defer.resolve();
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
	                				id: "CD_ITEM",
	                				fields: {
	                					CD_ITEM:      {  },
	                					CD_OPT:       {  },
	                					CD_OPTCLFT:   {  },
	                					NM_OPT:       {  },
	                					QT_SSPL:      { type : "number" },
	                					NO_MD:        {  },
	                					S_ITEMPRC:    { type : "number" },
	                					L_CD_OPT:     {  },
	                					L_CD_OPTCLFT: {  },
	                					L_NM_OPT:     {  },
	                					TEMP:         {  },
	                				}
	                			}
	                		}
	                	}),
	                	navigatable: true,
	                	toolbar: 
	                		["create", "cancel",{ template: "<kendo-button class='k-button k-button-icontext' value='옵션구분' ng-click='bssInfoDataVO.codeUpdateModal()'>옵션구분</kendo-button>" }],
	                	columns: [
	           		           {field: "CD_OPTCLFT",   title: "옵션구분1", width: 150,
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
	            		       		    var cd_opt = e.CD_OPTCLFT,
	            		       		    	nmd    = "";
	            		       		    if(cd_opt){
	            		       		    	var optData = bssInfoDataVO.optClftList;	
		                		       		for(var i = 0, leng=optData.length; i<leng; i++){
	                		       			   if(optData[i].CD_DEF === e.CD_OPTCLFT){
	                		       				 nmd = optData[i].NM_DEF;
	                		       			   }
		                		       		}
	            		       		    }
	    	            		        return nmd;
		            		        }},
	        		           {field: "NM_OPT",   title: "옵션명1",  width: 100,
	   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	   	   					   {field: "L_CD_OPTCLFT",   title: "옵션구분2", width: 150,
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
		            		       		    var cd_opt = e.L_CD_OPTCLFT,
		            		       		    	nmd    = "";
		            		       		    if(cd_opt){
		            		       		    	var optData = bssInfoDataVO.optClftList;	
			                		       		for(var i = 0, leng=optData.length; i<leng; i++){
		                		       			   if(optData[i].CD_DEF === e.L_CD_OPTCLFT){
		                		       				 nmd = optData[i].NM_DEF;	
		                		       			   }
			                		       		}	
		            		       		    }
		    	            		        return nmd;
			            		        }},
		        		       {field: "L_NM_OPT",   title: "옵션명2",  width: 100,
			            		headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	        		           {field: "QT_SSPL",      title: "재고수량",    width: 100,
	       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
	       	   					template:"<span style='float:right'>#: QT_SSPL #</span>"},
	        		           {field: "NO_MD",   title: "모델 NO",   width: 100, 
	           	   				headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	        		           {field: "S_ITEMPRC", title: "판매가 (+,-)", width: 100,
	       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
	           	   				template:"<span style='float:right'>#: S_ITEMPRC #</span>"},
	           	   				{command: [ "destroy" ]}
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
    					L_CD_ITEM: self.ids
    				};	            	
        			UtilSvc.getList(param).then(function (res) {
        				if(res.data.results[0].length >= 1){
        					bssInfoDataVO.param = res.data.results[0][0];
        					bssInfoDataVO.NM_COM = res.data.results[0][0].NM_C;
        					bssInfoDataVO.oriOPTTP = res.data.results[0][0].CD_OPTTP;
        					if(res.data.results[1].length >= 1){
        						self.ctgrChange(0);
        						self.selectedCtgr1.ID_CTGR = res.data.results[1][0].ID_CTGR;
        						self.selectedCtgr1.NM_CTGR = res.data.results[1][0].NM_CTGR;
        						if(res.data.results[1].length >= 2){
        							self.ctgrChange(1);
            						self.selectedCtgr2.ID_CTGR = res.data.results[1][1].ID_CTGR;
            						self.selectedCtgr2.NM_CTGR = res.data.results[1][1].NM_CTGR;
        						}
        						if(res.data.results[1].length >= 3){
            						self.ctgrChange(2);
            						self.selectedCtgr3.ID_CTGR = res.data.results[1][2].ID_CTGR;
            						self.selectedCtgr3.NM_CTGR = res.data.results[1][2].NM_CTGR;
        						}
        					}
        				}
        			});
        			param = {
    					procedureParam: "MarketManager.USP_IT_02BSSITEMFILE_GET&L_CD_ITEM@s|L_CD_AT_1@s|L_CD_AT_2@s|L_CD_AT_3@s|L_CD_AT_4@s",
    					L_CD_ITEM: self.ids,
    					L_CD_AT_1: self.fileMainVO.CD_AT,
    					L_CD_AT_2: self.fileSmallVO.CD_AT,
    					L_CD_AT_3: self.fileDExVO.CD_AT,
    					L_CD_AT_4: self.fileDImageVO.CD_AT
        			};
        			UtilSvc.getList(param).then(function (res) { // 파일첨부 수정 해야함
        				$timeout(function() {
	        				bssInfoDataVO.fileMainVO.currentData = res.data.results[0][0];
	        				bssInfoDataVO.fileSmallVO.currentData = res.data.results[1][0];
	        				bssInfoDataVO.fileDExVO.currentDataList = res.data.results[2];
	        				bssInfoDataVO.fileDImageVO.currentDataList = res.data.results[3];
        				});
        			});
	            };
	            
	            bssInfoDataVO.getInitializeOrdInfo = function(){
	            	var self = this;
	            	
	            	self.kind = $stateParams.kind;
	            	self.ids = $stateParams.ids;
	            	self.CD_ITEM = $stateParams.ids;
	            	
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
	            		self.oriOPTTP = "002";
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
	            
	            /*bssInfoDataVO.vldChange = function(){
	            	var self = this;
	            	if(self.param.YN_VLDPRDUSE == "N"){
	            		self.param.DT_VLD = "";
	            		angular.element("#DTS_VLD").attr("display", true);
	            	}
	            	else angular.element("#DTS_VLD").attr("display", false);
	            };*/
	            
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
	            
	            bssInfoDataVO.sprcCal = function(name,prc, flag){
	            	var self = this;
	            	
	            	if(flag == "R"){
	            		if(!bssInfoDataVO.inputOnlyNum(prc, flag)){
		            		return;
		            	}
	            	}else {
	            		if(!bssInfoDataVO.inputNumber(prc, flag)){
		            		return;
		            	}
	            	}
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
	            
	            // 중복환인
	            bssInfoDataVO.duplCheck = function(){
	            	var self = this;
	            	
            		if (!(self.param.CD_SIGNITEM).trim()) {
	                    return edt.invalidFocus("CD_SIGNITEM", "상품코드를 입력해주세요.");
                    }
	            	
	            	itBssItemSvc.duplCheck(self.param.CD_SIGNITEM).success(function (res) {
	            		self.duplFlag = true;
	            		if(res == "사용하실수 없습니다."){
	            			self.duplFlag = false;
	            		}
						alert(res);
                    });
	            };
	            
	            //  상품복사등록
	            bssInfoDataVO.itemCopyModal = function(){
	            	itBssItemSvc.itemCopyModal().then(function(it_num) {
	            		var param = {
	    					procedureParam: "MarketManager.USP_IT_02BSSITEMCOPY_GET&L_CD_ITEM@s",
	    					L_CD_ITEM: it_num
	    				};	            	
	        			UtilSvc.getList(param).then(function (res) {
	        				if(res.data.results[0].length >= 1){
	        					bssInfoDataVO.param.CD_SIGNITEM = res.data.results[0][0].CD_SIGNITEM;
	        					bssInfoDataVO.param.DC_ITEMABBR = res.data.results[0][0].DC_ITEMABBR;
	        					bssInfoDataVO.param.NM_ITEM     = res.data.results[0][0].NM_ITEM;
	        					bssInfoDataVO.param.YN_BCD      = res.data.results[0][0].YN_BCD;
	        					bssInfoDataVO.param.DC_BCD      = res.data.results[0][0].DC_BCD;
	        					bssInfoDataVO.param.CD_ITEMCLFT = res.data.results[0][0].CD_ITEMCLFT;
	        					bssInfoDataVO.param.CD_ITEMSTAT = res.data.results[0][0].CD_ITEMSTAT;
	        					bssInfoDataVO.param.CD_ITEMKIND = res.data.results[0][0].CD_ITEMKIND;
	        					bssInfoDataVO.bcdChange();
	        					if(res.data.results[1].length >= 1){
	        						bssInfoDataVO.ctgrChange(0);
	        						bssInfoDataVO.selectedCtgr1.ID_CTGR = res.data.results[1][0].ID_CTGR;
	        						bssInfoDataVO.selectedCtgr1.NM_CTGR = res.data.results[1][0].NM_CTGR;
	        						if(res.data.results[1].length >= 2){
	        							bssInfoDataVO.ctgrChange(1);
	            						bssInfoDataVO.selectedCtgr2.ID_CTGR = res.data.results[1][1].ID_CTGR;
	            						bssInfoDataVO.selectedCtgr2.NM_CTGR = res.data.results[1][1].NM_CTGR;
	        						}
	        						if(res.data.results[1].length >= 3){
	            						bssInfoDataVO.ctgrChange(2);
	            						bssInfoDataVO.selectedCtgr3.ID_CTGR = res.data.results[1][2].ID_CTGR;
	            						bssInfoDataVO.selectedCtgr3.NM_CTGR = res.data.results[1][2].NM_CTGR;
	        						}
	        					}
	        				}
	        			});
					});
	            };
	            
	            // 저장
	            bssInfoDataVO.goSave = function(){
	            	if (confirm("저장하시겠습니까?")) {
                        if (bssInfoDataVO.isValid(bssInfoDataVO.param)) {
                        	var SU = bssInfoDataVO.kind == "detail" ? "U" : "I";
                        	
                    		if(bssInfoDataVO.selectedCtgr2.ID_CTGR != ""){
                    			if(bssInfoDataVO.selectedCtgr3.ID_CTGR != ""){
                        			bssInfoDataVO.param.ID_CTGR = bssInfoDataVO.selectedCtgr3.ID_CTGR;
                            	}else{
                            		bssInfoDataVO.param.ID_CTGR = bssInfoDataVO.selectedCtgr2.ID_CTGR;
                            	}
                        	}else{
                        		bssInfoDataVO.param.ID_CTGR = bssInfoDataVO.selectedCtgr1.ID_CTGR;
                        	}
                    		
                        	itBssItemSvc.saveItem(bssInfoDataVO.param, SU).success(function (res_CDITEM) {
                        		bssInfoDataVO.CD_ITEM = res_CDITEM;
                        		if(bssInfoDataVO.param.CD_OPTTP == "002" || bssInfoDataVO.param.CD_OPTTP == "003" ){
	                        		var grid = $("#gridOpt"+bssInfoDataVO.param.CD_OPTTP).data("kendoGrid");
	                            	grid.dataSource.sync();
                        		}
                            	bssInfoDataVO.fileSave();
                            });
                        }
                    }
	            };
	            
	            bssInfoDataVO.fileSave = function() {
	        		if(bssInfoDataVO.fileMainVO.dirty) {
		        		bssInfoDataVO.fileMainVO.CD_REF1 = bssInfoDataVO.CD_ITEM;
		        		bssInfoDataVO.fileMainVO.doUpload(function(){
			        		if(bssInfoDataVO.fileSmallVO.dirty) {
				        		bssInfoDataVO.fileSmallVO.CD_REF1 = bssInfoDataVO.CD_ITEM;
				        		bssInfoDataVO.fileSmallVO.doUpload(function(){
				        			alert('성공하였습니다.');
				        		}, function() {
				        			alert('작은이미지 첨부파일업로드 실패하였습니다.');
				        		});
			        		}
			        		else {
			        			alert('성공하였습니다.');
			        		}
		        			alert('성공하였습니다.');
		        		}, function() {
		        			alert('대표이미지 첨부파일업로드 실패하였습니다.');
		        		});
	        		}
	        		else {
	        			alert('성공하였습니다.');
	        		}
	        		if(bssInfoDataVO.fileDExVO.dirty) {
		        		bssInfoDataVO.fileDExVO.CD_REF1 = bssInfoDataVO.CD_ITEM;
		        		bssInfoDataVO.fileDExVO.doUpload(function(){
		        			if(bssInfoDataVO.fileDImageVO.dirty) {
				        		bssInfoDataVO.fileDImageVO.CD_REF1 = bssInfoDataVO.CD_ITEM;
				        		bssInfoDataVO.fileDImageVO.doUpload(function(){
				        			alert('성공하였습니다.');
				        		}, function() {
				        			alert('상세설명 첨부파일업로드 실패하였습니다.');
				        		});
			        		}
			        		else {
			        			alert('성공하였습니다.');
			        		}
			        		alert('성공하였습니다.');
		        		}, function() {
		        			alert('상세이미지 첨부파일업로드 실패하였습니다.');
		        		});
	        		}
	        		else {
	        			alert('성공하였습니다.');
	        		}
	        	};
	            
	            // 옵션구분
	            bssInfoDataVO.codeUpdateModal = function(){
	            	itBssItemSvc.codeUpdateModal().then(function(res) {
	            		alert(res);
	            	}, function() {
	            		SyCodeSvc.getSubcodeList({cd: "IT_000011", search: "all"}).then(function (result) {
	            			bssInfoDataVO.optClftList = result.data;
                        });
					});
	            };
	            
	            // 기본옵션조회 및 설정
	            bssInfoDataVO.basicOptGet = function(CD_OPTTP){
	            	itBssItemSvc.basicOptGetModal(CD_OPTTP).then(function(res) {
	            		if(CD_OPTTP == "002"){
	            			for(var i = 0 ; i < res.length ; i++){
	            				res[i].dirty = true;
	            				res[i].CD_ITEM = "";
	            				res[i].CD_OPT = "";
	            				res[i].id ="";
		            			$("#gridOpt002").data('kendoGrid').dataSource.add(res[i]);
	            			}
	            		}else if(CD_OPTTP == "003"){
	            			for(var i = 0 ; i < res.length ; i++){
	            				res[i].dirty = true;
	            				res[i].CD_ITEM = "";
	            				res[i].CD_OPT = "";
	            				res[i].id ="";
		            			$("#gridOpt003").data('kendoGrid').dataSource.add(res[i]);
	            			}
	            		}
	            	}, function() { //dismiss
					});
	            };
	            
	            // 다른상품옵션복사하기
	            bssInfoDataVO.otherOptCopy = function(CD_OPTTP){
	            	itBssItemSvc.otherOptCopyModal(CD_OPTTP).then(function(res) {
	            		bssInfoDataVO.param.CD_OPTTP = res.CD_OPTTP;
	            		bssInfoDataVO.optChange();
	            		$timeout(function() {
		            		if(res.CD_OPTTP == "002"){
		            			var param = {
		        						procedureParam:"MarketManager.USP_IT_02BSSITEMOPT_GET&L_CD_ITEM@s|L_FLAG@s",
		        						L_CD_ITEM  :  res.CD_ITEM,
		        						L_FLAG     :  "1"
		        					};
		        					UtilSvc.getList(param).then(function (res) {
		        						for(var i = 0 ; i < res.data.results[0].length ; i++){
		        							res.data.results[0][i].CD_ITEM = "";
		        							res.data.results[0][i].CD_OPT = "";
		        	            			$("#gridOpt002").data('kendoGrid').dataSource.add(res.data.results[0][i]);
		                    			}
		        					});
		            		}else if(res.CD_OPTTP == "003"){
		            			var param = {
		        						procedureParam:"MarketManager.USP_IT_02BSSITEMOPT_GET&L_CD_ITEM@s|L_FLAG@s",
		        						L_CD_ITEM  :  res.CD_ITEM,
		        						L_FLAG     :  "2"
		        					};
		        					UtilSvc.getList(param).then(function (res) {
		        						for(var i = 0 ; i < res.data.results[0].length ; i++){
		        							res.data.results[0][i].CD_ITEM = "";
		        							res.data.results[0][i].CD_OPT = "";
		        	            			$("#gridOpt003").data('kendoGrid').dataSource.add(res.data.results[0][i]);
		                    			}
		        					});
		            		}
	            		});
	            	}, function() { //dismiss
					});
	            };
	            
	            // 미리보기
	            bssInfoDataVO.goPreview = function(){
	            	var self = this;
	            	itBssItemSvc.itemPreviewModal(self.fileMainVO.imgSrc).then(function() {    // 원래 있는 파일 조건 걸기
	            		// 파람 src ctgr 
					});
	            };
	            
	            // 옵션유형 바뀔떄
	            bssInfoDataVO.optChange = function(){
	            	console.log(bssInfoDataVO.param.CD_OPTTP  +" <---바뀔 opptp  "+ bssInfoDataVO.oriOPTTP+" <---원래 opptp  ");
	            	var grid = $("#gridOpt"+bssInfoDataVO.oriOPTTP).data("kendoGrid");
	            	if(grid.dataSource){
		            	if(bssInfoDataVO.oriOPTTP != bssInfoDataVO.param.CD_OPTTP && grid.dataSource.hasChanges() && (bssInfoDataVO.param.CD_OPTTP == "002" || bssInfoDataVO.param.CD_OPTTP == "003")){
		            		if (confirm("원래의 옵션이 취소됩니다.\n계속 하시겠습니까?")) {
	        					grid.cancelChanges();
		            		}else{
		            			$timeout(function() {
		            				bssInfoDataVO.param.CD_OPTTP = bssInfoDataVO.oriOPTTP;
		            			});
		            		}
		            	}
	            	}
	            };
	            
	            // 상품코드 수정시 중복체크 flag = false
	            bssInfoDataVO.duplChange = function () {
	            	bssInfoDataVO.duplFlag = false;
	            };
	            
	            // 판매가 구매가 tax (숫자 + 소수점)
	            bssInfoDataVO.inputNumber = function (prc, flag) {
	            	var _pattern = /^(\d{1,15}([.]\d{0,4})?)?$/;
	            	var value = prc;
	            	
	            	if (!_pattern.test(value)) {
	            		value = value.slice(0, -1);
	            		if(flag == "B"){
	            			bssInfoDataVO.param.B_ITEMPRC = value;
	            		}else if (flag == "S" ){
	            			bssInfoDataVO.param.S_ITEMPRC = value;
	            			return false;
	            		}else if (flag == "T" ){
	            			bssInfoDataVO.tax = value;
	            		}
	                    alert("숫자만 입력이 가능하며, 소수점 넷째자리까지만 허용됩니다.");
	                    return;
	                }
	            	return true;
	            };
	            
	            // 과세율 최소구매수량 숫자만 QT_MINPCS , RT_TAX
	            bssInfoDataVO.inputOnlyNum = function (prc, flag) {
	            	var _pattern = /^[0-9]*$/;
	            	var value = prc;
	            	
	            	if (!_pattern.test(value)) {
	            		if(flag == "Q"){
	            			value = value.slice(0, -1);
	            			bssInfoDataVO.param.QT_MINPCS = value;
	            		}else if (flag == "R" ){
	            			bssInfoDataVO.param.RT_TAX = 0;
	            		}
	                    alert("숫자만 입력이 가능합니다.");	
	                    return false;
	                }
	            	return true;
	            };
	            
	            // 유효성 체크
	            bssInfoDataVO.isValid = function (param) {
	                var data = param;
	                
	                // --------- 상품정보
	                // 중복확인
                    if (!bssInfoDataVO.duplFlag) {
                    	return edt.invalidFocus("duple", "[필수] 중복확인을 해주세요.");
                    }

                    // 상품코드
                    if (!(data.CD_SIGNITEM).trim()) {
	                    return edt.invalidFocus("CD_SIGNITEM", "[필수] 상품코드를 입력해주세요.");
                    }
	            
                    // 상품명
                    if (!(data.NM_ITEM).trim()) {
	                    return edt.invalidFocus("NM_ITEM", "[필수] 상품명을 입력해주세요.");
                    }
                    
                    // 상품분류
                    if (bssInfoDataVO.selectedCtgr1.ID_CTGR == "") {
		                return edt.invalidFocus("ctgr1", "[필수] 상품분류를 선택해주세요.");
	                }
                    
                    // 상품종류
	                if (!(data.CD_ITEMKIND).trim()) {
		                return edt.invalidFocus("CD_ITEMKIND", "[필수] 상품종류를 선택해주세요.");
	                }

                    // 상품구분
	                if (!(data.CD_ITEMCLFT)) {
		                return edt.invalidFocus("CD_ITEMCLFT", "[필수] 상품구분을 선택해주세요.");
	                }

	                // 상품상태
	                if (!(data.CD_ITEMSTAT)) {
		                return edt.invalidFocus("CD_ITEMSTAT", "[필수] 상품상태를 선택해주세요.");
	                }

	                // 이미지 4개
	                /*if (data.DC_REPREMI.email1 || data.DC_REPREMI.email2) {
						if (!/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/.test(data.DC_REPREMI.email1 +"@"+ data.DC_REPREMI.email2)) {
							return edt.invalidFocus("userEmail", "[형식] 이메일은 유효하지 않은 형식입니다.");
						}
	                }*/
	                
	                // --------- 판매정보
	                // 구매가
                    if (!(data.B_ITEMPRC)) {
	                    return edt.invalidFocus("B_ITEMPRC", "[필수] 구매가를 입력해주세요.");
                    }
                    
                    // 과세구분
                    /*if (!(data.NM_ITEM).trim()) {
	                    return edt.invalidFocus("NM_ITEM", "[필수] 상품명을 입력해주세요.");
                    }*/
                    
                    // 판매가
                    if (!(data.S_ITEMPRC)) {
	                    return edt.invalidFocus("S_ITEMPRC", "[필수] 판매가를 입력해주세요.");
                    }
                    
                    // --------- 제조 정보
                    
                    // 출시일자 형식
                    if (!moment(data.DT_RLS, "YYYY-MM-DD", true).isValid()) {
	                    return edt.invalidFocus("DT_RLS", "[형식] 출시일자는 유효하지 않은 형식입니다.(ex-\"2014-11-18\")");
                    }
                    
                    // 유효기간 
                    if (data.YN_VLDPRDUSE == "Y"){
                    	if (!moment(data.DTS_VLD, "YYYY-MM-DD", true).isValid()) {
    	                    return edt.invalidFocus("DTS_VLD", "[형식] 유효기간은 유효하지 않은 형식입니다.(ex-\"2014-11-18\")");
                        }
                    }
                    
                    // --------- 옵션 / 재고
                    
                    var grid = $("#gridOpt"+bssInfoDataVO.param.CD_OPTTP).data("kendoGrid");
	                if(bssInfoDataVO.param.CD_OPTTP=="002" ||  bssInfoDataVO.param.CD_OPTTP=="003"){
	                    if(grid._data.length == 0){
	                    	return edt.invalidFocus("gridOpt"+bssInfoDataVO.param.CD_OPTTP, "[필수] 옵션을 입력해주세요.");
	                    }
	                }

                    return true;
                };
	            	      	            
		        //초기 화면 로드시 조회
		        bssInfoDataVO.getInitializeOrdInfo();
            }]);
}());