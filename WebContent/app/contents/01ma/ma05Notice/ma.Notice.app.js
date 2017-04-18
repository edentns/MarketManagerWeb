(function () {
    "use strict";

    // [ma] Notice
    var noticeApp = angular.module("ma.Notice", ["ma.Notice.controller", "ma.Notice.service"]);
    angular.module("ma.Notice.controller", [] );
    angular.module("ma.Notice.service", [] );

    noticeApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maNotice", {
            url		: "/01ma/maNotice?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/05ma/ma01Notice/templates/ma.Notice.tpl.html",
                    controller  : "ma.NoticeCtrl",
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