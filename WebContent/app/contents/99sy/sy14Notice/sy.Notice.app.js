(function () {
    "use strict";

    // [sy] Notice
    var noticeApp = angular.module("sy.Notice", ["sy.Notice.controller", "sy.Notice.service"]);
    angular.module("sy.Notice.controller", [] );
    angular.module("sy.Notice.service", [] );

    noticeApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syNotice", {
            url		: "/99sy/syNotice?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/99sy/sy14Notice/templates/sy.Notice.tpl.html",
                    controller  : "sy.NoticeCtrl",
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
