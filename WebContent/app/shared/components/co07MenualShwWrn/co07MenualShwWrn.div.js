(function () {
    "use strict";

    angular.module("edtApp.common.directive")
	    .directive("menualShwWrn", [
	      function () {
	          return {
	              restrict: "A",
	              scope: {
	            	  menualShwWrn : '=',
	            	  menualShwWrnNoOrd : '@',
	            	  menualShwWrnListYn : '@'
	              },
	              link: function (scope, element, attrs) {
	            	  var deliMsg = "운송장이 등록되지 않았거나 업체에서 상품 준비중입니다.",
	            	  	  noOrd = attrs.menualShwWrnNoOrd,
	            	  	  lstYn = attrs.menualShwWrnListYn;
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
	                		  //var trNoOrd = element.parent().find("td:eq(2)").text();
	                		  var oldOrd = item.toString();
	                		  
	                		  if(noOrd === oldOrd && lstYn === 'Y'){		                		
	                			  element.text(deliMsg);	
	                		  }else if((!lstYn && oldOrd && !noOrd) || (!lstYn && oldOrd === noOrd)){                	
		                		  var html = "<div class='k-widget k-tooltip k-tooltip-validation k-invalid-msg' " +
		                		  		"style='margin: 0.5em; display: block;' data-for='NO_INVO' role='alert'><span class='k-icon k-i-warning'> " +
		                		  				"</span>"+deliMsg+"<div class='k-callout k-callout-n'></div></div>";
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
