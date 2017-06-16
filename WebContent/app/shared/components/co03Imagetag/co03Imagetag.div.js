(function () {
    "use strict";

    angular.module("edtApp.common.directive")
        .directive("co03Imagetag", ["$timeout", "$rootScope", function ( $timeout, $rootScope ) {
        	return {
                restrict: 'A',
                link: function(scope, element, attrs) {
					$rootScope.$emit("event:loading", true);
                	element.bind('load', function() {
                		$rootScope.$emit("event:loading", false);
                	});
                	element.bind('error', function() {
                		$rootScope.$emit("event:loading", false);
                	});
                }
        	};
        }]);
}());
