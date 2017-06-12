(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.CInfo.controller : sy.CInfoCtrl
     * 회사정보관리
     */
    angular.module("sy.CInfo.controller")
        .controller("sy.CInfoCtrl", ["$scope", "$window", "$http", "$q", "$log", "sy.CInfoSvc", "APP_CODE", "$timeout", "resData", "Page", "sy.CodeSvc", "UtilSvc",
            function ($scope, $window, $http, $q, $log, syCInfoSvc, APP_CODE, $timeout, resData, Page, SyCodeSvc, UtilSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            
	            
	            var vo = $scope.syCinfoVO = {
	            		boxTitleCom : "회사정보",
	            		boxTitleAS  : "A/S정보",
	            		boxTitleWaho: "창고정보",
	                    param: {
	                    	NM_C            : "",       // 회사명
	                        NM_RPSTT		: "",		// 대표명
	                        CD_BSNSCLFT   	: "999",	// 사업자구분
	                        NO_BSNSRGTT		: "",		// 사업자등록번호 
	                        YN_COMMSALEREG	: "N",		// 통신판매신고여부
	                        NO_COMMSALEREG  : "",       // 통신판매신고번호
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
	                    checkMsg			: "비밀번호를 입력해주세요.(6자리이상 ~ 15자리이하)",
	                    fileBsnsVO: {
		        			CD_AT:"002",
		        			limitCnt: 1,
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
		        				NO_AT: 1,
		        				NO_C: "",
		        				NO_INSERT: "",
		        				NO_UPDATE: null,
		        				SZ_FILE: "",
		        				YN_DEL: null
		        			}
		        		},
		        		fileCommVO: {
		        			CD_AT:"003",
		        			limitCnt: 1,
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
		        				NO_AT: 0,
		        				NO_C: "",
		        				NO_INSERT: "",
		        				NO_UPDATE: null,
		        				SZ_FILE: "",
		        				YN_DEL: null
		        			}
		        		}
	                };
	                vo.init = function () {// 초기 로드된다.
	                	var param = {
	                		procedureParam: "USP_SY_06CInfo01_GET"
	                	};
	                	vo.fileBsnsVO.currentData = resData.fileBsnsVOcurrentData;
                        vo.fileCommVO.currentData = resData.fileCommVOcurrentData;
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
		                        
		                        if (vo.param.DC_REPREMI) {
			                        var split = vo.param.DC_REPREMI.split("@");
		                            vo.param.DC_REPREMI = {
		                                email1: split[0],
		                                email2: split[1]
		                            };
		                        } else {
		                            vo.param.email = {email1: "", email2: ""};
		                        }
		                        vo.CommsaleChange();
		                    });
	                	
	                };
	                // insert, update에 사용되는 param을 생성하여 리턴한다.
	                vo.makeGetParam = function () {
	                    var param = {
	                    	NM_C      		: vo.param.NM_C,
	                    	NM_RPSTT		: vo.param.NM_RPSTT,
	                    	CD_BSNSCLFT		: vo.param.CD_BSNSCLFT,
	                    	NO_BSNSRGTT		: vo.param.NO_BSNSRGTT,
	                    	YN_COMMSALEREG	: vo.param.YN_COMMSALEREG,
	                    	NO_COMMSALEREG  : vo.param.NO_COMMSALEREG,
	                    	NO_CORPRGTT		: vo.param.NO_CORPRGTT,
	                    	NM_BSCDT  		: vo.param.NM_BSCDT,
	                    	NM_TYBU			: vo.param.NM_TYBU,
	                    	NO_POST			: vo.param.NO_POST,
	                    	DC_NEWADDR		: vo.param.DC_NEWADDR,
	                    	DC_OLDADDR		: vo.param.DC_OLDADDR,
	                    	DC_DETADDR		: vo.param.DC_DETADDR,
	                    	CD_DMSTFECTSHP	: vo.param.CD_DMSTFECTSHP,
	                    	NO_PHNE			: vo.param.NO_PHNE,
	                    	NO_FAX			: vo.param.NO_FAX,
	                    	DC_HOPAURL		: vo.param.DC_HOPAURL,
	                    	NO_ASPHNE		: vo.param.NO_ASPHNE,
	                    	CD_AS			: vo.param.CD_AS,
	                    	DC_REPREMI		: ( !vo.param.DC_REPREMI.email1=="" || !vo.param.DC_REPREMI.email2=="" ) ? vo.param.DC_REPREMI.email1 +"@"+ vo.param.DC_REPREMI.email2 : null,

	                    };
	                    return param;
	                };
	                //저장버튼 눌럿을시 실행
	                vo.doSave = function() {
	                	if (confirm("저장하시겠습니까?")) {
	                        var param = vo.makeGetParam();
	                        if (vo.isValid(param)) {
	                        	syCInfoSvc.saveCInfo(param).success(function () {
	                        		var a = $("#grid").data("kendoGrid");
	        	                	a.dataSource.sync();
	        	                	vo.fileSave();
	                        		vo.reload();
	                            });
	                        }
	                    }
					};
					
					vo.reload = function() {
						$window.location.reload();
					};
					
					vo.fileSave = function() {
		        		if(vo.fileBsnsVO.dirty) {
		        			vo.fileBsnsVO.CD_REF1 = 'SYEM00000001';
		        			vo.fileBsnsVO.doUpload(function(){
				        		if(vo.fileCommVO.dirty) {
				        			vo.fileCommVO.CD_REF1 = 'SYEM00000001';
				        			vo.fileCommVO.doUpload(function(){
					        		}, function() {
					        			alert('통신판매업신고증 파일업로드 실패하였습니다.');
					        		});
				        		}
				        		else {
				        		}
			        		}, function() {
			        			alert('사업자등록증 파일업로드 실패하였습니다.');
			        		});
		        		}
		        		else {
		        		}
		        	};

	                // 등록전 유효성을 체크한다.
	                vo.isValid = function (param) {
		                var data = vo.param;

	                    // 회사명
	                    if (!(data.NM_C).trim()) {
		                    return edt.invalidFocus("userNM_C", "[필수] 회사명을 입력해주세요.");
	                    }
	                    
	                    // 대표자명
	                    if (!(data.NM_RPSTT).trim()) {
		                    return edt.invalidFocus("userNM_RPSTT", "[필수] 대표자명을 입력해주세요.");
	                    }
	                    
	                    // 사업자등록번호
	                    if (data.NO_BSNSRGTT && !/^\d{3}-\d{2}-\d{5}$/.test(data.NO_BSNSRGTT)) {
			                return edt.invalidFocus("userNO_BSNSTGTT", "[형식] 사업자등록번호는 유효하지 않은 형식입니다.(ex-\"012-34-56789\")");
		                }
	                    
	                    // 통신판매신고번호
	                    if (data.YN_COMMSALEREG == "Y" && !/^[a-z0-9_]{3}-[a-z0-9_]{2}-[a-z0-9_]{5}$/.test(data.NO_COMMSALEREG)){
	                    	return edt.invalidFocus("userNO_COMMSALEREG", "[형식] 통신판매신고번호는 유효하지 않은 형식입니다.(ex-\"000-00-00000\")");
	                    }

	                    // 전화번호
		                if (data.NO_PHNE && !/^\d{2,3}-\d{3,4}-\d{4}$/.test(data.NO_PHNE)) {
			                return edt.invalidFocus("userNO_PHNE", "[형식] 전화번호은 유효하지 않은 형식입니다.");
		                }

	                    // 홈페이지 url
		                if (data.DC_HOPAURL && !new RegExp("(http|https|ftp|telnet|news|irc)://([-/.a-zA-Z0-9_~#%$?&=:200-377()]+)","gi").test(data.DC_HOPAURL)) {
			                return edt.invalidFocus("userDC_HOPAURL", "[형식] 홈페이지URL은 유효하지 않은 형식입니다.");
		                }

		                // A/S 정보
		                if (data.NO_ASPHNE && !/^\d{2,3}-\d{3,4}-\d{4}$/.test(data.NO_ASPHNE)) {
			                return edt.invalidFocus("userNO_ASPHNE", "[형식] A/S전화번호는 유효하지 않은 형식입니다.");
		                }

		                // EMAIL
		                if (data.DC_REPREMI.email1 || data.DC_REPREMI.email2) {
							if (!/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/.test(data.DC_REPREMI.email1 +"@"+ data.DC_REPREMI.email2)) {
								return edt.invalidFocus("userEmail", "[형식] 이메일은 유효하지 않은 형식입니다.");
							}
		                }

	                    return true;
	                };
	                vo.doInsert = function () {// 유저를 등록한다.
	                    if (confirm(APP_MSG.insert.confirm)) {
	                        var param = vo.makeGetParam("insert");
	                        if (vo.isValid(param)) {
	                        	syCInfoSvc.saveCInfo(param).success(function () {
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
							if (e.model.isNew()) {
								if(e.model.DC_NEWADDR == ""){
								e.model.set("NM_WAHO", vo.wParam.NM_WAHO);
								e.model.set("DC_NEWADDR", vo.wParam.DC_NEWADDR);
								e.model.set("DC_OLDADDR", vo.wParam.DC_OLDADDR);
								e.model.set("CD_PARS", vo.wParam.CD_PARS);
								e.model.set("ROW_NUM", "1");
								e.model.set("CD_WAHODFT", vo.wParam.CD_WAHODFT);
								vo.wParam.NM_WAHO = "";
								vo.wParam.DC_NEWADDR = "";
								vo.wParam.DC_OLDADDR = "";
								vo.wParam.DC_DETADDR = "";
								vo.wParam.CD_PARS = "";
								vo.wParam.NM_WAHO = "";
								vo.wParam.CD_WAHODFT = "";
								vo.wParam.NO_POST = "";
								}
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
	                				var param = [];
	                				param.push(e.data);
	                				syCInfoSvc.saveWaho(param, "I").success(function () {
		                            });
	                	        },
	                			update: function(e) {
	                				var param = [];
	                				param.push(e.data);
	                				syCInfoSvc.saveWaho(param, "U").success(function () {
		                            });
	                			},
	                			destroy: function(e) {
	                				var param = [];
	                				param.push(e.data);
	                				var defer = $q.defer();
	                				syCInfoSvc.saveWaho(param, "D").success(function () {
	            						defer.resolve();
	                                });
	                    			return defer.promise;
	                			},
	                			parameterMap: function(e, operation) {
	                				if(operation !== "read" && e.models) {
	                					return {models:kendo.stringify(e.models)};
	                				}
	                			}
	                		},/*
	                		batch: true,*/
	                		schema: {
	                			model: {
	                    			id: "NO_WAHO",
	                				fields: {
	                					ROW_NUM: {editable: false},
	                					NO_WAHO: {editable: false},
	                					NM_WAHO: {},
	                					NO_POST: {validation: {required: true}},
	                					DC_NEWADDR: {validation: {required: true}},
	                					DC_OLDADDR: {},
	                					CD_PARS: {},
	                					ITEM1:  {editable: false},
	                					ITEM2:  {editable: false},
	                					CD_WAHODFT : {}
	                				}
	                			}
	                		}
	                	}),
	                	navigatable: true,
	                	toolbar: 
	                		[
	                         { template: "<input type='button' class='k-button' value='추가' ng-click='gridWahoVO.add()'/>"},
	                         "cancel"],
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
   		        		        'else {# #="기타"# #} #', editor: DropDownEditor},
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
	                    requestStart: function(e) {
	                        var response = e.response;
	                        var type = e.type;
	                        console.log(type); // displays "read"
	                        console.log(response.length); // displays "77"
	                    },
	                    add: function() {
	                    	var grid = $("#grid").data("kendoGrid");
	                    	if(gridWahoVO.isValid(vo.wParam)){
	                    		grid.addRow();
	                    	}
	                        
						}
	                };
					
					function DropDownEditor(container, options) {
	            		$('<input data-text-field="NM_DEF" data-bind="value:' + options.field + '"/>')
	                        .appendTo(container)
	                        .kendoDropDownList({
	                        	dataTextField: 'NM_DEF',
	                            dataValueField: 'CD_DEF',
	                            dataSource: vo.parsCodeList
	                        });
	                }		
                vo.init();
            }]);
}());