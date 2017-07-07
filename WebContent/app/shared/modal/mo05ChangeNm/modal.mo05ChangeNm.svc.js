(function () {
	"use strict";
	
	/**
     * @ngdoc function
     * @name modal.ChangeNmSvc
     * 메뉴그룹을 등록한다.
     */
    angular.module("edtApp.common.modal")
        .factory("modal.ChangeNmSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
				/**
				 * 메뉴그룹을 등록한다.
				 * @param {{NM_MYGRP:string}}
				 * @returns {*}
				 */
				changeNm : function (noMygrp, noM, nmM) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/changeNm",
						headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
						data	: $.param({NO_MYGRP:noMygrp, NO_M:noM, NM_M:nmM})
					});
				},
            };
        }]);
}());