(function () {
    "use strict";

    /**
     * 사용자관리
     * @name sy.User.service : sy.UserListSvc
     */
    angular.module("sy.User.service")
        .factory("sy.UserListSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
                /**
                 * 검색조건에 해당하는 유저정보를 가져온다.
                 * @param {object} param
                 * @returns {*}
                 */
                getUserList : function (param) {
                    return $http({
                        method  : "GET",
                        //url		: APP_CONFIG.domain +"/user?"+ $.param( param )
                        url		: APP_CONFIG.domain +"/user?"+ param
                    });
                },

                /**
                 * 검색조건으로 영업사원을 가져온다.
                 * @param {Array.<{ sel_dept:Number }>} param
                 * @returns {*}
                 */
                getUserSearchCode : function (param) {
                    return $http({
                        method  : "GET",
                        url		: APP_CONFIG.domain +"/user?"+ param
                    });
                },

                makeGetUserParam : function (param) {
                    var rtnGetParam = "",
                        defaults = {
                            dept : "all",
                            pos  : "all",
                            name : "all",
                            status  : "JOINED"
                        };

                    if (angular.isArray(param)) { rtnGetParam = edt.makeGetParam(param, "sel_dept"); }
                    else {
                        edt.extend(param, defaults, false);
                        rtnGetParam = $.param(param);
                    }

                    return rtnGetParam;
                },
                
                getDepart : function (param) {
                    var url = APP_CONFIG.domain +"/sy07UserDept";

                    if (angular.isObject(param)) {
                        url += "?"+ $.param(param);
                    }

                    return $http({
                        method : "GET",
                        url    : url
                    });
                }
            };
        }]);
}());