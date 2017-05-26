(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.RePwdReg.service : sy.RePwdRegSvc
     * 비밀번호 재설정 등록
     */
    angular.module("sy.RePwdReg.service")
        .factory("sy.RePwdRegSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	/**
				 * 비밀번호 요청확인
				 * @param {{DC_URLCRYTO:string}} DC_URLCRYTO
				 * @returns {*}
				 */
				rePwdGet01 : function (dcUrlCryTo) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/RePwdReg01",
						headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
						data	: $.param({L_DC_URLCRYTO:dcUrlCryTo})
					});
				},
				/**
				 * 비밀번호 요청확인
				 * @param {{DC_URLCRYTO:string}} DC_URLCRYTO
				 * @returns {*}
				 */
				rePwd : function (dcUrlCryTo, password, captcha) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/RePwd",
						headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
						data	: $.param({DC_URLCRYTO:dcUrlCryTo, DC_PWD:password, DC_CAPTCHA:captcha})
					});
				}
            };
        }]);
}());