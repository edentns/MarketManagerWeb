(function () {
    "use strict";

    angular.module("edtApp.common.directive")
        .directive("co01Mcbox", ["$timeout", '$document', function ( $timeout, $document ) {
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
                		//try{
                			if(newValue) {
                    			/*angular.forEach(newValue, function (item, index) { 
                    				$timeout(function(){
                    					$ele.find(".dropdown-menu > .nm-list:eq("+item+") > a").triggerHandler("click");
                    				},0); 
                                });*/                				
                				var loItem = {}, id = $scope.co01McboxVO.id, name = $scope.co01McboxVO.name;
                				var opLg = $scope.options.length,
                					tmpModel = [];
                				                				
                				angular.forEach(newValue, function (item, index) {
	                				loItem[id]   = $scope.options[item][id];
	                            	loItem[name] = $scope.options[item][name];
	                            	tmpModel.push( angular.copy(loItem));         
                				});
                				                				                				
	                            if(opLg === tmpModel.length) {
	                            	$scope.co01McboxVO.selectNames = "전체";
	    	                        $scope.model                 = "*";
	                            }
	                            else {
	                            	$scope.co01McboxVO.selectNames = "";
	    	                        $scope.model       = "";
	    	                        angular.forEach(tmpModel, function (item, index) {
	    	                        	if(index === 0) {
	    	                        		$scope.model                 = item[id];
	    	                        		$scope.co01McboxVO.selectNames = item[name];

	    	                    			console.log("jhg 1 => ["+$scope.co01McboxVO.selectNames+"]");
	    	                        	}else if(index >= $scope.co01McboxVO.maxNames) {
	    	                        		if(index === $scope.co01McboxVO.maxNames) {
	    	                        			$scope.co01McboxVO.selectNames = $scope.co01McboxVO.selectNames + "...";
	    	                        			console.log("jhg 2 => ["+$scope.co01McboxVO.selectNames+"]");
	    	                        		}
	    	                    			
	    	                        		$scope.model += "^" +  item[id];
	    		                        }else {
	    		                        	$scope.co01McboxVO.selectNames = $scope.co01McboxVO.selectNames + ", " +  item[name];
    	                        			console.log("jhg 3 => ["+$scope.co01McboxVO.selectNames+"]");
	    	                        		$scope.model += "^" +  item[id];
	    	                        	}
	    	                        });
	                            }
	                            
	                            $scope.co01McboxVO.arrayModel = tmpModel;
	                			$scope.options.allSelectNames = $scope.options.setSelectNames;
	                            	                            
                    		}
                		/*}catch(e){
                			console.log(e);
                			return;
                		}  */              		
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
                        if($scope.open) {
                        	//$("#dropdownid")[0].tabIndex=0;
                        	//$("#dropdownid")[0].focus();
                        	//$document[0].getElementById('dropdownid').focus();
                        }
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
                        	$scope.options.allSelectNames.push(index);
                        });
                        
                        $scope.model                 = "*";
                        self.co01McboxVO.selectNames = "전체";

            			console.log("jhg 4 => ["+$scope.co01McboxVO.selectNames+"]");
                    };

                    $scope.deselectAll = function () {
                    	var self = this;
                    	
                    	self.co01McboxVO.arrayModel = [];
                        $scope.model = "";
                        self.co01McboxVO.selectNames = "";

            			console.log("jhg 5 => ["+$scope.co01McboxVO.selectNames+"]");
                    	$scope.options.allSelectNames = [];
                    };

                    $scope.toggleSelectItem = function (option, e) {
                    	var self = this,
                    		loItem = {},
                        	intIndex = -1,
                        	liIndex = -1;  //선택된 항목의 index
                    	
                        angular.forEach(self.co01McboxVO.arrayModel, function (item, index) {
                            if (item[self.co01McboxVO.id] == option[self.co01McboxVO.id]) {
                                intIndex = index;
                            }
                        });

                        if (intIndex >= 0) {
                        	self.co01McboxVO.arrayModel.splice(intIndex, 1);
                        }
                        else {
                        	loItem[self.co01McboxVO.id]   = option[self.co01McboxVO.id];
                        	loItem[self.co01McboxVO.name] = option[self.co01McboxVO.name];
                        	self.co01McboxVO.arrayModel.push(loItem);
                        }
                        
                        if(self.options.length === self.co01McboxVO.arrayModel.length) {
                            self.co01McboxVO.selectNames = "전체";

                			console.log("jhg 6 => ["+$scope.co01McboxVO.selectNames+"]");
	                        $scope.model                 = "*";
                        }
                        else {
	                        self.co01McboxVO.selectNames = "";

                			console.log("jhg 7 => ["+$scope.co01McboxVO.selectNames+"]");
	                        $scope.model       = "";
	                        angular.forEach(self.co01McboxVO.arrayModel, function (item, index) {
	                        	if(index === 0) {
	                        		$scope.model                 = item[self.co01McboxVO.id];
	                        		self.co01McboxVO.selectNames = item[self.co01McboxVO.name];

                        			console.log("jhg 8 => ["+$scope.co01McboxVO.selectNames+"]");
	                        	}else if(index >= self.co01McboxVO.maxNames) {
	                        		if(index == self.co01McboxVO.maxNames) {
	                        			self.co01McboxVO.selectNames = self.co01McboxVO.selectNames + "...";

	                        			console.log("jhg 9 => ["+$scope.co01McboxVO.selectNames+"]");
	                        		}
	                        		$scope.model = $scope.model + "^" +  item[self.co01McboxVO.id];
		                        }else {
	                        		self.co01McboxVO.selectNames = self.co01McboxVO.selectNames + ", " +  item[self.co01McboxVO.name];

                        			console.log("jhg 10 => ["+$scope.co01McboxVO.selectNames+"]");
	                        		$scope.model = $scope.model + "^" +  item[self.co01McboxVO.id];
	                        	}
	                        });
                        }
                        
                        angular.forEach($scope.options, function (item, index) {
                        	if(item[self.co01McboxVO.id] === option[self.co01McboxVO.id]) {
                        		liIndex = index;
                        	}
                        });
                        
                        if($scope.options.allSelectNames){
                            if (intIndex >= 0) {
                            	angular.forEach($scope.options.allSelectNames, function (item, index) {
                            		if(item == liIndex) {
                            			$scope.options.allSelectNames.splice(index, 1);
                            		}
                            	});
                            }	
                            else 
                            	$scope.options.allSelectNames.push(liIndex);
                        }else{
                        	$scope.options.allSelectNames = [];
                        	$scope.options.allSelectNames[0] = liIndex;
                        };
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
