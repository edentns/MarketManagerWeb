(function () {
    "use strict";

    /**
     * 내정보관리
     * @name sy.MyInfo.service : sy.MyInfoSvc
     */
    angular.module("sy.MyInfo.service")
        .factory("sy.MyInfoSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	/**
                 * 프로파일을 변경한다.
                 * @param   {Object} param - 수정될 데이터
                 * @returns {Object} result
                 */
                updateProfile: function (param) {
                    return $http({
                        method	: "PUT",
                        url		: APP_CONFIG.domain +"/sy05MyInfo/profile",
                        data	: param
                    });
                },
                
                /**
                 * 비밀번호를 변경한다.
                 * @param   {Object} param - 수정될 데이터
                 * @returns {Object} result
                 */
                updatePassword: function (param) {
                    return $http({
                        method	: "PUT",
                        url		: APP_CONFIG.domain +"/sy05MyInfo/pwd",
                        data	: param
                    });
                },
                
                updateYn: function (param) {
                    return $http({
                        method	: "PUT",
                        url		: APP_CONFIG.domain +"/sy05MyInfo/yn",
                        data	: param
                    });
                },
                
                /**
                 * 패스워드 변경을 위한 parameter를 생성한다.
                 * @param {Object} myInfoVO 비밀번호변경 VO
                 * @returns {{CD: null, oldPassword: ($scope.myInfoVO.param.currentPw|*), newPassword: ($scope.myInfoVO.param.newPw|*)}}
                 */
                makePwParam: function ( myInfoVO ) {
                    var param = myInfoVO.param;
                    return {
                    	OLD_DC_PWD	: param.currentPw,
                    	DC_PWD		: param.newPw
                    };
                },
                
                makeYnParam: function ( myInfoVO ) {
                    var param = myInfoVO.param;
                    return {
                    	YN_SMS		: param.YN_SMS,
                    	YN_EMI		: param.YN_EMI
                    };
                },

                /**
                 * 비밀번호 확인 메세지를 변경한다.
                 * @param {Object} myInfoVO 비밀번호변경 VO
                 */
                changeMessage: function ( myInfoVO ) {
                    var param = myInfoVO.param;
                    param.isEquals = false;

                    // 현재비밀번호 공백
                    if ( param.currentPw === "" ) {
                        param.message = "비밀번호를 입력해주세요.";
                    } else {
                        if ( param.newPw==="" || param.newPw.length<6 || param.newPw === "undefined" ) {
                            param.message = "비밀번호는 6자리이상 15자리 이하입니다.";
                        } else {
                            if ( param.newPw === param.newPwChk ) {
                                param.message   = "비밀번호가 수정 가능합니다.";
                                param.isEquals  = true;
                            } else {
                                param.message = "새비밀번호가 일치하지 않습니다.";
                            }
                        }
                    }
                },
                
                /**
                 * 로그인한 사원의 닉네임이 있는지 조회 없으면 에러
                 * @returns {Object} result
                 */
                selectYnNkne: function () {
                    return $http({
                        method	: "GET",
                        url		: APP_CONFIG.domain +"/sy05MyInfo/ynNkne"
                    });
                },
                
                /**
				 * 닉네임 중복 체크
				 * @param {{nmNkne:string}} 닉네임
				 * @returns {*}
				 */
                dupCheckNmNkne : function (nmNkne) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/sy05MyInfo/dupCheckNmNkne",
						headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
						data    : $.param({L_NM_NKNE:nmNkne})
					});
				},
            };
        }]);

}());