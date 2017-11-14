(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Code.controller : sy.CodeCtrl
     * 코드관리
     */
    angular.module("sy.Code.controller")
        .controller("sy.CodeCtrl", ["$scope", "$http", "$q", "$log", "sy.CodeSvc", "APP_CODE", "$timeout", "resData", "Page","UtilSvc",
            function ($scope, $http, $q, $log, SyCodeSvc, APP_CODE, $timeout, resData, Page, UtilSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            gridHeaderAttributes = {"class": "table-header-cell", style: "text-align: center; font-size: 12px"};

	            var rowClick = function( arg ) {
	            	var selected = $.map(this.select(), function(item) {
	            		var innerValue = new Array();
	            		innerValue[0]=item.childNodes[0].innerText;
	            		innerValue[1]=item.childNodes[1].innerText;
	            		innerValue[2]=item.childNodes[4].innerText;
	            		if(innerValue[2] == "가능")innerValue[2] = "N";
	            		else innerValue[2] = "Y";
	            		
	            		return innerValue;
                    });
	            	var codeParam = {
	            		NO_MNGCDHD : selected[0],
                        CD_CLS : selected[1],
	            		YN_SYS : selected[2]
	            	};
	            	$scope.syCodeVO.inquiryAll(codeParam);
				};
	            
	            var syCodeVO = $scope.syCodeVO = {
            		boxTitle : "코드분류",
                    searchKindList : [
                        { name : "분류명칭", value : "defNm" },
                        { name : "분류코드", value : "clsCd" }
                    ],
                    searchKind : "defNm",
                    searchNm   : "",
                    selected   : null,
        			NO_MNGCDHD   : "",
                    CD_CLS   : "",
                    messages: {
            			noRows: "코드가 존재하지 않습니다.",
            			loading: "코드를 가져오는 중...",
                        requestFailed: "요청 코드를 가져오는 중 오류가 발생하였습니다."
            		},
                    data : [],
                    multiSelect : false,
                    selectable: "multiple",
                    enableRowSelection	    : true,
                    enableRowHeaderSelection: false,
                    change: rowClick,
                    procedureParam: "USP_SY_10CODE01_GET&L_SEARCHKIND@s|L_SEARCHNAME@s",
            		dataSource: new kendo.data.DataSource({
                		batch: true,
                		schema: {
                			model: {
                				fields: {
                					NO_MNGCDHD: { },
                					CD_CLS:     { },
                					NM_CLS:     { },
                					DC_RMK:     { },
                					YN_SYS:     { },
                					DTS_UPDATE: { }
                				}
                			}
                		}
                	}),
                	navigatable: true,
                	columns: [
                	    { field : "NO_MNGCDHD", title: "", width: 0, hidden:true },
                	    { field : "CD_CLS", title: "분류코드", width: 90, headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l"}},
                        { field : "NM_CLS", title: "분류명칭", width: 120, headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l"} },
                        { field : "DC_RMK", title: "비고", width: 100, headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l"} },
                        { field : "YN_SYS", title: "수정여부", width: 80, headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l"}, template: '#if (YN_SYS == "Y") {# #="불가능"# #} else {# #="가능"# #} #'},
                        { field : "DTS_UPDATE", title: "수정일시", width: 120, headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l"} }
                	],
                    collapse: function(e) {
                        // console.log(e.sender);
                        this.cancelRow();
                    },
                	editable: false,
                	height: 680,
                	
                	initLoad: function() {
                		var self = this;
                		self.inquiry();
                	},
                    
                    inquiry: function() {
                    	var self = this,
    					param = {
                        	procedureParam: self.procedureParam,
                        	L_SEARCHKIND: self.searchKind,
                        	L_SEARCHNAME: self.searchNm
                        };

                        $scope.$emit( "event:autoLoader", false );
                        
                        UtilSvc.getList(param).then(function (res) {
                        	self.dataSource.data(res.data.results[0]);
    						self.data = res.data.results[0];

                            var codeParam = {
                            	NO_MNGCDHD : "",
                                CD_CLS : "",
                                YN_SYS : ""
                            };

                            if (res.data.results[0].length > 0) {
                                $timeout(function () {
                                    self.selected = res.data.results[0][0];

                                    codeParam.NO_MNGCDHD = self.selected.NO_MNGCDHD;
                                    codeParam.CD_CLS = self.selected.CD_CLS;
                                    codeParam.YN_SYS = self.selected.YN_SYS;
                                    
                                    self.inquiryAll(codeParam);
                                });
                            } else {
                                $scope.$emit( "event:autoLoader", true );
                            }
    					});
                    },
                    
                    inquiryAll: function( oCodeParam ) {
                        var param = {                    	
	    						procedureParam: "USP_SY_10CODE02_GET&L_NO_MNGCDHD@s|L_CD_CLS@s",
	    						L_NO_MNGCDHD: oCodeParam.NO_MNGCDHD,
	    						L_CD_CLS: oCodeParam.CD_CLS
                        	};

	                    UtilSvc.getList(param).then(function (res) {
		                    $scope.$broadcast( "codeMng.customer:inquiry", oCodeParam, res.data.results[1] );
		                    $scope.$broadcast( "codeMng.system:inquiry", oCodeParam, res.data.results[0] );
	                    });
					},
					
                };
	            syCodeVO.initLoad();
            }]);
}());