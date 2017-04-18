(function () {
    "use strict";

    // [sa] EchgReq
    var echgReqApp = angular.module("sa.EchgReq", ["sa.EchgReq.controller", "sa.EchgReq.service"]);
    angular.module("sa.EchgReq.controller", [] );
    angular.module("sa.EchgReq.service", [] );

    echgReqApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.saEchgReq", {
            url		: "/03sa/saEchgReq?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/03sa/sa07EchgReq/templates/sa.EchgReq.tpl.html",
                    controller  : "sa.EchgReqCtrl",
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
