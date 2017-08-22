(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @description
	 * 상품 유틸 서비스
	 */
	angular.module('edtApp.common.service').service('Util03saSvc', ['$rootScope', '$state', '$window', '$http', 'APP_CONFIG', 'MenuSvc',
		function ($rootScope, $state, $window, $http, APP_CONFIG, MenuSvc) {
			var user = $rootScope.webApp.user,
				menu = $rootScope.webApp.menu;
						
			//popup insert & update Validation
            this.readValidation = function(idx){
            	var result = true;
        		if(idx.NM_MRK === null || idx.NM_MRK === ""){ alert("마켓명을 입력해 주세요."); result = false; return; };
        		if(idx.CD_ORDSTAT === null || idx.CD_ORDSTAT === ""){ alert("주문상태를 입력해 주세요."); result = false; return;};
        		if(idx.DTS_CHK === null || idx.DTS_CHK === ""){ alert("기간을 선택해 주세요."); result = false; return;};			 
        		if(idx.DTS_TO < idx.DTS_FROM){ alert("조회기간을 올바르게 선택해 주세요."); result = false; return;};	
        		if(idx.CD_CCLSTAT === null || idx.CD_CCLSTAT === ""){ alert("취소상태를 선택해 주세요."); return false;};
            	return result;
            };
		}
	]);
}());