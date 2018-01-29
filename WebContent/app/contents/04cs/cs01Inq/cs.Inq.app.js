(function () {
    "use strict";

    // [cs] Inq
    var inqApp = angular.module("cs.Inq", ["cs.Inq.controller", "cs.Inq.service"]);
    angular.module("cs.Inq.controller", [] );
    angular.module("cs.Inq.service", [] );

    inqApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.csInq", {
            url		: "/04cs/csInq?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/04cs/cs01Inq/templates/cs.Inq.tpl.html",
                    controller  : "cs.InqCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "Util03saSvc", function (AuthSvc, $q, Util03saSvc) {
                            var defer 	= $q.defer(),
	                            resData = {},
	                            storageKey = "csDataVO";
	
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
