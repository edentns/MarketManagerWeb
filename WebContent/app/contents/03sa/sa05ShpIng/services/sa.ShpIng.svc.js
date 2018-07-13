(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.ShpIng.service : sa.ShpIngSvc
     * 상품분류관리
     */
    angular.module("sa.ShpIng.service")
        .factory("sa.ShpIngSvc", ["APP_CONFIG", "$http", "APP_MSG", "UtilSvc", "Util03saSvc", "$timeout", "$log", "$state", "$q", "$resource",
           function (APP_CONFIG, $http, APP_MSG, UtilSvc, Util03saSvc, $timeout, $log, $state, $q, $resource) {
            return {
            	/**
				 * 주문 목록 
				 */
            	orderList : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/shipping/ordlist?"+ $.param(param),
					}).success(function (data, status, headers, config) {
						if(data !== ""){
							//
						}else{
							alert("주문목록을 불러오는데 실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},
				
				/*배송정보 수정*/
				edit : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/shipping/edit",
						data 	: param
					}).success(function (data, status, headers, config) {
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},
				
				/**
				 * 주문 목록 
				 */
            	delay : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/shipping/delay",
						data 	: param
					});
				},
				
				/**
				 * 판매자 반품 요청
				 */
				tkbkReqeust : function (param) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/shipping/tkbkreqeust",
						data 	: param
					});
				},
				
				//위젯 유효성 검사
		        widgetValidation : function(arg, grdItem){
		        	if(['004','005'].indexOf(grdItem.CD_ORDSTAT) < 0){
                		alert(APP_MSG.caseChkOrdAlert);
                		return false;
                	}
					if(grdItem.YN_CONFIRM === 'Y'){
                		alert(APP_MSG.caseYnConfirm);
                		return false;
                	}
					if(UtilSvc.diffDate(grdItem.DTS_ORD, new Date()) > 30){
            			//alert(APP_MSG.caseSevenDaysAlert);
						alert(APP_MSG.caseThirtyDaysAlert);								
            			return false;
        			};
        			return true;
		        },
				
				// 택배사 불러오기
		        shpList : function (throwData){
		        	throwData.shpList.$promise.then(function (data) {
		        		var txtFld = throwData.txtFld;
		        		var valFld = throwData.valFld;
		        		var shouldToSlctedVal = throwData.val;
		        		var emptyObj = {};
		        		var ds = [];
		        				      
		        		if(data.length < 1){
		        			emptyObj[txtFld] = "택배사 등록";
			        		emptyObj[valFld] = "";
			        		ds.push(emptyObj);
		        		}else{
		        			ds = data;
		        		}
		        				    			
		        		throwData.selector.find("select[name="+throwData.findEle+"]").kendoDropDownList({
		        			dataSource : ds,
		                	dataTextField : txtFld,
		                	dataValueField : valFld,
		                	optionLabel : throwData.label,
		                	select : function(e){
		                		var me = this;
		                		$timeout(function(){
		                			if(me.selectedIndex > 0){
			               				me.element.parents("table").find(".k-invalid-msg").hide();
			               			}
		                		},0);
		                	},
	                       change : function(e){
	                    	   if(this.text() === "택배사 등록" && this.selectedIndex === 1){
	                    		   $state.go("app.syPars", { mrk: throwData.mrks, menu: true, ids: null });
	                    		   throwData.kg.cancelRow();
	                    	   }
	                       }
		            	});		        		
		    				
		    			if(shouldToSlctedVal){
		    				var ddl = throwData.selector.find("select[name="+throwData.findEle+"]").data("kendoDropDownList");
		    	    		ddl.value(shouldToSlctedVal);
		    	    		ddl.trigger("change");
		    			}  
	    			},function(){
						$log.info("택배사 조회 실패!");
						alert("택배사 조회 실패! 관리자에게 문의하세요!");
					});		        	
		       },
		       //체크박스 전체 선택 없음 전용 
		       grdChkBoxClk : function (e, kg){
		           var i = 0,
		               element = $(e.currentTarget),
		               checked = element.is(':checked'),
		               row = element.closest("tr"),
		               dataItem = kg.dataItem(row);
	             	                
		           dataItem.ROW_CHK = checked;
		           dataItem.dirty = checked;
		                	            
		           checked ? row.addClass("k-state-selected") : row.removeClass("k-state-selected");    	        
	           },
	           //반품사유 바인딩
	           tkbkhrnkrsnBind : function(vo){
	        	   var ds = vo.tkbkhrnkrsnDs;
	        	   
           		   vo.tkbkhrnkrsnDsGau = ds.filter(function(ele){
	        		   return (ele.YN_USE === 'Y' && ele.YN_DEL === 'N' && ele.DC_RMK1 === 'SYMM170101_00001') ;
			 	   });	
	           
	        	   vo.tkbkhrnkrsnDsStr = ds.filter(function(ele){
	        		   return (ele.YN_USE === 'Y' && ele.YN_DEL === 'N' && ele.DC_RMK1 === 'SYMM170101_00002') ;
			 	   });	  
	           
	           	   vo.tkbkhrnkrsnDsCouSub = ds.filter(function(ele){
	           		   return (ele.YN_USE === 'Y' && ele.YN_DEL === 'N' && ele.DC_RMK1 === 'SYMM170901_00001') ;
	           	   });	
	           	   
	           	   vo.tkbkhrnkrsnDsCou = ds.filter(function(ele){
	           		   return (ele.YN_USE === 'Y' && ele.YN_DEL === 'N' && ele.DC_RMK1 === 'SYMM170901_00001' && !ele.DC_RMK2 && !ele.DC_RMK3) ;
	           	   });	  
	           	
	           	   vo.tkbkhrnkrsnDsEl = ds.filter(function(ele){
	        		   return (ele.YN_USE === 'Y' && ele.YN_DEL === 'N' && ele.DC_RMK1 === 'SYMM170101_00005') ;
			 	   });
	           },
	           
	           qtySelector : function(qty, ele, model){
	        	   var qtyList  = [],
	        	   	   qtyObj = {},
	        	   	   individual;
				
        		   for(var i=1; i<=qty; i++){
					   individual = i
					   qtyObj.CD_DEF = individual;
					   qtyObj.NM_DEF = individual;
				       qtyList.push(angular.copy(qtyObj));
				   }
	        		
				   ele.find("select[name='QT_TKBK']").kendoDropDownList({
					   dataSource : qtyList,
					   optionLabel : "수량을 선택해 주세요 ",	        
		        	   dataTextField : "NM_DEF",
		               dataValueField : "CD_DEF",
					   valuePrimitive : true,
					   select : function(e){
	                		var me = this;
	                		$timeout(function(){
	                			if(me.selectedIndex > 0){
		               				me.element.parents("table").find(".k-invalid-msg").hide();
		               			}
	                		},0);
					   },
					   change : function(e){
	                    	var leng = this.dataSource._data.length,
	                    		selected = this.selectedIndex; 
	                    	
	                    	if(selected > 0 || model.tkbk_responsibility === "구매자"){
	                    		//기타배송비 
		                    	if(leng === selected && model.SEQ_TKBK && model.DC_SHPCOSTSTAT === '선결제' && model.DC_SHPCOSTSTAT){
		                    		model.DC_SHPCOSTSTAT_TRANS_ETC = kendo.toString(model.AM_SHPCOST , 'C0', 'ko-KR');
		                    	};
		                    	
		                    	//반품배송비
		                    	if(leng === selected && model.DC_SHPCOSTSTAT === '착불'){
	         		        		model.DC_SHPCOSTSTAT_TRANS = kendo.toString(2500 , 'C0', 'ko-KR');			         		        	  
	         		        		model.AM_TKBKSHP = 2500;
		                    	}
		                    	else if(leng === selected && model.DC_SHPCOSTSTAT === '선결제' && model.DC_SHPCOSTSTAT && !model.SEQ_TKBK){
	         		        		model.DC_SHPCOSTSTAT_TRANS = kendo.toString(5000 , 'C0', 'ko-KR');			         		        	  
	         		        		model.AM_TKBKSHP = 5000;
		                    	}
		                    	else if(leng === selected && model.DC_SHPCOSTSTAT === '선결제' && model.DC_SHPCOSTSTAT && model.SEQ_TKBK){
	         		        		model.DC_SHPCOSTSTAT_TRANS = kendo.toString(2500 , 'C0', 'ko-KR');			         		        	  
	         		        		model.AM_TKBKSHP = 2500;
		                    	}
		                    	else if(leng > selected && ['착불','선결제'].indexOf(model.DC_SHPCOSTSTAT) > -1){
	         		        		model.DC_SHPCOSTSTAT_TRANS = kendo.toString(2500 , 'C0', 'ko-KR');			         		        	  
	         		        		model.AM_TKBKSHP = 2500;
		                    	}
		                    	else{
		                    		model.DC_SHPCOSTSTAT_TRANS_ETC = "";
		                    		model.DC_SHPCOSTSTAT_TRANS = "고객 협의"			         		        	  
	         		        		model.AM_TKBKSHP = 0;
		                    	};
	                    	}
	                    	else{
	                    		model.DC_SHPCOSTSTAT_TRANS_ETC = "";
	                    		model.DC_SHPCOSTSTAT_TRANS = "";
	                    		model.AM_TKBKSHP = 0;
	                    	}
	                    }
				   });				
	           },
	           
	           tkbkPayRtnMethodSelector : function(me){
	        	   $timeout(function(){
	        		   if(me.selectedIndex > 0){
               				me.element.parents("tr").find(".k-invalid-msg").hide();
	        		   }else{	                			
               				var alert = "반품배송비 결제 방법을 선택해 주세요.",
               			    	html = "<div class='k-widget k-tooltip k-tooltip-validation k-invalid-msg' " +
               			    	"style='margin: 0.5em; display: block;' data-for='transform_pay_reason' role='alert'><span class='k-icon k-i-warning'> " +
               		  				"</span>"+alert+"<div class='k-callout k-callout-n'></div></div>";

               				me.element.parents("td").append(html);
               	       }
           		   },0);
	           },
	           
	           grdEdit : function(model, vo, ele, kg){
	        	   var mrk = model.NO_MNGMRK,
	        	   	   noMrk = model.NO_MRK,
	        	   	   shippingList = {};

	           	   model.DC_SHPCOSTSTAT_TRANS_ETC = "";
	           	   model.DC_SHPCOSTSTAT_TRANS = "";
	           	   model.AM_TKBKSHP = 0;
	        	   	
	        	   switch(mrk){
	        	   		case 'SYMM170101_00001' :					// gmarket
						case 'SYMM170101_00003' : {					// auction
							//Util03saSvc.ddlSelectedIndex(ele, "CD_TKBKHRNKRSN");
							Util03saSvc.ddlSelectedIndex(ele, "CD_TKBKGOODSSTATUS");	

        					shippingList.shpList = Util03saSvc.shppingList().query({shippingType:"002", mrkType:model.NO_MRK});
        					shippingList.mrks = model.NO_MRK;
        					shippingList.selector = ele;
        					shippingList.kg = kg;
        					shippingList.label = "택배사를 선택해주세요.";
        					shippingList.txtFld = "NM_PARS_TEXT";
        					shippingList.valFld = "CD_PARS";
        					shippingList.findEle = "CD_PARS_GA";
        					
        					this.shpList(shippingList);
							break;                    				
						}
						case 'SYMM170101_00002' : {//s
							//Util03saSvc.ddlSelectedIndex(ele, "CD_TKBKHRNKRSN");
							
							shippingList.shpList = Util03saSvc.shppingList().query({shippingType:"002", mrkType:model.NO_MRK});
        					shippingList.mrks = model.NO_MRK;
        					shippingList.selector = ele;
        					shippingList.kg = kg;
        					shippingList.label = "택배사를 선택해주세요.";
        					shippingList.txtFld = "NM_PARS_TEXT";
        					shippingList.valFld = "CD_PARS";
        					shippingList.findEle = "CD_PARS_STORE";
        					
        					this.shpList(shippingList);
							break;
						}
						case 'SYMM170901_00001' : {//c
							var qtyMrk = (model.QT_ORD - model.QT_TKBK_OUT),
								lowDdl = '';
														
							shippingList.shpList = Util03saSvc.shppingList().query({shippingType:"002", mrkType:model.NO_MRK});
        					shippingList.mrks = model.NO_MRK;
        					shippingList.selector = ele;
        					shippingList.kg = kg;
        					shippingList.label = "택배사를 선택해주세요.";
        					shippingList.txtFld = "NM_PARS_TEXT";
        					shippingList.valFld = "CD_PARS";
        					shippingList.findEle = "CD_PARS_COU";

        					this.shpList(shippingList);
							this.qtySelector(qtyMrk, ele, model);
							
							ele.find("select[name='CD_TKBKLRKRSN']").kendoDropDownList({
                				dataSource : [],
    		        			dataTextField : "NM_DEF",
    		                    dataValueField : "CD_DEF",
    		                	optionLabel : "하위 반품사유코드를 선택해 주세요 "	    
    	            		});
                			
							lowDdl = ele.find("select[name='CD_TKBKLRKRSN']").data("kendoDropDownList");
							
							ele.find("select[name='CD_TKBKHRNKRSN']").kendoDropDownList({
	            				dataSource :  vo.tkbkhrnkrsnDsCou,
			        			dataTextField : "NM_DEF",
			                    dataValueField : "CD_DEF",
		                		optionLabel : "상위 반품사유코드를 선택해 주세요 ",	                    
			                    //valuePrimitive : true,
			                    change : function(e){
			                    	var cdDef = this.dataItem().CD_DEF,
			                    		nmDef = this.dataItem().NM_DEF,
			                    		dcRmk1 = this.dataItem().DC_RMK1;
			                    	
			                    	if(lowDdl){
			                    		lowDdl.dataSource.data(vo.tkbkhrnkrsnDsCouSub.filter(function(ele){
			                    			return (ele.DC_RMK3 === cdDef) && (ele.DC_RMK1 === dcRmk1) && (ele.DC_RMK2 === nmDef);
			                    		}));			                    		
			                    		$timeout(function(){
					                    	Util03saSvc.ddlSelectedIndex(ele, "CD_TKBKLRKRSN");
				                    	});
			                    	}
			                    }
		            		}); 
							
							//Util03saSvc.ddlSelectedIndex(ele, "CD_TKBKHRNKRSN");							
							break;
						}
						case 'SYMM170101_00005' : {//e
							var qtyMrk = (model.QT_ORD - model.QT_TKBK_OUT),
								me = this;
							
							me.qtySelector(qtyMrk, ele, model);
							
							ele.find("select[name='CD_TKBKHRNKRSN']").kendoDropDownList({
								dataSource : vo.tkbkhrnkrsnDsEl,	
			        			dataTextField : "NM_DEF",
			                    dataValueField : "CD_DEF",  
		                		optionLabel : "반품사유코드를 선택해 주세요 ",	   
			                    change : function(e){
			                    	var cdDef = this.dataItem().CD_DEF,
			                    		nmDef = this.dataItem().NM_DEF,
			                    		dcRmk1 = this.dataItem().DC_RMK1,
			                    		reasonList = "구매하고 싶지 않거나 색상/사이즈 잘못 선택)";
			                    		
			                    	if(nmDef === reasonList){
			                    		var qtyDdl = ele.find("select[name='QT_TKBK']").data("kendoDropDownList");
			                    		qtyDdl.trigger("change");
					    	    		
			                    		model.tkbk_responsibility = "구매자";
			                    	}
			                    	else if(nmDef && (nmDef !== reasonList)){
			                    		model.tkbk_responsibility = "판매자"; 
			         	        		model.DC_SHPCOSTSTAT_TRANS = "";
			         	        		model.DC_SHPCOSTSTAT_TRANS_ETC = "";
			         	        		model.AM_TKBKSHP = 0;
			                    	}
			                    	else{
			                    		model.tkbk_responsibility = "";
			         	        		model.DC_SHPCOSTSTAT_TRANS = "";
			         	        		model.DC_SHPCOSTSTAT_TRANS_ETC = "";
			         	        		model.AM_TKBKSHP = 0;
			                    	}
			                    }
		            		});
														
							//Util03saSvc.ddlSelectedIndex(ele, "CD_TKBKHRNKRSN");
							
							shippingList.shpList = Util03saSvc.shppingList().query({shippingType:"002", mrkType:model.NO_MRK});
        					shippingList.mrks = model.NO_MRK;
        					shippingList.selector = ele;
        					shippingList.kg = kg;
        					shippingList.label = "택배사를 선택해주세요.";
        					shippingList.txtFld = "NM_PARS_TEXT";
        					shippingList.valFld = "CD_PARS";
        					shippingList.findEle = "CD_PARS_E";
        					
        					this.shpList(shippingList);							
							break;
						}
						default : {
							alert('error!');
							break;
						}        						
	        	   }
	         },
	         
	         grdUpdate : function(models){
				var rtnMsg = {
							msg : "",
							val : ""
						};

	        	 switch(models[0].Type){
	        	 	// 배송정보 수정
	        	 	case '001' : {
	        	 		var defer = $q.defer();	
	        	 		if(confirm("배송정보를 수정 하시겠습니까?")){
	     					var param = models.filter(function(ele){
	     						return (ele.ROW_CHK === true && (["004","005"].indexOf(ele.CD_ORDSTAT) > -1) && ele.YN_CONFIRM !== 'Y');
	     					}); 
	     					
	     					if(param.length !== 1){
	     						rtnMsg.msg = "배송정보를 수정할 수 있는 주문상태가 아닙니다.";
     							defer.reject(rtnMsg);
	     					}
	     					else{
	         					alert(APP_MSG.invcChkMsg);
	         					
	         					this.edit(param[0]).then(function (res) {
	         						var rtnV = res.data,
	         							allV = rtnV.allNoOrd,
	     							    trueV = rtnV.trueNoOrd,					    
	     							    falseV = rtnV.falseNoOrd;
	         						
	         						if(!rtnV){
	         							rtnMsg.msg = "배송정보를 수정하는데 실패 하였습니다.";
	         							defer.reject(rtnMsg);
	         						}
	         						else if(trueV.length > 0){
	     	            				rtnMsg.msg = "배송정보를 수정하였습니다.";
	     	            				defer.resolve(rtnMsg);
	     	            			}
	         						else if(falseV.length > 0){ 
	     	            				rtnMsg.msg = "not equal";   		
	     	            				defer.reject(rtnMsg);
	     	            			}
	         						else if(allV.length < 1){ 
	     	            				rtnMsg.msg = "fail edit";   
	     	            				defer.reject(rtnMsg);
	     	            			};		        	            			
	         					}, function(err){
	         						rtnMsg.msg = err.data;
	         						defer.reject(rtnMsg);
	         					}); 
	     					}; 
	 	            	}
	     				else{
	     					defer.reject("cancel row");
	 	            	}
	        	 		return defer.promise;	
	        	 	}
		        	//판매자 직접반품 신청
	        	 	case '002' : {
	        	 		var defer = $q.defer();	
	        	 		if(confirm("판매자 직접 반품을 신청 하시겠습니까?")){
	     					var param = models.filter(function(ele){
	     						return (ele.ROW_CHK === true && (["004","005"].indexOf(ele.CD_ORDSTAT)> -1) && ele.YN_CONFIRM !== 'Y');
	     					});
	     					
	     					if(param.length !== 1){
     							rtnMsg.msg = "판매자 직접 반품을 신청 할수 있는 주문상태가 아닙니다.";
     							defer.reject(rtnMsg);
	     					}
	     					else{
	         					alert(APP_MSG.invcChkMsg);	         					
	         					
	         					this.tkbkReqeust(param[0]).then(function (res) {
	         						var rtnV = res.data,
	         							allV = rtnV.allNoOrd,
	     							    trueV = rtnV.trueNoOrd,	        							    
	     							    falseV = rtnV.falseNoOrd;
	         						
	         						if(!rtnV){
	         							rtnMsg.msg = "판매자 직접 반품요청이 실패 하였습니다.";
	         							defer.reject(rtnMsg);
	         						}else if(rtnV === "success"){
	         							rtnMsg.msg = "판매자 직접 반품요청을 처리하였습니다.";
	     	            				defer.resolve(rtnMsg);
	         						}else if(rtnV && rtnV !== "success"){	         							
		         						if(trueV.length > 0){
		         							rtnMsg.msg = "판매자 직접 반품요청을 처리하였습니다.";		         							
		     	            				defer.resolve(rtnMsg);
		     	            			}
		         						else if(falseV.length > 0){
		         							rtnMsg.msg = "not equal";
		         							rtnMsg.val = falseV;	
		     	            				defer.reject(rtnMsg);
		     	            			}else{
		     	            				rtnMsg.msg = "another error";	
		     	            				defer.reject(rtnMsg);
		     	            			}
	         						}else{
	         							rtnMsg.msg = "another error";	
	         							defer.reject(rtnMsg);
	         						}	         						
	         					},function(err){
	         						rtnMsg.msg = err.data;
	         						defer.reject(rtnMsg);
	         					});	         					
	     					};
	 	            	}
	     				else{
	     					defer.reject("cancel row");
	 	            	}
	        	 		return defer.promise;
	        	 	}
	        	 	default : {
	        	 		var defer = $q.defer();	
	        	 		defer.reject("default err");
	        	 		return defer.promise;
	        	 	}
	        	 }
	         }
          };
        }]);
}());