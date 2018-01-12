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
                                self = this;

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                
                                UtilSvc.csMrkList().then(function (res) {
                                	resData.mngMrkData = res.data;
                                	
                                	var param = {
        		    					procedureParam: "MarketManager.USP_MA_07ITL_CODE_GET",
        		    				};
        		    				UtilSvc.getList(param).then(function (res) {
        		    					resData.stJobData  = res.data.results[3];
        		    					
        		    					var history = UtilSvc.grid.getInquiryParam(self.self.name);
        				            	if(history){
        				            		resData.mngMrkModel               = history.mngMrkModel;
        				            		resData.mngMrkData.setSelectNames = history.mngMrkBindSelect;
        				            		resData.stJobModel                = history.stJobModel;
        				            		resData.stJobData.setSelectNames  = history.stJobBindSelect;
        				            		resData.start                     = history.start;
        				            		resData.end                       = history.end;
        				            	}
        				            	else {
        				            		resData.mngMrkModel = "*";
        				            		resData.stJobModel  = "*";
        				            		resData.start = angular.copy(edt.getToday());
        				            		resData.end   = angular.copy(edt.getToday());
        				            	}
        				            		
        		    					defer.resolve(resData);
        							});
                    			})
                            });

                            return defer.promise;
                        }]
                    }
                }
            }
        });
    }]);
}());