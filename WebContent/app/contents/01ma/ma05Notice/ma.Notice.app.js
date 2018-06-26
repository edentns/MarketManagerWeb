(function () {
    "use strict";

    // [ma] Notice
    var noticeApp = angular.module("ma.Notice", ["ma.Notice.controller", "ma.Notice.service"]);
    angular.module("ma.Notice.controller", [] );
    angular.module("ma.Notice.service", [] );

    noticeApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maNotice", {
            url		: "/01ma/maNotice?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/01ma/ma05Notice/templates/ma.Notice.tpl.html",
                    controller  : "ma.NoticeCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "UtilSvc", function (AuthSvc, $q, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                
                                var param = {
                    					procedureParam: "USP_SY_10CODE02_GET&lnomngcdhd@s|lcdcls@s",
                    					lnomngcdhd: "SYCH00014",
                    					lcdcls: "SY_000014"
                    				};

                                $q.all([
									UtilSvc.getList(param).then(function (res) {
										return res.data.results[0];
									}),
                            		UtilSvc.grid.getInquiryParam().then(function (res) {
                            			return res.data;
                            		})
                                ]).then(function (result) {
                                	resData.noticeCdVO = result[0];
                                	
                                	var history = result[1];
                        			
                        			if(history){
    				            		resData.writeText        = history.NO_WR;
    				            		resData.contentText      = history.SB_NM;
    				            		resData.noticeCdModel    = history.ARR_CD_NO;
    				            		resData.noticeCdVO.setSelectNames = history.ARR_CD_NO_SELECT_INDEX;
    				            		resData.selectDate       = UtilSvc.grid.getSelectDate(history.PERIOD);
    				            	}
    				            	else {
    				            		resData.writeText     = "";
    				            		resData.contentText   = "";
    				            		resData.noticeCdModel = "*";
    				            		resData.selectDate         = {
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