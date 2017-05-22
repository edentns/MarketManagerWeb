(function () {
    "use strict";

    /**
     * 권한관리
     * @name sy.Atrt.service : sy.AtrtSvc
     */
    angular.module("sy.Atrt.service")
        .factory("sy.AtrtSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
                /**
                 * 권한코드를 가져온다.
                 * @param {object} oParam
                 * @returns {*}
                 */
                getAuthList: function () {
                    var url = APP_CONFIG.domain +"/sy08Atrt";

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
                    var url = APP_CONFIG.domain + "/sy08MenuAtrt";
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
                        url     : APP_CONFIG.domain +"/sy08Atrt",
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
                        url     : APP_CONFIG.domain +"/sy08MenuAtrt",
                        data    : oParam
                    });
                }
            };
        }]);

}());