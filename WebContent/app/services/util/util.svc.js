(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @description
	 * 공통 유틸 서비스
	 */
	angular.module('edtApp.common.service').service('UtilSvc', ['$rootScope', '$state', '$window', '$http', 'APP_CONFIG', 'MenuSvc',
		function ($rootScope, $state, $window, $http, APP_CONFIG, MenuSvc) {
			var user = $rootScope.webApp.user,
				menu = $rootScope.webApp.menu;


			/**
			 * 값이 유효한지 체크한다.
			 * @param {*} pwValue
			 * @returns {boolean}
			 */
			this.isValid = function (pwValue) {
				var rtnBoolean = false;
				if (pwValue) {
					rtnBoolean = true;
				}
				return rtnBoolean;
			};

			this.isType = function(type, value) {
				function _check(t, v) {
					var bResult = false;

					if (typeof t !== "string") {
						return false;
					}

					switch (t) {
						case "string"   :
							bResult = typeof value === "string";
							break;
						case "integer"  :
							bResult = typeof value === "number" && (value % 1 === 0);
							break;
						case "float"    :
							bResult = typeof value === "number" && (value % 1 !== 0);
							break;
						case "number"   :
							bResult = typeof value === "number";
							break;
						case "array"    :
							if (Array.isArray) {
								bResult = Array.isArray(value);
							} else {
								bResult = value instanceof Array;
							}
							break;
						case "date"     :
							bResult = value instanceof Date;
							break;
						case "function" :
							bResult = typeof value === "function";
							break;
						case "object"   :
							bResult = typeof value === "object" && typeof value !== null &&
								!(value instanceof Array) && !(value instanceof Date) && !(value instanceof RegExp);
							break;
						case "boolean"  :
							bResult = typeof value === "boolean";
							break;
						case "regexp"  :

							bResult =  value instanceof RegExp;
							break;
						case "null"     :
							bResult = value === null;
							break;
						case "undefined":
							bResult = typeof value === "undefined";
							break;
						default : break;
					}

					return bResult;
				}

				var nI, nLng;

				if (_check("array", value)) {
					for (nI=0, nLng=type.length; nI<nLng; nI++) {
						if (_check(type[nI], value)) {
							return true;
						}
					}
					return false;
				} else {
					return _check(type, value);
				}
			};

			/**
			 * data가 존재하는지 판단한다.
			 * @param {*} data
			 * @returns {boolean}
			 */
			this.hasData = function (data) {
				var state = false;
				if (data) {
					if (angular.isArray(data) && data.length>0) { state = true; }
					else { state = true; }
				}
				return state;
			};

			/**
			 * 리스트를 순회하며 일치하는 데이터를 리턴한다.
			 * @param {Array.<object>} list
			 * @param {object} find
			 * @returns {Array}
			 */
			this.findWhere = function (list, find) {
				angular.forEach(find, function (findValue, findKey) {
					list = list.filter(function (o) {
						return o[findKey] === findValue;
					});
				});
				return list;
			};

			/**
			 * 객체를 확장한다.
			 * @param {object} destination
			 * @param {object} data
			 * @param {{include:Array.<string>, exclude:Array.<string>}} option
			 * @returns {*}
			 */
			this.extend = function (destination, data, option) {
				var self = this,
					include, exclude;
				if (option) {
					include = option.include;
					exclude = option.exclude;

					angular.forEach(data, function (value, key) {
						var state = false;
						if (self.hasData(include)) {
							angular.forEach(include, function (incKey) {
								if (key === incKey) { destination[incKey] = value; }
							});
						} else if (self.hasData(exclude)) {
							angular.forEach(exclude, function (excKey) {
								if (key === excKey) { state = true; }
							});
							if (!state) { destination[key] = value; }
						}
					});
				} else {
					angular.extend(destination, data);
				}

				return destination;
			};

			/**
			 * 모델을 통해 객체를 확장한다.
			 * @param {{ target:object|Array, vo:function, data: }} config
			 */
			this.extendVO = function (config) {
				var self = this;
				angular.forEach(config, function (conf) {
					var target = conf.target,
						arrayBox, copy, creator;

					if (target[conf.name]) { copy = angular.copy(target[conf.name]); }

					if (self.hasData(conf.data)) {
						if (angular.isArray(conf.data)) {
							arrayBox = copy || [];
							angular.forEach(conf.data, function (subData) {
								if (conf.include) { angular.extend(subData, conf.include ); }
								arrayBox.push(new conf.vo(subData, conf.option));
							});
							target[conf.name] = arrayBox;
						} else {
							if (conf.include) { angular.extend(conf.data, conf.include ); }
							creator = new conf.vo(conf.data, conf.option);
							if (copy) { target[conf.name] = angular.extend(creator, copy); }
						}

					} else {
						if (conf.include) { creator = new conf.vo(angular.extend({}, conf.include), conf.option); }
						else { creator = new conf.vo(null, conf.option); }
						if (copy) { target[conf.name] = angular.extend(creator, copy); }
					}
				});
			};


			/**
			 * date관련 함수
			 * @type {{}}
			 */
			this.date = {
				/**
				 * date를 파싱한다.
				 * @param {string} date 날짜
				 * @param {string} format 포멧팅
				 * @param {boolean} isBoolean 리턴타입 여부
				 * @returns {*}
				 */
				parseDateFormat: function (date, format, isBoolean) {
					if (!date) { return isBoolean ? false : date; }
					return  moment(date).format(format);
				}
			};


			/**
			 * 다운로드 관련 함수
			 * @type {{excel: Function}}
			 */
			this.download = {
				/**
				 * excel 파일을 다운로드한다.
				 * @param {string} psFineName
				 */
				excel: function (psFineName) {
					var elem = edt.id('excelDownload'),
						hiddenA;

					if (elem) { hiddenA = elem; }
					else { hiddenA = document.createElement('a'); }
					hiddenA.setAttribute('id', 'excelDownload');
					hiddenA.setAttribute('class', 'throw');
					hiddenA.setAttribute('href', APP_CONFIG.domain +'/excelDown?fileName='+ psFineName);
					document.body.appendChild(hiddenA);

					hiddenA.click();
					angular.element(hiddenA).remove();
				}
			};

			/**
			 * 그리드 관련함수
			 * @type {{setColumns: Function, getColumns: Function, setInquiryParam: Function, getInquiryParam: Function, initColumnSetting: Function, getColumnDefs: Function}}
			 */
			this.grid = {
				/**
				 * 올림차순 정렬한다.
				 * @param {Array} data
				 * @param {string} key
				 * @returns {*}
				 */
				sortAsc : function (data, key) {
					return data.sort(function (a, b) {
						if (a[key] > b[key]) { return 1; }
						else if (a[key] < b[key]) { return -1; }
						else { return 0; }
					});
				},

				/**
				 * 내림차순 정렬한다.
				 * @param {Array} data
				 * @param {string} key
				 * @returns {*}
				 */
				sortDesc : function (data, key) {
					return data.sort(function (a, b) {
						if (a[key] > b[key]) { return -1; }
						else if (a[key] < b[key]) { return 1; }
						else { return 0; }
					});
				},
				/**
				 * localStorage에 columns을 설정한다.
				 * @param {Object} poJson
				 * @param {string=} psKind
				 */
				setColumns: function (poJson, psKind) {
					var fixKey = user.NO_C +''+ user.CD,
						key = fixKey +''+ MenuSvc.getNO_M($state.current.name) +'Columns';

					if (angular.isString(psKind)) {
						key += psKind;
					}

					$window.localStorage.setItem(key, JSON.stringify(poJson));
				},

				/**
				 * localStorage에서 columns을 가져온다.
				 * @param {string} psKind
				 * @returns {Object}
				 */
				getColumns: function (psKind) {
					var fixKey = user.NO_C +''+ user.CD,
						key = fixKey +''+ MenuSvc.getNO_M($state.current.name) +'Columns',
						rtnData;

					if (angular.isString(psKind)) {
						key += psKind;
					}

					rtnData = $window.localStorage.getItem(key);
					if (rtnData) {
						rtnData = JSON.parse(rtnData);
					}
					return rtnData;
				},

				getTreeNode :function (config) {
					var self = this,
						pk = config.primaryKey,
						fk = config.parentKey,
						dataList = self.sortAsc(config.deptData, pk),
						root = [],
						keys = {};

					angular.forEach(dataList, function (data) {
						var pko =  keys[data[pk]] = {
								data: data,
								group: false,
								expanded: false,
								type: 'folder',
								children: []
							},
							fko = keys[data[fk]];

						if (fko) {
							fko.group = true;
							fko.expanded = true;
							fko.children.push(pko);
						} else {
							root.push(pko);
						}
					});

					angular.forEach(self.sortDesc(config.userData, 'CD_POS'), function (user) {
						var dept = keys[user.CD_DEPT];
						if (dept) {
							dept.group = true;
							dept.expanded = true;
							dept.children.unshift({
								data: user,
								group: false
							});
						}
					});

					return root;
				},


				/**
				 * 검색조건을 세션에 저장한다.
				 * @param {Object} poJson
				 * @param {string=} psKind
				 * @param {string=} psUrl
				 */
				setInquiryParam: function (poJson, psKind, psUrl) {
					var fixKey = user.NO_C +''+ user.CD,
						key;

					if (psUrl) {
						key = fixKey +''+ MenuSvc.getNO_M(psUrl) +'Inquiry';
					} else {
						key = fixKey +''+ MenuSvc.getNO_M($state.current.name) +'Inquiry';
					}

					if (angular.isString(psKind)) {
						key += psKind;
					}

					$window.sessionStorage.setItem(key, JSON.stringify(poJson));
				},

				/**
				 * 검색조건을 세션에서 가져온다.
				 * @param {string=} psKind
				 * @returns {Object}
				 */
				getInquiryParam: function (psKind) {
					var fixKey = user.NO_C +''+ user.CD,
						key = fixKey +''+ MenuSvc.getNO_M($state.current.name) +'Inquiry',
						rtnData;

					if (angular.isString(psKind)) {
						key += psKind;
					}
					rtnData = $window.sessionStorage.getItem(key);

					if (rtnData) {
						rtnData = JSON.parse(rtnData);
					}
					return rtnData;
				},

				/**
				 * 초기 컬럼을 설정한다.
				 * @param {{column:{columnDefs:Array, showColumns:Array, hideColumns:Array}, grid:{data:Array, columnDefs:Array}}} poColumnDefs
				 */
				initColumnSetting: function (poColumnDefs, psKind) {
					var self = this,
						column = poColumnDefs.column,
						grid = poColumnDefs.grid,
						storageColumn = self.getColumns(angular.isString(psKind)?psKind:'');

					if (storageColumn) {
						column.showColumns = storageColumn.showColumns;
						column.hideColumns = storageColumn.hideColumns;
						grid.columnDefs = self.getColumnDefs(column);
					} else {
						column.showColumns = [];
						column.hideColumns = [];
						grid.columnDefs = [];

						angular.forEach(column.columnDefs, function (coColumnDef) {
							var o = {
								title : coColumnDef.displayName,
								field : coColumnDef.field
							};
							if (coColumnDef.visible) {
								column.showColumns.push(o);
								grid.columnDefs.push(coColumnDef);
							} else {
								column.hideColumns.push(o);
							}
						});
					}
				},

				/**
				 * columnDefs를 가져온다.
				 * @param {Object} poColumns
				 * @returns {Array}
				 */
				getColumnDefs: function (poColumns) {
					var columnDefs  = poColumns.columnDefs,
						showColumns = poColumns.showColumns,
						rtnColumnDefs = [];

					angular.forEach(showColumns, function (showColumn) {
						angular.forEach(columnDefs, function (columnDefInfo) {
							if (showColumn.field === columnDefInfo.field ) {
								columnDefInfo.visible = true;
								rtnColumnDefs.push(columnDefInfo);
							}
						});
					});
					return rtnColumnDefs;
				}
			};

			this.localStorage = {
				setItem: function(name, data) {
					var fixKey 	= user.NO_C +''+ user.CD,
						key 	= fixKey +''+ MenuSvc.getNO_M($state.current.name) +'-'+ name;

					$window.localStorage.setItem(key, JSON.stringify(data));
				},
				
				getItem: function(name) {
					var fixKey 	= user.NO_C +''+ user.CD,
						key 	= fixKey +''+ MenuSvc.getNO_M($state.current.name) +'-'+ name,
						result;

					result = $window.localStorage.getItem(key);
					
					if (result) {
						result = JSON.parse(result);
					}
					
					return result;
				},
                
                removeItem: function(name) {
                    var fixKey 	= user.NO_C +''+ user.CD,
                        key 	= fixKey +''+ MenuSvc.getNO_M($state.current.name) +'-'+ name;
                    
                    $window.localStorage.removeItem(key);
                }
			};

			/**
			 * 조회처리
			 * POST 값 중 반드시 있어야 하는 값
			 * procedureParam : {string} 호출하는 StoreProcedure. 예) "USP_SV_~~_GET&변수명@타입|변수명@타입" -> 프로시져 앞에 회사코드, 사원번호는 DEFAULT로 추가 됨.
			 * @param {JSON}
			 * @returns {JSON} : result.data.results[0] -> 첫번째 select 값
			 */
			this.getList = function ( param ) {
//				
//				var self = this;
//				var filters_sp_split = param.procedureParam.split("&");
//				var filters_val_split = (filters_sp_split.length > 1)?filters_sp_split[1].split("|"):null;
//				var filter_type_split = null;
//
//				var sSql = "";
//				sSql = "CALL "+filters_sp_split[0] + "(^NO_C^,^NO_EMP^";
//				
//				if(filters_val_split != null) {
//					angular.forEach(filters_val_split, function (filter_array, index) {
//						filter_type_split = filter_array.split("@");
//						sSql = sSql + ", "+self.getSpParamStr(param, filter_type_split[0], filter_type_split[1]);
//					});
//				}
//				sSql = sSql + ");";
//				
//				param.sSql = sSql;
//				param.procedureParam = "";

				return $http({
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
			};

			/**
			 * 조회처리
			 * POST 값 중 반드시 있어야 하는 값
			 * procedureParam : {string} 호출하는 StoreProcedure. 예) "USP_SV_~~_GET&변수명@타입|변수명@타입" -> 프로시져 앞에 회사코드, 사원번호는 DEFAULT로 추가 됨.
			 * @param {JSON}
			 * @returns {JSON} : result.data.results[0] -> 첫번째 select 값
			 */

            this.getCDList = function (bAll, strCdCls) {
            	var self = this;
            	
				return {	
            		dataTextField: "NM_DEF",
                    dataValueField: "CD_DEF",
                    dataSource: new kendo.data.DataSource({
                    	transport: {
                			read: function(e) {
                				var param = {
                					procedureParam: "MarketManager.USP_SY_10CODE99_GET&L_CD_CLS@s",
                					L_CD_CLS: strCdCls
                	            }, pAll = {'CD_DEF':'','NM_DEF':'전체'};
                				
                				self.getList(param).then(function (res) {
                					if(bAll){res.data.results[0].unshift(pAll)}; //코드 초기값 설정
            						e.success(res.data.results[0]);
            					});
                			}
                    	}
                    }),
	            	index: 0
				};
			};
			
			this.initCode = function() {
				return $http({
					method	: "POST",
					url		: APP_CONFIG.domain +"/codeInit/"
				}).success(function (data, status, headers, config) {
					if(data.success !== 1 && data.errors.length > 0) {
						alert("조회 실패하였습니다.!! 연구소에 문의 부탁드립니다.\n("+data.errors[0].LMSG+")");
						return;
					}
				}).error(function (data, status, headers, config) {
					console.log("error",data,status,headers,config);
				});
			};
			
			/**
			 * 엑셀을 업로드 받아서 그리드로 전송
			 */
			this.excelToGrid = function() {
				var self = this;

				return $http({
					method	: "POST",
					url		: APP_CONFIG.domain + "/ut03ExcelToGrid/"
				}).success(function (data, status, headers, config) {
					if(data.success !== 1 && data.errors.length > 0) {
						alert("실패하였습니다.!! 연구소에 문의 부탁드립니다.\n("+data.errors[0].LMSG+")");
						return;
					}
				}).error(function (data, status, headers, config) {
					alert("실패");
				});
			};
			
			/**
			 * 조회 후 엑셀로 download
			 * POST 값 중 반드시 있어야 하는 값
			 * procedureParam : {string} 호출하는 StoreProcedure. 예) "USP_SV_~~_GET&변수명@타입|변수명@타입" -> 프로시져 앞에 회사코드, 사원번호는 DEFAULT로 추가 됨.
			 * gridTitle : {array} 엑셀 Sheet Name. 예) ["긴급장애처리"];
			 * gridInfo : {array} 엑셀에 표시할 컬럼 정보. 예) [servRecVO.gridInfo.gridColumnDefs];
			 * @param {JSON}
			 * @returns 엑셀 다운로드 됨.
			 */
			this.getExcelDownload = function ( param ) {
				var self = this;

				return $http({
					method	: "POST",
					url		: APP_CONFIG.domain + "/ut03Excel/",
					data	: param
				}).success(function (data, status, headers, config) {
					self.download.excel(data);
				}).error(function (data, status, headers, config) {
					//upload failed
				});
			};

			/**
			 * 데이터에서 key에 대한 type으로 sp param을 생성
			 * param : {object} 데이터
			 * key : {string} 데이터의 key
			 * type : {string} 데이터의 type
			 * @param {string}
			 * @returns 데이터의 값
			 */
			this.getSpParamStr = function (param, key, type) {
				var retStr ="";

				if (!param.hasOwnProperty(key)) {
					if (type === "i" || type === "int"  || type === "integer" ||
						type === "f" || type === "r"    || type === "real"    || type === "float" || type === "double" ||
						type === "b" || type === "bool" || type === "bit"     || type === "boolean") {
						retStr = retStr + "NULL";
					}
					else {
						retStr = retStr + "''";
					}
				}
				else {
					if (type === "s" || type === "str" || type === "string") {
						retStr = retStr + (param[key]===""?"NULL":"'"+param[key]+"'");
					}
					else if (type === "i" || type === "int" || type === "integer") {
						retStr = retStr + param[key];
					}
					else if (type === "f" || type === "r" || type === "real" || type === "float" || type === "double") {
						retStr = retStr + param[key];
					}
					else if (type === "b" || type === "bool" || type === "bit" || type === "boolean") {
						retStr = retStr + (param[key] ? 1 : 0);
					}
					else if (type === "l" || type === "list" || type === "a" || type === "array") {
						retStr = retStr + "'\"";

						if((param[key]==="") || (param[key]==="null") || (param[key]==="NULL")) return "''";
						if(angular.isArray(param[key])) {
							angular.forEach(param[key], function (param_value, index) {
								retStr = retStr + param_value;
								if(index != (param[key].length-1)) {
									retStr = retStr + "\",\"";
								}
							});
						}
						else {
							return "''";
						}

						retStr = retStr + "\"'";
					}
					else {
						retStr = retStr + param[key];
					}
				}
				return retStr;
			};
			
			/**
			 * 조회 화면의 공통 코드 조회
			 * @param {JSON * 2개 입력}
			 * @returns 콩통 코드 리스트 출력
			 */
			this.getCommonCodeList = function ( param ) {
				var self = this;

				return $http({
					method	: "GET",
					url		: APP_CONFIG.domain + "/code/common/"+param.lnomngcdhd+"/"+param.lcdcls
				}).success(function (data, status, headers, config) {
					
				}).error(function (data, status, headers, config) {
					
				});
			};
			
			/**
			 * 마켓정보 list
			 * @param {없음}
			 * @returns 마켓정보 리스트 출력
			 */
			this.csMrkList = function () {					
				return $http({
					method	: "GET",
					url		: APP_CONFIG.domain +"/cs/mrklist"
				}).success(function (data, status, headers, config) {
					
				}).error(function (data, status, headers, config) {
					
				});
			};
		}
	]);
}());