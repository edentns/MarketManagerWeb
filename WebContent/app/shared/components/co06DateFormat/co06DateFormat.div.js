(function () {
    "use strict";

    angular.module("edtApp.common.directive")
        .directive("co06DateFormat", ["$timeout", function ( $timeout ) {
        	return {
                restrict: 'E',
                scope:{
                	originDate:'='
                },
                link: function(scope, element, attrs) {
                	$timeout(function(){
            			var od = $.trim(scope.originDate),
                		leng = od.length, 
                        result = '';
                	
	                	if(leng === 12){
	                		od = od + "00";
	                	}else if(leng > 14 || leng < 12){
	                		element.text(od);
	                		return true;
	                	}
	                		                	
	                	result = new Date(od.substring(0,4), od.substring(4,6)-1, od.substring(6,8), od.substring(8,10), od.substring(10,12), od.substring(12,14)).dateFormat("Y.m.d H:i:s");
	                	
	                	element.text(result);
                	},0);
                }
        	};
        }]);
}());
