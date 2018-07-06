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
	        		addInfo : { boxTitle : "추가구성상품" },
	        		licenseInfo : { boxTitle : "인허가 / 고시정보" },
	        		omInfo : { boxTitle : "오픈마켓별 추가정보" },
	        		itemCtgrList1 : [],
	        		selectedCtgr1 : {ID_CTGR : "", NM_CTGR: ""},
	        		itemCtgrList2 : [],
	        		selectedCtgr2 : {ID_CTGR : "", NM_CTGR: ""},
	        		itemCtgrList3 : [],
	        		selectedCtgr3 : {ID_CTGR : "", NM_CTGR: ""},
	        		itemCooList1  : [],
	        		selectedCoo1  : {CD_COO : "", NM_COO: ""},
	        		itemCooList2  : [],
	        		selectedCoo2  : {CD_COO : "", NM_COO: ""},
	        		itemCooList3  : [],
	        		selectedCoo3  : {CD_COO : "", NM_COO: ""},
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
	        		addSortList   : [],
	        		addSaleStatList:[],
	        		liogList      : [],
	        		shpwayList    : [],
	        		mrkCodeList   : [],
                    cmrkCodeList  : [],
                    auctMrkList   : [],
                    auctMrkSelected : "",
                    auctMrkTkbkSelected : "",
                    auctParsList  : [],
                    gmrkMrkList   : [],
                    gmrkMrkSelected : "",
                    gmrkMrkTkbkSelected : "",
                    gmrkParsList  : [],
                    storfMrkList  : [],
                    storfMrkSelected: "",
                    storfMrkTkbkSelected: "",
                    storfParsList : [],
                    stMrkList     : [],
                    stMrkSelected : "",
                    stMrkTkbkSelected : "",
                    stParsList    : [],
                    coopMrkList   : [],
                    coopMrkSelected : "",
                    coopMrkTkbkSelected : "",
                    coopParsList  : [],
                    postCodeList  : [],
                    cooKindList   : [],
                    prcShpList    : [],
                    shpTplList    : [],
                    shpAWayList   : [],
                    shpSWayList   : [],
                    shpSTWayList  : [],
                    shpCWayList   : [],
                    exchAClftList : [],
                    exchGClftList : [],
                    auctCtfcList  : [],
                    gmrkCtfcList  : [],
                    storfCtfcList : [],
                    stCtfcList    : [],
                    coopCtfcList  : [],
                    shpprcList    : [],
                    sectCntYnList : [],
                    servItemList  : [],
                    shpprcCList   : [],
                    shpprSTList   : [],
                    shpGuiList    : [],
                    CD_PRCSHP     : '001',
	        		itemDetailYN  : 'N',
	        		puhRaBtn      : '001',
	        		shpRaBtn      : '001',
	        		tax           : 0,
	        		taxValue      : 0,
	        		NM_COM        : "",
	        		tempOPTTP     : "",
	        		oriOPTTP      : "",
	        		duplFlag      : false,
	        		addItemList   : [{ID : 1, LABEL : "1개"},{ID : 2, LABEL : "2개"},{ID : 3, LABEL : "3개"},{ID : 4, LABEL : "4개"},{ID : 5, LABEL : "5개"}],
	        		addItemNo     : 1,
	        		optDeleteList : new Array(),
	        		addDeleteList : new Array(),
	        		storfCtfcDeleteList : new Array(),
	        		stCtfcDeleteList    : new Array(),
	        		coopCtfcDeleteList  : new Array(),
	        		ynUseDataSource : [{
						"NM_DEF": '사용',
						"CD_DEF": 'Y'
						},{
						"NM_DEF": '사용안함',
						"CD_DEF": 'N'
	                }],
	                YN_QICK       : "N",
	        		param :{
	        			// 상품정보
	        			CD_SIGNITEM   : "",
	        			NM_ITEM       : "",
	        			DC_ITEMABBR   : "",
	        			NM_BRD        : "",
		        		CD_ITEMKIND   : "",
		        		NM_MD         : "",
		        		CD_ITEMSTAT   : "",
		        		ID_CTGR       : "",
		        		CD_COOKIND    : "001",
		        		CD_COO        : "",
		        		NM_FGFT       : "",
		        		DT_FGFTPRESSTART : "",
		        		DT_FGFTPRESEND   : "",
		        		INFO_FGFT     : "",
		        		HTML_DETEXPL  : "",
		        		CD_CPYBSSITEM : "",
		        		NO_ASPHNE     : "",
		        		GUI_AS        : "",
		        		CD_BSSSALE       : "002",
		        		CD_ADDITEM    : "",
		        		
		        		//판매정보
		        		S_ITEMPRC     : 0,
		        		QT_SSPL       : 0,
		        		B_ITEMPRC     : 0,
		        		YN_PORTPRCCOMPSITERGTT : "Y",
		        		YN_TEENPCHS   : "Y",
		        		CD_TAXCLFT    : "001",
		        		DT_SALESTART  : "",
		        		DT_SALEEND    : "",
		        		DT_VLD        : "",
		        		DT_MNFT       : "",
		        		
		        		//옵션/재고
		        		CD_OPTTP      : "001",
		        		NM_OPT1       : "",
		        		VAL_OPT1      : "",
		        		NM_OPT2       : "",
		        		VAL_OPT2      : "",
		        		NM_OPT3       : "",
		        		VAL_OPT3      : "",
		        		
		        		//추가구성상품
		        		YN_USE        : "Y",
		        		CD_SORTORD    : "001",
		        		HTML_ADDDETEXPL  : "",
		        		//넣을때 trim 필요할듯, 스페이스 안되게 막던가
		        		NM_ADDITEM1   : "",
		        		VAL_ADDITEM1  : "",
		        		PRC_ADDITEM1  : "",
		        		NM_ADDITEM2   : "",
		        		VAL_ADDITEM2  : "",
		        		PRC_ADDITEM2  : "",
		        		NM_ADDITEM3   : "",
		        		VAL_ADDITEM3  : "",
		        		PRC_ADDITEM3  : "",
		        		NM_ADDITEM4   : "",
		        		VAL_ADDITEM4  : "",
		        		PRC_ADDITEM4  : "",
		        		NM_ADDITEM5   : "",
		        		VAL_ADDITEM5  : "",
		        		PRC_ADDITEM5  : "",
		        		
		        		//고시정보
		        		CD_LIOG       : "",
		        		ANNOINFOARTILIST : [],
		        		
		        		//옥션
		        		AUCT:{
		        		YN_RSVSALE    : "Y",
		        		DT_SHPSTART   : "",
		        		VAL_UNI       : "",
		        		PRC_UNI       : "",
		        		YN_MAXPCHSAMOU: "Y",
		        		AMOU_MAXPCHSLIM: "",
		        		DAYS_PRDLIM   : "",
		        		AMOU_PRDLIM   : "",
		        		AMOU_TIMSLIM  : "",
		        		HTML_AVTMTRI  : "",
		        		CD_SHPWAY     : "",
		        		CD_SHPPARS    : "",
		        		CD_POST       : "001",
		        		PRC_POST      : "",
		        		AREA_QUISEV   : "",
		        		NM_QUISEVCMPN : "",
		        		NO_QUISEVPHNE : "",
		        		CD_TKBKPARS   : "",
		        		PRC_TKBKECHGONESHP : "",
		        		CD_SHPPRCTPL  : "",
		        		PRC_SHP1      : "",        //1,2 DB컬럼은 PRC_SHP로 저장
		        		PRC_SHP2      : "",
		        		PRC_STDSHP    : "",
		        		CD_SHPIMPWAY  : "001",
		        		CD_EXCHGDISCCLFT : "001",
		        		COND_CNT      : [{VAL : '', YN: 'Y'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'Y'}],
		        		COND_SHPPRC   : [{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''}],
		        		CTFCINFO      : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}],
		        		ORI_CTFCINFO  : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}]
		        		},
		        		GMRK:{
		        		YN_FECTSALE   : "N",
		        		VAL_UNI       : "",
		        		PRC_UNI       : "",
		        		YN_MAXPCHSAMOU: "Y",
		        		AMOU_MAXPCHSLIM: "",
		        		DAYS_PRDLIM   : "",
		        		AMOU_PRDLIM   : "",
		        		AMOU_TIMSLIM  : "",
		        		HTML_AVTMTRI  : "",
		        		CD_SHPPARS    : "",
		        		AREA_QUISEV   : "",
		        		NM_QUISEVCMPN : "",
		        		NO_QUISEVPHNE : "",
		        		CD_TKBKPARS   : "",
		        		PRC_TKBKECHGONESHP : "",
		        		CD_SHPPRCTPL  : "",
		        		PRC_SHP1      : "",        //1,2 DB컬럼은 PRC_SHP로 저장
		        		PRC_SHP2      : "",
		        		PRC_STDSHP    : "",
		        		CD_SHPIMPWAY  : "001",
		        		CD_AMOUSECTCLFT : "001",
		        		COND_CNT      : [{VAL : '', YN: 'Y'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'Y'}],
		        		COND_SHPPRC   : [{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''}],
		        		CTFCINFO      : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}],
		        		ORI_CTFCINFO  : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}]
		        		},
		        		STORF:{
		        		AMOU_MINIPCHS  : "",
		        		YN_TIMSMAXPCHS: "N",            //DB에는 존재하지 않지만 밖으로 빼면 11번가와 값이 겹침
		        		AMOU_TIMSMAXPCHS : "",
		        		YN_PESMAXPCHS : "N",			//DB에는 존재하지 않지만 밖으로 빼면 11번가와 값이 겹침
                        AMOU_PESMAXPCHS  : "",
                        CD_SHPWAY     : "",
		        		YN_VISRECE    : "N",
		        		YN_BDLSHP     : "N",
                        AREA_QUISEV   : "",
		        		CD_SHPPRC     : "001",
		        		PRC_SHP       : "",
		        		PRC_STDSHP    : "",
		        		CD_SECTCNTYN  : "001",
		        		CD_SHPIMPWAY  : "001",
		        		COND_CNT      : [{VAL : '', YN: 'Y'},{VAL : '', YN: 'Y'}],
		        		COND_SHPPRC   : [{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''}],
		        		CD_TKBKPARS   : "",
		        		PRC_TKBKSHP   : "",
		        		PRC_ECHGSHP   : "",
		        		PRC_AREACLSFSHP  : "",
		        		YN_SPRINSTPRC : "N",
		        		CTFCINFO      : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}]
		        		},
		        		ST:{
		        		CD_MD         : "",
		        		CD_SERVITEM   : "001",
		        		AMOU_MINPCHS  : "",
		        		YN_TIMSMAXPCHS: "N",             //DB에는 존재하지 않지만 밖으로 빼면 스토어팜과 값이 겹침
		        		AMOU_TIMSMAXPCHS : "",
		        		YN_PESMAXPCHS : "N",			 //DB에는 존재하지 않지만 밖으로 빼면 스토어팜과 값이 겹침
                        AMOU_PESMAXPCHS  : "",
                        CD_SHPWAY     : "",
                        CD_SHPPARS    : "",
                        DC_PUREWD     : "",
                        CD_ERLSHPPRCFREIMPWAY : "왕복",
                        PRC_TKBKSHP   : "",
                        PRC_ECHGSHP   : "",
                        GUI_TKBKECHG  : "",
                        CD_SHPPRC     : "001",
                        CD_SHPIMPWAY  : "001",
                        COND_CNT      : [{VAL : '', YN: 'Y'},{VAL : '', YN: 'Y'},{VAL : '', YN: 'Y'},{VAL : '', YN: 'Y'},{VAL : '', YN: 'Y'}],
		        		COND_SHPPRC   : [{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''}],
		        		PRC_STDSHP    : "",
		        		PRC_SHP       : "",
		        		PRC_SHP2      : "",
		        		PRC_SHP3      : "",
		        		CD_SHPPRCADDGUI : "",
		        		PRC_JJADDSHP  : "",
		        		PRC_MNTADDSHP : "",
		        		YN_JJMNT      : "N",
		        		YN_BDLSHP     : "N",
		        		CTFCINFO      : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}]
		        		},
		        		COOP:{
	        			NM_MNFR       : "",
	        			YN_BCD        : "",
	        			DC_BCD        : "",
	        			RSN_BCDNO     : "",
	        			AMOU_PESMAXPCHS     : "",
	        			DAYS_PESMAXPCHSAMOU : "",
	        			DAYS_DELITAK  : "",
	        			YN_PRLICOM    : "",
	        			YN_FECTPCHSAGNCY    : "",
	        			YN_INDVCTCAMAKNECE  : "",
	        			CD_SHPWAY     : "",
	        			CD_SHPPARS    : "",
	        			YN_BDLSHP     : "",
	        			YN_MNTSHP     : "",
	        			CD_SHPPRC     : "",
	        			PRC_SHP       : "",
	        			PRC_STDSHP    : "",
	        			PRC_TKBKSHP   : "",
	        			PRC_FIRTTIMSTKBKSHP : "",
	        			YN_TKBKSHPPRCCOD    : "",
	        			CTFCINFO      : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}]
		        		},
		        		
		        		

		        		/*//제조정보
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
		        		NM_ITEMSHPTP  : "",	*/
	        		},
	        		fileMainVO: {
	        			CD_AT:"004",
	        			limitCnt: 1,
	        			bImage: true,
	        			bDisabled: !page.isWriteable(),
	        			imgWidth: '0px',
	        			imgHeight: '0px'
	        		},
	        		fileDImageVO: {
	        			CD_AT:"006",
	        			limitCnt: 3,
	        			bImage: true,
	        			bDisabled: !page.isWriteable(),
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
	                				e.success(resData.optDataList);
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
	                					NM_OPT1:     { 
	                						validation: {
	    								    nm_optvalidation: function (input) {
	    								    	if (input.is("[name='NM_OPT1']") && input.val() == "") {
	    											input.attr("data-nm_optvalidation-msg", "옵션명을 입력해 주세요.");
	    											return false;
	    										}
	    										if (input.is("[name='NM_OPT1']")) {
	    											var regex = /\s/g;
	    											input.attr("data-nm_optvalidation-msg", "옵션명을 30자 이하로 입력하거나, 공백을 제거하고 입력해 주세요.");
	    											return regex.test(input.val()) === true || input.val().length > 30 ? false : true;
	    										}
	    										return true;
	    									}}},
	                					VAL_OPT1:    {
	                						validation: {
	    								    val_optvalidation: function (input) {
	    								    	if (input.is("[name='VAL_OPT1']") && input.val() == "") {
	    											input.attr("data-val_optvalidation-msg", "옵션값을 입력해 주세요.");
	    											return false;
	    										}
	    										if (input.is("[name='VAL_OPT1']")) {
	    											var regex = /\s/g;
	    											input.attr("data-val_optvalidation-msg", "옵션값을 50자 이하로 입력하거나, 공백을 제거하고 입력해 주세요.");
	    											return regex.test(input.val()) === true || input.val().length > 50 ? false : true;
	    										}
	    										return true;
	    									}}},
	                					QT_SSPL:    { type : "number" },
	                					CD_OPTSIGN: { 
	                						validation: {
	    								    cd_optsignvalidation: function (input) {
	    								    	if (input.is("[name='CD_OPTSIGN']") && input.val() == "") {
	    											input.attr("data-cd_optsignvalidation-msg", "판매코드를 입력해 주세요.");
	    											return false;
	    										}
	    										if (input.is("[name='CD_OPTSIGN']")) {
	    											var regex = /\s/g;
	    											input.attr("data-cd_optsignvalidation-msg", "판매코드를 20자 이하로 입력하거나, 공백을 제거하고 입력해 주세요.");
	    											return regex.test(input.val()) === true || input.val().length > 20 ? false : true;
	    										}
	    										return true;
	    									}}},
	                					S_ITEMPRC:  { type : "number" },
	                					TEMP:       {  },
	                				}
	                			}
	                		}
	                	}),
	                	navigatable: true,
	                	toolbar: 
	                		["create", { template: "<div ng-click='saleInfoDataVO.gridCancel("+JSON.stringify('opt')+")' class='k-button k-button-icontext'><span class='k-icon k-i-cancel'></span>취소</div>"}],
	                	columns: [
	        		           {field: "NM_OPT1",   title: "옵션명",  width: 100,
	   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	   	   					   {field: "VAL_OPT1",   title: "옵션값",  width: 100,
		   	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	        		           {field: "QT_SSPL",      title: "재고수량",    width: 100,
	       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
	       	   					template:"<span style='float:right'>#: QT_SSPL #</span>"},
	        		           {field: "CD_OPTSIGN",   title: "판매자코드",   width: 100, 
	           	   				headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	        		           {field: "S_ITEMPRC", title: "판매가 (+,-)", width: 100,
	       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
	           	   				template:"<span style='float:right'>#: S_ITEMPRC #</span>"},
		           	   			{command: [ {
			                        name: "삭제", imageClass: "k-icon k-i-close", click: function (e) {  //삭제 버튼
			                            e.preventDefault();
			                            if (confirm("삭제하시겠습니까?")) {
				                            var dataItem = this.dataItem($(e.target).closest("tr")),
				                            dataSource = $("#"+e.delegateTarget.id).data("kendoGrid").dataSource;
				                            dataItem.TEMP = "DELETE";
				                            saleInfoDataVO.optDeleteList.push(dataItem);
			                                dataSource.remove(dataItem);
			                            }
			                        }
			                    } ],minwidth:10}
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
	                				e.success(resData.optDataList);
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
	                					NM_OPT1:     { 
	                						validation: {
	    								    nm_opt1validation: function (input) {
	    								    	if (input.is("[name='NM_OPT1']") && input.val() == "") {
	    											input.attr("data-nm_opt1validation-msg", "옵션명1을 입력해 주세요.");
	    											return false;
	    										}
	    										if (input.is("[name='NM_OPT1']")) {
	    											var regex = /\s/g;
	    											input.attr("data-nm_opt1validation-msg", "옵션명1을 30자 이하로 입력하거나, 공백을 제거하고 입력해 주세요.");
	    											return regex.test(input.val()) === true || input.val().length > 30 ? false : true;
	    										}
	    										return true;
	    									}}},
	                					VAL_OPT1:    {
	                						validation: {
	    								    val_opt1validation: function (input) {
	    								    	if (input.is("[name='VAL_OPT1']") && input.val() == "") {
	    											input.attr("data-val_opt1validation-msg", "옵션값1을 입력해 주세요.");
	    											return false;
	    										}
	    										if (input.is("[name='VAL_OPT1']")) {
	    											var regex = /\s/g;
	    											input.attr("data-val_opt1validation-msg", "옵션값1을 50자 이하로 입력하거나, 공백을 제거하고 입력해 주세요.");
	    											return regex.test(input.val()) === true || input.val().length > 50 ? false : true;
	    										}
	    										return true;
	    									}}},
    									NM_OPT2:     { 
	                						validation: {
	    								    nm_opt2validation: function (input) {
	    								    	if (input.is("[name='NM_OPT2']") && input.val() == "") {
	    											input.attr("data-nm_opt2validation-msg", "옵션명2을 입력해 주세요.");
	    											return false;
	    										}
	    										if (input.is("[name='NM_OPT2']")) {
	    											var regex = /\s/g;
	    											input.attr("data-nm_opt2validation-msg", "옵션명2을 30자 이하로 입력하거나, 공백을 제거하고 입력해 주세요.");
	    											return regex.test(input.val()) === true || input.val().length > 30 ? false : true;
	    										}
	    										return true;
	    									}}},
    									VAL_OPT2:    {
	                						validation: {
	    								    val_opt2validation: function (input) {
	    								    	if (input.is("[name='VAL_OPT2']") && input.val() == "") {
	    											input.attr("data-val_opt2validation-msg", "옵션값2을 입력해 주세요.");
	    											return false;
	    										}
	    										if (input.is("[name='VAL_OPT2']")) {
	    											var regex = /\s/g;
	    											input.attr("data-val_opt2validation-msg", "옵션값2을 50자 이하로 입력하거나, 공백을 제거하고 입력해 주세요.");
	    											return regex.test(input.val()) === true || input.val().length > 50 ? false : true;
	    										}
	    										return true;
	    									}}},	
	                					QT_SSPL:    { type : "number" },
	                					CD_OPTSIGN: { 
	                						validation: {
	    								    cd_optsignvalidation: function (input) {
	    								    	if (input.is("[name='CD_OPTSIGN']") && input.val() == "") {
	    											input.attr("data-cd_optsignvalidation-msg", "판매코드를 입력해 주세요.");
	    											return false;
	    										}
	    										if (input.is("[name='CD_OPTSIGN']")) {
	    											var regex = /\s/g;
	    											input.attr("data-cd_optsignvalidation-msg", "판매코드를 20자 이하로 입력하거나, 공백을 제거하고 입력해 주세요.");
	    											return regex.test(input.val()) === true || input.val().length > 20 ? false : true;
	    										}
	    										return true;
	    									}}},
	                					S_ITEMPRC:  { type : "number" },
	                					TEMP:       {  },
	                				}
	                			}
	                		}
	                	}),
	                	navigatable: true,
	                	toolbar: 
	                		["create", { template: "<div ng-click='saleInfoDataVO.gridCancel("+JSON.stringify('opt')+")' class='k-button k-button-icontext'><span class='k-icon k-i-cancel'></span>취소</div>"}],
	                	columns: [
	           		           {field: "NM_OPT1",   title: "옵션명1",  width: 100,
	   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	   	   					   {field: "VAL_OPT1",   title: "옵션값1",  width: 100,
		   	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
		   	   				   {field: "NM_OPT2",   title: "옵션명2",  width: 100,
	   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	   	   					   {field: "VAL_OPT2",   title: "옵션값2",  width: 100,
		   	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	        		           {field: "QT_SSPL",      title: "재고수량",    width: 100,
	       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
	       	   					template:"<span style='float:right'>#: QT_SSPL #</span>"},
	        		           {field: "CD_OPTSIGN",   title: "판매자코드",   width: 100, 
	           	   				headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	        		           {field: "S_ITEMPRC", title: "판매가 (+,-)", width: 100,
	       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
	           	   				template:"<span style='float:right'>#: S_ITEMPRC #</span>"},
		           	   			{command: [ {
			                        name: "삭제", imageClass: "k-icon k-i-close", click: function (e) {  //삭제 버튼
			                            e.preventDefault();
			                            if (confirm("삭제하시겠습니까?")) {
				                            var dataItem = this.dataItem($(e.target).closest("tr")),
				                            dataSource = $("#"+e.delegateTarget.id).data("kendoGrid").dataSource;
				                            dataItem.TEMP = "DELETE";
				                            saleInfoDataVO.optDeleteList.push(dataItem);
			                                dataSource.remove(dataItem);
			                            }
			                        }
			                    } ],minwidth:10}
	                	],
	                    collapse: function(e) {
	                        // console.log(e.sender);
	                        this.cancelRow();
	                    },
	                	editable: true,
	                	height: 180
	                };
	            
	            var gridOpt004VO = $scope.gridOpt004VO = {
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
	                				e.success(resData.optDataList);
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
	                					NM_OPT1:     { 
	                						validation: {
	    								    nm_opt1validation: function (input) {
	    								    	if (input.is("[name='NM_OPT1']") && input.val() == "") {
	    											input.attr("data-nm_opt1validation-msg", "옵션명1을 입력해 주세요.");
	    											return false;
	    										}
	    										if (input.is("[name='NM_OPT1']")) {
	    											var regex = /\s/g;
	    											input.attr("data-nm_opt1validation-msg", "옵션명1을 30자 이하로 입력하거나, 공백을 제거하고 입력해 주세요.");
	    											return regex.test(input.val()) === true || input.val().length > 30 ? false : true;
	    										}
	    										return true;
	    									}}},
	                					VAL_OPT1:    {
	                						validation: {
	    								    val_opt1validation: function (input) {
	    								    	if (input.is("[name='VAL_OPT1']") && input.val() == "") {
	    											input.attr("data-val_opt1validation-msg", "옵션값1을 입력해 주세요.");
	    											return false;
	    										}
	    										if (input.is("[name='VAL_OPT1']")) {
	    											var regex = /\s/g;
	    											input.attr("data-val_opt1validation-msg", "옵션값1을 50자 이하로 입력하거나, 공백을 제거하고 입력해 주세요.");
	    											return regex.test(input.val()) === true || input.val().length > 50 ? false : true;
	    										}
	    										return true;
	    									}}},
    									NM_OPT2:     { 
	                						validation: {
	    								    nm_opt2validation: function (input) {
	    								    	if (input.is("[name='NM_OPT2']") && input.val() == "") {
	    											input.attr("data-nm_opt2validation-msg", "옵션명2을 입력해 주세요.");
	    											return false;
	    										}
	    										if (input.is("[name='NM_OPT2']")) {
	    											var regex = /\s/g;
	    											input.attr("data-nm_opt2validation-msg", "옵션명2을 30자 이하로 입력하거나, 공백을 제거하고 입력해 주세요.");
	    											return regex.test(input.val()) === true || input.val().length > 30 ? false : true;
	    										}
	    										return true;
	    									}}},
    									VAL_OPT2:    {
	                						validation: {
	    								    val_opt2validation: function (input) {
	    								    	if (input.is("[name='VAL_OPT2']") && input.val() == "") {
	    											input.attr("data-val_opt2validation-msg", "옵션값2을 입력해 주세요.");
	    											return false;
	    										}
	    										if (input.is("[name='VAL_OPT2']")) {
	    											var regex = /\s/g;
	    											input.attr("data-val_opt2validation-msg", "옵션값2을 50자 이하로 입력하거나, 공백을 제거하고 입력해 주세요.");
	    											return regex.test(input.val()) === true || input.val().length > 50 ? false : true;
	    										}
	    										return true;
	    									}}},
    									NM_OPT3:     { 
	                						validation: {
	    								    nm_opt3validation: function (input) {
	    								    	if (input.is("[name='NM_OPT3']") && input.val() == "") {
	    											input.attr("data-nm_opt3validation-msg", "옵션명3을 입력해 주세요.");
	    											return false;
	    										}
	    										if (input.is("[name='NM_OPT3']")) {
	    											var regex = /\s/g;
	    											input.attr("data-nm_opt3validation-msg", "옵션명3을 30자 이하로 입력하거나, 공백을 제거하고 입력해 주세요.");
	    											return regex.test(input.val()) === true || input.val().length > 30 ? false : true;
	    										}
	    										return true;
	    									}}},
    									VAL_OPT3:    {
	                						validation: {
	    								    val_opt3validation: function (input) {
	    								    	if (input.is("[name='VAL_OPT3']") && input.val() == "") {
	    											input.attr("data-val_opt3validation-msg", "옵션값3을 입력해 주세요.");
	    											return false;
	    										}
	    										if (input.is("[name='VAL_OPT3']")) {
	    											var regex = /\s/g;
	    											input.attr("data-val_opt3validation-msg", "옵션값3을 50자 이하로 입력하거나, 공백을 제거하고 입력해 주세요.");
	    											return regex.test(input.val()) === true || input.val().length > 50 ? false : true;
	    										}
	    										return true;
	    									}}},
	                					QT_SSPL:    { type : "number" },
	                					CD_OPTSIGN: { 
	                						validation: {
	    								    cd_optsignvalidation: function (input) {
	    								    	if (input.is("[name='CD_OPTSIGN']") && input.val() == "") {
	    											input.attr("data-cd_optsignvalidation-msg", "판매코드를 입력해 주세요.");
	    											return false;
	    										}
	    										if (input.is("[name='CD_OPTSIGN']")) {
	    											var regex = /\s/g;
	    											input.attr("data-cd_optsignvalidation-msg", "판매코드를 20자 이하로 입력하거나, 공백을 제거하고 입력해 주세요.");
	    											return regex.test(input.val()) === true || input.val().length > 20 ? false : true;
	    										}
	    										return true;
	    									}}},
	                					S_ITEMPRC:  { type : "number" },
	                					TEMP:       {  },
	                				}
	                			}
	                		}
	                	}),
	                	navigatable: true,
	                	toolbar: 
	                		["create", { template: "<div ng-click='saleInfoDataVO.gridCancel("+JSON.stringify('opt')+")' class='k-button k-button-icontext'><span class='k-icon k-i-cancel'></span>취소</div>"}],
	                	columns: [
	           		           {field: "NM_OPT1",   title: "옵션명1",  width: 100,
	   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	   	   					   {field: "VAL_OPT1",   title: "옵션값1",  width: 100,
		   	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
		   	   				   {field: "NM_OPT2",   title: "옵션명2",  width: 100,
	   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	   	   					   {field: "VAL_OPT2",   title: "옵션값2",  width: 100,
		   	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
		   	   				   {field: "NM_OPT3",   title: "옵션명3",  width: 100,
	   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	   	   					   {field: "VAL_OPT3",   title: "옵션값3",  width: 100,
		   	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	        		           {field: "QT_SSPL",      title: "재고수량",    width: 100,
	       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
	       	   					template:"<span style='float:right'>#: QT_SSPL #</span>"},
	        		           {field: "CD_OPTSIGN",   title: "판매자코드",   width: 100, 
	           	   				headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	        		           {field: "S_ITEMPRC", title: "판매가 (+,-)", width: 100,
	       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
	           	   				template:"<span style='float:right'>#: S_ITEMPRC #</span>"},
		           	   			{command: [ {
			                        name: "삭제", imageClass: "k-icon k-i-close", click: function (e) {  //삭제 버튼
			                            e.preventDefault();
			                            if (confirm("삭제하시겠습니까?")) {
				                            var dataItem = this.dataItem($(e.target).closest("tr")),
				                            dataSource = $("#"+e.delegateTarget.id).data("kendoGrid").dataSource;
				                            dataItem.TEMP = "DELETE";
				                            saleInfoDataVO.optDeleteList.push(dataItem);
			                                dataSource.remove(dataItem);
			                            }
			                        }
			                    } ],minwidth:10}
	                	],
	                    collapse: function(e) {
	                        // console.log(e.sender);
	                        this.cancelRow();
	                    },
	                	editable: true,
	                	height: 180
	                };
	            
	            var gridAddVO = $scope.gridAddVO = {
	            		addNumber : 0,
	                    messages: {
	                        noRows: "추가상품이 존재하지 않습니다.",
	                        loading: "추가상품을 가져오는 중...",
	                        requestFailed: "요청 추가상품을 가져오는 중 오류가 발생하였습니다.",
	                        retry: "갱신",
	                        commands: {
	                            create: '추가',
	                            destroy: '삭제',
	                            cancel: '취소'
	                        }
	                    },
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	                				if(saleInfoDataVO.kind == "detail"){
	                					if(resData.addDataList){
	            							e.success(resData.addDataList);
	            						}
	                				}
	                				if(!page.isWriteable()){
            	    					var grid = $("#gridAddVO").data("kendoGrid");
            	    					grid.setOptions({editable : false});   
            	    					grid.hideColumn(5);
            	    					$("#gridAddVO .k-grid-toolbar").hide();
	                				}
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
	                    			id: "CD_ADDSSPL",
	                				fields: {
	                					CD_ITEM:    {  },
	                					CD_ADDITEM: {  },
	                					CD_ADDSSPL: {  },
	                					NM_ADDITEM: {  },
	                					VAL_ADDITEM:{  },
	                					PRC_ADDITEM:{  },
	                					QT_SSPL:    { type : "number", defaultValue: 0,
	                						validation: {
		    								    qt_ssplvalidation: function (input) {
		    								    	if (input.is("[name='QT_SSPL']")) {
		    								    		var row = input.closest("tr");
		    								            var grid = row.closest("[data-role=grid]").data("kendoGrid");
		    								            var gridData = $("#gridAddVO").data("kendoGrid")
		    								            var dataItem = grid.dataItem(row);
		    								            if(input.val()==0){
		    								            	dataItem.NM_SALESTAT = "품절";
		    								            }else{
		    								            	dataItem.NM_SALESTAT = "판매중";
		    								            }
		    										}
		    										return true;
		    									}}
	                					},
	                					CD_SALESTAT:{  },
	                					NM_SALESTAT:{ editable: false },
	                					CD_ADDITEMMNG:{  },
	                					YN_USE:     { defaultValue: 'Y' },
	                					VAL_WET:    {  },
	                					TEMP   :    {  }
	                				}
	                			}
	                		}
	                	}),
	                	navigatable: true,
	                	toolbar: 
	                		["create", { template: "<div ng-click='saleInfoDataVO.gridCancel("+JSON.stringify('add')+")' class='k-button k-button-icontext'><span class='k-icon k-i-cancel'></span>취소</div>"}],
	                	columns: [
	           		           {field: "NM_ADDITEM",   title: "추가상품명",  width: 100,
	   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	   	   					   {field: "VAL_ADDITEM",   title: "추가상품값",  width: 100,
		   	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
		   	   				   {field: "PRC_ADDITEM",   title: "추가상품가",  width: 100,
	   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	   	   					   {field: "QT_SSPL",      title: "재고수량",    width: 100,
	       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
	       	   					template:"<span style='float:right'>#: QT_SSPL #</span>"},
	   	   					   {field: "NM_SALESTAT",   title: "판매상태",  width: 100,
		   	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
			   	   				/*template: function(e){
			   	   					var retval = "";
           		        			if( e.QT_SSPL == 0 ){
           		        				retval = saleInfoDataVO.addSaleStatList[0].NM_DEF;
           		        				e.CD_SALESTAT = saleInfoDataVO.addSaleStatList[0].CD_DEF;
           		        			}else{
           		        				retval = saleInfoDataVO.addSaleStatList[1].NM_DEF;
           		        				e.CD_SALESTAT = saleInfoDataVO.addSaleStatList[1].CD_DEF;
           		        			}
	          		       	   		return retval;
	          		       	  	}},*/
		   	   				   {field: "CD_ADDITEMMNG",   title: "관리코드",  width: 100,
	   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	   	   					   {field: "YN_USE",   title: "사용여부",  width: 100,
		   	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
			   	   				editor: function(container, options) {
	          		       	  		saleInfoDataVO.dropDownEditor(container, options, saleInfoDataVO.ynUseDataSource, ["NM_DEF","CD_DEF"]);
	           		        	},
	           		        	template: function(e){
	           		        		for( var i = 0 ; i<saleInfoDataVO.ynUseDataSource.length; i++ ){
	           		        			if( e.YN_USE == saleInfoDataVO.ynUseDataSource[i].CD_DEF ){
	           		        				return saleInfoDataVO.ynUseDataSource[i].NM_DEF;
	           		        			}
	           		        		}
	          		       	   		return false;
	          		       	  	}},
	        		           {field: "VAL_WET",      title: "무게",    width: 100,
	       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
		       	   				{command: [ {
			                        name: "삭제", imageClass: "k-icon k-i-close", click: function (e) {  //삭제 버튼
			                            e.preventDefault();
			                            if (confirm("삭제하시겠습니까?")) {
				                            var dataItem = this.dataItem($(e.target).closest("tr")),
				                            dataSource = $("#"+e.delegateTarget.id).data("kendoGrid").dataSource;
				                            dataItem.TEMP = "DELETE";
				                            saleInfoDataVO.addDeleteList.push(dataItem);
			                                dataSource.remove(dataItem);
			                            }
			                        }
			                    } ],minwidth:10}
	                	],
	                    collapse: function(e) {
	                        // console.log(e.sender);
	                        this.cancelRow();
	                    },
	                	editable: true,
	                	height: 280
	                };
	            
	            // 스토어팜 인증정보 그리드
	            var ctfcStorfVO = $scope.ctfcStorfVO = {
	                    messages: {
	                        noRows: "인증정보가 존재하지 않습니다.",
	                        loading: "인증정보를 가져오는 중...",
	                        requestFailed: "요청 인증정보를 가져오는 중 오류가 발생하였습니다.",
	                        retry: "갱신",
	                        commands: {
	                            create: '추가',
	                            destroy: '삭제',
	                            cancel: '취소'
	                        }
	                    },
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	            					/*e.success(); *///수정일시 초기값
	                			},
	                			create: function(e) {
	                	        },
	                			update: function(e) {
	                			},
	                			destroy: function(e) {
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
	                    			id: "ROW_NUM",
	                				fields: {
	                					ROW_NUM:    { type: "number", editable: false },
	                					CD_CTFCINFO: {  
	                						validation: {
	                							required: {message: "선택 주세요."}
	                						}  },
	                					VAL_CTFCINFO: {  },
	                					TEMP  : {},
	                				}
	                			}
	                		}
	                	}),
	                	navigatable: true,
	                	toolbar: 
	                		[{ template: "<kendo-button class='k-button k-button-icontext' ng-click='ctfcStorfVO.addCtfc()'><span class='k-icon k-i-plus'></span>추가</kendo-button>" }, "cancel"],
	                	columns: [
	           		           {field: "ROW_NUM",   title: "번호",  width: 100, template: "<span class='row-number'></span>",
	   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	   	   					   {field: "CD_CTFCINFO",   title: "인증항목",  width: 270,
		   	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
			   	   				editor: function(container, options) {
	          		       	  		saleInfoDataVO.dropDownEditor(container, options, saleInfoDataVO.storfCtfcList, ["NM_CTFCINFO","CD_CTFCINFO"]);
	           		        	},
	           		        	template: function(e){
	           		        		for( var i = 0 ; i<saleInfoDataVO.storfCtfcList.length; i++ ){
	           		        			if( e.CD_CTFCINFO == saleInfoDataVO.storfCtfcList[i].CD_CTFCINFO ){
	           		        				return saleInfoDataVO.storfCtfcList[i].NM_CTFCINFO;
	           		        			}
	           		        		}
	          		       	   		return "선택해주세요";
	          		       	  	}},
	          		       	  	{field: "VAL_CTFCINFO",   title: "인증번호",  width: 280,
		   	   					 headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
			   	   				{command: [ {
			                        name: "삭제", imageClass: "k-icon k-i-close", click: function (e) {  //삭제 버튼
			                            e.preventDefault();
			                            if (confirm("삭제하시겠습니까?")) {
				                            var dataItem = this.dataItem($(e.target).closest("tr")),
				                            dataSource = $("#"+e.delegateTarget.id).data("kendoGrid").dataSource;
				                            dataItem.TEMP = "DELETE";
				                            saleInfoDataVO.storfCtfcDeleteList.push(dataItem);
			                                dataSource.remove(dataItem);
			                            }
			                        }
			                    } ],minwidth:10}
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
	                    addCtfc: function (e) {
	                    	var grid = $("#gridCtfcStorf").data("kendoGrid");
	                    	var gridData = $("#gridCtfcStorf").data("kendoGrid").dataSource._data;
	                    	if(gridData.length==5){alert("인증정보는 5개까지 등록가능합니다.");return;}
	                    	if(gridData.length==0){
	                    		grid.addRow();
	                    	}else{
	                    		if(gridData[Number(gridData.length-1)].CD_CTFCINFO == "" || gridData[Number(gridData.length-1)].VAL_CTFCINFO == ""){
	                    			alert("인증정보를 입력해주세요.");
	                    			return;
	                    		}else{
	                    			for(var i = 0 ; i < gridData.length ; i++){
	    	                    		for(var j = 0 ; j < gridData.length ; j++){
	    	                    			if(i!=j){
	    		                    			if(gridData[i].CD_CTFCINFO == gridData[j].CD_CTFCINFO){
	    		                    				alert("인증항목이 중복됩니다.");
	    		                    				return;
	    				                    	}
	    	                    			}
	    	                    		}
	    	                    	}
	                    			grid.addRow();
	                    		}
	                    	}
	                    },
	                	editable: true,
	                	height: 280
	                };
	            
	            // 11번가 인증정보 그리드
	            var ctfcStVO = $scope.ctfcStVO = {
	                    messages: {
	                        noRows: "인증정보가 존재하지 않습니다.",
	                        loading: "인증정보를 가져오는 중...",
	                        requestFailed: "요청 인증정보를 가져오는 중 오류가 발생하였습니다.",
	                        retry: "갱신",
	                        commands: {
	                            create: '추가',
	                            destroy: '삭제',
	                            cancel: '취소'
	                        }
	                    },
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	            					/*e.success(); *///수정일시 초기값
	                			},
	                			create: function(e) {
	                	        },
	                			update: function(e) {
	                			},
	                			destroy: function(e) {
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
	                    			id: "ROW_NUM",
	                				fields: {
	                					ROW_NUM:    { type: "number", editable: false },
	                					CD_CTFCINFO: {  
	                						validation: {
	                							required: {message: "선택 주세요."}
	                						}  },
	                					VAL_CTFCINFO: {  },
	                					TEMP  : {},
	                				}
	                			}
	                		}
	                	}),
	                	navigatable: true,
	                	toolbar: 
	                		[{ template: "<kendo-button class='k-button k-button-icontext' ng-click='ctfcStVO.addCtfc()'><span class='k-icon k-i-plus'></span>추가</kendo-button>" }, "cancel"],
	                	columns: [
	           		           {field: "ROW_NUM",   title: "번호",  width: 100, template: "<span class='row-number'></span>",
	   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	   	   					   {field: "CD_CTFCINFO",   title: "인증항목",  width: 270,
		   	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
			   	   				editor: function(container, options) {
	          		       	  		saleInfoDataVO.dropDownEditor(container, options, saleInfoDataVO.stCtfcList, ["NM_CTFCINFO","CD_CTFCINFO"]);
	           		        	},
	           		        	template: function(e){
	           		        		for( var i = 0 ; i<saleInfoDataVO.stCtfcList.length; i++ ){
	           		        			if( e.CD_CTFCINFO == saleInfoDataVO.stCtfcList[i].CD_CTFCINFO ){
	           		        				return saleInfoDataVO.stCtfcList[i].NM_CTFCINFO;
	           		        			}
	           		        		}
	          		       	   		return "선택해주세요";
	          		       	  	}},
	          		       	  	{field: "VAL_CTFCINFO",   title: "인증번호",  width: 280,
		   	   					 headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
			   	   				{command: [ {
			                        name: "삭제", imageClass: "k-icon k-i-close", click: function (e) {  //삭제 버튼
			                            e.preventDefault();
			                            if (confirm("삭제하시겠습니까?")) {
				                            var dataItem = this.dataItem($(e.target).closest("tr")),
				                            dataSource = $("#"+e.delegateTarget.id).data("kendoGrid").dataSource;
				                            dataItem.TEMP = "DELETE";
				                            saleInfoDataVO.stCtfcDeleteList.push(dataItem);
			                                dataSource.remove(dataItem);
			                            }
			                        }
			                    } ],minwidth:10}
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
	                    addCtfc: function (e) {
	                    	var grid = $("#gridCtfcSt").data("kendoGrid");
	                    	var gridData = $("#gridCtfcSt").data("kendoGrid").dataSource._data;
	                    	if(gridData.length==5){alert("인증정보는 5개까지 등록가능합니다.");return;}
	                    	if(gridData.length==0){
	                    		grid.addRow();
	                    	}else{
	                    		if(gridData[Number(gridData.length-1)].CD_CTFCINFO == "" || gridData[Number(gridData.length-1)].VAL_CTFCINFO == ""){
	                    			alert("인증정보를 입력해주세요.");
	                    			return;
	                    		}else{
	                    			for(var i = 0 ; i < gridData.length ; i++){
	    	                    		for(var j = 0 ; j < gridData.length ; j++){
	    	                    			if(i!=j){
	    		                    			if(gridData[i].CD_CTFCINFO == gridData[j].CD_CTFCINFO){
	    		                    				alert("인증항목이 중복됩니다.");
	    		                    				return;
	    				                    	}
	    	                    			}
	    	                    		}
	    	                    	}
	                    			grid.addRow();
	                    		}
	                    	}
	                    },
	                	editable: true,
	                	height: 280
	                };
	            
	            // 쿠팡 인증정보 그리드
	            var ctfcCoopVO = $scope.ctfcCoopVO = {
	                    messages: {
	                        noRows: "인증정보가 존재하지 않습니다.",
	                        loading: "인증정보를 가져오는 중...",
	                        requestFailed: "요청 인증정보를 가져오는 중 오류가 발생하였습니다.",
	                        retry: "갱신",
	                        commands: {
	                            create: '추가',
	                            destroy: '삭제',
	                            cancel: '취소'
	                        }
	                    },
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	            					/*e.success(); *///수정일시 초기값
	                			},
	                			create: function(e) {
	                	        },
	                			update: function(e) {
	                			},
	                			destroy: function(e) {
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
	                    			id: "ROW_NUM",
	                				fields: {
	                					ROW_NUM:    { type: "number", editable: false },
	                					CD_CTFCINFO: {  
	                						validation: {
	                							required: {message: "선택 주세요."}
	                						}  },
	                					VAL_CTFCINFO: {  },
	                					TEMP  : {},
	                				}
	                			}
	                		}
	                	}),
	                	navigatable: true,
	                	toolbar: 
	                		[{ template: "<kendo-button class='k-button k-button-icontext' ng-click='ctfcCoopVO.addCtfc()'><span class='k-icon k-i-plus'></span>추가</kendo-button>" }, "cancel"],
	                	columns: [
	           		           {field: "ROW_NUM",   title: "번호",  width: 100, template: "<span class='row-number'></span>",
	   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	   	   					   {field: "CD_CTFCINFO",   title: "인증항목",  width: 270,
		   	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
			   	   				editor: function(container, options) {
	          		       	  		saleInfoDataVO.dropDownEditor(container, options, saleInfoDataVO.coopCtfcList, ["NM_CTFCINFO","CD_CTFCINFO"]);
	           		        	},
	           		        	template: function(e){
	           		        		for( var i = 0 ; i<saleInfoDataVO.coopCtfcList.length; i++ ){
	           		        			if( e.CD_CTFCINFO == saleInfoDataVO.coopCtfcList[i].CD_CTFCINFO ){
	           		        				return saleInfoDataVO.coopCtfcList[i].NM_CTFCINFO;
	           		        			}
	           		        		}
	          		       	   		return "선택해주세요";
	          		       	  	}},
	          		       	  	{field: "VAL_CTFCINFO",   title: "인증번호",  width: 280,
		   	   					 headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
			   	   				{command: [ {
			                        name: "삭제", imageClass: "k-icon k-i-close", click: function (e) {  //삭제 버튼
			                            e.preventDefault();
			                            if (confirm("삭제하시겠습니까?")) {
				                            var dataItem = this.dataItem($(e.target).closest("tr")),
				                            dataSource = $("#"+e.delegateTarget.id).data("kendoGrid").dataSource;
				                            dataItem.TEMP = "DELETE";
				                            saleInfoDataVO.coopCtfcDeleteList.push(dataItem);
			                                dataSource.remove(dataItem);
			                            }
			                        }
			                    } ],minwidth:10}
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
	                    addCtfc: function (e) {
	                    	var grid = $("#gridCtfcCoop").data("kendoGrid");
	                    	var gridData = $("#gridCtfcCoop").data("kendoGrid").dataSource._data;
	                    	if(gridData.length==5){alert("인증정보는 5개까지 등록가능합니다.");return;}
	                    	if(gridData.length==0){
	                    		grid.addRow();
	                    	}else{
	                    		if(gridData[Number(gridData.length-1)].CD_CTFCINFO == "" || gridData[Number(gridData.length-1)].VAL_CTFCINFO == ""){
	                    			alert("인증정보를 입력해주세요.");
	                    			return;
	                    		}else{
	                    			for(var i = 0 ; i < gridData.length ; i++){
	    	                    		for(var j = 0 ; j < gridData.length ; j++){
	    	                    			if(i!=j){
	    		                    			if(gridData[i].CD_CTFCINFO == gridData[j].CD_CTFCINFO){
	    		                    				alert("인증항목이 중복됩니다.");
	    		                    				return;
	    				                    	}
	    	                    			}
	    	                    		}
	    	                    	}
	                    			grid.addRow();
	                    		}
	                    	}
	                    },
	                	editable: true,
	                	height: 280
	                };
	            
	            // 상세설명 HTML
	            var editorDetVO = $scope.editorDetVO = {
		            	kEditor: UtilSvc.kendoEditor("010"),
		            	DC_HTMLCONTENT: '',
		            	ID_CMP: ''
		            };
	            	editorDetVO.kEditor.tools = [
		                "insertImage",
		  	    	    "bold",
		                "italic",
		                "underline",
		                "strikethrough",
		                "justifyLeft",
		                "justifyCenter",
		                "justifyRight",
		                "justifyFull",
		                "insertUnorderedList",
		                "insertOrderedList",
		                "indent",
		                "outdent",
		                "viewHtml"
		            ];
	            
	            // 추가상품 상세설명 HTML
	            var editorAddVO = $scope.editorAddVO = {
		            	kEditor: UtilSvc.kendoEditor("010"),
		            	DC_HTMLCONTENT: '',
		            	ID_CMP: ''
		            };
	            	editorAddVO.kEditor.tools = [
		                "insertImage",
		  	    	    "bold",
		                "italic",
		                "underline",
		                "strikethrough",
		                "justifyLeft",
		                "justifyCenter",
		                "justifyRight",
		                "justifyFull",
		                "insertUnorderedList",
		                "insertOrderedList",
		                "indent",
		                "outdent",
		                "viewHtml"
		            ];
	            	
            	// 옥션 광고/홍보 입력영역 HTML
	            var editorAuctVO = $scope.editorAuctVO = {
		            	kEditor: UtilSvc.kendoEditor("010"),
		            	DC_HTMLCONTENT: '',
		            	ID_CMP: ''
		            };
	            	editorAuctVO.kEditor.tools = [
		                "insertImage",
		  	    	    "bold",
		                "italic",
		                "underline",
		                "strikethrough",
		                "justifyLeft",
		                "justifyCenter",
		                "justifyRight",
		                "justifyFull",
		                "insertUnorderedList",
		                "insertOrderedList",
		                "indent",
		                "outdent",
		                "viewHtml"
		            ];
	            	
            	// 지마켓 광고/홍보 입력영역 HTML
	            var editorGmrkVO = $scope.editorGmrkVO = {
		            	kEditor: UtilSvc.kendoEditor("010"),
		            	DC_HTMLCONTENT: '',
		            	ID_CMP: ''
		            };
	            	editorGmrkVO.kEditor.tools = [
		                "insertImage",
		  	    	    "bold",
		                "italic",
		                "underline",
		                "strikethrough",
		                "justifyLeft",
		                "justifyCenter",
		                "justifyRight",
		                "justifyFull",
		                "insertUnorderedList",
		                "insertOrderedList",
		                "indent",
		                "outdent",
		                "viewHtml"
		            ];
	            	
	            saleInfoDataVO.gridCancel = function(flag) {
	            	var targetGrid = "";
	            	if(confirm("데이터를 되돌리시겠습니까?")){
						if(flag == "opt"){
							targetGrid = "#gridOpt"+saleInfoDataVO.param.CD_OPTTP;
							saleInfoDataVO.optDeleteList = new Array();
						}else if(flag == "add"){
							targetGrid = "#gridAddVO";
							saleInfoDataVO.addDeleteList = new Array();
						}
						
						var grid = $(targetGrid).data("kendoGrid");
						grid.cancelChanges();
	            	}
				};
	            	            	            
	            saleInfoDataVO.initBssItem = function(){
	            	saleInfoDataVO.duplFlag = true;
	            	var paramDetail = {procedureParam: "USP_IT_02BSSITEMDETAIL_GET&L_CD_ITEM@s",L_CD_ITEM:$stateParams.ids};
            		UtilSvc.getList(paramDetail).then(function (res) {
    					resData.detailData     = res.data.results[0][0];
    					resData.optDataList    = res.data.results[1];
    					resData.addDataList    = res.data.results[2];
    					resData.annoDataList   = res.data.results[3];
    					resData.ctgrDataList   = res.data.results[4];
    					resData.auctData       = res.data.results[5][0];
    					resData.auctCtfcData   = res.data.results[6][0];
    					resData.gmrkData       = res.data.results[7][0];
    					resData.gmrkCtfcData   = res.data.results[8][0];
    					resData.storfData      = res.data.results[9][0];
    					resData.storfCtfcData  = res.data.results[10][0];
    					resData.stData         = res.data.results[11][0];
    					resData.stCtfcData     = res.data.results[12][0];
    					resData.coopData       = res.data.results[13][0];
    					resData.coopCtfcData   = res.data.results[14][0];
    					
    					saleInfoDataVO.tempOPTTP = resData.detailData.CD_OPTTP;
    					saleInfoDataVO.oriOPTTP = resData.detailData.CD_OPTTP;
    					var detailData = {
    	        			// 상품정보
    	        			CD_SIGNITEM   : resData.detailData.CD_SIGNITEM,
    	        			NM_ITEM       : resData.detailData.NM_ITEM,
    	        			DC_ITEMABBR   : resData.detailData.DC_ITEMABBR,
    	        			NM_BRD        : resData.detailData.NM_BRD,
    		        		CD_ITEMKIND   : resData.detailData.CD_ITEMKIND,
    		        		NM_MD         : resData.detailData.NM_MD,
    		        		CD_ITEMSTAT   : resData.detailData.CD_ITEMSTAT,
    		        		ID_CTGR       : resData.detailData.ID_CTGR,
    		        		CD_COOKIND    : resData.detailData.CD_COOKIND,
    		        		CD_COO        : resData.detailData.CD_COO,
    		        		NM_FGFT       : resData.detailData.NM_FGFT,
    		        		DT_FGFTPRESSTART : resData.detailData.DT_FGFTPRESSTART,
    		        		DT_FGFTPRESEND   : resData.detailData.DT_FGFTPRESEND,
    		        		INFO_FGFT     : resData.detailData.INFO_FGFT,
    		        		HTML_DETEXPL  : resData.detailData.HTML_DETEXPL,
    		        		CD_CPYBSSITEM : resData.detailData.CD_CPYBSSITEM,
    		        		NO_ASPHNE     : resData.detailData.NO_ASPHNE,
    		        		GUI_AS        : resData.detailData.GUI_AS,
    		        		CD_BSSSALE       : "002",
    		        		CD_ADDITEM    : resData.detailData.CD_ADDITEM,
    		        		
    		        		//판매정보
    		        		S_ITEMPRC     : resData.detailData.S_ITEMPRC,
    		        		QT_SSPL       : resData.detailData.QT_SSPL,
    		        		B_ITEMPRC     : resData.detailData.B_ITEMPRC,
    		        		YN_PORTPRCCOMPSITERGTT : resData.detailData.YN_PORTPRCCOMPSITERGTT,
    		        		YN_TEENPCHS   : resData.detailData.YN_TEENPCHS,
    		        		CD_TAXCLFT    : resData.detailData.CD_TAXCLFT,
    		        		DT_SALESTART  : resData.detailData.DT_SALESTART,
    		        		DT_SALEEND    : resData.detailData.DT_SALEEND,
    		        		DT_VLD        : resData.detailData.DT_VLD,
    		        		DT_MNFT       : resData.detailData.DT_MNFT,
    		        		
    		        		//옵션/재고
    		        		CD_OPTTP      : resData.detailData.CD_OPTTP,
    		        		NM_OPT1       : "",
    		        		VAL_OPT1      : "",
    		        		NM_OPT2       : "",
    		        		VAL_OPT2      : "",
    		        		NM_OPT3       : "",
    		        		VAL_OPT3      : "",
    		        		
    		        		//추가구성상품
    		        		YN_USE        : resData.detailData.YN_USE,
    		        		CD_SORTORD    : resData.detailData.CD_SORTORD,
    		        		HTML_ADDDETEXPL  : resData.detailData.HTML_ADDDETEXPL,
    		        		//넣을때 trim 필요할듯, 스페이스 안되게 막던가
    		        		NM_ADDITEM1   : "",
    		        		VAL_ADDITEM1  : "",
    		        		PRC_ADDITEM1  : "",
    		        		NM_ADDITEM2   : "",
    		        		VAL_ADDITEM2  : "",
    		        		PRC_ADDITEM2  : "",
    		        		NM_ADDITEM3   : "",
    		        		VAL_ADDITEM3  : "",
    		        		PRC_ADDITEM3  : "",
    		        		NM_ADDITEM4   : "",
    		        		VAL_ADDITEM4  : "",
    		        		PRC_ADDITEM4  : "",
    		        		NM_ADDITEM5   : "",
    		        		VAL_ADDITEM5  : "",
    		        		PRC_ADDITEM5  : "",
    		        		
    		        		//고시정보
    		        		CD_LIOG       : {CD_LIOG : resData.detailData.CD_LIOG,
    		        						 NM_LIOG : resData.detailData.NM_LIOG},
    		        		ANNOINFOARTILIST : resData.annoDataList,
    		        		
    		        		//옥션
    		        		AUCT:{
    		        		YN_RSVSALE    : resData.auctData.YN_RSVSALE,
    		        		DT_SHPSTART   : resData.auctData.DT_SHPSTART,
    		        		VAL_UNI       : resData.auctData.VAL_UNI,
    		        		PRC_UNI       : resData.auctData.PRC_UNI,
    		        		YN_MAXPCHSAMOU: resData.auctData.YN_MAXPCHSAMOU,
    		        		AMOU_MAXPCHSLIM: resData.auctData.AMOU_MAXPCHSLIM,
    		        		DAYS_PRDLIM   : resData.auctData.DAYS_PRDLIM,
    		        		AMOU_PRDLIM   : resData.auctData.AMOU_PRDLIM,
    		        		AMOU_TIMSLIM  : resData.auctData.AMOU_TIMSLIM,
    		        		HTML_AVTMTRI  : resData.auctData.HTML_AVTMTRI,
    		        		CD_SHPWAY     : resData.auctData.CD_SHPWAY,
    		        		CD_SHPPARS    : resData.auctData.CD_SHPPARS,
    		        		CD_POST       : resData.auctData.CD_POST,
    		        		PRC_POST      : resData.auctData.PRC_POST,
    		        		AREA_QUISEV   : resData.auctData.AREA_QUISEV,
    		        		NM_QUISEVCMPN : resData.auctData.NM_QUISEVCMPN,
    		        		NO_QUISEVPHNE : resData.auctData.NO_QUISEVPHNE,
    		        		CD_TKBKPARS   : resData.auctData.CD_TKBKPARS,
    		        		PRC_TKBKECHGONESHP : resData.auctData.PRC_TKBKECHGONESHP,
    		        		CD_SHPPRCTPL  : resData.auctData.CD_SHPPRCTPL,
    		        		PRC_SHP1      : resData.auctData.PRC_SHP,        //1,2 DB컬럼은 PRC_SHP로 저장
    		        		PRC_SHP2      : resData.auctData.PRC_SHP,
    		        		PRC_STDSHP    : resData.auctData.PRC_STDSHP,
    		        		CD_SHPIMPWAY  : resData.auctData.CD_SHPIMPWAY,
    		        		CD_EXCHGDISCCLFT : resData.auctData.CD_EXCHGDISCCLFT,
    		        		COND_CNT      : [{VAL : '', YN: 'Y'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'Y'}],
    		        		COND_SHPPRC   : [{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''}],
    		        		CTFCINFO      : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}],
    		        		ORI_CTFCINFO  : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}]
    		        		},
    		        		GMRK:{
    		        		YN_FECTSALE   : resData.gmrkData.YN_FECTSALE,
    		        		VAL_UNI       : resData.gmrkData.VAL_UNI,
    		        		PRC_UNI       : resData.gmrkData.PRC_UNI,
    		        		YN_MAXPCHSAMOU: resData.gmrkData.YN_MAXPCHSAMOU,
    		        		AMOU_MAXPCHSLIM: resData.gmrkData.AMOU_MAXPCHSLIM,
    		        		DAYS_PRDLIM   : resData.gmrkData.DAYS_PRDLIM,
    		        		AMOU_PRDLIM   : resData.gmrkData.AMOU_PRDLIM,
    		        		AMOU_TIMSLIM  : resData.gmrkData.AMOU_TIMSLIM,
    		        		HTML_AVTMTRI  : resData.gmrkData.HTML_AVTMTRI,
    		        		CD_SHPPARS    : resData.gmrkData.CD_SHPPARS,
    		        		AREA_QUISEV   : resData.gmrkData.AREA_QUISEV,
    		        		NM_QUISEVCMPN : resData.gmrkData.NM_QUISEVCMPN,
    		        		NO_QUISEVPHNE : resData.gmrkData.NO_QUISEVPHNE,
    		        		CD_TKBKPARS   : resData.gmrkData.CD_TKBKPARS,
    		        		PRC_TKBKECHGONESHP : resData.gmrkData.PRC_TKBKECHGONESHP,
    		        		CD_SHPPRCTPL  : resData.gmrkData.CD_SHPPRCTPL,
    		        		PRC_SHP1      : resData.gmrkData.PRC_SHP,        //1,2 DB컬럼은 PRC_SHP로 저장
    		        		PRC_SHP2      : resData.gmrkData.PRC_SHP,
    		        		PRC_STDSHP    : resData.gmrkData.PRC_STDSHP,
    		        		CD_SHPIMPWAY  : resData.gmrkData.CD_SHPIMPWAY,
    		        		CD_AMOUSECTCLFT : resData.gmrkData.CD_AMOUSECTCLFT,
    		        		COND_CNT      : [{VAL : '', YN: 'Y'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'Y'}],
    		        		COND_SHPPRC   : [{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''}],
    		        		CTFCINFO      : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}],
    		        		ORI_CTFCINFO  : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}]
    		        		},
    		        		STORF:{
    		        		AMOU_MINIPCHS  : resData.storfData.AMOU_MINIPCHS,
    		        		YN_TIMSMAXPCHS : resData.storfData.YN_TIMSMAXPCHS,            //DB에는 존재하지 않지만 밖으로 빼면 11번가와 값이 겹침
    		        		AMOU_TIMSMAXPCHS : resData.storfData.AMOU_TIMSMAXPCHS,
    		        		YN_PESMAXPCHS : resData.storfData.YN_PESMAXPCHS,			//DB에는 존재하지 않지만 밖으로 빼면 11번가와 값이 겹침
                            AMOU_PESMAXPCHS  : resData.storfData.AMOU_PESMAXPCHS,
                            CD_SHPWAY     : resData.storfData.CD_SHPWAY,
    		        		YN_VISRECE    : resData.storfData.YN_VISRECE,
    		        		YN_BDLSHP     : resData.storfData.YN_BDLSHP,
                            AREA_QUISEV   : resData.storfData.AREA_QUISEV,
    		        		CD_SHPPRC     : resData.storfData.CD_SHPPRC,
    		        		PRC_SHP       : resData.storfData.PRC_SHP,
    		        		PRC_STDSHP    : resData.storfData.PRC_STDSHP,
    		        		CD_SECTCNTYN  : resData.storfData.CD_SECTCNTYN,
    		        		CD_SHPIMPWAY  : resData.storfData.CD_SHPIMPWAY,
    		        		COND_CNT      : [{VAL : '', YN: 'Y'},{VAL : '', YN: 'Y'}],
    		        		COND_SHPPRC   : [{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''}],
    		        		CD_TKBKPARS   : resData.storfData.CD_TKBKPARS,
    		        		PRC_TKBKSHP   : resData.storfData.PRC_TKBKSHP,
    		        		PRC_ECHGSHP   : resData.storfData.PRC_ECHGSHP,
    		        		PRC_AREACLSFSHP  : resData.storfData.PRC_AREACLSFSHP,
    		        		YN_SPRINSTPRC : resData.storfData.YN_SPRINSTPRC,
    		        		CTFCINFO      : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}]
    		        		},
    		        		ST:{
    		        		CD_MD         : resData.stData.CD_MD,
    		        		CD_SERVITEM   : resData.stData.CD_SERVITEM,
    		        		AMOU_MINPCHS  : resData.stData.AMOU_MINPCHS,
    		        		YN_TIMSMAXPCHS: resData.stData.YN_TIMSMAXPCHS,             //DB에는 존재하지 않지만 밖으로 빼면 스토어팜과 값이 겹침
    		        		AMOU_TIMSMAXPCHS : resData.stData.AMOU_TIMSMAXPCHS,
    		        		YN_PESMAXPCHS : resData.stData.YN_PESMAXPCHS,			 //DB에는 존재하지 않지만 밖으로 빼면 스토어팜과 값이 겹침
                            AMOU_PESMAXPCHS  : resData.stData.AMOU_PESMAXPCHS,
                            CD_SHPWAY     : resData.stData.CD_SHPWAY,
                            CD_SHPPARS    : resData.stData.CD_SHPPARS,
                            DC_PUREWD     : resData.stData.DC_PUREWD,
                            CD_ERLSHPPRCFREIMPWAY : resData.stData.CD_ERLSHPPRCFREIMPWAY,
                            PRC_TKBKSHP   : resData.stData.PRC_TKBKSHP,
                            PRC_ECHGSHP   : resData.stData.PRC_ECHGSHP,
                            GUI_TKBKECHG  : resData.stData.GUI_TKBKECHG,
                            CD_SHPPRC     : resData.stData.CD_SHPPRC,
                            CD_SHPIMPWAY  : resData.stData.CD_SHPIMPWAY,
                            COND_CNT      : [{VAL : '', YN: 'Y'},{VAL : '', YN: 'Y'},{VAL : '', YN: 'Y'},{VAL : '', YN: 'Y'},{VAL : '', YN: 'Y'}],
    		        		COND_SHPPRC   : [{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''}],
    		        		PRC_STDSHP    : resData.stData.PRC_STDSHP,
    		        		PRC_SHP       : resData.stData.PRC_SHP,
    		        		PRC_SHP2      : resData.stData.PRC_SHP,
    		        		PRC_SHP3      : resData.stData.PRC_SHP,
    		        		CD_SHPPRCADDGUI : resData.stData.CD_SHPPRCADDGUI,
    		        		PRC_JJADDSHP  : resData.stData.PRC_JJADDSHP,
    		        		PRC_MNTADDSHP : resData.stData.PRC_MNTADDSHP,
    		        		YN_JJMNT      : resData.stData.YN_JJMNT,
    		        		YN_BDLSHP     : resData.stData.YN_BDLSHP,
    		        		CTFCINFO      : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}]
    		        		},
    		        		COOP:{
    	        			NM_MNFR       : resData.coopData.NM_MNFR,
    	        			YN_BCD        : resData.coopData.YN_BCD,
    	        			DC_BCD        : resData.coopData.DC_BCD,
    	        			RSN_BCDNO     : resData.coopData.RSN_BCDNO,
    	        			AMOU_PESMAXPCHS     : resData.coopData.AMOU_PESMAXPCHS,
    	        			DAYS_PESMAXPCHSAMOU : resData.coopData.DAYS_PESMAXPCHSAMOU,
    	        			DAYS_DELITAK  : resData.coopData.DAYS_DELITAK,
    	        			YN_PRLICOM    : resData.coopData.YN_PRLICOM,
    	        			YN_FECTPCHSAGNCY    : resData.coopData.YN_FECTPCHSAGNCY,
    	        			YN_INDVCTCAMAKNECE  : resData.coopData.YN_INDVCTCAMAKNECE,
    	        			CD_SHPWAY     : resData.coopData.CD_SHPWAY,
    	        			CD_SHPPARS    : resData.coopData.CD_SHPPARS,
    	        			YN_BDLSHP     : resData.coopData.YN_BDLSHP,
    	        			YN_MNTSHP     : resData.coopData.YN_MNTSHP,
    	        			CD_SHPPRC     : resData.coopData.CD_SHPPRC,
    	        			PRC_SHP       : resData.coopData.PRC_SHP,
    	        			PRC_STDSHP    : resData.coopData.PRC_STDSHP,
    	        			PRC_TKBKSHP   : resData.coopData.PRC_TKBKSHP,
    	        			PRC_FIRTTIMSTKBKSHP : resData.coopData.PRC_FIRTTIMSTKBKSHP,
    	        			YN_TKBKSHPPRCCOD    : resData.coopData.YN_TKBKSHPPRCCOD,
    	        			CTFCINFO      : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}]
    		        		}}
    					saleInfoDataVO.param = detailData;
    					
    					//운송비부담구분 - 수량별 값이 존재할때 값 할당 (옥션)
                		if(resData.auctData.COND_CNT1 != "" && resData.auctData.COND_CNT1 != "undefined"){
                			saleInfoDataVO.param.AUCT.COND_CNT[0].VAL = resData.auctData.COND_CNT1;
                			saleInfoDataVO.param.AUCT.COND_SHPPRC[0].VAL = resData.auctData.PRC_SHP;
                			saleInfoDataVO.param.AUCT.COND_SHPPRC[1].VAL = resData.auctData.COND_SHPPRC1;
                			if(resData.auctData.COND_CNT2 != "" && resData.auctData.COND_CNT2 != "undefined"){
                    			saleInfoDataVO.param.AUCT.COND_CNT[1].VAL = resData.auctData.COND_CNT2;
                    			saleInfoDataVO.param.AUCT.COND_CNT[1].YN  = "Y";
                    			saleInfoDataVO.param.AUCT.COND_SHPPRC[2].VAL = resData.auctData.COND_SHPPRC2;
                    			if(resData.auctData.COND_CNT3 != "" && resData.auctData.COND_CNT3 != "undefined"){
                        			saleInfoDataVO.param.AUCT.COND_CNT[2].VAL = resData.auctData.COND_CNT3;
                        			saleInfoDataVO.param.AUCT.COND_CNT[2].YN  = "Y";
                        			saleInfoDataVO.param.AUCT.COND_SHPPRC[3].VAL = resData.auctData.COND_SHPPRC3;
                        			if(resData.auctData.COND_CNT4 != "" && resData.auctData.COND_CNT4 != "undefined"){
                            			saleInfoDataVO.param.AUCT.COND_CNT[3].VAL = resData.auctData.COND_CNT4;
                            			saleInfoDataVO.param.AUCT.COND_CNT[3].YN  = "Y";
                            			saleInfoDataVO.param.AUCT.COND_CNT[4].VAL = resData.auctData.COND_CNT4;
                            			saleInfoDataVO.param.AUCT.COND_SHPPRC[4].VAL = resData.auctData.COND_SHPPRC4;
                            		}
                        		}
                    		}
                		}
                		
                		//운송비부담구분 - 수량별 값이 존재할때 값 할당 (지마켓)
                		if(resData.gmrkData.COND_CNT1 != "" && resData.gmrkData.COND_CNT1 != "undefined"){
                			saleInfoDataVO.param.GMRK.COND_CNT[0].VAL = resData.gmrkData.COND_CNT1;
                			saleInfoDataVO.param.GMRK.COND_SHPPRC[0].VAL = resData.gmrkData.PRC_SHP;
                			saleInfoDataVO.param.GMRK.COND_SHPPRC[1].VAL = resData.gmrkData.COND_SHPPRC1;
                			if(resData.gmrkData.COND_CNT2 != "" && resData.gmrkData.COND_CNT2 != "undefined"){
                    			saleInfoDataVO.param.GMRK.COND_CNT[1].VAL = resData.gmrkData.COND_CNT2;
                    			saleInfoDataVO.param.GMRK.COND_CNT[1].YN  = "Y";
                    			saleInfoDataVO.param.GMRK.COND_SHPPRC[2].VAL = resData.gmrkData.COND_SHPPRC2;
                    			if(resData.gmrkData.COND_CNT3 != "" && resData.gmrkData.COND_CNT3 != "undefined"){
                        			saleInfoDataVO.param.GMRK.COND_CNT[2].VAL = resData.gmrkData.COND_CNT3;
                        			saleInfoDataVO.param.GMRK.COND_CNT[2].YN  = "Y";
                        			saleInfoDataVO.param.GMRK.COND_SHPPRC[3].VAL = resData.gmrkData.COND_SHPPRC3;
                        			if(resData.gmrkData.COND_CNT4 != "" && resData.gmrkData.COND_CNT4 != "undefined"){
                            			saleInfoDataVO.param.GMRK.COND_CNT[3].VAL = resData.gmrkData.COND_CNT4;
                            			saleInfoDataVO.param.GMRK.COND_CNT[3].YN  = "Y";
                            			saleInfoDataVO.param.GMRK.COND_CNT[4].VAL = resData.gmrkData.COND_CNT4;
                            			saleInfoDataVO.param.GMRK.COND_SHPPRC[4].VAL = resData.gmrkData.COND_SHPPRC4;
                            		}
                        		}
                    		}
                		}
                		
                		//운송비부담구분 - 수량별 값이 존재할때 값 할당 (스토어팜)
                		if(resData.storfData.COND_CNT1 != "" && resData.storfData.COND_CNT1 != "undefined"){
                			saleInfoDataVO.param.STORF.COND_CNT[0].VAL = resData.storfData.COND_CNT1;
                			saleInfoDataVO.param.STORF.COND_SHPPRC[0].VAL = resData.storfData.PRC_SHP;
                			saleInfoDataVO.param.STORF.COND_SHPPRC[1].VAL = resData.storfData.COND_SHPPRC1;
                			if(resData.storfData.COND_CNT2 != "" && resData.storfData.COND_CNT2 != "undefined"){
                    			saleInfoDataVO.param.STORF.COND_CNT[1].VAL = resData.storfData.COND_CNT2;
                    			saleInfoDataVO.param.STORF.COND_CNT[1].YN  = "Y";
                    			saleInfoDataVO.param.STORF.COND_SHPPRC[2].VAL = resData.storfData.COND_SHPPRC2;
                    			if(resData.storfData.COND_CNT3 != "" && resData.storfData.COND_CNT3 != "undefined"){
                        			saleInfoDataVO.param.STORF.COND_CNT[2].VAL = resData.storfData.COND_CNT3;
                        			saleInfoDataVO.param.STORF.COND_CNT[2].YN  = "Y";
                        			saleInfoDataVO.param.STORF.COND_SHPPRC[3].VAL = resData.storfData.COND_SHPPRC3;
                        			if(resData.storfData.COND_CNT4 != "" && resData.storfData.COND_CNT4 != "undefined"){
                            			saleInfoDataVO.param.STORF.COND_CNT[3].VAL = resData.storfData.COND_CNT4;
                            			saleInfoDataVO.param.STORF.COND_CNT[3].YN  = "Y";
                            			saleInfoDataVO.param.STORF.COND_CNT[4].VAL = resData.storfData.COND_CNT4;
                            			saleInfoDataVO.param.STORF.COND_SHPPRC[4].VAL = resData.storfData.COND_SHPPRC4;
                            		}
                        		}
                    		}
                		}
                		
                		//운송비부담구분 - 수량별 값이 존재할때 값 할당 (11번가)
                		if(resData.stData.COND_CNT1 != "" && resData.stData.COND_CNT1 != "undefined"){
                			saleInfoDataVO.param.ST.COND_CNT[0].VAL = resData.stData.COND_CNT1;
                			saleInfoDataVO.param.ST.COND_SHPPRC[0].VAL = resData.stData.PRC_SHP;
                			saleInfoDataVO.param.ST.COND_SHPPRC[1].VAL = resData.stData.COND_SHPPRC1;
                			if(resData.stData.COND_CNT2 != "" && resData.stData.COND_CNT2 != "undefined"){
                    			saleInfoDataVO.param.ST.COND_CNT[1].VAL = resData.stData.COND_CNT2;
                    			saleInfoDataVO.param.ST.COND_CNT[1].YN  = "Y";
                    			saleInfoDataVO.param.ST.COND_SHPPRC[2].VAL = resData.stData.COND_SHPPRC2;
                    			if(resData.stData.COND_CNT3 != "" && resData.stData.COND_CNT3 != "undefined"){
                        			saleInfoDataVO.param.ST.COND_CNT[2].VAL = resData.stData.COND_CNT3;
                        			saleInfoDataVO.param.ST.COND_CNT[2].YN  = "Y";
                        			saleInfoDataVO.param.ST.COND_SHPPRC[3].VAL = resData.stData.COND_SHPPRC3;
                        			if(resData.stData.COND_CNT4 != "" && resData.stData.COND_CNT4 != "undefined"){
                            			saleInfoDataVO.param.ST.COND_CNT[3].VAL = resData.stData.COND_CNT4;
                            			saleInfoDataVO.param.ST.COND_CNT[3].YN  = "Y";
                            			saleInfoDataVO.param.ST.COND_CNT[4].VAL = resData.stData.COND_CNT4;
                            			saleInfoDataVO.param.ST.COND_SHPPRC[4].VAL = resData.stData.COND_SHPPRC4;
                            		}
                        		}
                    		}
                		}
                		
                		// 옥션, 지마켓 CTFC 셋팅
                		if(resData.auctCtfcData && resData.gmrkCtfcData){
	                		var list = new Array();
	                		list.push(resData.auctCtfcData);
	                		list.push(resData.gmrkCtfcData);
	                		saleInfoDataVO.ctfcDataSplit(list);
                		}
    					
    					if(resData.ctgrDataList.length >= 1){
    						saleInfoDataVO.ctgrChange(0);
    						saleInfoDataVO.selectedCtgr1.ID_CTGR = resData.ctgrDataList[0].ID_CTGR;
    						saleInfoDataVO.selectedCtgr1.NM_CTGR = resData.ctgrDataList[0].NM_CTGR;
    						if(resData.ctgrDataList.length >= 2){
    							saleInfoDataVO.ctgrChange(1);
    							saleInfoDataVO.selectedCtgr2.ID_CTGR = resData.ctgrDataList[1].ID_CTGR;
    							saleInfoDataVO.selectedCtgr2.NM_CTGR = resData.ctgrDataList[1].NM_CTGR;
    						}
    						if(resData.ctgrDataList.length >= 3){
    							saleInfoDataVO.ctgrChange(2);
    							saleInfoDataVO.selectedCtgr3.ID_CTGR = resData.ctgrDataList[2].ID_CTGR;
    							saleInfoDataVO.selectedCtgr3.NM_CTGR = resData.ctgrDataList[2].NM_CTGR;
    						}
    					}
        				/*saleInfoDataVO.taxChange();
        				saleInfoDataVO.sprcCal('', Number(saleInfoDataVO.param.RT_TAX) ,'R');
        				saleInfoDataVO.splyChange();
        				saleInfoDataVO.mrfrChange();
        				saleInfoDataVO.bcdChange();
        				saleInfoDataVO.shptpChange();*/
        				
        				saleInfoDataVO.fileMainVO.currentData = resData.fileMainVOcurrentData;
        				saleInfoDataVO.fileDImageVO.currentDataList = resData.fileDImageVOcurrentDataList;
                    })
					
	            };
	            
	            // 수정시 인증정보 옥션,지마켓에 각각 넣어줌
	            saleInfoDataVO.ctfcDataSplit = function(ctfcData){
	            	//옥션
	            	for(var i = 0 ; i < ctfcData[0].length; i++){
	            		var tempList = [];
                    	tempList = ctfcData[0][i].NM_CTFCINFO.split(" ");
                    	if(tempList[0]=="어린이제품"){
                    		saleInfoDataVO.param.AUCT.CTFCINFO[0].CD_CTFCINFO = ctfcData[0][i].CD_CTFCINFO; 
                    		saleInfoDataVO.param.AUCT.ORI_CTFCINFO[0].CD_CTFCINFO = ctfcData[0][i].CD_CTFCINFO;
                    		saleInfoDataVO.param.AUCT.CTFCINFO[0].VAL_CTFCINFO = ctfcData[0][i].VAL_CTFCINFO; 
                    		saleInfoDataVO.param.AUCT.ORI_CTFCINFO[0].VAL_CTFCINFO = ctfcData[0][i].VAL_CTFCINFO;}
                    	if(tempList[0]=="생활용품"){
                    		saleInfoDataVO.param.AUCT.CTFCINFO[1].CD_CTFCINFO = ctfcData[0][i].CD_CTFCINFO; 
                    		saleInfoDataVO.param.AUCT.ORI_CTFCINFO[1].CD_CTFCINFO = ctfcData[0][i].CD_CTFCINFO;
                    		saleInfoDataVO.param.AUCT.CTFCINFO[1].VAL_CTFCINFO = ctfcData[0][i].VAL_CTFCINFO; 
                    		saleInfoDataVO.param.AUCT.ORI_CTFCINFO[1].VAL_CTFCINFO = ctfcData[0][i].VAL_CTFCINFO;}
                    	if(tempList[0]=="전기용품"){
                    		saleInfoDataVO.param.AUCT.CTFCINFO[2].CD_CTFCINFO = ctfcData[0][i].CD_CTFCINFO; 
	                		saleInfoDataVO.param.AUCT.ORI_CTFCINFO[2].CD_CTFCINFO = ctfcData[0][i].CD_CTFCINFO;
	                		saleInfoDataVO.param.AUCT.CTFCINFO[2].VAL_CTFCINFO = ctfcData[0][i].VAL_CTFCINFO; 
	                		saleInfoDataVO.param.AUCT.ORI_CTFCINFO[2].VAL_CTFCINFO = ctfcData[0][i].VAL_CTFCINFO;}
	            	}
	            	//지마켓
	            	for(var i = 0 ; i < ctfcData[1].length; i++){
	            		var tempList = [];
                    	tempList = ctfcData[1][i].NM_CTFCINFO.split(" ");
                    	if(tempList[0]=="어린이제품"){
                    		saleInfoDataVO.param.GMRK.CTFCINFO[0].CD_CTFCINFO = ctfcData[1][i].CD_CTFCINFO; 
                    		saleInfoDataVO.param.GMRK.ORI_CTFCINFO[0].CD_CTFCINFO = ctfcData[1][i].CD_CTFCINFO;
                    		saleInfoDataVO.param.GMRK.CTFCINFO[0].VAL_CTFCINFO = ctfcData[1][i].VAL_CTFCINFO; 
                    		saleInfoDataVO.param.GMRK.ORI_CTFCINFO[0].VAL_CTFCINFO = ctfcData[1][i].VAL_CTFCINFO;}
                    	if(tempList[0]=="생활용품"){
                    		saleInfoDataVO.param.GMRK.CTFCINFO[1].CD_CTFCINFO = ctfcData[1][i].CD_CTFCINFO; 
                    		saleInfoDataVO.param.GMRK.ORI_CTFCINFO[1].CD_CTFCINFO = ctfcData[1][i].CD_CTFCINFO;
                    		saleInfoDataVO.param.GMRK.CTFCINFO[1].VAL_CTFCINFO = ctfcData[1][i].VAL_CTFCINFO; 
                    		saleInfoDataVO.param.GMRK.ORI_CTFCINFO[1].VAL_CTFCINFO = ctfcData[1][i].VAL_CTFCINFO;}
                    	if(tempList[0]=="전기용품"){
                    		saleInfoDataVO.param.GMRK.CTFCINFO[2].CD_CTFCINFO = ctfcData[1][i].CD_CTFCINFO; 
                    		saleInfoDataVO.param.GMRK.ORI_CTFCINFO[2].CD_CTFCINFO = ctfcData[1][i].CD_CTFCINFO;
                    		saleInfoDataVO.param.GMRK.CTFCINFO[2].VAL_CTFCINFO = ctfcData[1][i].VAL_CTFCINFO; 
                    		saleInfoDataVO.param.GMRK.ORI_CTFCINFO[2].VAL_CTFCINFO = ctfcData[1][i].VAL_CTFCINFO;}
	            	}
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
	            	self.addSortList   = resData.addSortList;
	            	self.addSaleStatList= resData.addSaleStatList;
	            	self.liogList      = resData.liogList;
	            	self.shpwayList    = resData.shpwayList;
	            	self.mrkCodeList   = resData.MrkCodeList;
                    self.cmrkCodeList  = resData.CmrkCodeList;
                    self.postCodeList  = resData.postCodeList;
                    self.itemCooList1  = resData.CooCodeList;
                    self.cooKindList   = resData.CooKindList;
                    self.prcShpList    = resData.prcShpList;
                    self.shpTplList    = resData.shpTplList;
                    self.shpAWayList   = resData.shpAWayList;
                    self.exchAClftList = resData.exchAClftList;
                    self.exchGClftList = resData.exchGClftList;
                    self.auctCtfcList  = self.ctfcSort(resData.auctCtfcList);
                    self.gmrkCtfcList  = self.ctfcSort(resData.gmrkCtfcList);
                    self.storfCtfcList = resData.storfCtfcList;
                    self.stCtfcList    = resData.stCtfcList;
                    self.coopCtfcList  = resData.coopCtfcList;
                    self.shpSWayList   = resData.shpSWayList;
                    self.shpprcList    = resData.shpprcList;
                    self.sectCntYnList = resData.sectCntYnList;
                    self.servItemList  = resData.servItemList;
                    self.shpSTWayList  = resData.shpSTWayList;
                    self.shpCWayList   = resData.shpCWayList;
                    self.shpprcCList   = resData.shpprcCList;
                    self.shpprSTList   = resData.shpprSTList;
                    self.shpGuiList    = resData.shpGuiList;
                    
                    self.cmrkParsSearch();
	            	
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
        					procedureParam: "USP_IT_01ITEMCFCT02_GET&IT_ID_CTGR@s",
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
	            	if(self.param.COOP.YN_BCD == "Y"){
	            		self.param.COOP.DC_BCD = "";
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
	            
	            // 중복확인
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
	    					procedureParam: "USP_IT_02BSSITEMCOPY_GET&L_CD_ITEM@s",
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
		            		//원산지 마지막값 하나 가져오기
		            		if(saleInfoDataVO.selectedCoo3.CD_COO != "")saleInfoDataVO.param.CD_COO = saleInfoDataVO.selectedCoo3.CD_COO;
		            		else{
		            			if(saleInfoDataVO.selectedCoo2.CD_COO != "")saleInfoDataVO.param.CD_COO = saleInfoDataVO.selectedCoo2.CD_COO;
		            			else saleInfoDataVO.param.CD_COO = saleInfoDataVO.selectedCoo1.CD_COO;
		            		}
		            		var optData = [];
		            		if(saleInfoDataVO.param.CD_OPTTP != '001')optData = $("#gridOpt"+saleInfoDataVO.param.CD_OPTTP).data("kendoGrid").dataSource._data;
		            		var addData = $("#gridAddVO").data("kendoGrid").dataSource._data;
		            		var itemData = saleInfoDataVO.param;
		            		itemData.CD_LIOG = itemData.CD_LIOG.CD_LIOG;
		            		itemData.ID_CTGR = saleInfoDataVO.selectedCtgr3.ID_CTGR;
		            		if($("#gridCtfcStorf").data("kendoGrid").dataSource._data.length!=0){itemData.STORF.CTFCINFO = saleInfoDataVO.ctfcParamSort($("#gridCtfcStorf").data("kendoGrid")._data)};
		            		if($("#gridCtfcSt").data("kendoGrid").dataSource._data.length!=0){itemData.ST.CTFCINFO = saleInfoDataVO.ctfcParamSort($("#gridCtfcSt").data("kendoGrid")._data)};
		            		if($("#gridCtfcCoop").data("kendoGrid").dataSource._data.length!=0){itemData.COOP.CTFCINFO = saleInfoDataVO.ctfcParamSort($("#gridCtfcCoop").data("kendoGrid")._data)};
		            		var param = {
		            				BSSITEM : itemData,
		            				OPT : optData,
		            				ADDITEM : addData };
		            		itBssItemSvc.saveItem(param, SU).success(function () {
	                        	saleInfoDataVO.fileSave();
	                        	alert("기본상품 등록이 완료되었습니다.");
	                        	saleInfoDataVO.goBack();
	                        });
		            		
		                    /*if (saleInfoDataVO.isValid(saleInfoDataVO.param)) {
		                		if(saleInfoDataVO.selectedCtgr2.ID_CTGR != ""){
		                			if(saleInfoDataVO.selectedCtgr3.ID_CTGR != ""){
		                    			saleInfoDataVO.param.ID_CTGR = saleInfoDataVO.selectedCtgr3.ID_CTGR;
		                        	}else{
		                        		saleInfoDataVO.param.ID_CTGR = saleInfoDataVO.selectedCtgr2.ID_CTGR;
		                        	}
		                    	}else{
		                    		saleInfoDataVO.param.ID_CTGR = saleInfoDataVO.selectedCtgr1.ID_CTGR;
		                    	}
		                		saleInfoDataVO.param.RT_TAX = Number(saleInfoDataVO.param.RT_TAX);
		                    	itBssItemSvc.saveItem(saleInfoDataVO.param, SU).success(function (res_CDITEM) {
		                    		saleInfoDataVO.CD_ITEM = res_CDITEM;
		                    		if(saleInfoDataVO.param.CD_OPTTP == "002" || saleInfoDataVO.param.CD_OPTTP == "003" ){
		                        		var grid = $("#gridOpt"+saleInfoDataVO.param.CD_OPTTP).data("kendoGrid");
		                            	grid.dataSource.sync();
		                    		}
		                        	saleInfoDataVO.fileSave();
		                        	alert("기본상품 등록이 완료되었습니다.");
		                        	saleInfoDataVO.goBack();
		                        });
		                    }*/
		                }
	            	}else{
	            		if (confirm("수정하시겠습니까?")) {
	            			if(saleInfoDataVO.selectedCoo3.CD_COO != "")saleInfoDataVO.param.CD_COO = saleInfoDataVO.selectedCoo3.CD_COO;
		            		else{
		            			if(saleInfoDataVO.selectedCoo2.CD_COO != "")saleInfoDataVO.param.CD_COO = saleInfoDataVO.selectedCoo2.CD_COO;
		            			else saleInfoDataVO.param.CD_COO = saleInfoDataVO.selectedCoo1.CD_COO;
		            		}
	            			saleInfoDataVO.param.CD_ITEM = saleInfoDataVO.CD_ITEM;
		            		var optData = new Array();
		            		if(saleInfoDataVO.param.CD_OPTTP != '001')optData = $("#gridOpt"+saleInfoDataVO.param.CD_OPTTP).data("kendoGrid")._data;
		            		if(saleInfoDataVO.optDeleteList.length != 0)optData = optData.concat(saleInfoDataVO.optDeleteList);
		            		var addData = $("#gridAddVO").data("kendoGrid")._data;
		            		if(saleInfoDataVO.addDeleteList.length != 0)addData = addData.concat(saleInfoDataVO.addDeleteList);
		            		var itemData = saleInfoDataVO.param;
		            		itemData.CD_LIOG = itemData.CD_LIOG.CD_LIOG;
		            		itemData.ID_CTGR = saleInfoDataVO.selectedCtgr3.ID_CTGR;
		            		//인증정보 (옥션,지마켓) 수정,삭제,생성 판별
		            		saleInfoDataVO.ctfcSetting();
		            		if($("#gridCtfcStorf").data("kendoGrid").dataSource._data.length!=0){itemData.STORF.CTFCINFO = saleInfoDataVO.ctfcParamSort($("#gridCtfcStorf").data("kendoGrid")._data)};
		            		if($("#gridCtfcSt").data("kendoGrid").dataSource._data.length!=0){itemData.ST.CTFCINFO = saleInfoDataVO.ctfcParamSort($("#gridCtfcSt").data("kendoGrid")._data)};
		            		if($("#gridCtfcCoop").data("kendoGrid").dataSource._data.length!=0){itemData.COOP.CTFCINFO = saleInfoDataVO.ctfcParamSort($("#gridCtfcCoop").data("kendoGrid")._data)};
		            		if(saleInfoDataVO.storfCtfcDeleteList.length != 0)itemData.STORF.CTFCINFO = itemData.STORF.CTFCINFO.concat(saleInfoDataVO.storfCtfcDeleteList);
		            		if(saleInfoDataVO.stCtfcDeleteList.length != 0)itemData.ST.CTFCINFO = itemData.ST.CTFCINFO.concat(saleInfoDataVO.stCtfcDeleteList);
		            		if(saleInfoDataVO.coopCtfcDeleteList.length != 0)itemData.COOP.CTFCINFO = itemData.COOP.CTFCINFO.concat(saleInfoDataVO.coopCtfcDeleteList);
		            		var param = {
		            				BSSITEM : itemData,
		            				OPT : optData,
		            				ADDITEM : addData };
		            		itBssItemSvc.saveItem(param, SU).success(function () {
	                        	saleInfoDataVO.fileSave();
	                        	alert("기본상품 수정이 완료되었습니다.");
	                        	saleInfoDataVO.goBack();
	                        });
		                }
	            	}
	            };
	            
	            // 인증정보 (옥션,지마켓) 수정,삭제,생성 판별 - 수정하기 전에
	            saleInfoDataVO.ctfcSetting = function(){
	            	// 옥션
	            	for(var i = 0 ; i < saleInfoDataVO.param.AUCT.CTFCINFO.length; i++){
	            		if(saleInfoDataVO.param.AUCT.CTFCINFO[i].CD_CTFCINFO != ""){
	            			saleInfoDataVO.param.AUCT.CTFCINFO[i].TEMP = "DELETE";
	            			for(var j = 0 ; saleInfoDataVO.param.AUCT.ORI_CTFCINFO.length; j++){
	            				if(saleInfoDataVO.param.AUCT.CTFCINFO[i].CD_CTFCINFO == saleInfoDataVO.param.AUCT.ORI_CTFCINFO[j].CD_CTFCINFO) {saleInfoDataVO.param.AUCT.CTFCINFO[i].TEMP = "UPDATE";return;}
	            				if(j == saleInfoDataVO.param.AUCT.ORI_CTFCINFO.length - 1) saleInfoDataVO.param.AUCT.CTFCINFO[i].TEMP = "INSERT";
	            			}
	            		}
	            	}
	            	// 지마켓
	            	for(var i = 0 ; i < saleInfoDataVO.param.GMRK.CTFCINFO.length; i++){
	            		if(saleInfoDataVO.param.GMRK.CTFCINFO[i].CD_CTFCINFO != ""){
	            			saleInfoDataVO.param.GMRK.CTFCINFO[i].TEMP = "DELETE";
	            			for(var j = 0 ; saleInfoDataVO.param.GMRK.ORI_CTFCINFO.length; j++){
	            				if(saleInfoDataVO.param.GMRK.ORI_CTFCINFO[i].CD_CTFCINFO != ""){
	            					if(saleInfoDataVO.param.GMRK.CTFCINFO[i].CD_CTFCINFO == saleInfoDataVO.param.GMRK.ORI_CTFCINFO[j].CD_CTFCINFO) {saleInfoDataVO.param.GMRK.CTFCINFO[i].TEMP = "UPDATE";return;}
	            					if(j == saleInfoDataVO.param.GMRK.ORI_CTFCINFO.length - 1) saleInfoDataVO.param.GMRK.CTFCINFO[i].TEMP = "INSERT";
	            				}
	            			}
	            		}
	            	}
	            };
	            
	            saleInfoDataVO.fileSave = function() {
	            	var imgList = [];
	            	saleInfoDataVO.fileMainVO.CD_REF1 = saleInfoDataVO.CD_ITEM;
	            	imgList.push(saleInfoDataVO.fileMainVO);
	            	saleInfoDataVO.fileDImageVO.CD_REF1 = saleInfoDataVO.CD_ITEM;
	            	imgList.push(saleInfoDataVO.fileDImageVO);
	            	UtilSvc.fileSaveExe(imgList);
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
		        						procedureParam:"USP_IT_02BSSITEMOPT_GET&L_CD_ITEM@s|L_FLAG@s",
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
		        						procedureParam:"USP_IT_02BSSITEMOPT_GET&L_CD_ITEM@s|L_FLAG@s",
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
		            			saleInfoDataVO.optDeleteList = new Array();
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
	            
	            /*// 판매가 구매가 tax (숫자 + 소수점)
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
	            };*/
	        	
	        	// 옵션목록으로 적용
	            saleInfoDataVO.optListing = function() {
	            	var S_VAL_OPT1 = new Array(),
	            		S_VAL_OPT2 = new Array(),
	            		S_VAL_OPT3 = new Array(),
	            		S_NM_OPT = new Array(),
	            		index = 0;
	            	
	            	if(saleInfoDataVO.param.CD_OPTTP == "002"){
	            		var grid = $("#gridOpt002").data("kendoGrid");
	            			S_VAL_OPT1 = (saleInfoDataVO.param.VAL_OPT1).split(","),
	            			S_NM_OPT = saleInfoDataVO.param.NM_OPT1;
	            		
	            		for( var i = 0 ; i < S_VAL_OPT1.length ; i++ ){
	            			grid.dataSource.insert(i, { NM_OPT1 : S_NM_OPT, VAL_OPT1 : S_VAL_OPT1[i], NO_MD : "", S_ITEMPRC : 0, QT_SSPL: 0 });
	            		}
	            	}
	            	if(saleInfoDataVO.param.CD_OPTTP == "003"){
	            		var grid = $("#gridOpt003").data("kendoGrid");
	            		S_NM_OPT.push(saleInfoDataVO.param.NM_OPT1);
	            		S_NM_OPT.push(saleInfoDataVO.param.NM_OPT2);
            			S_VAL_OPT1 = (saleInfoDataVO.param.VAL_OPT1).split(",");
	            		S_VAL_OPT2 = (saleInfoDataVO.param.VAL_OPT2).split(",");
	            		
	            		for( var i = 0 ; i < S_VAL_OPT1.length ; i++ ){
		            		for( var j = 0 ; j < S_VAL_OPT2.length ; j++ ){
		            			grid.dataSource.insert(index, { NM_OPT1 : S_NM_OPT[0], VAL_OPT1 : S_VAL_OPT1[i], NM_OPT2 : S_NM_OPT[1], VAL_OPT2 : S_VAL_OPT2[j], NO_MD : "", S_ITEMPRC : 0, QT_SSPL: 0 });
		            			index++;
		            		}
	            		}
	            	}
	            	if(saleInfoDataVO.param.CD_OPTTP == "004"){
	            		var grid = $("#gridOpt004").data("kendoGrid");
	            		S_NM_OPT.push(saleInfoDataVO.param.NM_OPT1);
	            		S_NM_OPT.push(saleInfoDataVO.param.NM_OPT2);
	            		S_NM_OPT.push(saleInfoDataVO.param.NM_OPT3);
            			S_VAL_OPT1 = (saleInfoDataVO.param.VAL_OPT1).split(",");
	            		S_VAL_OPT2 = (saleInfoDataVO.param.VAL_OPT2).split(",");
	            		S_VAL_OPT3 = (saleInfoDataVO.param.VAL_OPT3).split(",");
	            		
	            		for( var i = 0 ; i < S_VAL_OPT1.length ; i++ ){
		            		for( var j = 0 ; j < S_VAL_OPT2.length ; j++ ){
		            			for( var k = 0 ; k < S_VAL_OPT3.length ; k++ ){
		            			grid.dataSource.insert(index, { NM_OPT1 : S_NM_OPT[0], VAL_OPT1 : S_VAL_OPT1[i], NM_OPT2 : S_NM_OPT[1], VAL_OPT2 : S_VAL_OPT2[j], NM_OPT3 : S_NM_OPT[2], VAL_OPT3 : S_VAL_OPT3[k], NO_MD : "", S_ITEMPRC : 0, QT_SSPL: 0 });
		            			index++;
		            			}
		            		}
	            		}
	            	}
	        	};
	        	
	        	// 추가상품목록으로 적용
	            saleInfoDataVO.addItemListing = function() {
	            	var grid = $("#gridAddVO").data("kendoGrid"),
	            		index = 0,
	            		itemNo = saleInfoDataVO.addItemNo;
	            	
	            	for( ; itemNo != 0 ; itemNo-- ){
	            		var A_VAL_ADD = new Array(),
	            			A_PRC_ADD = new Array(),
	            			S_NM_ADD = "saleInfoDataVO.param.NM_ADDITEM",
	            			W_VAL_ADD = "saleInfoDataVO.param.VAL_ADDITEM",
	            			W_PRC_ADD = "saleInfoDataVO.param.PRC_ADDITEM";
	            		
	            		S_NM_ADD = eval(S_NM_ADD.concat(String(itemNo))),
	            		A_VAL_ADD = (eval(W_VAL_ADD.concat(String(itemNo)))).split(","),
	            		A_PRC_ADD = (eval(W_PRC_ADD.concat(String(itemNo)))).split(",");
	            		
		            	if(A_VAL_ADD.length != A_PRC_ADD.length){
		            		alert(S_NM_ADD+"의 추가상품 값 갯수와 추가상품 가격 갯수가 상이합니다.");
		            		return false;
		            	}
	            	}
	            	
	            	itemNo = saleInfoDataVO.addItemNo;
	            	
	            	for( ; itemNo != 0 ; itemNo-- ){
	            		var A_VAL_ADD = new Array(),
	            			A_PRC_ADD = new Array(),
	            			S_NM_ADD = "saleInfoDataVO.param.NM_ADDITEM",
	            			W_VAL_ADD = "saleInfoDataVO.param.VAL_ADDITEM",
	            			W_PRC_ADD = "saleInfoDataVO.param.PRC_ADDITEM";
	            		
	            		S_NM_ADD = eval(S_NM_ADD.concat(String(itemNo))),
	            		A_VAL_ADD = (eval(W_VAL_ADD.concat(String(itemNo)))).split(","),
	            		A_PRC_ADD = (eval(W_PRC_ADD.concat(String(itemNo)))).split(",");
            		
            		saleInfoDataVO.addItemFor(grid,S_NM_ADD,A_VAL_ADD,A_PRC_ADD);
	            	}
	        	};
	        	
	        	// 추가상품목록FOR 문
	            saleInfoDataVO.addItemFor = function(grid, S_NM_ADD, S_VAL_ADD, S_PRC_ADD) {
            		for( var i = 0 ; i < S_VAL_ADD.length ; i++ ){
            			grid.dataSource.insert(i, { NM_ADDITEM : S_NM_ADD, VAL_ADDITEM : S_VAL_ADD[i], PRC_ADDITEM : S_PRC_ADD[i], QT_SSPL: 0, CD_SALESTAT: "001", NM_SALESTAT: "품절", CD_ADDITEMMNG: "", YN_USE: "Y", VAL_WET: "" });
            		}
	        	};
	        	
	        	// 상품군 변경
	        	saleInfoDataVO.liogChange = function(){
	            	var self = this;
	            	itBssItemSvc.getLiogList(saleInfoDataVO.param.CD_LIOG.CD_LIOG).then(function (res) {
	            		saleInfoDataVO.param.ANNOINFOARTILIST = res.data;
	            		saleInfoDataVO.param.ANNOTYPE = "INSERT";
        			});
	            };
	            
	            // 상품상세 참조로 전체 입력
	        	saleInfoDataVO.allDetail = function(){
	            	if(saleInfoDataVO.param.ANNOINFOARTILIST.length == 0 || saleInfoDataVO.param.ANNOINFOARTILIST.length == "undefiend"){
	            		alert("상품군을 선택해주세요.");
	            		$("#checkDetail").attr("checked", false);
	            		return;
	            	}else{
	            		if(saleInfoDataVO.itemDetailYN == "N"){
	            			angular.forEach(saleInfoDataVO.param.ANNOINFOARTILIST, function (data) {
		                        data.VAL_ANNOINFOARTI = "상품상세 참조";
		                    });
	            		}else{
	            			angular.forEach(saleInfoDataVO.param.ANNOINFOARTILIST, function (data) {
		                        data.VAL_ANNOINFOARTI = "";
		                    });
	            		}
	            	}
	            };
	            
	            // 배송정보 개인별 정해놓은 택배사만 가져오는 기능(
	        	saleInfoDataVO.cmrkParsSearch = function(){
	        		for(var i = 0 ; i < saleInfoDataVO.mrkCodeList.length ; i++){
	        			for(var j = 0 ; j < saleInfoDataVO.cmrkCodeList.length ; j++){
	        				if(saleInfoDataVO.mrkCodeList[i].NM_MRK == "옥션"){
	        					if(saleInfoDataVO.cmrkCodeList[j].NO_MNGMRK == saleInfoDataVO.mrkCodeList[i].NO_MNGMRK){
	        						saleInfoDataVO.auctMrkList.push(saleInfoDataVO.cmrkCodeList[j]);
	        					}
	        				}else if(saleInfoDataVO.mrkCodeList[i].NM_MRK == "지마켓"){
	        					if(saleInfoDataVO.cmrkCodeList[j].NO_MNGMRK == saleInfoDataVO.mrkCodeList[i].NO_MNGMRK){
	        						saleInfoDataVO.gmrkMrkList.push(saleInfoDataVO.cmrkCodeList[j]);
	        					}
	        				}else if(saleInfoDataVO.mrkCodeList[i].NM_MRK == "스토어팜"){
	        					if(saleInfoDataVO.cmrkCodeList[j].NO_MNGMRK == saleInfoDataVO.mrkCodeList[i].NO_MNGMRK){
	        						saleInfoDataVO.storfMrkList.push(saleInfoDataVO.cmrkCodeList[j]);
	        					}
	        				}else if(saleInfoDataVO.mrkCodeList[i].NM_MRK == "11번가"){
	        					if(saleInfoDataVO.cmrkCodeList[j].NO_MNGMRK == saleInfoDataVO.mrkCodeList[i].NO_MNGMRK){
	        						saleInfoDataVO.stMrkList.push(saleInfoDataVO.cmrkCodeList[j]);
	        					}
	        				}else if(saleInfoDataVO.mrkCodeList[i].NM_MRK == "쿠팡"){
	        					if(saleInfoDataVO.cmrkCodeList[j].NO_MNGMRK == saleInfoDataVO.mrkCodeList[i].NO_MNGMRK){
	        						saleInfoDataVO.coopMrkList.push(saleInfoDataVO.cmrkCodeList[j]);
	        					}
	        				}
	        			}
	        		}
	        		if(saleInfoDataVO.auctMrkList.length == 1) {saleInfoDataVO.auctMrkSelected = saleInfoDataVO.auctMrkList[0].NO_MRK;saleInfoDataVO.auctMrkTkbkSelected = saleInfoDataVO.auctMrkList[0].NO_MRK;saleInfoDataVO.cmrkChange("auct");saleInfoDataVO.cmrkTkbkChange("auct");}
	        		if(saleInfoDataVO.gmrkMrkList.length == 1) {saleInfoDataVO.gmrkMrkSelected = saleInfoDataVO.gmrkMrkList[0].NO_MRK;saleInfoDataVO.gmrkMrkTkbkSelected = saleInfoDataVO.gmrkMrkList[0].NO_MRK;saleInfoDataVO.cmrkChange("gmrk");saleInfoDataVO.cmrkTkbkChange("gmrk");}
	        		if(saleInfoDataVO.storfMrkList.length == 1) {saleInfoDataVO.storfMrkSelected = saleInfoDataVO.storfMrkList[0].NO_MRK;saleInfoDataVO.storfMrkTkbkSelected = saleInfoDataVO.storfMrkList[0].NO_MRK;saleInfoDataVO.cmrkChange("storf");saleInfoDataVO.cmrkTkbkChange("storf");}
	        		if(saleInfoDataVO.stMrkList.length == 1) {saleInfoDataVO.stMrkSelected = saleInfoDataVO.stMrkList[0].NO_MRK;saleInfoDataVO.stMrkTkbkSelected = saleInfoDataVO.stMrkList[0].NO_MRK;saleInfoDataVO.cmrkChange("st");saleInfoDataVO.cmrkTkbkChange("st");}
	        		if(saleInfoDataVO.coopMrkList.length == 1) {saleInfoDataVO.coopMrkSelected = saleInfoDataVO.coopMrkList[0].NO_MRK;saleInfoDataVO.coopMrkTkbkSelected = saleInfoDataVO.coopMrkList[0].NO_MRK;saleInfoDataVO.cmrkChange("coop");saleInfoDataVO.cmrkTkbkChange("coop");}
	            };
	            
	            // 사용자별 마켓눌렀을때 설정해놓은 택배사 가져오는 기능 (발송)
	        	saleInfoDataVO.cmrkChange = function(mall){
	        		var malltemp = "saleInfoDataVO.";
	        		var self = this;
	        			malltemp = eval(malltemp.concat(mall+"MrkSelected"));
        			var	param = {
	                    	procedureParam: "USP_SY_15PARS01_GET&NO_MRK@s|L_FLAG@s",
	                    	NO_MRK : malltemp,
	                    	L_FLAG : "0" //발송
	                    };
            		UtilSvc.getList(param).then(function (res) {
            			if(mall == "auct") saleInfoDataVO.auctParsList = res.data.results[0];
            			if(mall == "gmrk") saleInfoDataVO.gmrkParsList = res.data.results[0];
            			if(mall == "storf") saleInfoDataVO.storfParsList = res.data.results[0];
            			if(mall == "st") saleInfoDataVO.stParsList = res.data.results[0];
            			if(mall == "coop") saleInfoDataVO.coopParsList = res.data.results[0];
            		});
	            };
	            
	            // 사용자별 마켓눌렀을때 설정해놓은 택배사 가져오는 기능 (반품)
	        	saleInfoDataVO.cmrkTkbkChange = function(mall){
	        		var malltemp = "saleInfoDataVO.";
	        		var self = this;
	        			malltemp = eval(malltemp.concat(mall+"MrkTkbkSelected"));
        			var	param = {
	                    	procedureParam: "USP_SY_15PARS01_GET&NO_MRK@s|L_FLAG@s",
	                    	NO_MRK : malltemp,
	                    	L_FLAG : "1" //회수
	                    };
            		UtilSvc.getList(param).then(function (res) {
            			if(mall == "auct") saleInfoDataVO.auctTkbkParsList = res.data.results[0];
            			if(mall == "gmrk") saleInfoDataVO.gmrkTkbkParsList = res.data.results[0];
            			if(mall == "storf") saleInfoDataVO.storfTkbkParsList = res.data.results[0];
            			if(mall == "st") saleInfoDataVO.stTkbkParsList = res.data.results[0];
            			if(mall == "coop") saleInfoDataVO.coopTkbkParsList = res.data.results[0];
            		});
	            };
	            
	            // 퀵서비스 팝업창 띄워서 값 가져오기
	        	saleInfoDataVO.quisevModal = function(mall){
	        		saleInfoDataVO.tempQuick = mall;
	        		itBssItemSvc.quisevModal().then(function(areaString) {
	        			if(saleInfoDataVO.tempQuick == "auct") saleInfoDataVO.param.AUCT.AREA_QUISEV = areaString;
	        			if(saleInfoDataVO.tempQuick == "gmrk") saleInfoDataVO.param.GMRK.AREA_QUISEV = areaString;
	        			if(saleInfoDataVO.tempQuick == "storf") saleInfoDataVO.param.STORF.AREA_QUISEV = areaString;
					});
	            };
	            
	            // 퀵서비스 지역 값 지우기 
	        	saleInfoDataVO.quisevDelete = function(mall){
	        		if(mall == "auct") saleInfoDataVO.param.AUCT.AREA_QUISEV = "";
        			if(mall == "gmrk") saleInfoDataVO.param.GMRK.AREA_QUISEV = "";
        			if(mall == "storf") saleInfoDataVO.param.STORF.AREA_QUISEV = "";
	            };
	            
	            // 원산지 관련 메소드
	            saleInfoDataVO.cooChange = function(flag){
	            	var self = this,
	            	    param = {
        					procedureParam: "USP_IT_02BSSITEMCOO01_GET&L_CD_COO@s",
        					L_CD_COO: ""
        					};
	            	self.param.CD_COO = "";
	            	if(flag == 0){
	            		if(self.selectedCoo1){
	            			param.L_CD_COO = "";
	            			UtilSvc.getList(param).then(function (res) {
	            				self.itemCooList1 = res.data.results[0];
                            });
		            	}else{
		            		self.itemCooList2 = "";self.itemCooList3 = "";
		            	}
	            	}
	            	if(flag == 1){
	            		if(self.selectedCoo1){
	            			param.L_CD_COO = self.selectedCoo1.CD_COO;
	            			UtilSvc.getList(param).then(function (res) {
	            				self.itemCooList2 = res.data.results[0];
                            });
		            	}else{
		            		self.itemCooList2 = "";self.itemCooList3 = "";
		            	}
	            	}else if(flag == 2){
	            		if(self.selectedCoo2){
	            			param.L_CD_COO = self.selectedCoo2.CD_COO;
	            			UtilSvc.getList(param).then(function (res) {
	            				self.itemCooList3 = res.data.results[0];
                            });
		            	}else{
		            		self.itemCooList3 = "";
		            	}
	            	}
	            };
	            
	            // 할인/할증 수량,배송비 ADD
	        	saleInfoDataVO.condAdd = function(NO_BTN, mall){
	        		if(mall=="auct")saleInfoDataVO.param.AUCT.COND_CNT[NO_BTN].YN = "Y";
	        		else if (mall=="gmrk"){saleInfoDataVO.param.GMRK.COND_CNT[NO_BTN].YN = "Y";
	        							   saleInfoDataVO.param.GMRK.COND_CNT[4].VAL="";}
	        		else if (mall=="st"){saleInfoDataVO.param.st.COND_CNT[NO_BTN].YN = "Y";
					   saleInfoDataVO.param.st.COND_CNT[4].VAL="";}
	            };
	            
	            // 할인/할증 수량,배송비 DELETE
	        	saleInfoDataVO.condDelete = function(NO_BTN, mall){
	        		if(mall=="auct")saleInfoDataVO.param.AUCT.COND_CNT[NO_BTN].YN = "N";
	        		else if (mall=="gmrk"){saleInfoDataVO.param.GMRK.COND_CNT[NO_BTN].YN = "N";
	        							   saleInfoDataVO.gmrkCondcnt002();}
	        		else if (mall=="st"){saleInfoDataVO.param.st.COND_CNT[NO_BTN].YN = "N";
					   					 saleInfoDataVO.stCondcnt002();}
	            };
	            
	            // 옥션,지마켓 인증정보 3분류로 나눠줌
	        	saleInfoDataVO.ctfcSort = function(ctfcList){
	        		var resultList = new Array( new Array(), new Array(), new Array() );
	        		for(var i = 0; i < ctfcList.length ; i++){
                    	var tempList = [];
                    	tempList = ctfcList[i].NM_CTFCINFO.split(" ");
                    	if(tempList[0]=="어린이제품")resultList[0].push(ctfcList[i]);
                    	if(tempList[0]=="생활용품")resultList[1].push(ctfcList[i]);
                    	if(tempList[0]=="전기용품")resultList[2].push(ctfcList[i]);
                    }
	        		return resultList;
	            };
	            
	            // 지마켓 구매구간 자동설정
	            saleInfoDataVO.gmrkCondcnt = function(){
	            	var num = Number(saleInfoDataVO.param.GMRK.COND_CNT[0].VAL);
	            	var sum = 0;
	            	for(var i = 1; i < 7 ; i++){
	            		if(i%2!=0){
	            			sum += 1;
	            		}else {
	            			sum += num-1;
	            		}
	            		$("#gmrkCnt"+i).val(sum);
	            	}
	            };
	            
	            // 지마켓 구매배송비 자동설정
	            saleInfoDataVO.gmrkCondshpprc = function(){
	            	var num = Number(saleInfoDataVO.param.GMRK.COND_SHPPRC[0].VAL);
	            	var sum = 0;
	            	for(var i = 1; i < 4 ; i++){
	            		sum += num;
	            		$("#gmrkShp"+i).val(sum);
	            	}
	            };
	            
	            // 지마켓 구매수량별/ 배송비 구간 직접입력 라디오 버튼 눌렀을시 값 초기화
	            saleInfoDataVO.gmrkShpChange = function(){
	            	saleInfoDataVO.param.GMRK.COND_CNT = [{VAL : '', YN: 'Y'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'Y'}];
	            	saleInfoDataVO.param.GMRK.COND_SHPPRC = [];
	            };
	            
	            // 11st 구매수량별/ 배송비 구간 직접입력 라디오 버튼 눌렀을시 값 초기화
	            saleInfoDataVO.stShpChange = function(){
	            	saleInfoDataVO.param.ST.COND_CNT = [{VAL : '', YN: 'Y'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'Y'}];
	            	saleInfoDataVO.param.ST.COND_SHPPRC = [];
	            };
	            
	        	// 옥션 직접입력 구매구간 자동설정
	            saleInfoDataVO.auctCondcnt002 = function(){
	            	for(var i = 3; i >= 0 ; i--){
	            		if(saleInfoDataVO.param.AUCT.COND_CNT[i].YN == "Y"){
	            			saleInfoDataVO.param.AUCT.COND_CNT[4].VAL = saleInfoDataVO.param.AUCT.COND_CNT[i].VAL;
	            			return true;
	            		}
	            	}
	            };
	            
	            // 지마켓 직접입력 구매구간 자동설정
	            saleInfoDataVO.gmrkCondcnt002 = function(){
	            	for(var i = 3; i >= 0 ; i--){
	            		if(saleInfoDataVO.param.GMRK.COND_CNT[i].YN == "Y"){
	            			saleInfoDataVO.param.GMRK.COND_CNT[4].VAL = saleInfoDataVO.param.GMRK.COND_CNT[i].VAL;
	            			return true;
	            		}
	            	}
	            };
	            
	            // 11st 직접입력 구매구간 자동설정
	            saleInfoDataVO.stCondcnt002 = function(){
	            	for(var i = 3; i >= 0 ; i--){
	            		if(saleInfoDataVO.param.ST.COND_CNT[i].YN == "Y"){
	            			saleInfoDataVO.param.ST.COND_CNT[4].VAL = saleInfoDataVO.param.ST.COND_CNT[i].VAL;
	            			return true;
	            		}
	            	}
	            };
	            
	            // 스토어팜, 11번가, 쿠팡 인증정보 데이터 정렬(저장할때)
	            saleInfoDataVO.ctfcParamSort = function(dataList){
	            	var resultList = [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}];
	            	for(var i = 0 ; i < dataList.length ; i++){
	            		resultList[i].CD_CTFCINFO = dataList[i].CD_CTFCINFO;
	            		resultList[i].VAL_CTFCINFO = dataList[i].VAL_CTFCINFO;
	            	}
	            	return resultList;
	            };
	            
	            
	            
	            
	            
	            
	            
	            
	            
	            
	            
	            
	            
	            
	            
	            
	            
	            /*// 스토어팜 인증정보 동적변경
	            saleInfoDataVO.storfCtfcChange = function(){
	            	var htmlString = "";
	            	htmlString += "<button style='margin:10px' data-ng-if='page.isWriteable()' class='ng-scope k-button addStorfCtfc' data-role='button' role='button' tabindex='0'>추가</button>"
	            	+"<table class='table-bordered' style='margin-left: 60px;width: 94%'><colgroup><col style='width: 10%'><col style='width: 35%'><col style='width: 35%'><col style='width: 20%'></colgroup>"
                	+"<tr style='height: 60px;'><td style='text-align: center'>번호</td>"
                	+"<td style='text-align: center'>인증항목</td>"
                	+"<td style='text-align: center'>인증번호</td>"
                	+"<td style='text-align: center'>삭제</td></tr>"
                	+"<tr><td>1</td><td style='width: 150px;text-align: center'><select class='form-control wid-x6 ng-pristine ng-valid' id='ctfcInfo' title='인증정보'"
					+"data-ng-model='saleInfoDataVO.param.storf.CTCFINFO[0].CD_CTFCINFO' style='width: 150px;'>"
					+"<option value=''>인증정보선택</option>";
					for(var i = 0 ; i < saleInfoDataVO.storfCtfcList.length ; i++){
						htmlString +="<option value='"+saleInfoDataVO.storfCtfcList[i].CD_CTFCINFO+"'>"+saleInfoDataVO.storfCtfcList[i].NM_CTFCINFO+"</option>";
					}
					htmlString +="</select></td>"
					+"<td style='width: 150px;text-align: center'><input type='text' class='form-control wid-x6' id='CTCFINFO' name='CTCFINFO' title='인증번호 입력'"
			        +"data-ng-model='saleInfoDataVO.param.storf.CTCFINFO[0].VAL'></td>"
			        +"<td style='text-align: center'><button style='margin:10px' data-ng-if='page.isWriteable()' class='ng-scope k-button deleteStorfCtfc1' data-role='button' role='button' aria-disabled='false' tabindex='0'>삭제</button></td></tr>"
                	for(var j = 1 ; j < saleInfoDataVO.param.storf.CTCFINFO.length; j++){
                		if(saleInfoDataVO.param.storf.CTCFINFO[j].CD_CTFCINFO == "")break;
                		else{
                			htmlString +="<tr><td>"+j+"</td><td style='width: 150px;text-align: center'><select class='form-control wid-x6 ng-pristine ng-valid' id='ctfcInfo' title='인증정보'"
            					+"data-ng-model='saleInfoDataVO.param.storf.CTCFINFO["+j+"].CD_CTFCINFO' style='width: 150px;'>"
            					+"<option value=''>인증정보선택</option>";
                			for(var i = 0 ; i < saleInfoDataVO.storfCtfcList.length ; i++){
        						htmlString +="<option value='"+saleInfoDataVO.storfCtfcList[i].CD_CTFCINFO+"'>"+saleInfoDataVO.storfCtfcList[i].NM_CTFCINFO+"</option>";
        					}
                			htmlString +="</select></td>"
            					+"<td style='width: 150px;text-align: center'><input type='text' class='form-control wid-x6' id='CTCFINFO' name='CTCFINFO' title='인증번호 입력'"
            			        +"data-ng-model='saleInfoDataVO.param.storf.CTCFINFO["+j+"].VAL'></td>"
            			        +"<td style='text-align: center'><button style='margin:10px' data-ng-if='page.isWriteable()' class='ng-scope k-button deleteStorfCtfc' data-role='button' role='button' aria-disabled='false' tabindex='0'>삭제</button></td></tr>"
                		}
                	}
			        htmlString +="</table>";
	            	$('.storfCtfcTable').html(htmlString);
	            };
	            
	            // 인증정보 1ROW 추가
	            $(document).on('click', '.addStorfCtfc', function (arg) {
	            	for(var i = 0 ; i < saleInfoDataVO.param.storf.CTCFINFO.length; i++){
	            		if(saleInfoDataVO.param.storf.CTCFINFO[i].CD_CTFCINFO=="") {alert("인증정보를 입력해주세요");return;}
	            	}
	            });
	            
	            // 첫번째 인증정보 내용만 삭제
	            $(document).on('click', '.deleteStorfCtfc1', function (arg) {
	            	
	            });
	            
	            // 인증정보 1ROW 삭제
	            $(document).on('click', '.deleteStorfCtfc', function (arg) {
	            	
	            });*/
	        	
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
                    
                    // 최소구매수량
                    if (!(data.QT_MINPCS) || data.QT_MINPCS == 0 ) {
	                    return edt.invalidFocus("QT_MINPCS", "[형식] 최소구매수량은 0 보다 커야합니다.");
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
                
                saleInfoDataVO.dropDownEditor = function(container, options, objDataSource, arrField) {
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
	            	      	            
		        //초기 화면 로드시 조회
		        saleInfoDataVO.getInitializeItemInfo();
            }]);
}());