(function () {
   "use strict";

    /**
     * @ngdoc function
     * @name sy.Code.controller : sy.CodeSystemCtrl
     * 코드관리 - 시스템코드관리
     */
    angular.module("sy.Code.controller")
        .controller("sy.CodeSystemCtrl", [ "$scope", function ($scope) {
        	var gridHeaderAttributes = {"class": "table-header-cell", style: "text-align: center; font-size: 12px"};
        	
        	var gridSysCodeVO = $scope.gridSysCodeVO = {
    			NO_MNGCDHD   : "",
                CD_CLS   : "",
                messages: {
        			noRows: "사용자코드가 존재하지 않습니다.",
        			loading: "ERP 사용자정보를 가져오는 중...",
                    requestFailed: "요청 ERP 사용자정보를 가져오는 중 오류가 발생하였습니다."
        		},
        		boxTitle : "기초코드",
        		dataSource: new kendo.data.DataSource({
            		batch: true,
            		schema: {
            			model: {
            				fields: {
            					NM_DEF:     { },
            					DC_RMK1:    { },
            					DC_RMK2:    { },
            					DC_RMK3:    { },
            					DC_RMK4:    { },
            					DC_RMK5:    { },
            					YN_USE:     { },
            					DTS_UPDATE: { }
            				}
            			}
            		}
            	}),
            	navigatable: true,
            	columns: [
    		           { field : "NM_DEF", title: "구분코드명", width: 80, headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l"} },
    		           { field : "DC_RMK1", title: "비고1", width: 40, headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l"} },
                       { field : "DC_RMK2", title: "비고2", width: 40, headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l"} },
                       { field : "DC_RMK3", title: "비고3", width: 40, headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l"} },
                       { field : "DC_RMK4", title: "비고4", width: 40, headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l"}},
                       { field : "DC_RMK5", title: "비고5", width: 40, headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l"} },
                       { field : "YN_USE", title: "사용여부", width: 50, headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l"}
                       , cellFilter: "ynUse", editableCellTemplate: "ui-grid/dropdownEditor", editDropdownValueLabel: "YN_USE",
                           editDropdownOptionsArray : [  { id: "Y", YN_USE: "사용" }, { id: "N", YN_USE: "사용안함" } ],
                           template: '#if (YN_USE == "Y") {# #="사용"# #} else {# #="사용안함"# #} #'
                       },
                       { field : "DTS_UPDATE", title: "수정일시", width: 100, headerAttributes: gridHeaderAttributes, attributes:{class:"ta-l"}
                       , enableCellEdit: false }
            	],
                collapse: function(e) {
                    // console.log(e.sender);
                    this.cancelRow();
                },
            	editable: false,
            	height: 346,
            	
            	initLoad: function() {
            		var self = this;
            		
            	    // 코드분류 row클릭시 정보를 받아 사용자코드를 조회한다.
                    $scope.$on( "codeMng.system:inquiry", function ( $event, oEntity, aData ) {
                        self.NO_MNGCDHD = oEntity.NO_MNGCDHD;
                        self.CD_CLS     = oEntity.CD_CLS;
                        self.dataSource.data(aData);
                    });
            	}
            };
        	
        	gridSysCodeVO.initLoad();
        }]);
}());