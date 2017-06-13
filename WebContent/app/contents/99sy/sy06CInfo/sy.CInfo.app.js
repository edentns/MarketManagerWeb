(function () {
    "use strict";

    // [sy] CInfo
    var cInfoApp = angular.module("sy.CInfo", ["sy.CInfo.controller", "sy.CInfo.service"]);
    angular.module("sy.CInfo.controller", [] );
    angular.module("sy.CInfo.service", [] );

    cInfoApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syCInfo", {
            url		: "/99sy/syCInfo?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/99sy/sy06CInfo/templates/sy.CInfo.tpl.html",
                    controller  : "sy.CInfoCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "UtilSvc", function (AuthSvc, $q, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {},
        	                	fileParam = {
        	                		procedureParam: "USP_SY_06CInfoFile01_GET&L_NO_BSNS@s|L_NO_COMM@s",
        	                		L_NO_BSNS : "002",
        	                		L_NO_COMM : "003"
        	                	};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                $q.all([
                                        UtilSvc.getList(fileParam).then(function (result) {  //파일 2개(사업자 등록증, 통신판매업신고증)
		                            return result.data.results;
		                        }),
                                    ]).then(function (result) {
                                    	resData.fileBsnsVOcurrentData = result[0][0][0];
                                    	resData.fileCommVOcurrentData = result[0][1][0];
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
