(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name edmsApp.common.directive:headerDiv
	 * @description
	 * # headerDiv
	 * Page Header Area
	 */
	angular.module("edtApp.common.directive")
		.directive("headerDiv", ["$timeout", function ($timeout) {
			return {
				priority: 0,
				templateUrl: "app/shared/layout/header/header.tpl.html",
				restrict: "AE",
				transclude: true,
				scope: true,
				controller: ["$rootScope", "$scope", "$state", "sy.LoginSvc", function ($rootScope, $scope, $state, SyLoginSvc) {
					var headerIconVO = $scope.headerIconVO = {
						isShowDropdown : false
					};

					headerIconVO.toggleDropdown = function ( $event ) {
						$event.stopPropagation();
						this.isShowDropdown = !this.isShowDropdown;
					};

					headerIconVO.initLoad = function () {
						headerIconVO.toggleSidebar();
					};

					headerIconVO.toggleSidebar = function () {
						$(".show-sidebar").on("click", function (e) {
							function MessagesMenuWidth(){
								var W = window.innerWidth;
								var Wmenu = $("#sidebar-left").outerWidth();
								var wmessages = (W-Wmenu)*12/100;

								$("#messages-menu").width(wmessages);
							}

							e.preventDefault();
							$("#app-main").toggleClass("sidebar-show");

							$timeout(MessagesMenuWidth, 250);
						});
					};

					/**
					 * @description 로그아웃을 한다.
					 * @param {$event} $event angular event
					 */
					headerIconVO.doLogout = function ( $event ) {
						$event.preventDefault();
						if ( confirm( "로그아웃하시겠습니까?" ) ) {
							$scope.$emit("event:logout");
							//SyLoginSvc.logout().then(function () {
							//	$scope.$emit("event:logout");
							//});
						}
					};

					/**
					 * @description profile page로 이동한다.
					 */
					headerIconVO.moveProfile = function ( $event ) {
						$event.preventDefault();
						$state.go('app.syMyInfo');
					};

					headerIconVO.initLoad();
				}]
			};
		}]);
}());