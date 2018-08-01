(function () {
    "use strict";

    // [it] SaleItem
    var saleItemApp = angular.module("it.SaleItem", ["it.SaleItem.controller", "it.SaleItem.service"]);
    angular.module("it.SaleItem.controller", [] );
    angular.module("it.SaleItem.service", [] );

    saleItemApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.itSaleItem", {
            url		: "/02it/itSaleItem?:kind?menu&ids",
            views	: {
                contentView	: {
                	templateUrl	: function($stateParams){
                    	if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                    	return "app/contents/02it/it03SaleItem/templates/it.SaleItem"+ edt.getMenuFileName($stateParams.kind) +".tpl.html";
                    },
                    controllerProvider  : ["$stateParams",function($stateParams){
                    	if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                    	return "it.SaleItem"+ edt.getMenuFileName($stateParams.kind) +"Ctrl";                                  
                    }],
                    resolve		: {
                    	resData: ["AuthSvc", "$q", "sy.CodeSvc", "UtilSvc","$stateParams", function (AuthSvc, $q, SyCodeSvc, UtilSvc, $stateParams) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                var param = {
	                					procedureParam: "USP_IT_01ITEMCFCT02_GET&IT_ID_CTGR@s",
	                					IT_ID_CTGR: ""
                					},
                					fileParam = {
                                		procedureParam: "USP_IT_02BSSITEMFILE_GET&L_CD_ITEM@s|L_CD_AT_1@s|L_CD_AT_2@s",
                    					L_CD_ITEM: $stateParams.ids,
                    					L_CD_AT_1: "004",
                    					L_CD_AT_2: "006"
                                    },
                                    liogParam = {
                                		procedureParam: "USP_IT_02BSSITEMLIOG_GET"
                                	},
                                	paramMrkCd     = {procedureParam: "USP_SY_09MRK01_GET"},
                                	paramCmrk      = {procedureParam: "USP_SY_09MRK03_GET"},
                                	paramCoo       = {procedureParam: "USP_IT_02BSSITEMCOO01_GET&L_CD_COO@s",L_CD_COO:""},
                                	paramCtfc      = {procedureParam: "USP_IT_02BSSITEMCTFCINFOM_GET&L_MNG_AUCT@s|L_MNG_GMRK@s|L_MNG_STORF@s|L_MNG_ST@s|L_MNG_COOP@s",L_MNG_AUCT:"SYMM170101_00003",L_MNG_GMRK:"SYMM170101_00001",L_MNG_STORF:"SYMM170101_00002",L_MNG_ST:"SYMM170101_00005",L_MNG_COOP:"SYMM170901_00001"};
                                $q.all([
                                    SyCodeSvc.getSubcodeList({cd: "SY_000007", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "SY_000006", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000005", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000002", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    UtilSvc.getList(param).then(function (res) {
            	    					return res.data.results[0];
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000009", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "SY_000027", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "SY_000028", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "SA_000003", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "SA_000006", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000012", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000013", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000007", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000011", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000016", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000017", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    UtilSvc.getList(liogParam).then(function (res) {
            	    					return res.data.results[0];
                                    }),
                                    UtilSvc.getList(fileParam).then(function (res) {
            	    					return res.data.results;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000018", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    UtilSvc.getList(paramMrkCd).then(function (res) {
            	    					return res.data.results;
                                    }),
                                    UtilSvc.getList(paramCmrk).then(function (res) {
            	    					return res.data.results;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000019", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    UtilSvc.getList(paramCoo).then(function (res) {
            	    					return res.data.results;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000020", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000021", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000022", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000023", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000024", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    UtilSvc.getList(paramCtfc).then(function (res) {
            	    					return res.data.results;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000025", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000026", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000027", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000028", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000029", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000030", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000031", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000032", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000033", search: "all"}).then(function (result) {
                                        return result.data;
                                    }),
                                    SyCodeSvc.getSubcodeList({cd: "IT_000034", search: "all"}).then(function (result) {
                                        return result.data;
                                    })
                                ]).then(function (result) {
                                    resData.taxCodeList   = result[0];
                                    resData.iClftCodeList = result[1];
                                    resData.iKindCodeList = result[2];
                                    resData.iStatCodeList = result[3];
                                    resData.adulYnList    = [{CD_DEF: "Y",NM_DEF: "인증"},{CD_DEF: "N",NM_DEF: "비인증"}];
                                    resData.itCtgrList    = result[4];
                                    resData.pcsCodeList   = result[5];
                                    resData.conCodeList   = result[6];
                                    resData.wetCodeList   = result[7];
                                    resData.dmstCodeList  = result[8];
                                    resData.shptpCodeList = result[9];
                                    resData.ctfCodeList   = result[10];
                                    resData.ctfInCodeList = result[11];
                                    resData.optTypeCodeList = result[12];
                                    resData.optClftCodeList = result[13];
                                    resData.addSortList   = result[14];
                                    resData.addSaleStatList = result[15];
                                    resData.liogList      = result[16];
                                    resData.shpwayList    = result[18];
                                    resData.MrkCodeList   = result[19][0];
                                    resData.CmrkCodeList  = result[20][0];
                                    resData.postCodeList  = result[21];
                                    resData.CooCodeList   = result[22][0];
                                    resData.CooKindList   = result[23];
                                    resData.prcShpList    = result[24];
                                    resData.shpTplList    = result[25];
                                    resData.shpAWayList   = result[26];
                                    resData.exchAClftList = result[27];
                                    resData.auctCtfcList  = result[28][0];
                                    resData.gmrkCtfcList  = result[28][1];
                                    resData.storfCtfcList = result[28][2];
                                    resData.stCtfcList    = result[28][3];
                                    resData.coopCtfcList  = result[28][4];
                                    resData.exchGClftList = result[29];
                                    resData.shpSWayList   = result[30];
                                    resData.shpprcList    = result[31];
                                    resData.sectCntYnList = result[32];
                                    resData.servItemList  = result[33];
                                    resData.shpSTWayList  = result[34];
                                    resData.shpCWayList   = result[35];
                                    resData.shpprcCList   = result[36];
                                    resData.shpprSTList   = result[37];
                                    resData.shpGuiList    = result[38];
                                    
                                	if($stateParams.kind == "detail"){
            	    					resData.fileMainVOcurrentData = result[17][0][0];
            	        				resData.fileDImageVOcurrentDataList = result[17][1];
            	        				defer.resolve( resData );
                                    }
                                	else {
                                		UtilSvc.grid.getInquiryParam().then(function (res) {
                                			var history = res.data;
                                			
                                			if(history){
                    		            		resData.signItemValue = history.CD_SIGNITEM;	
                    		            		resData.nmItemValue   = history.NM_ITEM;
                    		            		resData.nmMnfrValue   = history.NM_MNFR;
                    		            		resData.adulYnIds     = history.YN_ADULCTFC;
                    		            		resData.taxClftIds    = history.CD_TAXCLFT;
                    		            		resData.iClftIds      = history.CD_ITEMCLFT;
                    		            		resData.iKindIds      = history.CD_ITEMKIND;
                    		            		resData.adulYnList.setSelectNames    = history.YN_ADULCTFC_SELECT_INDEX;
                    		            		resData.taxCodeList.setSelectNames   = history.CD_TAXCLFT_SELECT_INDEX;
                    		            		resData.iClftCodeList.setSelectNames = history.CD_ITEMCLFT_SELECT_INDEX;
                    		            		resData.iKindCodeList.setSelectNames = history.CD_ITEMKIND_SELECT_INDEX;
                    		            		resData.selectedDateOption = history.DATEOPT;
                    		            		resData.selectDate    = UtilSvc.grid.getSelectDate(history.PERIOD);
                    		            	}
                                			else {
                    		            		resData.signItemValue = "";	
                    		            		resData.nmItemValue   = "";
                    		            		resData.nmMnfrValue   = "";
                    		            		resData.adulYnIds     = "*";
                    		            		resData.taxClftIds    = "*";
                    		            		resData.iClftIds      = "*";
                    		            		resData.iKindIds      = "*";
                    		            		resData.selectedDateOption = "001";
                    		            		resData.start = angular.copy(edt.getToday());
                    		            		resData.end   = angular.copy(edt.getToday());    
    	    				            		resData.selectDate      = {
    	    				            			start : angular.copy(edt.getToday()),
    	    				            			end   : angular.copy(edt.getToday()),
    	    				            			selected : 'current'
    	    				            		};
                                			}
                                			
                	        				defer.resolve( resData );
                                		})
                                	}
                                });
                            });

                            return defer.promise;
                        }]
                    }
                }
            }
        });
    }]);
}());
