(function () {
    "use strict";

    /**
     * 권한관리
     * @name sy.Ctgr.service : sy.CtgrSvc
     */
    angular.module("sy.Ctgr.service")
        .factory("sy.CtgrSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
                /**
                 * 권한코드를 가져온다.
                 * @param {object} oParam
                 * @returns {*}
                 */
                getAuthList: function () {
                    var url = APP_CONFIG.domain +"/sy19Ctgr";

                    return $http({
                        method  : "GET",
                        url		: url
                    });
                },

                /**
                 * 권한메뉴를 가져온다.
                 * @param {object} oParam
                 * @returns {*}
                 */
                getMenuAuthList : function (oParam) {
                    var url = APP_CONFIG.domain + "/sy08MenuCtgr";
                    if (angular.isObject(oParam)) url += "?"+ $.param(oParam);

                    return $http({
                        method  : "GET",
                        url		: url
                    });
                },

                /**
                 * 권한코드를 저장한다.
                 * @param {object} oParam
                 * @returns {*}
                 */
                saveAuth : function (oParam) {
                    return $http({
                        method  : "POST",
                        url     : APP_CONFIG.domain +"/sy19Ctgr",
                        data    : oParam
                    });
                },

                /**
                 * 메뉴권한코드를 저장한다.
                 * @param {object} oParam
                 * @returns {*}
                 */
                saveMenuAuth : function (oParam) {
                    return $http({
                        method  : "POST",
                        url     : APP_CONFIG.domain +"/sy08MenuCtgr",
                        data    : oParam
                    });
                }
            };
        }]);

}());