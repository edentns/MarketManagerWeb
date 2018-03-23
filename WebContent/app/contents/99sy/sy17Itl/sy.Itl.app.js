(function () {
    "use strict";

    // [ma] Notice
    var qaApp = angular.module("sy.Itl", ["sy.Itl.controller", "sy.Itl.service"]);
    angular.module("sy.Itl.controller", [] );
    angular.module("sy.Itl.service", [] );

    qaApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syItl", {
            url		: "/99sy/syItl?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/99sy/sy17Itl/templates/sy.Itl.tpl.html",
                    controller  : "sy.ItlCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "UtilSvc", '$state', function (AuthSvc, $q, UtilSvc, $state) {
                            var defer 	= $q.defer(),
                                resData = {},
                                self    = this,
                                today   = edt.getToday();

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                
                                var param = {
    		    					procedureParam: "USP_MA_07ITL_CODE_GET",
    		    				};
                            
                                $q.all([
                            		UtilSvc.csMrkList().then(function (res) {
                            	    	return res.data;
                            		}),
                            		UtilSvc.getList(param).then(function (res) {
                            			return res.data.results[3];
                            		}),
                            		UtilSvc.grid.getInquiryParam().then(function (res) {
                            			return res.data;
                            		})
                                ]).then(function (result) {
                                	resData.mngMrkData = result[0];
                                	resData.stJobData  = result[1];
                        			
                        			var history = result[2];
                        			
                        			if(history){
    				            		resData.mngMrkModel               = history.mngMrkModel;
    				            		resData.mngMrkData.setSelectNames = history.mngMrkBindSelect;
    				            		resData.stJobModel                = history.stJobModel;
    				            		resData.stJobData.setSelectNames  = history.stJobBindSelect;
    				            		resData.selectDate                = UtilSvc.grid.getSelectDate(history.selected, history.start, history.end);
    				            	}
    				            	else {
    				            		resData.mngMrkModel         = "*";
    				            		resData.stJobModel          = "*";
    				            		resData.selectDate          = {};
    				            		resData.selectDate.start    = angular.copy(edt.getToday());
    				            		resData.selectDate.end      = angular.copy(edt.getToday());
    				            		resData.selectDate.selected = '1Week';
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