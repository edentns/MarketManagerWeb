(function () {
    "use strict";

    // [SY] > 부서관리
    var otherKendoApp = angular.module("te.OtherKendo", ["te.OtherKendo.controller", "te.OtherKendo.service"]);
    angular.module("te.OtherKendo.controller", []);
    angular.module("te.OtherKendo.service", []);

    otherKendoApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state( "app.teOtherKendo", {
            url		: "/98te/teOtherKendo?menu",
            views	: {
                contentView		: {
                    templateUrl	: "app/contents/98te/otherkendo/templates/te.OtherKendo.tpl.html",
                    controller	: "te.OtherKendoCtrl",
                    resolve		: {
                        resData: [ "AuthSvc", "te.OtherKendoSvc", "sy.CodeSvc", "APP_CODE", "$q",
                            function ( AuthSvc, SyOtherkendoSvc, SyCodeSvc, APP_CODE, $q) {
                                var defer 	= $q.defer(),
                                    resData = {};

                                AuthSvc.isAccess().then(function (result) {
                                    resData.access = result[0];
                                    defer.resolve( resData );
//                                    $q.all([
//                                        SyCodeSvc.getSubcodeList({ cd: APP_CODE.workgroup.cd }),
//                                    ]).then(function (result) {
//                                        resData.workCodeList = result[0].data;
//                                        defer.resolve( resData );
//                                    });
                                });

                                return defer.promise;
                            }
                        ]
                    }
                }
            }
        });
    }]);
}());