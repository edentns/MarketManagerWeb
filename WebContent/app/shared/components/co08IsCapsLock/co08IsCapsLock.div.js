(function () {
    "use strict";

    angular.module("edtApp.common.directive")
    	.directive("isCapsLock", [
             function () {
            	 return {
            		 restrict: 'A',
            		 link: function(scope, el, attrs) {			 
	            	  	 var hideOrShow = function(e) {
	            	  	     var isTrue = false;
	            	  		 var enAbleRegex = /[0-9a-zA-Z~!@#$%^&*()_+|<>?:{}]/g;	            	  		 	 
	            	  		 var disAbleRegex = /[ㄱ-ㅎ가-힣]/g;    	 
	            	  		 var cpslockMsg = "Caps Lock 버튼이 활성화 되어 있습니다.";
	            	  		 var hgMsg = "한글로 입력되어 있습니다.";     
	            	  		 var s = String.fromCharCode(e.keyCode);
	            	  	    
		            	  	 if (s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey) {
		            	  	 	isTrue =  true;
		            	  	 }
    	                	
    	                	 if(isTrue){
    	                		 if(el.siblings(".cssCpLck").length){
    	                			 el.siblings(".cssCpLck").css("display","block");
    	                		 }else{
    	                			 var html = 
        	                			 "<div class='k-widget k-tooltip k-tooltip-validation k-invalid-msg cssCpLck' style='margin: 0.5em; display: block;' role='alert'>" +
    	             		  				"<span class='k-icon k-i-warning'>" +
    	             		  				"</span>Caps Lock 버튼이 활성화 되어 있습니다." +
    	             		  				"<div class='k-callout k-callout-n'>" +
    	             		  				"</div>" +
    	             		  			 "</div>";

        	                		 el.after(html);
    	                		 }		            	  		
    	                	 }else{
    	                		 el.siblings(".cssCpLck").css("display","none");
    	                	 }
	            	  	 }
	            	  	 
	            	  	/* el.keyup(function(e) {
	            	  	 	 //$log.log("Keyup");
	            	  		 hideOrShow(e);
	            	  	 });*/

	            	  	 el.keypress(function(e) {
	            	  	 	 //$log.log("Keyup");
	            	  		 hideOrShow(e);
	            	  	 });
	            	  	 
	            	  	/* el.keydown(function(e) {
	            	  	 	 //$log.log("Keyup");
	            	  		 hideOrShow(e);
	            	  	 });*/
	            	  	 
	            	/*  	 el.on("focus", function(e) {
	            	  		 //$log.log("Focus");
	            	  		 hideOrShow(e);
	            	  	 });

	            	  	 el.on("blur", function(e) {
	            	  		 //$log.log("Blur");
	            	  		 hideOrShow(e);
	            	  	 });*/
            		 }
	          };
	      }
	    ]);
}());
