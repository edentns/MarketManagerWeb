(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Qa.controller : ma.QaCtrl
     * QA 관리
     */
    angular.module("ma.Avtm.controller")
        .controller("ma.AvtmCtrl", ["$window", "$scope", "$http", "$q", "APP_CONFIG", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "ma.AvtmSvc", 
            function ($window, $scope, $http, $q, APP_CONFIG, APP_CODE, $timeout, resData, Page, UtilSvc, MaAvtmSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            grdScmSelectAttr = {type: "string", editable: false, nullable: false},
		            gHeadAttribute = {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
		            iNumWidth = "50px";
	            
	            var avtmClftVO = $scope.avtmClftVO = {
	            	boxTitle: "광고구분"
	            };

	            var avtmVO = $scope.avtmVO = {
	            	boxTitle: "광고"
	            };
	            
	            //toolTip
	            UtilSvc.gridtooltipOptions.filter = "td";
	            avtmClftVO.tooltipOptions = UtilSvc.gridtooltipOptions;
	            avtmVO.tooltipOptions     = avtmVO.gridtooltipOptions;

	            var editorAvtmVO = $scope.editorAvtmVO = {
	            	kEditor: UtilSvc.kendoEditor("010")
	            };
	            editorAvtmVO.kEditor.tools = [
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
	            
	            editorAvtmVO.onAvtmGrdClick = function(e) {
	            	var element =$(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.avtmkg,
	                	dataItem = grid.dataItem(row);
	
	                //$scope.checkedIds[dataItem.ROW_NUM] = checked;	                	                
	                dataItem.ROW_CHK = checked;
	                dataItem.dirty = checked;
	                
	                if (checked) {
	                	row.addClass("k-state-selected");
	                } else {
	                	row.removeClass("k-state-selected");
	                }
	            };
	            
	            editorAvtmVO.dateOptions = {
	            	parseFormats: ["yyyyMMddHHmmss"], 				 
	            	animation: { 
	            		close: { 
	            			effects: "fadeOut zoom:out", 
	            			duration: 300 
	            		}, 
	            		open: { 
	            			effects: "fadeIn zoom:in", 
	            			duration: 300 
	            		} 
	            	}, 
	            	value : new Date()
	            };
	            
	            var gridAvtmClftVO = $scope.gridAvtmClftVO = {
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
            						procedureParam: "USP_MA_09AVTMCLFT01_GET"
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
                    			id: "NO_AVTMCLFT",
                				fields: {
                					ROW_NUM    : {type: "number", editable: false, nullable: false},
                					NM_AVTMCLFT: grdScmSelectAttr,
							        VAL_WIDTH  : grdScmSelectAttr,
							        VAL_HEIGHT : grdScmSelectAttr
	                			}
	                		}
	                	}
	            	}),
	            	change : function(e) {
                		var dataItem = this.dataItem(this.select());
            			var param = {
    						procedureParam: "USP_MA_09AVTM01_GET&L_NO_AVTMCLFT@s",
    						L_NO_AVTMCLFT: dataItem.NO_AVTMCLFT
    					};
    					UtilSvc.getList(param).then(function (res) {
    						$scope.gridAvtmVO.dataSource.data(res.data.results[0]);
    					});
	                	//$scope.gridAvtmClftVO.dataSource.read();
                	},
                	dataBound: function(e) {
                		e.sender.select("tr:eq(0)");
                	},
                	columns: [
                	    {field: "ROW_NUM"    , headerAttributes: gHeadAttribute, type: "number", width: iNumWidth, attributes: {class:"ta-r"}, title: "번호"},
       	                {field: "NM_AVTMCLFT", headerAttributes: gHeadAttribute, attributes: {class:"ta-l"}, title: "광고구분명"},
       	                {field: "VAL_WIDTH"  , headerAttributes: gHeadAttribute, width: "100px", attributes: {class:"ta-r"}, title: "넓이(px)"},
       	                {field: "VAL_HEIGHT" , headerAttributes: gHeadAttribute, width: "100px", attributes: {class:"ta-r"}, title: "높이(px)"}
                	],
                	selectable: "row",
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                    collapse: function(e) {
                        this.cancelRow();
                    },
                	resizable: true,
                	height: 802      
	            };
	            
	            var gridAvtmVO = $scope.gridAvtmVO = {
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
//                    			var grid = $("#divAvtmClftGrd").data("kendoGrid");
//                        		var dataItem = grid.dataItem(grid.select());
//                    			var param = {
//            						procedureParam: "USP_MA_09AVTM01_GET&L_NO_AVTMCLFT@s",
//            						L_NO_AVTMCLFT: dataItem.NO_AVTMCLFT
//            					};
//            					UtilSvc.getList(param).then(function (res) {
//            						e.success(res.data.results[0]);
//            					});
                    		},
                    		create: function(e) {
                    		},
                    		update: function(e) {
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
                    			id: "NO_AVTMCLFT",
                				fields: {
                					ROW_CHK       : {type: "boolean", editable: true , nullable: false},
                					ROW_NUM       : {type: "number" , editable: false, nullable: false},
                					NO_AVTM       : grdScmSelectAttr,
                					NM_AVTM       : grdScmSelectAttr,
							        NM_AVTR       : grdScmSelectAttr,
							        NO_AVTMCLFT   : grdScmSelectAttr,
							        SQ_AVTM       : grdScmSelectAttr,
							        DTS_AVTMSTRT  : grdScmSelectAttr,
							        DTS_AVTMEND   : grdScmSelectAttr,
							        AM_AVTM       : grdScmSelectAttr,
							        DC_HTMLCONTENT: grdScmSelectAttr,
							        NM_AVTMCLFT   : grdScmSelectAttr,
							        VAL_HEIGHT    : grdScmSelectAttr,
							        VAL_WIDTH     : grdScmSelectAttr
	                			}
	                		}
	                	}
	            	}),
                	dataBound: function(e) {
                		e.sender.select("tr:eq(0)");
                	}, 
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#ma-avtm-toolbar-template").html()))}],
                	columns: [
                	    {field: "ROW_CHK"     , headerAttributes: gHeadAttribute, width: 40, title: "선택"}, 
                	    {field: "ROW_NUM"     , headerAttributes: gHeadAttribute, type: "number", width: iNumWidth, attributes: {class:"ta-r"}, title: "번호"},
      	                {field: "NM_AVTM"     , headerAttributes: gHeadAttribute, attributes: {class:"ta-l"}, title: "광고명"},
      	                {field: "NM_AVTR"     , headerAttributes: gHeadAttribute, width: "100px", attributes: {class:"ta-r"}, title: "광고주"},
      	                {field: "SQ_AVTM"     , headerAttributes: gHeadAttribute, type: "number", width: iNumWidth, attributes: {class:"ta-r"}, title: "광고순위"},
      	                {field: "DTS_AVTMSTRT", headerAttributes: gHeadAttribute, width: "140px", attributes: {class:"ta-c"}, title: "시작일시"},
      	                {field: "DTS_AVTMEND" , headerAttributes: gHeadAttribute, width: "140px", attributes: {class:"ta-c"}, title: "종료일시"},
      	                {field: "AM_AVTM"     , headerAttributes: gHeadAttribute, type: "number", width: iNumWidth, attributes: {class:"ta-r"}, title: "금액(만원)"}
                	],
                	selectable: "row",
                    collapse: function(e) {
                        this.cancelRow();
                    },      	
                	editable: {
                		mode: "popup",
                		window : {
                	        title: "광고내용"
                	    },
                		template: kendo.template($.trim($("#ma_avtm_popup_template").html())),
                		confirmation: false
                	},
                	edit: function (e) {
            		    //새 글 일때
            		    if (e.model.isNew()) { 		    	
            		        $(".k-grid-update").text("저장");
            		        $(".k-window-title").text("광고 등록");            		        
            		    //수정 할 글일때
            		    }else{
            		    	$(".k-grid-update").text("수정");
            		    	$(".k-window-title").text("광고 수정");
            		    }
            		    $timeout(function () {
                        	if(!page.isWriteable()) {
                        		$(".k-grid-update").addClass("k-state-disabled");
                        		$(".k-grid-update").click(noticeDataVO.stopEvent);
                        	}
                        });
                	},
                	cancel: function(e) { //pop up 창 닫힐때 작동됨
                	},
                	resizable: true,
                	rowTemplate: kendo.template($.trim($("#ma_avtm_template").html())),
                	altRowTemplate: kendo.template($.trim(angular.element(document.querySelector("#ma_avtm_template")).html()).replace("class=\"k-grid-row\"","class=\"k-alt\"")),
                	height: 802      
	            };
	            
            	$scope.gridAvtmClftVO.dataSource.read();
            }]);
}());