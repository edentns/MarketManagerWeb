(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Code.service : sy.CodeSvc
     * 코드관리
     */
    angular.module("sy.Code.service")
        .factory("sy.CodeSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
                // [GET]
                getCodeTypeList: function () {// 모든 코드유형을 가져온다.
                    return $http({
                        method: 'GET',
                        url		: APP_CONFIG.domain +'/codetype'
                    });
                },

                /**
                 * 직군별로 SUB코드를 가져온다.
                 * @param param
                 * @returns {*}
                 */
                getSubGroupcodeList: function ( param ) {
                    return $http({
                        method  : "GET",
                        url		: APP_CONFIG.domain +"/code/"+ param.cd +"?group="+ param.group
                    });
                },


                /**
                 * 사용자 코드를 저장한다.
                 * @param {Array} aParam 저장데이터
                 * @returns {*}
                 */
                saveUserCode : function ( aParam ) {
                    return $http({
                        method   : "POST",
                        url		: APP_CONFIG.domain +"/code",
                        data     : aParam
                    });
                },

                /**
                 * 분류코드를 가져온다.
                 * @param {Object} oParam 조회 데이터
                 * @returns {*}
                 */
                getGroupCode : function ( oParam ) {
                    return $http({
                        method  : "GET",
                        url		: APP_CONFIG.domain +"/code?"+ $.param( oParam )
                    });
                },

                /**
                 * 사용자코드를 가져온다.
                 * @param {oObject} oParam 조회 데이터
                 * @returns {*}
                 */
                getUserCode : function ( oParam ) {
                    return $http({
                        method  : "GET",
                        url 	:  APP_CONFIG.domain +"/code?"+ $.param( oParam )
                    });
                },

                /**
                 * 시스템코드를 가져온다.
                 * @param {oObject} oParam 조회 데이터
                 * @returns {*}
                 */
                getSystemCode : function ( oParam ) {
                    return $http({
                        method: "GET",
                        url: APP_CONFIG.domain + "/code?" + $.param(oParam)
                    });
                },

                /**
                 * 그룹코드의 sub코드를 가져온다.
                 * @param param
                 * @returns {*}
                 */
                getSubcodeList: function ( param ) {
                    return $http({
                        method  : "GET",
                        url     :  APP_CONFIG.domain +"/code/"+ param.cd
                    });
                },



	            /**
	             * 서비스관리 부서정보를 가져온다.
	             * @param {{type:string, mgrDept: number|Array.<number>, wkGroup: number}} p
	             * @description
	             * type - dept(부서), user(유저)
	             * mgrDept - 부서코드(기본값 0)
	             * wkGroup - 직군코드(기본값 0)
	             */
	            getDeptOrUserCdList : function ( p ) {
		            var url = APP_CONFIG.domain +"/svCode/"+ p.type,
			            mgrStr = "";

					if ( p.type==="user" && p.mgrDept ) {
						mgrStr = "&"+ edt.makeGetParam( p.mgrDept, "mgrDept" );
						delete p.mgrDept;
					}
		            delete p.type;

		            url = url +"?"+ $.param( p ) + mgrStr;

		            return $http({
			            method : "GET",
			            url    : url
		            });
	            }

            };
        }]);
}());