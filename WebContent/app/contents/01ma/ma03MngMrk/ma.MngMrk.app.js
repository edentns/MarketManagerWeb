(function () {
    "use strict";

    // [ma] MngMrk
    var mngMrkApp = angular.module("ma.MngMrk", ["ma.MngMrk.controller", "ma.MngMrk.service"]);
    angular.module("ma.MngMrk.controller", [] );
    angular.module("ma.MngMrk.service", [] );

    mngMrkApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maMngMrk", {
            url		: "/01ma/maMngMrk?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/01ma/ma03MngMrk/templates/ma.MngMrk.tpl.html",
                    controller  : "ma.MngMrkCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "UtilSvc", function (AuthSvc, $q, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {},
                                strPcdParam = "USP_SY_10CODE02_GET&L_NO_MNGCDHD@s|L_CD_CLS@s";

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                
                                var paramMrkDft = {
	            						procedureParam:strPcdParam,
	            						L_NO_MNGCDHD:"SYCH00005",
	            						L_CD_CLS:"SY_000005"
            						},
            						paramNt = {
                						procedureParam:strPcdParam,
                						L_NO_MNGCDHD:"SYCH00027",
                						L_CD_CLS:"SY_000027"
                					},
                					paramMethod = {
                						procedureParam:strPcdParam,
                						L_NO_MNGCDHD:"SYCH00016",
                						L_CD_CLS:"SY_000016"
                					};
                                
                                $q.all([
									UtilSvc.getList(paramMrkDft).then(function (res) {
										return res.data.results[0];
									}),
									UtilSvc.getList(paramNt).then(function (res) {
										return res.data.results[0];
									}),
									UtilSvc.getList(paramMethod).then(function (res) {
										return res.data.results[0];
									}),
                            		UtilSvc.grid.getInquiryParam().then(function (res) {
                            			return res.data;
                            		})
                                ]).then(function (result) {
                                	resData.cdMrkDftDataSource = result[0];
                                	resData.cdNtDataSource     = result[1];
                                	resData.methodDataSource   = result[2];
                                	
                                	var history = result[3];
                        			
                        			if(history){
    				            		resData.searchText       = history.MA_NM_MRK;
    				            		resData.selectMethodData = history.MA_CD_ITLWY;
    				            		resData.methodDataSource.setSelectNames = history.MA_CD_ITLWY_SELECT_INDEX;
    				            		resData.selectDate       = UtilSvc.grid.getSelectDate(history.PERIOD);
    				            	}
    				            	else {
    				            		resData.searchText       = "";
    				            		resData.selectMethodData = "*";
    				            		resData.selectDate         = {
    				            			start : angular.copy(edt.getToday()),
    				            			end   : angular.copy(edt.getToday()),
    				            			selected : '1Day'
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
