(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name sy.Dashboard.controller : sy.DashboardCtrl
     * 코드관리
     */
    angular.module("sy.Dashboard.controller")
        .controller("sy.DashNoticeCtrl", ['$scope', 'sy.DashboardSvc', '$timeout', 'UtilSvc', "APP_CONFIG", 
            function ($scope, MaDashboardSvc, $timeout, UtilSvc, APP_CONFIG) {
	        $scope.$on('dashboard:query', function(event, payload) {
	            MaDashboardSvc.setPayload(notice, payload);
	            $timeout(function() {
	            	notice.find();
	            });
	        });
	
	        var today   = edt.getToday(),
	            period  = { startYear: today.y, startMonth: today.m, endYear: today.y, endMonth: today.m },
            	grid_header = {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"};

	        var notice = $scope.notice = {
	            tabName     : '',
	            code        : {},
	
	            find: function() {
	            	notice.gridNoticeVO.dataSource.read();
	            }
	        };

            $("#divGrd").delegate("tbody>tr", "dblclick", function(){
            	var grid = $("#divGrd").data("kendoGrid");
            	$("#divGrd").data("kendoGrid").editRow($(this));
            });

            UtilSvc.gridtooltipOptions.filter = "td";
            notice.tooltipOptions = UtilSvc.gridtooltipOptions;
	        
	        notice.gridNoticeVO = {
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
			    		empty: "표시할 데이터가 없습니다.",
			    		display: "총 {2}건 중 {0}-{1}건의 자료 입니다."
			    	}
			    },
			    noRecords: true,
				currentFileList:[],
				dataSource: new kendo.data.DataSource({
					transport: {
						read: function(e) {
							var param = {
			                	procedureParam: "USP_SY_01DASHBOARD01_GET"
			                };
							UtilSvc.getList(param).then(function (res) {
								//notice.gridNoticeVO.dataSource.data(res.data.results[0]);
								e.success(res.data.results[0]);
							});
						}
					},
					pageSize: 5,
					batch: true,
					schema: {
						model: {
			    			id: "NO_NOTICE",
							fields: {
								ROW_NUM:		{type: "string"},
								CD_NOTICE:		{type: "string"},
								NM_SUBJECT:		{type: "string"},                    									   
								DC_HTMLCONTENT:	{type: "string"},
			   					DC_CONTENT:		{type: "string"},
								DTS_INSERT:		{type: "string"},                    					
								NO_WRITE:		{type: "string"},
								SY_FILES:		{type: "string"}		
							}
						}
					},
				}),
				selectable: "row",
				columns: [ 
			            {
			        	   field: "CD_NOTICE",
			        	   title: "공지구분",
			        	   width: 80,
			        	   headerAttributes: grid_header
			            },
				        {
			    	       field: "NM_SUBJECT",
			    	       title: "제목",
			    	       width: 300,
			    	       headerAttributes: grid_header
			    	    },
			            {
			        	   field: "DC_HTMLCONTENT",
			               title: "공지내용",
			               width: 300,
			               headerAttributes: grid_header
			            },
			            {
			        	   field: "DTS_INSERT",
			               title: "공지일시",
			               width: 150,
			               headerAttributes: grid_header
			            },
			            {
			        	   field: "NO_WRITE",
			               title: "작성자",
			               width: 100,
			               headerAttributes: grid_header
			            },
			            {
			        	   field: "SY_FILES",
			        	   title: "첨부파일여부",
			        	   headerAttributes: grid_header
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
							L_CD_REF1: e.model.NO_NOTICE
					};
					UtilSvc.getList(param).then(function (res) {
						self.currentFileList = res.data.results[0];
						angular.forEach(self.currentFileList, function (data) {
		                    htmlcode += "<a href='"+notice.gridNoticeVO.url+"?NO_AT="+data.NO_AT+"&CD_AT="+data.CD_AT+"' download="+data.NM_FILE+"> "+data.NM_FILE+" </a></br>";
		                });
						$("#fileInfo").append(htmlcode);
					});
				},
				resizable: true,
				rowTemplate: kendo.template($.trim($("#ma_notice_template").html())),
				height: 215                   	
			};
	        
	        $scope.$on("kendoWidgetCreated", function(event, widget) {
	        	if(widget.textarea) {
	        		$(widget.body).attr("contenteditable", false);
	        	}
	        });
	        
	        notice.find();
        }]);
}());