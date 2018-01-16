(function () {
    "use strict";

    angular.module("edtApp.common.directive")
	    .directive("menualShwWrn", [
	      function () {
	          return {
	              restrict: "A",
	              scope: {
	            	  menualShwWrn : '='
	              },
	              link: function (scope, element, attrs) {
	            	  var commonFnc = function(){
                		  var msg = scope.menualShwWrn;
	                	  if(msg){
	                		  angular.forEach(msg, function(item, index){
	                			  var index = msg.indexOf(item);
	                			  
	                			  msg.splice(index,1);
		                	  });
	                		  element.find("div.k-invalid-msg").css("display","none");
	                   	  }
            	  		};
            	  		   
	                  scope.$watch("menualShwWrn", function (newValue, oldValue) {
	                	  var msg = newValue;
	                	  	              	  
	                	  angular.forEach(msg, function(item, index){
	                		  //복수건
	                		  var trNoOrd = element.parent().find("td:eq(2)").text();
	                		  
	                		  if(trNoOrd === item){		                		
	                			  element.text("운송장이 등록되지 않았거나 업체에서 상품 준비중입니다.");		                		
	                		  }
	                		  //단일건
	                		  if(item && !trNoOrd){	                	
		                		  var html = "<div class='k-widget k-tooltip k-tooltip-validation k-invalid-msg' " +
		                		  		"style='margin: 0.5em; display: block;' data-for='NO_INVO' role='alert'><span class='k-icon k-i-warning'> " +
		                		  				"</span>운송장이 등록되지 않았거나 업체에서 상품 준비중입니다.<div class='k-callout k-callout-n'></div></div>";
		                		  element.append(html);
		                	  }	                		  
	                	  });
	                  });
	                  
	                  scope.$watch(function(){ return element.parents().find("table.signal").length; }, function (newValue) {
	                	  if(newValue !== 0){
		                	  commonFnc();	                		  
	                	  }
	                  });
	                  
	                  element.bind('click', function () {
	                	  commonFnc();
	                  });
	              }
	          };
	      }
	    ]);
}());
