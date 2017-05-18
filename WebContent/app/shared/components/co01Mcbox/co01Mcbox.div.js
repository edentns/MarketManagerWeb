(function () {
    "use strict";

    angular.module("edtApp.common.directive")
        .directive("co01Mcbox", ["$timeout", function ( $timeout ) {
        	return {
                restrict: 'E',
                scope: {
                    model: '=',
                    options: '=',
                    setting: '='
                },
                template:
                		"<div class='btn-group' data-ng-class='{open: open}' style='width:100%;'>" +
                            "<button class='btn btn-small dropdown-toggle' style='overflow:hidden; text-overflow:ellipsis; width:90%; text-align:left; font-family: initial; font-size: 11px; background: #ffffff;border-color: #e5e6e7;' " +
                		    "data-ng-click='openDropdown()'> {{co01McboxVO.selectNames}}</button>" +
                            "<button class='btn btn-small dropdown-toggle' style='width:10%; text-align:left; font-family: initial; font-size: 11px; background: #ffffff;border-color: #e5e6e7;' " +
                            "data-ng-click='openDropdown()'>"+
                            	"<span class='caret'></span>" +
                            "</button>" +
                            "<ul class='dropdown-menu' aria-labelledby='dropdownMenu' style='margin-top: 0px; padding: 0px'>" +
                                "<li><a data-ng-click='selectAll();'><span class='glyphicon glyphicon-ok green' aria-hidden='true'></span><font style='text-align:left; font-family: initial; font-size: 11px; color:#606060'> 전체선택</font></a></li>" +
                                "<li><a data-ng-click='deselectAll();'><span class='glyphicon glyphicon-remove red' aria-hidden='true'></span><font style='text-align:left; font-family: initial; font-size: 11px; color:#606060'> 전체해제</font></a></li>" +
                                "<li class='divider' style='margin:3px 0;'></li>" +
                                "<li data-ng-repeat='option in options'>"+
                                	"<a data-ng-click='toggleSelectItem(option)'>"+
                                		"<span data-ng-class='getClassName(option)' aria-hidden='true'></span><font style='text-align:left; font-family: initial; font-size: 11px; color:#606060'> {{option[co01McboxVO.name]}}</font>" +
                                	"</a>" +
                                "</li>" +
                            "</ul>" +
                        "</div>",

                controller:['$scope', function ($scope) {
                	var co01McboxVO = $scope.co01McboxVO = {
    	        		selectNames:"전체",
    	        		maxNames: 3,
    	        		id: 'id',
    	    	        name: 'name',
    	    	        allCheckYn: "y"
    	        	};
                	$scope.initLoad = function () {
                		var self = this;
                		
                		if($scope.setting) {
                    		if($scope.setting.maxNames) co01McboxVO.maxNames = $scope.setting.maxNames;
                    		if($scope.setting.id      ) co01McboxVO.id       = $scope.setting.id;
                    		if($scope.setting.name    ) co01McboxVO.name     = $scope.setting.name;
                    	}
                	};
                	
                	$scope.$watch('options', function (newValue, oldValue) {
                		$scope.selectAll();
                		if($scope.setting.allCheckYn) {
                			if($scope.setting.allCheckYn == "n" || $scope.setting.allCheckYn == "N") {
                				$scope.deselectAll();
                			}
                		}
				    });
                	
                    $scope.openDropdown = function () {
                        $scope.open = !$scope.open;
                    };
                    
                    $scope.onBlur = function () {
                    	if($scope.open)	$scope.open = false;
                    };

                    $scope.selectAll = function () {
                    	var self = this;
                    	    
                        $scope.model = [];
                        angular.forEach($scope.options, function (item, index) {
                        	var loItem = {};
                        	loItem[self.co01McboxVO.id]   = item[self.co01McboxVO.id];
                        	loItem[self.co01McboxVO.name] = item[self.co01McboxVO.name];
                        	
                            $scope.model.push(loItem);
                        });
                        
                        self.co01McboxVO.selectNames = "전체";
                    };

                    $scope.deselectAll = function () {
                    	var self = this;
                        $scope.model = [];

                        self.co01McboxVO.selectNames = "";
                    };

                    $scope.toggleSelectItem = function (option) {
                    	var self = this,
                    		loItem = {},
                        	intIndex = -1;
                    	
                        angular.forEach($scope.model, function (item, index) {
                            if (item[self.co01McboxVO.id] == option[self.co01McboxVO.id]) {
                                intIndex = index;
                            }
                        });

                        if (intIndex >= 0) {
                            $scope.model.splice(intIndex, 1);
                        }
                        else {
                        	loItem[self.co01McboxVO.id]   = option[self.co01McboxVO.id];
                        	loItem[self.co01McboxVO.name] = option[self.co01McboxVO.name];
                            $scope.model.push(loItem);
                        }
                        
                        if(self.options.length === self.model.length) {
                            self.co01McboxVO.selectNames = "전체";
                        }
                        else {
	                        self.co01McboxVO.selectNames = "";
	                        angular.forEach($scope.model, function (item, index) {
	                        	if(index >= self.co01McboxVO.maxNames) {
	                        		self.co01McboxVO.selectNames = self.co01McboxVO.selectNames + "...";
	                        		return;
	                        	}
	                        	
	                        	if(index === 0) self.co01McboxVO.selectNames = item[self.co01McboxVO.name];
	                        	else            self.co01McboxVO.selectNames = self.co01McboxVO.selectNames + ", " +  item[self.co01McboxVO.name];
	                        });
                        }
                    };

                    $scope.getClassName = function (option) {
                    	var self = this,
                        	varClassName = 'glyphicon glyphicon-remove red';
                    	
                        angular.forEach($scope.model, function (item, index) {
                            if (item[self.co01McboxVO.id] == option[self.co01McboxVO.id]) {
                                varClassName = 'glyphicon glyphicon-ok green';
                            }
                        });
                        return (varClassName);
                    };
                    
                    $scope.initLoad();
                }]
            }
        }]);
}());
