(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name te.Otherkendo.service : te.OtherKendo
     * 부서관리
     */
    
    angular.module("te.OtherKendo.service")
        .factory("te.OtherKendoSvc", TeOtherKendoSvc)
            
        TeOtherKendoSvc.$inject = [ 'ModalSvc', 'APP_CONFIG', '$http'];
        	function TeOtherKendoSvc(ModalSvc, APP_CONFIG, $http) {
				
        	return {
            	/**
            	 * 함기현 - 주소검색창 새로 구현중
            	 */
            	modalCustCmp: function () {
    				var modalInstance = ModalSvc.openHSearchCustCmp();
    				return modalInstance.result;
    			},

	            /**
	             * 컨설턴트를 포함하는 상위부서를 가져온다.
	             * @param {{wk_grp:Number}} param
	             * @returns {promise}
	             */
	            getMngDepart: function (param) {
		            var url = APP_CONFIG.domain +"/kindDept";

		            if (param) { url += "?"+ $.param(param); }

		            return $http({
			            method : "GET",
			            url    : url
		            });
	            },

                /**
                 * 부서정보를 가져온다.
                 * @param {Object} param 부서정보를 가져오기 위한 parameter
                 * @returns {*}
                 */
                getDepart : function (param) {
                    var url = APP_CONFIG.domain +"/dept";

                    if (angular.isObject(param)) {
                        url += "?"+ $.param(param);
                    }

                    return $http({
                        method : "GET",
                        url    : url
                    });
                },

                /**
                 * 하위부서 코드리스트를 가져온다.
                 * @param {Object} param
                 * @returns {*}
                 */
                getLowDeptList: function ( param ) {
                    var url = APP_CONFIG.domain +"dept?";

                    if ( param.USER_CD ) {
                        delete param.cd;
                        url += $.param( param );
                    } else {
                        url += "mgr_cd="+ param.mgr_cd;
                    }

                    return $http({
                        method : "GET",
                        url    : url
                    });
                },

                /**
                 * 부서코드를 저장, 수정, 삭제한다.
                 * @param oParam
                 * @returns {*}
                 */
                save : function (oParam) {
                    return $http({
                        method : "POST",
                        url    : APP_CONFIG.domain +"/dept",
                        data   : oParam
                    });
                },
                
                /**
                 * 부서코드를 저장, 수정, 삭제한다.
                 * @param oParam
                 * @returns {*}
                 */
                chkKey : function (oParam) {
                    return $http({
                        method : "POST",
                        url    : APP_CONFIG.domain +"/shpingapikeytest",
                        data   : oParam
                    });
                }
            };
        };
}());