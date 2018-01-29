(function () {
    "use strict";

    // [sa] ShpIng
    var shpIngApp = angular.module("sa.ShpIng", ["sa.ShpIng.controller", "sa.ShpIng.service"]);
    angular.module("sa.ShpIng.controller", [] );
    angular.module("sa.ShpIng.service", [] );

    shpIngApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.saShpIng", {
            url		: "/03sa/saShpIng?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/03sa/sa05ShpIng/templates/sa.ShpIng.tpl.html",
                    controller  : "sa.ShpIngCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "Util03saSvc", function (AuthSvc, $q, Util03saSvc) {
                            var defer 	= $q.defer(),
	                            resData = {},
	                            storageKey = "shippingParam";
	
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
