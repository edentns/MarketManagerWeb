(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.MemJoinAppr.controller : ma.MemJoinApprCtrl
     * 코드관리
     */
    angular.module("ma.MemJoinAppr.controller")
        .controller("ma.MemJoinApprCtrl", ['APP_CONFIG', 'UtilSvc',"$scope", "$http", "$q", "$log", "ma.MemJoinApprSvc", "APP_CODE", "$timeout", "resData", "Page", "Util01maSvc",
            function (APP_CONFIG, UtilSvc, $scope, $http, $q, $log, MaMemJoinApprSvc, APP_CODE, $timeout, resData, Page, Util01maSvc) {
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
						selected   : resData.selectDate.selected,
						period : {
							start : resData.selectDate.start,
							end   : resData.selectDate.end
						}
	        		},
                    searchText: { value: "" , focus: false},			//검색어
                    joinerStatusDt : resData.YL,						//가입자 상태
                    joinerProcNameDt : resData.IL,			   			//상품명
                    joinerBetweenDate: resData.RMK,						//가입기간 
                    StatusDtOptionVO : resData.StatusDtOptionVO,
                    ProcNameDtOptionVO : resData.ProcNameDtOptionVO,
                    BetweenDateOptionVO : resData.BetweenDateOptionVO,
             	    dataTotal : 0,
             	    resetAtGrd : "",
             	    param: ""
	            };	            
	            //조회
	            joinerDataVO.inQuiry = function(){
	            	var me  = this;
                	
                	me.param = {
                    	procedureParam: "USP_MA_02JOINSEARCH01_GET&NM@s|YL@s|IL@s|RMK@s|RMKTO@s|RMKFROM@s",      	
                    	NM:joinerDataVO.searchText.value,
                    	YL:joinerDataVO.joinerStatusDt,
                    	IL:joinerDataVO.joinerProcNameDt,
                    	RMK:joinerDataVO.joinerBetweenDate,
                    	RMKTO:new Date(joinerDataVO.datesetting.period.start.y, joinerDataVO.datesetting.period.start.m-1, joinerDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),
                    	RMKFROM:new Date(joinerDataVO.datesetting.period.end.y, joinerDataVO.datesetting.period.end.m-1, joinerDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis"),
                    	YL_SELECT_INDEX : joinerDataVO.StatusDtOptionVO.allSelectNames,
                    	IL_SELECT_INDEX :joinerDataVO.ProcNameDtOptionVO.allSelectNames,
                    	PERIOD : UtilSvc.grid.getDateSetting(joinerDataVO.datesetting)
                    };
                	
	            	if(!me.joinerStatusDt){alert("가입자 상태 값을 입력해 주세요."); return false;};
                	if(!me.joinerProcNameDt){alert("상품명을 입력해 주세요.");     return false;};
                	if(!me.joinerBetweenDate){alert("기간을 입력해 주세요.");      return false;};
                	if(me.param.RMKTO > me.param.RMKFROM){alert("기간을 올바르게 입력해 주세요."); return false;};
	            	  
                	$scope.checkedIds = [];
                	$scope.kg.dataSource.data([]);
                	$scope.kg.dataSource.page(1)
            	
        			UtilSvc.grid.setInquiryParam(me.param);
	            };
	            //초기화버튼
	            joinerDataVO.inIt = function(){
	            	var me  = this;
                	me.searchText.value = "";
                	
                	me.StatusDtOptionVO.bReset = true;
                	me.ProcNameDtOptionVO.bReset = true;
                	
                	$timeout(function(){
                		angular.element(".frm-group").find("button:eq(0)").triggerHandler("click");
                		angular.element(".frm-group").find("button:eq(2)").triggerHandler("click");
                	});   
                	                	
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.kg;
                	me.resetAtGrd.dataSource.data([]);
                	
                	if(me.BetweenDateOptionVO){
                		me.joinerBetweenDate = me.BetweenDateOptionVO[0].CD_DEF;
                	}                	
                	else{
                		me.joinerBetweenDate = ""; 
                	}                	
	            };

	            joinerDataVO.isOpen = function (val) {
	            	var searchIdHeight = $("#searchId").height();
	            	var settingHeight = $(window).height() - searchIdHeight - 90;
	            	var pageSizeValue = val? 20 : 24;
	            	
            		$scope.kg.wrapper.height(settingHeight);
            		$scope.kg.resize();
            		$scope.kg.dataSource.pageSize(pageSizeValue);
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
                    		empty: "표시할 데이터가 없습니다.",
                    		display: "총 {2}건 중 {0}~{1}건의 자료 입니다."
                    	}
                    },
                    noRecords: true,
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {         				                    				
            					UtilSvc.getList(joinerDataVO.param).then(function (res) {             						
            						e.success(res.data.results[0]);   
            					});                					
                			},
	                		create: function(e) {
	                			var defer = $q.defer();
	                			var param = {
                                	data: $scope.trueDataResult(e.data.models) //e.data.models
                                };
	                			MaMemJoinApprSvc.joinerMem(param, e).then(function(res) {
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
                		pageSize: 20,
                		change: function(e){
                			var data = this.data(),
                			   	i = 0,
                			   	sum = 0;
                			
                			joinerDataVO.dataTotal = data.length;
    					
        					for(i; i<data.length; i+=1){
        						sum += 1;
        						data[i].ROW_NUM = sum;
        					};
                		},
                		batch: true,
                		schema: {
                			model: {
                    			id: "CD_D_NM_C",
                				fields: {
                					ROW_CHK: 			   {editable: false,  nullable: false},
                					ROW_NUM:			   {type: "number", editable: false, nullable: true}, 
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
                				    DTS_JOINREQ: 		   {type: "string", editable: false, nullable: true},
                				    DTS_LASTLOGIN: 		   {type: "string", editable: false, nullable: true}, 
                				    CNT_CMRKREG:		   {type: "string", editable: false, nullable: true},
                				    CNT_PARSREG: 		   {type: "string", editable: false, nullable: true} 
                				}
                			}
                		},
                	}),
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar:[{template : '<kendo-button type="botton" title="가입승인" data-ng-disabled="!page.isWriteable()" data-ng-click="onGirdClick()">가입승인</kendo-button>'}],
                	/*selectable: "multiple, row",*/
                	columns: [
						{
						   field: "",
						   title: "선택",
						   width: 40,
						   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}								   
					    },    
       		            {
						   field: "ROW_NUM",
						   title: "순번",
						   width: 50,
						   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
       		            },
    		            {
       		        	   field: "NO_C_NM_C",
       		        	   title: "회사코드-사업자명",
       		        	   width: 150,
       		        	   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
    		            },
    		            {
       		        	   field: "NM_RPSTT",
       		        	   title: "대표자명",
       		        	   width: 100,
       		        	   headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
       		            },
        		        {
   		        	       field: "NO_BSNSRGTT",
   		        	       title: "사업자번호",
   		        	       width: 110,
   		        	       headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
   		        	    },
    		            {
    		        	   field: "NO_COMMSALEREG",
    		               title: "통신판매신고번호",
    		               width: 110,
    		               headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
    		            },
    		            {
    		        	   field: "DC_ID",
    		               title: "아이디",
    		               width: 120,
    		               headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
    		            },
    		            {
    		        	   field: "NM_EMP",
    		               title: "담당자",
    		               width: 80,
    		               headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    		            },
    		            {
    		        	   field: "NO_PHNE",
    		               title: "전화번호",
    		               width: 100,
    		               headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    		            },
    		            {
    		        	   field: "DC_NEWADDR_DC_OLDADDR",
    		        	   title: "주소1",
    		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
   		        	    },          		           
   		        	    {
     		        	   field: "DC_REPREMI",
     		        	   title: "이메일",
     		        	   width: 200,
     		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    		            }, 
    		            {
     		        	   field: "CD_JOINYN",
     		        	   title: "상태",
     		        	   width: 50,
     		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    		        	}, 
    		        	{
     		        	   field: "CD_JOINITEM",
     		        	   title: "가입상품",
     		        	   width: 70,
     		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    		        	}, 
		        	    {
     		        	   field: "DTS_JOINREQ",
     		        	   title: "가입요청일시",
     		        	   width: 120,
     		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    		        	}, 
		        	    {
     		        	   field: "DTS_JOIN",
     		        	   title: "가입일",
     		        	   width: 120,
     		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    		        	}, 
		        	    {
      		        	   field: "DTS_LASTLOGIN",
      		        	   title: "최근로그인일시",
      		        	   width: 120,
      		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
     		        	}, 
		        	    {
      		        	   field: "CNT_CMRKREG",
      		        	   title: "마켓등록건수",
      		        	   width: 110,
      		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
     		        	}, 
		        	    {
      		        	   field: "CNT_PARSREG",
      		        	   title: "택배사등록건수",
      		        	   width: 120,
      		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
     		        	}, 
		        	    {
       		        	   field: "",
       		        	   title: "탈퇴처리",
       		        	   width: 90,
       		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
      		        	}, 
		        	    {
    		        	   field: "",
    		        	   title: "복사",
    		        	   width: 90,
    		        	   headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
       		        	}
                	],                       
                    collapse: function(e) {
                        this.cancelRow();
                    },
                	editable: {
                	    confirmation: "선택된 회원을 승인하시겠습니까?"
                	},
                	resizable: true,
                	rowTemplate: kendo.template($.trim($("#template").html())),
                	altRowTemplate: kendo.template($.trim(angular.element(document.querySelector("#template")).html()).replace("class=\"k-grid-row\"","class=\"k-alt\"")),                	
                	height: 656
        		};    
                
                $scope.checkedIds = [];
                
                //체크박스 옵션
                $scope.onClick = function(e){
	                var element = $(e.currentTarget),
	                 	checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.kg,
	                	dataItem = grid.dataItem(row);
	
	                $scope.checkedIds[dataItem.ROW_NUM] = checked;
	                dataItem.ROW_CHK = checked;
	                dataItem.dirty = checked;
	                
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
                
                //회원탈퇴 클릭
                $scope.clickToSecession = function(e) {
                	var dataItem = $scope.kg.dataItem($(e.currentTarget).closest("tr"));
                	
                	if(dataItem.CD_JOINYN === "004") {
                		alert("이미 탈퇴된 회원입니다.");
                		return false;
                	}
                	
                	if(confirm("해당 회원을 탈퇴 처리 하시겠습니까?")){
                		var inputString = prompt('탈퇴를 입력하주세요', '');
                		if(inputString === "탈퇴"){
                			
                		}
                		else{
                			alert("잘못 입력하셨습니다.");
                			return;
                		}
                	}
                };
                
                //클립보드 복사 클릭
                $scope.clickToClipboardCopy = function(e) {
                	var dt = $scope.kg.dataItem($(e.currentTarget).closest("tr")),
                	 	cpStr = dt.NO_C + ' ' + dt.NM_C + ' ' + dt.NM_EMP + ' ' + dt.NO_BSNSRGTT + ' ' +
                	 	dt.NO_COMMSALEREG + ' ' + dt.DC_ID + ' ' + dt.DC_REPREMI + ' ' + dt.CD_JOINYN + ' ' +
                	 	dt.CD_JOINITEM + ' ' + dt.DTS_JOINREQ + ' ' + dt.DTS_JOIN + ' ' + dt.DTS_LASTLOGIN;
                	                		 
	    		    if(MaMemJoinApprSvc.is_ie()){
		    		    window.clipboardData.setData("Text", cpStr);
		    		    alert("복사 되었습니다.");
		    		    return;
	    		    }
	    		    prompt("Ctrl+C를 눌러 복사하세요.", cpStr);
                };
                
                //가입 승인시 체크박스에 체크된 데이터만 전송
                $scope.trueDataResult = function(obj){
                	var result = [];
                	for(var i=0, leng=obj.length; i<leng; i++){
                		if(obj[i].ROW_CHK){
                			result.push(obj[i]);
                		};
                	};
                	return result;
                };
                
                // 처음 로딩해서 조회함.
                $timeout(function() {
                	joinerDataVO.inQuiry();
                	joinerDataVO.isOpen(false);
                });
            }]);
}());