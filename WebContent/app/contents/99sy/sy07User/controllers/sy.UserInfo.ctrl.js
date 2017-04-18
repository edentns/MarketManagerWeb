(function () {
    "use strict";

    /**
     * 유저관리 - 상세
     * @name sy.User.controller : sy.UserInfoCtrl
     */
    angular.module("sy.User.controller")
        .controller("sy.UserInfoCtrl", ["$state", "$scope", "sy.UserInfoSvc", "$modal", "sy.CodeSvc", "sy.DeptSvc", "sy.AtrtSvc", "$stateParams", "APP_MSG", "APP_CODE", "$q", "resData", "FieldVO", "Page",
            function ($state, $scope, SyUserInfoSvc, $modal, SyCodeSvc, SyDepartSvc, SyAuthSvc, $stateParams, APP_MSG, APP_CODE, $q, resData, FieldVO, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();

                // [syUserVO]
                var vo = $scope.syUserVO = {
                    boxTitle : "유저등록",
                    param: {
                        CD			: "",		// 사원번호
                        PASSWORD	: "",		// 패스워드
                        NAME		: "",		// 이름
                        DEPT_CD		: "",		// 부서코드
                        DEPT_NAME   : "",       // 부서이름
                        POS_CD		: "",		// 직위코드
                        POS_NAME	: "",		// 직위이름
                        CD_G		: "",		// 권한코드
                        NM_G		: "",		// 권한이름
                        WORK_GROUP	: "",		// 직군코드
                        WORK_GROUP_NAME	: "",	// 직군이름
                        PHONE_MOBILE: "",		// 핸드폰
                        PHONE_INNER	: "",		// 내선번호
                        PHONE_OUTER	: "",		// 직통번호
                        EMAIL		: "",		// 이메일
                        BIRTH_D		: "",		// 생년월일
                        ZIPCODE		: "",		// 우편번호
                        ADDRESS1	: "",		// 주소
                        ADDRESS2	: "",		// 상세주소
                        HIRE_D		: "",		// 입사날짜
                        MGR_CD		: "",		// 상급자 사원번호
                        MGR_NAME	: "",		// 상급자 이름
                        STATUS		: "",		// 재직상태
                        RETIRE_D	: "",		// 퇴사일
                        zip			: { zip1: "", zip2: "" },
                        email		: { disabled: false, email1: "", email2: "", selectedDomain: ""}
                    },
                    selectedDepart		: "",		// 선택된 부서객체
                    selectedPosition	: "",		// 선택된 직급객체
                    selectedRole		: "",		// 선택된 권한객체
                    selectedWorkgroup	: "",		// 선택된 직군객체
                    departCodeList		: [],		// 부서코드리스트
                    positionCodeList	: [],		// 직급코드리스트
                    workgroupCodeList	: [],		// 직군코드리스트
                    roleCodeList		: [],		// 권한코드리스트
                    today				: new Date(),
                    superiorNm			: "",
                    confirmPassword		: "",
                    checkMsg			: "비밀번호를 입력해주세요.(6자리이상 ~ 15자리이하)"
                };
                vo.init = function () {// 초기 로드된다.
                    vo.kind 	= $stateParams.kind;
                    vo.ids 		= $stateParams.ids || "";
                    vo.title 	= ($stateParams.kind === "insert") ? "등록" : "수정";

                    if ( vo.kind === "insert" ) {
                        if ($scope.page.isWriteableAll()) {
                            vo.initInsert();
                        } else { throw new Error("접근 권한이 없습니다."); }

                    } else {
                        vo.initUpdate();
                    }
                };
                // insert, update에 사용되는 param을 생성하여 리턴한다.
                vo.makeGetParam = function () {
                    var param = {
                        CD			: vo.param.CD ? vo.param.CD.toLowerCase() : vo.param.CD,
                        PASSWORD	: ( vo.param.PASSWORD==="" ) ? null : vo.param.PASSWORD,
                        NAME		: vo.param.NAME,
                        DEPT_CD		: vo.selectedDepart.CD,
                        POS_CD		: vo.selectedPosition.CD,
                        WORK_GROUP	: vo.selectedWorkgroup.CD,
                        CD_G		: vo.param.CD_G,
                        PHONE_MOBILE: ( vo.param.PHONE_MOBILE==="" ) ? null : vo.param.PHONE_MOBILE,
                        PHONE_INNER	: ( vo.param.PHONE_INNER==="" ) ? null : vo.param.PHONE_INNER,
                        PHONE_OUTER	: ( vo.param.PHONE_OUTER==="" ) ? null : vo.param.PHONE_OUTER,
                        EMAIL		: ( vo.param.email.email1.length>0 || vo.param.email.email2.length>0 ) ? vo.param.email.email1 +"@"+ vo.param.email.email2 : null,
                        BIRTH_D		: ( vo.param.BIRTH_D==="" ) ? null : vo.param.BIRTH_D,
                        ZIPCODE		: vo.param.ZIPCODE || null,
                        ADDRESS1	: ( vo.param.ADDRESS1==="" ) ? null : vo.param.ADDRESS1,
                        ADDRESS2	: ( vo.param.ADDRESS2==="" ) ? null : vo.param.ADDRESS2,
                        HIRE_D		: vo.param.HIRE_D,
                        MGR_CD		: !vo.param.MGR_CD ? null : vo.param.MGR_CD.toLowerCase()
                    };
                    if (vo.kind==="detail") {
                        param.STATUS 	= vo.param.STATUS;
                        param.RETIRE_D 	= edt.isValid( vo.param.RETIRE_D ) ? vo.param.RETIRE_D : null;
                    }

                    return param;
                };
                // insert 처음로드시 실행된다.
                vo.initInsert = function () {
                    $q.all([
                        SyDepartSvc.getDepart({ search: "all" }).then(function (result) {
                            return result.data;
                        }),
                        SyCodeSvc.getSubcodeList({cd: APP_CODE.position.cd, search: "all"}).then(function (result) {
                            return result.data;
                        }),
                        SyCodeSvc.getSubcodeList({cd: APP_CODE.workgroup.cd, search: "all"}).then(function (result) {
                            return result.data;
                        }),
                        SyAuthSvc.getAuthList().then(function (result) {
                            return result.data;
                        })
                    ]).then(function (result) {
                        vo.departCodeList 		= result[0];
                        vo.positionCodeList 	= result[1];
                        vo.workgroupCodeList 	= result[2];
                        vo.roleCodeList 		= result[3];
                    });
                };
                // update, detail 처음 로드시 실행된다.
                vo.initUpdate = function () {
	                var split;
                    $q.all([
                        SyDepartSvc.getDepart({ search: "all" }).then(function (result) {
                            return result.data;
                        }),
                        SyCodeSvc.getSubcodeList({cd: APP_CODE.position.cd, search: "all"}).then(function (result) {
                            return result.data;
                        }),
                        SyCodeSvc.getSubcodeList({cd: APP_CODE.workgroup.cd, search: "all"}).then(function (result) {
                            return result.data;
                        }),
                        SyAuthSvc.getAuthList().then(function (result) {
                            return result.data;
                        }),
                        SyUserInfoSvc.getUserDetailInfo({cd: vo.ids}).then(function (result) {
                            return result.data[0];
                        })
                    ]).then(function (result) {
                        vo.departCodeList 		= result[0];
                        vo.positionCodeList 	= result[1];
                        vo.workgroupCodeList 	= result[2];
                        vo.roleCodeList		 	= result[3];

                        vo.param 				= result[4];
                        vo.param.PASSWORD		= "";

                        if (vo.param.EMAIL) {
	                        split = vo.param.EMAIL.split("@");
                            vo.param.email = {
                                email1: split[0],
                                email2: split[1]
                            };
                        } else {
                            vo.param.email = {email1: "", email2: ""};
                        }
                        vo.setSubCode();
                    });

                };
                vo.setSubCode = function () {// 유저 정보를 가져왔을 경우 셀렉트 세팅을 위해 실행한다.
                    angular.forEach(vo.departCodeList, function (data) {
                        if (data.CD === vo.param.DEPT_CD) {
                            vo.selectedDepart = data;
                        }
                    });

                    angular.forEach(vo.positionCodeList, function (data) {
                        if (data.CD === vo.param.POS_CD) {
                            vo.selectedPosition = data;
                        }
                    });

                    angular.forEach(vo.workgroupCodeList, function (data) {
                        if (data.CD === vo.param.WORK_GROUP) {
                            vo.selectedWorkgroup = data;
                        }
                    });
                };

                // 등록전 유효성을 체크한다.
                vo.isValid = function (param) {
	                // FieldVO
	                var data = vo.param,
		                addressReg = /[가-힣a-zA-Z0-9 -().[\]&,@]{0,99}$/;

                    if (vo.kind === "insert") {
	                    // ID
	                    if (!data.CD) {
		                    return edt.invalidFocus("userCD", "[필수] ID를 입력해주세요.");
	                    } else {
		                    if (!/^[a-zA-Z0-9]{3,15}$/.test(data.CD)) {
			                    return edt.invalidFocus("userCD", "[형식] ID는 유효하지 않은 형식입니다. 영문(대소문자 구분 안함), 숫자만 가능합니다.");
		                    }
	                    }

	                    // PASSWORD
						if (!data.PASSWORD) {
							return edt.invalidFocus("userPw", "[필수] 패스워드를 입력해주세요.");
						} else {
							if (!/^[a-zA-Z0-9~`|!@#$%^&*()[\]\-=+_|{};':\\\"<>?,./]{5,14}$/.test(data.PASSWORD)) {
								return edt.invalidFocus("userPw", "[형식] 패스워드는 유효하지 않은 형식입니다. 5~14자리 이하입니다.");
							} else {
								if (vo.confirmPassword !== data.PASSWORD) {
									return edt.invalidFocus( "userChkPw", "[MATCH] 비밀번호가 일치하지 않습니다." );
								}
							}
						}
                    } else {
	                    // PASSWORD
	                    if (data.PASSWORD || vo.confirmPassword.length>0) {
		                    if (!/^[a-zA-Z0-9~`|!@#$%^&*()[\]\-=+_|{};':\\\"<>?,./]{5,14}$/.test(data.PASSWORD)) {
			                    return edt.invalidFocus("userPw", "[형식] 패스워드는 유효하지 않은 형식입니다. 5~14자리 이하입니다.");
		                    } else {
			                    if (vo.confirmPassword !== data.PASSWORD) {
				                    return edt.invalidFocus( "userChkPw", "[MATCH] 비밀번호가 일치하지 않습니다." );
			                    }
		                    }
	                    }
                    }

                    // 이름
	                if (!data.NAME) {
		                return edt.invalidFocus("userName", "[필수] 이름을 입력해주세요.");
	                } else {
		                if (!/^[가-힣a-zA-Z][가-힣a-zA-Z ]{1,19}$/.test(data.NAME)) {
			                return edt.invalidFocus("userName", "[형식] 이름은 유효하지 않은 형식입니다. 영문, 한글, 공백만 사용 가능합니다.");
		                }
	                }

	                // 생년월일
	                if (data.BIRTH_D && !moment(data.BIRTH_D, "YYYY-MM-DD", true).isValid()) {
		                return edt.invalidFocus("userBirth", "[형식] 생년월일이 유효하지 않은 형식입니다.(ex-\"2014-11-18\")" );
	                }

                    // 부서
	                if (!vo.selectedDepart.CD) {
		                return edt.invalidFocus("userDepart", "[필수] 부서를 선택해주세요");
	                } else {
		                if (!/\d+$/.test(vo.selectedDepart.CD)) {
			                return edt.invalidFocus("userDepart", "[형식] 부서는 유효하지 않은 형식입니다.");
		                }
	                }

	                // 직급
	                if (!vo.selectedPosition.CD) {
		                return edt.invalidFocus("userPosition", "[필수] 직급을 선택해주세요");
	                } else {
		                if (!/\d+$/.test(vo.selectedPosition.CD)) {
			                return edt.invalidFocus("userPosition", "[형식] 직급은 유효하지 않은 형식입니다.");
		                }
	                }

	                // 상급자 MGR_CD
	                if (data.MGR_CD && !/^[\w]{3,15}$/.test(data.MGR_CD)) {
		                return edt.invalidFocus("mgrBtn", "[형식] 상급자는 유효하지 않은 형식입니다.");
	                }

	                // 직군
	                if (!vo.selectedWorkgroup.CD) {
		                return edt.invalidFocus("userWork", "[필수] 직군을 선택해주세요");
	                } else {
		                if (!/\d+$/.test(vo.selectedWorkgroup.CD)) {
			                return edt.invalidFocus("userWork", "[형식] 직군은 유효하지 않은 형식입니다.");
		                }
	                }

	                // 권한
	                if (!data.CD_G) {
		                return edt.invalidFocus("userAuth", "[필수] 권한을 선택해주세요");
	                } else {
		                if (!/\d+$/.test(data.CD_G)) {
			                return edt.invalidFocus("userAuth", "[형식] 권한은 유효하지 않은 형식입니다.");
		                }
	                }

                    // 입사일자
	                if (!data.HIRE_D) {
		                return edt.invalidFocus("userHired", "[필수] 입사일자를 입력해주세요.");
	                } else {
		                if (!moment(data.HIRE_D, "YYYY-MM-DD", true).isValid()) {
		                    return edt.invalidFocus("userHired", "[형식] 입사일자는 유효하지 않은 형식입니다.(ex-\"2014-11-18\")" );
		                }
	                }

	                // 우편번호
	                if (data.ZIPCODE && !/^[1-9]\d{2}-\d{3}$|^\d{5}$/.test(data.ZIPCODE)) {
		                return edt.invalidFocus("zipcode", "[형식] 우편번호는 유효하지 않은 형식입니다.(ex-\"123-233\" or \"12345\")");
	                }

	                // 기본주소
	                if (data.ADDRESS1) {
		                if (!addressReg.test(data.ADDRESS1)) {
			                return edt.invalidFocus("userAddr1", "[형식] 기본주소는 유효하지 않은 형식입니다.");
		                }

		                if (!data.ADDRESS2) {
			                return edt.invalidFocus("userAddr2", "[필수] 상세주소를 입력해주세요.");
		                } else {
			                if (!addressReg.test(data.ADDRESS2)) {
				                return edt.invalidFocus("userAddr2", "[형식] 상세주소는 유효하지 않은 형식입니다.");
			                }
		                }
	                }

	                // 상세주소
	                if (data.ADDRESS2) {
		                if (!data.ADDRESS1) {
			                return edt.invalidFocus("userAddr1", "[필수] 기본주소를 입력해주세요.");
		                } else {
			                if (!addressReg.test(data.ADDRESS1)) {
				                return edt.invalidFocus("userAddr1", "[형식] 기본주소는 유효하지 않은 형식입니다.");
			                }
		                }

		                if (!addressReg.test(data.ADDRESS2)) {
			                return edt.invalidFocus("userAddr2", "[형식] 상세주소는 유효하지 않은 형식입니다.");
		                }
	                }

	                // PHONE
	                if (data.PHONE_MOBILE && !/(^0\d{1,2}-[1-9]\d{2,3}-\d{4}$|^\d{3,4}-\d{4}$)/.test(data.PHONE_MOBILE)) {
		                return edt.invalidFocus("userPhone", "[형식] PHONE은 유효하지 않은 형식입니다.(ex-\"010-4233-2211\")");
	                }

	                // 내선번호
	                if (data.PHONE_INNER && !/^\d{1,10}$/.test(data.PHONE_INNER)) {
		                return edt.invalidFocus("userPhoneInner", "[형식] 내선번호는 유효하지 않은 형식입니다.(ex-\"0112\")");
	                }

	                // 직통번호
	                if (data.PHONE_OUTER && !/^0\d{1,2}-[1-9]\d{2,3}-\d{4}$/.test(data.PHONE_OUTER)) {
		                return edt.invalidFocus("userPhoneOuter", "[형식] 직통번호는 유효하지 않은 형식입니다.(ex-\"0112\")");
	                }

	                // EMAIL
	                if (data.email.email1 || data.email.email2) {
						if (!/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/.test(data.email.email1 +"@"+ data.email.email2)) {
							return edt.invalidFocus("userEmail", "[형식] 이메일은 유효하지 않은 형식입니다.");
						}
	                }

                    // 퇴사일자
                    if (vo.kind === "detail") {
	                    if (data.STATUS === "EXITED") {
		                    if (!data.RETIRE_D) {
			                    return edt.invalidFocus("userRetired", "[필수] 퇴사일자를 입력해주세요.");
		                    }
	                    }

	                    if (data.RETIRE_D) {
		                    if (!moment(data.RETIRE_D, "YYYY-MM-DD", true).isValid()) {
			                    return edt.invalidFocus("userRetired", "[형식] 퇴사일자는 유효하지 않은 형식입니다.(ex-\"2014-11-18\")");
		                    } else {
			                    if (data.STATUS !== "EXITED") {
				                    return edt.invalidFocus("userStatus", "[필수] 재직상태를 퇴사로 변경해주세요.");
			                    }
		                    }
	                    }
                    }

                    return true;
                };
                vo.doInsert = function () {// 유저를 등록한다.
                    if (confirm(APP_MSG.insert.confirm)) {
                        var param = vo.makeGetParam("insert");
                        if (vo.isValid(param)) {
                            SyUserInfoSvc.insert(param).then(function () {
                                alert(APP_MSG.insert.success);
                                $state.go('app.syUser', { kind: 'list', menu: true, ids: null });
                            });
                        }
                    }
                };
                vo.doUpdate = function () {// 유저정보를 수정한다.
                    if (confirm(APP_MSG.update.confirm)) {
                        var param = vo.makeGetParam("detail");
                        if (vo.isValid(param)) {
                            SyUserInfoSvc.update(param).then(function () {
                                alert(APP_MSG.update.success);
                                $state.go('app.syUser', { kind: 'list', menu: true, ids: null });
                            });
                        }
                    }
                };
                vo.changeEmailDomain = function () {// 이메일 도메인이 변경되었을때 동작을 처리한다.
                    var value = vo.param.email.selectedDomain;
                    if (value === "") {
                        vo.param.email.disabled	= false;
                        vo.param.email.email2 = "";
                    } else {
                        vo.param.email.disabled	= true;
                        vo.param.email.email2 = value;
                    }
                };
                vo.isCheckPassword = function () {// 비밀번호 입력 또는 비밀번호 확인 입력시 비밀번호가 일치하는지 확인한다.
                    var
                        pass1   = vo.param.PASSWORD || "",
                        pass2   = vo.confirmPassword || "",
                        status  = ( pass1 === pass2 );

                    if (pass1.length>=6) {
                        if (status) {
                            vo.checkMsg = "비밀번호가 일치합니다.";
                        } else {
                            vo.checkMsg = "비밀번호 서로 다릅니다.";
                        }
                    } else {
                        vo.checkMsg = "비밀번호를 입력해주세요.(5자리이상 ~ 14자리이하)";
                    }
                };
                vo.doCancel = function () {// 사원등록을 취소하고 리스트 페이지로 이동한다.
                    $state.go('app.syUser', { kind: 'list', menu: true, ids: null });
                };
                vo.modalSearchSuperior = function () {// 상급자를 검색한다.
                    var modalInstance = $modal.open({
                        templateUrl : "app/shared/modal/searchUser/modal.searchUser.tpl.html",
                        controller  : "ModalSearchUserCtrl",
                        size    : "lg",
                        resolve : {
                            dpParam: function () {
                                return {
                                    wk_grp: '0' // 전체
                                };
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        vo.param.MGR_CD   = result.empNo;
                        vo.param.MGR_NAME = result.name;
                    });
                };

                vo.init();
            }]);
}());
