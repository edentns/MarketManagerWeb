(function () {
    "use strict";

    angular.module("edtApp.common.directive")
        .directive("co05ParsToNm", ["$timeout", function ( $timeout ) {
        	return {
                restrict: 'E',
                scope:{
                	nmBox:'=',
                	noMrk:'@',
                	cd:'@'
                },
                link: function(scope, element, attrs) {
                	$timeout(function(){
	                	var nmd = scope.cd,
	                		noMrk = scope.noMrk,
                            grd = scope.nmBox,
                            result = '';
	                	
	                	var deliverDS = grd.filter(function(ele){
	            			return ele.DC_RMK1 === noMrk;
	            		});	      	
	                	
	                	for(var i=0, leng=deliverDS.length; i<leng; i++){
	                		if(deliverDS[i].CD_PARS === nmd){
		            			result = deliverDS[i].NM_DEF;
		                    };
		                }
	                	
	                	result = (!result) ? '' : result;
	                	
	                	element.text(result);
                	},0);
                }
        	};
        }]);
}());
