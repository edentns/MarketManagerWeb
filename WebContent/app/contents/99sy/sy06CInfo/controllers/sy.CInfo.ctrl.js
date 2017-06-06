(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.CInfo.controller : sy.CInfoCtrl
     * 회사정보관리
     */
    angular.module("sy.CInfo.controller")
        .controller("sy.CInfoCtrl", ["$scope", "$http", "$q", "$log", "sy.CInfoSvc", "APP_CODE", "$timeout", "resData", "Page", "sy.CodeSvc", "UtilSvc",
            function ($scope, $http, $q, $log, syCInfoSvc, APP_CODE, $timeout, resData, Page, SyCodeSvc, UtilSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            
	            var vo = $scope.syCinfoVO = {
	            		boxTitleCom : "회사정보",
	            		boxTitleAS  : "A/S정보",
	            		boxTitleWaho: "창고정보",
	                    param: {
	                    	NM_C            : "",       // 회사명
	                        NM_RPSTT		: "",		// 사원아이디
	                        CD_BSNSCLFT   	: "999",	// 사업자구분
	                        NO_BSNSRGTT		: "",		// 사업자등록번호 
	                        YN_COMMSALEREG	: "N",		// 통신판매신고번호
	                        NO_CORPRGTT     : "",       // 법인등록번호
	                        NM_BSCDT		: "",		// 업태
	                        NM_TYBU 		: "",		// 업종
	                        NO_POST   		: "",		// 우편번호
	                        DC_NEWADDR  	: "",	    // 도로명주소
	                        DC_OLDADDR		: "",		// 지번주소
	                        DC_DETADDR		: "",		// 상세주소
	                        CD_DMSTFECTSHP  : "001",    // 국내/해외배송
	                        NO_PHNE     	: "",		// 전화번호
	                        NO_FAX			: "",		// 팩스번호
	                        DC_HOPAURL 		: "",		// 홈페이지 URL
	                        						    // 파일2개 ( 사업자등록증, 통신판매업신고증 )
	                        NO_ASPHNE   	: "",       // A/S전화번호
	                        CD_AS      		: "",       // A/S안내  
	                        
	                        DC_REPREMI		: { disabled: false, email1: "", email2: "", selectedDomain: ""}		// 대표이메일 
	                    },
	                    wParam : {
	                    	CD_WAHODFT      : "",       // 창고유형
	                        NM_WAHO    		: "",       // 창고명
	                        CD_PARS     	: "",       // 택배사
	                        NO_POST   		: "",		// 우편번호
	                        DC_NEWADDR  	: "",	    // 도로명주소
	                        DC_OLDADDR		: "",		// 지번주소
	                        DC_DETADDR		: "",		// 상세주소
	                    },
	                    bsnCodeList		    : [],		// 사업자구분코드리스트
	                    emiCodeList    		: [],		// 도메인코드리스트
	                    dmstCodeList        : [],       // 국내/해외배송
	                    asCodeList			: [],		// A/S코드리스트
	                    wahoCodeList		: [],		// 창고구분코드리스트
	                    parsCodeList		: [],       // 택배사코드리스트
	                    today				: new Date(),
	                    superiorNm			: "",
	                    confirmDC_PWD		: "",
	                    checkMsg			: "비밀번호를 입력해주세요.(6자리이상 ~ 15자리이하)"
	                };
	                vo.init = function () {// 초기 로드된다.
	                	var param = {
	                		procedureParam: "USP_SY_06CInfo01_GET"
	                	};
	                	// 라디오 버튼 동적생성
	                	$q.all([
		                        SyCodeSvc.getSubcodeList({cd: "SY_000004", search: "all"}).then(function (result) { //사업자구분
		                            return result.data;
		                        }),
		                        SyCodeSvc.getSubcodeList({cd: "SY_000024", search: "all"}).then(function (result) { //도메인
		                            return result.data;
		                        }),
		                        SyCodeSvc.getSubcodeList({cd: "SA_000003", search: "all"}).then(function (result) { //국내/해외배송
		                            return result.data;
		                        }),
		                        SyCodeSvc.getSubcodeList({cd: "SY_000021", search: "all"}).then(function (result) { //A/S안내
		                            return result.data;
		                        }),
		                        SyCodeSvc.getSubcodeList({cd: "SY_000013", search: "all"}).then(function (result) { //창고구분
		                            return result.data;
		                        }),
		                        SyCodeSvc.getSubcodeList({cd: "SY_000022", search: "all"}).then(function (result) { //택배사
		                            return result.data;
		                        }),
		                        UtilSvc.getList(param).then(function (result) {  //해당 회사
		                            return result.data.results[0][0];
		                        })
		                    ]).then(function (result) {
		                        vo.bsnCodeList 		= result[0];
		                        vo.emiCodeList      = result[1];
		                        vo.dmstCodeList		= result[2];
		                        vo.asCodeList       = result[3];
		                        vo.wahoCodeList		= result[4];
		                        vo.parsCodeList		= result[5];
		                        vo.param 			= result[6];
		                        
		                        
		                        
		                        /*var div ="<div>";
		                		for( var i=0 ; i < vo.bsnCodeList.length ; i++ ){
		                			div += "<input type='radio' name='bsnRaBtn' ng-model='$scope.param.CD_BSNSCLFT' ng-value='"+vo.bsnCodeList[i].CD_DEF+"'/><label>"+vo.bsnCodeList[i].NM_DEF+"</label>";
		                		}
		                		div += "</div>";
		                        $('.bsnRaBtn').append(div);
		                        $('input[name="bsnRaBtn"]').eq(4).prop('checked', true);
		                        
		                        div = "";
		                        for( var i=0 ; i < vo.dmstCodeList.length ; i++ ){
		                			div += "<input type='radio' name='dmstRaBtn' ng-model='syCinfoVO.param.CD_DMSTFECTSHP' ng-value='"+vo.dmstCodeList[i].CD_DEF+"'/><label>"+vo.dmstCodeList[i].NM_DEF+"</label>";
		                		}
		                		div += "</div>";
		                        $('.dmstRaBtn').append(div);
		                        $('input[name="dmstRaBtn"]').eq(0).prop('checked', true);*/
		                    });
	                	
	                	
	                	
	                };
	                // insert, update에 사용되는 param을 생성하여 리턴한다.
	                vo.makeGetParam = function () {
	                    var param = {
	                    	NO_EMP      : "",
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
	                        DTS_SMS     : "",
	                        YN_EMI      : vo.param.YN_EMI,
	                        DTS_EMI     : "",
	                        DT_RESI     : "",
	                    };
	                    if (vo.kind==="detail") {
	                    	param.NO_EMP      =  vo.ids;
	                        param.CD_EMPSTAT  =  vo.param.CD_EMPSTAT;
	                        param.DT_RESI 	  =  edt.isValid( vo.param.DT_RESI ) ? vo.param.DT_RESI : null;
	                        param.DTS_SMS     =  vo.param.YN_SMS == "Y" ? vo.param.DTS_SMS : null;
	                        param.DTS_EMI     =  vo.param.YN_EMI == "Y" ? vo.param.DTS_EMI : null;
	                    }

	                    return param;
	                };
	                // insert 처음로드시 실행된다.
	                vo.initInsert = function () {
	                	var param = {
	                            procedureParam: "USP_SY_08ATRT01_GET"
	                        };
	                    
	                };
	                // update, detail 처음 로드시 실행된다.
	                vo.initUpdate = function () {
		                var split,
		                    param = {
	                            procedureParam: "USP_SY_08ATRT01_GET"
	                        },
	                        empParam = {
		                		procedureParam: "USP_SY_07USER02_GET&L_NO_CHECK_EMP@s",
		                		L_NO_CHECK_EMP : vo.ids
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
	                        }),
	                        UtilSvc.getList(empParam).then(function (result) {
	                            return result.data.results[0][0];
	                        })
	                    ]).then(function (result) {
	                    	vo.departCodeList 		= result[0];
	                        vo.rankCodeList 	    = result[1];
	                        vo.workgroupCodeList 	= result[2];
	                        vo.roleCodeList 		= result[3];

	                        vo.param 				= result[4];
	                        vo.param.DC_PWD		    = "";

	                        if (vo.param.DC_EMIADDR) {
		                        split = vo.param.DC_EMIADDR.split("@");
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

	                    angular.forEach(vo.rankCodeList, function (data) {
	                        if (data.CD_DEF === vo.param.CD_RANK) {
	                            vo.selectedRank = data;
	                        }
	                    });

	                    angular.forEach(vo.workgroupCodeList, function (data) {
	                        if (data.CD_DEF === vo.param.CD_OCC) {
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
	                            });
	                        }
	                    }
	                };
	                vo.changeEmailDomain = function () {// 이메일 도메인이 변경되었을때 동작을 처리한다.
	                    var value = vo.param.DC_REPREMI.selectedDomain;
	                    if (value === "" || value == null) {
	                        vo.param.DC_REPREMI.disabled	= false;
	                        vo.param.DC_REPREMI.email2 = "";
	                    } else {
	                        vo.param.DC_REPREMI.disabled	= true;
	                        vo.param.DC_REPREMI.email2 = value;
	                    }
	                };
	                vo.CommsaleChange = function() {
	                	var value = vo.param.YN_COMMSALEREG;
						if(value=="Y"){
							angular.element("#userNO_COMMSALEREG").attr("readonly", false);
						}else {
							vo.param.NO_COMMSALEREG="";
							angular.element("#userNO_COMMSALEREG").attr("readonly", true);
						}
					};
					
					
					var gridWahoVO = $scope.gridWahoVO = {
	                    messages: {
	                        noRows: "ERP 사용자정보가 존재하지 않습니다.",
	                        loading: "ERP 사용자정보를 가져오는 중...",
	                        requestFailed: "요청 ERP 사용자정보를 가져오는 중 오류가 발생하였습니다.",
	                        retry: "갱신",
	                        commands: {
	                        	create:'추가', cancel:'취소'
	                        }
	                    },
						edit: function (e) {
							var self = this;
							if (e.model.isNew()) {
								e.model.set("NM_WAHO", vo.wParam.NM_WAHO);
								e.model.set("DC_NEWADDR", vo.wParam.DC_NEWADDR);
								e.model.set("DC_OLDADDR", vo.wParam.DC_OLDADDR);
								e.model.set("CD_PARS", vo.wParam.CD_PARS);
		                    }
	            		},
	            		isValid : function (param) {
			                 var data = param;
			                 if(!data.CD_WAHODFT){
			                	 return edt.invalidFocus("userCD_WAHODFT", "[형식] 창고유형은 유효하지 않은 형식입니다.");
			                 }
			                 
			                 if(!data.NM_WAHO){
			                	 return edt.invalidFocus("userNM_WAHO", "[형식] 창고명은 유효하지 않은 형식입니다.");
			                 }
			                 
			                 if(!data.CD_PARS){
			                	 return edt.invalidFocus("userCD_PARS", "[형식] 택배사는 유효하지 않은 형식입니다.");
			                 }
			                 
			                 if(!data.NO_POST){
			                	 return edt.invalidFocus("userW_NO_POST", "[형식] 우편번호는 유효하지 않은 형식입니다.");
			                 }
			                 
			                 if(!data.DC_DETADDR){
			                	 return edt.invalidFocus("userW_DC_DETADDR", "[형식] 상세주소는 유효하지 않은 형식입니다.");
			                 }
			                 

		                    return true;
		                },
	                	dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	                				var param = {
	                                	procedureParam:"USP_SY_06CInfo02_GET"
	                                };
	            					UtilSvc.getList(param).then(function (res) {
	            						e.success(res.data.results[0]);
	            					});
	                			},
		                		create: function(e) {
		                			var defer = $q.defer();
		                			var param = {
	                                	procedureParam:"BX.GW_SPENDING_RESOLUTIONS_01I&USE_EMP_NM@s|CTD_CD@s|CTD_NM@s|PRI_CUST_CD@s|PUB_CUST_CD@s|PUB_CUST_NM@s",
	                                	data: e.data.models
	                                };
	            					UtilSvc.getGWExec(param).then(function (res) {
	            						defer.resolve();
	            						$scope.gridErpUserVO.dataSource.read();
	            					});
		                			return defer.promise;
		            			},
	                			update: function(e) {
	                				var defer = $q.defer();
		                			var param = {
	                                	procedureParam:"BX.GW_SPENDING_RESOLUTIONS_01U&USE_EMP_NM@s|CTD_CD@s|CTD_NM@s|PRI_CUST_CD@s|PUB_CUST_CD@s|PUB_CUST_NM@s",
	                                	data: e.data.models
	                                };
	            					UtilSvc.getGWExec(param).then(function (res) {
	            						defer.resolve();
	            						$scope.gridErpUserVO.dataSource.read();
	            					});
		                			return defer.promise;
	                			},
	                			destroy: function(e) {
	                				var defer = $q.defer();
		                			var param = {
	                                	procedureParam:"BX.GW_SPENDING_RESOLUTIONS_01D&USE_EMP_NM@s",
	                                	data: e.data.models
	                                };
	            					UtilSvc.getGWExec(param).then(function (res) {
	            						defer.resolve();
	            						$scope.gridErpUserVO.dataSource.read();
	            					});
		                			return defer.promise;
	                			},
	                			parameterMap: function(e, operation) {
	                				if(operation !== "read" && e.models) {
	                					return {models:kendo.stringify(e.models)};
	                				}
	                			}
	                		},
	                		batch: true,
	                		schema: {
	                			model: {
	                    			id: "NO_WAHO",
	                				fields: {
	                					NO_WAHO: {editable: false},
	                					NM_WAHO: {validation: {required: true}},
	                					NO_POST: {},
	                					DC_NEWADDR: {},
	                					DC_OLDADDR: {},
	                					CD_PARS: {},
	                					ITEM1:  {editable: false},
	                					ITEM2:  {editable: false}
	                				}
	                			}
	                		}
	                	}),
	                	navigatable: true,
	                	toolbar: 
	                		[
	                         { template: "<input type='button' class='k-button' value='추가' ng-click='gridWahoVO.add()'/>"},"create", "cancel"],
	                	columns: [
	                	       {field: "ROW_NUM",   title: "No",      width: 100, template: "<span class='row-number'></span>"},
	        		           {field: "NO_WAHO",   title: "번호",     width: 100, hidden:true},
	        		           {field: "NM_WAHO",   title: "창고명",    width: 150},
	        		           {field: "DC_NEWADDR",  title: "주소(도로명)", width: 200},
	        		           {field: "DC_OLDADDR",  title: "주소(지번)", width: 150},
	        		           {field: "CD_PARS",     title: "택배사", width: 150, template: 
           		        		'#if (CD_PARS == "001") {# #="우체국택배"# #}' +
   		        	   	        'else if (CD_PARS == "002") {# #="CJ대한통운"# #}'+
        		        	   	'else if (CD_PARS == "003") {# #="롯데택배"# #}'+
   		        		        'else {# #="기타"# #} #',},
	        		           {field: "ITEM1",     title: "상품1", width: 150},
	        		           {field: "ITEM2",     title: "상품2", width: 150},
	        		           {command: [ "destroy" ]}
	                	],
	                    collapse: function(e) {
	                        // console.log(e.sender);
	                        this.cancelRow();
	                    },
	                	editable: true,
	                	height: 300,
	                	dataBound: function () {
	                        var rows = this.items();
	                        $(rows).each(function () {
	                            var index = $(this).index() + 1;
	                            var rowLabel = $(this).find(".row-number");
	                            $(rowLabel).html(index);
	                        });
	                    },
	                    add: function() {
	                    	var grid = $("#grid").data("kendoGrid");
	                    	if(gridWahoVO.isValid(vo.wParam)){
	                    		grid.addRow();
	                    		
	                    	}
	                        
						}
	                };
					

                vo.init();
            }]);
}());