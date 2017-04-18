(function () {
	"use strict";


	function ModalSearchUserSvc (SyDepartSvc, SyUserListSvc, UtilSvc) {

		var cache = null;

		/**
		 * dependency param을 할당한다.
		 * @param {Object} poSearch
		 * @param {Object} poParm
		 */
		this.init = function (poSearch, poParm) {
			angular.extend(poSearch, poParm);
		};

		/**
		 * 부서코드를 조회한다.
		 * @poParam {Object} poParam
		 */
		this.getDeptCodeList = function (poParam) {
			return SyDepartSvc.getDepart(poParam);
		};

		/**
		 * 검색조건을 생성한다.
		 * @param poSearch
		 * @returns {{dept: (*|string), wk_grp: (*|string), name: (*|string), pos: string, status: *}}
		 */
		this.makeGetParam = function (poSearch) {
			var rtnParam = {
				dept : UtilSvc.isValid(poSearch.dept) ? poSearch.dept : 'all',
				wk_grp : poSearch.wk_grp,
				name : UtilSvc.isValid(poSearch.name) ? poSearch.name : 'all',
				pos  : 'all',
				status : poSearch.status
			};

			if (poSearch.searchFlag) {
				rtnParam.searchFlag = poSearch.searchFlag;
			}

			return $.param(rtnParam);
		};

		/**
		 * 전체 유저정보를 조회한다.
		 * @param {Object} poSearch
		 * @returns {*}
		 */
		this.getUserList = function (poSearch) {
			return SyUserListSvc.getUserList(this.makeGetParam(poSearch));
		};

		/**
		 * 유저정보를 selectedUser model에 할당한다.
		 * @param {Object} poSelectedUserVO
		 * @param {Object} poSelectedUser
		 */
		this.setUser = function (poSelectedUserVO, poSelectedUser) {
			poSelectedUser.selected = true;
			poSelectedUserVO.departCd = poSelectedUser.DEPT_CD;
			poSelectedUserVO.depart   = poSelectedUser.DEPT_NAME;
			poSelectedUserVO.roleCd   = poSelectedUser.ROLE_CD;
			poSelectedUserVO.empNo 	  = poSelectedUser.CD;
			poSelectedUserVO.name 	  = poSelectedUser.NAME;

			this.setCache(poSelectedUser);
		};

		/**
		 * 선택된 유저가 유효한지 판단하다.
		 * @param {Object} poSelectedUser
		 * @returns {boolean}
		 */
		this.isValid = function (poSelectedUser) {
			if (poSelectedUser.empNo === '') {
				alert("유저를 선택해주세요.");
				return false;
			}
			return true;
		};

		/**
		 * 선택된 유저를 캐시한다.
		 * @param poUser
		 */
		this.setCache = function (poUser) {
			if (cache) {
				cache.selected = false;
			}
			cache = poUser;
		};
	}

	ModalSearchUserSvc.$inject = ['sy.departSvc', 'sy.userListSvc', 'UtilSvc'];


	/**
	 *  유저검색
	 */
	angular.module('edtApp.common.modal').service('ModalSearchUserSvc', ModalSearchUserSvc);
}());