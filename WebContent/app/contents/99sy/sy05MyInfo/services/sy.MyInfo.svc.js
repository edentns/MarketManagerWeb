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
                 * 비밀번호를 변경한다.
                 * @param   {Object} param - 수정될 데이터
                 * @returns {Object} result
                 */
                updatePassword: function (param) {
                    return $http({
                        method	: "PUT",
                        url		: APP_CONFIG.domain +"/user/private",
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
                        CD					: null,
                        oldPassword	: param.currentPw,
                        newPassword	: param.newPw
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
                        if ( param.newPw==="" || param.newPw.length<6 ) {
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
                }
            };
        }]);

}());