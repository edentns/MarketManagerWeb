(function () {
    "use strict";

    // [sa] Ord
    var ordApp = angular.module("sa.Ord", ["sa.Ord.controller", "sa.Ord.service"]);
    angular.module("sa.Ord.controller", [] );
    angular.module("sa.Ord.service", [] );

    ordApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.saOrd", {
            url		: "/03sa/saOrd/:kind?menu&rootMenu&noOrd&noMrkord",
            views	: {
                contentView	: {
                    templateUrl	: function($stateParams){
                    	if ($stateParams.menu) {
                            $stateParams.kind = "";
                        }else{
                        	$stateParams.kind = "Info";
                        }
                    	return "app/contents/03sa/sa02Ord/templates/sa.Ord"+ $stateParams.kind +".tpl.html";
                    },
                    controllerProvider  : ["$stateParams",function($stateParams){
                    	if ($stateParams.menu) {
                            $stateParams.kind = "";
                        }else{
                        	$stateParams.kind = "Info";
                        }
                    	return "sa.Ord"+ $stateParams.kind +"Ctrl";                                  
                    }],
                    resolve		: {
                        resData: ["AuthSvc", "$q", function (AuthSvc, $q) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                defer.resolve(resData);
                            });

                            return defer.promise;
                        }]
                    }
                }
            }
        });
    }]);
}());
