(function () {
    "use strict";

    // [ma] Board
    var qaApp = angular.module("ma.File", ["ma.File.controller", "ma.File.service"]);
    angular.module("ma.File.controller", [] );
    angular.module("ma.File.service", [] );

    qaApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maFile", {
            url		: "/01ma/maFile/:kind?menu&ids",
            views	: {
                contentView	: {
                	templateUrl	: "app/contents/01ma/ma11File/templates/ma.File.tpl.html",
                    controller  : "ma.FileCtrl",
                    resolve		: {
                    	resData: ["$stateParams", "AuthSvc", "$q", "UtilSvc", "sy.BoardSvc", '$state', function ($stateParams, AuthSvc, $q, UtilSvc, SyBoardSvc, $state) {
                    		var defer 	= $q.defer(),
	                            resData = {},
	                            self    = this,
	                            today   = edt.getToday();

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                
                                // 파일구분 : 사진, 사업자등록증, 통신판매업신고증 ...
                                var param = {
                					lnomngcdhd: "SYCH00019",
                					lcdcls: "SY_000019"
                				};
                                
                                $q.all([
                                    // 파일구분 코드 데이터
                            		UtilSvc.getCommonCodeList(param).then(function (res) {
                            	    	return res.data;
                            		}),
                            		// 조회조건 데이터
                            		UtilSvc.grid.getInquiryParam().then(function (res) {
                            			return res.data;
                            		})
                                ]).then(function (result) {
                                	resData.fileGubunBind = result[0];
                                	var history = result[1];
                        			
                                	if(history){
            		            		resData.fileGubunBind.setSelectNames = history.fileGubunBindSelectIndex;
    				            		resData.fileGubunModel = history.fileGubunModel;
    				            		resData.ynDelModel     = history.ynDelModel;
    				            		resData.noC            = history.noC;
    				            		resData.selectDate     = UtilSvc.grid.getSelectDate(history.period);
    				            	}
    				            	else {
    				            		resData.fileGubunModel    = "*";
    				            		resData.ynDelModel        = "N";
    				            		resData.noC               = "";
    				            		resData.selectDate        = {};
    				            		resData.selectDate.start  = angular.copy(edt.getToday());
    				            		resData.selectDate.end    = angular.copy(edt.getToday());
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