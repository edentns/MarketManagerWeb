(function () {
    "use strict";

    var otherKendoApp = angular.module("te.Mobile", ["te.Mobile.controller", "te.Mobile.service"]);
    angular.module("te.Mobile.controller", []);
    angular.module("te.Mobile.service", []);

    otherKendoApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state( "app.teMobile", {
            url		: "/98te/teMobile?menu",
            views	: {
                contentView		: {
                    templateUrl	: "app/contents/98te/otherkendomobile/templates/te.OtherKendoMobile.tpl.html",
                    controller	: "te.MobileCtrl",
                    resolve		: {
                        resData: [ "AuthSvc", "te.MobileSvc", "sy.CodeSvc", "APP_CODE", "$q",
                            function ( AuthSvc, SyMobileSvc, SyCodeSvc, APP_CODE, $q) {
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