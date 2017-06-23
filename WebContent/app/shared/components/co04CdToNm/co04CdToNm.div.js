(function () {
    "use strict";

    angular.module("edtApp.common.directive")
        .directive("co04CdToNm", ["$timeout", function ( $timeout ) {
        	return {
                restrict: 'E',
                scope:{
                	nmBox:'=',
                	cd:'@'
                },
                link: function(scope, element, attrs) {
					element.text(scope.returnCDtoNM);
                },
                controller:['$scope', function ($scope) {
                	$scope.returnCDtoNM = ''; 
                	
                	$scope.changeCDToNM = (function(){
                    	var nmd = $scope.cd,
                    	    grd = $scope.nmBox, 
                    	    result = '';
                    	
                    	for(var i=0, leng=grd.length; i<leng; i++){
                    		if(grd[i].CD_DEF === nmd){
                    			result = grd[i].NM_DEF;
                    		};
                    	}
                    	$scope.returnCDtoNM = result;
                    }());               	                	
                	
                }]
        	};
        }]);
}());
