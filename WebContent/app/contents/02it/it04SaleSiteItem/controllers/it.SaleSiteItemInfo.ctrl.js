(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name it.SaleSiteItem.controller : it.SaleSiteItemCtrl
     * 상품분류관리
     */
    angular.module("it.SaleSiteItem.controller")
        .controller("it.SaleSiteItemInfoCtrl", ["$scope", "$state", "$http","$stateParams", "$q", "$log", "it.SaleSiteItemSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc","it.BssItemSvc",
            function ($scope, $state, $http, $stateParams, $q, $log, itSaleSiteItemSvc, APP_CODE, $timeout, resData, Page, UtilSvc, itBssItemSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
                
	            var saleItemDataVO = $scope.saleItemDataVO = {
	            	auct : "옥션추가정보",
	            	gmrk : "지마켓추가정보",
	            	storf: "스토어팜추가정보",
	            	st   : "11번가추가정보",
	            	coop : "쿠팡추가정보",
	            	opt  : "옵션정보",
	        		NO_MNGMRK        : "",
	        		NO_MNGMRK_OLD    : "",
	        		NM_MRK           : "",
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
                    CD_SHPPRC        : "001",
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
	                optTypeList      : [],
	                YN_TIMSMAXPCHS   : "N",
	                YN_JJMNT         : "N",
	                firstFlag        : 1,
	                kind             : $stateParams.kind,
	                optDeleteList    : new Array(),
	                
	        		param            : {
	        			NO_MRK : "",
	        			CD_MRKREGITEM        : "",
	        			
	        			CD_OPTTP             : "",
	        			AM_ITEMPRC           : "",
	        			QT_SALE              : "",
        				CD_ITEM              : "",
        				DT_SALEEND           : "",
        				DT_SALESTART         : "",
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
		        		CTFCINFO      : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}]
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
                    saleItemDataVO.optTypeList    = resData.optTypeList;
                    
                    if(saleItemDataVO.kind == "detail"){
                    	saleItemDataVO.NM_MRK = resData.NM_MNGMRK;
                    	//값넣기
                    	saleItemDataVO.param.CD_ITEM         = resData.detailData.CD_ITEM;
                    	saleItemDataVO.param.CD_MRKREGITEM   = resData.detailData.CD_MRKREGITEM;
                    	saleItemDataVO.param.NO_MRK          = resData.detailData.NO_MRK;
                    	saleItemDataVO.param.AM_ITEMPRC      = resData.detailData.AM_ITEMPRC;
                    	saleItemDataVO.param.QT_SALE         = String(resData.detailData.QT_SSPL);
                    	saleItemDataVO.param.DT_SALESTART    = resData.detailData.DT_SALESTART;
                    	saleItemDataVO.param.DT_SALEEND      = resData.detailData.DT_SALEEND;
                    	saleItemDataVO.param.CD_OPTTP        = resData.detailData.CD_OPTTP;
                    	saleItemDataVO.param.YN_FECTSALE     = resData.detailData.YN_FECTSALE;
                    	saleItemDataVO.param.VAL_UNI         = resData.detailData.VAL_UNI;
                    	saleItemDataVO.param.PRC_UNI         = resData.detailData.PRC_UNI;
                		saleItemDataVO.param.YN_MAXPCHSAMOU  = resData.detailData.YN_MAXPCHSAMOU;
                		saleItemDataVO.param.AMOU_MAXPCHSLIM = resData.detailData.AMOU_MAXPCHSLIM;
                		saleItemDataVO.param.DAYS_PRDLIM     = resData.detailData.DAYS_PRDLIM;
                		saleItemDataVO.param.AMOU_PRDLIM     = resData.detailData.AMOU_PRDLIM;
                		saleItemDataVO.param.AMOU_MAXPCHSLIMCLS = resData.detailData.AMOU_MAXPCHSLIMCLS;
                		saleItemDataVO.param.HTML_AVTMTRI    = resData.detailData.HTML_AVTMTRI;
                		saleItemDataVO.param.CD_SHPPARS      = resData.detailData.CD_SHPPARS;
                		saleItemDataVO.param.AREA_QUISEV     = resData.detailData.AREA_QUISEV;
                		saleItemDataVO.param.NM_QUISEVCMPN   = resData.detailData.NM_QUISEVCMPN;
                		saleItemDataVO.param.NO_QUISEVPHNE   = resData.detailData.NO_QUISEVPHNE;
                		saleItemDataVO.param.CD_TKBKPARS     = resData.detailData.CD_TKBKPARS;
                		saleItemDataVO.param.PRC_ONESHP      = resData.detailData.PRC_ONESHP;
                		saleItemDataVO.param.CD_SHPPRC       = resData.detailData.CD_SHPPRC;
                		saleItemDataVO.param.CD_SHPPRCTPL    = resData.detailData.CD_SHPPRCTPL;
                		saleItemDataVO.param.PRC_SHP         = resData.detailData.PRC_SHP;
                		saleItemDataVO.param.CD_SHPIMPWAY    = resData.detailData.CD_SHPIMPWAY;
                		saleItemDataVO.param.PRC_STDSHP      = resData.detailData.PRC_STDSHP;
                		saleItemDataVO.param.CD_EXCHGDISCCLFT   = resData.detailData.CD_EXCHGDISCCLFT;
                    	//수정하는 화면으로 인한 disable 처리
                    	$timeout(function() {
                    		//현재 GMRK 만 처리
                    		angular.element("#YN_FECTSALE").attr("disabled", true);
                    		angular.element("#VAL_UNI").attr("disabled", true);
                    		angular.element("#PRC_UNI").attr("disabled", true);
                    		angular.element("#YN_MAXPCHSAMOU").attr("disabled", true);
                    		$($('#kEditGmrk').data().kendoEditor.body).attr('contenteditable', false);
                    		angular.element("#gmrkParsList").attr("disabled", true);
                    		angular.element("#selectShpAreaBtn").attr("disabled", true);
                    		angular.element("#deleteShpAreaBtn").attr("disabled", true);
                    		angular.element("#NM_QUISEVCMPN").attr("disabled", true);
                    		angular.element("#NO_QUISEVPHNE").attr("disabled", true);
                    		angular.element("#gmrkTkbkParsList").attr("disabled", true);
                    		angular.element("#shpAWayList").attr("disabled", true);
                    	},500);
                    }
	            };
	            
	            // 저장
	            saleItemDataVO.goSave = function(){
	            	var SU = saleItemDataVO.kind == "detail" ? "U" : "I";
                    saleItemDataVO.param.CD_ITEM  = resData.CD_ITEM;
	            	if(SU == "I"){
		            	if (confirm("저장하시겠습니까?")) {
		            		var optData = [];
		            		if(saleItemDataVO.param.CD_OPTTP != '001')optData = $("#gridOpt"+saleItemDataVO.param.CD_OPTTP).data("kendoGrid").dataSource._data;
		            		var itemData = saleItemDataVO.param;
		            		if(saleItemDataVO.NM_MRK == "스토어팜"){if($("#gridCtfcStorf").data("kendoGrid").dataSource._data.length!=0){itemData.CTCFINFO = saleItemDataVO.ctfcParamSort($("#gridCtfcStorf").data("kendoGrid")._data)}};
		            		if(saleItemDataVO.NM_MRK == "11번가"){if($("#gridCtfcSt").data("kendoGrid").dataSource._data.length!=0){itemData.CTCFINFO = saleItemDataVO.ctfcParamSort($("#gridCtfcSt").data("kendoGrid")._data)}};
		            		if(saleItemDataVO.NM_MRK == "쿠팡"){if($("#gridCtfcCoop").data("kendoGrid").dataSource._data.length!=0){itemData.CTCFINFO = saleItemDataVO.ctfcParamSort($("#gridCtfcCoop").data("kendoGrid")._data)}};
		            		var param = {
		            				SALESITEITEM : itemData,
		            				OPT : optData };
		            		itSaleSiteItemSvc.saveItem(param, SU).success(function () {
	                        	alert("판매SITE별상품 등록이 완료되었습니다.");
	                        	saleItemDataVO.goBack();
	                        });
		                }
	            	}else{
	            		if (confirm("수정하시겠습니까?")) {
	            			var optData = [];
		            		if(saleItemDataVO.param.CD_OPTTP != '001')optData = $("#gridOpt"+saleItemDataVO.param.CD_OPTTP).data("kendoGrid").dataSource._data;
		            		if(saleItemDataVO.optDeleteList.length != 0)optData = optData.concat(saleItemDataVO.optDeleteList);
		            		var itemData = saleItemDataVO.param;
		            		var param = {
		            				SALESITEITEM : itemData,
		            				OPT : optData };
		            		itSaleSiteItemSvc.saveItem(param, SU).success(function () {
		            			alert("기본상품 수정이 완료되었습니다.");
	                        	saleItemDataVO.goBack();
	                        });
		                }
	            	}
	            };
	            
	            // 초기 인증정보 5개몰에 각각 넣어줌
	            saleItemDataVO.ctfcDataSplit = function(ctfcData){
	            	//옥션
	            	for(var i = 0 ; i < ctfcData[0].length; i++){
	            		var tempList = [];
                    	tempList = ctfcData[0][i].NM_CTFCINFO.split(" ");
                    	if(tempList[0]=="어린이제품")saleItemDataVO.param.CTFCINFO[0].CD_CTFCINFO = ctfcData[0][i].CD_CTFCINFO;
                    	if(tempList[0]=="생활용품")saleItemDataVO.param.CTFCINFO[1].CD_CTFCINFO = ctfcData[0][i].CD_CTFCINFO;
                    	if(tempList[0]=="전기용품")saleItemDataVO.param.CTFCINFO[2].CD_CTFCINFO = ctfcData[0][i].CD_CTFCINFO;
	            	}
	            	//지마켓
	            	for(var i = 0 ; i < ctfcData[1].length; i++){
	            		var tempList = [];
                    	tempList = ctfcData[1][i].NM_CTFCINFO.split(" ");
                    	if(tempList[0]=="어린이제품")saleItemDataVO.param.CTFCINFO[0].CD_CTFCINFO = ctfcData[1][i].CD_CTFCINFO;
                    	if(tempList[0]=="생활용품")saleItemDataVO.param.CTFCINFO[1].CD_CTFCINFO = ctfcData[1][i].CD_CTFCINFO;
                    	if(tempList[0]=="전기용품")saleItemDataVO.param.CTFCINFO[2].CD_CTFCINFO = ctfcData[1][i].CD_CTFCINFO;
	            	}
	            };
	            
	            saleItemDataVO.mngCmrkChange = function(){
	            	if(saleItemDataVO.firstFlag != 1){
	            		if(!saleItemDataVO.setData()){
	            			saleItemDataVO.NO_MNGMRK = saleItemDataVO.NO_MNGMRK_OLD;
	            			return;
	            		}else{
	            			saleItemDataVO.NO_MNGMRK_OLD = saleItemDataVO.NO_MNGMRK;
	            		}
	            	}
	            	else{
	            		saleItemDataVO.firstFlag++;
	            		saleItemDataVO.NO_MNGMRK_OLD = saleItemDataVO.NO_MNGMRK;
	            		
	            		saleItemDataVO.mallMrkList = [];
		            	for(var i = 0; i < saleItemDataVO.cmrkList.length; i++){
		            		if(saleItemDataVO.cmrkList[i].NO_MNGMRK == saleItemDataVO.NO_MNGMRK){
		            			saleItemDataVO.NM_MRK = saleItemDataVO.cmrkList[i].NM_MNGMRK;
		            			saleItemDataVO.mallMrkList.push(saleItemDataVO.cmrkList[i]);
		            		}
		            	}
		            	if(saleItemDataVO.NM_MRK == "옥션") saleItemDataVO.dataSetting(resData.auctData[0]);
            			if(saleItemDataVO.NM_MRK == "지마켓") saleItemDataVO.dataSetting(resData.gmrkData[0]);
            			if(saleItemDataVO.NM_MRK == "스토어팜") saleItemDataVO.dataSetting(resData.storfData[0]);
            			if(saleItemDataVO.NM_MRK == "11번가") saleItemDataVO.dataSetting(resData.stData[0]);
            			if(saleItemDataVO.NM_MRK == "쿠팡") saleItemDataVO.dataSetting(resData.coopData[0]);
            			
            			if(saleItemDataVO.mallMrkList.length == 1)saleItemDataVO.param.NO_MRK = saleItemDataVO.mallMrkList[0].NO_MRK;
	            		saleItemDataVO.cmrkParsChange();
		            	saleItemDataVO.cmrkTkbkChange();
	            	}
	            };
	            
	            saleItemDataVO.setData = function(){
	            	if(confirm('오픈마켓 변경시 데이터가 초기화 됩니다.\n진행 하시겠습니까?')){
	            		saleItemDataVO.dataClear();
	            		saleItemDataVO.mallMrkList = [];
		            	for(var i = 0; i < saleItemDataVO.cmrkList.length; i++){
		            		if(saleItemDataVO.cmrkList[i].NO_MNGMRK == saleItemDataVO.NO_MNGMRK){
		            			saleItemDataVO.NM_MRK = saleItemDataVO.cmrkList[i].NM_MNGMRK;
		            			saleItemDataVO.mallMrkList.push(saleItemDataVO.cmrkList[i]);
		            		}
		            	}
		            	if(saleItemDataVO.mallMrkList.length == 1)saleItemDataVO.param.NO_MRK = saleItemDataVO.mallMrkList[0].NO_MRK;
		            	
		            	if(saleItemDataVO.NM_MRK == "옥션") saleItemDataVO.dataSetting(resData.auctData[0]);
            			if(saleItemDataVO.NM_MRK == "지마켓") saleItemDataVO.dataSetting(resData.gmrkData[0]);
            			if(saleItemDataVO.NM_MRK == "스토어팜") saleItemDataVO.dataSetting(resData.storfData[0]);
            			if(saleItemDataVO.NM_MRK == "11번가") saleItemDataVO.dataSetting(resData.stData[0]);
            			if(saleItemDataVO.NM_MRK == "쿠팡") saleItemDataVO.dataSetting(resData.coopData[0]);
            			
    	            	/*바꿔서 넣어야 하는 컬럼명
    	            	AMOU_TIMSLIM       = AMOU_MAXPCHSLIMCLS
    	            	AMOU_TIMSMAXPCHS   = AMOU_MAXPCHSLIMCLS
    	            	AMOU_PESMAXPCHS    = AMOU_MAXPCHSLIMPER
    	            	PRC_TKBKECHGONESHP = PRC_ONESHP
    	            	PRC_TKBKSHP        = PRC_ONESHP
    	            	PRC_ECHGSHP        = PRC_RTIPSHP
    	            	DAYS_PESMAXPCHSAMOU = DAYS_PRDLIM
    	            	*/
                        
	            		saleItemDataVO.cmrkParsChange();
		            	saleItemDataVO.cmrkTkbkChange();
        				return true;
        			}else{
        				return false;
        			}
	            };
	            
	            // 칼럼명을 데이터에 맞춰서 return
	            saleItemDataVO.dataSetting = function(data){
	            	var resultData = {
	            			AM_ITEMPRC           : data.AM_ITEMPRC,
		        			QT_SALE              : data.QT_SALE,
	        				DTS_SALEEND          : data.DTS_SALEEND,
	        				DTS_SALESTART        : data.DTS_SALESTART,
	        				NO_MRKITEM           : data.NO_MRKITEM,
	        				NM_MRKCLFT           : data.NM_MRKCLFT,
	        				CD_REGSTAT           : data.CD_REGSTAT,
	        				VAL_UNI              : data.VAL_UNI,
	        				PRC_UNI              : data.PRC_UNI,
	        				DT_SHPSTART          : data.DT_SHPSTART,
	        				YN_MAXPCHSAMOU       : data.YN_MAXPCHSAMOU,
	        				AMOU_MAXPCHSLIM      : data.AMOU_MAXPCHSLIM,
	        				DAYS_PRDLIM          : data.DAYS_PRDLIM,
	        				AMOU_PRDLIM          : data.AMOU_PRDLIM,
	        				AMOU_MAXPCHSLIMCLS   : data.AMOU_MAXPCHSLIMCLS,
	        				AMOU_MAXPCHSLIMPER   : data.AMOU_MAXPCHSLIMPER,
	        				HTML_AVTMTRI         : data.HTML_AVTMTRI,
	        				CD_SHPWAY            : data.CD_SHPWAY,
	        				CD_SHPPARS           : data.CD_SHPPARS,
	        				CD_TKBKPARS          : data.CD_TKBKPARS,
	        				CD_POST              : data.CD_POST,
	        				PRC_POST             : data.PRC_POST,
	        				AREA_QUISEV          : data.AREA_QUISEV,
	        				NM_QUISEVCMPN        : data.NM_QUISEVCMPN,
	        				NO_QUISEVPHNE        : data.NO_QUISEVPHNE,
	        				PRC_ONESHP           : data.PRC_ONESHP,
	        				PRC_RTIPSHP          : data.PRC_RTIPSHP,
	        				YN_BDLSHP            : data.YN_BDLSHP,
	        				CD_SHPPRC            : data.CD_SHPPRC,
	        				CD_ERLSHPPRCFREIMPWAY: data.CD_ERLSHPPRCFREIMPWAY,
	        				PRC_SHP1             : data.PRC_SHP,
	        				PRC_SHP2             : data.PRC_SHP,
	        				PRC_STDSHP           : data.PRC_STDSHP,
	        				CD_SHPIMPWAY         : data.CD_SHPIMPWAY,
	        				PRC_AREACLSFSHP      : data.PRC_AREACLSFSHP,
	        				PRC_ADDINST          : data.PRC_ADDINST,
	        				GUI_TKBKECHG         : data.GUI_TKBKECHG,
	        				YN_FECTSALE          : data.YN_FECTSALE,
	        				AMOU_MINPCHS         : data.AMOU_MINPCHS,
	        				CD_MD                : data.CD_MD,
	        				CD_SERVITEM          : data.CD_SERVITEM,
	        				YN_QUIK              : data.YN_QUIK,
	        				YN_VISRECE           : data.YN_VISRECE,
	        				YN_TKBKSHPPRCCOD     : data.YN_TKBKSHPPRCCOD,
	        				DAYS_DELITAK         : data.DAYS_DELITAK,
	        				YN_BCD               : data.YN_BCD,
	        				DC_BCD               : data.DC_BCD,
	        				RSN_BCDNO            : data.RSN_BCDNO,
	        				YN_PRLICOM           : data.YN_PRLICOM,
	        				YN_FECTPCHSAGNCY     : data.YN_FECTPCHSAGNCY,
	        				YN_INDVCTCAMAKNECE   : data.YN_INDVCTCAMAKNECE,
	        				YN_MNTSHP            : data.YN_MNTSHP,
	        				NM_MNFR              : data.NM_MNFR,
	        				YN_RSVSALE           : data.YN_RSVSALE,
	        				CD_SHPPRCTPL         : data.CD_SHPPRCTPL,
	        				CD_EXCHGDISCCLFT     : data.CD_EXCHGDISCCLFT,
	        				CD_AMOUSECTCLFT      : data.CD_AMOUSECTCLFT,
	        				CD_SECTCNTYN         : data.CD_SECTCNTYN,
	        				YN_SPRINSTPRC        : data.YN_SPRINSTPRC,
	        				CD_SHPPRCADDGUI      : data.CD_SHPPRCADDGUI,
	        				PRC_MNTADDSHP        : data.PRC_MNTADDSHP,
	        				PRC_JJADDSHP         : data.PRC_JJADDSHP,
	        				PRC_FIRTTIMSTKBKSHP  : data.PRC_FIRTTIMSTKBKSHP,
	        				DC_PUREWD            : data.DC_PUREWD,
	        				CD_OPTTP             : data.CD_OPTTP,
	        				COND_CNT      : [{VAL : '', YN: 'Y'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'Y'}],
			        		COND_SHPPRC   : [{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''}],
			        		CTFCINFO      : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}]
	            	}
	            	saleItemDataVO.param = resultData;
            		if(data.AMOU_TIMSLIM != "" && data.AMOU_TIMSLIM != "undefined") saleItemDataVO.param.AMOU_MAXPCHSLIMCLS = data.AMOU_TIMSLIM;
            		if(data.AMOU_TIMSMAXPCHS != "" && data.AMOU_TIMSMAXPCHS != "undefined") saleItemDataVO.param.AMOU_MAXPCHSLIMCLS = data.AMOU_TIMSMAXPCHS;
            		if(data.AMOU_PESMAXPCHS != "" && data.AMOU_PESMAXPCHS != "undefined") saleItemDataVO.param.AMOU_MAXPCHSLIMPER = data.AMOU_PESMAXPCHS;
            		if(data.PRC_TKBKECHGONESHP != "" && data.PRC_TKBKECHGONESHP != "undefined") saleItemDataVO.param.PRC_ONESHP = data.PRC_TKBKECHGONESHP;
            		if(data.PRC_TKBKSHP != "" && data.PRC_TKBKSHP != "undefined") saleItemDataVO.param.PRC_ONESHP = data.PRC_TKBKSHP;
            		if(data.PRC_ECHGSHP != "" && data.PRC_ECHGSHP != "undefined") saleItemDataVO.param.PRC_RTIPSHP = data.PRC_ECHGSHP;
            		if(data.DAYS_PESMAXPCHSAMOU != "" && data.DAYS_PESMAXPCHSAMOU != "undefined") saleItemDataVO.DAYS_PRDLIM = data.DAYS_PESMAXPCHSAMOU;
            		//운송비부담구분 - 수량별 값이 존재할때 값 할당
            		if(data.COND_CNT1 != "" && data.COND_CNT1 != "undefined"){
            			saleItemDataVO.param.COND_CNT[0].VAL = data.COND_CNT1;
            			saleItemDataVO.param.COND_SHPPRC[0].VAL = data.PRC_SHP;
            			saleItemDataVO.param.COND_SHPPRC[1].VAL = data.COND_SHPPRC1;
            			if(data.COND_CNT2 != "" && data.COND_CNT2 != "undefined"){
                			saleItemDataVO.param.COND_CNT[1].VAL = data.COND_CNT2;
                			saleItemDataVO.param.COND_CNT[1].YN  = "Y";
                			saleItemDataVO.param.COND_SHPPRC[2].VAL = data.COND_SHPPRC2;
                			if(data.COND_CNT3 != "" && data.COND_CNT3 != "undefined"){
                    			saleItemDataVO.param.COND_CNT[2].VAL = data.COND_CNT3;
                    			saleItemDataVO.param.COND_CNT[2].YN  = "Y";
                    			saleItemDataVO.param.COND_SHPPRC[3].VAL = data.COND_SHPPRC3;
                    			if(data.COND_CNT4 != "" && data.COND_CNT4 != "undefined"){
                        			saleItemDataVO.param.COND_CNT[3].VAL = data.COND_CNT4;
                        			saleItemDataVO.param.COND_CNT[3].YN  = "Y";
                        			saleItemDataVO.param.COND_CNT[4].VAL = data.COND_CNT4;
                        			saleItemDataVO.param.COND_SHPPRC[4].VAL = data.COND_SHPPRC4;
                        		}
                    		}
                		}
            		}
            		saleItemDataVO.ctfcDataSplit(resData.ctfcData);
	            };
	            
	            saleItemDataVO.dataClear = function(){
	            	var clearData = {
	            			AM_ITEMPRC           : "",
		        			QT_SALE              : "",
	        				CD_ITEM              : resData.CD_ITEM,
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
	        				CD_OPTTP             : "",
	        				COND_CNT      : [{VAL : '', YN: 'Y'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'N'},{VAL : '', YN: 'Y'}],
			        		COND_SHPPRC   : [{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''},{VAL : ''}],
			        		CTFCINFO      : [{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''},{CD_CTFCINFO : '', VAL_CTFCINFO: ''}]
	            	}
	            	saleItemDataVO.param = clearData;
	            };
	            
	            // 옵션 그리드 에서 취소버튼을 누르면 
	            saleItemDataVO.gridCancel = function(flag) {
	            	if(confirm("옵션정보를 되돌리시겠습니까?")){
						saleItemDataVO.optDeleteList = new Array();
						var grid = $("#gridOpt"+saleItemDataVO.param.CD_OPTTP).data("kendoGrid");
						grid.cancelChanges();
	            	}
				};
	            
	            // 사용자별 마켓눌렀을때 설정해놓은 택배사 가져오는 기능 (발송)
	            saleItemDataVO.cmrkParsChange = function(){
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
	            
	            var gWridOpt002VO = $scope.gridOpt002VO = {
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
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	                				e.success(resData.optDataList);
	                				if(!page.isWriteable()){
            							var grid = $("#gridOpt"+saleItemDataVO.param.CD_OPTTP).data("kendoGrid");
            	    					grid.setOptions({editable : false});   
            	    					grid.hideColumn(7);
            	    					$("#gridOpt"+saleItemDataVO.param.CD_OPTTP+" .k-grid-toolbar").hide();
            	    				}
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
	                    			id: "CD_MRKREGITEM",
	                				fields: {
	                					CD_MRKREGITEM:    {  },
	                					CD_MRKREGOPT:     {  },
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
	                		["create", { template: "<div ng-click='saleItemDataVO.gridCancel()' class='k-button k-button-icontext'><span class='k-icon k-i-cancel'></span>취소</div>"}],
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
				                            saleItemDataVO.optDeleteList.push(dataItem);
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
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	                				e.success(resData.optDataList);
	                				if(!page.isWriteable()){
            							var grid = $("#gridOpt"+saleItemDataVO.param.CD_OPTTP).data("kendoGrid");
            	    					grid.setOptions({editable : false});   
            	    					grid.hideColumn(7);
            	    					$("#gridOpt"+saleItemDataVO.param.CD_OPTTP+" .k-grid-toolbar").hide();
            	    				}
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
	                				id: "CD_MRKREGITEM",
	                				fields: {
	                					CD_MRKREGITEM:    {  },
	                					CD_MRKREGOPT:     {  },
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
	                		["create", { template: "<div ng-click='saleItemDataVO.gridCancel()' class='k-button k-button-icontext'><span class='k-icon k-i-cancel'></span>취소</div>"}],
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
				                            saleItemDataVO.optDeleteList.push(dataItem);
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
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	                				e.success(resData.optDataList);
	                				if(!page.isWriteable()){
            							var grid = $("#gridOpt"+saleItemDataVO.param.CD_OPTTP).data("kendoGrid");
            	    					grid.setOptions({editable : false});   
            	    					grid.hideColumn(7);
            	    					$("#gridOpt"+saleItemDataVO.param.CD_OPTTP+" .k-grid-toolbar").hide();
            	    				}
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
	                				id: "CD_MRKREGITEM",
	                				fields: {
	                					CD_MRKREGITEM:    {  },
	                					CD_MRKREGOPT:     {  },
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
	                		["create", { template: "<div ng-click='saleItemDataVO.gridCancel()' class='k-button k-button-icontext'><span class='k-icon k-i-cancel'></span>취소</div>"}],
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
				                            saleItemDataVO.optDeleteList.push(dataItem);
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
                
                saleItemDataVO.goBack = function() {
		        	$state.go('app.itSaleSiteItem', { kind: 'list', menu: null, ids: null });
		        };
                
                saleItemDataVO.doQuiry();
                
            }]);
}());