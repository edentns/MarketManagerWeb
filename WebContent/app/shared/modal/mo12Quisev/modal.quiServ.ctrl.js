(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Code.controller : sy.CodeCustomCtrl
     * 코드관리 - 사용자코드관리
     */
    angular.module("edtApp.common.modal")
        .controller("modal.quiSevCtrl", ["$scope","$modal", "$modalInstance", "$http", "$log", "$timeout", "$q", "sy.CodeSvc", "APP_CODE","UtilSvc",
            function ($scope, $modal, $modalInstance, $http, $log, $timeout, $q, SyCodeSvc, APP_CODE, UtilSvc) {
        	
        	var quisevVO = $scope.quisevVO = {
        		areaList : [],
            	init: function() {
            		var self = this;
            		var param = {                    	
    						procedureParam: "USP_IT_02QUISEVAREA_GET"
                    	};
            		UtilSvc.getList(param).then(function (res) {
            			for( var i = 0 ; i < res.data.results.length ; i++ ){
            				self.areaList.push(res.data.results[i]);
            			}
            			var temphtml = "";
            			temphtml = "<table class='table-bordered'  style='width: 94%;' ng-repeat = 'area in quisevVO.areaList[1]'>";
            			temphtml += "<colgroup><col style='width: 31%'><col style='width: 33%'><col style='width: 33%'></colgroup>";
						for(var i = 0 ; i < self.areaList[1].length ; i++){
							var j = i;
							if(j==0 || j % 3 == 0) temphtml += "<tr>";
							temphtml += "<td style='text-align: left;'>";
							temphtml += "<input type='checkbox' class='gyeonggi' value='"+self.areaList[1][i].NM_QUISEVAREA+"'>"+self.areaList[1][i].NM_QUISEVAREA;
							temphtml += "</td>";
							if((j+1) % 3 == 0) temphtml += "</tr>";
						}
						temphtml +="</tr></table>";
            		
            		$('#areaTable').html(temphtml);
                    });
				},
				doCancle : function () {
					$modalInstance.dismiss( "cancel" );
				},
				doConfirm : function () {
					var areaString = "";
					var areaLocation = ["서울","경기","광주","대구","대전","부산","울산","인천"];
					for(var i = 0 ; i < quisevVO.areaList.length ; i++){
						for(var j = 0 ; j < quisevVO.areaList[i].length; j++){
							if(quisevVO.areaList[i][j].YN_USE == "Y") {
								if(areaString != "") areaString += ",";
								areaString += areaLocation[i]; 
								areaString += quisevVO.areaList[i][j].NM_QUISEVAREA;
							}
						}
					}
					var checkedValue = "";
					var inputElements = document.getElementsByClassName('gyeonggi');
					var first = true;
					if(inputElements[0].checked){
						if(areaString == "") checkedValue = areaLocation[1] + inputElements[0].value;
						else checkedValue = ","+areaLocation[1] + inputElements[0].value;
					}else{
						for(var i=1; inputElements[i]; ++i){
					      if(inputElements[i].checked){
					    	  if(areaString!="" && first) {checkedValue += ",";first=false;}
					    	  if(checkedValue != "" && checkedValue != ",") checkedValue += ",";
					           checkedValue += inputElements[i].value;
					      }
						}
					}
					areaString = areaString.concat(checkedValue);
					$modalInstance.close( areaString );
				}
            };

        	quisevVO.init();
            }]);
}());
