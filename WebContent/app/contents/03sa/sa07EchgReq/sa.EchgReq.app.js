(function () {
    "use strict";

    // [sa] EchgReq
    var echgReqApp = angular.module("sa.EchgReq", ["sa.EchgReq.controller", "sa.EchgReq.service"]);
    angular.module("sa.EchgReq.controller", []);
    angular.module("sa.EchgReq.service", []);

    echgReqApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.saEchgReq", {
            url		: "/03sa/saEchgReq?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/03sa/sa07EchgReq/templates/sa.EchgReq.tpl.html",
                    controller  : "sa.EchgReqCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "Util03saSvc", function (AuthSvc, $q, Util03saSvc) {
                            var defer 	= $q.defer(),
	                            resData = {},
	                            storageKey = "echgDataVO";
	
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
