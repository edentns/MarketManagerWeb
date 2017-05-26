(function () {
	"use strict";

	angular.module("sy.Login.controller")
		.controller("sy.LoginCtrl", ["$rootScope", "$scope", "$modal", "$state", "sy.LoginSvc", "APP_CONFIG", "$window", "$http", "MenuSvc", 
			function ($rootScope, $scope, $modal, $state, LoginSvc, APP_CONFIG, $window, $http, MenuSvc) {
				var loginVO;

				loginVO = $scope.loginVO = {
					isRegisterId: false,
					info		: { bsCd    : APP_CONFIG.bsCd, user	: "", password: "" },
					version	: APP_CONFIG.version,
					url : ""
				};

				/**
				 * 초기 로드시 실행된다.
				 */
				loginVO.initLoad = function () {
					var self = this,
						recentLoginInfo = $window.localStorage.getItem("recentLoginInfo"), // 기억한 로그인 정보
						recentUrl       = $window.localStorage.getItem("recentUrl");
					
					if (recentLoginInfo) {
						recentLoginInfo    = JSON.parse(recentLoginInfo);
						self.info.bsCd     = recentLoginInfo.bsCd;
						self.info.user 	   = recentLoginInfo.user;
						self.info.password = recentLoginInfo.password;
						self.isRegisterId  = true;
					}
					if (recentUrl) {
						recentUrl          = JSON.parse(recentUrl);
						self.url           = recentUrl.href;
					}
				};

				/**
				 * 로그인을 한다.
				 */
				loginVO.doLogin = function () {
					var self = this,
						info = self.info;

					$rootScope.$broadcast("event:autoLoader", false);
					LoginSvc.login(info).then(function (res) {
						if (self.isRegisterId) {
							$window.localStorage.setItem("recentLoginInfo", JSON.stringify({bsCd: info.bsCd, user: info.user, password: info.password}));
						}
						
						res.data.NO_C = info.bsCd;

						$rootScope.$emit("event:setUser", res.data);
						$rootScope.$emit("event:setMenu", MenuSvc.setMenu(res.data.MENU_LIST).getMenu());
						$rootScope.$emit("event:autoLoader", true);
						
						if(self.url) $state.go(self.url);
						else 		 $state.go(MenuSvc.getDefaultUrl(), { menu: true, ids: null });
					});
				};

				loginVO.modalRePassword = function () {
					var self = this,
						modalInstance = $modal.open({
						options: {
							modal: true,
							resizable: true,
							widht: 450,
							visible: false
						},
						templateUrl : "app/shared/modal/setupRePassword/modal.setupRePassword.tpl.html",
                        controller  : "modal.setupRePasswordCtrl",
                        size        : "sm"
					});
					modalInstance.result.then(function ( result ) {
                    });
				}

				loginVO.initLoad();
			}
		]);
}());
