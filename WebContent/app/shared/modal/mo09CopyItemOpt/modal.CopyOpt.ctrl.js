(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Code.controller : sy.CodeCtrl
     * 코드관리
     */
    angular.module("edtApp.common.modal")
        .controller("modal.otherOptCopyCtrl", ["$scope", "$http", "$modalInstance", "$q", "$log", "sy.CodeSvc", "APP_CODE", "$timeout", "Page","UtilSvc",
            function ($scope, $http, $modalInstance, $q, $log, SyCodeSvc, APP_CODE, $timeout, Page, UtilSvc) {

	            var rowClick = function( arg ) {
	            	var selected = $.map(this.select(), function(item) {
	            		var innerValue = new Array();
	            		innerValue[0]=item.childNodes[0].innerText;
	            		innerValue[1]=item.childNodes[1].innerText;
	            		return innerValue;
                    });
	            	var itemParam = {
	            		CD_ITEM : selected[0],
	            		CD_OPTTP : selected[1]
	            	};
	            	$scope.syCodeVO.selectedData.CD_ITEM = selected[0];
	            	$scope.syCodeVO.selectedData.CD_OPTTP = selected[1];
	            	$scope.syCodeVO.inquiryAll(itemParam);
				};
				
	            
	            var syCodeVO = $scope.syCodeVO = {
            		boxTitle : "상품",
            		searchCodeList : [],
            		selectedData: {
            			CD_ITEM : "",
            			CD_OPTTP : ""
            		},
            		searchWord: "",
                    selectedCode   : "CD_SIGNITEM",
                    messages: {
            			noRows: "상품이 존재하지 않습니다.",
            			loading: "상품정보를 가져오는 중...",
                        requestFailed: "요청 상품정보를 가져오는 중 오류가 발생하였습니다."
            		},
                    data : [],
                    multiSelect : false,
                    selectable: "multiple",
                    enableRowSelection	    : true,
                    enableRowHeaderSelection: false,
                    change: rowClick,
                    procedureParam: "MarketManager.USP_IT_02BSSITEM_SEARCH&L_SEARCH_TYPE@s|L_SEARCH_WORD@s",
            		dataSource: new kendo.data.DataSource({
                		batch: true,
                		schema: {
                			model: {
                				fields: {
                					CD_ITEM:      { },
                					CD_OPTTP:     { },
                					CD_SIGNITEM:  { },
                					NM_ITEM:      { },
                					DC_ITEMABBR:  { },
                					CD_ITEMCLFT:  { },
                					NM_OPTTP:     { }
                				}
                			}
                		}
                	}),
                	navigatable: true,
                	columns: [
                	    { field : "CD_ITEM", title: "", hidden:true },  
                	    { field : "CD_OPTTP", title: "", hidden:true },
                	    { field : "CD_SIGNITEM", title: "상품코드", width: 120, cellClass: "ta-c" },
                	    { field : "NM_ITEM", title: "상품명", width: 200, cellClass: "ta-c" },
                        { field : "DC_ITEMABBR", title: "상품약어", width: 90, cellClass: "ta-c" },
                        { field : "CD_ITEMCLFT", title: "상품구분", width: 60 },
                        { field : "NM_OPTTP", title: "옵션종류", width: 80, cellClass: "ta-c" }
                	],
                    collapse: function(e) {
                        // console.log(e.sender);
                        this.cancelRow();
                    },
                	editable: false,
                	height: 350,
                	
                	initLoad: function() {
                		var self = this;
                		SyCodeSvc.getSubcodeList({cd: "IT_000008", search: "all"}).then(function (result) {
    						self.searchCodeList = result.data;
                        });
                		self.inquiry();
                	},
                    
                    inquiry: function() {
                    	var self = this,
    					param = {
                        	procedureParam: self.procedureParam,
                        	L_SEARCH_TYPE :	self.selectedCode,
        					L_SEARCH_WORD : self.searchWord
                        };
                        
                        UtilSvc.getList(param).then(function (res) {
                        	self.dataSource.data(res.data.results[0]);
    						self.data = res.data.results[0];
    					});
                    },
                    
                    inquiryAll: function( oItemParam ) {
                    	if(oItemParam.CD_OPTTP == "002"){
                    		var param = {
            						procedureParam:"MarketManager.USP_IT_02BSSITEMOPT_GET&L_CD_ITEM@s|L_FLAG@s",
            						L_CD_ITEM  :  oItemParam.CD_ITEM,
            						L_FLAG     :  "1"
            					};

    	                    UtilSvc.getList(param).then(function (res) {
    		                    $scope.$broadcast( "it02_OPT002", oItemParam, res.data.results[0] );
    	                    });
                    	}else if (oItemParam.CD_OPTTP == "003"){
                    		var param = {
            						procedureParam:"MarketManager.USP_IT_02BSSITEMOPT_GET&L_CD_ITEM@s|L_FLAG@s",
            						L_CD_ITEM  :  oItemParam.CD_ITEM,
            						L_FLAG     :  "2"
            					};

    	                    UtilSvc.getList(param).then(function (res) {
    	                    	$scope.$broadcast( "it02_OPT003", oItemParam, res.data.results[0] );
    	                    });
                    	}
                        
					},
					
					doConfirm: function() {
						var self = this;
						$modalInstance.close( self.selectedData );
					}
					
                };
	            syCodeVO.initLoad();
            }]);
}());