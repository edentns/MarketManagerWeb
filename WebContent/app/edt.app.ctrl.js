(function () {

'use strict';

angular.module('edtApp')
	.controller('AppCtrl', ['MenuSvc', 'APP_AUTH', '$rootScope', '$scope', '$state', "UtilSvc", function (MenuSvc, APP_AUTH, $rootScope, $scope, $state, UtilSvc) {
		MenuSvc.activeMenu($state.current.name);
		$scope.menu = {
			data: MenuSvc.getNavigation()
		};
		
		$scope.menuHeight = $(window).height() - 91;
		$scope.menuConHeight = $(window).height() - 56;
		
		var editor = $("#helpEditor");
		editor.kendoEditor({tools:[], value:""});
		
		// make readonly
		$(editor.data("kendoEditor").body).removeAttr("contenteditable").find("a").on("click.readonly", false);
		$("textarea.small-editor").closest("table.k-editor").addClass("small-editor");

		var splitterElement = $("#contentMain");
		var menuSplitterEle = $("#menuMain");
		
		UtilSvc.splitter = splitterElement.kendoSplitter({
            orientation: "horizontal",
            panes: [
                { collapsible: false },
                { collapsible: true, resizable: true, size: "20%" }
            ]
        }).data("kendoSplitter");

		UtilSvc.menuSplitter = menuSplitterEle.kendoSplitter({
            orientation: "vertical",
            panes: [
                { collapsible: false },
                { collapsible: true, resizable: true, size: "30%" }
            ]
        });
		
		UtilSvc.splitter.toggle(splitterElement.children(".k-pane")[1], false);
		//splitterElement.height($scope.menuConHeight);
		
		kendo.culture('ko-KR');
	}]);
}());