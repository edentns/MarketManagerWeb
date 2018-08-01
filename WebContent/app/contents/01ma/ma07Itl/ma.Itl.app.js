(function () {
    "use strict";

    // [ma] Notice
    var qaApp = angular.module("ma.Itl", ["ma.Itl.controller", "ma.Itl.service"]);
    angular.module("ma.Itl.controller", [] );
    angular.module("ma.Itl.service", [] );

    qaApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maItl", {
            url		: "/01ma/maItl?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/01ma/ma07Itl/templates/ma.Itl.tpl.html",
                    controller  : "ma.ItlCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "UtilSvc", function (AuthSvc, $q, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                var param = {
        		    					procedureParam: "USP_MA_07ITL_CODE_GET",
        		    				};

                                $q.all([
									UtilSvc.getList(param).then(function (res) {
										return res.data;
									}),
                            		UtilSvc.grid.getInquiryParam().then(function (res) {
                            			return res.data;
                            		})
                                ]).then(function (result) {
                                	resData.mngMrkBind = result[0].results[0];
    		    					resData.nmJobBind  = result[0].results[1];
    		    					resData.stJobBind  = result[0].results[2];
    		    					
                                	resData.answerStatusBind = result[0];
                                	
                                	var history = result[1];
                        			
                        			if(history){
    				            		resData.mngMrkModel               = history.L_LIST01;
    				            		resData.mngMrkBind.setSelectNames = history.L_LIST01_SELECT_INDEX;
    				            		resData.nmJobModel                = history.L_LIST02;
    				            		resData.nmJobBind.setSelectNames  = history.L_LIST02_SELECT_INDEX;
    				            		resData.stJobModel                = history.L_LIST03;
    				            		resData.stJobBind.setSelectNames  = history.L_LIST03_SELECT_INDEX;
    				            		
    				            		resData.selectDate       = UtilSvc.grid.getSelectDate(history.PERIOD);
    				            	}
    				            	else {
    				            		resData.mngMrkModel = "*";
    				            		resData.nmJobModel  = "*";
    				            		resData.stJobModel  = "*";
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