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
                	$timeout(function(){
	                	var nmd = scope.cd,
                            grd = scope.nmBox,
                            result = '',	                	
                            regNumber = /^[0-9]*$/;
	                	
	                	if(regNumber.test(nmd)){
	                		for(var i=0, leng=grd.length; i<leng; i++){
		                		if(grd[i].CD_DEF === nmd){
			            			result = grd[i].NM_DEF;
			                    }
			                }		                	
		                	result = !result ? '' : result;
	                	}else{
	                		result = (!nmd || nmd === "undefined") ? '' : nmd;
	                	}
	                	
	                	element.text(result);
                	},0);
                }
        	};
        }]);
}());
