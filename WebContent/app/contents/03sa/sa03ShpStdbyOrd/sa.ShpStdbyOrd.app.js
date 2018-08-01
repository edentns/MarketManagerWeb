(function () {
    "use strict";

    // [sa] ShpStdbyOrd
    var shpStdbyOrdApp = angular.module("sa.ShpStdbyOrd", ["sa.ShpStdbyOrd.controller", "sa.ShpStdbyOrd.service"]);
    angular.module("sa.ShpStdbyOrd.controller", [] );
    angular.module("sa.ShpStdbyOrd.service", [] );

    shpStdbyOrdApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.saShpStdbyOrd", {
            url		: "/03sa/saShpStdbyOrd/:kind?menu&noOrd&noMrkord&noMrk",
            views	: {
                contentView	: {
                    templateUrl	: function($stateParams){
                    	return "app/contents/03sa/sa03ShpStdbyOrd/templates/sa.ShpStdbyOrd.tpl.html";                    	
                    },
                    controllerProvider  : ["$stateParams",function($stateParams){                    
                    	return "sa.ShpStdbyOrdCtrl";                                  
                    }],
                    resolve		: {
                        resData: ["AuthSvc", "$q", "Util03saSvc", function (AuthSvc, $q, Util03saSvc) {
                            var defer 	= $q.defer(),
                                resData = {},
                                storageKey = "shpStdbyOrdParam";

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
