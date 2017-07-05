(function () {
	"use strict";

	/**
	 * 공통 모달 서비스
	 * @constructor
	 */
	angular.module("edtApp.common.service")
		.service("ModalSvc", ["$modal",
			function ($modal) {
				var self = this;
				
				self.openIt01ItemCfct = function (NO_MNGMRK,options) {
					var self = this,
					defaults = {
						templateUrl: "app/shared/modal/it01ItemCfct/modal.ItemCfct.tpl.html",
						controller : "modal.itemCfct",
						resolve    : { sendData:function(){
										return NO_MNGMRK;
										}},
						size       : "lg"
					};

				if (options) { defaults = angular.extend(defaults, options); }

				return $modal.open(defaults);
			};
				
				/**
            	 * 함기현 - 주소검색창 새로 구현중
            	 */
				self.openHSearchCustCmp = function (options) {
					var self = this,
						defaults = {
							templateUrl: "app/shared/modal/searchAddress/modal.searchAddress.tpl.html",
							//controller : "modal.searchAddressCtrl",
							size       : "lg"
						};

					if (options) { defaults = angular.extend(defaults, options); }

					return $modal.open(defaults);
				};
				

				/**
				 * 고객사 검색 모달팝업을 연다.
				 * @param {object=} options 모달팝업 options
				 * @returns {*|Window|{error, options}}
				 */
				self.openSearchCustCmp = function (options) {
					var self = this,
						defaults = {
							templateUrl: "app/shared/modal/searchCompany/modal.searchCompany.tpl.html",
							controller : "modal.searchCompanyCtrl",
							size       : "lg"
						};

					if (options) { defaults = angular.extend(defaults, options); }

					return $modal.open(defaults);
				};

				/**
				 * 담당자 검색 모달팝업을 연다.
				 * @param {object=} options 모달팝업 options
				 * @returns {*|Window|{error, options}}
				 */
				self.openSearchCulnCharge = function (options) {
					var self = this,
						defaults = {
							templateUrl : "app/shared/modal/searchCompany/modal.searchCuInCharge.tpl.html",
							controller  : "modal.searchCuInChargeCtrl",
							size        : "lg"
						};

					if (options) { defaults = angular.extend(defaults, options); }

					return $modal.open(defaults);
				};

				/**
				 * 변경장비번호 검색 모달팝업을 연다.
				 * @param {object=} options 모달팝업 options
				 * @returns {*|Window|{error, options}}
				 */
				self.openSearchChangeEqmNo = function (options) {
					var self = this,
						defaults = {
							templateUrl: "app/shared/modal/eqm/modal.searchChangeEqmNo.tpl.html",
							controller : "modal.searchChangeEqmNoCtrl",
							size       : "lg"
						};

					if (options) { defaults = angular.extend(defaults, options); }

					return $modal.open(defaults);
				};

				/**
				 * 장비 검색 모달팝업을 연다.
				 * @param {object=} options 모달팝업 options
				 * @returns {*|Window|{error, options}}
				 */
				self.openSearchEqm = function (options) {
					var self = this,
						defaults = {
							templateUrl: "app/shared/modal/eqm/modal.searchEqm.tpl.html",
							controller : "modal.searchEqmCtrl",
							size       : "lg",
							resolve: {
								resolveParam: function () { return null; }
							}
						};

					if (options) { defaults = angular.extend(defaults, options); }

					return $modal.open(defaults);
				};

				/**
				 * 사원 검색 모달팝업을 연다.
				 * @param {object=} options 모달팝업 options
				 * @returns {*|Window|{error, options}}
				 */
				self.openSearchEmp = function (options) {
					var self = this,
						defaults = {
							templateUrl: "app/shared/modal/emp/modal.searchEmp.tpl.html",
							controller : "modal.searchEmpCtrl",
							size       : "lg",
							resolve: {
								resolveParam: function () { return null; }
							}
						};
					if (options) { defaults = angular.extend(defaults, options); }

					return $modal.open(defaults);
				};

				/**
				 * 사원 검색 모달팝업을 연다.
				 * @param options
				 */
				self.openSearchMember = function(options) {
					var self = this,
						defaults = {
							templateUrl : "app/shared/modal/searchMember/modal.searchMember.tpl.html",
							controller  : "modal.searchMemberCtrl",
							size        : "lg",
							resolve: {
								resolveParam: function () { return null; }
							}
						};
					if (options) { defaults = angular.extend(defaults, options); }

					return $modal.open(defaults);
				};

				/**
				 * 그리드 column 설정 모달팝업을 연다.
				 * @param options
				 * @returns {*|Window|{error, options}}
				 */
				self.openSetColumn = function (options) {
					var self = this,
						defaults = {
							templateUrl : "app/shared/modal/selectColumns/modal.selectColumns.tpl.html",
							controller  : "modal.selectColumnsCtrl",
							size: "lg",
							resolve: {
								resolveParam: function () { return null; }
							}
						};
					if (options) { defaults = angular.extend(defaults, options); }

					return $modal.open(defaults);
				};
				
				self.openConfirmPopup = function(options) {
                    var defaults = {
                            size   : "sm",
                            resolve: {
                                resolveParam: function () { return null; }
                            }
                        };
                    if (options) { defaults = angular.extend(defaults, options); }
					
					return $modal.open(defaults);
				};

				/**
				 * 모달 상세 팝업을 연다.
				 * @param {object} options
				 */
				self.detailPopup = function (options) {
					var	defaults = {
						templateUrl : "app/shared/modal/commonDetail/modal.detail.tpl.html",
						controller  : "ModalDetailCtrl",
						size: "lg",
						resolve: {
							resolveParam: function () { return null; }
						}
					};
					if (options) { defaults = angular.extend(defaults, options); }

					return $modal.open(defaults);
				};
			}
		]);
}());