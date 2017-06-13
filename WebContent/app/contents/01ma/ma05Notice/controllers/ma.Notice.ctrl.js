(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Notice.controller : ma.NoticeCtrl
     * 코드관리
     */
    angular.module("ma.Notice.controller")
        .controller("ma.NoticeCtrl", ["$window", "$scope", "$http", "$q", "$log", "ma.NoticeSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "Util01maSvc",
            function ($window, $scope, $http, $q, $log, MaNoticeSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util01maSvc) {
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
        					noticeDataVO.popUpNoticeCdVO.dataSource = res.data.results[0];
        				}
        			});		
	            }());
	            
	            //공지 대상
	            var connSetting2 = (function(e, seq, view){
            		var param = {
            			procedureParam: "MarketManager.USP_MA_05MEMBERSEARCH01_GET"
    				};
            		Util01maSvc.getListMset(param, seq).then(function (res) {
        				if(res.data.results[0].length >= 1){
        					view.initTotalCount = res.data.results[0].length;
        					e.success(res.data.results[0]);        					
        				};
        			});
	            });
	            
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
		        		writeText: { value: "" , focus: false},				//작성자
	                    contentText: { value: "" , focus: false},			//제목/내용
	                    noticeCdModel : "*",								//공지구분	                    
	                    noticeTargetModel : [],			   					//공지대상
	                    allSelectTargetModel : [],							//전체 선택시 공지대상자들 아이디를 담아 놓는 모델 
	                    noticeCdVO : [],		 							//조회시 필요한 공지구분 드랍다운
	                    noticeTargetVO : {									//조회시 필요한 공지대상 드랍다운
	                    	tagTemplate: kendo.template($.trim($("#ma-notice-select-template").html())),
	                    	tagMode: "single",
	                        placeholder: "가입자를 선택해 주세요.",
	                        dataTextField: "NM",
	                        dataValueField: "NO_C",
	                        valuePrimitive: true /*,
	                        minLength: 1000000,				//아래로 목록이 안 뜨게 하기 위함;
	                        enforceMinLength: true	        //아래로 목록이 안 뜨게 하기 위함; */
	                    },
	                    popUpNoticeTargetVO : {
	                    	tagTemplate: kendo.template($.trim($("#ma-notice-select-template").html())),
	                    	tagMode: "single",
	                    	//placeholder: "가입자를 선택해 주세요.",
	                        dataTextField: "NM",
	                        dataValueField: "NO_C",
	                        valuePrimitive: true /*,
	                        minLength: 1000000,				//아래로 목록이 안 뜨게 하기 위함;
	                        enforceMinLength: true	        //아래로 목록이 안 뜨게 하기 위함; */           
	                    },
	                    popUpNoticeCdVO : {
	    					dataSource: [],
	    					dataTextField: "NM_DEF",
	                        dataValueField: "CD_DEF",
	                      /*  optionLabel: {"NM_DEF": "공지구분을 선택해 주세요.", "CD_DEF": ""},*/
                        	valuePrimitive: true
	    				},
	    				dataTotal : 0,
	             	    resetAtGrd : ""
		        };
	            
	            //조회
	            noticeDataVO.inQuiry = function(){
	            	var me = this;
	            	if(me.noticeTargetModel === null || me.noticeTargetModel.length < 1){ alert("공지대상을 입력해 주세요."); return };
	            	if(me.noticeCdModel === null || me.noticeCdModel === ""){ alert("공지구분을 입력해 주세요."); return };
	            	
                	$scope.checkedIds = [];
	            	$scope.nkg.dataSource.read();
	            };	            
	            //초기화버튼
	            noticeDataVO.inIt = function(){
	            	var me  = this;
                	me.writeText.value = "";
                	me.contentText.value = "";
                	me.noticeCdModel = "*";
                	me.noticeTargetModel = [];
                	
                	me.datesetting.selected = "1Week";
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.nkg;
                	me.resetAtGrd.dataSource.data([]);
                	
                	$scope.memSearchGrd.searchValue = ""; 	//공지대상 검색 팝업창 초기화 
                	$scope.memSearchGrd.selectAll = false;
                	$scope.memSearchGrd.selectAllItems();
                	
                	$scope.memSearchPopGrd.searchValue = ""; 	//공지대상 검색 팝업창 초기화 
                	$scope.memSearchPopGrd.selectAll = false;
                	$scope.memSearchPopGrd.selectAllItems();
	            };	   
	            //popup insert & update Validation
	            $scope.insertValidation = function(org){
	            	var result = true;
	            	angular.forEach(org.data, function (NM) {
	            		if(NM.ARR_NO_C === null){ alert("공지대상을 입력해 주세요."); result = false; return; }
	            		else if(NM.ARR_NO_C.indexOf("*") > -1){
	            			org.data[0].ARR_NO_C = $scope.noticeDataVO.allSelectTargetModel;
	            		};
	            		if(NM.NO_WRITE === null){ alert("작성자를 입력해 주세요."); result = false; return;};
	            		if(NM.NM_SUBJECT === null){ alert("공지제목을 입력해 주세요."); result = false; return;};
	            		if(NM.DC_HTMLCONTENT === null){ alert("공지내용을 입력해 주세요."); result = false; return;};	            
	            		if(NM.NM_SUBJECT.length > 400){ alert("공지제목을 400자 이내로 입력해주세요."); result = false; return;};	    	            		
	            	});
	            	return result;
	            };
	            //Delete Validation
	            $scope.deleteValidation = function(org){
	            	var result = true,
	            	    resultArray = [];
	            	
	            	try{
	            		angular.forEach(org.data, function (NM) {
		            		if(NM.ROW_CHK === true){ 
		            			resultArray.push(NM);
		            		}
		            		if(NM.NO_NOTICE === null || NM.NO_NOTICE === ""){alert("공지대상을 다시 체크해 주세요."); result = false; return; }		            		
		            	});
	            	}catch(e){
	            		alert("공지 사하 삭제 중 시스템 오류 발생");
	            		result = false;
	            	}
	            	
	            	if(!result){
	            		return resultArray;
	            	}else{
	            		return result;
	            	}
	            };
	            //저장 후 조회
	            noticeDataVO.afterSaveQuery = function(param){
	            	var me = this;
	            	
            		me.writeText.value = param.NO_WRITE;
	            	me.noticeCdModel = param.CD_NOTICE;                                 	
	            	me.noticeTargetModel = param.ARR_NO_C;
	            	me.contentText.value = param.NM_SUBJECT;
	            		            	
	            	$scope.nkg.dataSource.read();
	            };	
	            //마켓 검색 그리드
                var gridNoticeVO = $scope.gridNoticeVO = {
                		autoBind: false,
                        messages: {                        	
                            requestFailed: "마켓정보를 가져오는 중 오류가 발생하였습니다.",
                            commands: {
                            	/*create: '추가',
                            	edit: '수정',
                                destroy: '삭제',*/
                            	save: "저장",
                                update: "수정",
                                canceledit: "취소"
                            }
                            ,noRecords: "검색된 데이터가 없습니다."
                        },
                    	boxTitle : "공지 리스트",
                    	sortable: true,                    	
                        pageable: {
                        	messages: {
                        		empty: "표시할 데이터가 없습니다."
                        	}
                        },
                        noRecords: true,
                    	dataSource: new kendo.data.DataSource({
                    		transport: {
                    			read: function(e) {
                    				var param = {
                                    	procedureParam: "MarketManager.USP_MA_05NOTICE_SEARCH01_GET&NO_WR@s|ARR_CD_NO@s|ARR_NO_C@s|SB_NM@s|NOTI_TO@s|NOTI_FROM@s",    
                                    	NO_WR: noticeDataVO.writeText.value,
                                    	ARR_CD_NO: noticeDataVO.noticeCdModel,                                    	
                                    	ARR_NO_C: noticeDataVO.noticeTargetModel.toString().replace(/,/g,'^'),
                                    	SB_NM: noticeDataVO.contentText.value,
                                    	NOTI_TO: new Date(noticeDataVO.datesetting.period.start.y, noticeDataVO.datesetting.period.start.m-1, noticeDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),
                                    	NOTI_FROM: new Date(noticeDataVO.datesetting.period.end.y, noticeDataVO.datesetting.period.end.m-1, noticeDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
                                    };   
                					UtilSvc.getList(param).then(function (res) {
                						noticeDataVO.dataTotal = res.data.results[0].length;                						
                						e.success(res.data.results[0]);
                					});
                    			},
                    			create: function(e) {
    	                			var defer = $q.defer(),
    	                			    param = {
    	                					data: [e.data.models[0]] //왜  리스트만 인식할까?
    	                				};    	                			
    	                			if(!$scope.insertValidation(param)){
    	                				return;
    	                			};    	                			
    	                			MaNoticeSvc.noticeInsert(param).then(function(res) {
    	                				try{
	    	                				defer.resolve();    	     				
	        	                			noticeDataVO.afterSaveQuery(param.data[0]); // 저장값으로 조회  
	        	                			noticeDataVO.inIt(); 						// 조회 후 초기화           		
	    	                			}catch(err){
	    	        	            		$scope.nkg.dataSource.cancelChanges();	    // 스크립트 오류가 발생하면 등록 팝업창 꺼짐	        	            		
	    	        	            		location.reload();
	    	        	            	}
    	                			});             
    	                			return defer.promise; 
    	                			        				
    	            			},
                    			update: function(e) {
                    				var defer = $q.defer(),
    	                			 	param = {
    	                			 		data: [e.data.models[0]]
    	                			 	};
                    				if(!$scope.insertValidation(param)){
    	                				return;
    	                			}; 
    	                			/*MaMngMrkSvc.mngmrkUpdate(param).then(function(res) {
    	                				defer.resolve();
    	                				mngMrkDateVO.init();
    	                				gridMngMrkUserVO.dataSource.read();
    	                			});
    	                			return defer.promise;*/				
                    			},
                    			destroy: function(e) {
                    				var defer = $q.defer(),
    	                			    param = {
    	                				data: e.data.models
                                    };
                    				console.log("delete", param);
                    				if(!$scope.deleteValidation){
                    					return;
                    				}else{
                    					param = $scope.deleteValidation;
                    				}  
                    				console.log("delete2", param);
    	                			/*MaMngMrkSvc.mngmrkDelete(param).then(function(res) {
    	                				defer.resolve();
    	                				mngMrkDateVO.init();
    	                				gridMngMrkUserVO.dataSource.read();
    	                			});*/
    	                			return defer.promise;
                    			},    	                		
                    			parameterMap: function(e, operation) {
                    				if(operation !== "read" && e.models) {
                    					return {models:kendo.stringify(e.models)};
                    				}
                    			}
                    		},
                    		pageSize: 11,
                    		batch: true,
                    		schema: {
                    			model: {
                        			id: "NO_NOTICE",
                    				fields: {
                    					ROW_CHK: 		   {	
					                    						type: "boolean", 
																editable: false,  
																nullable: false
                										   },
                    					ROW_NUM:		   {	
                    											type: "string", 
                												editable: false, 
                												nullable: false
            											   },                    					
                    					NO_NOTICE:		   {	
                    											type: "string", 
                    											editable: false, 
                    											nullable: false
                    									   },
                    				    ARR_NO_C: 		   {	
																type: "array", 
																editable: true, 
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
                    					SQ_NOTICE: 	       {
	                    										type: "number",
	                    									    defaultValue: 1,
	                    									    nullable: false
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
                    	navigatable: true, //키보드로 그리드 셀 이동 가능
                    	toolbar: [{template: kendo.template($.trim($("#ma-notice-toolbar-template").html()))}],
                    	selectable: "multiple, row",
                    	columns: [
								{
								   field: "ROW_CHK",
								   title: "선택",
								   width: 30,
								   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
							    },    
               		            {
								   field: "ROW_NUM",
								   title: "번호",
								   width: 30,
								   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"},
               		            },
            		            {
               		        	   field: "NO_C",
               		        	   title: "공지대상",
               		        	   width: 100,
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
            		        	   field: "SQ_NOTICE",
            		               title: "우선순위",
            		               width: 50,
            		               headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"},
            		               format: "{0:0}"
            		            },
            		            {
            		        	   field: "SY_FILES",
            		        	   title: "첨부파일여부",
            		        	   width: 50,
            		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
           		        	    },
           		        	    { command: ["edit", "destroy"], width: 70 }
                    	],
                    	dataBound: function(e) {
                            //this.expandRow(this.tbody.find("tr.k-master-row").first());// 마스터 테이블을 확장하므로 세부행을 볼 수 있음
                    		
                    		var rows = this.items();
                            $(rows).each(function () {
                                var index = $(this).index() + 1,
                                    rowLabel = $(this).find(".seq"),
                                    statusLabel = $(this).find(".status-cell"),
                                    joinLabel = $(this).find(".joiner-cell"),
                                    grid = $scope.nkg,
        	                	    dataItem = grid.dataItem($(this)),
        	                	    resultStatusLabel = '',
        	                	    resultJoinerLabel = '';
                                
                                //로우 카운트 표시
                                $(rowLabel).html(index);
                                dataItem.ROW_NUM = index;           
                            }); 
                        },
                        collapse: function(e) {
                            this.cancelRow();
                        },         	
                    	editable: {
                    		mode: "popup",
                    		window : {
                    	        title: "공지 사항"
                    	    },
                    		template: kendo.template($.trim($("#ma_notice_popup_template").html()))
                    	},	
                    	edit: function (e) {
                    		   //add a title
                    		   /*if (e.model.isNew()) {
                    		       $(".k-window-title").text("공지 사항 등록");
                    		   } else {
                    		       $(".k-window-title").text("공지 사항 수정");
                    		   }*/
                    		
                    			// 공지사항 수정시 역으로 공지대상 설정
                    			 if(e.model.NO_C !== "undefined" && e.model.NO_C !== "" && e.model.NO_C !== null){
                    				  var multiSelect = angular.element(document.querySelector("#pnkms")).data("kendoMultiSelect");                   
                                      multiSelect.dataSource.data([]);
                                     
                                      var multiData = multiSelect.dataSource.data();                   
                                    
                                      var array = e.model.NO_C.split(",");
                                      for (var i = 0; i < array.length; i++) {
                                         multiData.push({ NM: array[i], NO_C: array[i]});
                                      }
                                      multiSelect.dataSource.data(multiData);
                                      multiSelect.dataSource.filter({});
                                      multiSelect.value(array);
                                      multiSelect.trigger("change");
                    			 }
                    	},
                    	cancel: function(e) {                    	    
		                    	   //e.preventDefault();
		                    	  var grid = $scope.nkg;
		                    	  if (e.model.isNew()) {		//새로 추가시
		                    		   $scope.checkedIds = [];  //캔슬로우가 되면 체크가 되어있던 그리드가 자꾸 초기화가 되서 체크 박스 체크 시 사용되는 배열도 초기화 시킴
		                               
		                               $scope.memSearchGrd.searchValue = ""; 	//공지대상 검색 팝업창 초기화 
			                           $scope.memSearchGrd.selectAll = false;
			                           $scope.memSearchGrd.selectAllItems();
		                    	  }else{
		                    		  grid.trigger("dataBound");
		                    	  }
                    	},
                    	resizable: true,
                    	rowTemplate: kendo.template($.trim($("#ma_notice_template").html())),
                    	height: 450                    	
        		};
                
                $scope.checkedIds = [];
                
                //체크박스 옵션
                $scope.onNoticeGrdClick = function(e){
	                var element =$(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.nkg,
	                	dataItem = grid.dataItem(row);
	
	                $scope.checkedIds[dataItem.ROW_NUM] = checked;	                	                
	                dataItem.ROW_CHK = checked;
	                
	                /*if (checked) {
	                  row.addClass("k-state-selected");
	                } else {
	                  row.removeClass("k-state-selected");
	                }*/
                };
                
                //그리드 선택 수정 버튼
                /*$scope.onChangeGrdEdit = function(){                	
                	var grid = $scope.nkg,
                     	selectedRow = grid.select(),
                     	dataItem = grid.dataItem(selectedRow);
                	if(selectedRow.length > 1){
                		alert("수정은 한개씩 가능 합니다.");
                		return;
                	}
                	
                	if(selectedRow.length < 1){
                		alert("수정할 열을 선택해 주세요.");
                		return;
                	}
                	grid.editRow(selectedRow);
                }; */               
                //그리드 추가 버튼
                $scope.onCreateeGrdEdit = function(){
                    var grid = $scope.nkg;
                    //grid.addRow($("tr:nth(1)", grid.tbody));
                    grid.addRow(grid.tbody);
                };
                //그리드 삭제 버튼
                $scope.onRemoveGrdEdit = function(){
                    var grid = $scope.nkg;
                    //grid.addRemove($("tr:nth(1)", grid.tbody));
                    grid.addRemove(grid.tbody);
                };
                
                //가입자 검색 UI
                //조회용
                $scope.memSearchGrd = {
                	id: "memSearchGrd",
                	initTotalCount : 0, 			// 초기 로드시 데이터의 총 갯수
        			repeaterItems : [],
        			searchTotal : 0,
        			selectAll : false,
        			selectedCount : 0,
        			searchValue : "",
        			modal: true,
        			visible: false,
        			height: "500",
        			width: "400",
        			title: "가입자 검색",
        			show: $scope.dialogShow,
        			searchKeyUp: function(keyEvent){
        				filter($scope.treeView.dataSource, keyEvent.target.value.toLowerCase(), $scope.memSearchGrd.searchTotal);
        				$scope.memSearchGrd.selectedCount = 0;
        				$scope.treeView.element.find(".k-checkbox").prop("checked", false);
                        $scope.treeView.element.find(".k-checkbox").trigger("change");
        			},
        			actions : [
        		                    { text: '취소' },
        		                    {
        		                        text: '확인', action: function () {
        		                            $scope.$apply(function (e) {
        		                            	var view = $scope.memSearchGrd;
        		                                view.repeaterItems = getCheckedItems($scope.treeView, view);
        		                                
        		                                //전체 조회 시의 체크시 "전체"로 표시함
        		                                if(view.selectAll && view.repeaterItems.length === view.initTotalCount){        		                                	
        		                                	var multiSelect = angular.element(document.querySelector("#nkms")).data("kendoMultiSelect");                   
            		                                multiSelect.dataSource.data([]);
            		                                
            		                                var multiData = multiSelect.dataSource.data();
            		                                multiData.push({NM: "전체", NO_C: "*"});
            		                                multiSelect.dataSource.data(multiData);    
        		                                	multiSelect.value(["*"]);
        		                                	multiSelect.trigger("change"); //트리거를 안하면 모델에 안들어감!
        		                                }else{
        		                                	populateMultiSelect(view.repeaterItems, "#nkms");
        		                                }        		                                
        		                            });
        		                        }
        		                    }
        		    ],
        		    dataSource : new kendo.data.HierarchicalDataSource ({ 
        		    	transport : {
        		    		read : function(e){
        		    			connSetting2(e, "noticeGet", $scope.memSearchGrd); 
        		    		}
        		    	},
        		    	schema: {
                			model: {
                    			id: "NM",
                				fields: {
                					NM : {},
                					NO_C : {}
                				}
                			}
        		    	}
        		    }),
	    			autoBind: true,
                    dataTextField: "NM", //유기적으로 바뀌는 값
                    checkboxes: true,
                    loadOnDemand: false,
                    expandAll: true, 
                    dataBound: function (e) {
                        e.sender.expand(e.node);    
                    },
                    check: function (e) {
                        $timeout(function () {
                        	$scope.$apply(function(){
                        		var view = $scope.memSearchGrd,
                        		    liList = $scope.treeView.element.find("li").length;
                        		
                        		view.selectedCount = getCheckedItems(e.sender, view).length;
                                if(view.selectedCount === liList && view.selectAll === false){
                                	view.selectAll = true;
                                }else if(view.selectedCount !== liList && view.selectAll === true){
                                	view.selectAll = false;
                                };
                        	});
                    	}, 0);
                    },
                    selectAllItems : function () {
                    	$scope.treeView.element.find(".k-checkbox").prop("checked", $scope.memSearchGrd.selectAll);
                        $scope.treeView.element.find(".k-checkbox").trigger("change");
                    }
                };
                
                //업데이트용(수정 & 삽입 용)
                $scope.memSearchPopGrd = {
                	id: "memSearchPopGrd",
                	initTotalCount : 0, 			// 초기 로드시 데이터의 총 갯수
        			repeaterItems : [],
        			searchTotal : 0,
        			selectAll : false,
        			selectedCount : 0,
        			searchValue : "",
        			modal: true,
        			visible: false,
        			height: "500",
        			width: "400",
        			title: "가입자 검색",
        			show: $scope.dialogShow,
        			searchKeyUp: function(keyEvent){
        				let scopeTreeView = $scope.treeViewPop;
        				let grdView = $scope.memSearchPopGrd;
        				filter(scopeTreeView.dataSource, keyEvent.target.value.toLowerCase(), grdView.searchTotal);
        				grdView.selectedCount = 0;
        				scopeTreeView.element.find(".k-checkbox").prop("checked", false);
        				scopeTreeView.element.find(".k-checkbox").trigger("change");
        			},
        			actions : [
        	                    { text: '취소' },
        	                    {
        	                        text: '확인', action: function () {
        	                            $scope.$apply(function (e) {                            	
        	                            	let view = $scope.memSearchPopGrd; 
        	                            	view.repeaterItems = getCheckedItems($scope.treeViewPop, view);
        	                            	
        	                            	//전체 조회 시의 체크시 "전체"로 표시함
    		                                if(view.selectAll && view.repeaterItems.length === view.initTotalCount){    		                                	
    		                                	var multiSelect = angular.element(document.querySelector("#pnkms")).data("kendoMultiSelect");
    		                                	var item = view.repeaterItems;
        		                                multiSelect.dataSource.data([]);        		                                
        		                                var multiData = multiSelect.dataSource.data();
        		                                
        		                                multiData.push({NM: "전체", NO_C: "*"});
        		                                multiSelect.dataSource.data(multiData);    
    		                                	multiSelect.value(["*"]);
    		                                	multiSelect.trigger("change"); //트리거를 안하면 모델에 안들어감!
    		                                	
    		                                	for (var i = 0, cnt = item.length; i < cnt; i++) {
    		                                		$scope.noticeDataVO.allSelectTargetModel.push(item[i].NO_C.toString());
    		                                    }
    		                                }else{
    		                                	populateMultiSelect(view.repeaterItems, "#pnkms");
    		                                }  
        	                            });
        	                        }
        	                    }
        	        ],
        	        dataSource: new kendo.data.HierarchicalDataSource ({ 
        		    	transport : {
        		    		read : function(e){
        		    			connSetting2(e, "noticeGet", $scope.memSearchPopGrd);
        		    		}
        		    	}
        		    }),
	    			autoBind: true,
                    dataTextField: "NM", //유기적으로 바뀌는 값
                    checkboxes: true,
                    loadOnDemand: false,
                    expandAll: true, 
                    dataBound: function (e) {
                        e.sender.expand(e.node);
                    },
                    check: function (e) {
                    	/*setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.selectedCount = getCheckedItems(e.sender).length;
                        });
                    	});*/
                        $timeout(function () {
                        	$scope.$apply(function(){
                        		var view = $scope.memSearchPopGrd;
                        		var liList = $scope.treeViewPop.element.find("li").length; 
                        		view.selectedCount = getCheckedItems(e.sender, view).length;
                                if(view.selectedCount === liList && view.selectAll === false){
                                	view.selectAll = true;
                                }else if(view.selectedCount !== liList && view.selectAll === true){
                                	view.selectAll = false;
                                };
                        	});
                    	}, 0);
                    },
                    selectAllItems : function () {
                        $scope.treeViewPop.element.find(".k-checkbox").prop("checked", $scope.memSearchPopGrd.selectAll);
                        $scope.treeViewPop.element.find(".k-checkbox").trigger("change");
                    }
                };             
                                
                //done
                $scope.dialogShow = function (e) {
                    //Focusing the search box when the dialog is opened
                    //angular.element(document.getElementById("memberSearch")).focus();
                    e.sender.element.find(".memberSearch").focus();
                    //checking preselected values
                    //var dataSource = $scope.treeView.dataSource;
                    e.sender.element.find(".k-checkbox").removeAttr("checked").trigger("change");
                    for (var i = 0; i < e.sender.options.repeaterItems.length; i++) {
                        var item = e.sender.element.findByText(e.sender.options.repeaterItems[i]["NM"]); //유기적으로 바뀌는 값
                        item.find(".k-checkbox").first().click();
                    };
                };
                //done
                function getCheckedItems(treeview, obj) {
                    var nodes = treeview.dataSource.data();
                    return getCheckedNodes(nodes, obj);
                };
                //done
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
               //done
               function populateMultiSelect(checkedNodes, id) {
                   var multiSelect = angular.element(document.querySelector(id)).data("kendoMultiSelect");                   
                   multiSelect.dataSource.data([]);
                   
                   var multiData = multiSelect.dataSource.data();                   
                  
                   if(checkedNodes.length > 0) {
                       var array = multiSelect.value().slice();
                       for (var i = 0; i < checkedNodes.length; i++) {
                    	   var strNM = checkedNodes[i].NM.split("-");
                           multiData.push({ NM: strNM[0], NO_C: checkedNodes[i].NO_C});
                           array.push(checkedNodes[i].NO_C.toString());
                       }
                       multiSelect.dataSource.data(multiData);
                       multiSelect.dataSource.filter({});
                       multiSelect.value(array);
                       multiSelect.trigger("change");
                   };
               };
            
            }]);
}());