(function () {
    "use strict";

    // [sy] Mrk
    var mrkApp = angular.module("sy.Mrk", ["sy.Mrk.controller", "sy.Mrk.service"]);
    angular.module("sy.Mrk.controller", [] );
    angular.module("sy.Mrk.service", [] );

    mrkApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syMrk", {
            url		: "/99sy/syMrk?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/99sy/sy09Mrk/templates/sy.Mrk.tpl.html",
                    controller  : "sy.MrkCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "UtilSvc", "sy.CodeSvc", function (AuthSvc, $q, UtilSvc, SyCodeSvc) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                
                                var paramItlStatCd = {cd: "SY_000017", search: "all"}
	                          	  , paramMrkCd     = {procedureParam: "USP_SY_09MRK01_GET"};
                                
                                $q.all([
                                    SyCodeSvc.getSubcodeList(paramItlStatCd).then(function (res) {
                            	    	return res.data;
                            	    }),
                            		UtilSvc.getList(paramMrkCd).then(function (res) {
                            	    	return res.data.results[0];
                            		}),
                            		UtilSvc.grid.getInquiryParam().then(function (res) {
                            			return res.data;
                            		})
                                ]).then(function (result) {
                                	resData.ItlStatCodeList = result[0];
                                	resData.MrkCodeList     = result[1];
                        			
                        			var history = result[2];
                        			
                        			if(history){
    				            		resData.selectedMrkIds                 = history.MRK_LIST;
    				            		resData.MrkCodeList.setSelectNames     = history.MRK_SELECT_INDEX;
    				            		resData.selectedItlStatIds             = history.STAT_LIST;
    				            		resData.ItlStatCodeList.setSelectNames = history.STAT_SELECT_INDEX;
    				            		resData.selectDate                     = UtilSvc.grid.getSelectDate(history.SELECTED_DATE, history.START_DATE, history.END_DATE);
    				            	}
    				            	else {
    				            		resData.selectedMrkIds     = "*";
    				            		resData.selectedItlStatIds = "*";
    				            		resData.selectDate = {};
    				            		resData.selectDate.start              = angular.copy(edt.getToday());
    				            		resData.selectDate.end                = angular.copy(edt.getToday());
    				            		resData.selectDate.selected           = '1Day';
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
