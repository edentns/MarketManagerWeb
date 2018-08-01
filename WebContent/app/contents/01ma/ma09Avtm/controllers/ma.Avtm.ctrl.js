(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Avtm.controller : ma.AvtmCtrl
     * 광고창관리
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
	            avtmVO.tooltipOptions     = UtilSvc.gridtooltipOptions;

	            // 광고내용의 editor
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
	            
	            // [광고] 그리드 선택 버튼 클릭시 처리 함수
	            editorAvtmVO.onAvtmGrdClick = function(e) {
	            	var element =$(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $("#divAvtmGrd").data("kendoGrid"),
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
	            
	            // 광고 내용의 시작일시, 종료일시 포멧 설정 객체
	            editorAvtmVO.dateOptions = {
	            	parseFormats: ["yyyyMMddHHmmss"], 
	            	format: "yyyy-MM-dd HH:mm",
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
	            
	            // 삭제 버튼 함수
                $scope.onDeleteGrd = function(){
                	var grid = $("#divAvtmGrd").data("kendoGrid"),
                		chked = grid.element.find("input:checked"),
                		chkedLeng = grid.element.find("input:checked").length,
                		row = chked.closest('tr');
                	
                	if(!page.isWriteable()){
                		return;
                	}                	
                	if(chkedLeng < 1){
                		alert("삭제할 데이터를 선택해 주세요.");
                		return false;
                	};
                	                	
                	if(confirm(chkedLeng+"개 의 데이터를 삭제 하시겠습니까?")){       
                		grid.dataSource.fetch(function(){
                			editorAvtmVO.deleteOrdUpdate = "d";
                			grid.dataSource.remove(grid.dataItems(row));
                			grid.dataSource.sync();
            			});
                	};
                };
                
                // 광고 구분 그리드 설정 객체
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
            			var data = this.dataSource.data(),
     			   	        i = 0,
     			   	        sum = 0;
            			
    					for(i; i<data.length; i+=1){
    						sum += 1;
    						data[i].ROW_NUM = sum;
    					};
    					
    					$scope.gridAvtmVO.dataSource.read();
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
	            
	            // 광고 그리드 객체
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
                    			var grid = $("#divAvtmClftGrd").data("kendoGrid"),
                    			    dataItem = grid.dataItem(grid.select()),
                    			    param = {
	            						procedureParam: "USP_MA_09AVTM01_GET&L_NO_AVTMCLFT@s",
	            						L_NO_AVTMCLFT: dataItem.NO_AVTMCLFT
	            					};
                    			
            					UtilSvc.getList(param).then(function (res) {
            						e.success(res.data.results[0]);
            					});
                    		},
                    		create: function(e) {
                    			var defer = $q.defer(),
	                    			grid = $("#divAvtmClftGrd").data("kendoGrid"),
	                			    dataItem = grid.dataItem(grid.select()),
	                			    param = {};
                    			
                    			e.data.models[0].NO_AVTMCLFT = dataItem.NO_AVTMCLFT;
 
                    			param = e.data.models[0];
            					param.DTS_AVTMSTRT = kendo.toString(new Date(param.DTS_AVTMSTRT), "yyyyMMddHHmmss");        
            					param.DTS_AVTMEND  = kendo.toString(new Date(param.DTS_AVTMEND) , "yyyyMMddHHmmss");
            					
                    			MaAvtmSvc.avtmUpt(param, 'I').then(function(res) {
                    				if(!res.data) {
                    					e.error([]);
                    					defer.reject();
                    					alert("저장에 실패하였습니다");
                    				}
                    				
                    				defer.resolve();
                    				alert("저장되었습니다");
                					$scope.gridAvtmVO.dataSource.read();
                    			});
                    		},
                    		update: function(e) {
                    			var defer = $q.defer();
                    			
                    			if(editorAvtmVO.deleteOrdUpdate === "d") {
                    				MaAvtmSvc.avtmDelete(e.data.models).then(function(res) {
                    					if(res.data) {
                							alert("삭제 성공하였습니다.");
    	    	                			$scope.gridAvtmVO.dataSource.read();
    	    	                			defer.resolve();
                						} else {
            	                			e.error([]);
        	                				defer.reject();
        	                				alert("삭제 실패하였습니다.!! 연구소에 문의 부탁드립니다.");
                						}
                    				}, function() {
                    					e.error([]);
    	                				defer.reject(); 
	                					alert("삭제 실패하였습니다.!! 연구소에 문의 부탁드립니다.");
                    				});
                    				editorAvtmVO.deleteOrdUpdate = "";
                    			}
                    			else {
			                    	var param = e.data.models[0];

			                    	if(param.DTS_AVTMSTRT.length > 16 || param.DTS_AVTMEND.length > 16) {
			                    		param.DTS_AVTMSTRT = kendo.toString(new Date(param.DTS_AVTMSTRT), "yyyyMMddHHmmss");        
			                    		param.DTS_AVTMEND  = kendo.toString(new Date(param.DTS_AVTMEND) , "yyyyMMddHHmmss");
			                    	}
			                    	else {
			                    		param.DTS_AVTMSTRT = param.DTS_AVTMSTRT.toString().replace(/[-\s\:]/gi,'')+"00";
			                    		param.DTS_AVTMEND  = param.DTS_AVTMEND.toString().replace(/[-\s\:]/gi,'')+"00";
			                    	}
				
			                    	MaAvtmSvc.avtmUpt(param, 'U').then(function(res) {
	                    				if(!res.data) {
	                    					e.error([]);
	                    					defer.reject();
	                    					alert("수정에 실패하였습니다");
	                    				}
	                    				
	                    				defer.resolve();
	                    				alert("수정되었습니다");
	                					$scope.gridAvtmVO.dataSource.read();
	                    			});
			                    }
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
                    			id: "NO_AVTM",
                				fields: {
                					ROW_CHK       : {type: "boolean", editable: true , nullable: false},
                					NM_AVTMCLFT   : {type: "string" , editable: true , nullable: false},
                					NO_AVTM       : grdScmSelectAttr,
                					NM_AVTM       : {type: "string" , editable: true , nullable: false},
							        NM_AVTR       : {type: "string" , editable: true , nullable: false},
							        NO_AVTMCLFT   : {type: "string" , editable: true , nullable: false},
							        SQ_AVTM       : {type: "string" , editable: true , nullable: false},
							        DTS_AVTMSTRT  : {type: "string" , editable: true , nullable: false},
							        DTS_AVTMEND   : {type: "string" , editable: true , nullable: false},
							        AM_AVTM       : {type: "string" , editable: true , nullable: false},
							        DC_HTMLCONTENT: {type: "string" , editable: true , nullable: false},
							        VAL_HEIGHT    : {type: "string" , editable: true, nullable: false},
							        VAL_WIDTH     : {type: "string" , editable: true, nullable: false},
							        DT_TEST1      : {type: "string" , editable: true , nullable: false},
							        DT_TEST2      : {type: "string" , editable: true , nullable: false}
	                			}
	                		}
	                	}
	            	}),
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#ma-avtm-toolbar-template").html()))}],
                	columns: [
                	    {field: "ROW_CHK"     , headerAttributes: gHeadAttribute, width: 40, title: "선택"}, 
      	                {field: "NM_AVTM"     , headerAttributes: gHeadAttribute, attributes: {class:"ta-l"}, title: "광고명"},
      	                {field: "NM_AVTR"     , headerAttributes: gHeadAttribute, width: "100px", attributes: {class:"ta-c"}, title: "광고주"},
      	                {field: "SQ_AVTM"     , headerAttributes: gHeadAttribute, type: "number", width: "80px", attributes: {class:"ta-r"}, title: "광고순위"},
      	                {field: "DTS_AVTMSTRT", headerAttributes: gHeadAttribute, width: "140px", attributes: {class:"ta-c"}, title: "시작일시"},
      	                {field: "DTS_AVTMEND" , headerAttributes: gHeadAttribute, width: "140px", attributes: {class:"ta-c"}, title: "종료일시"},
      	                {field: "AM_AVTM"     , headerAttributes: gHeadAttribute, type: "number", width: "100px", attributes: {class:"ta-r"}, title: "금액(만원)"},
      	                {command: ["edit"], width: 100 }
                	],
                    collapse: function(e) {
                        this.cancelRow();
                    },      	
                	editable: {
                		mode: "popup",
                		window : {title: "광고내용"},
                		template: kendo.template($.trim($("#ma_avtm_popup_template").html())),
                		confirmation: true
                	},
                	edit: function (e) {
        		        $(".k-window-titlebar").css("height","30px");
        		        $(".k-popup-edit-form").css("margin-top","16px");

        		    	var grid = $("#divAvtmClftGrd").data("kendoGrid"),
        			        dataItem = grid.dataItem(grid.select());
        		    	
            		    //새 글 일때
            		    if (e.model.isNew()) { 	
            		    	
            		        $(".k-grid-update").text("저장");
            		        $(".k-window-title").text("광고 등록");

                    		e.model.set("NM_AVTMCLFT", dataItem.NM_AVTMCLFT);
                    		e.model.set("VAL_WIDTH"  , dataItem.VAL_WIDTH  );
                    		e.model.set("VAL_HEIGHT" , dataItem.VAL_HEIGHT );
            		    //수정 할 글일때
            		    }else{
            		    	$(".k-grid-update").text("수정");
            		    	$(".k-window-title").text("광고 수정");    
            		    	
            		    	e.model.set("DT_TEST1", e.model.DTS_AVTMSTRT);
                    		e.model.set("DT_TEST2", e.model.DTS_AVTMEND);
            		    }
        		        $(".k-grid-cancel").text("취소");    
        		        
            		    $timeout(function () {
                        	if(!page.isWriteable()) {
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
	            
            	$scope.gridAvtmClftVO.dataSource.read().then(function(res) {           		
            	});
            }]);
}());