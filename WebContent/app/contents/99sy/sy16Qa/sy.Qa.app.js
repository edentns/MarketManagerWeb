(function () {
    "use strict";

    // [sy] Notice
    var syQaApp = angular.module("sy.Qa", ["sy.Qa.controller", "sy.Qa.service"]);
    angular.module("sy.Qa.controller", [] );
    angular.module("sy.Qa.service", [] );

    syQaApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syQa", {
            url		: "/99sy/syQa?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/99sy/sy16Qa/templates/sy.Qa.tpl.html",
                    controller  : "sy.QaCtrl",
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
    				            		resData.contentTextValue  = history.L_CONT;
    				            		resData.answerStatusModel = history.L_CD_ANSSTAT;
    				            		resData.answerStatusBind.setSelectNames = history.L_CD_ANSSTAT_INDEX;
    				            		resData.start             = history.L_START_DATE;
    				            		resData.end               = history.L_END_DATE;
    				            		resData.selected          = 'range';
    				            	}
    				            	else {
    				            		resData.contentTextValue  = "";
    				            		resData.answerStatusModel = "*";
    				            		resData.start             = angular.copy(edt.getToday());
    				            		resData.end               = angular.copy(edt.getToday());
    				            		resData.selected          = 'current';
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
