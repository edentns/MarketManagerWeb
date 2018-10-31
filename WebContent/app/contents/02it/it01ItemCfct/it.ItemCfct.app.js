(function () {
    "use strict";

    // [it] ItemCfct
    var itemCfctApp = angular.module("it.ItemCfct", ["it.ItemCfct.controller", "it.ItemCfct.service"]);
    angular.module("it.ItemCfct.controller", [] );
    angular.module("it.ItemCfct.service", [] );

    itemCfctApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.itItemCfct", {
            url		: "/02it/itItemCfct?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/02it/it01ItemCfct/templates/it.ItemCfct.tpl.html",
                    controller  : "it.ItemCfctCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "UtilSvc",function (AuthSvc, $q, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
        		    			var mngMrkParam = {
                                		procedureParam: "USP_IT_01ITEMCFCT_MNGMRK_GET"
                                	}
                                $q.all([
										UtilSvc.getList(mngMrkParam).then(function (res) {
											return res.data.results[0];
										})
                                    ]).then(function (result) {
                                        resData.mngMrkList    = result[0];
                                        
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
