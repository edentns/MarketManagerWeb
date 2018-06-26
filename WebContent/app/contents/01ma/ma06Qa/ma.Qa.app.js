(function () {
    "use strict";

    // [ma] Notice
    var qaApp = angular.module("ma.Qa", ["ma.Qa.controller", "ma.Qa.service"]);
    angular.module("ma.Qa.controller", [] );
    angular.module("ma.Qa.service", [] );

    qaApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maQa", {
            url		: "/01ma/maQa?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/01ma/ma06Qa/templates/ma.Qa.tpl.html",
                    controller  : "ma.QaCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "UtilSvc", function (AuthSvc, $q, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                var param = {
                    					lnomngcdhd: "SYCH00091",
                    					lcdcls: "SY_000031"
                    				};

                                $q.all([
									UtilSvc.getCommonCodeList(param).then(function (res) {
										return res.data;
									}),
                            		UtilSvc.grid.getInquiryParam().then(function (res) {
                            			return res.data;
                            		})
                                ]).then(function (result) {
                                	resData.answerStatusBind = result[0];
                                	
                                	var history = result[1];
                        			
                        			if(history){
    				            		resData.contentText      = history.CONT;
    				            		resData.answerStatusModel= history.CD_ANSSTAT;
    				            		resData.answerStatusBind.setSelectNames = history.CD_ANSSTAT_SELECT_INDEX;
    				            		resData.selectDate       = UtilSvc.grid.getSelectDate(history.PERIOD);
    				            	}
    				            	else {
    				            		resData.contentText       = "";
    				            		resData.answerStatusModel = "*";
    				            		resData.selectDate        = {
    				            			start : angular.copy(edt.getToday()),
    				            			end   : angular.copy(edt.getToday()),
    				            			selected : '1Week'
    				            		};
    				            	}

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