(function () {
    "use strict";

    // [ma] MemJoinAppr
    var memJoinApprApp = angular.module("ma.MemJoinAppr", ["ma.MemJoinAppr.controller", "ma.MemJoinAppr.service"]);
    angular.module("ma.MemJoinAppr.controller", [] );
    angular.module("ma.MemJoinAppr.service", [] );

    memJoinApprApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maMemJoinAppr", {
            url		: "/01ma/maMemJoinAppr?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/01ma/ma02MemJoinAppr/templates/ma.MemJoinAppr.tpl.html",
                    controller  : "ma.MemJoinApprCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "UtilSvc", function (AuthSvc, $q, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                
                                var paramYL = {
				    					procedureParam: "USP_SY_10CODE02_GET&lnomngcdhd@s|lcdcls@s",
				    					lnomngcdhd: "SYCH00002",
				    					lcdcls: "SY_000002"
			    					},
			    				    paramIL = {
				    					procedureParam: "USP_SY_10CODE02_GET&lnomngcdhd@s|lcdcls@s",
				    					lnomngcdhd: "SYCH00001",
				    					lcdcls: "SY_000001"
				    				},
				    				paramRMK = {
				    					procedureParam: "USP_SY_10CODE02_GET&lnomngcdhd@s|lcdcls@s",
				    					lnomngcdhd: "SYCH00015",
				    					lcdcls: "SY_000015"
				    				};  
                                $q.all([
									UtilSvc.getList(paramYL).then(function (res) {
										return res.data;
									}),
									UtilSvc.getList(paramIL).then(function (res) {
										return res.data;
									}),
									UtilSvc.getList(paramRMK).then(function (res) {
										return res.data;
									}),
                            		UtilSvc.grid.getInquiryParam().then(function (res) {
                            			return res.data;
                            		})
                                ]).then(function (result) {
                                	resData.StatusDtOptionVO = result[0].results[0];
                                	resData.ProcNameDtOptionVO = result[1].results[0];
                                	resData.BetweenDateOptionVO = result[2].results[0];
                                	var history = result[3];
                        			
                        			if(history){
    				            		resData.NM = history.NM;
    				            		resData.YL = history.YL;
    				            		resData.StatusDtOptionVO.setSelectNames = history.YL_SELECT_INDEX;
    				            		resData.IL = history.IL;
    				            		resData.ProcNameDtOptionVO.setSelectNames = history.IL_SELECT_INDEX;
    				            		resData.RMK = history.RMK;
    				            		resData.selectDate = UtilSvc.grid.getSelectDate(history.PERIOD);
    				            	}
    				            	else {
    				            		resData.NM = "";
    				            		resData.YL = "*";
    				            		resData.IL = "*";
    				            		resData.RMK = resData.BetweenDateOptionVO[0].CD_DEF;
    				            		
    				            		resData.selectDate = {
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
