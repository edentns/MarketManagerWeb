(function () {
	'use strict';

	function PageVO($rootScope, $q, APP_AUTH, UtilSvc) {
		function Page(config) {
			var user = $rootScope.webApp.user,
				me = this;

			me.user = {
				id              : user.CD,
				name            : user.NAME,
				deptCode        : user.DEPT_CD,
				deptName        : user.DEPT_NAME,
				posCode         : user.POS_CD,
				posName         : user.POS_NAME,
				workGroupCode   : user.WORK_GROUP,
				workGroupName   : user.WORK_GROUP_NAME,
				email           : user.EMAIL,
				hireStatus      : user.STATUS,
				hireDate        : user.HIRE_D
			};
			me.auth = {
				accessCode  : 1,
				writeCode   : 1,
			};

			me.preProcessors    = [];
			me.postProcessors   = [];

			me.setConfig(config);
		};

		Page.prototype = {
			/**
			 * key와 매칭되는 Page Key를 가져온다.
			 * @param {string} category - Page에 존재하는 객체 Key
			 * @param {string} key - 매핑되어야 할 Key
			 * @returns {string|null}
			 */
			getMatchKey: function(category, key) {
				if (!this[category]) {
					throw new TypeError('This is not valid. The '+ category +' is not existed in Page.');
				}

				if (category === "auth") {
					switch (key) {
						case 'CD_ACC'       : return 'accessCode';
						case 'CD_WRITE'     : return 'writeCode';
						default             : return null;
					}
				} else if (category === "user") {
					switch (key) {
						case 'CD'           : return 'id';
						case 'NAME'         : return 'name';
						case 'DEPT_CD'      : return 'deptCode';
						case 'DEPT_NAME'    : return 'deptName';
						case 'POS_CD'       : return 'posCode';
						case 'POS_NAME'     : return 'posName';
						case 'WORK_GROUP'   : return 'workGroupCode';
						case 'WORK_GROUP_NAME': return 'workGroupName';
						case 'EMAIL'        : return 'email';
						case 'STATUS'       : return 'hireStatus';
						case 'HIRE_D'       : return 'hireDate';
						default             : return null;
					}
				}
			},
			/**
			 * Page에 필요한 정보를 설정한다.
			 * @param {object} config - Page 설정 값
			 * @param {object} config.user - User 정보
			 * @param {object} config.auth - Auth 정보
			 */
			setConfig: function(config) {
				var me = this;
				angular.forEach(config, function(data, key) {
					angular.forEach(data, function(d, k) {
						me[key][me.getMatchKey(key, k)] = d;
					});

				});
			},
			/**
			 * 접근권한이 있는지 판단한다.
			 * @returns {boolean}
			 */
			isAccessable: function() {
				var me = this,
					accessList = arguments.length ? Array.prototype.slice.call(arguments) : ['default'];

				return me._checkAuth('accessCode', accessList);
			},
			/**
			 * 쓰기 권한이 있는지 판단한다.
			 * @returns {boolean}
			 */
			isWriteable: function() {
				var me = this,
					accessList = arguments.length ? Array.prototype.slice.call(arguments) : ['default'];

				return me._checkAuth('writeCode', accessList);
			},
			/**
			 * 전체 쓰기 권한이 있는지 판단한다.
			 * @returns {boolean}
			 */
			isWriteableAll: function() {
				return this.isWriteable(APP_AUTH.ALL);
			},
			/**
			 * Manager 쓰기 권한이 있는지 판단한다.
			 * @returns {boolean}
			 */
			isWriteableManager: function() {
				return this.isWriteable(APP_AUTH.MANAGER);
			},
			/**
			 * Team 쓰기 권한이 있는지 판단한다.
			 * @returns {boolean}
			 */
			isWriteableTeam: function() {
				return this.isWriteable(APP_AUTH.TEAM);
			},
			/**
			 * 개인 쓰기 권한이 있는지 판단한다.
			 * @returns {boolean}
			 */
			isWriteableIndividual: function() {
				return this.isWriteable(APP_AUTH.INDIVIDUAL);
			},
			/**
			 * 전체 접근 권한이 있는지 판단한다.
			 * @returns {boolean}
			 */
			isAccessAll: function() {
				return this.isAccessable(APP_AUTH.ALL);
			},
			/**
			 * Manager 접근 권한이 있는지 판단한다.
			 * @returns {boolean}
			 */
			isAccessManager: function() {
				return this.isAccessable(APP_AUTH.MANAGER);
			},
			/**
			 * Team 접근권한이 있는지 판단한다.
			 * @returns {*|boolean}
			 */
			isAccessTeam: function() {
				return this.isAccessable(APP_AUTH.TEAM);
			},
			/**
			 * 개인 접근권한이 잇는지 판단한다.
			 * @returns {boolean}
			 */
			isAccessIndividual: function() {
				return this.isAccessable(APP_AUTH.INDIVIDUAL);
			},
			/**
			 * 해당 권한이 있는지 판단한다.
			 * @param {string} name - key name(CD_ACC, CD_WRITE)
			 * @param {Array.<string>} accessList
			 * @returns {boolean}
			 * @private
			 */
			_checkAuth: function(name, accessList) {
				var me = this,
					authValue   = me.auth[name],
					result      = false,
					i, lng, data;

				for (i=0, lng=accessList.length; i<lng; i++) {
					data = accessList[i];
					switch (data) {
						case APP_AUTH.ALL:
							result = authValue === 2;
							break;
						case APP_AUTH.MANAGER:
							result = authValue === 3;
							break;
						case APP_AUTH.TEAM:
							result = authValue === 4;
							break;
						case APP_AUTH.INDIVIDUAL:
							result = authValue === 5;
							break;
						default:
							result = authValue > 1;
							break;
					}

					if (result) {
						return result;
					}
				}

				return result;
			},
            /**
             * 접근코드로 유저 권한 정보를 가져온다
             * @param {number} accessCode - 접근코드
             * @returns {{all: boolean, manager: boolean, team: boolean, individual: boolean}}
             */
			getUserAuth: function(accessCode) {
				accessCode = accessCode || 1;
                return {
                    all         : accessCode === 2,
                    manager     : accessCode <= 3 && accessCode !== 1 && accessCode > 0,
                    team        : accessCode <= 4 && accessCode !== 1 && accessCode > 0,
                    individual  : accessCode <= 5 && accessCode !== 1 && accessCode > 0
                };
			},
			/**
			 * 직군이 영업인지 판단한다.
			 * @returns {boolean}
			 */
			isSalesWorkGroup: function() {
				return this.user.workGroupCode === 2;
			},
			/**
			 * prcoess를 등록한다.
			 * @param {string} key - process name
			 * @param {Array} dependencies - 의존된 function name
			 * @param {function} definedFnc - 정의할 핢수
			 */
			setProcessor: function(key, dependencies, definedFnc) {
				var me = this,
					result;

				if (arguments.length === 2) {
					definedFnc      = dependencies;
					dependencies    = [];
				}

				result = definedFnc.call(me);

				if (result.pre) {
					setPreProcessor(key, dependencies, result.pre);
				}
			},
			/**
			 * page를 로드전 실행될 process를 추가한다.
			 * @param {string} key - process name
			 * @param {Array} dependencies - 의존된 function name
			 * @param {function} definedFnc - 정의할 핢수
			 */
			setPreProcessor: function(key, dependencies, definedFnc) {
				var me = this;

				if (arguments.length === 2) {
					definedFnc      = dependencies;
					dependencies    = [];
				}

				//me.preProcessors[key] = { dependencies: dependencies, defined: definedFnc };
                me.preProcessors.push({ name: key, dependencies: dependencies, defined: definedFnc });
			},
			/**
			 * 페이지에 코드를 조회하는 함수
			 * @param {boolean} bAll
			 * @param {string} strCdCls
			 */
			codeDataSource: function(bAll, strCdCls) {
            	return UtilSvc.getCDList(bAll, strCdCls);
			},
			/**
			 * 페이지를 로드한다.
			 * @param {function} callback
			 */
			bootstrap: function(callback) {
				var me = this,
                    deferredAll = [];

                angular.forEach(me.preProcessors, function(processor) {
                    var deferred = $q.defer(),
                        next = function(done) {
                            if (done===undefined || done) {
                                deferred.resolve();
                            }
                            else {
                                deferred.reject();
                            }
                        };

                    deferredAll.push(deferred.promise);

                    processor.defined.call(me, next);
                });

                $q.all(deferredAll).then(function() {
                    if (callback) {
                        callback.call(me);
                    }
                });
			}
		};

		return Page;
	};

	PageVO.$inject = ['$rootScope', '$q', 'APP_AUTH', 'UtilSvc'];


	angular.module('edtApp.common.model')
		.factory('Page', PageVO);

}());
