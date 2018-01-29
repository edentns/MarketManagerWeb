(function () {
    "use strict";

    // [sy] Notice
    var noticeApp = angular.module("sy.Notice", ["sy.Notice.controller", "sy.Notice.service"]);
    angular.module("sy.Notice.controller", [] );
    angular.module("sy.Notice.service", [] );

    noticeApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syNotice", {
            url		: "/99sy/syNotice?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/99sy/sy14Notice/templates/sy.Notice.tpl.html",
                    controller  : "sy.NoticeCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "UtilSvc", function (AuthSvc, $q, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                
                                var paramNoticeCd = {
                                		procedureParam: "MarketManager.USP_SY_10CODE02_GET&lnomngcdhd@s|lcdcls@s",
                    					lnomngcdhd: "SYCH00014",
                    					lcdcls: "SY_000014"
                    				};
                              
                                $q.all([
                            		UtilSvc.getList(paramNoticeCd).then(function (res) {
                            	    	return res.data.results[0];
                            		}),
                            		UtilSvc.grid.getInquiryParam().then(function (res) {
                            			return res.data;
                            		})
                                ]).then(function (result) {
                                	resData.noticeCdVO = result[0];
                        			
                        			var history = result[1];
                        			
                        			if(history){
    				            		resData.contentTextValue          = history.SEARCH_;
    				            		resData.noticeCdModel             = history.ARR_CD_NO;
    				            		resData.noticeCdVO.setSelectNames = history.ARR_CD_NO_SELECT_INDEX;
    				            		resData.start                     = history.START_DATE;
    				            		resData.end                       = history.END_DATE;
    				            		resData.selected                  = 'range';
    				            	}
    				            	else {
    				            		resData.contentTextValue = "";
    				            		resData.noticeCdModel    = "*";
    				            		resData.start            = angular.copy(edt.getToday());
    				            		resData.end              = angular.copy(edt.getToday());
    				            		resData.selected         = 'current';
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
