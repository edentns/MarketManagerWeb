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

                //탭 바꿀시 변경된 데이터 체크
                vo.tab = function(mVO) {
                	var self = this,
                		flag = false,
                		msg  = "변경사항이 있습니다.\n변경하시겠습니까?";
					if(mVO.fileProfileVO.dirty){
						if(confirm(msg)){
							flag = true;
							vo.doFileChange();
						}else{
							mVO.fileProfileVO.fileInit();
						}
					}else if(mVO.param.isEquals){
						if(confirm(msg)){
							vo.doUpdatePw();
						}else{
							mVO.param.currentPw = "";
							mVO.param.newPw = "";
							mVO.param.newPwChk = "";
							mVO.param.isEquals= false;
							mVO.param.message= "비밀번호를 입력해주세요.";
						}
					}else if(mVO.param.yn_change){
						flag = true;
						if(confirm(msg)){
							vo.doUpdateYn();
						}
					}
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
                
                vo.doFileChange = function() {
                	if(vo.fileProfileVO.dirty) {
	        			vo.fileProfileVO.CD_REF1 = vo.param.NO_EMP;
	        			vo.fileProfileVO.doUpload(function(){
	        				alert('성공하였습니다.');
		        		}, function() {
		        			alert('파일업로드 실패하였습니다.');
		        		});
	        		}
	        		else {
	        			alert('성공하였습니다.');
	        		}
				};

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
            		vo.param = resData.MyParam;
            		vo.fileProfileVO.currentData = resData.fileProfile;
            		vo.param.newPw = "";
                };
                
                vo.getUserInfo();

            }]);
}());