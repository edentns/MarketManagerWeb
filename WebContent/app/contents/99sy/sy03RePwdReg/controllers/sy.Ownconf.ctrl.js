(function () {
	"use strict";

	angular.module("sy.Ownconf.controller")
		.controller("sy.OwnconfCtrl", ["$rootScope", "$scope", "resData", "$location",  
			function ($rootScope, $scope, resData, $location) {
				var ownconfVO;
				
				/**
				 * ownconfVO 초기값 설정
				 */
				ownconfVO = $scope.ownconfVO = {
					message : resData.data
				};

				/**
				 * 로그인 화면으로 이동
				 */
				ownconfVO.doLogin = function () {
					var self = this;
		            $location.url("/99sy/syLogin");
				};
			}
		]);
}());
