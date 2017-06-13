(function () {
    "use strict";

    // [SY] > 부서관리
    var deptApp = angular.module("sy.Dept", ["sy.Dept.controller", "sy.Dept.service"]);
    angular.module("sy.Dept.controller", []);
    angular.module("sy.Dept.service", []);

    deptApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state( "app.syDept", {
            url		: "/99sy/syDept?menu",
            views	: {
                contentView		: {
                    templateUrl	: "app/contents/99sy/sy12Dept/templates/sy.Dept.tpl.html",
                    controller	: "sy.DeptCtrl",
                    resolve		: {
                        resData: [ "AuthSvc", "sy.DeptSvc", "sy.CodeSvc", "APP_CODE", "$q",
                            function ( AuthSvc, SyDeptSvc, SyCodeSvc, APP_CODE, $q) {
                                var defer 	= $q.defer(),
                                    resData = {};
                                AuthSvc.isAccess().then(function (result) {
                                    resData.access = result[0];

                                    $q.all([
                                        SyCodeSvc.getSubcodeList({ cd: 'SY_000023' }),
                                    ]).then(function (result) {
                                        resData.workCodeList = result[0].data;
                                        defer.resolve( resData );
                                    });
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