(function () {
    "use strict";

    // [sa] OrdCcl
    var ordCclApp = angular.module("sa.OrdCcl", ["sa.OrdCcl.controller", "sa.OrdCcl.service"]);
    angular.module("sa.OrdCcl.controller", [] );
    angular.module("sa.OrdCcl.service", [] );

    ordCclApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.saOrdCcl", {
            url		: "/03sa/saOrdCcl?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/03sa/sa04OrdCcl/templates/sa.OrdCcl.tpl.html",
                    controller  : "sa.OrdCclCtrl",
                    resolve		: {
	                        resData: ["AuthSvc", "$q", "Util03saSvc", function (AuthSvc, $q, Util03saSvc) {
	                        	var defer 	= $q.defer(),
	                            resData = {},
	                            storageKey = "ordCancelParam";
	
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
