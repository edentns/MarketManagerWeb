(function () {
    "use strict";

    /**
     * 유저관리 - 상세
     * @name sy.User.controller : sy.UserInfoCtrl
     */
    angular.module("sy.User.controller")
        .controller("sy.UserInfoCtrl", ["$state", "$scope", "sy.UserInfoSvc", "$modal", "sy.CodeSvc", "sy.DeptSvc", "sy.AtrtSvc", "$stateParams", "APP_MSG", "APP_CODE", "$q", "resData", "FieldVO", "Page", "UtilSvc", "sy.UserListSvc",
            function ($state, $scope, SyUserInfoSvc, $modal, SyCodeSvc, SyDepartSvc, SyAuthSvc, $stateParams, APP_MSG, APP_CODE, $q, resData, FieldVO, Page, UtilSvc, UserListSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();

                // [syUserVO]
                var vo = $scope.syUserVO = {
                    boxTitle : "유저등록",
                    param: {
                        DC_ID		: "",		// 사원아이디
                        DC_PWD   	: "",		// 패스워드
                        NM_EMP		: "",		// 이름
                        NO_DEPT		: "",		// 부서코드
                        NM_DEPT     : "",       // 부서이름
                        CD_RANK		: "",		// 직위코드
                        NM_RANK 	: "",		// 직위이름
                        CD_OCC  	: "",		// 직군코드
                        NM_OCC  	: "",	    // 직군이름
                        NO_ATRT		: "",		// 권한코드
                        NM_ATRT		: "",		// 권한이름
                        NO_CEPH     : "",		// 핸드폰
                        DC_EMIADDR	: "",		// 이메일
                        CD_EMPSTAT	: "",		// 재직상태
                        DT_RESI 	: "",		// 퇴사일
                        YN_SMS      : "N",       // SMS
                        YN_EMI      : "N",       // EMAIL
                        email		: { disabled: false, email1: "", email2: "", selectedDomain: ""}
                    },
                    selectedDepart		: "",		// 선택된 부서객체
                    selectedRank	    : "",		// 선택된 직급객체
                    selectedRole		: "",		// 선택된 권한객체
                    selectedWorkgroup	: "",		// 선택된 직군객체
                    departCodeList		: [],		// 부서코드리스트
                    rankCodeList    	: [],		// 직급코드리스트
                    workgroupCodeList	: [],		// 직군코드리스트
                    roleCodeList		: [],		// 권한코드리스트
                    today				: new Date(),
                    superiorNm			: "",
                    confirmDC_PWD		: "",
                    checkMsg			: "비밀번호를 입력해주세요.(6자리이상 ~ 15자리이하)"
                };
                vo.init = function () {// 초기 로드된다.
                    vo.kind 	= $stateParams.kind;
                    vo.ids 		= $stateParams.ids || "";
                    vo.title 	= ($stateParams.kind === "insert") ? "등록" : "수정";

                    if ( vo.kind === "insert" ) {
                        if ($scope.page.isWriteable()) {
                            vo.initInsert();
                        } else { throw new Error("접근 권한이 없습니다."); }

                    } else {
                        vo.initUpdate();
                    }
                };
                // insert, update에 사용되는 param을 생성하여 리턴한다.
                vo.makeGetParam = function () {
                    var param = {
                    	DC_ID		: vo.param.DC_ID ? vo.param.DC_ID.toLowerCase() : vo.param.DC_ID,
                    	DC_PWD	    : ( vo.param.DC_PWD==="" ) ? null : vo.param.DC_PWD,
                        NM_EMP		: vo.param.NM_EMP,
                        NO_DEPT		: vo.selectedDepart.NO_DEPT,
                        CD_RANK		: vo.selectedRank.CD_DEF,
                        CD_OCC  	: vo.selectedWorkgroup.CD_DEF,
                        NO_ATRT		: vo.param.NO_ATRT,
                        NO_CEPH     : ( vo.param.NO_CEPH==="" ) ? null : vo.param.NO_CEPH,
                        DC_EMIADDR	: ( vo.param.email.email1.length>0 || vo.param.email.email2.length>0 ) ? vo.param.email.email1 +"@"+ vo.param.email.email2 : null,
                        YN_SMS      : vo.param.YN_SMS,
                        YN_EMI      : vo.param.YN_EMI
                    };
                    if (vo.kind==="detail") {
                        param.CD_EMPSTAT  =  vo.param.CD_EMPSTAT;
                        param.DT_RESI 	  =  edt.isValid( vo.param.DT_RESI ) ? vo.param.DT_RESI : null;
                    }

                    return param;
                };
                // insert 처음로드시 실행된다.
                vo.initInsert = function () {
                	var param = {
                            procedureParam: "USP_SY_08ATRT01_GET"
                        };
                    $q.all([
                        UserListSvc.getDepart({ search: "all" }).then(function (result) {
                            return result.data;
                        }),
                        SyCodeSvc.getSubcodeList({cd: "SY_000020", search: "all"}).then(function (result) {
                            return result.data;
                        }),
                        SyCodeSvc.getSubcodeList({cd: "SY_000023", search: "all"}).then(function (result) {
                            return result.data;
                        }),
                        UtilSvc.getList(param).then(function (result) {
                            return result.data.results[0];
                        })
                    ]).then(function (result) {
                        vo.departCodeList 		= result[0];
                        vo.rankCodeList 	    = result[1];
                        vo.workgroupCodeList 	= result[2];
                        vo.roleCodeList 		= result[3];
                    });
                };
                // update, detail 처음 로드시 실행된다.
                vo.initUpdate = function () {
	                var split,
	                    param = {
                            procedureParam: "USP_SY_08ATRT01_GET"
                        },
                        empParam = {
	                		procedureParam: "USP_SY_07USER02_GET"
	                	}
                    $q.all([
                        UserListSvc.getDepart({ search: "all" }).then(function (result) {
                            return result.data;
                        }),
                        SyCodeSvc.getSubcodeList({cd: "SY_000020", search: "all"}).then(function (result) {
                            return result.data;
                        }),
                        SyCodeSvc.getSubcodeList({cd: "SY_000023", search: "all"}).then(function (result) {
                            return result.data;
                        }),
                        UtilSvc.getList(param).then(function (result) {
                            return result.data.results[0];
                        }),
                        UtilSvc.getList(empParam).then(function (result) {
                            return result.data.results[0];
                        })
                    ]).then(function (result) {
                    	vo.departCodeList 		= result[0];
                        vo.rankCodeList 	    = result[1];
                        vo.workgroupCodeList 	= result[2];
                        vo.roleCodeList 		= result[3];

                        vo.param 				= result[4];
                        vo.param.DC_PWD		= "";

                        if (vo.param.DC_EMIADDR) {
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
                        if (data.NO_DEPT === vo.param.NO_DEPT) {
                            vo.selectedDepart = data;
                        }
                    });

                    angular.forEach(vo.positionCodeList, function (data) {
                        if (data.CD === vo.param.CD_RANK) {
                            vo.selectedRank = data;
                        }
                    });

                    angular.forEach(vo.workgroupCodeList, function (data) {
                        if (data.CD === vo.param.CD_OCC) {
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
	                    if (!data.DC_ID) {
		                    return edt.invalidFocus("userCD", "[필수] ID를 입력해주세요.");
	                    } else {
		                    if (!/^[a-zA-Z0-9]{3,15}$/.test(data.DC_ID)) {
			                    return edt.invalidFocus("userCD", "[형식] ID는 유효하지 않은 형식입니다. 영문(대소문자 구분 안함), 숫자만 가능합니다.");
		                    }
	                    }

	                    // PASSWORD
						if (!data.DC_PWD) {
							return edt.invalidFocus("userPw", "[필수] 패스워드를 입력해주세요.");
						} else {
							if (!/^[a-zA-Z0-9~`|!@#$%^&*()[\]\-=+_|{};':\\\"<>?,./]{5,14}$/.test(data.DC_PWD)) {
								return edt.invalidFocus("userPw", "[형식] 패스워드는 유효하지 않은 형식입니다. 5~14자리 이하입니다.");
							} else {
								if (vo.confirmDC_PWD !== data.DC_PWD) {
									return edt.invalidFocus( "userChkPw", "[MATCH] 비밀번호가 일치하지 않습니다." );
								}
							}
						}
                    } else {
	                    // PASSWORD
	                    if (data.DC_PWD || vo.confirmDC_PWD.length>0) {
		                    if (!/^[a-zA-Z0-9~`|!@#$%^&*()[\]\-=+_|{};':\\\"<>?,./]{5,14}$/.test(data.DC_PWD)) {
			                    return edt.invalidFocus("userPw", "[형식] 패스워드는 유효하지 않은 형식입니다. 5~14자리 이하입니다.");
		                    } else {
			                    if (vo.confirmDC_PWD !== data.DC_PWD) {
				                    return edt.invalidFocus( "userChkPw", "[MATCH] 비밀번호가 일치하지 않습니다." );
			                    }
		                    }
	                    }
                    }

                    // 이름
	                if (!data.NM_EMP) {
		                return edt.invalidFocus("userName", "[필수] 이름을 입력해주세요.");
	                } else {
		                if (!/^[가-힣a-zA-Z][가-힣a-zA-Z ]{1,19}$/.test(data.NM_EMP)) {
			                return edt.invalidFocus("userName", "[형식] 이름은 유효하지 않은 형식입니다. 영문, 한글, 공백만 사용 가능합니다.");
		                }
	                }

                    // 부서
	                if (!vo.selectedDepart.NO_DEPT) {
		                return edt.invalidFocus("userDepart", "[필수] 부서를 선택해주세요");
	                } else {
		                if (!/\d+$/.test(vo.selectedDepart.NO_DEPT)) {
			                return edt.invalidFocus("userDepart", "[형식] 부서는 유효하지 않은 형식입니다.");
		                }
	                }

	                // 직급
	                if (!vo.selectedRank.CD_DEF) {
		                return edt.invalidFocus("userPosition", "[필수] 직급을 선택해주세요");
	                } else {
		                if (!/\d+$/.test(vo.selectedRank.CD_DEF)) {
			                return edt.invalidFocus("userPosition", "[형식] 직급은 유효하지 않은 형식입니다.");
		                }
	                }

	                // 직군
	                if (!vo.selectedWorkgroup.CD_DEF) {
		                return edt.invalidFocus("userWork", "[필수] 직군을 선택해주세요");
	                } else {
		                if (!/\d+$/.test(vo.selectedWorkgroup.CD_DEF)) {
			                return edt.invalidFocus("userWork", "[형식] 직군은 유효하지 않은 형식입니다.");
		                }
	                }

	                // 권한
	                if (!data.NO_ATRT) {
		                return edt.invalidFocus("userAuth", "[필수] 권한을 선택해주세요");
	                } else {
		                if (!/\d+$/.test(data.NO_ATRT)) {
			                return edt.invalidFocus("userAuth", "[형식] 권한은 유효하지 않은 형식입니다.");
		                }
	                }

	                // PHONE
	                if (data.NO_CEPH && !/(^0\d{1,2}-[1-9]\d{2,3}-\d{4}$|^\d{3,4}-\d{4}$)/.test(data.NO_CEPH)) {
		                return edt.invalidFocus("userPhone", "[형식] PHONE은 유효하지 않은 형식입니다.(ex-\"010-4233-2211\")");
	                }

	                // EMAIL
	                if (data.email.email1 || data.email.email2) {
						if (!/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/.test(data.email.email1 +"@"+ data.email.email2)) {
							return edt.invalidFocus("userEmail", "[형식] 이메일은 유효하지 않은 형식입니다.");
						}
	                }

                    // 퇴사일자
                    if (vo.kind === "detail") {
	                    if (data.CD_EMPSTAT === "002") {
		                    if (!data.DT_RESI) {
			                    return edt.invalidFocus("userRetired", "[필수] 퇴사일자를 입력해주세요.");
		                    }
	                    }

	                    if (data.DT_RESI) {
		                    if (!moment(data.DT_RESI, "YYYY-MM-DD", true).isValid()) {
			                    return edt.invalidFocus("userRetired", "[형식] 퇴사일자는 유효하지 않은 형식입니다.(ex-\"2014-11-18\")");
		                    } else {
			                    if (data.CD_EMPSTAT !== "002") {
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
                        pass1   = vo.param.DC_PWD || "",
                        pass2   = vo.confirmDC_PWD || "",
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
                

                vo.init();
            }]);
}());
