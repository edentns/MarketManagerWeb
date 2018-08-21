(function () {

'use strict';

angular.module('edtApp')
	.controller('AppCtrl', ['MenuSvc', 'APP_AUTH', '$rootScope', '$scope', '$state', "UtilSvc", function (MenuSvc, APP_AUTH, $rootScope, $scope, $state, UtilSvc) {
		MenuSvc.activeMenu($state.current.name);
		$scope.menu = {
			data: MenuSvc.getNavigation(),
			isCollapse : false,
			isLoadHelpSplitter : false
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
		var getHelpParam = "_help";
		
		//헬프창 설정된값이 저장되어 있는지 DB에서 불러옴;
		UtilSvc.grid.getInquiryParam(getHelpParam).then(function (res) {
			var history = res.data;
			var widx = "470px";
			
			//저장된 설정값이 있으면 앞으로 로딩될 헬프창 설정값에 넣어줌
			if(history){
				$scope.menu.isCollapse = history.COLLAPSE;
				widx = history.HELP_WIDTH;
        	}
			
			//확장 및 축소가 먼저 실행되고 리사이즈가 트리거 된다.
			//헬프창 셋팅함 collapsed = true일때 로딩시 헬프창을 닫고 로딩된다. 
			//UtilSvc.splitter = splitterElement.kendoSplitter({
			splitterElement.kendoSplitter({
	            orientation: "horizontal",
	            panes: [{collapsible: false},{collapsed: $scope.menu.isCollapse, collapsible: true, resizable: true, size: widx}],
	            resize: function(e) {
	            	//처음 로딩될때부터 라사이즈 펑션을 타기 때문에 정말 사이즈를 변경했을때만 해당 펑션이 탈수 있게 함.
	            	if($scope.menu.isLoadHelpSplitter){
		            	var gettingWidx = $("#helpView").css("width"),
		            		fixedWidth = {
			            		HELP_WIDTH : gettingWidx === "0px" ? "470px" : gettingWidx,
			            		COLLAPSE : gettingWidx === "0px" ? true : false
		            		};
		            	//리사이징 될때마다 겂을 DB에 저장
		            	UtilSvc.grid.setInquiryParam(fixedWidth, getHelpParam);
	            	}
	            	$scope.menu.isLoadHelpSplitter = true; 
	            },
	            expand: function(e) {
	            	//확장 시킬때 로딩값이 축소 였다면 다시 확장할때 WIDTH 값을 확장될수 있는 값으로 설정함. 
	            	if($scope.menu.isCollapse){
	            		var setSplitter = splitterElement.data("kendoSplitter");
	            		setSplitter.options.panes[1].size = "470px";
	            	}
	            }
	        });
		})
		
		UtilSvc.menuSplitter = menuSplitterEle.kendoSplitter({
            orientation: "vertical",
            panes: [
                { collapsible: false },
                { collapsible: true, resizable: true, size: "0%" }
            ]
        });
		
		//UtilSvc.splitter.toggle(splitterElement.children(".k-pane")[1], false);
		//UtilSvc.menuSplitter.toggle(menuSplitterEle.children(".k-pane")[1], false);
		//splitterElement.height($scope.menuConHeight);
		
		kendo.culture('ko-KR');
	}]);
}());