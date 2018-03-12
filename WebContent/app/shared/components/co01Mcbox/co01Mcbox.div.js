(function () {
    "use strict";

    angular.module("edtApp.common.directive")
        .directive("co01Mcbox", ["$timeout", '$document', "$log", function ( $timeout, $document, $log) {
        	return {
                restrict: 'E',
                scope: {
                    model: '=',
                    options: '=',
                    setting: '='
                },
                template:
                		"<div class='btn-group' data-ng-class='{open: open}' style='width:100%;'>" +
                            "<button class='btn btn-small dropdown-toggle' style='overflow:hidden; text-overflow:ellipsis; width:calc(100% - 30px); text-align:left; font-size: 11px; background: #ffffff;border-color: #e5e6e7;' " +
                		    "data-ng-click='openDropdown()'> {{co01McboxVO.selectNames}}</button>" +
                            "<button class='btn btn-small dropdown-toggle' style='width:30px; text-align:center; font-size: 11px; background: #ffffff;border-color: #e5e6e7;' " +
                            "data-ng-click='openDropdown()'>"+
                            	"<span class='caret'></span>" +
                            "</button>" +
                            "<ul class='dropdown-menu' aria-labelledby='dropdownMenu' style='margin-top: 0px; padding: 0px' tabindex='0' data-ng-blur='onBlur()' data-ng-focus='onFocus()'>" +
                                "<li><a data-ng-click='selectAll();'><span class='glyphicon glyphicon-ok green' aria-hidden='true'></span><font style='text-align:left; font-size: 11px; color:#606060'> 전체선택</font></a></li>" +
                                "<li><a data-ng-click='deselectAll();'><span class='glyphicon glyphicon-remove red' aria-hidden='true'></span><font style='text-align:left; font-size: 11px; color:#606060'> 전체해제</font></a></li>" +
                                "<li class='divider' style='margin:3px 0;'></li>" +
                                "<li data-ng-repeat='option in options' class='nm-list'>"+
                                	"<a data-ng-click='toggleSelectItem(option, $event)'>"+
                                		"<span data-ng-class='getClassName(option)' aria-hidden='true'></span><font style='text-align:left; font-size: 11px; color:#606060'> {{option[co01McboxVO.name]}}</font>" +
                                	"</a>" +
                                "</li>" +
                            "</ul>" +
                        "</div>",

                controller:['$scope', '$element' , function ($scope, $ele) {
                	var co01McboxVO = $scope.co01McboxVO = {
    	        		selectNames:"전체",
    	        		maxNames: 3,
    	        		id: 'id',
    	    	        name: 'name',
    	    	        allCheckYn: "y",
    	    	        arrayModel: []
    	        	};
                	
                	$scope.initLoad = function () {  
                		var self = this;

                		if($scope.options.setSelectNames){
                			$scope.options.allSelectNames = $scope.options.setSelectNames;
                		}
                		
                		if($scope.setting) {
                    		if($scope.setting.maxNames) co01McboxVO.maxNames = $scope.setting.maxNames;                    			
                    		if($scope.setting.id      ) co01McboxVO.id       = $scope.setting.id;
                    		if($scope.setting.name    ) co01McboxVO.name     = $scope.setting.name;
                    	}      
                	};
                	
                	$scope.$watch('options.setSelectNames', function (newValue) {
            			if(newValue) {
            				var	tmpModel = newValue,
            					id = $scope.co01McboxVO.id,
            					name = $scope.co01McboxVO.name,
            				 	opLg = $scope.options.length,
            				 	opMo = angular.copy($scope.options),
            				 	rtnTemp = [];     
            				
            				$scope.co01McboxVO.selectNames = "";    	                        
                        	$scope.model = "";
                        	
                        	if(tmpModel[0] === '*'){
                        		$scope.co01McboxVO.arrayModel = angular.copy(opMo);
                        		$scope.co01McboxVO.selectNames = "전체";    	                        
                            	$scope.model = "*";
                        		return true;
                        	}
                        	
                        	for(var i=0; i<opLg; i++){
                        		for(var j=0; j<tmpModel.length; j++){
                        			if(opMo[i][name] === tmpModel[j][name]){
                        				if(rtnTemp.length === 0) {
        	                        		$scope.co01McboxVO.selectNames = opMo[i][name];
        	                        		$scope.model = opMo[i][id];
        	                        	}else if(rtnTemp.length >= $scope.co01McboxVO.maxNames) {
        	                        		if(rtnTemp.length === $scope.co01McboxVO.maxNames) {
        	                        			$scope.co01McboxVO.selectNames += "...";
        	                        		}
        	                        		$scope.model += "^" + opMo[i][id];
        		                        }else{
        		                        	$scope.co01McboxVO.selectNames += ", " +  opMo[i][name];
        	                        		$scope.model += "^" +  opMo[i][id];
        	                        	};    	                        
        	                        	rtnTemp.push(angular.copy(opMo[i]));
                        			}
                        		}
                        	}
                        	
                        	if(rtnTemp.length === opLg){
                        		$scope.co01McboxVO.selectNames = "전체";    	                        
                            	$scope.model = "*";
                        	}
                        	if(rtnTemp.length === 0 && opLg > 0){
                              	$scope.selectAll();
                              	return true;
                          	}
                        	
                        	$scope.co01McboxVO.arrayModel = angular.copy(rtnTemp);
                            $scope.options.allSelectNames = angular.copy(rtnTemp);                          
                		}
				    });
                	
                	$scope.$watch('options.bReset', function (newValue, oldValue) {
                		if(newValue) {
	                		$scope.selectAll();
	                		
	                		if($scope.setting.allCheckYn) {
	                			if($scope.setting.allCheckYn == "n" || $scope.setting.allCheckYn == "N") {
	                				$scope.deselectAll();
	                			}
	                		}
	                		$scope.options.bReset = false;
                		}
				    });
                	
                	$scope.$watch('options', function (newValue, oldValue) {
                		if($scope.options.setSelectNames) return;
                		
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

                    $scope.onFocus = function () {
                    	//alert("focus !!!!");
                    };
                    
                    $scope.selectAll = function () {
                    	var self = this;
                    	    
                        $scope.model = "";
                        self.co01McboxVO.arrayModel = [];
                    	$scope.options.allSelectNames = [];
                        
                        angular.forEach($scope.options, function (item, index) {
                        	var loItem = {};
                        	loItem[self.co01McboxVO.id]   = item[self.co01McboxVO.id];
                        	loItem[self.co01McboxVO.name] = item[self.co01McboxVO.name];
                        	
                        	self.co01McboxVO.arrayModel.push(loItem);                        	
                        });
                        
                        $scope.options.allSelectNames = ["*"];
                        $scope.model                 = "*";
                        self.co01McboxVO.selectNames = "전체";
                        //$scope.options.allSelectNames.unshift({ maxLength : $scope.options.length });
                    };

                    $scope.deselectAll = function () {
                    	var self = this;
                    	
                    	self.co01McboxVO.arrayModel = [];                        
                        self.co01McboxVO.selectNames = "";
                        $scope.model = "";
                    	$scope.options.allSelectNames = [];
                    };

                    $scope.toggleSelectItem = function (option, e) {
                    	var self = this,
                    		id = self.co01McboxVO.id,
                    		name = self.co01McboxVO.name,
                    		loItem = {},
                        	intIndex = -1,
                        	liIndex = -1;  //선택된 항목의 index
                    	
                        angular.forEach(self.co01McboxVO.arrayModel, function (item, index) {
                            if (item[id] == option[id]) {
                                intIndex = index;
                            }
                        });
                        if($scope.options.allSelectNames[0] === "*"){
                        	$scope.options.allSelectNames = angular.copy(self.co01McboxVO.arrayModel);
                        }
                        
                        if(intIndex >= 0){
                        	self.co01McboxVO.arrayModel.splice(intIndex, 1);
                        	$scope.options.allSelectNames.splice(intIndex, 1);                        	
                        }else{
                        	loItem[id]   = option[id];
                        	loItem[name] = option[name];
                        	self.co01McboxVO.arrayModel.push(loItem);
                        	$scope.options.allSelectNames.push(loItem);
                        };

                        if(self.options.length === self.co01McboxVO.arrayModel.length) {
                            self.co01McboxVO.selectNames = "전체";
	                        $scope.model                 = "*";
	                        $scope.options.allSelectNames = ["*"];
                        }else {
	                        self.co01McboxVO.selectNames = "";
	                        $scope.model       = "";
	                        
	                        angular.forEach(self.co01McboxVO.arrayModel, function (item, index) {
	                        	if(index === 0) {
	                        		$scope.model                 = item[id];
	                        		self.co01McboxVO.selectNames = item[name];
	                        	}else if(index >= self.co01McboxVO.maxNames) {
	                        		if(index == self.co01McboxVO.maxNames) {
	                        			self.co01McboxVO.selectNames += "...";
	                        		}
	                        		$scope.model += "^" +  item[id];
		                        }else {
	                        		self.co01McboxVO.selectNames += ", " +  item[name];
	                        		$scope.model += "^" +  item[id];
	                        	}
	                        });
                        }    
                    };

                    $scope.getClassName = function (option) {
                    	var self = this,
                        	varClassName = 'glyphicon glyphicon-remove red';
                    	
                        angular.forEach(self.co01McboxVO.arrayModel, function (item, index) {
                            if (item[self.co01McboxVO.id] == option[self.co01McboxVO.id]) {
                                varClassName = 'glyphicon glyphicon-ok green';
                            }
                        });
                        return (varClassName);
                    };
                    
                    $scope.initLoad();
                }]
            };
        }]);
}());
