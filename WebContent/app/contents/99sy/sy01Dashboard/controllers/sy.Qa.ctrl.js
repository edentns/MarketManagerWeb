(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name sy.Dashboard.controller : sy.DashboardCtrl
     * 코드관리
     */
    angular.module("sy.Dashboard.controller")
        .controller("sy.DashQaCtrl", ['$scope', 'sy.DashboardSvc', '$timeout', 'UtilSvc', "APP_CONFIG", 
            function ($scope, SyDashboardSvc, $timeout, UtilSvc, APP_CONFIG) {
	        $scope.$on('dashboard:query', function(event, payload) {
	            SyDashboardSvc.setPayload(qa, payload);
	            $timeout(function() {
	            	qa.find();
	            });
	        });
	
	        var today   = edt.getToday(),
            	grid_header = {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"};

	        var qa = $scope.qa = {
	            tabName : '',
	            code    : {},
	
	            find: function() {
	            	qa.gridQaVO.dataSource.read();
	            }
	        };

            $("#divQaGrd").delegate("tbody>tr", "dblclick", function(){
            	var grid = $("#divQaGrd").data("kendoGrid");
            	$("#divQaGrd").data("kendoGrid").editRow($(this));
            });

            UtilSvc.gridtooltipOptions.filter = "td";
            qa.tooltipOptions = UtilSvc.gridtooltipOptions;
	        
	        qa.gridQaVO = {
				autoBind: false,
			    messages: {                        	
			        requestFailed: "묻고답하기 정보를 가져오는 중 오류가 발생하였습니다.",
			        noRecords: "검색된 데이터가 없습니다."
			    },
				boxTitle : "묻고답하기 리스트",
				url : APP_CONFIG.domain +"/ut05FileUpload",
				sortable: true,                    	
			    pageable: {
			    	messages: UtilSvc.gridPageableMessages
			    },
			    noRecords: true,
				inqFileList:[],
				ansFileList:[],
				dataSource: new kendo.data.DataSource({
					transport: {
						read: function(e) {
							var param = {
			                	procedureParam: "USP_SY_01DASHBOARD05_GET"
			                };
							UtilSvc.getList(param).then(function (res) {
								e.success(res.data.results[0]);
							});
						}
					},
					pageSize: 3,
					batch: true,
					schema: {
						model: {
			    			id: "NO_QA",
							fields: {
								ROW_NUM      : {type: "string"},
								NO_QA        : {type: "string"},
								NO_C         : {type: "string"},
								NO_QA        : {type: "string"},
								DTS_INQREG   : {type: "string"},                    									   
								CD_BCL       : {type: "string"},
								NM_BCL       : {type: "string"},
								CD_MCL       : {type: "string"},                    									   
								NM_MCL       : {type: "string"},
								CD_SCL       : {type: "string"},
								NM_SCL       : {type: "string"},
								DC_INQTITLE  : {type: "string"},
								DC_HTMLINQCTT: {type: "string"},                    									   
								DC_INQCTT    : {type: "string"},
								NO_INQPHNE   : {type: "string"},
								DC_INQEMI    : {type: "string"},
								NO_INQCEPH   : {type: "string"},
								NM_ANS       : {type: "string"},
								DC_HTMLANSCTT: {type: "string"},
								DC_ANSCTT    : {type: "string"},
								DTS_ANSREG   : {type: "string"},
								CD_ANSSTAT   : {type: "string"},
								NM_ANSSTAT   : {type: "string"},
								DTS_ANSCFM   : {type: "string"},
								NO_INSERT    : {type: "string"},
								NM_INSERT    : {type: "string"},
								CNT_FILE     : {type: "string"},
								M_CNT_FILE   : {type: "string"}			
							}
						}
					},
				}),
				selectable: "row",
				columns: [ 
		            {
		        	   field: "DTS_INQREG",
		        	   title: "문의등록일시",
		        	   width: 150,
		        	   headerAttributes: grid_header
		            },
		            {
		        	   field: "NM_INSERT",
		               title: "문의자",
		               width: 100,
		               headerAttributes: grid_header
		            },
		            {
		        	   field: "DC_INQTITLE",
		               title: "문의제목",
		               width: 250,
		               headerAttributes: grid_header
		            },
		            {
		        	   field: "DC_INQCTT",
		               title: "문의내용",
		               headerAttributes: grid_header
		            },
		            {
		        	   field: "DC_ANSCTT",
		               title: "답변내용",
		               headerAttributes: grid_header
		            },
		            {
		        	   field: "NM_ANSSTAT",
		               title: "답변처리상태",
		               width: 100,
		               headerAttributes: grid_header
		            }
				],  	
				editable: {
					mode: "popup",
					window : {
				        title: "묻고답하기"
				    },
					template: kendo.template($.trim($("#sy_qa_popup_template").html()))
				},
				edit: function(e) {
                    e.container.find(".k-button.k-grid-update").hide();
					e.container.find(".k-button.k-grid-cancel").text("확인");
					var self = this,
					    inqHtmlCode = "",
					    ansHtmlCode = "",
						param = {
						procedureParam: "USP_SY_01DASHBOARD06_GET&L_CD_REF1@s",    
						L_CD_REF1: e.model.NO_QA
					};
					UtilSvc.getList(param).then(function (res) {
						self.inqFileList = res.data.results[0];
						self.ansFileList = res.data.results[1];
						angular.forEach(self.inqFileList, function (data) {
							inqHtmlCode += "<a href='"+qa.gridQaVO.url+"?NO_AT="+data.NO_AT+"&CD_AT="+data.CD_AT+"' download="+data.NM_FILE+"> "+data.NM_FILE+" </a></br>";
		                });
						angular.forEach(self.ansFileList, function (data) {
							ansHtmlCode += "<a href='"+qa.gridQaVO.url+"?NO_AT="+data.NO_AT+"&CD_AT="+data.CD_AT+"' download="+data.NM_FILE+"> "+data.NM_FILE+" </a></br>";
		                });
						$("#inqFileInfo").append(inqHtmlCode);
						$("#ansFileInfo").append(ansHtmlCode);
					});
				},
				resizable: true,
				rowTemplate: kendo.template($.trim($("#sy_qa_template").html())),
				height: 150                   	
			};
	        
	        $scope.$on("kendoWidgetCreated", function(event, widget) {
	        	if(widget.textarea) {
	        		$(widget.body).attr("contenteditable", false);
	        	}
	        });
	        
	        qa.find();
        }]);
}());