(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.MrkOpt.controller : ma.MrkOptCtrl
     * 코드관리
     */
    angular.module("edtApp.common.modal")
        .controller("modal.itemCfct", ["$scope", "$http", "$q", "$log", "ma.MrkOptSvc", "APP_CODE", "$timeout", "Page", "UtilSvc", "sendData",
            function ($scope, $http, $q, $log, MaMrkOptSvc, APP_CODE, $timeout, Page, UtilSvc, sendData) {

	            var ma04MrkOptVO = $scope.ma04MrkOptVO = {
	            	boxTitle: "검색",
	            	mngMrkDs: {
	            		autoBind: true,
		    			dataTextField: "NM_MRK",
	                    dataValueField: "NO_MNGMRK",
		    			dataSource: new kendo.data.DataSource({
		    				transport: {
		    					read: function(e){ 
		    						var param = {
	    		    					procedureParam: "MarketManager.USP_MA_04MNGMRK01_GET",
	    		    				};
	    		    				UtilSvc.getList(param).then(function (res) {
	    								e.success(res.data.results[0]);
	    								if(res.data.results[0].length > 0) {
	    									$scope.ma04MrkOptVO.mngMrkMd = res.data.results[0][0].NO_MNGMRK;
	    								}
	    							}); 
		    					}
		    				}
		    			}),
		    			valuePrimitive: true
	            	},
	            	mngMrkMd: [""],
	            	initLoad: function(bLoading) {
	            		var self = this;
	            		self.mngMrkMd                 = sendData;
	            		/*var param = {
		    					procedureParam: "MarketManager.USP_MA_04MNGMRK01_GET",
		    				};
		    				UtilSvc.getList(param).then(function (res) {
		    					self.mngMrkDs.dataSource.data = res.data.results[0];
			            		self.mngMrkMd                 = res.data.results[0][0].NO_MNGMRK;
							});*/

	            		if(bLoading) {
		                	angular.forEach($scope.ma04MrkOptGridVO, function (ma04MrkOptLocalGridVO, iIndex) {
		                		ma04MrkOptLocalGridVO = $scope.ma04MrkOptGridVO.addCommonGridVO(ma04MrkOptLocalGridVO, iIndex);
		                    });
	            		}
	    	            
	            		self.doInquiry();
	            	}
	            };
	            
	            ma04MrkOptVO.doInquiry = function() {
	            	$scope.ma04MrkOptGridVO.doGetList(''
            			, 0      // 처음부터
            			, function(res){
	    					//alert("조회 성공하였습니다.");
            			}
            		);
	            };

				var ma04MrkOptGridVO = $scope.ma04MrkOptGridVO = [{
	        			boxTitle: "대분류",
	                    selectable: "multipleLarge"
		            },
		            {
		            	boxTitle: "중분류",
	                    selectable: "multipleMedium"
		            },
		            {
		            	boxTitle: "소분류",
	                    selectable: "multipleSmall"
		            }
		        ];

	            ma04MrkOptGridVO.addCommonGridVO = function(ma04MrkOptLocalGridVO, iIndex) {
	            	var localSelf = ma04MrkOptLocalGridVO;
	            	localSelf.iIndex = iIndex;
	            	localSelf.messages = {
	        				noRows: "정보가 존재하지 않습니다.",
	        				loading: "정보를 가져오는 중...",
	        				requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
	        				retry: "갱신",
	        			};
	            	localSelf.navigatable              = true;
	            	localSelf.pageable                 = true;
	            	//localSelf.enableRowSelection       = true;
	            	//localSelf.enableRowHeaderSelection = false;
	            	//localSelf.multiSelect              = false;
	            	//localSelf.editable                 = false;
	            	//localSelf.selected                 = null;
	            	localSelf.change                   = rowClick;
	            	localSelf.height                   = 317;
	            	localSelf.dataSource = new kendo.data.DataSource({
        				autoBind: false,
        				transport: {
        					read: function(e) {
        					}
        				},
        				pageSize: 10,
        				schema: {
        					model: {
            					id:"ID_CTGR",
            					fields: {
            						ID_CTGR: {type:"string"},
            						NM_CTGR: {type:"string"}
            					}
        					}
        				},
        			});
	            	localSelf.pageable = {
        				buttonCount: 10
        			};
	            	localSelf.columns  = [
	              		{
	              			field: "ID_CTGR", 
	              			title: "카테고리아이디", 
	              			width: 100,
							cellClass: "ta-c",
							hidden: true,
							headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
	              		},
	            			{
	              			field: "NM_CTGR",
	              			title: localSelf.boxTitle, 
	              			width: 100, 
							cellClass: "ta-c",
							headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
	              		}
            		];
	            	localSelf.dataBound =function(e) {
                		e.sender.select("tr:eq(0)");
                	};
                	
                	return localSelf;
	            };

	            ma04MrkOptGridVO.doGetList = function(strIdCtgr, iIndex, fnThen) {
	            	var self = this
	            	  , param = {
    					procedureParam: "MarketManager.USP_MA_04MNGMRK02_GET&NO_MNGMRK@s|ID_CTGR@s",
    					NO_MNGMRK: $scope.ma04MrkOptVO.mngMrkMd,
    					ID_CTGR: strIdCtgr,
    					}
	            	  , nextIndex = iIndex+1;
	            	
    				UtilSvc.getList(param).then(function (res) {
    					self[iIndex].dataSource.data(res.data.results[0]);
    					
    					if(self.length === nextIndex) {
    						fnThen(res);
    					}

    					for(;self.length > nextIndex; nextIndex++) {
    						self[nextIndex].dataSource.data([]);
    					}
					});
	            };

			    var rowClick = function( arg ) {
			    	var selected = $.map(this.select(), function(item) {
			    		var innerValue = new Array();
			    		innerValue[0]=item.childNodes[0].innerText;
			    		innerValue[1]=item.childNodes[1].innerText;
			    		return innerValue;
			        }),
			        	nextIndex = arg.sender.options.iIndex+1;

			    	if($scope.ma04MrkOptGridVO.length > nextIndex) {
		            	$scope.ma04MrkOptGridVO.doGetList(selected[0]
		        			, nextIndex
		        			, function(res){
		    					//alert("조회 성공하였습니다.");
		        			}
		        		);
			    	}
				};
				
	            $scope.ma04MrkOptVO.initLoad(true);
            }]);
}());