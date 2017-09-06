(function () {
	"use strict";

	angular.module("sy.Login.controller")
		.controller("sy.LoginCtrl", ["$rootScope", "$scope", "$modal", "$state", "sy.LoginSvc", "APP_CONFIG", "$window", "$http", "MenuSvc", "$timeout",  
			function ($rootScope, $scope, $modal, $state, LoginSvc, APP_CONFIG, $window, $http, MenuSvc, $timeout) {
				var loginVO;
				
				/** test
				 * loginVO 초기값 설정
				 */
				loginVO = $scope.loginVO = {
					isRegisterId: false,
					info		: { bsCd    : APP_CONFIG.bsCd, user	: "", password: "" },
					version	: APP_CONFIG.version,
					url : ""
				};

				/**
				 * 초기 로드시 실행
				 */
				loginVO.initLoad = function () {
					var self = this,
						recentLoginInfo = $window.localStorage.getItem("recentLoginInfo"); // 기억한 로그인 정보
					
					if (recentLoginInfo) {
						recentLoginInfo    = JSON.parse(recentLoginInfo);
						self.info.bsCd     = recentLoginInfo.bsCd;
						self.info.user 	   = recentLoginInfo.user;
						self.isRegisterId  = true;
					}

					$timeout(function () {
						if(recentLoginInfo) edt.id("passWord").focus();
						else                edt.id("bsCdId").focus();
                    }, 500);
				};

				/**
				 * 로그인 버튼 클릭
				 */
				loginVO.doLogin = function () {
					var self = this,
						info = self.info;

					$rootScope.$broadcast("event:autoLoader", false);
					LoginSvc.login(info).then(function (res) {
						if (self.isRegisterId) {
							$window.localStorage.setItem("recentLoginInfo", JSON.stringify({bsCd: info.bsCd, user: info.user}));
						}
						else {
				            $window.localStorage.removeItem("recentLoginInfo");
						}
						
						res.data.NO_C = info.bsCd;

						$rootScope.$emit("event:setUser", res.data);
						$rootScope.$emit("event:setMenu", MenuSvc.setMenu(res.data.MENU_LIST).getMenu());
						$rootScope.$emit("event:autoLoader", true);
						
						$state.go(MenuSvc.getDefaultUrl(), { menu: true, ids: null });
					});
				};

				/**
				 * 비밀번호재설정 팝업창 띄우기
				 */
				loginVO.modalRePassword = function () {
					var self = this,
						modalInstance = $modal.open({
						options: {
							modal: true,
							resizable: true,
							width: 450,
							visible: false
						},
						templateUrl : "app/shared/modal/mo03RePwd/modal.mo03RePwd.tpl.html",
                        controller  : "modal.mo03RePwdCtrl",
                        size        : "sm"
					});
					modalInstance.result.then(function ( result ) {
                    });
				}


				/**
				 * 비밀번호재설정 팝업창 띄우기
				 */
				loginVO.modalUserJoin = function () {
					var self = this,
						modalInstance = $modal.open({
						options: {
							modal: true,
							resizable: true,
							width: 450,
							height: 800,
							visible: false
						},
						templateUrl : "app/shared/modal/mo02UserJoin/modal.mo02UserJoin.tpl.html",
                        controller  : "modal.mo02UserJoinCtrl",
                        size        : "lg"
					});
					modalInstance.result.then(function ( result ) {
                    });
				}
				
				loginVO.initLoad();
			}
		]);
}());
