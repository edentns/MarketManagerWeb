(function () {
    "use strict";

    angular.module("edtApp.common.directive")
        .directive("focus", ["$timeout", function ( $timeout ) {
        	return function(scope, elem, attrs) {
        	      scope.$watch(attrs.focus, function(newval,oldval) {
        	        if (newval != oldval) {
        	          $timeout(function() {
        	            window.scrollTo(0, 0);
        	            elem[0].focus();
        	            
        	          }, 0, false);
        	        }
        	      });
        	    };
        }]);
}());
