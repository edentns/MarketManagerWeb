(function () {
    "use strict";

    // [it] SaleSiteItem
    var saleSiteItemApp = angular.module("it.SaleSiteItem", ["it.SaleSiteItem.controller", "it.SaleSiteItem.service"]);
    angular.module("it.SaleSiteItem.controller", [] );
    angular.module("it.SaleSiteItem.service", [] );

    saleSiteItemApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.itSaleSiteItem", {
            url		: "/02it/itSaleSiteItem?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/02it/it04SaleSiteItem/templates/it.SaleSiteItem.tpl.html",
                    controller  : "it.SaleSiteItemCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "sy.CodeSvc", "UtilSvc", function (AuthSvc, $q, SyCodeSvc, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                var param = {
	                					procedureParam: "MarketManager.USP_IT_01ITEMCFCT01_GET"
                					},
                					cmrkParam = {
                                		procedureParam: "MarketManager.USP_IT_03SALEITEM_CMRK_GET"
                                	};
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
                                        })
                                    ]).then(function (result) {
                                        resData.taxCodeList   = result[0];
                                        resData.iStatCodeList = result[1];
                                        resData.itCtgrList    = result[2];
                                        resData.cmrkList      = result[3];
                    					
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
