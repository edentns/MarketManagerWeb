(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @description
	 * 관리자 유틸 서비스
	 */
	var directives = angular.module('edtApp.common.service').service('Util01maSvc', ['$rootScope', '$state', '$window', '$http', 'APP_CONFIG', 'MenuSvc',
		function ($rootScope, $state, $window, $http, APP_CONFIG, MenuSvc) {
			var user = $rootScope.webApp.user,
				menu = $rootScope.webApp.menu;
			
			/**
			 * 메모제이션 조회처리
			 * procedureParam : 
			 * @param {JSON}
			 * @returns {JSON} : 
			 */
			this.getListMset = function ( param, seq ) {
				var me = this;
								
				if(!me.getListMset.cache[seq]){
					var result = $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/ut02Db/",
						data	: param
					}).success(function (data, status, headers, config) {
						if(data.success !== 1 && data.errors.length > 0) {
							alert("조회 실패하였습니다.!! 연구소에 문의 부탁드립니다.\n("+data.errors[0].LMSG+")");
							return;
						}
					}).error(function (data, status, headers, config) {
						console.log("error",data,status,headers,config);
					});
					me.getListMset.cache[seq] = result;
				}				
				return me.getListMset.cache[seq];
			};
			
			this.getListMset.cache = {};
			
			/**
			 * 코드로 나오는 상태를 이름이 나올수 있게 변경
			 * procedureParam : 
			 * @param {JSON}
			 * @returns {JSON} : string
			 */
			this.changeCDToNM = function(obj, inGrdDB){
            	var nmd = obj,
            	    grd = inGrdDB, 
            	    result = '';
            	for(let i=0, leng=grd.length; i<leng; i++){
            		if(grd[i].CD_DEF === nmd){
            			result = grd[i].NM_DEF;
            		};
            	}
            	return result;
            }
		}
	]);
	
	directives.directive("colorMatches", [
      function () {
          return {
              restrict: "A",
              link: function (scope, element, attrs) {
                  scope.$watch(attrs.colorMatches, function (newValue, oldValue) {
                      var dataItemValue = element.data("value");
                      var index = dataItemValue.toLowerCase().indexOf(newValue.toLowerCase());
                      if (index >= 0) {
                          var index = dataItemValue.toLowerCase().indexOf(newValue.toLowerCase());
                          var length = newValue.length;
                          var original = dataItemValue.substr(index, length);
                          var newText = dataItemValue.replace(original, "<span class='query-match'>" + original + "</span>");
                          element.html(newText);
                      }
                      else {
                          element.html(dataItemValue);
                      }
                      return;
                  });
              }
          };
      }
    ]);
}());