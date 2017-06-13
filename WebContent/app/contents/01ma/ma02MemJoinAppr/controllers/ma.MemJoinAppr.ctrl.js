(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.MemJoinAppr.controller : ma.MemJoinApprCtrl
     * 코드관리
     */
    angular.module("ma.MemJoinAppr.controller")
        .controller("ma.MemJoinApprCtrl", ['APP_CONFIG', 'UtilSvc',"$scope", "$http", "$q", "$log", "ma.MemJoinApprSvc", "APP_CODE", "$timeout", "resData", "Page",
            function (APP_CONFIG, UtilSvc, $scope, $http, $q, $log, MaMemJoinApprSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            todayString = today.y +""+ today.m +""+ today.d;
	            var joinerDataVO = $scope.joinerDataVO = {
	            	boxTitle : "검색",
	            	setting : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 2
	        		},
	            	datesetting : {
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month'],
						selected   : '1Week',
						period : {
							start : edt.getWeekPeriod(edt.getPrevDate(todayString, "week", null)).st,
							end   : angular.copy(today)
						}
	        		},
                    searchText: { value: "" , focus: false},	//검색어
                    joinerStatusDt : "*",						//가입자 상태
                    joinerProcNameDt : "*",			   			//상품명
                    joinerBetweenDate: "",						//가입기간 
                    StatusDtOptionVO : [],
                    ProcNameDtOptionVO : [],
                    BetweenDateOptionVO : [],
             	    dataTotal : 0,
             	    resetAtGrd : ""
	            };	            
	            //조회
	            joinerDataVO.inQuiry = function(){
	            	var me  = this;
	            	//if(me.searchText.value === ""){me.searchText.focus = !me.searchText.focus; alert("사업자명을  입력해 주세요."); return false;};
	            	if(me.joinerStatusDt === ""){alert("가입자 상태 값을 입력해 주세요."); return false;};
                	if(me.joinerProcNameDt === ""){alert("상품명을 입력해 주세요."); return false;};
                	if(me.joinerBetweenDate === ""){alert("기간을 입력해 주세요."); return false;};
	            	  
                	$scope.checkedIds = [];
	            	$scope.kg.dataSource.read();	            	
	            };
	            //초기화버튼
	            joinerDataVO.inIt = function(){
	            	var me  = this;
                	me.searchText.value = "";
                	me.joinerStatusDt = "*";
                	me.joinerProcNameDt = "*";
                	
                	me.datesetting.selected = "1Week";
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.kg;
                	me.resetAtGrd.dataSource.data([]);
                	if(me.BetweenDateOptionVO) me.joinerBetweenDate = me.BetweenDateOptionVO[0].CD_DEF;
                	else                       me.joinerBetweenDate = ""; 
                	/*$timeout(function () {
                		joinerDataVO.inQuiry();
                    }, 0);*/
	            };
	            
	            var connSetting = $scope.connSetting = {
			        //가입자 상태
		        	joinerStatusDt : function(){
					        			var param = {
					    					procedureParam: "MarketManager.USP_SY_10CODE02_GET&lnomngcdhd@s|lcdcls@s",
					    					lnomngcdhd: "SYCH00002",
					    					lcdcls: "SY_000002"
					    				};            			
					        			UtilSvc.getList(param).then(function (res) {
					        				joinerDataVO.StatusDtOptionVO = res.data.results[0];
					        			}); 
		        					  },
		            //상품명
		            joinerProcNameDt : function(){
						            	var param = {
					    					procedureParam: "MarketManager.USP_SY_10CODE02_GET&lnomngcdhd@s|lcdcls@s",
					    					lnomngcdhd: "SYCH00001",
					    					lcdcls: "SY_000001"
					    				};            			
					        			UtilSvc.getList(param).then(function (res) {
					        				joinerDataVO.ProcNameDtOptionVO = res.data.results[0];
					        			}); 
		            				  },
		            //가입 기간
		            joinerBetweenDate : function(){
						            	var param = {
					    					procedureParam: "MarketManager.USP_SY_10CODE02_GET&lnomngcdhd@s|lcdcls@s",
					    					lnomngcdhd: "SYCH00015",
					    					lcdcls: "SY_000015"
					    				};            			
					        			UtilSvc.getList(param).then(function (res) {
					        				joinerDataVO.BetweenDateOptionVO = res.data.results[0];
					        				joinerDataVO.joinerBetweenDate = res.data.results[0][0].CD_DEF;
					        			}); 
        							  }
		        };
	                   
	            //마켓 검색 그리드
                var gridJoinerMemVO = $scope.gridJoinerMemVO = {
                		autoBind: false,
                        messages: {                        	
                            requestFailed: "마켓정보를 가져오는 중 오류가 발생하였습니다.",
                            commands: {
                                save: '가입승인'
                            }
                            ,noRecords: "검색된 데이터가 없습니다."
                        },
                    	boxTitle : "회원 리스트",
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
                                    	procedureParam: "MarketManager.USP_MA_02JOINSEARCH01_GET&NM@s|YL@s|IL@s|RMK@s|RMKTO@s|RMKFROM@s",      	
                                    	NM:joinerDataVO.searchText.value,
                                    	YL:joinerDataVO.joinerStatusDt,
                                    	IL:joinerDataVO.joinerProcNameDt,
                                    	RMK:joinerDataVO.joinerBetweenDate,
                                    	RMKTO:new Date(joinerDataVO.datesetting.period.start.y, joinerDataVO.datesetting.period.start.m-1, joinerDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),
                                    	RMKFROM:new Date(joinerDataVO.datesetting.period.end.y, joinerDataVO.datesetting.period.end.m-1, joinerDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
                                    };                    				                    				
                					UtilSvc.getList(param).then(function (res) {
                						joinerDataVO.dataTotal = res.data.results[0].length;                						
                						e.success(res.data.results[0]);
                					});
                    			},
    	                		create: function(e) {
    	                			var defer = $q.defer();
    	                			var param = {
                                    	data: $scope.trueDataResult(e.data.models) //e.data.models
                                    };
    	                			MaMemJoinApprSvc.joinerMem(param).then(function(res) {
    	                				defer.resolve();
    	                				//joinerDataVO.inIt();
    	                				$scope.kg.dataSource.read();
    	                			});
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
                        			id: "CD_D_NM_C",
                    				fields: {
                    					ROW_CHK: 			   {editable: false,  nullable: false},
                    					ROW_NUM:			   {type: "string", editable: false, nullable: true}, 
                    					NO_C_NM_C:			   {type: "string", editable: false, nullable: true},                       					
                    					NO_C: 			   	   {type: "string", editable: false, nullable: true},
                    					NM_C: 			   	   {type: "string", editable: false, nullable: true},
                    					NM_RPSTT: 			   {type: "string", editable: false, nullable: true},
                    					NO_BSNSRGTT:		   {type: "string", editable: false, nullable: true},
                    					NO_COMMSALEREG: 	   {type: "string", editable: false, nullable: true},                    					
                    					DC_ID: 				   {type: "string", editable: false, nullable: true},
                    					NM_EMP: 	           {type: "string", editable: false, nullable: true},
                    					NO_PHNE: 			   {type: "string", editable: false, nullable: true},		  
                    					DC_NEWADDR_DC_OLDADDR: {type: "string", editable: false, nullable: true},
                    					DC_REPREMI: 		   {type: "string", editable: false, nullable: true},
                    					CD_JOINYN: 			   {type: "string", editable: false, nullable: true},
                    				    CD_JOINITEM: 		   {type: "string", editable: false, nullable: true},
                    				    DTS_JOIN: 			   {type: "string", editable: false, nullable: true},
                    				    DTS_JOINREQ: 		   {type: "string", editable: false, nullable: true} 
                    				}
                    			}
                    		},
                    	}),
                    	navigatable: true, //키보드로 그리드 셀 이동 가능
                    	toolbar:[{template: '<kendo-button type="botton" title="가입승인" data-ng-click="onGirdClick()">가입승인</kendo-button>'}],
                    	/*selectable: "multiple, row",*/
                    	columns: [
								{
								   field: "ROW_CHK",
								   title: "선택",
								   width: 20,
								   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
							    },    
               		            {
								   field: "ROW_NUM",
								   title: "No",
								   width: 30,
								   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"},
               		            },
            		            {
               		        	   field: "NO_C_NM_C",
               		        	   title: "회사코드-사업자명",
               		        	   width: 100,
               		        	   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
            		            },
            		            {
               		        	   field: "NM_RPSTT",
               		        	   title: "대표자명",
               		        	   width: 100,
               		        	   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
               		            },
	            		        {
           		        	       field: "NO_BSNSRGTT",
           		        	       title: "사업자번호",
           		        	       width: 80,
           		        	       headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
           		        	    },
            		            {
            		        	   field: "NO_COMMSALEREG",
            		               title: "통신판매신고번호",
            		               width: 80,
            		               headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
            		            },
            		            {
            		        	   field: "DC_ID",
            		               title: "아이디",
            		               width: 70,
            		               headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 10px"}
            		            },
            		            {
            		        	   field: "NM_EMP",
            		               title: "담당자",
            		               width: 80,
            		               headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
            		            },
            		            {
            		        	   field: "NO_PHNE",
            		               title: "전화번호",
            		               width: 80,
            		               headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
            		            },
            		            {
            		        	   field: "DC_NEWADDR_DC_OLDADDR",
            		        	   title: "주소1",
            		        	   width: 50,
            		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
           		        	    },          		           
           		        	    {
	         		        	   field: "DC_REPREMI",
	         		        	   title: "이메일",
	         		        	   width: 140,
	         		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
	        		            }, 
	        		            {
		     		        	   field: "CD_JOINYN",
		     		        	   title: "상태",
		     		        	   width: 50,
		     		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
		    		        	}, 
		    		        	{
	         		        	   field: "CD_JOINITEM",
	         		        	   title: "가입상품",
	         		        	   width: 50,
	         		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
	        		        	}, 
        		        	    {
             		        	   field: "DTS_JOIN",
             		        	   title: "가입일",
             		        	   width: 80,
             		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
            		        	}, 
        		        	    {
             		        	   field: "DTS_JOINREQ",
             		        	   title: "가입요청일시",
             		        	   width: 80,
             		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 10px"}
            		        	}
                    	],
                    	dataBound: function(e) {
                            //this.expandRow(this.tbody.find("tr.k-master-row").first()); 마스터 테이블을 확장하므로 세부행을 볼 수 있음
                                                        
                            var rows = this.items();
                            $(rows).each(function () {
                                var index = $(this).index() + 1,
                                    rowLabel = $(this).find(".seq"),
                                    statusLabel = $(this).find(".status-cell"),
                                    joinLabel = $(this).find(".joiner-cell"),
                                    grid = $scope.kg,
	    	                	    dataItem = grid.dataItem($(this)),
	    	                	    resultStatusLabel = '',
	    	                	    resultJoinerLabel = '';
                                
                                //로우 카운트 표시
                                $(rowLabel).html(index);
                                dataItem.ROW_NUM = index;
                                
                                //상태값 표시
                                resultStatusLabel = $scope.changeCD_JOINYN(dataItem.CD_JOINYN, $scope.joinerDataVO.StatusDtOptionVO);
                                $(statusLabel).html(resultStatusLabel);
                                
                                //가입 상품 표시
                                resultJoinerLabel = $scope.changeCD_JOINYN(dataItem.CD_JOINITEM, $scope.joinerDataVO.ProcNameDtOptionVO);
                                $(joinLabel).html(resultJoinerLabel);
                            });                            
                        },
                        collapse: function(e) {
                            this.cancelRow();
                        },         	
                    	editable: {
                    	    confirmation: "선택된 회원을 승인하시겠습니까?",
                    	},
                    	//그리드 행 선택시 클릭 효과
                    	/*change: function(e) { 
                    	    var selectedRows = this.select();
                    	    var selectedDataItems = [];
                    	    for (var i = 0; i < selectedRows.length; i++) {
                    	      var dataItem = this.dataItem(selectedRows[i]);
                    	      selectedDataItems.push(dataItem);
                    	    }
                    	    // selectedDataItems contains all selected data items
                    	},*/
                    	resizable: true,
                    	rowTemplate: kendo.template($.trim($("#template").html())),
                    	height: 590
        		};    
                
                $scope.checkedIds = [];
                
                //체크박스 옵션
                $scope.onClick = function(e){
	                var element =$(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.kg,
	                	dataItem = grid.dataItem(row);
	
	                $scope.checkedIds[dataItem.ROW_NUM] = checked;
	                dataItem.ROW_CHK = checked;
	                
	                if (checked) {
	                  row.addClass("k-state-selected");
	                } else {
	                  row.removeClass("k-state-selected");
	                }
                };
                
                //가입승인 버튼
                $scope.onGirdClick = function(){
                	if(confirm("선택된 회원을 승인하시겠습니까?")){
                		if($scope.checkedIds.length <= 0){
                			alert("가입승인 처리 할 데이터를 체크해 주세요.");
                			return;
                		}else{
                			$scope.kg.saveChanges();
                		};
                	}else{
                		return;
                	}
                };
                
                //가입 승인시 체크박스에 체크된 데이터만 전송
                $scope.trueDataResult = function(obj){
                	var result = [];
                	for(let i=0, leng=obj.length; i<leng; i++){
                		if(obj[i].ROW_CHK){
                			result.push(obj[i]);
                		};
                	};
                	return result;
                }
                
                //코드로 나오는 상태를 이름이 나올수 있게 변경
                $scope.changeCD_JOINYN = function(obj, inGrdDB){
                	var nmd = obj,
                	    grd = inGrdDB, 
                	    result = '';
                	for(let i=0, leng=grd.length; i<leng; i++){
                		if(grd[i].CD_DEF === nmd){
                			result = grd[i].NM_DEF;
                		};
                	}
                	return result;
                }
                
	            connSetting.joinerStatusDt();
	            connSetting.joinerProcNameDt();
	            connSetting.joinerBetweenDate();
            }]);
}());