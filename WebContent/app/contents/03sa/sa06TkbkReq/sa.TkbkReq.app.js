(function () {
    "use strict";

    // [sa] TkbkReq
    var tkbkReqApp = angular.module("sa.TkbkReq", ["sa.TkbkReq.controller", "sa.TkbkReq.service"]);
    angular.module("sa.TkbkReq.controller", [] );
    angular.module("sa.TkbkReq.service", [] );

    tkbkReqApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.saTkbkReq", {
            url		: "/03sa/saTkbkReq?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/03sa/sa06TkbkReq/templates/sa.TkbkReq.tpl.html",
                    controller  : "sa.TkbkReqCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "Util03saSvc", function (AuthSvc, $q, Util03saSvc) {
                            var defer 	= $q.defer(),
	                            resData = {},
	                            storageKey = "tkbkDataVO";
	
	                        AuthSvc.isAccess().then(function (result) {
	                            resData.access = result[0];
	
	                            Util03saSvc.storedDatesettingLoad(storageKey).then(function(res) {
	                            	resData.selected   = res.selected;
	                        		resData.storage    = res.storage;
	                        		resData.storageKey = storageKey;
	                        		
	                        		defer.resolve(resData);
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
