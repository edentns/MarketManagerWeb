(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.Ord.controller : sa.OrdCtrl
     * 상품분류관리
     */
    angular.module("it.SaleItem.controller")
        .controller("it.SaleItemInfoCtrl", ["$stateParams", "$scope", "$state", "$http", "$q", "$log", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "it.BssItemSvc", "sy.CodeSvc", "it.SaleItemSvc",
            function ($stateParams, $scope, $state, $http, $q, $log, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, itBssItemSvc, SyCodeSvc, itSaleItemSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();       	
            	
	            var saleInfoDataVO = $scope.saleInfoDataVO = {       	
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
	        		setItem : { boxTitle : "묶음상품구성" },
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
	        		tempOPTTP     : "",
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
		        		CD_ITEMCLFT   : "",
		        		ID_CTGR       : "",
		        		
		        		//판매정보
		        		B_ITEMPRC     : 0,
		        		CD_TAXCLFT    : "001",
		        		RT_TAX        : 10,
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
	        			imgHeight: '0px'
	        		},
	        		fileSmallVO: {
	        			CD_AT:"007",
	        			limitCnt: 1,
	        			bImage: true,
	        			imgWidth: '0px',
	        			imgHeight: '0px'
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
	                        		e.model.set("CD_ITEM" ,  saleInfoDataVO.ids);
	                        	}
	                        }
	            		},
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	                				var param = {
                						procedureParam:"MarketManager.USP_IT_02BSSITEMOPT_GET&L_CD_ITEM@s|L_FLAG@s",
                						L_CD_ITEM  :  saleInfoDataVO.ids,
                						L_FLAG     :  "1"
                					};
	            					UtilSvc.getList(param).then(function (res) {
	            						e.success(res.data.results[0]);
	            						saleInfoDataVO.NM_COM = res.data.results[1][0].NM_C;
	            					});
	                			},
	                			create: function(e) {
	                				if(saleInfoDataVO.oriOPTTP != saleInfoDataVO.param.CD_OPTTP){
	                					e.data.models[0].TEMP = saleInfoDataVO.oriOPTTP;
	                				}
	                				for(var i = 0 ; i < e.data.models.length ; i++){
	                					e.data.models[i].CD_ITEM = saleInfoDataVO.CD_ITEM;
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
	                		["create", "cancel",{ template: "<kendo-button class='k-button k-button-icontext' value='옵션구분' ng-click='saleInfoDataVO.codeUpdateModal()'>옵션구분</kendo-button>" }],
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
		            		    			dataSource: saleInfoDataVO.optClftList,
		            		    			valuePrimitive: true
		            		    		});
	          		       	   	  }	 ,  template: function(e){
	            		       		    var cd_opt = e.CD_OPTCLFT,
	            		       		    	nmd    = "";
	            		       		    if(cd_opt){
	            		       		    	var optData = saleInfoDataVO.optClftList;	
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
	                        		e.model.set("CD_ITEM" ,  saleInfoDataVO.ids);
	                        	}
	                        }
	            		},
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	                				var param = {
                						procedureParam:"MarketManager.USP_IT_02BSSITEMOPT_GET&L_CD_ITEM@s|L_FLAG@s",
                						L_CD_ITEM  :  saleInfoDataVO.ids,
                						L_FLAG     :  "2"
                					};
	            					UtilSvc.getList(param).then(function (res) {
	            						e.success(res.data.results[0]);
	            					});
	                			},
	                			create: function(e) {
	                				if(saleInfoDataVO.oriOPTTP != saleInfoDataVO.param.CD_OPTTP){
	                					e.data.models[0].TEMP = saleInfoDataVO.oriOPTTP;
	                				}
	                				for(var i = 0 ; i < e.data.models.length ; i++){
	                					e.data.models[i].CD_ITEM = saleInfoDataVO.CD_ITEM;
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
	                		["create", "cancel",{ template: "<kendo-button class='k-button k-button-icontext' value='옵션구분' ng-click='saleInfoDataVO.codeUpdateModal()'>옵션구분</kendo-button>" }],
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
		            		    			dataSource: saleInfoDataVO.optClftList,
		            		    			valuePrimitive: true
		            		    		});
	          		       	   	  }	 ,  template: function(e){
	            		       		    var cd_opt = e.CD_OPTCLFT,
	            		       		    	nmd    = "";
	            		       		    if(cd_opt){
	            		       		    	var optData = saleInfoDataVO.optClftList;	
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
			            		    			dataSource: saleInfoDataVO.optClftList,
			            		    			valuePrimitive: true
			            		    		});
		          		       	   	  }	 ,  template: function(e){
		            		       		    var cd_opt = e.L_CD_OPTCLFT,
		            		       		    	nmd    = "";
		            		       		    if(cd_opt){
		            		       		    	var optData = saleInfoDataVO.optClftList;	
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
	            	            	            
	            saleInfoDataVO.initBssItem = function(){
	            	saleInfoDataVO.duplFlag = true;
	            	var self = this,
	            		param = {
    					procedureParam: "MarketManager.USP_IT_02BSSITEMINFO01_GET&L_CD_ITEM@s",
    					L_CD_ITEM: self.ids
    				};	            	
        			UtilSvc.getList(param).then(function (res) {
        				if(res.data.results[0].length >= 1){
        					saleInfoDataVO.param = res.data.results[0][0];
        					saleInfoDataVO.NM_COM = res.data.results[0][0].NM_C;
        					saleInfoDataVO.tempOPTTP = res.data.results[0][0].CD_OPTTP;
        					saleInfoDataVO.oriOPTTP = res.data.results[0][0].CD_OPTTP;
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
        				saleInfoDataVO.taxChange();
        				saleInfoDataVO.sprcCal('', Number(saleInfoDataVO.param.RT_TAX) ,'R');
        				saleInfoDataVO.splyChange();
        				saleInfoDataVO.mrfrChange();
        				saleInfoDataVO.bcdChange();
        				saleInfoDataVO.shptpChange();
        			});
    				saleInfoDataVO.fileMainVO.currentData = resData.fileMainVOcurrentData;
    				saleInfoDataVO.fileSmallVO.currentData = resData.fileSmallVOcurrentData;
    				saleInfoDataVO.fileDExVO.currentDataList = resData.fileDExVOcurrentDataList;
    				saleInfoDataVO.fileDImageVO.currentDataList = resData.fileDImageVOcurrentDataList;
    				
	            };
	            
	            saleInfoDataVO.getInitializeItemInfo = function(){
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
	            		self.tempOPTTP = "002";
	            		self.oriOPTTP = "002";
	            	}else{
	                    self.goBack();	                    
	            	}
		        };
		        
		        saleInfoDataVO.goBack = function() {
		        	$state.go('app.itSaleItem', { kind: 'list', menu: null, ids: null });
		        };
	            
	            saleInfoDataVO.ctgrChange = function(flag){
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
	            
	            saleInfoDataVO.bcdChange = function(){
	            	var self = this;
	            	if(self.param.YN_BCD == "Y"){
	            		self.param.DC_BCD = "";
	            		angular.element("#DC_BCD").attr("readonly", true);
	            	}
	            	else angular.element("#DC_BCD").attr("readonly", false);
	            };
	            
	            saleInfoDataVO.mrfrChange = function(){
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
	            
	            saleInfoDataVO.splyChange = function(){
	            	var self = this;
	            	if(self.param.YN_SPLYOWN == "Y"){
	            		self.param.NM_SPLY = self.NM_COM;
	            		angular.element("#NM_SPLY").attr("readonly", true);
	            	}
	            	else {
	            		angular.element("#NM_SPLY").attr("readonly", false);
	            	}
	            };
	            
	            /*saleInfoDataVO.vldChange = function(){
	            	var self = this;
	            	if(self.param.YN_VLDPRDUSE == "N"){
	            		self.param.DT_VLD = "";
	            		angular.element("#DTS_VLD").attr("display", true);
	            	}
	            	else angular.element("#DTS_VLD").attr("display", false);
	            };*/
	            
	            saleInfoDataVO.shptpChange = function(){
	            	var self = this;
	            	if(self.param.CD_ITEMSHPTP == "999"){
	            		angular.element("#NM_ITEMSHPTP").attr("readonly", false);
	            	}
	            	else {
	            		angular.element("#NM_ITEMSHPTP").attr("readonly", true);
	            	}
	            };
	            
	            saleInfoDataVO.sprcCal = function(name,prc, flag){
	            	var self = this;
	            	if(flag == "R"){
	            		if(!saleInfoDataVO.inputOnlyNum(prc, flag)){
		            		return;
		            	}
	            	}else {
	            		if(!saleInfoDataVO.inputNumber(prc, flag)){
		            		return;
		            	}
	            	}
	            	// tax = 상품금액, taxValue = 과세금액, param.S_ITEMPRC = 판매가, param.RT_TAX = 과세비율
	            	if(name == "tax"){
	            		self.param.S_ITEMPRC = Math.ceil(Number(self.tax)*(Number(self.param.RT_TAX)+100)/100);
	            		self.taxValue = (self.param.RT_TAX/100) * self.param.S_ITEMPRC;
	            		self.taxValue = (Number(self.taxValue)).toFixed(4);
	            	}else{
		            	self.taxValue = (self.param.RT_TAX/100) * self.param.S_ITEMPRC;
		            	self.tax      = self.param.S_ITEMPRC - self.taxValue;
		            	self.taxValue = (Number(self.taxValue)).toFixed(4);
	            	}
	            };
	            
	            saleInfoDataVO.taxChange = function(){
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
	            saleInfoDataVO.duplCheck = function(){
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
	            saleInfoDataVO.itemCopyModal = function(){
	            	itBssItemSvc.itemCopyModal().then(function(it_num) {
	            		var param = {
	    					procedureParam: "MarketManager.USP_IT_02BSSITEMCOPY_GET&L_CD_ITEM@s",
	    					L_CD_ITEM: it_num
	    				};	            	
	        			UtilSvc.getList(param).then(function (res) {
	        				if(res.data.results[0].length >= 1){
	        					saleInfoDataVO.param.CD_SIGNITEM = res.data.results[0][0].CD_SIGNITEM;
	        					saleInfoDataVO.param.DC_ITEMABBR = res.data.results[0][0].DC_ITEMABBR;
	        					saleInfoDataVO.param.NM_ITEM     = res.data.results[0][0].NM_ITEM;
	        					saleInfoDataVO.param.YN_BCD      = res.data.results[0][0].YN_BCD;
	        					saleInfoDataVO.param.DC_BCD      = res.data.results[0][0].DC_BCD;
	        					saleInfoDataVO.param.CD_ITEMCLFT = res.data.results[0][0].CD_ITEMCLFT;
	        					saleInfoDataVO.param.CD_ITEMSTAT = res.data.results[0][0].CD_ITEMSTAT;
	        					saleInfoDataVO.param.CD_ITEMKIND = res.data.results[0][0].CD_ITEMKIND;
	        					saleInfoDataVO.bcdChange();
	        					if(res.data.results[1].length >= 1){
	        						saleInfoDataVO.ctgrChange(0);
	        						saleInfoDataVO.selectedCtgr1.ID_CTGR = res.data.results[1][0].ID_CTGR;
	        						saleInfoDataVO.selectedCtgr1.NM_CTGR = res.data.results[1][0].NM_CTGR;
	        						if(res.data.results[1].length >= 2){
	        							saleInfoDataVO.ctgrChange(1);
	            						saleInfoDataVO.selectedCtgr2.ID_CTGR = res.data.results[1][1].ID_CTGR;
	            						saleInfoDataVO.selectedCtgr2.NM_CTGR = res.data.results[1][1].NM_CTGR;
	        						}
	        						if(res.data.results[1].length >= 3){
	            						saleInfoDataVO.ctgrChange(2);
	            						saleInfoDataVO.selectedCtgr3.ID_CTGR = res.data.results[1][2].ID_CTGR;
	            						saleInfoDataVO.selectedCtgr3.NM_CTGR = res.data.results[1][2].NM_CTGR;
	        						}
	        					}
	        				}
	        			});
					});
	            };
	            
	            // 저장
	            saleInfoDataVO.goSave = function(){
	            	var SU = saleInfoDataVO.kind == "detail" ? "U" : "I";
	            	if(SU == "I"){
		            	if (confirm("저장하시겠습니까?")) {
		                    if (saleInfoDataVO.isValid(saleInfoDataVO.param)) {
		                		if(saleInfoDataVO.selectedCtgr2.ID_CTGR != ""){
		                			if(saleInfoDataVO.selectedCtgr3.ID_CTGR != ""){
		                    			saleInfoDataVO.param.ID_CTGR = saleInfoDataVO.selectedCtgr3.ID_CTGR;
		                        	}else{
		                        		saleInfoDataVO.param.ID_CTGR = saleInfoDataVO.selectedCtgr2.ID_CTGR;
		                        	}
		                    	}else{
		                    		saleInfoDataVO.param.ID_CTGR = saleInfoDataVO.selectedCtgr1.ID_CTGR;
		                    	}
		                    	itSaleItemSvc.saveItem(saleInfoDataVO.param, SU).success(function (res_CDITEM) {
		                    		saleInfoDataVO.CD_ITEM = res_CDITEM;
		                    		saleInfoDataVO.param.RT_TAX = Number(saleInfoDataVO.param.RT_TAX);
		                    		if(saleInfoDataVO.param.CD_OPTTP == "002" || saleInfoDataVO.param.CD_OPTTP == "003" ){
		                        		var grid = $("#gridOpt"+saleInfoDataVO.param.CD_OPTTP).data("kendoGrid");
		                            	grid.dataSource.sync();
		                    		}
		                        	saleInfoDataVO.fileSave();
		                        	alert("판매상품 등록이 완료되었습니다.");
		                        	saleInfoDataVO.goBack();
		                        });
		                    }
		                }
	            	}else{
	            		if (confirm("수정하시겠습니까?")) {
		                    if (saleInfoDataVO.isValid(saleInfoDataVO.param)) {
		                		if(saleInfoDataVO.selectedCtgr2.ID_CTGR != ""){
		                			if(saleInfoDataVO.selectedCtgr3.ID_CTGR != ""){
		                    			saleInfoDataVO.param.ID_CTGR = saleInfoDataVO.selectedCtgr3.ID_CTGR;
		                        	}else{
		                        		saleInfoDataVO.param.ID_CTGR = saleInfoDataVO.selectedCtgr2.ID_CTGR;
		                        	}
		                    	}else{
		                    		saleInfoDataVO.param.ID_CTGR = saleInfoDataVO.selectedCtgr1.ID_CTGR;
		                    	}
		                		saleInfoDataVO.param.CD_ITEM = saleInfoDataVO.ids;
		                		saleInfoDataVO.param.RT_TAX = Number(saleInfoDataVO.param.RT_TAX);
		                    	itSaleItemSvc.saveItem(saleInfoDataVO.param, SU).success(function () {
		                    		if(saleInfoDataVO.param.CD_OPTTP == "002" || saleInfoDataVO.param.CD_OPTTP == "003" ){
		                        		var grid = $("#gridOpt"+saleInfoDataVO.param.CD_OPTTP).data("kendoGrid");
		                            	grid.dataSource.sync();
		                    		}
		                        	saleInfoDataVO.fileSave();
		                        	alert("판매상품 수정이 완료되었습니다.");
		                        	saleInfoDataVO.goBack();
		                        });
		                    }
		                }
	            	}
	            };
	            
	            saleInfoDataVO.fileSave = function() {
	        		if(saleInfoDataVO.fileMainVO.dirty) {
		        		saleInfoDataVO.fileMainVO.CD_REF1 = saleInfoDataVO.CD_ITEM;
		        		saleInfoDataVO.fileMainVO.doUpload(function(){
			        		if(saleInfoDataVO.fileSmallVO.dirty) {
				        		saleInfoDataVO.fileSmallVO.CD_REF1 = saleInfoDataVO.CD_ITEM;
				        		saleInfoDataVO.fileSmallVO.doUpload(function(){
				        			if(saleInfoDataVO.fileDExVO.dirty) {
						        		saleInfoDataVO.fileDExVO.CD_REF1 = saleInfoDataVO.CD_ITEM;
						        		saleInfoDataVO.fileDExVO.doUpload(function(){
						        			if(saleInfoDataVO.fileDImageVO.dirty) {
								        		saleInfoDataVO.fileDImageVO.CD_REF1 = saleInfoDataVO.CD_ITEM;
								        		saleInfoDataVO.fileDImageVO.doUpload(function(){
								        		}, function() {
								        			alert('상세이미지 첨부파일업로드 실패하였습니다.');
								        		});
							        		}
						        		}, function() {
						        			alert('상세설명 첨부파일업로드 실패하였습니다.');
						        		});
					        		}
				        		}, function() {
				        			alert('작은이미지 첨부파일업로드 실패하였습니다.');
				        		});
			        		}
			        		else {
			        		}
		        		}, function() {
		        			alert('대표이미지 첨부파일업로드 실패하였습니다.');
		        		});
	        		}
	        	};
	            
	            // 옵션구분
	            saleInfoDataVO.codeUpdateModal = function(){
	            	itBssItemSvc.codeUpdateModal().then(function(res) {
	            		alert(res);
	            	}, function() {
	            		SyCodeSvc.getSubcodeList({cd: "IT_000011", search: "all"}).then(function (result) {
	            			saleInfoDataVO.optClftList = result.data;
                        });
					});
	            };
	            
	            // 기본옵션조회 및 설정
	            saleInfoDataVO.basicOptGet = function(CD_OPTTP){
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
	            saleInfoDataVO.otherOptCopy = function(CD_OPTTP){
	            	itBssItemSvc.otherOptCopyModal(CD_OPTTP).then(function(res) {
	            		saleInfoDataVO.tempOPTTP = saleInfoDataVO.param.CD_OPTTP;
	            		saleInfoDataVO.param.CD_OPTTP = res.CD_OPTTP;
	            		saleInfoDataVO.optChange();
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
	            saleInfoDataVO.goPreview = function(){
	            	var self = this,
	            		paramList = [],
	            	    imageList = [],
	            	  	DexImage = [],
	            	  	Dimage = [];
	            	for(var i = 0 ; i < self.iKindList.length ; i++){
	            		if(saleInfoDataVO.param.CD_ITEMKIND == self.iKindList[i].CD_DEF){
	            			saleInfoDataVO.param.NM_ITEMKIND = self.iKindList[i].NM_DEF;
	            		}
	            	}
	            	imageList.push(self.fileMainVO.imgSrc);
	            	imageList.push(self.fileSmallVO.imgSrc);
	            	for(var i = 0 ; i < self.fileDExVO.currentDataList.length ; i++ ){
	            		if(self.fileDExVO.currentDataList[i].phantom){
	            			DexImage.push(self.fileDExVO.currentDataList[i].imgSrc);
	            		}else{
	            			DexImage.push(self.fileDExVO.currentDataList[i].NM_FILEPATH);
	            		}
	            	}
	            	for(var i = 0 ; i < self.fileDImageVO.currentDataList.length ; i++ ){
	            		if(self.fileDImageVO.currentDataList[i].phantom){
	            			Dimage.push(self.fileDImageVO.currentDataList[i].imgSrc);
	            		}else{
	            			Dimage.push(self.fileDImageVO.currentDataList[i].NM_FILEPATH);
	            		}
	            	}
	            	imageList.push(DexImage);
	            	imageList.push(Dimage);
	            	paramList.push(imageList);
	            	paramList.push(saleInfoDataVO.param);
	            	if(saleInfoDataVO.param.CD_OPTTP == "002" || saleInfoDataVO.param.CD_OPTTP == "003"){
		            	var grid = $("#gridOpt"+saleInfoDataVO.param.CD_OPTTP).data("kendoGrid");
		            	paramList.push(grid._data);
	            	}
	            	itBssItemSvc.itemPreviewModal(paramList).then(function() {    
	            		// 파람 src ctgr 
					});
	            };
	            
	            // 옵션유형 바뀔떄
	            saleInfoDataVO.optChange = function(){
	            	if(saleInfoDataVO.tempOPTTP == "002" || saleInfoDataVO.tempOPTTP == "003"){
	            	var grid = $("#gridOpt"+saleInfoDataVO.tempOPTTP).data("kendoGrid");
		            	if(saleInfoDataVO.tempOPTTP != saleInfoDataVO.param.CD_OPTTP && grid.dataSource._data.length != 0){
		            		if (confirm("원래의 옵션이 취소됩니다.\n계속 하시겠습니까?")) {
	        					grid.cancelChanges();
		            		}else{
		            			$timeout(function() {
		            				saleInfoDataVO.param.CD_OPTTP = saleInfoDataVO.tempOPTTP;
		            			});
		            		}
		            	}
		            	saleInfoDataVO.tempOPTTP = saleInfoDataVO.param.CD_OPTTP;
	            	}
	            };
	            
	            // 상품코드 수정시 중복체크 flag = false
	            saleInfoDataVO.duplChange = function () {
	            	saleInfoDataVO.duplFlag = false;
	            };
	            
	            // 판매가 구매가 tax (숫자 + 소수점)
	            saleInfoDataVO.inputNumber = function (prc, flag) {
	            	var _pattern = /^(\d{1,15}([.]\d{0,4})?)?$/;
	            	var value = prc;
	            	
	            	if (!_pattern.test(value)) {
	            		value = value.slice(0, -1);
	            		if(flag == "B"){
	            			saleInfoDataVO.param.B_ITEMPRC = value;
	            		}else if (flag == "S" ){
	            			saleInfoDataVO.param.S_ITEMPRC = value;
	            			return false;
	            		}else if (flag == "T" ){
	            			saleInfoDataVO.tax = value;
	            		}
	                    alert("숫자만 입력이 가능하며, 소수점 넷째자리까지만 허용됩니다.");
	                    return;
	                }
	            	return true;
	            };
	            
	            // 과세율 최소구매수량 숫자만 QT_MINPCS , RT_TAX
	            saleInfoDataVO.inputOnlyNum = function (prc, flag) {
	            	var _pattern = /^[0-9]*$/;
	            	var value = prc;
	            	
	            	if (!_pattern.test(value)) {
	            		if(flag == "Q"){
	            			value = value.slice(0, -1);
	            			saleInfoDataVO.param.QT_MINPCS = value;
	            		}else if (flag == "R" ){
	            			saleInfoDataVO.param.RT_TAX = 0;
	            		}
	                    alert("숫자만 입력이 가능합니다.");	
	                    return false;
	                }
	            	return true;
	            };
	            
	            // 유효성 체크
	            saleInfoDataVO.isValid = function (param) {
	                var data = param,
	                	self = this;
	                
	                // --------- 상품정보
	                // 중복확인
                    if (!saleInfoDataVO.duplFlag) {
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
                    if (saleInfoDataVO.selectedCtgr1.ID_CTGR == "") {
		                return edt.invalidFocus("ctgr1", "[필수] 상품분류를 선택해주세요.");
	                }
                    
                    // 바코드
                    if (data.YN_BCD == "N"){
                    	if(!(data.DC_BCD).trim()){
                    		return edt.invalidFocus("DC_BCD", "[필수] 바코드 없는 사유를 입력해주세요.");
                    	}
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
	                // - 대표이미지
	                if(!self.fileMainVO.fileName || self.fileMainVO.fileName==""){
	                	 return edt.invalidFocus("filevo-004", "[필수] 대표이미지를  등록해주세요.");
	                }
	                
	                // - 작은이미지
	                if(!self.fileSmallVO.fileName || self.fileSmallVO.fileName==""){
	                	 return edt.invalidFocus("fileSmallVO", "[필수] 작은이미지를 등록해주세요.");
	                }
	                
	                // - 상세설명
	                if(self.fileDExVO.currentDataList.length == 0){
	                	 return edt.invalidFocus("fileDExVO", "[필수] 상세설명이미지를  등록 해주세요.");
	                }
	                
	                // - 상세이미지
	                if(self.fileDImageVO.currentDataList.length == 0){
	                	 return edt.invalidFocus("fileDImageVO", "[필수] 상세이미지를  등록 해주세요.");
	                }
	                
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
                    if(data.DT_RLS){
	                    if (!moment(data.DT_RLS, "YYYY-MM-DD", true).isValid()) {
		                    return edt.invalidFocus("DT_RLS", "[형식] 출시일자는 유효하지 않은 형식입니다.(ex-\"2014-11-18\")");
	                    }
                    }
                    
                    // 유효기간 
                    if (data.YN_VLDPRDUSE == "Y"){
                    	if (!moment(data.DTS_VLD, "YYYY-MM-DD", true).isValid()) {
    	                    return edt.invalidFocus("DTS_VLD", "[형식] 유효기간은 유효하지 않은 형식입니다.(ex-\"2014-11-18\")");
                        }
                    }
                    
                    // --------- 배송정보
                    
                    if(saleInfoDataVO.param.CD_ITEMSHPTP == "999"){
                    	if(!(data.NM_ITEMSHPTP).trim()){
                    		return edt.invalidFocus("NM_ITEMSHPTP", "[형식] 상품배송유형 기타 란에 유효하지 않은 형식입니다.");
                    	}
                    }else{
                    	saleInfoDataVO.param.NM_ITEMSHPTP ="";
                    }
                    
                    // --------- 옵션 / 재고
                    
	                if(saleInfoDataVO.param.CD_OPTTP=="002" ||  saleInfoDataVO.param.CD_OPTTP=="003"){
	                    var grid = $("#gridOpt"+saleInfoDataVO.param.CD_OPTTP).data("kendoGrid");
	                    if(grid._data.length == 0){
	                    	return edt.invalidFocus("gridOpt"+saleInfoDataVO.param.CD_OPTTP, "[필수] 옵션을 입력해주세요.");
	                    }
	                }

                    return true;
                };
	            	      	            
		        //초기 화면 로드시 조회
		        saleInfoDataVO.getInitializeItemInfo();
            }]);
}());