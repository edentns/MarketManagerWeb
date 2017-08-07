(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Code.controller : sy.CodeCustomCtrl
     * 코드관리 - 사용자코드관리
     */
    angular.module("edtApp.common.modal")
        .controller("modal.itemPreviewCtrl", ["$scope","$modal", "$modalInstance", "$http", "$log", "$timeout", "$q", "sy.CodeSvc", "APP_CODE","UtilSvc","sendData",
            function ($scope, $modal, $modalInstance, $http, $log, $timeout, $q, SyCodeSvc, APP_CODE, UtilSvc, sendData) {
        	
        	var previewVO = $scope.previewVO = {
    			fileMainVO: "",
        		fileSmallVO: "",
        		fileDExVO: [],
        		fileDImageVO: [],
        		selectedData : "",
    			param : {
					CD_SIGNITEM   : "",
        			NM_ITEM       : "",
        			DC_ITEMABBR   : "",
        			YN_BCD        : "N",
	        		DC_BCD        : "",
	        		CD_ITEMKIND   : "",
	        		CD_ITEMSTAT   : "",
	        		CD_ITEMCLFT   : "",
	        		ID_CTGR       : "",
	        		
	        		//판매정보
	        		B_ITEMPRC     : 0,
	        		CD_TAXCLFT    : "001",
	        		RT_TAX        : 0,
	        		S_ITEMPRC     : 0,
	        		CD_PCSUNIT    : "001",
	        		QT_MINPCS     : 0,
	        		YN_ADULCTFC   : "Y",
	        		DC_PUREWD     : "",
	        		
	        		//제조정보
	        		YN_MNFROWN    : "N",
	        		NM_MNFR       : "",
	        		YN_SPLYOWN    : "N",
	        		NM_SPLY       : "",
	        		NM_BRD        : "",
	        		DT_RLS        : "",
	        		YN_VLDPRDUSE  : "N",
	        		DTS_VLD       : "",
	        		CD_COONT      : "001",
	        		NM_COOAREA    : "",
	        		NM_SIZE       : "",
	        		VAL_WET       : "",
	        		CD_WETUNIT    : "",
	        		NO_MD         : "",
	        		
	        		//배송정보
	        		YN_BSSSHPINFOUSE : "N",
	        		CD_DMSTFECTSHP: "001",
	        		NM_HSCD       : "",
	        		NM_CTCAITEMCLFT : "",
	        		NM_CLTH       : "",
	        		NM_ITEMMNFTMTRLKR : "",
	        		NM_ITEMMNFTMTRLENG: "",
	        		CD_ITEMSHPTP  : "001",
	        		NM_ITEMSHPTP  : "",
	        		
	        		//옵션/재고
	        		CD_OPTTP      : "002",
	        		
	        		//인허가/고시정보
	        		NM_MD         : "",
	        		NM_CTF        : "",
	        		NM_MNFCOO     : "",
	        		NM_MNFRER     : "",
	        		NO_CSMADVPHNE : "",
	        		CD_CTFOBJ     : "001",
	        		CD_CTFINFO    : ""
    			},
    			dataSourceH : new kendo.data.DataSource({
    				  data: [],
  				  	  group: { field: "NM_OPT" }
    			}),
    			
    			dataSourceL : new kendo.data.DataSource({
  				  	  data: []
    			}),
    			
    			dataSourceO : new kendo.data.DataSource({
				  	  data: []
    			}),
    			
    			change : function() {
    				previewVO.dataSourceL.data(sendData[2]);
    				previewVO.dataSourceL.filter({
    	                field: 'NM_OPT',
    	                operator: 'eq',
    	                value: previewVO.selectedData
    	            });
    				var list = $("#lowOpt").data('kendoDropDownList');
    				list.value("");
				},
    			
    			initLoad : function() {
    				previewVO.param = sendData[1];    // 각종 정보
    				previewVO.param.S_ITEMPRC = Math.round(sendData[1].S_ITEMPRC);
    				if(sendData[2]){                  // 옵션 정보
	    				if(previewVO.param.CD_OPTTP == "002"){
	    					previewVO.dataSourceO.data(sendData[2]);
	    				}
	    				else if (previewVO.param.CD_OPTTP == "003"){
	    					previewVO.dataSourceH.data(sendData[2]);
	        				var arr = new Array(),
	        	            	col = 'NM_OPT';
	        		        
	        		        for(var iIndex=0; iIndex < previewVO.dataSourceH.view().length; iIndex++) {
	        		          	var data = new Object() ;
	        		          	data[col] = previewVO.dataSourceH.view()[iIndex].value;
	        		            arr.push(data);
	        		        }
	        		        previewVO.dataSourceH.data(arr);
	        		        previewVO.dataSourceH.group([]);
	    				}
    				}
    				previewVO.fileMainVO = sendData[0][0];  // 이미지 정보
    				previewVO.fileSmallVO = sendData[0][1];
    				previewVO.fileDExVO = sendData[0][2];
    				previewVO.fileDImageVO = sendData[0][3];
				},
				
				doCancle : function () {
					$modalInstance.dismiss( "cancel" );
				}
            };
        	
        	$scope.optHOptions = {
                    dataTextField: "NM_OPT",
                    dataValueField : "L_NM_OPT"
        	};
        	
        	$scope.optLOptions = {
                    dataTextField: "L_NM_OPT"
        	};
        
        	previewVO.initLoad();
        	 
        	}]);
}());
