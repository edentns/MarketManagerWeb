(function () {
	'use strict';
	/**
	 * @ngdoc service
	 * @description
	 * 상품 유틸 서비스
	 */
	angular.module('edtApp.common.service').service('Util03saSvc', ['$rootScope', '$state', '$window', '$http', '$timeout', 'APP_CONFIG', '$resource', 
		function ($rootScope, $state, $window, $http, $timeout, APP_CONFIG, $resource) { 
		
			//popup insert & update Validation
            this.readValidation = function(idx){
            	var result = true,
            		cashParam = angular.copy(idx);
            	
        		for(var w in idx){
        			if(w === "NM_MRK_SELCT_INDEX"){
        				var c = idx[w].length;
        				if(!c){
        					alert("마켓명을 입력해 주세요.");
                			if(confirm("마켓등록 페이지로 이동할까요?")){
                				$state.go("app.syMrk", { menu: true, ids: null });
                			};
                			result = false;
                			return false;
        				}
        			}
        			if(w === "CD_ORDSTAT"){
        				if(!idx[w]){ alert("주문상태를 입력해 주세요."); result = false; return false;};
        			}
        			if(w === "DTS_CHK"){
        				if(!idx[w]){ alert("기간을 선택해 주세요."); result = false; return false;};
        			}
        			if(w === "CD_CCLSTAT"){
        				if(!idx[w]){ alert("취소상태를 선택해 주세요."); result = false; return false;};
        			}
        			if(w === "I_CD_INQSTAT"){
        				if(!idx[w]){ alert("상태값을 입력해 주세요."); result = false; return false;};
        			}
        			if(w === "I_DTS_INQREG_F"){
        				if(idx.I_DTS_INQREG_F > idx.I_DTS_INQREG_T){ alert("문의일자를 올바르게 입력해 주세요."); result = false; return;};    
        			}
        			if(w === "DTS_FROM"){
        				if(idx.DTS_TO < idx.DTS_FROM){ alert("조회기간을 올바르게 선택해 주세요."); result = false; return false;};	
        			}
        		};
        		if(result){
        			this.localStorage.setItem(idx.CASH_PARAM, cashParam);
            		//값이 너무 길어서 안넘어 가는듯.. 조회전에 다 짤라줌
            		idx.NM_MRK_SELCT_INDEX = "";
            		idx.NM_ORDSTAT_SELCT_INDEX = "";
            		idx.CD_CCLSTAT_SELCT_INDEX = "";        		
            		//idx.DTS_SELECTED = "";        			
        		}        		
            	return result;
            };
            
            //송장번호 유효성검사(정규식 체크)
            this.NoINVOValidation = function(input, colunm, valicolunm, leng){
            	var regTest = /^(([\d]+)\-|([\d]+))+(\d)+$/;
            	var iValue = !input.val() ? "" : input.val().trim();
            	var lengthStrt = (leng === 'undefined' || leng === '' || leng === null) ? 3 : leng; //0이 들어갈거라서 !를 안썼음 
 			                	
			    if (input.is("[name='"+colunm+"']") && !iValue && lengthStrt>0 && valicolunm !== "no_invo_non_blank_validation") {
                 	input.attr("data-"+valicolunm+"-msg", "송장번호를 입력해 주세요.");
                    return false;
                };
                if (input.is("[name='"+colunm+"']") && iValue && (iValue.length<lengthStrt || iValue.length>30)) {
                 	input.attr("data-"+valicolunm+"-msg", "송장번호를 "+lengthStrt+"자 이상 30자 이하로 입력해 주세요.");
                    return false;
                };
        		if (input.is("[name='"+colunm+"']") && iValue && !regTest.test(iValue.trim())) {
 					input.attr("data-"+valicolunm+"-msg", "송장번호에 숫자와 '-'문자 이외에 다른 문자가 입력되었습니다.(특수문자,문자,공백)");
 				    return false;
 				};
				return true;
			}; 
			
			//송장번호 유효성검사(서버체크)
			this.noInvoAjaxValidation = function(param){
				return $http({
                    method  : "POST",
					url		: APP_CONFIG.domain +"/parstest",
                    data     : param
                });
			};
            
            this.popupUtil = {
            	blur : function(e){
            		var element = $(e.currentTarget),
            			msg = element.closest("tr").find(".k-invalid-msg"),
            		    inputText = element.closest("input").val() || element.closest("textarea").val(),
            		    inputDate = element.closest("input[name=#DTS_RECER]").val(),
            		    //regTest = /^[0-9]{1}[0-9\-]+[0-9]{1}$/;
                	    regTest = /^(([\d]+)\-|([\d]+))+(\d)+$/;
            		
            		if((regTest.test(inputText) && msg.length > 0) || (inputDate && msg.length > 0)){
            			msg.hide();
            		};
            	},
            	mblur : function(e){
            		var element = $(e.currentTarget),
        				msg = element.closest("tr").find(".k-invalid-msg") || element.closest("td").find(".k-invalid-msg");        			
        			msg.hide();
            	}
            };
            
            //외부 kendo html 파일 불러오기
            this.externalKmodalPopup = function (param) {
				return $http({
					method  : "GET",
					url 	: param,
		            contentType: "text/x-kendo-template; charset=UTF-8",
				}).success(function (data, status, headers, config) {
					angular.element("#app-content").append(data);
				}).error(function (data, status, headers, config) {
                    alert("Error Loading Templates -- TODO: Better Error Handling");
				});
			};
            
			//검색어 저장 후 조회기능
			this.storedQuerySearchPlay = function(vo, storage, grd){
				var getParam = storage,
					me = vo;
			
				if(getParam){        			        			        			
        			for(var w in me) {
        				if(w === "datesetting"){
        					me[w].selected     = getParam.DTS_SELECTED;
        					me[w].period.start = getParam.DTS_STORAGE_FROM;
        					me[w].period.end   = (getParam.TODAY === 1)?angular.copy(edt.getToday()):getParam.DTS_STORAGE_TO; 
        				}
        				if(w === "betweenDateOptionMo" ){ me[w] = getParam.DTS_CHK; }
        				if(w === "ordMrkNameOp"){
        			   		me[w].setSelectNames = getParam.NM_MRK_SELCT_INDEX;
        			   		me[w].allSelectNames = getParam.NM_MRK_SELCT_INDEX;
        				}
        				if(w === "ordStatusOp"){
                			me[w].setSelectNames = getParam.NM_ORDSTAT_SELCT_INDEX;
        					me[w].allSelectNames = getParam.NM_ORDSTAT_SELCT_INDEX;
        				}
        				if(w === "ordMrkNameMo"){ me[w] = getParam.NM_MRK || getParam.NO_MRK; }
        				if(w === "ordStatusMo"){ me[w] = getParam.CD_ORDSTAT; }
        				if(w === "procName"){
        					var v = getParam.NM_MRKITEM || getParam.I_NM_MRKITEM || "";
        					me[w].value = v.trim();
        				}
        				if(w === "orderNo"){
        					var v = getParam.NO_MRKORD || getParam.I_NO_MRKORD || "";
        					me[w].value = v.trim();
        				}
        				if(w === "buyerName"){
        					var v = getParam.NM_PCHR || getParam.NM_CONS || getParam.I_NM_INQ || "";
        					me[w].value = v.trim();        					
        				}
        				if(w === "admin"){
        					var v = (!getParam.NO_ORDDTRM) ? "" : getParam.NO_ORDDTRM;
        					me[w].value = v.trim();
        				}
        				if(w === "cancelStatusMo"){ me[w] = getParam.CD_CCLSTAT; }
        				if(w === "cancelStatusOp"){
    				   		me[w].setSelectNames = getParam.CD_CCLSTAT_SELCT_INDEX;
    				   		me[w].allSelectNames = getParam.CD_CCLSTAT_SELCT_INDEX;
        				}
        				if(w === "echgStatusMo"){ me[w] = getParam.CD_ECHGSTAT; }
        				if(w === "cdTkbkstatMo"){ me[w] = getParam.CD_TKBKSTAT; }
        				if(w === "csMrkNameMo"){ me[w] = getParam.I_NO_MRK; }        				
        				if(w === "csStatusMo"){ me[w] = getParam.I_CD_INQSTAT; }      				
        				if(w === "csQuestionCodeMo"){ me[w].value = getParam.I_NM_INQCLFT; }
        				if(w === "csMrkNameOp"){
        					me[w].setSelectNames = getParam.CS_NM_MRK_SELCT_INDEX;
        			   		me[w].allSelectNames = getParam.CS_NM_MRK_SELCT_INDEX;
        				}
        				if(w === "csStatusOp"){
        					me[w].setSelectNames = getParam.CS_NM_ORDSTAT_SELCT_INDEX;
        					me[w].allSelectNames = getParam.CS_NM_ORDSTAT_SELCT_INDEX;
        				}
            			//me.setting.allCheckYn = 'N';
        			}
        		}
				me.inQuiry();
			};
			
			//로컬 스토리지			
			this.localStorage = {
				setItem: function(name, data) {
					var user = $rootScope.webApp.user,	
						noC = user.NO_C,
						noEmp = user.NO_EMP,
						key = noC+noEmp+name;
					
					// 저장
					var param = {
						ID_KEY: name,
						DC_VAL: JSON.stringify(data)
    				};
					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/ut08Storage/",
						headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
						data	: $.param(param)
					}).success(function (data, status, headers, config) {
						if(data !== "저장 성공") {
							alert("저장에 실패하였습니다.!! 연구소에 문의 부탁드립니다.\n("+data.errors[0].LMSG+")");
							return;
						}
					}).error(function (data, status, headers, config) {
						console.log("error",data,status,headers,config);
					});					
					//$window.localStorage.setItem(key, JSON.stringify(data));
				},				
				getItem: function(name) {
					var user = $rootScope.webApp.user;
					
					// 저장
					var param = {
						ID_KEY: name,
					};
					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/ut08Storage?"+ $.param(param)
					}).success(function (data, status, headers, config) {
					}).error(function (data, status, headers, config) {
					});
				},                
                removeItem: function(name) {  
                	var user = $rootScope.webApp.user,
                		noC = user.NO_C,
						noEmp = user.NO_EMP,
						key = noC+noEmp+name;              
                    $window.localStorage.removeItem(key);
                }
			};
			
			this.storedDatesettingLoad = function(name, vo){
				return this.localStorage.getItem(name).then(function(res) {
					var rtnData = [];
					
					if(res.data) {
						rtnData.selected = res.data.DTS_SELECTED;
						rtnData.storage = res.data;
					}
					else {
						rtnData.selected = "1Week";
						rtnData.storage = "";
					}
					return rtnData;
				});
			};
			
			//파라미터는 객체에 넣어주면 됨 
			this.shppingList = function (param) {
				var url = APP_CONFIG.domain +"/code/common/shplist/:shippingType/:mrkType";				
				return $resource(url, {shippingType:'@st', mrkType:'@mt'}, {
					get: {
			        	method: 'GET', isArray:true
			        }
				});
			};
			
			//팝업창 이름 변경
			this.popupHeaderTitle = function(code, mrk, menu){
				var tkbkName = {
						complete : "반품완료 입력",
						reject : "반품거부 입력",
						process : "반품처리 입력",
						change : "교환으로 변경"
					},
					echgName = {
						complete : "교환완료 입력",
						reject : "교환거부 입력",
						process : "교환처리 입력",
						change : "반품으로 변경"
					},
					shppingName = {
						edit : '배송정보 수정',
						shipping : '판매자 직접반품 신청'
					},
					title = "";
				
				if(code === "001"){
					if(menu === "tkbk"){ title = tkbkName.complete; }
					else if(menu === "echg"){ title = echgName.process; }
					else if(menu === "shpping"){ title = shppingName.edit; }
				}else if(code === "002"){
					if(menu === "tkbk"){ title = tkbkName.reject; }
					else if(menu === "echg"){ title = echgName.reject; }
					else if(menu === "shpping"){ title = shppingName.shipping; }
				}else if(code === "003"){
					if(menu === "tkbk"){ title = tkbkName.process; }
					else if(menu === "echg"){ title = echgName.complete; }
					else if(menu === "shpping"){ }
				}else if(code === "004"){
					if(menu === "tkbk"){ title = tkbkName.change; }
					else if(menu === "echg"){ title = echgName.change; }
					else if(menu === "shpping"){ }
				}				
				return title+' ('+mrk+')';
			};			

			this.manualTkbkDataBind = function(kg, input, target){
	           	var getUid = input.parents("table").attr("data-uid"),
	           	    grid = kg,
	           	    viewToRow = $("[data-uid='" + getUid + "']", grid.table),
	           	    dataItem = grid.dataItem(viewToRow);				                	    
	           	
	           	if(["CD_PARS","CD_HOLD"].indexOf(target) > -1){
	           		var i, chosenPureData = input.data().handler.dataSource.data();
	           		
	           		for(i=0; i<chosenPureData.length; i++){
	           			if(chosenPureData[i]["CD_DEF"] === input.val()){
	           				dataItem[target] = chosenPureData[i];
	           			}
	           		};
	           	}
	        	else if(["CD_PARS_INPUT"].indexOf(target) > -1){
	           		var i, chosenPureData = input.data().handler.dataSource.data();
	           		
	           		for(i=0; i<chosenPureData.length; i++){
	           			if(chosenPureData[i]["DC_RMK2"] === input.val()){
	           				dataItem[target] = chosenPureData[i];
	           			}
	           		};
	           	}
	           	else if(target === "NOW_YN"){
	           		dataItem[target] = input.is(":checked");
	           	}
	           	else if(target === "RECEIVE_SET"){
	           		dataItem[target] = $("#receive-group").find("[type=radio]:checked").val();
	           	}
	           	else if(target === "transform_pay_reason"){
	           		var i;
           			if((["구매자","구매자 귀책"].indexOf(dataItem["NM_TKBKLRKRSN"]) > -1 || ["구매자","구매자 귀책"].indexOf(dataItem["NM_ECHGLRKRSN"]) > -1) && input.val()){
           				//dataItem[target] = input.NM_DEF;
           				return true;
           			}
	           		return false;
	           	}
	           	else{
	           		dataItem[target] = input.val();
	           	};
	        };	        
	        //grid 동적 크기 변경
	        this.isOpen = function(kg, vo, grdVo, val){	        	
	        	if(val) {
            		kg.wrapper.height(616);
            		kg.resize();
            		if(vo.param !== "") grdVo.dataSource.pageSize(9);
            	}
            	else {
            		kg.wrapper.height(798);
            		kg.resize();
            		if(vo.param !== "") grdVo.dataSource.pageSize(12);
            	}
	        };
	        //드롭다운 리스트 초기화시 선택
	        this.ddlSelectedIndex = function(ele, name){
            	var ddl = ele.find("select[name="+name+"]").data("kendoDropDownList");            
            	ddl.select(0);
            	ddl.trigger("change");       
	        };
	               
		}
	]);
}());