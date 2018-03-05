(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Qa.controller : ma.QaCtrl
     * QA 관리
     */
    angular.module("ma.Help.controller")
        .controller("ma.HelpCtrl", ["$window", "$scope", "$http", "$q", "APP_CONFIG", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "ma.HelpSvc", 
            function ($window, $scope, $http, $q, APP_CONFIG, APP_CODE, $timeout, resData, Page, UtilSvc, MaHelpSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            grdScmSelectAttr = {type: "string", editable: false, nullable: false};
	            
	            var helpMenuVO = $scope.helpMenuVO = {
	            	boxTitle: "메뉴"
	            };
	            //toolTip
	            UtilSvc.gridtooltipOptions.filter = "td";
	            helpMenuVO.tooltipOptions = UtilSvc.gridtooltipOptions;

	            var editorHelpVO = $scope.editorHelpVO = {
	            	kEditor: UtilSvc.kendoEditor("010"),
	            	DC_HTMLCONTENT: '',
	            	ID_CMP: ''
	            };
	            editorHelpVO.kEditor.tools = [
	                "insertImage",
	  	    	    "bold",
	                "italic",
	                "underline",
	                "strikethrough",
	                "justifyLeft",
	                "justifyCenter",
	                "justifyRight",
	                "justifyFull",
	                "insertUnorderedList",
	                "insertOrderedList",
	                "indent",
	                "outdent",
	                "viewHtml"
	            ];
	            
	            editorHelpVO.saveEditor = function() {
	            	var param = {
	            		ID_CMP: editorHelpVO.ID_CMP,
	            		DC_HTMLCONTENT: editorHelpVO.DC_HTMLCONTENT
	            	}
	            	MaHelpSvc.helpUpt(param).success(function(res) {
	            		alert("저장되었습니다.");
	            	});
	            };
	            
	            editorHelpVO.initEditor = function() {
	            	var grid = $("#divMenuGrd").data("kendoGrid");
                	var dataItem = grid.dataItem(grid.select());
                	
	            	//var dataItem = gridMenuVO.dataItem(gridMenuVO.select());
	            	
            		var param = {
    					procedureParam: "USP_MA_08HELP02_GET&L_ID_CMP@s",
    					L_ID_CMP : dataItem.ID_CMP
    				};
					UtilSvc.getList(param).then(function (res) {
						if(res.data.results[0].length === 0) editorHelpVO.DC_HTMLCONTENT = '';
						else editorHelpVO.DC_HTMLCONTENT = res.data.results[0][0].DC_HTMLCONTENT;
						
						editorHelpVO.ID_CMP = dataItem.ID_CMP;
					});
	            };
	            
	            var gridMenuVO = $scope.gridMenuVO = {
	            	autoBind: false,
	            	messages: {                        	
                        requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
                        noRecords: "검색된 데이터가 없습니다."
                    },
                    sortable: true,   
                    noRecords: true,
	            	dataSource: new kendo.data.DataSource({
	            		transport: {
                    		read: function(e) {
                    			var param = {
            						procedureParam: "USP_MA_08HELP01_GET"
            					};
            					UtilSvc.getList(param).then(function (res) {
            						e.success(res.data.results[0]);
            					});
                    		},
                    		parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
	            		}, 
                		batch: true,
                		schema: {
                			model: { 
                    			id: "ID_CMP",
                				fields: {
                					ID_CMP   :grdScmSelectAttr,
							        NM_MENU  :grdScmSelectAttr
	                			}
	                		}
	                	}
	            	}),
	            	change : function(e) {
                		var dataItem = this.dataItem(this.select());
                		var param = {
        					procedureParam: "USP_MA_08HELP02_GET&L_ID_CMP@s",
        					L_ID_CMP : dataItem.ID_CMP
        				};
    					UtilSvc.getList(param).then(function (res) {
    						if(res.data.results[0].length === 0) editorHelpVO.DC_HTMLCONTENT = '';
    						else editorHelpVO.DC_HTMLCONTENT = res.data.results[0][0].DC_HTMLCONTENT;
    						
    						editorHelpVO.ID_CMP = dataItem.ID_CMP;
    						
    					});
                	},
                	dataBound: function(e) {
                		e.sender.select("tr:eq(0)");
                	},
                	columns: [
      		           {
      		        	   field: "ID_CMP"
      		        	 , title: "화면코드"
      		        	 , width: 100
      		        	 , headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
      		             , attributes: {class:"ta-l"}
      		           },
      		           {
      		        	   field: "NM_MENU"
      		        	 , title: "화면명"
      		        	 , width: 150
      		        	 , headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
      		             , attributes: {class:"ta-l"}
      		           }
                	],
                	selectable: "row",
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                    collapse: function(e) {
                        this.cancelRow();
                    },
                	resizable: true,
                	height: 802      
	            };
	            
            	$scope.gridMenuVO.dataSource.read();
            }]);
}());