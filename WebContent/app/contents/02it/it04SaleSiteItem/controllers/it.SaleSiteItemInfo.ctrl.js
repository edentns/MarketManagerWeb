(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name it.SaleSiteItem.controller : it.SaleSiteItemCtrl
     * 상품분류관리
     */
    angular.module("it.SaleSiteItem.controller")
        .controller("it.SaleSiteItemInfoCtrl", ["$scope", "$state", "$http", "$q", "$log", "it.SaleSiteItemSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc","it.BssItemSvc",
            function ($scope, $state, $http, $q, $log, itSaleSiteItemSvc, APP_CODE, $timeout, resData, Page, UtilSvc, itBssItemSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
                
	            var saleItemDataVO = $scope.saleItemDataVO = {
	            	auct : "옥션추가정보",
	            	gmrk : "지마켓추가정보",
	            	storf: "스토어팜추가정보",
	            	st   : "11번가추가정보",
	            	coop : "쿠팡추가정보",
	        		NO_MNGMRK        : "SYMM170101_00003",
	        		NM_MRK           : "옥션",
	        		mngMrkList       : [],
	        		cmrkList         : [],
	        		mallMrkList      : [],
	        		auctShpWayList   : [],
	        		auctParsList     : [],
	        		auctTkbkParsList : [],
                    gmrkParsList     : [],
                    gmrkTkbkParsList : [],
                    storfParsList    : [],
                    storfTkbkParsList: [],
                    stParsList       : [],
                    stTkbkParsList   : [],
                    coopParsList     : [],
                    coopTkbkParsList : [],
                    postCodeList     : [],
                    prcShpList       : [],
                    CD_PRCSHP        : "",
                    shpTplList       : [],
	                shpAWayList      : [],
	                exchAClftList    : [],  
	                auctCtfcList     : [],  
	                gmrkCtfcList     : [],  
	                storfCtfcList    : [], 
	                stCtfcList       : [],   
	                coopCtfcList     : [], 
	                exchGClftList    : [],  
	                shpSWayList      : [],  
	                shpprcList       : [], 
	                sectCntYnList    : [], 
	                servItemList     : [],
	                shpSTWayList     : [],   
	                shpCWayList      : [],   
	                shpprcCList      : [],   
	                shpprSTList      : [],   
	                shpGuiList       : [],  
	                YN_TIMSMAXPCHS   : "N",
	                YN_JJMNT         : "N",
	        		param            : {
	        			NO_MRK : "",
	        			
	        			AM_ITEMPRC           : "",
	        			QT_SALE              : "",
        				CD_ITEM              : "",
        				NO_MRK               : "",
        				DTS_SALEEND          : "",
        				DTS_SALESTART        : "",
        				NO_MRKITEM           : "",
        				NM_MRKCLFT           : "",
        				CD_REGSTAT           : "",
        				VAL_UNI              : "",
        				PRC_UNI              : "",
        				DT_SHPSTART          : "",
        				YN_MAXPCHSAMOU       : "N",
        				AMOU_MAXPCHSLIM      : "",
        				DAYS_PRDLIM          : "",
        				AMOU_PRDLIM          : "",
        				AMOU_MAXPCHSLIMCLS   : "",
        				AMOU_MAXPCHSLIMPER   : "",
        				HTML_AVTMTRI         : "",
        				CD_SHPWAY            : "",
        				CD_SHPPARS           : "",
        				CD_TKBKPARS          : "",
        				CD_POST              : "001",
        				PRC_POST             : "",
        				AREA_QUISEV          : "",
        				NM_QUISEVCMPN        : "",
        				NO_QUISEVPHNE        : "",
        				PRC_ONESHP           : "",
        				PRC_RTIPSHP          : "",
        				YN_BDLSHP            : "N",
        				CD_SHPPRC            : "",
        				CD_ERLSHPPRCFREIMPWAY: "",
        				PRC_SHP1             : "",
        				PRC_SHP2             : "",
        				PRC_STDSHP           : "",
        				CD_SHPIMPWAY         : "001",
        				PRC_AREACLSFSHP      : "",
        				PRC_ADDINST          : "",
        				GUI_TKBKECHG         : "",
        				YN_FECTSALE          : "",
        				AMOU_MINPCHS         : "",
        				CD_MD                : "",
        				CD_SERVITEM          : "",
        				YN_QUIK              : "",
        				YN_VISRECE           : "",
        				YN_TKBKSHPPRCCOD     : "",
        				DAYS_DELITAK         : "",
        				YN_BCD               : "",
        				DC_BCD               : "",
        				RSN_BCDNO            : "",
        				YN_PRLICOM           : "",
        				YN_FECTPCHSAGNCY     : "",
        				YN_INDVCTCAMAKNECE   : "",
        				YN_MNTSHP            : "N",
        				NM_MNFR              : "",
        				YN_RSVSALE           : "N",
        				CD_SHPPRCTPL         : "",
        				CD_EXCHGDISCCLFT     : "",
        				CD_AMOUSECTCLFT      : "",
        				CD_SECTCNTYN         : "",
        				YN_SPRINSTPRC        : "",
        				CD_SHPPRCADDGUI      : "",
        				PRC_MNTADDSHP        : "",
        				PRC_JJADDSHP         : "",
        				PRC_FIRTTIMSTKBKSHP  : "",
        				DC_PUREWD            : "",
        				COND_CNT      : [{VAL : '', YN: 'Y'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'Y'}],
		        		COND_SHPPRC   : [{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''}],
		        		CTCFINFO      : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}]
	        		}
	            };	     
	            
	          //처음 화면들어왓을때
	            saleItemDataVO.doQuiry = function(){
	            	saleItemDataVO.mngMrkList     = resData.mngMrkList;
	            	saleItemDataVO.cmrkList       = resData.cmrkList;
	            	saleItemDataVO.auctShpWayList = resData.auctShpWayList;
	            	saleItemDataVO.postCodeList   = resData.postCodeList;
	            	saleItemDataVO.prcShpList     = resData.prcShpList;
	            	saleItemDataVO.shpTplList     = resData.shpTplList;
	            	saleItemDataVO.shpAWayList    = resData.shpAWayList;
	            	saleItemDataVO.exchAClftList  = resData.exchAClftList;
	            	saleItemDataVO.auctCtfcList   = saleItemDataVO.ctfcSort(resData.auctCtfcList);
	            	saleItemDataVO.gmrkCtfcList   = saleItemDataVO.ctfcSort(resData.gmrkCtfcList);
	            	saleItemDataVO.storfCtfcList  = resData.storfCtfcList;
	            	saleItemDataVO.stCtfcList     = resData.stCtfcList;
                    saleItemDataVO.coopCtfcList   = resData.coopCtfcList;
                    saleItemDataVO.exchGClftList  = resData.exchGClftList;
                    saleItemDataVO.shpSWayList    = resData.shpSWayList;
                    saleItemDataVO.shpprcList     = resData.shpprcList;
                    saleItemDataVO.sectCntYnList  = resData.sectCntYnList;
                    saleItemDataVO.servItemList   = resData.servItemList;
                    saleItemDataVO.shpSTWayList   = resData.shpSTWayList;
                    saleItemDataVO.shpCWayList    = resData.shpCWayList;
                    saleItemDataVO.shpprcCList    = resData.shpprcCList;
                    saleItemDataVO.shpprSTList    = resData.shpprSTList;
                    saleItemDataVO.shpGuiList     = resData.shpGuiList;
	            	
	            	/*바꿔서 넣어야 하는 컬럼명
	            	AMOU_TIMSLIM       = AMOU_MAXPCHSLIMCLS
	            	AMOU_TIMSMAXPCHS   = AMOU_MAXPCHSLIMCLS
	            	AMOU_PESMAXPCHS    = AMOU_MAXPCHSLIMPER
	            	PRC_TKBKECHGONESHP = PRC_ONESHP
	            	PRC_TKBKSHP        = PRC_ONESHP
	            	PRC_ECHGSHP        = PRC_RTIPSHP
	            	DAYS_PESMAXPCHSAMOU = DAYS_PRDLIM
*/
	            	
	            	
	            	/*$timeout(function() {
		            	// 이전에 검색조건을 세션에 저장된 것을 가져옴
	            		if(resData.CD_ITEMCTGR1 !== "") {
	    					saleItemDataVO.selectedCtgr1.ID_CTGR = resData.CD_ITEMCTGR1;
	    					saleItemDataVO.selectedCtgr1.NM_CTGR = resData.NM_ITEMCTGR1;
	    					saleItemDataVO.ctgrChange(0);
	    					saleItemDataVO.selectedCtgr2.ID_CTGR = resData.CD_ITEMCTGR2;
	    					saleItemDataVO.selectedCtgr2.NM_CTGR = resData.NM_ITEMCTGR2;
	    					saleItemDataVO.ctgrChange(1);
	    					saleItemDataVO.selectedCtgr3.ID_CTGR = resData.CD_ITEMCTGR3;
	    					saleItemDataVO.selectedCtgr3.NM_CTGR = resData.NM_ITEMCTGR3;
	    					saleItemDataVO.ctgrChange(2);
	            		}
	            		$scope.gridSaleVO.dataSource.read();
	            	},1000);*/
	            };
	            
	            // 사용자별 마켓눌렀을때 설정해놓은 택배사 가져오는 기능 (발송)
	            saleItemDataVO.cmrkChange = function(){
        			var	param = {
	                    	procedureParam: "USP_SY_15PARS01_GET&NO_MRK@s|L_FLAG@s",
	                    	NO_MRK : saleItemDataVO.param.NO_MRK,
	                    	L_FLAG : "0" //발송
	                    };
            		UtilSvc.getList(param).then(function (res) {
            			if(saleItemDataVO.NM_MRK == "옥션") saleItemDataVO.auctParsList = res.data.results[0];
            			if(saleItemDataVO.NM_MRK == "지마켓") saleItemDataVO.gmrkParsList = res.data.results[0];
            			if(saleItemDataVO.NM_MRK == "스토어팜") saleItemDataVO.storfParsList = res.data.results[0];
            			if(saleItemDataVO.NM_MRK == "11번가") saleItemDataVO.stParsList = res.data.results[0];
            			if(saleItemDataVO.NM_MRK == "쿠팡") saleItemDataVO.coopParsList = res.data.results[0];
            		});
	            };
	            
	            // 사용자별 마켓눌렀을때 설정해놓은 택배사 가져오는 기능 (반품)
	            saleItemDataVO.cmrkTkbkChange = function(){
        			var	param = {
	                    	procedureParam: "USP_SY_15PARS01_GET&NO_MRK@s|L_FLAG@s",
	                    	NO_MRK : saleItemDataVO.param.NO_MRK,
	                    	L_FLAG : "1" //회수
	                    };
            		UtilSvc.getList(param).then(function (res) {
            			if(saleItemDataVO.NM_MRK == "옥션") saleItemDataVO.auctTkbkParsList = res.data.results[0];
            			if(saleItemDataVO.NM_MRK == "지마켓") saleItemDataVO.gmrkTkbkParsList = res.data.results[0];
            			if(saleItemDataVO.NM_MRK == "스토어팜") saleItemDataVO.storfTkbkParsList = res.data.results[0];
            			if(saleItemDataVO.NM_MRK == "11번가") saleItemDataVO.stTkbkParsList = res.data.results[0];
            			if(saleItemDataVO.NM_MRK == "쿠팡") saleItemDataVO.coopTkbkParsList = res.data.results[0];
            		});
	            };
	            
	            // 퀵서비스 팝업창 띄워서 값 가져오기
	            saleItemDataVO.quisevModal = function(){
	        		itBssItemSvc.quisevModal().then(function(areaString) {
	        			saleItemDataVO.param.AREA_QUISEV = areaString;
					});
	            };
	            
	            // 퀵서비스 지역 값 지우기 
	            saleItemDataVO.quisevDelete = function(){
	            	saleItemDataVO.param.AREA_QUISEV = "";
	            };
	            
	            // 운송비부담구분 상품별 배송비 수량별차등 직접입력 구매구간 자동설정
	            saleItemDataVO.condCnt = function(){
	            	for(var i = 3; i >= 0 ; i--){
	            		if(saleItemDataVO.param.COND_CNT[i].YN == "Y"){
	            			saleItemDataVO.param.COND_CNT[4].VAL = saleItemDataVO.param.COND_CNT[i].VAL;
	            			return true;
	            		}
	            	}
	            };
	            
	            // 할인/할증 수량,배송비 ADD
	            saleItemDataVO.condAdd = function(NO_BTN){
	            	saleItemDataVO.param.COND_CNT[NO_BTN].YN = "Y";
	            };
	            
	            // 할인/할증 수량,배송비 DELETE
	            saleItemDataVO.condDelete = function(NO_BTN, mall){
	            	saleItemDataVO.param.COND_CNT[NO_BTN].YN = "N";
	            };
	            
	            // 옥션,지마켓 인증정보 3분류로 나눠줌
	            saleItemDataVO.ctfcSort = function(ctfcList){
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
	            saleItemDataVO.gmrkCondcnt = function(){
	            	var num = Number(saleItemDataVO.param.COND_CNT[0].VAL);
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
	            saleItemDataVO.gmrkCondshpprc = function(){
	            	var num = Number(saleItemDataVO.param.COND_SHPPRC[0].VAL);
	            	var sum = 0;
	            	for(var i = 1; i < 4 ; i++){
	            		sum += num;
	            		$("#gmrkShp"+i).val(sum);
	            	}
	            };
	            
	            saleItemDataVO.bcdChange = function(){
	            	var self = this;
	            	if(self.param.YN_BCD == "Y"){
	            		self.param.DC_BCD = "";
	            		angular.element("#DC_BCD").attr("readonly", true);
	            	}
	            	else angular.element("#DC_BCD").attr("readonly", false);
	            };
	            
	            // 지마켓 구매수량별/ 배송비 구간 직접입력 라디오 버튼 눌렀을시 값 초기화
	            saleItemDataVO.shpReset = function(){
	            	saleItemDataVO.param.COND_CNT = [{VAL : '', YN: 'Y'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'Y'}];
	            	saleItemDataVO.param.COND_SHPPRC = [];
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
	                        		e.model.set("CD_ITEM" ,  saleItemDataVO.ids);
	                        	}
	                        }
	            		},
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	                				var param = {
                						procedureParam:"USP_IT_02BSSITEMOPT_GET&L_CD_ITEM@s|L_FLAG@s",
                						L_CD_ITEM  :  saleItemDataVO.ids,
                						L_FLAG     :  "1"
                					};
	            					UtilSvc.getList(param).then(function (res) {
	            						e.success(res.data.results[0]);
	            						saleItemDataVO.NM_COM = res.data.results[1][0].NM_C;
	            						if(!page.isWriteable()){
	            	    					var grid = $("#gridOpt"+saleItemDataVO.param.CD_OPTTP).data("kendoGrid");
	            	    					grid.setOptions({editable : false});   
	            	    					grid.hideColumn(5);
	            	    					$("#gridOpt"+saleItemDataVO.param.CD_OPTTP+" .k-grid-toolbar").hide();
	            	    				}
	            					});
	                			},
	                			create: function(e) {
	                				if(saleItemDataVO.oriOPTTP != saleItemDataVO.param.CD_OPTTP){
	                					e.data.models[0].TEMP = saleItemDataVO.oriOPTTP;
	                				}
	                				for(var i = 0 ; i < e.data.models.length ; i++){
	                					e.data.models[i].CD_ITEM = saleItemDataVO.CD_ITEM;
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
	                		["create", "cancel"],
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
	                        		e.model.set("CD_ITEM" ,  saleItemDataVO.ids);
	                        	}
	                        }
	            		},
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	                				var param = {
                						procedureParam:"USP_IT_02BSSITEMOPT_GET&L_CD_ITEM@s|L_FLAG@s",
                						L_CD_ITEM  :  saleItemDataVO.ids,
                						L_FLAG     :  "2"
                					};
	            					UtilSvc.getList(param).then(function (res) {
	            						e.success(res.data.results[0]);
	            						if(!page.isWriteable()){
	            							var grid = $("#gridOpt"+saleItemDataVO.param.CD_OPTTP).data("kendoGrid");
	            	    					grid.setOptions({editable : false});   
	            	    					grid.hideColumn(7);
	            	    					$("#gridOpt"+saleItemDataVO.param.CD_OPTTP+" .k-grid-toolbar").hide();
	            	    				}
	            					});
	                			},
	                			create: function(e) {
	                				if(saleItemDataVO.oriOPTTP != saleItemDataVO.param.CD_OPTTP){
	                					e.data.models[0].TEMP = saleItemDataVO.oriOPTTP;
	                				}
	                				for(var i = 0 ; i < e.data.models.length ; i++){
	                					e.data.models[i].CD_ITEM = saleItemDataVO.CD_ITEM;
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
	                		["create", "cancel"],
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
	           	   				{command: [ "destroy" ]}
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
	                        		e.model.set("CD_ITEM" ,  saleItemDataVO.ids);
	                        	}
	                        }
	            		},
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	                				var param = {
                						procedureParam:"USP_IT_02BSSITEMOPT_GET&L_CD_ITEM@s|L_FLAG@s",
                						L_CD_ITEM  :  saleItemDataVO.ids,
                						L_FLAG     :  "2"
                					};
	            					UtilSvc.getList(param).then(function (res) {
	            						e.success(res.data.results[0]);
	            						if(!page.isWriteable()){
	            							var grid = $("#gridOpt"+saleItemDataVO.param.CD_OPTTP).data("kendoGrid");
	            	    					grid.setOptions({editable : false});   
	            	    					grid.hideColumn(7);
	            	    					$("#gridOpt"+saleItemDataVO.param.CD_OPTTP+" .k-grid-toolbar").hide();
	            	    				}
	            					});
	                			},
	                			create: function(e) {
	                				if(saleItemDataVO.oriOPTTP != saleItemDataVO.param.CD_OPTTP){
	                					e.data.models[0].TEMP = saleItemDataVO.oriOPTTP;
	                				}
	                				for(var i = 0 ; i < e.data.models.length ; i++){
	                					e.data.models[i].CD_ITEM = saleItemDataVO.CD_ITEM;
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
	                		["create", "cancel"],
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
	           	   				{command: [ "destroy" ]}
	                	],
	                    collapse: function(e) {
	                        // console.log(e.sender);
	                        this.cancelRow();
	                    },
	                	editable: true,
	                	height: 180
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
	          		       	  		saleItemDataVO.dropDownEditor(container, options, saleItemDataVO.storfCtfcList, ["NM_CTFCINFO","CD_CTFCINFO"]);
	           		        	},
	           		        	template: function(e){
	           		        		for( var i = 0 ; i<saleItemDataVO.storfCtfcList.length; i++ ){
	           		        			if( e.CD_CTFCINFO == saleItemDataVO.storfCtfcList[i].CD_CTFCINFO ){
	           		        				return saleItemDataVO.storfCtfcList[i].NM_CTFCINFO;
	           		        			}
	           		        		}
	          		       	   		return "선택해주세요";
	          		       	  	}},
	          		       	  	{field: "VAL_CTFCINFO",   title: "인증번호",  width: 280,
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
	          		       	  		saleItemDataVO.dropDownEditor(container, options, saleItemDataVO.stCtfcList, ["NM_CTFCINFO","CD_CTFCINFO"]);
	           		        	},
	           		        	template: function(e){
	           		        		for( var i = 0 ; i<saleItemDataVO.stCtfcList.length; i++ ){
	           		        			if( e.CD_CTFCINFO == saleItemDataVO.stCtfcList[i].CD_CTFCINFO ){
	           		        				return saleItemDataVO.stCtfcList[i].NM_CTFCINFO;
	           		        			}
	           		        		}
	          		       	   		return "선택해주세요";
	          		       	  	}},
	          		       	  	{field: "VAL_CTFCINFO",   title: "인증번호",  width: 280,
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
	          		       	  		saleItemDataVO.dropDownEditor(container, options, saleItemDataVO.coopCtfcList, ["NM_CTFCINFO","CD_CTFCINFO"]);
	           		        	},
	           		        	template: function(e){
	           		        		for( var i = 0 ; i<saleItemDataVO.coopCtfcList.length; i++ ){
	           		        			if( e.CD_CTFCINFO == saleItemDataVO.coopCtfcList[i].CD_CTFCINFO ){
	           		        				return saleItemDataVO.coopCtfcList[i].NM_CTFCINFO;
	           		        			}
	           		        		}
	          		       	   		return "선택해주세요";
	          		       	  	}},
	          		       	  	{field: "VAL_CTFCINFO",   title: "인증번호",  width: 280,
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
	            
	            
	            
	            //조회
	            saleItemDataVO.inQuiry = function(){
	            	$scope.gridSaleVO.dataSource.read();
	            	var param = {
	            			CD_SIGNITEM  : saleItemDataVO.signItem.value,
        					NM_ITEM      : saleItemDataVO.nmItem.value,
        					NO_MRK       : saleItemDataVO.cmrkIds,
        					NO_MRK_SELECT_INDEX : saleItemDataVO.cmrkList.allSelectNames,
        					CD_ITEMSTAT  : saleItemDataVO.iStatIds,
        					CD_ITEMSTAT_SELECT_INDEX : saleItemDataVO.iStatList.allSelectNames,
        					CD_ITEMCTGR1 : saleItemDataVO.selectedCtgr1.ID_CTGR,
        					NM_ITEMCTGR1 : saleItemDataVO.selectedCtgr1.NM_CTGR,
        					CD_ITEMCTGR2 : saleItemDataVO.selectedCtgr2.ID_CTGR,
        					NM_ITEMCTGR2 : saleItemDataVO.selectedCtgr2.NM_CTGR,
        					CD_ITEMCTGR3 : saleItemDataVO.selectedCtgr3.ID_CTGR,
        					NM_ITEMCTGR3 : saleItemDataVO.selectedCtgr3.NM_CTGR,
							DATE_SELECTED: saleItemDataVO.datesetting.selected,
							DATE_FROM    : saleItemDataVO.datesetting.period.start,
		                	DATE_TO      : saleItemDataVO.datesetting.period.end
		                };
	        			// 검색조건 세션스토리지에 임시 저장
	        			UtilSvc.grid.setInquiryParam(param);
	            };	

	            saleItemDataVO.isOpen = function (val) {
	            	if(val) {
	            		$scope.gridSaleVO.wrapper.height(656);
	            		$scope.gridSaleVO.resize();
	            		gridSaleVO.dataSource.pageSize(20);
	            	}
	            	else {
	            		$scope.gridSaleVO.wrapper.height(798);
	            		$scope.gridSaleVO.resize();
	            		gridSaleVO.dataSource.pageSize(24);
	            	}
	            };
	            
	            //판매상품 검색 그리드
                var gridSaleVO = $scope.gridSaleVO = {
                		autoBind: false,
                        messages: {                        	
                            requestFailed: "상품정보를 가져오는 중 오류가 발생하였습니다.",
                            commands: {
                                update: "저장",
                                canceledit: "닫기"
                            }
                            ,noRecords: "검색된 데이터가 없습니다."
                        },
                    	boxTitle : "판매상품 리스트",
                    	sortable: false,                    	
                    	pageable: {
                        	messages: UtilSvc.gridPageableMessages
                        },
                        noRecords: true,
                    	dataSource: new kendo.data.DataSource({
                    		transport: {
                    			read: function(e) {
                    				if(saleItemDataVO.selectedCtgr3 == null || saleItemDataVO.selectedCtgr3.ID_CTGR == ""){
                    					if(saleItemDataVO.selectedCtgr2 == null || saleItemDataVO.selectedCtgr2.ID_CTGR == ""){
                    						if(saleItemDataVO.selectedCtgr1 == null || saleItemDataVO.selectedCtgr1.ID_CTGR == ""){
                    							saleItemDataVO.iCtgrId = "";
                            				}else{
                            					saleItemDataVO.iCtgrId = saleItemDataVO.selectedCtgr1.ID_CTGR;
                            				}
                        				}else{
                        					saleItemDataVO.iCtgrId = saleItemDataVO.selectedCtgr2.ID_CTGR;
                        				}
                    				}else{
                    					saleItemDataVO.iCtgrId = saleItemDataVO.selectedCtgr3.ID_CTGR;
                    				}
                    				var param = {
                    					procedureParam: "USP_IT_04SITEITEM_LIST_GET&L_CD_SIGNITEM@s|L_NM_ITEM@s|L_NO_MRK@s|L_CD_ITEMSTAT@s|L_CD_ITEMCTGR@s",
                    					L_CD_SIGNITEM :	saleItemDataVO.signItem.value,
                    					L_NM_ITEM     : saleItemDataVO.nmItem.value,
                    					L_NO_MRK      : saleItemDataVO.cmrkIds,
                    					L_CD_ITEMSTAT : saleItemDataVO.iStatIds,
                    					L_CD_ITEMCTGR : saleItemDataVO.iCtgrId
                                    };
                    				UtilSvc.getList(param).then(function (res) {
                						e.success(res.data.results[0]);       
                					});
                    			},   		
                    			parameterMap: function(e, operation) {
                    				if(operation !== "read" && e.models) {
                    					return {models:kendo.stringify(e.models)};
                    				}
                    			}
                    		},
                    		change: function(e){
                    			var data = this.data();
                    			saleItemDataVO.dataTotal = data.length;
                    		},
                    		pageSize: 11,
                    		batch: true,
                    		schema: {
                    			model: {
                        			id: "CD_ITEM",
                    				fields: {						              //수수료 추가해야댐        
                    					ROW_CHK: 		   {	
    				                    						type: "boolean", 
    															editable: true,  
    															nullable: false
                										   },
									    NO_MRKREGITEM:	   {	
																type: "string", 
																editable: false,
																nullable: false
           											       },                										   
									    NO_MRKITEM:	       {	
																type: "string", 
																editable: false,
																nullable: false
           											       },
           								NO_MRK:	           {	
																type: "string", 
																editable: false,
																nullable: false
       											           },
    								    CD_SIGNITEM:	   {	
                    											type: "string", 
                    											editable: false,
                												nullable: false
            											   },                    					
            							NM_CTGR:	       {	
                    											type: "string", 
                    											editable: false, 
                    											nullable: false
                    									   },
                    					NM_ITEM: 	   	   {	
    															type: "string", 
    															editable: false,
    															nullable: false
                        						    	   },
                        				CD_ITEM: 	   	   {
    															type: "string", 
    															editable: false, 
    															nullable: false
    						    	    				   },
    						    	    AM_ITEMPRC: 	   {
    															type: "number", 
    															editable: false, 
    															nullable: false
    						    	    				   },
    						    	    QT_SALE: 	       {
    															type: "string", 
    															editable: false, 
    															nullable: false
    						    	    				   },
    						    	    DTS_INSERT: 	   {
    															type: "string", 
    															editable: false, 
    															nullable: false
    						    	    				   },
    						    	    DTS_SALESTART: 	   {
    															type: "string", 
    															editable: false, 
    															nullable: false
    						    	    				   },
    						    	    DTS_SALEEND: 	   {
    															type: "string", 
    															editable: false, 
    															nullable: false
    						    	    				   }
                    				}
                    			}
                    		},
                    	}),                    	
                    	navigatable: true, //키보드로 그리드 셀 이동 가능
                    	toolbar: [{template: kendo.template($.trim($("#sale-toolbar-template").html()))}],
                    	columns: [
                  	            {
  			                        field: "ROW_CHK",
  			                        title: "선택",					                        
  			                        width: "30px",
  			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
                  	            },
                  	            {	
                  	            	field: "NO_MRK",
  		                            title: "판매마켓",
  		                            width: "80px",
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },
  		                        {	
                  	            	field: "CD_SIGNITEM",
  		                            title: "상품코드",
  		                            width: "80px",
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },
  		                        {
  		                        	field: "NO_MRKITEM",	
  		                            title: "마켓상품번호",
  		                            width: 80,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },                        
  		                        {
  		                        	field: "NM_ITEM",	
  		                            title: "상품명/옵션",
  		                            width: 200,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },                         
  		                        {
  		                        	field: "CD_ITEM",	
  		                            title: "자체 상품번호",
  		                            width: 90,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },                 
  		                        {
  		                        	field: "NM_CTGR",	
  		                            title: "상품분류",
  		                            width: 100,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },                         
  		                        {
  		                        	field: "AM_ITEMPRC",	
  		                            title: "판매가",
  		                            width: 70,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },                          
  		                        {
  		                        	field: "",	
  		                            title: "수수료",
  		                            width: 60,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },    
  		                        {
  		                        	field: "QT_SALE",	
  		                            title: "재고수량",
  		                            width: 70,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },    
  		                        {
  		                        	field: "DTS_INSERT",	
  		                            title: "등록일시",
  		                            width: 100,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },    
  		                        {
  		                        	field: "DTS_SALESTART",	
  		                            title: "판매시작일시",
  		                            width: 100,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },
  		                        {
  		                        	field: "DTS_SALEEND",	
  		                            title: "판매종료일시",
  		                            width: 100,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        }
                      ],
                    	dataBound: function(e) {
                            this.expandRow(this.tbody.find("tr.k-master-row").first());// 마스터 테이블을 확장하므로 세부행을 볼 수 있음                                                  
                        },
                        /*selectable: "row",*/
                        collapse: function(e) {
                            this.cancelRow();
                        },         	
                    	editable: {
                    		mode: "popup",
                    		window : {
                    	        title: ""
                    	    },
                    		template: kendo.template($.trim($("#cs_popup_template").html())),
                    		confirmation: false
                    	},	
                    	resizable: true,
                    	rowTemplate: kendo.template($.trim($("#sale_template").html())),
                    	altRowTemplate: kendo.template($.trim($("#alt_sale_template").html())),
                    	height: 656      
                    	//모델과 그리드 셀을 제대로 연동 안시키면 수정 팝업 연 후 닫을 때 로우가 사라짐(즉 크레에이트인지 에딧인지 구분을 못함)
                    	//id는 유니크한 모델값으로 해야함 안그러면 cancel 시에 row grid가 중복 되는 현상이 발생
        		};
	            
	            saleItemDataVO.mngCmrkChange = function(){
	            	saleItemDataVO.mallMrkList = [];
	            	for(var i = 0; i < saleItemDataVO.cmrkList.length; i++){
	            		if(saleItemDataVO.cmrkList[i].NO_MNGMRK == saleItemDataVO.NO_MNGMRK){
	            			saleItemDataVO.NM_MRK = saleItemDataVO.cmrkList[i].NM_MNGMRK;
	            			saleItemDataVO.mallMrkList.push(saleItemDataVO.cmrkList[i]);
	            		}
	            	}
	            	if(saleItemDataVO.mallMrkList.length == 1)saleItemDataVO.param.NO_MRK = saleItemDataVO.mallMrkList[0].NO_MRK;
	            	saleItemDataVO.cmrkChange();
	            	saleItemDataVO.cmrkTkbkChange();
	            };
	            
	            saleItemDataVO.dropDownEditor = function(container, options, objDataSource, arrField) {
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
                
                saleItemDataVO.doQuiry();
                
            }]);
}());