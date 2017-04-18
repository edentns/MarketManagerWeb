(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name te.OtherKendo.controller : te.OtherKendoCtrl
     * 부서관리
     */
    angular.module("te.OtherKendo.controller", [ 'kendo.directives', 'ngGrid' ])
    	.directive("dropdownMultiselect",function() {
    		//콤보박스 속 다중체크박스 커스텀마이징한 디렉티브
    		return {
                restrict: 'E',
                scope: {
                    model: '=',
                    options: '=',
                },
                template:
                        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                        "<div class='btn-group' data-ng-class='{open: open}'>" +
                            "<button class='btn btn-small'>Select...</button>" +
                            "<button class='btn btn-small dropdown-toggle'"+ 
                            "data-ng-click='openDropdown()'>"+
                            "<span class='caret'></span></button>" +
                            "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
                                "<li><a data-ng-click='selectAll()'>"+
                                "<span class='glyphicon glyphicon-ok green' "+
                                "aria-hidden='true'></span> Check All</a></li>" +
                                "<li><a data-ng-click='deselectAll();'>"+
                                "<span class='glyphicon glyphicon-remove red' "+
                                "aria-hidden='true'></span> Uncheck All</a></li>" +
                                "<li class='divider'></li>" +
                                "<li data-ng-repeat='option in options'>"+
                                "<a data-ng-click='toggleSelectItem(option)'>"+
                                "<span data-ng-class='getClassName(option)'" +
                                "aria-hidden='true'></span> {{option.name}}</a></li>" +
                            "</ul>" +
                        "</div>",

                controller:['$scope', function ($scope) {
                    $scope.openDropdown = function () {
                        $scope.open = !$scope.open;
                    };

                    $scope.selectAll = function () {
                        $scope.model = [];
                        angular.forEach($scope.options, function (item, index) {
                            $scope.model.push(item.id);
                        });
                    };

                    $scope.deselectAll = function () {
                        $scope.model = [];
                    };

                    $scope.toggleSelectItem = function (option) {
                        var intIndex = -1;
                        angular.forEach($scope.model, function (item, index) {
                            if (item == option.id) {
                                intIndex = index;
                            }
                        });

                        if (intIndex >= 0) {
                            $scope.model.splice(intIndex, 1);
                        }
                        else {
                            $scope.model.push(option.id);
                        }
                    };

                    $scope.getClassName = function (option) {
                        var varClassName = 'glyphicon glyphicon-remove red';
                        angular.forEach($scope.model, function (item, index) {
                            if (item == option.id) {
                                varClassName = 'glyphicon glyphicon-ok green';
                            }
                        });
                        return (varClassName);
                    };
                }]
            }
    		
    	})
    
        .controller("te.OtherKendoCtrl", ["$scope", "$q", "sy.CodeSvc", "te.OtherKendoSvc", "APP_CODE", "resData", "Page", "$state", 'MenuSvc', "$location","$window","UtilSvc",
            function ($scope, $q, SyCodeSvc, TeOtherKendoSvc, APP_CODE, resData, Page, $state, MenuSvc, $location, window, UtilSvc) {
        	var page  = $scope.page = new Page({ auth: resData.access }),
            today = edt.getToday();

        	var NO_M = MenuSvc.getNO_M($state.current.name);
        	
        	
        	
        	//파일업로드       	
        	$scope.onComplete = function(e) {
    			UtilSvc.excelToGrid().then(function (resData) {
        			ex.hahm.grid.data   = resData.data.results[0];
                });
            };
        	
        	
            
        	//주소창 보여주기
        	$scope.addrSearch = function() {
        		TeOtherKendoSvc.modalCustCmp().then(function (res) {
				});
			};
				
			
        	
        	//라디오버튼 동적생성
        	$scope.radio = [
        	                { "id": "BU_0000001", "name": "사업" },
        	                { "id": "BU_0000002", "name": "제품" },
        	                { "id": "SY_0000001", "name": "직급" },
        	                { "id": "SY_0000002", "name": "권한" },
        	                { "id": "SY_0000003", "name": "직군" },
        	            ];
        	
        	$scope.createDynamicRadioButton = function () {
        		var div ="<div>";
        		for(var i=0;i<($scope.radio).length;i++){
        			div += "<label>"+$scope.radio[i].name+"<input type='radio' name='radioButton'/></label>";
        		}
        		div += "</div>";
                $('.dymanic').append(div);
            };

            $('input[name="radioButton"]').eq(0).prop('checked', true);
        
        	$scope.selectedUserIds = [];
        	//라디오버튼 동적생성
        	
        	
        	//엑셀파일 불러서 그리드에 보여준다
        	var ex = {};
        		
        		ex.hahm = {
    				boxTitle: '엑셀그리드',
					grid: {
						data: [],
						columnDefs: [   { visible: true, displayName: '회사코드', field: 'CO_CD' },
				          				{ visible: true, displayName: '거래처코드', field: 'TR_CD', cellClass: 'ta-c' },
										{ visible: true, displayName: '거래처구분', field: 'TR_FG', cellClass: 'ta-c' }]
					},
        			upload: function(e) {
		        		UtilSvc.excelToGrid().then(function (resData) {
		        			ex.hahm.grid.data   = resData.data.results[0];
		                });
					}	
        				
        		};
        	$scope.ex = ex;
        	
        	
        	//멀티 셀렉트 안에 들어갈 데이터값 가져와서 선택후 검색누르면 그리드에 그려주는 기능, 셀 merge, 글번호, 셀 정렬
        	var vm = {};
        	
				//EqMasterListBiz.initLoad(vm.code, vm.search.param, vm.eqm);
				UtilSvc.initCode().then(function (resData) {
        			$scope.users    = resData.data.results[0];
                });
				
				vm.eqm = {
					boxTitle: '코드정보',
					column: {
						showColumns : [],
						hideColumns	: []
					},
					grid: {
						data: [],
						columnDefs: [   { visible: true, displayName: 'NUM', field: 'rownum', cellTemplate: '<span>{{rowRenderIndex+1}}</span>', width: 100},
				          				{ visible: true, displayName: 'CD_CLS', field: 'CD_CLS', cellClass: 'ta-c', cellTemplate: '<div class="ngCellText">{{row.entity.CD_CLS}}/{{row.entity.DC_RMK}}</div>'},
										{ visible: true, displayName: 'NM_CLS', field: 'NM_CLS', cellClass: 'ta-c' },
										{ visible: true, displayName: 'DC_RMK', field: 'DC_RMK', cellClass: 'ta-c' },
										{ visible: true, displayName: 'DTS_INSERT', field: 'DTS_INSERT', cellClass: 'ta-c' },
										{ visible: true, displayName: 'DTS_UPDATE', field: 'DTS_UPDATE', cellClass: 'ta-c' },
										{ visible: true, displayName: 'NO_INSERT', field: 'NO_INSERT', cellClass: 'ta-c'}]
					},
					search: function(e){
		        		var p = "";
		        		var fl = true;
		        		for(var i=0;i<($scope.selectedUserIds).length;i++){
		        			if(fl){
		        				p+="\""+$scope.selectedUserIds[i]+"\"";
		        				fl = false;
		        			}
		        			else p+=","+"\""+$scope.selectedUserIds[i]+"\"";
		        		}
		        		var param = {
		                        procedureParam:"USP_SY_CODETEST_GET&"+p+""
		                    };
		        		
		        		UtilSvc.getHList_code(param).then(function (resData) {
		        			vm.eqm.grid.data   = resData.data.results[0];
		                });
		        		
		        	}
				};
        	
				$scope.vm = vm;
				//멀티 셀렉트 안에 들어갈 데이터값 가져와서 선택후 검색누르면 그리드에 그려주는 기능, 셀 merge, 글번호, 셀 정렬
				
				
        	//test Multiselect
        	/*var view, searchVO, meetingVO;

            meetingVO.tbl = {
                columns: [
                    {title: "CD_CLS", field: "CD_CLS", visible: true },
                    {title: "NM_CLS", field: "NM_CLS", visible: true },
                    {title: "DC_RMK", field: "DC_RMK", visible: true },
                    {title: "DTS_INSERT", field: "DTS_INSERT", visible: true },
                    {title: "DTS_UPDATE", field: "DTS_UPDATE", visible: true },
                    {title: "NO_INSERT", field: "NO_INSERT", visible: true }
                ]
            };
            
          
        	$scope.users = [
        	                { "id": "BU_0000001", "name": "사업" },
        	                { "id": "BU_0000002", "name": "제품" },
        	                { "id": "SY_0000001", "name": "직급" },
        	                { "id": "SY_0000002", "name": "권한" },
        	                { "id": "SY_0000003", "name": "직군" },
        	            ];

        	$scope.selectedUserIds = [];
        	
        	$scope.search = function(e){
        		var p = "";
        		var fl = true;
        		for(var i=0;i<($scope.selectedUserIds).length;i++){
        			if(fl){
        				p+="\""+$scope.selectedUserIds[i]+"\"";
        				fl = false;
        			}
        			else p+=","+"\""+$scope.selectedUserIds[i]+"\"";
        		}
        		var param = {
                        procedureParam:"USP_SY_CODETEST_GET&"+p+""
                    };
        		
        		UtilSvc.getHList_code(param).then(function (res) {
        			meetingVO.data    = res.data.results[0];
                });
        		
        	};*/
			//test Multiselect
				
				
				
        	//css 의 id값을 줘서 테마 바꿈
        	$scope.opal = function() {
        		document.getElementById('flat').disabled = true;
        		document.getElementById('opal').disabled = false;
			};
        	$scope.flat = function() {
        		document.getElementById('opal').disabled = true;
        		document.getElementById('flat').disabled = false;
        	};
        	
        	
        	
        	//test 에디터
        	$scope.html = "<h1>Kendo Editor</h1>\n\n" +
            "<p>Note that 'change' is triggered when the editor loses focus.\n" +
                "<br /> That's when the Angular scope gets updated.</p>";
        	
        	
        	
        	//test 멀티 셀렉트(한개씩만 선택가능함)
        	$scope.selectOptions = {
                    placeholder: "Select products...",
                    dataTextField: "ProductName",
                    dataValueField: "ProductID",
                    valuePrimitive: true,
                    autoBind: false,
                    dataSource: {
                        type: "odata",
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Products",
                            }
                        }
                    }
                };
              
        	
        	
        	//test 그리드 (일자 에디팅시 달력, 칼럼이동)
        	var dataSource = new kendo.data.DataSource({
        	      type: "everlive",
        	      transport: {
        	        // binding to the Order type in the backend
        	        typeName: "Order"
        	      },
        	      schema: {
        	        model: {
        	          id: "Id",
        	          fields: {
        	            // default fields for Backend Services types
        	            CreatedBy:  { type: "string" },
        	            CreatedAt:  { type: "date" },
        	            ModifiedAt: { type: "date" },

        	            // type fields
        	            Freight:    { type: "number" },
        	            OrderDate:  { type: "date" },
        	            ShipName:   { type: "string" },
        	            ShipCity:   { type: "string" }
        	          }
        	        }
        	      },
        	      serverPaging: true,
        	      pageSize: 20,
        	      serverSorting: true,
        	      sort: { field: 'OrderDate', dir: 'asc' }
        	    });

        	    $scope.gridOptions = {
        	      boxTitle: '그리드',
        	      dataSource: dataSource,
        	      sortable: true,
        	      pageable: true,
        	      editable: true,
        	      reorderable: true,
                  resizable: true,
        	      columns: [
        	        { field: "Freight", width: 100 },
        	        { field: "OrderDate", title: "Order Date", width: 120, format: "{0:yyyy-MM-dd HH:mm}", editor: dateEditor },
        	        { field: "ShipName", title: "Ship Name" },
        	        { field: "ShipCity", title: "Ship City", width: 150 }
        	      ]
        	    };
        	    function dateEditor(container, options) {
        	        $('<input data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" data-format="' + options.format + '"/>')
        	                .appendTo(container)
        	                .kendoDatePicker({});
        	    }
        	
        	
        	
        	//test 그리드 안에 행 마다 체크박스 기능
        	/*$scope.gridData = [
        	                   {
        	                	   "id": 0,
        	                       "checker": false,
        	                       "name":'홍길동',
        	                       "address":'서울'
        	                   }, {
        	                       "id": 1,
        	                       "checker": false,
        	                       "name":'김철수',
        	                       "address":'서울'
        	                   }, {
        	                       "id": 2,
        	                       "checker": false,
        	                       "name":'앵귤러',
        	                       "address":'서울'
        	                   }
        	               ];

        	 $scope.columnDefs = [{
        	        field: 'checker',
        	        displayName: '',
        	        headerCellTemplate: "<div class=\"ngHeaderSortColumn {{col.headerClass}}\" ng-style=\"{'cursor': col.cursor}\" ng-class=\"{ 'ngSorted': !noSortVisible }\"> \
        	            <div ng-click=\"col.sort($event)\" ng-class=\"'colt' + col.index\" class=\"ngHeaderText\"> \
        	                {{col.displayName}} \
        	                <input type=\"checkbox\" ng-model=\"checker\" ng-change=\"toggleCheckerAll(checker);\"> \
        	            </div> \
        	        </div>",
        	        cellTemplate: "<div class=\"ngCellText\" ng-class=\"col.colIndex()\"> \
        	            <input type=\"checkbox\" ng-input=\"COL_FIELD\" ng-model=\"COL_FIELD\" ng-change=\"toggleChecker(COL_FIELD)\"> \
        	        </div>"
        	    },
        	    {
        	      field:'name',
        	      displayName:'Name',
        	      cellTemplate: "<div > \
      	            <input type=\"password\" ng-model=\"COL_FIELD\" > \
      	        </div>"
        	    },
        	    {
        	        field:'address',
        	        displayName:'Address',
        	        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text title="{{COL_FIELD}}">{{COL_FIELD}}</span></div>'
        	    }];

        	    $scope.gridOptions = {
        	        data: 'gridData',
        	        enableCellSelection: false,
        	        enableRowSelection: false,
        	        columnDefs: 'columnDefs'
        	    };

        	    $scope.toggleCheckerAll = function(checked) {
        	        for (var i = 0; i < $scope.gridData.length; i++) {
        	            $scope.gridData[i].checker = checked;
        	        }
        	    };

        	    $scope.toggleChecker = function(checked) {
        	        var rows = $scope.gridOptions.$gridScope.renderedRows,
        	            allChecked = true;

        	        for (var r = 0; r < rows.length; r++) {
        	            if (rows[r].entity.checker !== true) {
        	                allChecked = false;
        	                break;
        	            }
        	        }
        	        
        	        $scope.gridOptions.$gridScope.checker = allChecked;
        	    };*/
        	    
        	    
        	    

        	    
        	    
        	    //testScheduler
        	    $scope.schedulerOptions = {
        	    		title:"스케쥴",
        	            date: new Date(),
        	            startTime: new Date(),
        	            height: 600,
        	            views: [
        	                "day",
        	                { type: "workWeek", selected: true },
        	                "week",
        	                "month",
        	            ],
        	            timezone: "Etc/UTC",
        	            dataSource: {
        	                batch: true,
        	                transport: {
        	                    read: {
        	                        url: "https://demos.telerik.com/kendo-ui/service/tasks",
        	                        dataType: "jsonp"
        	                    },
        	                    update: {
        	                        url: "https://demos.telerik.com/kendo-ui/service/tasks/update",
        	                        dataType: "jsonp"
        	                    },
        	                    create: {
        	                        url: "https://demos.telerik.com/kendo-ui/service/tasks/create",
        	                        dataType: "jsonp"
        	                    },
        	                    destroy: {
        	                        url: "https://demos.telerik.com/kendo-ui/service/tasks/destroy",
        	                        dataType: "jsonp"
        	                    },
        	                    parameterMap: function(options, operation) {
        	                        if (operation !== "read" && options.models) {
        	                            return {models: kendo.stringify(options.models)};
        	                        }
        	                    }
        	                },
        	                schema: {
        	                    model: {
        	                        id: "taskId",
        	                        fields: {
        	                            taskId: { from: "TaskID", type: "number" },
        	                            title: { from: "Title", defaultValue: "No title", validation: { required: true } },
        	                            start: { type: "date", from: "Start" },
        	                            end: { type: "date", from: "End" },
        	                            startTimezone: { from: "StartTimezone" },
        	                            endTimezone: { from: "EndTimezone" },
        	                            description: { from: "Description" },
        	                            recurrenceId: { from: "RecurrenceID" },
        	                            recurrenceRule: { from: "RecurrenceRule" },
        	                            recurrenceException: { from: "RecurrenceException" },
        	                            ownerId: { from: "OwnerID", defaultValue: 1 },
        	                            isAllDay: { type: "boolean", from: "IsAllDay" }
        	                        }
        	                    }
        	                },
        	                filter: {
        	                    logic: "or",
        	                    filters: [
        	                        { field: "ownerId", operator: "eq", value: 1 },
        	                        { field: "ownerId", operator: "eq", value: 2 }
        	                    ]
        	                }
        	            },
        	            resources: [
        	                {
        	                    field: "ownerId",
        	                    title: "Owner",
        	                    dataSource: [
        	                        { text: "Alex", value: 1, color: "#f8a398" },
        	                        { text: "Bob", value: 2, color: "#51a0ed" },
        	                        { text: "Charlie", value: 3, color: "#56ca85" }
        	                    ]
        	                }
        	            ]
        	        };
                
                
                
                
	            

                /**
                 * 그리드트리
                 * @type {{}}
                 */
                var otherMngVO = $scope.otherMngVO = { 
                    boxTitle: '그리드트리',
                    /**
                     * 유효성을 체크한다.
                     * @param {array.<{STATE:string, NAME:string, MGR_CD:number, WORK_GROUP:string, YN_TOPDEPT:string}>} deptInfo
                     * @returns {{state: boolean, msg: string}}
                     */
                    isValid : function (deptInfo) {
                        var i, lng, o,
                            deptNmReg = /^[가-힣\w\s_(),&@'#\-:;/*{}[\]<>]{1,32}$/,
                            numCdReg = /^[\d]+$/,
                            topDeptEnum = ["YES", "NO"];

                        for (i=0, lng=deptInfo.length; i<lng; i+=1) {
                            o = deptInfo[i];
                            if     (!o.NAME)                                     return { state: false, msg: "[필수] 부서명은 필수 입력값입니다." };
                            else if(!deptNmReg.test(o.NAME))                     return { state: false, msg: "[형식] 부서명은 유효하지 않은 형식입니다." };
                            else if(o.STATE !== "D" && !o.MGR_CD)                return { state: false, msg: "[필수] 상위부서는 필수 입력값입니다." };
                            else if(o.STATE !== "D" && !numCdReg.test(o.MGR_CD)) return { state: false, msg: "[형식] 상위부서는 유효하지 않은 형식입니다." };
                            else if(!o.WORK_GROUP)                               return { state: false, msg: "[필수] 직군은 필수 입력값입니다." };
                            else if(!numCdReg.test(o.WORK_GROUP))                return { state: false, msg: "[형식] 직군은 유효하지 않은 형식입니다." };
                            else if(topDeptEnum.indexOf(o.YN_TOPDEPT) === -1 && 
                            		!numCdReg.test(o.WORK_GROUP))                return { state: false, msg: "[형식] 상위부서는 여부는  [YES, NO]만 가능합니다." };
                        }

                        return { state: true, msg: "체크완료" };
                    },
                    /**
                     * 추가, 수정, 삭제를 위한 parameter를 생성한다.
                     * @param oParam
                     * @returns {{STATE: *, CD: (*|$scope.employeeVO.param.CD|param.CD|resInfo.deptCodeList.CD|.deptCodeList.CD|null), NAME: (*|$scope.employeeVO.param.NAME|param.NAME|resInfo.deptCodeList.NAME|.deptCodeList.NAME|$scope.orderVO.ownerInfo.NAME), MGR_CD: (*|$scope.employeeVO.param.MGR_CD|param.MGR_CD), WORK_GROUP: (*|$scope.employeeVO.param.WORK_GROUP|param.WORK_GROUP), YN_TOPDEPT: (*|string|createdItem.YN_TOPDEPT)}}
                     */
                    makeParam : function (deptInfo) {
                        var rtnParam = {
                            STATE      : deptInfo._state,
                            NAME       : deptInfo.NAME,
                            MGR_CD     : Number(deptInfo.MGR_CD),
                            WORK_GROUP : Number(deptInfo.WORK_GROUP),
                            YN_TOPDEPT : deptInfo.YN_TOPDEPT
                        };

                        if (!angular.isUndefined(deptInfo.CD)) rtnParam.CD = deptInfo.CD;

                        return [rtnParam];
                    },
                    /**
                     * 부서를 조회한다.
                     */
                    inquiry : function (e) {
                        var self = this;
                        $q.all([
                            TeOtherKendoSvc.getDepart({ search: "all" })
                        ]).then(function (result) {
                            self.data = result[0].data;
                            e.success(self.data);
                        });
                    },
                    saveProcess : function (deptInfo, e) {
                        var self = this,
                            param = self.makeParam(deptInfo),
                            resValid = this.isValid(param),
                            defer = $q.defer();

                        if (!resValid.state) {
                            alert(resValid.msg);
                            defer.reject();
                        } else {
                            TeOtherKendoSvc.save(param).error(function (data, status, headers, config) {
                                console.log("error",data,status,headers,config);
                                defer.resolve();
                                $scope.dataSource.read();
                            }).then(function () {
                                defer.resolve();
                                $scope.dataSource.read();
                            });
                        }
                        return defer.promise;
                    },
                    /**
                     * 데이터를 저장한다.
                     */
                    save : function (models, state, e) {
                        for(var i = 0; i < models.length; i++) {
                            var deptInfo = { 
                                _state    : state, 
                                CD        : models[i].CD,
                                NAME      : models[i].NAME, 
                                MGR_CD    : models[i].MGR_CD, 
                                WORK_GROUP: models[i].WORK_GROUP, 
                                YN_TOPDEPT: models[i].YN_TOPDEPT || 'NO' 
                            };
                            if ( !deptInfo['CD'] || deptInfo['CD'] === "" ) delete deptInfo['CD'];
                            this.saveProcess(deptInfo, e);
                        }
                    },
                    topDeptCheckboxEditor : function (container, options) {
                        var checkbox = $('<input type="checkbox" data-bind="value:' + options.field + '" value="NO" />');
                        
                        if(options.model[options.field] === 'YES') checkbox.attr('checked', 'checked');
                        else                                       checkbox.removeAttr('checked');
                        
                        checkbox.appendTo(container);
                        checkbox.click(function(e) {
                            if(checkbox.is(':checked')) checkbox.val('YES');
                            else                        checkbox.val('NO');
                        });
                    },
                    workGroupDropDownEditor : function (container, options) {
                        $('<input data-bind="value:' + options.field + '"/>')
                            .appendTo(container)
                            .kendoDropDownList({
                                dataTextField: 'NAME',
                                dataValueField: 'CD',
                                dataSource: resData.workCodeList
                        });
                    }
                };

                $scope.dataSource = new kendo.data.TreeListDataSource({
                    batch: true,
                    transport: {
                        read: function(e) {
                            otherMngVO.inquiry(e);
                        },
                        create: function(e) {
                            var models = e.data.models;
                            otherMngVO.save(models, 'I', e);
                        },
                        update: function(e) {
                            var models = e.data.models;
                            otherMngVO.save(models, 'U', e);
                        },
                        destroy: function(e) {
                            var models = e.data.models;
                            otherMngVO.save(models, 'D', e);
                        }
                    },
                    schema: {
                        model: {
                            id: 'CD',
                            parentId: 'MGR_CD',
                            fields: {
                                CD             : { type: 'number', editable: false, nullable: false },
                                MGR_CD         : { type: 'number', editable: false, nullable: true },
                                NAME           : {                 validation: { required: true } },
                                YN_TOPDEPT     : { type: 'string', validation: { required: true } },
                                WORK_GROUP     : { type: 'number', validation: { required: true, min: 0 } },
                                WORK_GROUP_NAME: { type: 'string', validation: { required: true} }
                            },
                            expanded: true
                        }
                    }
                });

                $scope.treelistOptions = {
                    messages: {
                        noRows       : "부서가 존재하지 않습니다.",
                        loading      : "부서리스트를 가져오는 중...",
                        requestFailed: "요청 부서리스트를 가져오는 중 오류가 발생하였습니다.",
                        retry        : "갱신",
                        commands: {
                            create     : '등록',
                            createchild: '하위부서추가',
                            edit       : '수정',
                            update     : '수정',
                            canceledit : '취소',
                            destroy    : '삭제',
                            excel      : '엑셀 내보내기',
                            pdf        : 'PDF 내보내기'
                        }
                    },
                    columns: [
                        { 
                            field     : 'NAME',
                            title     : '부서명',
                            width     : '280px',
                            editable  : true,
                            expandable: true,
                            template  : $('#otherTemplate').html(),
                            attributes: { style: "text-align: left" }
                        },
                        { 
                            field     : 'WORK_GROUP',
                            title     : '직군',
                            width     : '150px',
                            template  : $('#workGroupNameTemplate').html(),
                            editor    : otherMngVO.workGroupDropDownEditor,
                            attributes: { style: "text-align: center" }
                        },
                        { 
                            field     : 'YN_TOPDEPT',
                            title     : '상위부서여부',
                            width     : '120px',
                            template  : $('#topDeptTemplate').html(),
                            editor    : otherMngVO.topDeptCheckboxEditor,
                            attributes: { style: "text-align: center" }
                        },
                        {
                            command   : [ "createchild","edit","destroy" ],
                            attributes: { style: "text-align: left" }
                        }
                    ],

                    remove: function(e) {
                        var msg = "삭제시 하위부서가 모두 삭제되며 복구가 불가능합니다.\n삭제하시겠습니까?";
                        if (!confirm(msg)) {
                            e.preventDefault();
                            this.cancelRow();
                        }
                    },

                    collapse: function(e) {
                        this.cancelRow();
                    },

                    dragend: function(e) {
                        if(!!e) {
                            $scope.dataSource.sync();
                        }
                    }
                };
                

                // 그리드
                var mainGridVO = $scope.mainGridVO = {
                    boxTitle: '그리드',
                    dataSource: {
                        type: "odata",
                        transport: {
                            read: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Employees"
                        },
                        pageSize: 5,
                        serverPaging: true,
                        serverSorting: true
                    },
                    enableCellSelection: true,
                    enableCellEdit: true,
                    sortable: true,
                    pageable: true,
                    dataBound: function() {
                        this.expandRow(this.tbody.find("tr.k-master-row").first());
                    },
                    columns: [{
                        field: "FirstName",
                        title: "First Name",
                        width: "120px"
                        },{
                        field: "LastName",
                        title: "Last Name",
                        width: "120px"
                        },{
                        field: "Country",
                        width: "120px"
                        },{
                        field: "City",
                        width: "120px"
                        },{
                        field: "Title"
                    }],
                    detailGridOptions : function(dataItem) {
                        return {
                            dataSource: {
                                type: "odata",
                                transport: {
                                    read: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
                                },
                                serverPaging: true,
                                serverSorting: true,
                                serverFiltering: true,
                                pageSize: 5,
                                filter: { field: "EmployeeID", operator: "eq", value: dataItem.EmployeeID }
                            },
                            scrollable: false,
                            sortable: true,
                            pageable: true,
                            columns: [
                            { field: "OrderID", title:"ID", width: "56px" },
                            { field: "ShipCountry", title:"Ship Country", width: "110px" },
                            { field: "ShipAddress", title:"Ship Address" },
                            { field: "ShipName", title: "Ship Name", width: "190px" }
                            ]
                        };
                    }
                };

                // 간트차트
                var ganttMngVO = $scope.ganttMngVO = {
                    boxTitle: '간트차트',
                	serviceRoot : "http://demos.telerik.com/kendo-ui/service",
                	tasksDataSource : null,
                	dependenciesDataSource : null
                };
                
                ganttMngVO.tasksDataSource = new kendo.data.GanttDataSource({
                    batch: false,
                    transport: {
                        read: {
                            url: ganttMngVO.serviceRoot + "/GanttTasks",
                            dataType: "jsonp"
                        },
                        update: {
                            url: ganttMngVO.serviceRoot + "/GanttTasks/Update",
                            dataType: "jsonp"
                        },
                        destroy: {
                            url: ganttMngVO.serviceRoot + "/GanttTasks/Destroy",
                            dataType: "jsonp"
                        },
                        create: {
                            url: ganttMngVO.serviceRoot + "/GanttTasks/Create",
                            dataType: "jsonp"
                        },
                        parameterMap: function(options, operation) {
                            if (operation !== "read") {
                                return { models: kendo.stringify(options.models || [options]) };
                            }
                        }
                    },
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                id             : { from: "ID"             , type: "number" },
                                orderId        : { from: "OrderID"        , type: "number", validation: { required: true } },
                                parentId       : { from: "ParentID"       , type: "number", defaultValue: null, validation: { required: true } },
                                start          : { from: "Start"          , type: "date" },
                                end            : { from: "End"            , type: "date" },
                                title          : { from: "Title"          , defaultValue: "", type: "string" },
                                percentComplete: { from: "PercentComplete", type: "number"  },
                                summary        : { from: "Summary"        , type: "boolean" },
                                expanded       : { from: "Expanded"       , type: "boolean", defaultValue: true }
                            }
                        }
                    }
                });

                ganttMngVO.dependenciesDataSource = new kendo.data.GanttDependencyDataSource({
                    transport: {
                        read: {
                            url: ganttMngVO.serviceRoot + "/GanttDependencies",
                            dataType: "jsonp"
                        },
                        update: {
                            url: ganttMngVO.serviceRoot + "/GanttDependencies/Update",
                            dataType: "jsonp"
                        },
                        destroy: {
                            url: ganttMngVO.serviceRoot + "/GanttDependencies/Destroy",
                            dataType: "jsonp"
                        },
                        create: {
                            url: ganttMngVO.serviceRoot + "/GanttDependencies/Create",
                            dataType: "jsonp"
                        },
                        parameterMap: function(options, operation) {
                            if (operation !== "read" && options.models) {
                                return { models: kendo.stringify(options.models) };
                            }
                        }
                    },
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                predecessorId: { from: "PredecessorID", type: "number" },
                                successorId  : { from: "SuccessorID"  , type: "number" },
                                type         : { from: "Type"         , type: "number" }
                            }
                        }
                    }
                });

                $scope.ganttOptions = {
                    dataSource  : ganttMngVO.tasksDataSource,
                    dependencies: ganttMngVO.dependenciesDataSource,
                    views: [
                        "day",
                        { type: "week", selected: true },
                        "month"
                    ],
                    columns: [
                        { field: "id"   , title: "ID"        , width: 60 },
                        { field: "title", title: "Title"     , editable: true },
                        { field: "start", title: "Start Time", format: "{0:MM/dd/yyyy}", width: 100 },
                        { field: "end"  , title: "End Time"  , format: "{0:MM/dd/yyyy}", width: 100 }
                    ],
                    height: 400,

                    showWorkHours: false,
                    showWorkDays: false
                };

                $scope.electricity = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: "http://localhost:8080/json/spain-electricity.json",
                            dataType: "json"
                        }
                    },
                    sort: {
                        field: "year",
                        dir: "asc"
                    }
                });

                //donut chart
                $scope.screenResolution = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: "http://localhost:8080/json/screen_resolution.json",
                            dataType: "json"
                        }
                    },
                    sort: {
                        field: "order",
                        dir: "asc"
                    },
                    group: {
                        field: "year"
                    }
                });

                // Line chart            
                $scope.electricity = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: "../TestList.json",
                            dataType: "json"
                        }
                    },
                    sort: {
                        field: "year",
                        dir: "asc"
                    }
                });
            }
        ]);
}());