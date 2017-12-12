(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @description
	 * 공통 유틸 서비스
	 */
	angular.module('edtApp.common.service').service('UtilSvc', ['$rootScope', '$state', '$window', '$http', 'APP_CONFIG', 'MenuSvc', '$q',
		function ($rootScope, $state, $window, $http, APP_CONFIG, MenuSvc, $q) {
			var user = $rootScope.webApp.user,
				menu = $rootScope.webApp.menu,
				gridHeaderAttributes = {"class": "table-header-cell", style: "text-align: center; font-size: 12px"};
			
			this.gridPageableMessages = {
				display: "총 {2}건 중 {0}-{1}건",
				empty: "표시할 데이터가 없습니다.",
				first: "첫번째 페이지",
				previous: "이전 페이지",
				next: "다음 페이지",
				last: "마지막 페이지"
			};
			
	        this.gridtooltipOptions = {
        		filter: "td",
        		position: "right",
        		content: function(e) {
        			var cell = $(e.target);
        			var content = cell.text();
        			return content;
        		},
        		show: function(e) {
        			this.popup.element[0].style.textAlign = "left";
        			if(e.sender.content[0].textContent.length < 200) { this.popup.element[0].style.width = "150px"; }
        			else { this.popup.element[0].style.width = "300px"; }
        		}
	        };
	        
	        this.gridBodyTemplate = function(gridContentTemplate, gridColVal) {
	        	var lGridColVal = {};
	        	
	        	if(gridColVal.constructor === Array) {
	            	gridContentTemplate = gridContentTemplate + "<div class=\"custom-style ";
					if     (gridColVal[0].textAlign === "center") gridContentTemplate = gridContentTemplate + "ta-c";
					else if(gridColVal[0].textAlign === "right")  gridContentTemplate = gridContentTemplate + "ta-r";
					else                                          gridContentTemplate = gridContentTemplate + "ta-l";
					gridContentTemplate = gridContentTemplate + "\">\n";
					
					for(var iIndex = 0; iIndex < gridColVal.length; iIndex++) {
						gridContentTemplate = gridContentTemplate + "# if("+gridColVal[iIndex].field+"){ #\n";
						if(iIndex !== 0) gridContentTemplate = gridContentTemplate + "&nbsp;/&nbsp;";
						
						if(gridColVal[iIndex].field.indexOf("AM") === 0) {
							if(gridColVal[iIndex].field.indexOf("AM_CJM") === 0) {
								gridContentTemplate += "#if("+gridColVal[iIndex].field+" && (CD_ORDSTAT === '006' || CD_ORDSTAT === '007')){ #\n #= kendo.toString(0,'C0', 'ko-KR') # \n #} else {# \n #= kendo.toString("+gridColVal[iIndex].field+",'C0', 'ko-KR') # \n #}#";
							}else{
								gridContentTemplate += "#= kendo.toString("+gridColVal[iIndex].field+",'C0', 'ko-KR') #\n";
							}							
						}else if(gridColVal[iIndex].field.indexOf("CD") === 0 && gridColVal[iIndex].field.indexOf("CD_PARS_TKBK") !== 0 && gridColVal[iIndex].fNm !== "" && gridColVal[iIndex].fNm !== undefined) {
							gridContentTemplate += "<co04-cd-to-nm cd=\"#:"+gridColVal[iIndex].field+"#\" nm-box=\""+gridColVal[iIndex].fNm+"\">\n";
						}else if(gridColVal[iIndex].field.indexOf("CD_PARS_TKBK") === 0 && gridColVal[iIndex].fNm !== "" && (gridColVal[iIndex].fNm)) {
							gridContentTemplate += "<co05-pars-to-nm no-mrk=\"#: NO_MRK #\" cd=\"#:"+gridColVal[iIndex].field+"#\" nm-box=\""+gridColVal[iIndex].fNm+"\">\n";
						}else if(gridColVal[iIndex].field.indexOf("DTS") === 0) {
							gridContentTemplate += "<co06-date-format origin-date=\"\'#:"+ gridColVal[iIndex].field+"#\'\"> \n";
						}else if(gridColVal[iIndex].field.indexOf("YN_CONN") === 0) {
							gridContentTemplate += "# if("+gridColVal[iIndex].field+" !== 'N'){#\n Y\n #}else{#\n N\n#}#";						
						}else {
							gridContentTemplate += "#: "+gridColVal[iIndex].field+" #\n";
						}
					    gridContentTemplate += "# }else{ }#\n";
					}
					gridContentTemplate += "</div>\n";
	        	}else {
	        		gridContentTemplate += "<div class=\"custom-style ";
				
	        		if(gridColVal.textAlign === "center"){
						gridContentTemplate += "ta-c";
					}else if(gridColVal.textAlign === "right"){
						gridContentTemplate += "ta-r";	
					}else{
						gridContentTemplate += "ta-l";
					}
					
					gridContentTemplate += "\">\n";
					
					if(gridColVal.field.indexOf("AM") === 0) {
						if(gridColVal.field.indexOf("AM_CJM") === 0) {
							gridContentTemplate += "#if("+gridColVal.field+" && (CD_ORDSTAT === '006' || CD_ORDSTAT === '007')){#\n #= kendo.toString(0,'C0', 'ko-KR') # \n #} else { if(kendo.toString("+gridColVal.field+",'C0', 'ko-KR') === null) {#\n #= '' #\n #} else {# \n #= kendo.toString("+gridColVal.field+",'C0', 'ko-KR') # \n #}}#";
						}else{
							gridContentTemplate += "# if("+gridColVal.field+"){ #\n #= kendo.toString("+gridColVal.field+",'C0', 'ko-KR') #\n #}#";
						}						
					}else if(gridColVal.field.indexOf("DTS") === 0) {
						gridContentTemplate += "<co06-date-format origin-date=\"\'#:"+ gridColVal.field+"#\'\"> \n";	
					}else if(gridColVal.field.indexOf("CD") === 0 && gridColVal.field.indexOf("CD_PARS_TKBK") !== 0 && gridColVal.fNm !== "" && gridColVal.fNm !== undefined) {
						gridContentTemplate += "# if("+gridColVal.field+"){ #\n <co04-cd-to-nm cd=\"#:"+gridColVal.field+"#\" nm-box=\""+gridColVal.fNm+"\">\n #}#";
					}else if(gridColVal.field.indexOf("CD_PARS_TKBK") === 0 && gridColVal.fNm !== "" && (gridColVal.fNm)) {
						gridContentTemplate += "<co05-pars-to-nm no-mrk=\"#: NO_MRK #\" cd=\"#:"+gridColVal.field+"#\" nm-box=\""+gridColVal.fNm+"\">\n";
					}else if(gridColVal.field.indexOf("YN_CONN") === 0) {
						gridContentTemplate += "# if("+gridColVal.field+" !== 'N'){#\n Y\n #}else{#\n N\n#}#";					
					}else {
						gridContentTemplate += "# if("+gridColVal.field+"){ #\n #: "+gridColVal.field+" #\n #}#";
					}					
				    gridContentTemplate += "\n</div>\n";
	        	}
			    return gridContentTemplate;
            };
	        
	        this.gridDetOption = function(gridCheckOption, gridCol) {
	        	var rtnObj = {},
	        	    me     = this;
	        	rtnObj.gridColumn = [];
	        	rtnObj.gridContentTemplate = "";
	        	
	        	for(var iIndex = 0; iIndex < gridCol.length; iIndex++) {
                	var gridColVal = {};
                	if(gridCol[iIndex][0].constructor === Array) {
	            		gridColVal.field = gridCol[iIndex][0][0].field;
	                	gridColVal.width = gridCol[iIndex][0][0].width;
	                	gridColVal.title = gridCol[iIndex][0][0].title.concat(" / ", gridCol[iIndex][0][1].title);
                	}
                	else {
                		gridColVal.field = gridCol[iIndex][0].field;
	                	gridColVal.width = gridCol[iIndex][0].width;
	                	gridColVal.title = gridCol[iIndex][0].title;
                	}
                	
                	if(gridColVal.field === "hierarchy") {
                		rtnObj.gridContentTemplate = rtnObj.gridContentTemplate + "\t<td class=\"k-hierarchy-cell\">\n" +
                        "\t\t<a class=\"k-icon k-i-expand\" href=\"\\#\" tabindex=\"-1\"></a>\n" +
                        "\t</td>\n";
                		//rtnObj.gridColumn.push(gridColVal);
                    	continue;
                	}
                	else if(gridColVal.field === "ROW_CHK") {
                		rtnObj.gridContentTemplate = rtnObj.gridContentTemplate + "\t<td class=\"ta-c\">\n" +
				                         "\t\t<div class=\"custom-style-checkbox\">\n" +
				                         "\t\t\t<input class='k-checkbox' data-role='checkbox' type='checkbox' ng-click=\""+gridCheckOption.clickNm+"($event)\" id=\"#= uid #_row\">\n" +
				                         "\t\t\t<label class='k-checkbox-label k-no-text' style=\"vertical-align:middle;\" for=\"#= uid #_row\"></label>\n" +
				                         "\t\t</div>\n" +
				                         "\t</td>\n";
                		if(gridCheckOption.allClickNm !== "" && gridCheckOption.allClickNm !== undefined)
                			gridColVal.title = "<input class='k-checkbox' type='checkbox' id='grid_chk_master' ng-click='"+gridCheckOption.allClickNm+"($event)'><label class='k-checkbox-label k-no-text' for='grid_chk_master' style='margin-bottom:0;'>​</label>";
                		
                		gridColVal.headerAttributes = {"class": "table-header-cell", style: "text-align: center; font-size: 12px; vertical-align:middle;"};
                		//gridColVal.selectable       = true;
                		rtnObj.gridColumn.push(gridColVal);
                    	continue;
                	}
                	else {
                		gridColVal.headerAttributes = gridHeaderAttributes;
                	}
                	rtnObj.gridContentTemplate = rtnObj.gridContentTemplate + "<td style=\"padding:0\">\n";
                	rtnObj.gridContentTemplate = me.gridBodyTemplate(rtnObj.gridContentTemplate, gridCol[iIndex][0]);
                	
                	if(gridCol[iIndex].length > 1) {
                		rtnObj.gridContentTemplate = me.gridBodyTemplate(rtnObj.gridContentTemplate, gridCol[iIndex][1]);
                		if(gridCol[iIndex][1].constructor === Array) {
                			gridColVal.columns = [{
                    			field: gridCol[iIndex][1][0].field,
                    			title: gridCol[iIndex][1][0].title.concat(" / ", gridCol[iIndex][1][1].title),
                    			width: gridCol[iIndex][1][0].width,
                    			headerAttributes: gridHeaderAttributes
                    		}];
                    	}
                    	else {
                    		gridColVal.columns = [{
                    			field: gridCol[iIndex][1].field,
                    			title: gridCol[iIndex][1].title,
                    			width: gridCol[iIndex][1].width,
                    			headerAttributes: gridHeaderAttributes
                    		}];
                    	}
                	}
                	else {
                		rtnObj.gridContentTemplate = rtnObj.gridContentTemplate + "<div class=\"custom-style\"></div>\n";
                		
                		gridColVal.columns = [{
                			width: 100,
                			headerAttributes: gridHeaderAttributes
                		}];
                	}
                	rtnObj.gridContentTemplate = rtnObj.gridContentTemplate + "</td>\n";
                	rtnObj.gridColumn.push(gridColVal);
                }
                rtnObj.gridContentTemplate = rtnObj.gridContentTemplate + "</tr>\n";
                
                return rtnObj;
	        };
	        
	        this.grdCkboxClick = function(e, iGrd) {
	        	var i = 0,
	            	element = $(e.currentTarget),
	            	checked = element.is(':checked'),
	            	row = element.closest("tr"),
	            	dataItem = iGrd.dataItem(row),
	            	allChecked = true;
             	                
	            dataItem.ROW_CHK = checked;
	            dataItem.dirty = checked;
	            
	            for(i; i<element.parents('tbody').find("tr").length; i+=1){
	            	if(!element.parents('tbody').find("tr:eq("+i+")").find(".k-checkbox").is(":checked")){
	            		allChecked = false;
	            	}
	            }
	            
	            angular.element($(".k-checkbox:eq(0)")).prop("checked",allChecked);
	            
	            checked ? row.addClass("k-state-selected") : row.removeClass("k-state-selected");
	        };
	        
	        this.grdCkboxAllClick = function(e, iGrd) {
	        	var i = 0,
	             	element = $(e.currentTarget),
	             	checked = element.is(':checked'),
	             	row = element.parents("div").find(".k-grid-content table tr"),
	             	dataItem = iGrd.dataItems(row),
	             	dbLength = dataItem.length;
         
	            if(dbLength < 1){	                	
	            	alert("전체 선택 할 데이터가 없습니다.");
	            	angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
	             	return;
	            };   
	             
	            for(i; i<dbLength; i += 1){
	             	dataItem[i].ROW_CHK = checked;
	             	dataItem[i].dirty = checked;
	            };
	             
	            checked ? row.addClass("k-state-selected").find(".k-checkbox").prop( "checked", true ) : row.removeClass("k-state-selected").find(".k-checkbox").prop( "checked", false );
	        };
	        
	        /**
	         * Get group info.
	         * @returns {Promise}
	         */
	        this.getGroup = function(bRefresh) {
		        var self = this,
		            defer = $q.defer(),
			        group;

		        if(bRefresh) {
		        	var param = {
						procedureParam:"USP_SY_02LOGIN04_GET"
					};
					self.getList(param).then(function (res) {
						$rootScope.$emit("event:setGroup", res.data.results[0]);
						defer.resolve(res.data.results[0]);
					});

			        return defer.promise;
		        }
		        
		        if (!$rootScope.webApp.group) {
					group = JSON.parse($window.localStorage.getItem("GROUP"));
			        if (group) {
			        	$rootScope.webApp.group = group;
				        defer.resolve($rootScope.webApp.group);
			        } else {
						// 자신의 그룹을 조회함
						var param = {
							procedureParam:"USP_SY_02LOGIN04_GET"
						};
						self.getList(param).then(function (res) {
							$rootScope.$emit("event:setGroup", res.data.results[0]);
						});
			        }
		        } else {
					defer.resolve($rootScope.webApp.group);
		        }

		        return defer.promise;
	        }

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
			 * date관련 함수
			 * @type {{}}
			 */
			this.dateFormat = function (val) {
				var yhPattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
				    yPattern = /(\d{4})(\d{2})(\d{2})/,
				    ret = '';
				
				if(val.length === 14) {
					ret = val.replace(yhPattern, '$1-$2-$3 $4:$5');
				}
				else if(val.length === 8) {
					val.replace(yhPattern, '$1-$2-$3');
				}
				
				return ret;
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
				excel: function (psFineName, downFilename) {
					var elem = edt.id('excelDownload'),
						hiddenA;

					if (elem) { hiddenA = elem; }
					else { hiddenA = document.createElement('a'); }
					hiddenA.setAttribute('id', 'excelDownload');
					hiddenA.setAttribute('class', 'throw');
					hiddenA.setAttribute('href', APP_CONFIG.domain +'/ut03Excel?filename='+ psFineName+'&downfilename='+encodeURIComponent(decodeURIComponent(downFilename)));
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
					var fixKey = user.NO_C +''+ user.DC_ID,
						key;

					if (psUrl) {
						key = fixKey +''+ MenuSvc.getNO_M(psUrl) +'Inquiry';
					} else {
						key = fixKey +''+ MenuSvc.getNO_M($state.current.name) +'Inquiry';
					}

					if (angular.isString(psKind)) {
						key += psKind;
					}
					//console.log(poJson);
					$window.sessionStorage.setItem(key, JSON.stringify(poJson));
				},

				/**
				 * 검색조건을 세션에서 가져온다.
				 * @param {string=} psKind
				 * @returns {Object}
				 */
				getInquiryParam: function (psKind) {
					var fixKey = user.NO_C +''+ user.DC_ID,
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
					var fixKey 	= user.NO_C +''+ user.NO_EMP,
						key 	= fixKey +''+ MenuSvc.getNO_M($state.current.name) +'-'+ name;

					$window.localStorage.setItem(key, JSON.stringify(data));
				},
				
				getItem: function(name) {
					var fixKey 	= user.NO_C +''+ user.NO_EMP,
						key 	= fixKey +''+ MenuSvc.getNO_M($state.current.name) +'-'+ name,
						result;

					result = $window.localStorage.getItem(key);
					
					if (result) {
						result = JSON.parse(result);
					}
					
					return result;
				},
                
                removeItem: function(name) {
                    var fixKey 	= user.NO_C +''+ user.NO_EMP,
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
					self.download.excel(data, param.downfilename);
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
					url		: APP_CONFIG.domain + "/code/common/"+param.lnomngcdhd+"/"+param.lcdcls+"/"+param.mid+"/"+param.customnoc 
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
			
			/**
			 * html 태그 없애기
			 * @param html tag
			 * @returns 순수 텍스트 리턴
			 */
			this.removeHtmlTag = (function(html) {
				return html.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");				
			});
			
			/**
			 * 파일 업로드시 dirty 트루인것을 가져와서 업로드 실행
			 * @param imgVO 배열
			 * @returns 
			 */
			this.fileSaveExe = function (list) {					
				var exeList = [];
            	for(var i = 0 ; i < list.length ; i++){
            		if(list[i].dirty){
            			exeList.push(list[i]);
            		}
            	}
            	for(var i = 0 ; i < exeList.length ; i++){
            		exeList[i].doUpload(function() {
					}, function() {
	        			alert('이미지 업로드를 실패하였습니다.');
	        			return;
	        		});
            	}
			};
		}
	]);
}());
