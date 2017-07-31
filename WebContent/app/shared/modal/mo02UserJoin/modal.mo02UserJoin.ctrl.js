(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name
	 * modal - 회원가입
	 */
	angular.module("edtApp.common.modal")
		.controller("modal.mo02UserJoinCtrl", ["$scope", "$modal", "$modalInstance", "ngTableParams", "sy.LoginSvc", "$sce", "$filter", "UtilSvc", "$timeout", 
			function ($scope, $modal, $modalInstance, ngTableParams, SyLoginSvc, $sce, $filter, UtilSvc, $timeout) {

				var userJoinVO,
					testUser = true;

				/**
				 * ===================================================
				 * @description 회원가입
				 * ===================================================
				 */
				userJoinVO = $scope.userJoinVO = {
					param:{
						NM_C: '',
						CD_BSNSCLFT: '001',
						NO_BSNSRGTT: '',
						YN_COMMSALEREG: 'Y',
						NO_COMMSALEREG: '',
						DC_ID: '',
						DC_EMIADDR: '',
						DC_PWD: '',
						DC_REPWD: '',
						NO_OWNCONF: ''
					},
					ynChkDup: false,
					ynCla: false
				};
				
//				userJoinVO = $scope.userJoinVO = {
//					param: {
//						NM_C: 'test1234',
//						CD_BSNSCLFT: '001',
//						NO_BSNSRGTT: '',
//						YN_COMMSALEREG: 'Y',
//						NO_COMMSALEREG: '',
//						DC_ID: 'test123',
//						DC_EMIADDR: 'program_jhgf@naver.com',
//						DC_PWD: '12341234',
//						DC_REPWD: '12341234',
//						NO_OWNCONF: ''
//					},
//					ynChkDup: false,
//					ynCla: true
//				};
				
				/**
				 * 사업자명 중복체크
				 */
				userJoinVO.isChangeNmC = function() {
					var self = this;
					
					self.ynChkDup = false;
				};
				
				/**
				 * 사업자명 중복체크
				 */
				userJoinVO.dupCheck = function() {
					var self = this,
						param = {};
					
					if(self.param.NM_C === '') {
						alert('사업자명을 입력하여 주세요.');
						$timeout(function () {
	                        edt.id("joinNmC").focus();
	                    }, 500);
						return;
					}
					
					SyLoginSvc.dupCheckNmC(self.param.NM_C).then(function (res) {
						self.ynChkDup = false; // 사업자명 변경시 'N'으로 변경해야 함.

						if(res.status !== 200) return;
						
						if(res.data !== 'null') {
							if(res.data.CD_JOINYN == '001') {
								alert(res.data.DTS_JOINREQ + '에 가입요청 중 입니다.');
							}
							else if(res.data.CD_JOINYN == '002') {
								alert('미가입상태입니다. 관리자에게 문의바랍니다.');
							}
							else if(res.data.CD_JOINYN == '003') {
								alert(res.data.DTS_JOIN + '에 가입 중 입니다.');
							}
							else {
								alert('관리자에게 문의바랍니다.');
							}
						}
						else {
							self.ynChkDup = true; // 사업자명 변경시 'N'으로 변경해야 함.
							alert('중복된 사업자명이 없습니다.');
						}
					});
				};

				/**
				 * 본인확인 체크
				 */
				userJoinVO.doChkMe = function() {
					var self = this;
					
					if (!/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/.test(self.param.DC_EMIADDR)) {
						return edt.invalidFocus("joinEmiAddr", "[형식] 이메일은 유효하지 않은 형식입니다.");
					}
					SyLoginSvc.doChkMe(self.param.DC_EMIADDR).then(function (res) {
						if(res.status === 200) {
							alert('본인확인 이메일을 발송하였습니다. 이메일 확인을 하여 주시기 바랍니다.');
							self.param.NO_OWNCONF = res.data.NO_OWNCONF; // 본인확인 여부 데이터
						}
					});
				};

                // 등록전 유효성을 체크한다.
				userJoinVO.isValid = function () {
	                // FieldVO
	                var self = this,
	                    data = userJoinVO.param,
		                addressReg = /[가-힣a-zA-Z0-9 -().[\]&,@]{0,99}$/;

                    // 사업자명
	                if (!data.NM_C) {
		                return edt.invalidFocus("joinNmC", "[필수] 사업자명을 입력해주세요.");
	                } else {
		                if (!/^[가-힣a-zA-Z0-9~*()[\]\-<> ][가-힣a-zA-Z0-9~*()[\]\-<> ]{1,50}$/.test(data.NM_C)) {
			                return edt.invalidFocus("joinNmC", "[형식] 사업자명은 유효하지 않은 형식입니다. 영문, 한글, 공백만 사용 가능합니다.");
		                }
	                }

                    // ID
                    if (!data.DC_ID) {
	                    return edt.invalidFocus("joinDcId", "[필수] ID를 입력해주세요.");
                    } else {
	                    if (!/^[a-zA-Z0-9]{3,15}$/.test(data.DC_ID)) {
		                    return edt.invalidFocus("joinDcId", "[형식] ID는 유효하지 않은 형식입니다. 영문(대소문자 구분 안함), 숫자만 가능합니다.");
	                    }
                    }

                    // PASSWORD
					if (!data.DC_PWD) {
						return edt.invalidFocus("joinPwd", "[필수] 패스워드를 입력해주세요.");
					} else {
						if (!/^[a-zA-Z0-9~`|!@#$%^&*()[\]\-=+_|{};':\\\"<>?,./]{8,15}$/.test(data.DC_PWD)) {
							return edt.invalidFocus("joinPwd", "[형식] 패스워드는 유효하지 않은 형식입니다. 8~15자리 이하입니다.");
						} else {
							if (data.DC_REPWD !== data.DC_PWD) {
								return edt.invalidFocus( "joinChkPwd", "[MATCH] 비밀번호가 일치하지 않습니다." );
							}
						}
					}

	                // EMAIL
	                if (data.DC_EMIADDR) {
						if (!/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/.test(data.DC_EMIADDR)) {
							return edt.invalidFocus("joinEmiAddr", "[형식] 이메일은 유효하지 않은 형식입니다.");
						}
	                }
	                
	                if(!userJoinVO.checkBizNo(data.NO_BSNSRGTT)) {
	                	return edt.invalidFocus("joinNoBsnsClft", "[형식] 사업자번호를 확인하여 주십시오.");
	                }
	                
                    return true;
                };
                
                userJoinVO.checkBizNo = function(bizNo) {
                	var checkNo = new Array(1,3,7,1,3,7,1,3,5,1),
                		tmpBizNo, iIndex, chkSum=0, c2, remander;
                	
                	bizNo = bizNo.replace(/-/gi,'');
                	for(iIndex=0; iIndex <= 7; iIndex++) {
                		chkSum += checkNo[iIndex]*bizNo.charAt(iIndex);
                	}
                	
                	c2 = '0'+(checkNo[8]*bizNo.charAt(8));
                	c2 = c2.substring(c2.length-2,c2.length);
                	chkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));
                	remander = (10-(chkSum%10))%10;
                	
                	if(Math.floor(bizNo.charAt(9))==remander) return true;
                	
                	return false;
                }
                
				/**
				 * 약관팝업창
				 */
				userJoinVO.popCla = function () {
					var self = this,
					modalInstance = $modal.open({
						options: {
							modal: true,
							resizable: true,
							width: 470,
							visible: false
						},
						templateUrl : "app/shared/modal/mo01Cla/modal.mo01Cla.tpl.html",
	                    controller  : "modal.mo01ClaCtrl",
	                    size        : "lg",
	                    resolve: {
	                    	resData: ["$stateParams", "$q", "AuthSvc", "sy.AtrtSvc",
								function ($stateParams, $q, AuthSvc) {
									var defer   = $q.defer(),
										resData = {};

									SyLoginSvc.selectCla('001').then(function (res) {
										if(res.status === 200) {
											resData.DC_CLA001 = res.data;
											SyLoginSvc.selectCla('002').then(function (res) {
												if(res.status === 200) {
													resData.DC_CLA002 = res.data;
													SyLoginSvc.selectCla('003').then(function (res) {
														if(res.status === 200) {
															resData.DC_CLA003 = res.data;
															defer.resolve(resData);
														}
													});
												}
											});
										}
									});
									
									return defer.promise;
								}
	                    	]
	                    }
					});
					
					modalInstance.result.then(function ( result ) {
	                });
				};

				/**
				 * 회원가입 신청
				 */
				userJoinVO.doUserJoin = function () {
					var self = this;
					
					if(!self.ynCla) {
						alert("약관에 동의를 하지 않았습니다.");
						edt.id("joinNmC").focus();
						return;
					}
					
					if(!userJoinVO.isValid()) {
						return;
					}
					
					SyLoginSvc.saveUserJoin(self.param).then(function (res) {
						if(res.status === 200) {
							alert('회원 가입하였습니다.');
							$modalInstance.dismiss( "ok" );
						}
					});
				};

				/**
				 * 모달창을 닫는다.
				 */
				userJoinVO.doClose = function () {
					$modalInstance.dismiss( "cancel" );
				};

				// 처음 로드되었을 때 실행된다.
				(function  () {
					$timeout(function () {
                        edt.id("joinNmC").focus();
                    }, 500);
				}());
			}]);
}());