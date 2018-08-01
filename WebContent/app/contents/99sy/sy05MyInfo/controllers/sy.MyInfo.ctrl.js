(function () {
    "use strict";

    /**
     * 내정보관리
     * @name sy.MyInfo.controller : sy.MyInfoCtrl
     */
    angular.module("sy.MyInfo.controller")
        .controller("sy.MyInfoCtrl", ["$rootScope", "$scope", "$q", "sy.MyInfoSvc", "sy.LoginSvc", "UtilSvc", "Page", "resData",
            function ($rootScope, $scope, $q, SyMyInfoSvc, SyLoginSvc, UtilSvc, Page, resData) {

	        	/**
	             *===============================================================
	             * @description 개인정보를 관리한다.
	             *===============================================================
	             */
                var vo = $scope.myInfoVO = {
                	activeTab: 1,
                	ynEditNkne: false, // 닉네임 수정여부
                	ynCheckDupNkne: false, // 닉네임 중복체크 성공여부
                    param: {
                    	NO_EMP : "",
                        currentPw: "",			   // 현재비밀번호
                        newPw: "",				   // 새비밀번호
                        newPwChk: "",			   // 새비밀번호확인
                        isEquals: false,		   // 새비밀번호와 새비밀번호확인 일치여부
                        message: "비밀번호를 입력해주세요.",
                        DC_ID: "",
                        NM_EMP: "",
                        DC_EMIADDR: "",
                        NM_NKNE: "",
                        NM_DEPT: "",
                        NM_RANK: "",
                        DT_EMP: "",
                        YN_SMS: "",
                        YN_EMI: "",
                        yn_change: false
                    },
	                fileProfileVO: {
	        			CD_AT:"001",
	        			limitCnt: 1,
	        			bImage: true,
	        			imgWidth: '200px',
	        			imgHeight: '250px',
	        			currentData:{
	        				CD_AT: "",
	        				CD_REF1: "",
	        				CD_REF2: "",
	        				CD_REF3: null,
	        				CD_REF4: null,
	        				CD_REF5: "",
	        				DTS_INSERT: null,
	        				DTS_UPDATE: null,
	        				NM_FILE: "",
	        				NM_FILEPATH: "",
	        				NO_AT: 0,
	        				NO_C: "",
	        				NO_INSERT: "",
	        				NO_UPDATE: null,
	        				SZ_FILE: "",
	        				YN_DEL: null
	        			}
	        		}
                	
                };
                
                vo.isChangeNmNkne = function() {
                	if(vo.param.NM_NKNE === resData.MyParam.NM_NKNE) vo.ynEditNkne     = false; // 닉네임 수정여부
                	else                                             vo.ynEditNkne     = true;  // 닉네임 수정여부

                	vo.ynCheckDupNkne = false; // 닉네임 중복체크 성공여부
                };
                
                vo.dupCheck = function() {
                	var self = this,
					param = {};
				
					if(self.param.NM_NKNE === '') {
						alert('닉네임을 입력하여 주세요.');
						$timeout(function () {
	                        edt.id("NM_NKNE").focus();
	                    }, 500);
						return;
					}
					
					self.ynCheckDupNkne = false; // 닉네임 변경시 false로 변경해야 함.
					SyMyInfoSvc.dupCheckNmNkne(self.param.NM_NKNE).success(function (res) {
						if(res === "닉네임 중복체크 성공") {
							self.ynCheckDupNkne = true; // 닉네임 변경시 false로 변경해야 함.
							alert('중복된 닉네임이 없습니다.');
						}
						else {
							alert(res);
						}
					}).error(function(res) {
					});
                };
                
                //탭 바꿀시 변경된 데이터 체크
                vo.tab = function(clickTab, mVO) {
                	var self = this,
                		flag = false,
                		msg  = "변경사항이 있습니다.\n변경하시겠습니까?";
                	
                	// 프로필 설정
                	if(vo.activeTab === 1) {
                		if(mVO.fileProfileVO.dirty || mVO.ynEditNkne){
    						if(confirm(msg)) {
    							flag = true;
    							vo.doUpdateProfile();
    						} else {
    							mVO.fileProfileVO.fileInit();
    							mVO.ynEditNkne     = false;
    							mVO.ynCheckDupNkne = false;
    							mVO.param.NM_NKNE  = resData.MyParam.NM_NKNE;
    						}
                		}
                	}
                	// 비밀번호 설정
                	else if(vo.activeTab === 2) {
                		if(mVO.param.isEquals){
    						if(confirm(msg)){
    							vo.doUpdatePw();
    						}else{
    							mVO.param.currentPw = "";
    							mVO.param.newPw = "";
    							mVO.param.newPwChk = "";
    							mVO.param.isEquals= false;
    							mVO.param.message= "비밀번호를 입력해주세요.";
    						}
    					}
                	}
                	// 알림설정 설정
                	else if(vo.activeTab === 3) {
                		if(mVO.param.yn_change){
    						flag = true;
    						if(confirm(msg)){
    							vo.doUpdateYn();
    						}
    					}
                	}
                	
                	vo.activeTab = clickTab;
                	
					if(flag){
						var param = {
                        		procedureParam:"USP_SY_05MyInfo_GET"
                        	};
						UtilSvc.getList(param).then(function (result) {  // 해당 사원 재갱신
							vo.param = result.data.results[0][0];
							vo.fileProfileVO.currentData = result.data.results[1][0];
							mVO.param.newPw = "";
                        });
					}
					
				};

                /**
                 * @description 비밀번호 입력을 받을 때마다 메세지를 변경한다.
                 */
                vo.changeMessage = function () {
                    SyMyInfoSvc.changeMessage(vo);
                };
                
                vo.doUpdateProfile = function() {
                	if(vo.ynEditNkne && !vo.ynCheckDupNkne) {
                		alert("닉네임 중복체크가 안되어 있습니다.");
                		return;
                	}
                	
                	SyMyInfoSvc.updateProfile(vo.param).then(function (res) {
                		if(vo.fileProfileVO.dirty) {
    	        			vo.fileProfileVO.CD_REF1 = vo.param.NO_EMP;
    	        			vo.fileProfileVO.doUpload(function(){
    	        				vo.ynEditNkne     = false;
    	        				vo.ynCheckDupNkne = false;
    	        				resData.MyParam.NM_NKNE = vo.param.NM_NKNE;
    	        				$rootScope.webApp.user.NM_NKNE = vo.param.NM_NKNE;    	        				
    	        				alert('성공하였습니다.');
    		        		}, function() {
    		        			alert('파일업로드 실패하였습니다.');
    		        		});
    	        		}
    	        		else {
    	        			vo.ynEditNkne     = false;
	        				vo.ynCheckDupNkne = false;
	        				resData.MyParam.NM_NKNE = vo.param.NM_NKNE;
	        				$rootScope.webApp.user.NM_NKNE = vo.param.NM_NKNE;
    	        			alert('성공하였습니다.');
    	        		}
                    });
                };
                
//                vo.doFileChange = function() {
//                	if(vo.fileProfileVO.dirty) {
//	        			vo.fileProfileVO.CD_REF1 = vo.param.NO_EMP;
//	        			vo.fileProfileVO.doUpload(function(){
//	        				alert('성공하였습니다.');
//		        		}, function() {
//		        			alert('파일업로드 실패하였습니다.');
//		        		});
//	        		}
//	        		else {
//	        			alert('변경사항이 없습니다.');
//	        		}
//				};

                /**
                 * @description 패스워드를 변경한다.
                 */
                vo.doUpdatePw = function () {
                    var param = SyMyInfoSvc.makePwParam(vo),
                        msg = "비밀번호를 변경하시겠습니까?";

                    if (!vo.param.isEquals) {
                        alert("비밀번호를 확인해주세요.");
                        return;
                    }

                    if (confirm(msg)) {
                        SyMyInfoSvc.updatePassword(param).then(function () {
                            alert("패스워드가 변경되었습니다. 다시 로그인해주세요.");
                            SyLoginSvc.logout().then(function () {
                                $scope.$emit("event:logout");
                            });
                        });
                    }
                };
                
                vo.doUpdateYn = function () {
                    var param = SyMyInfoSvc.makeYnParam(vo),
                        msg = "알림을 변경하시겠습니까?";

                    if (confirm(msg)) {
                        SyMyInfoSvc.updateYn(param).then(function () {
                        });
                    }
                };

                /**
                 * 유저정보를 가져온다.
                 */
                vo.getUserInfo = function () {
            		vo.param = angular.copy(resData.MyParam);
            		vo.fileProfileVO.currentData = resData.fileProfile;
            		vo.param.newPw = "";
                };
                
                vo.getUserInfo();

            }]);
}());