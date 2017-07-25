(function () {
    "use strict";

    // [it] BssItem
    var bssItemApp = angular.module("it.BssItem", ["it.BssItem.controller", "it.BssItem.service"]);
    angular.module("it.BssItem.controller", [] );
    angular.module("it.BssItem.service", [] );

    bssItemApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.itBssItem", {
            url		: "/02it/itBssItem/:kind?menu&ids",
            views	: {
                contentView	: {
                	templateUrl	: function($stateParams){
                    	if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                    	return "app/contents/02it/it02BssItem/templates/it.BssItem"+ edt.getMenuFileName($stateParams.kind) +".tpl.html";
                    },
                    controllerProvider  : ["$stateParams",function($stateParams){
                    	if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                    	return "it.BssItem"+ edt.getMenuFileName($stateParams.kind) +"Ctrl";                                  
                    }],
                    resolve		: {
                        resData: ["AuthSvc", "$q", "sy.CodeSvc", "UtilSvc", function (AuthSvc, $q, SyCodeSvc, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                var param = {
                					procedureParam: "MarketManager.USP_IT_01ITEMCFCT02_GET&IT_ID_CTGR@s",
                					IT_ID_CTGR: ""
                					};
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
