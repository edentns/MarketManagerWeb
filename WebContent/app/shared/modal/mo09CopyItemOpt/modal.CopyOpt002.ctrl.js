(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Code.controller : sy.CodeCustomCtrl
     * 코드관리 - 사용자코드관리
     */
    angular.module("edtApp.common.modal")
        .controller("modal.otherOptCopy002Ctrl", ["$scope", "$http", "$log", "$timeout", "$q", "sy.CodeSvc", "APP_CODE","UtilSvc",
            function ($scope, $http, $log, $timeout, $q, SyCodeSvc, APP_CODE, UtilSvc) {
        	
        	var copyOpt002VO = $scope.copyOpt002VO = {
                messages: {
        			noRows: "옵션이 존재하지 않습니다.",
        			loading: "옵션정보를 가져오는 중...",
                    requestFailed: "옵션정보를 가져오는 중 오류가 발생하였습니다."
        		},
        		boxTitle : "옵션구성1",
        		optClftList : [],
        		dataSource: new kendo.data.DataSource({
            		transport: {
            			read: function(e) {
//            				
            			},
                		create: function(e) {
                			
            			},
            			update: function(e) {
                			
            			},
            			destroy: function(e) {
            				
            			},
            			parameterMap: function(e, operation) {
            				
            			}
            		},
            		batch: true,
            		schema: {
            			model: {
            				id: "CD_OPT",
            				fields: {
            					CD_ITEM:    {  },
            					CD_OPT:     {  },
            					CD_OPTCLFT: {  },
            					NM_OPT:     {  },
            					QT_SSPL:    { type : "number" },
            					NO_MD:      {  },
            					S_ITEMPRC:  { type : "number" },
            				}
            			}
            		}
            	}),
            	navigatable: true,
            	toolbar: [],
            	columns: [
	           		           {field: "CD_OPTCLFT",   title: "옵션구분", width: 150,
	   							headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
	           		          template: function(e){
	            		       		    var cd_opt = e.CD_OPTCLFT,
	            		       		    	nmd    = "";
	            		       		    if(cd_opt){
	            		       		    	var optData = copyOpt002VO.optClftList;	
		                		       		for(var i = 0, leng=optData.length; i<leng; i++){
	                		       			   if(optData[i].CD_DEF === e.CD_OPTCLFT){
	                		       				 nmd = optData[i].NM_DEF;	
	                		       			   }
		                		       		}	
	            		       		    }
	    	            		        return nmd;
		            		        }},
	        		           {field: "NM_OPT",   title: "옵션명",  width: 100,
	   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	        		           {field: "QT_SSPL",      title: "재고수량",    width: 100,
	       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
	       	   					template:"<span style='float:right'>#: QT_SSPL #</span>"},
	        		           {field: "NO_MD",   title: "모델 NO",   width: 100, 
	           	   				headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
	        		           {field: "S_ITEMPRC", title: "판매가 (+,-)", width: 100,
	       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
	           	   				template:"<span style='float:right'>#: S_ITEMPRC #</span>"}
	                	],
                collapse: function(e) {
                    // console.log(e.sender);
                    this.cancelRow();
                },
            	editable: false,
            	height: 240,
            	
            	initLoad: function() {
            		var self = this;
            		
            		SyCodeSvc.getSubcodeList({cd: "IT_000011", search: "all"}).then(function (result) {
						self.optClftList = result.data;
                    });
            		
            	    // 코드분류 row클릭시 정보를 받아 사용자코드를 조회한다.
                    $scope.$on( "it02_OPT002", function ( $event, oEntity, aData ) {
                        /*self.NO_MNGCDHD = oEntity.NO_MNGCDHD;
                        self.CD_CLS     = oEntity.CD_CLS;*/
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
        	copyOpt002VO.initLoad();
            }]);
}());
