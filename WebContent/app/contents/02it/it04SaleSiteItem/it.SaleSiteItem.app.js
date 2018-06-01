(function () {
    "use strict";

    // [it] SaleSiteItem
    var saleSiteItemApp = angular.module("it.SaleSiteItem", ["it.SaleSiteItem.controller", "it.SaleSiteItem.service"]);
    angular.module("it.SaleSiteItem.controller", [] );
    angular.module("it.SaleSiteItem.service", [] );

    saleSiteItemApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.itSaleSiteItem", {
            url		: "/02it/itSaleSiteItem/:kind?menu&ids",
            views	: {
                contentView	: {
                    templateUrl	: function($stateParams){
                    	if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                    	return "app/contents/02it/it04SaleSiteItem/templates/it.SaleSiteItem"+ edt.getMenuFileName($stateParams.kind) +".tpl.html";
                    },
                    controllerProvider  : ["$stateParams",function($stateParams){
                    	if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                    	return "it.SaleSiteItem"+ edt.getMenuFileName($stateParams.kind) +"Ctrl";                                  
                    }],
                    resolve		: {
                        resData: ["AuthSvc", "$q", "sy.CodeSvc", "UtilSvc", function (AuthSvc, $q, SyCodeSvc, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {},
                                today   = edt.getToday();

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                var param          = {procedureParam: "USP_IT_01ITEMCFCT01_GET"},
                					cmrkParam      = {procedureParam: "USP_IT_03SALEITEM_CMRK_GET"},
                                	mngCmrkParam   = {procedureParam: "USP_SY_09MRK01_GET"},
                                    paramCmrk      = {procedureParam: "USP_SY_09MRK03_GET"},
                                    paramCtfc      = {procedureParam: "USP_IT_02BSSITEMCTFCINFOM_GET&L_MNG_AUCT@s|L_MNG_GMRK@s|L_MNG_STORF@s|L_MNG_ST@s|L_MNG_COOP@s",L_MNG_AUCT:"SYMM170101_00003",L_MNG_GMRK:"SYMM170101_00001",L_MNG_STORF:"SYMM170101_00002",L_MNG_ST:"SYMM170101_00005",L_MNG_COOP:"SYMM170901_00001"};
                                $q.all([
                                        SyCodeSvc.getSubcodeList({cd: "SY_000007", search: "all"}).then(function (result) {
                                            return result.data;
                                        }),
                                        SyCodeSvc.getSubcodeList({cd: "IT_000002", search: "all"}).then(function (result) {
                                            return result.data;
                                        }),
                                        UtilSvc.getList(param).then(function (res) {
                	    					return res.data.results[0];
                                        }),
                                        UtilSvc.getList(cmrkParam).then(function (res) {
                	    					return res.data.results[0];
                                        }),
                                        UtilSvc.getList(mngCmrkParam).then(function (res) {
                	    					return res.data.results[0];
                                        }),
                                        UtilSvc.getList(paramCmrk).then(function (res) {
                	    					return res.data.results[0];
                                        }),
                                        SyCodeSvc.getSubcodeList({cd: "IT_000018", search: "all"}).then(function (result) {
                                            return result.data;
                                        }),
                                        SyCodeSvc.getSubcodeList({cd: "IT_000019", search: "all"}).then(function (result) {
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
                                        resData.iStatCodeList = result[1];
                                        resData.itCtgrList    = result[2];
                                        //resData.cmrkList      = result[3];
                                        
                                        resData.mngMrkList     = result[4];
                                        resData.cmrkList       = result[5];
                                        resData.auctShpWayList = result[6];
                                        resData.postCodeList   = result[7];
                                        resData.prcShpList     = result[8];
                                        resData.shpTplList     = result[9];
                                        resData.shpAWayList    = result[10];
                                        resData.exchAClftList  = result[11];
                                        resData.auctCtfcList   = result[12][0];
                                        resData.gmrkCtfcList   = result[12][1];
                                        resData.storfCtfcList  = result[12][2];
                                        resData.stCtfcList     = result[12][3];
                                        resData.coopCtfcList   = result[12][4];
                                        resData.exchGClftList  = result[13];
                                        resData.shpSWayList    = result[14];
                                        resData.shpprcList     = result[15];
                                        resData.sectCntYnList  = result[16];
                                        resData.servItemList   = result[17];
                                        resData.shpSTWayList   = result[18];
                                        resData.shpCWayList    = result[19];
                                        resData.shpprcCList    = result[20];
                                        resData.shpprSTList    = result[21];
                                        resData.shpGuiList     = result[22];
                                        
                                        defer.resolve( resData );
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
