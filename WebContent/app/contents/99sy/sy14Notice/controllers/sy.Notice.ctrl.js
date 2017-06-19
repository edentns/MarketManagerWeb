(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Notice.controller : sy.NoticeCtrl
     * 공지사항
     */
    angular.module("sy.Notice.controller")
        .controller("sy.NoticeCtrl", ["$scope", "$window", "$http", "$q", "$log", "sy.NoticeSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "APP_CONFIG",
            function ($scope, $window, $http, $q, $log, syNoticeSvc, APP_CODE, $timeout, resData, Page, UtilSvc, APP_CONFIG) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            $scope.userInfo = JSON.parse($window.localStorage.getItem("USER"));
  		      
	            //공지사항 구분 드랍 박스 실행	
	            var connSetting = (function(){
    				var param = {
    					procedureParam: "MarketManager.USP_SY_10CODE02_GET&lnomngcdhd@s|lcdcls@s",
    					lnomngcdhd: "SYCH00014",
    					lcdcls: "SY_000014"
    				};
        			UtilSvc.getList(param).then(function (res) {
        				if(res.data.results[0].length >= 1){
        					noticeDataVO.noticeCdVO = res.data.results[0];
        				}
        			});		
	            }());
	            
	            var noticeDataVO = $scope.noticeDataVO = {
		            	boxTitle : "검색",
		            	setting : {
		        			id: "CD_DEF",
		        			name: "NM_DEF",
		        			maxNames: 2
		        		},
		            	datesetting : {
		        			dateType   : 'market',
							buttonList : ['current', '1Day', '1Week', '1Month'],
							selected   : 'current',
							period : {
								start : angular.copy(today),
								end   : angular.copy(today)
							}
		        		},
	                    contentText: { value: "" , focus: false},			//제목/내용
	                    noticeCdModel : "*",								//공지구분	
	                    noticeCdVO : [],
	    				dataTotal : 0,
	             	    resetAtGrd : ""
		        };
	            
	            //조회
	            noticeDataVO.inQuiry = function(){
	            	var me = this;
	            	if(me.noticeCdModel === null || me.noticeCdModel === ""){ alert("공지구분을 입력해 주세요."); return };
	            	
	            	$scope.nkg.dataSource.read();
	            };	            
	            //초기화버튼
	            noticeDataVO.inIt = function(){
	            	var me  = this;
                	me.contentText.value = "";
                	me.noticeCdModel = "*";
                	
                	me.datesetting.selected = "1Week";
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.nkg;
                	me.resetAtGrd.dataSource.data([]);
                	
	            };
	            //저장 후 조회
	            noticeDataVO.afterSaveQuery = function(param){
	            	var me = this;
	            	
            		me.writeText.value = param.NO_WRITE;
	            	me.noticeCdModel = param.CD_NOTICE;
	            		            	
	            	$scope.nkg.dataSource.read();
	            };	
	            
	            $("#divGrd").delegate("tbody>tr", "dblclick", function(){
	            	var grid = $("#divGrd").data("kendoGrid");
	            	$("#divGrd").data("kendoGrid").editRow($(this));
	            });
	            
                var gridNoticeVO = $scope.gridNoticeVO = {
                		autoBind: false,
                        messages: {                        	
                            requestFailed: "공지사항정보를 가져오는 중 오류가 발생하였습니다.",
                            noRecords: "검색된 데이터가 없습니다."
                        },
                    	boxTitle : "공지 리스트",
                    	url : APP_CONFIG.domain +"/ut05FileUpload",
                    	sortable: true,                    	
                        pageable: {
                        	messages: {
                        		empty: "표시할 데이터가 없습니다."
                        	}
                        },
                        noRecords: true,
                		currentFileList:[],
                    	dataSource: new kendo.data.DataSource({
                    		transport: {
                    			read: function(e) {
                    				var param = {
                                    	procedureParam: "USP_SY_14NOTICE01_GET&SEARCH_@s|ARR_CD_NO@s|NOTI_TO@s|NOTI_FROM@s",    
                                    	SEARCH_: noticeDataVO.contentText.value,
                                    	ARR_CD_NO: noticeDataVO.noticeCdModel,
                                    	NOTI_TO: new Date(noticeDataVO.datesetting.period.start.y, noticeDataVO.datesetting.period.start.m-1, noticeDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),
                                    	NOTI_FROM: new Date(noticeDataVO.datesetting.period.end.y, noticeDataVO.datesetting.period.end.m-1, noticeDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
                                    };
                					UtilSvc.getList(param).then(function (res) {
                						noticeDataVO.dataTotal = res.data.results[0].length;
                						e.success(res.data.results[0]);
                					});
                    			}
                    		},
                    		pageSize: 11,
                    		batch: true,
                    		schema: {
                    			model: {
                        			id: "NO_NOTICE",
                    				fields: {
                    					ROW_NUM:		   {	
                    											type: "string", 
                												editable: false, 
                												nullable: false
            											   },
	                   				    NO_C: 		   	   {
																type: "string", 
																editable: false, 
																nullable: false
												    	   },
                    					CD_NOTICE: 		   {
	                    										type: "string",
	                    										defaultValue: "001",
	                    										nullable: false //true 일때 defaultValue가 안 됨
                    									   },
                    					NM_SUBJECT: 	   {
	                											type: "string",                     										
	                    										editable: true, 
	                    										nullable: false
                    									   },                    									   
                    					DC_HTMLCONTENT:	   {	type: "string", 
                    											editable: true, 
                    											nullable: true
                    									   },
                       					DC_CONTENT:	   	   {	
	                       										type: "string", 
																editable: true, 
																nullable: false
                       									   },
                    					DTS_INSERT: 	   {	type: "string", 
                    											editable: false,
                    											nullable: false
                    									   },                    					
                    					NO_WRITE: 		   {
	                											type: "string",
	                    										defaultValue: $scope.userInfo.NM_EMP,
	                    										nullable: false //true 일때 defaultValue가 안 됨
                    									   },
                    					SY_FILES: 		   {
                    											type: "string", 
                    											editable: true, 
                    											nullable: false
                    									   }		
                    				}
                    			}
                    		},
                    	}),
                    	selectable: "row",
                    	columns: [   
               		            {
								   field: "ROW_NUM",
								   title: "번호",
								   width: 30,
								   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
               		            },
            		            {
               		        	   field: "CD_NOTICE",
               		        	   title: "공지구분",
               		        	   width: 100,
               		        	   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
               		            },
	            		        {
           		        	       field: "NM_SUBJECT",
           		        	       title: "제목",
           		        	       width: 150,
           		        	       headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
           		        	    },
            		            {
            		        	   field: "DC_HTMLCONTENT",
            		               title: "공지내용",
            		               width: 120,
            		               headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
            		            },
            		            {
            		        	   field: "DTS_INSERT",
            		               title: "공지일시",
            		               width: 70,
            		               headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
            		               //format: "{0: yyyy-MM-dd HH:mm:ss}"
            		            },
            		            {
            		        	   field: "NO_WRITE",
            		               title: "작성자",
            		               width: 80,
            		               headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
            		            },
            		            {
            		        	   field: "SY_FILES",
            		        	   title: "첨부파일여부",
            		        	   width: 50,
            		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
           		        	    }
                    	],  	
                    	editable: {
                    		mode: "popup",
                    		window : {
                    	        title: "공지 사항"
                    	    },
                    		template: kendo.template($.trim($("#ma_notice_popup_template").html()))
                    	},
                    	edit: function(e) {
                    		e.container.find(".k-button.k-grid-update").hide();
                    		e.container.find(".k-button.k-grid-cancel").text("확인");
                    		var self = this;
                    		var htmlcode = "";
                    		var param = {
                                	procedureParam: "USP_SY_14NOTICEFILES01_GET&L_CD_REF1@s",    
                                	L_CD_REF1: e.model.NO_NOTICE,                   };
            					UtilSvc.getList(param).then(function (res) {
            						self.currentFileList = res.data.results[0];
            						angular.forEach(self.currentFileList, function (data) {
                                        htmlcode += "<a href='"+gridNoticeVO.url+"?NO_AT="+data.NO_AT+"&CD_AT="+data.CD_AT+"' download="+data.NM_FILE+"> "+data.NM_FILE+" </a></br>";
                                    });
            					$("#fileInfo").append(htmlcode);
            					});
						},
                    	resizable: true,
                    	rowTemplate: kendo.template($.trim($("#ma_notice_template").html())),
                    	height: 450                    	
        		};
                
                
                
                function getCheckedNodes(nodes, obj) {
                    var node, childCheckedNodes;
                    var checkedNodes = [];
                    //$scope.searchTotal = nodes.length;
                    obj.searchTotal = nodes.length;
                    
                    for (var i = 0; i < obj.searchTotal; i++) {
                        node = nodes[i];
                        if (node.checked) {
                            checkedNodes.push(node);
                        }                        
                        if (node.hasChildren) {
                            childCheckedNodes = getCheckedNodes(node.children.data());
                            if (childCheckedNodes.length > 0) {
                                checkedNodes = checkedNodes.concat(childCheckedNodes);
                            };
                        };
                    }
                    return checkedNodes;
                };
                //done
                function filter(dataSource, query, viewGrdCnt) {
                    var hasVisibleChildren = false;
                    var data = dataSource instanceof kendo.data.HierarchicalDataSource && dataSource.data();
                    
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        var text = item.NM.toLowerCase(); //유기적으로 변하는 값
                        var itemVisible =
                            query === true // parent already matches
                            || query === "" // query is empty
                            || text.indexOf(query) >= 0; // item text matches query

                        var anyVisibleChildren = filter(item.children, itemVisible || query, viewGrdCnt); // pass true if parent matches

                        hasVisibleChildren = hasVisibleChildren || anyVisibleChildren || itemVisible;

                        item.hidden = !itemVisible && !anyVisibleChildren;
                    }
                    if (data) {
                        // re-apply filter on children
                        dataSource.filter({ field: "hidden", operator: "neq", value: true });
                    }                              
                    return hasVisibleChildren;
               };
               
            }]);
}());