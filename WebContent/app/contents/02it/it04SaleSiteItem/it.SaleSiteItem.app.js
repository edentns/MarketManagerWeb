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
	                					procedureParam: "USP_IT_01ITEMCFCT01_GET"
                					},
                					cmrkParam = {
                                		procedureParam: "USP_IT_03SALEITEM_CMRK_GET"
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
                                        }),
                                        UtilSvc.grid.getInquiryParam().then(function (res) {
                                        	return res.data;
                                        })
                                    ]).then(function (result) {
                                        resData.taxCodeList   = result[0];
                                        resData.iStatCodeList = result[1];
                                        resData.itCtgrList    = result[2];
                                        resData.cmrkList      = result[3];
                                        
                                        var history = result[4];

                                        if(history){
                                        	resData.signItemValue = history.CD_SIGNITEM;
                                        	resData.nmItemValue   = history.NM_ITEM;
                                        	resData.cmrkIds       = history.NO_MRK;
                                        	resData.cmrkList.setSelectNames  = history.NO_MRK_SELECT_INDEX;
                                        	resData.iStatIds                 = history.CD_ITEMSTAT;
                                        	resData.iStatList.setSelectNames = history.CD_ITEMSTAT_SELECT_INDEX;
                                        	resData.CD_ITEMCTGR1 = history.CD_ITEMCTGR1;
                                        	resData.NM_ITEMCTGR1 = history.NM_ITEMCTGR1;
                                        	resData.CD_ITEMCTGR2 = history.CD_ITEMCTGR2;
                                        	resData.NM_ITEMCTGR2 = history.NM_ITEMCTGR2;
                                        	resData.CD_ITEMCTGR3 = history.CD_ITEMCTGR3;
                                        	resData.NM_ITEMCTGR3 = history.NM_ITEMCTGR3;
                                        	resData.start                = history.DATE_FROM;
                                        	resData.end                  = history.DATE_TO;
        				            		resData.selected             = 'range';
                		            	}
                                        else {
                                        	resData.signItemValue = "";
                                        	resData.nmItemValue   = "";
                                        	resData.cmrkIds       = "*";
                                        	resData.iStatIds      = "*";
                                        	resData.CD_ITEMCTGR1  = "";
                                        	resData.start = angular.copy(edt.getToday());
                                        	resData.end   = angular.copy(edt.getToday());
        				            		resData.selected      = 'current';
                                        }
                                        
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
