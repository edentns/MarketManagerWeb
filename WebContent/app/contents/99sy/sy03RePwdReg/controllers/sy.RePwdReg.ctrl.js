(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.RePwdReg.controller : sy.RePwdRegCtrl
     * 비밀번호 재설정 등록
     */
    angular.module("sy.RePwdReg.controller")
        .controller("sy.RePwdRegCtrl", ["$rootScope", "$scope", "$http", "$q", "$log", "sy.RePwdRegSvc", "APP_CODE", "$timeout", "resData", "Page", "APP_CONFIG", "$location", 
            function ($rootScope, $scope, $http, $q, $log, syRePwdRegSvc, APP_CODE, $timeout, resData, Page, APP_CONFIG, $location) {
	            //var page  = $scope.page = new Page({ auth: resData.access }),
		        //    today = edt.getToday();
        		var rePwdRegVO;
        		
        		rePwdRegVO = $scope.rePwdRegVo = {
        			imagePath : APP_CONFIG.domain + "/captcha",
        			password : "",
        			repassword : "",
        			captcha: ""
        		};

				/**
				 * 초기 로드시 실행된다.
				 */
        		rePwdRegVO.initLoad = function () {
					var self = this;
					
					$timeout(function () {
                        edt.id("userPw").focus();
                    }, 500);
				};

				/**
				 * 비밀번호 변경
				 */
        		rePwdRegVO.doRefresh = function () {
					var self = this;
					//alert("변경완료하였습니다.");
					self.imagePath = self.imagePath + "?id=" + Math.random();
				};
				
				/**
				 * 비밀번호 변경
				 */
        		rePwdRegVO.doRePwd = function () {
					var self = this;

                    // PASSWORD
					if (!self.password) {
						return edt.invalidFocus("userPw", "[필수] 패스워드를 입력해주세요.");
					} else {
						if (!/^[a-zA-Z0-9~`|!@#$%^&*()[\]\-=+_|{};':\\\"<>?,./]{5,14}$/.test(self.password)) {
							return edt.invalidFocus("userPw", "[형식] 패스워드는 유효하지 않은 형식입니다. 5~14자리 이하입니다.");
						} else {
							if (self.repassword !== self.password) {
								return edt.invalidFocus( "userChkPw", "[MATCH] 비밀번호가 일치하지 않습니다." );
							}
						}
					}
					
					if (!self.captcha) {
						return edt.invalidFocus("captchaId", "[필수] 보안문자를 입력해주세요.");
					}
					
					syRePwdRegSvc.rePwd(resData.DC_URLCRYTO, self.password, self.captcha).then(function (result) {
						alert("변경완료하였습니다.");
						$location.url("/99sy/syLogin");
                	});
				};

				/**
				 * 비밀번호 변경
				 */
        		rePwdRegVO.doLogin = function () {
					var self = this;
		            $location.url("/99sy/syLogin");
				};
				
				rePwdRegVO.initLoad();
            }]);
}());