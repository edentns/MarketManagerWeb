(function () {
    "use strict";

    // [co] profile
    var myInfoApp = angular.module("sy.MyInfo", ["sy.MyInfo.controller", "sy.MyInfo.service"]);
    angular.module("sy.MyInfo.controller", [] );
    angular.module("sy.MyInfo.service", [] );

    myInfoApp.config(["$stateProvider", function ($stateProvider){
        $stateProvider.state("app.syMyInfo", {
            url   : "/99sy/syMyInfo?menu",
            views : {
                contentView : {
                    templateUrl : "app/contents/99sy/sy05MyInfo/templates/sy.MyInfo.tpl.html",
                    controller  : "sy.MyInfoCtrl",
                    resolve		: {
                        resData : ["sy.LoginSvc", "$q", "$rootScope", "UtilSvc", function (SyLoginSvc, $q, $rootScope, UtilSvc) {
                            var defer = $q.defer(),
                                resData = {},
                                param = {
                                		procedureParam:"USP_SY_05MyInfo_GET"
                                	};

                            SyLoginSvc.isLogin().then(function () {
                                $rootScope.$emit("event:login");
                                $q.all([
                                        UtilSvc.getList(param).then(function (result) {  
		                            return result.data.results;
		                        }),]).then(function (result) {
		                        		resData.MyParam = result[0][0][0];
		                        		resData.fileProfile = result[0][1][0];
                                        defer.resolve( resData );
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