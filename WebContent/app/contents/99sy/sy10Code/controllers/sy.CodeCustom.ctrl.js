(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Code.controller : sy.CodeCustomCtrl
     * 코드관리 - 사용자코드관리
     */
    angular.module("sy.Code.controller")
        .controller("sy.CodeCustomCtrl", ["$scope", "$http", "$log", "$timeout", "$q", "sy.CodeSvc", "APP_CODE","UtilSvc",
            function ($scope, $http, $log, $timeout, $q, SyCodeSvc, APP_CODE, UtilSvc) {
        	
        	var gridCusCodeVO = $scope.gridCusCodeVO = {
    			NO_MNGCDHD   : "",
                CD_CLS   : "",
                deleteData : [],
                messages: {
        			noRows: "사용자코드가 존재하지 않습니다.",
        			loading: "ERP 사용자정보를 가져오는 중...",
                    requestFailed: "요청 ERP 사용자정보를 가져오는 중 오류가 발생하였습니다.",
        			commands: {
        				create: '추가',
        				save: '저장',
        				cancel: '취소',
        				destroy: '삭제'
        			}
        		},
        		boxTitle : "사용자코드",
        		edit: function (e) {
                    if (e.model.isNew()) {
                    	if(e.model.CD_CLS == ""){
                    		e.model.set("YN_USE", "Y");
                    		e.model.set("NO_MNGCDHD", $scope.gridCusCodeVO.NO_MNGCDHD);
                    		e.model.set("CD_CLS", $scope.gridCusCodeVO.CD_CLS);
                    	}
                    }
        		},
        		dataSource: new kendo.data.DataSource({
            		transport: {
            			read: function(e) {
//            				param = {                    	
//            						procedureParam: "USP_SY_10CODE02_GET&L_NO_MNGCDHD@s|L_CD_CLS@s",
//            						L_NO_MNGCDHD: self.NO_MNGCDHD,
//            						L_CD_CLS: self.CD_CLS
//                                },
//        					UtilSvc.getGWList(param).then(function (res) {
//        						e.success(res.data.results[0]);
//        					});
            			},
                		create: function(e) {
                			SyCodeSvc.saveUserCode(e.data.models, "I").success(function () {
                				$scope.gridCusCodeVO.init();
                            });
            			},
            			update: function(e) {
                			SyCodeSvc.saveUserCode(e.data.models, "U").success(function () {
                				$scope.gridCusCodeVO.init();
                            });
            			},
            			destroy: function(e) {
            				var defer = $q.defer();
                			SyCodeSvc.saveUserCode(e.data.models, "DS").success(function () {
        						defer.resolve();
                				$scope.gridCusCodeVO.init();
                            });
                			return defer.promise;
            			},
            			parameterMap: function(e, operation) {
            				
            			}
            		},
            		batch: true,
            		schema: {
            			model: {
            				id: "CD_DEF",
            				fields: {
            					CD_CLS: {},
            					CD_DEF: { validation: {required: true}},
            					CD_DEF_OLD: {},
            					NM_DEF: { validation: {required: true}},
            					DC_RMK1: {},
            					DC_RMK2: {},
            					DC_RMK3: {},
            					DC_RMK4: {},
            					DC_RMK5: {},
            					YN_USE: {},
            					DTS_UPDATE: {editable: false}
            				}
            			}
            		}
            	}),
            	navigatable: true,
            	toolbar: 
            		["create", "save", "cancel"],
            	columns: [
            	       { field : "CD_DEF_OLD", hidden:true },   
       		           { field : "CD_DEF", title: "구분코드", width: "160" },
    		           { field : "NM_DEF", title: "구분코드명", width: "160" },
    		           { field : "DC_RMK1", title: "비고1", width: "100" },
                       { field : "DC_RMK2", title: "비고2", width: "100" },
                       { field : "DC_RMK3", title: "비고3", width: "100" },
                       { field : "DC_RMK4", title: "비고4", width: "100" },
                       { field : "DC_RMK5", title: "비고5", width: "100" },
                       { field : "YN_USE", title: "사용여부", width: "120", cellClass: "ta-c", 
                    	   template: '#if (YN_USE == "Y") {# #="사용"# #} else {# #="사용안함"# #} #', editor: categoryDropDownEditor},
                       { field : "DTS_UPDATE", title: "수정일시", width: "150", cellClass: "ta-c", enableCellEdit: false },
                       {command: [ "destroy" ]}
            	],
                collapse: function(e) {
                    // console.log(e.sender);
                    this.cancelRow();
                },
            	editable: true,
            	height: 260,
            	
            	initLoad: function() {
            		var self = this;
            		
            	    // 코드분류 row클릭시 정보를 받아 사용자코드를 조회한다.
                    $scope.$on( "codeMng.customer:inquiry", function ( $event, oEntity, aData ) {
                        self.NO_MNGCDHD = oEntity.NO_MNGCDHD;
                        self.CD_CLS     = oEntity.CD_CLS;
                        self.dataSource.data(aData);
                    });
            	},
            	init: function() {
            		var self = this;
            		var param = {                    	
    						procedureParam: "USP_SY_10CODE02_GET&L_NO_MNGCDHD@s|L_CD_CLS@s",
    						L_NO_MNGCDHD: self.NO_MNGCDHD,
    						L_CD_CLS: self.CD_CLS
                    	};
            		UtilSvc.getList(param).then(function (res) {
            			self.dataSource.data(res.data.results[1]);
                    });
				}
            };
        	
        	function categoryDropDownEditor(container, options) {
        		$('<input data-text-field="text" data-bind="value:' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                    	dataTextField: 'text',
                        dataValueField: 'YN_USE',
                        dataSource: [{
            	                	   "text": '사용',
            	                       "YN_USE": 'Y'
            	                      }, {
            	                       "text": '사용안함',
            	                       "YN_USE": 'N'
            	                      }]
                    });
            }
        	

        	gridCusCodeVO.initLoad();
            }]);
}());
