(function () {
    "use strict";

    /**
     * 메뉴관리
     * sy.Menu.service : sy.MenuSvc
     */
    angular.module("sy.Menu.service")
        .factory( "sy.MenuSvc", [ "APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
                /**
                 * 메뉴정보를 가져온다.
                 * @returns {*}
                 */
                getMenuList: function () {
                    return $http({
                        method  : "GET",
                        url		: APP_CONFIG.domain +"/sy13Menu"
                    });
                }
            };
        }]);
}());