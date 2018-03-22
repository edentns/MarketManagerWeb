(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name sy.login.service:login.LoginService
	 */
	angular.module("sy.Login.service")
		.factory("sy.LoginSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {

			return {
				/**
				 * 로그인을 한다.
				 * @param {{bsCd:string, user:string, password:string}} userDataSet
				 * @returns {*}
				 */
				login : function (userDataSet) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/login",
						headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
						data	: $.param(this.makeLoginParam(userDataSet))
					});
				},

				/**
				 * 로그아웃을 한다.
				 * @returns {*}
				 */
				logout : function () {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/logout",
						headers	: {
							"Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8",
							NO_M : ""
						}
					});
				},

				/**
				 * 로그인 여부를 체크한다.
				 * @returns {*}
				 */
				isLogin : function () {
					return $http.get(APP_CONFIG.domain+ "/logincheck");
				},

				getLoginedInfo: function() {
					return $http.get(APP_CONFIG.domain+ "/loginInfo");
				},

				/**
				 * 로그인 Parameter 생성한다.
				 * @param {{bsCd:string, user:string, password:string}} userDataSet
				 * @returns {{NO_C:string, user:string, password:string}}
				 */
				makeLoginParam : function (userDataSet) {
					return {
						NO_C : userDataSet.bsCd,
						user : userDataSet.user,
						password : userDataSet.password
					};
				},
				
				/**
				 * 로그인을 한다.
				 * @param {{bsCd:string, user:string, password:string}} userDataSet
				 * @returns {*}
				 */
				setupRePwd : function (email) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/setupRePwd",
						headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
						data	: $.param({DC_EMIADDR:email})
					});
				},

				/**
				 * 본인확인
				 * @param {{bsCd:string, user:string, password:string}} userDataSet
				 * @returns {*}
				 */
				doChkMe : function (email) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/chkMe",
						headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
						data	: $.param({DC_EMIADDR:email})
					});
				},

				/**
				 * 본인확인업데이트
				 * @param {{bsCd:string, user:string, password:string}} userDataSet
				 * @returns {*}
				 */
				updateChkMeConf : function (noOwnconf) {
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/chkMeConf?NO_OWNCONF="+noOwnconf,
						headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" }
					});
				},
				
				/**
				 * 사업자명, 이메일 중복 체크
				 * @param {{nmC:string}} 사업자명
				 * @param {{dcEmiaddr:string}} 이메일
				 * @returns {*}
				 */
				dupCheckNmC : function (nmC, dcEmiaddr) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/dupCheckNmC",
						headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
						data    : $.param({L_NM_C:nmC, L_DC_EMIADDR:dcEmiaddr})
					});
				},
				
				/**
				 * 약관조회
				 * @param {{NM_C:string}} userDataSet
				 * @returns {*}
				 */
				selectCla : function (cdClaclft) {
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/selectCla?L_CD_CLA="+cdClaclft,
						headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" }
					});
				},

				/**
				 * 회원가입
				 * @param {{}} data
				 * @returns {*}
				 */
				saveUserJoin : function (userJoinVO) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/saveUserJoin",
						data    : userJoinVO
					});
				},
				
				/**
				 * 광고조회
				 * @param {{NM_C:string}} NO_AVTMCLFT
				 * @returns {*}
				 */
				selectAvtm : function (NO_AVTMCLFT) {
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/ut09Avtm?NO_AVTMCLFT="+NO_AVTMCLFT,
						headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" }
					});
				}
			};
		}]);
}());