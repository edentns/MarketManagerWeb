(function () {
	"use strict";
	
	/**
     * @ngdoc function
     * @name modal.NewGroupSaveSvc
     * 메뉴그룹을 등록한다.
     */
    angular.module("edtApp.common.modal")
        .factory("modal.NewGroupSaveSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
				/**
				 * 메뉴그룹을 등록한다.
				 * @param {{NM_MYGRP:string}}
				 * @returns {*}
				 */
				newGroupSave : function (nmGroup) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/newGroupSave",
						headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
						data	: $.param({NM_MYGRP:nmGroup})
					});
				},
            };
        }]);
}());