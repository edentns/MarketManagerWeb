(function () {
    'use strict';

    var edtApp = angular.module('edtApp');

    edtApp.constant('APP_CONFIG', {
        bsCd    : '00000',
		domain  : '/MarketManagerServer', // 운영
        version : 'V 0.1.0',
        encrypt : false
    });

    edtApp.constant('APP_CODE', {
        header 		: { cd: 'codeitem',   name: '코드헤더' },
        user   		: { cd: 'usercode',   name: '유저코드' },
        system 		: { cd: 'sycode', 	  name: '시스템코드' },
        business	: { cd: 'BU_0000001', name: '사업' },
        product     : { cd: 'BU_0000002', name: '제품' },
        collect		: { cd: 'BU_0000005', name: '수금상태' },
        orderStatus	: { cd: 'BU_0000004', name: '사업상태' },
        distibution	: { cd: 'BU_0000003', name: '매출/마진 분배' },
		vendor      : { cd: 'BU_0000008', name: '벤더사' },
		totdist     : { cd: 'BU_0000011', name: '분배종류' },
        position	: { cd: 'SY_0000001', name: '직급' },
        role		: { cd: 'SY_0000008', name: '권한' },
        workgroup	: { cd: 'SY_0000003', name: '직군' },
		yn          : { cd: 'SY_0000006', name: '여부' },
        eqmTp   	: { cd: 'EQ_0000001', name: '장비유형' },
		procStat    : { cd: 'SV_0000001', name: '처리상태' },
		recWay      : { cd: 'SV_0000002', name: '접수방법' },
		servTp      : { cd: 'SV_0000003', name: '서비스유형' },
		obsSron     : { cd: 'SV_0000004', name: '장애심각도' },
		obsSep      : { cd: 'SV_0000005', name: '장애구분' },
        eqmItdFrm   : { cd: 'SV_0000006', name: '장비도입형태' },
		ctrStpDays  : { cd: 'SV_0000007', name: '계약설정일자' },
		plnStat     : { cd: 'SV_0000008', name: '계획상태' },
		procRptWay  : { cd: 'SV_0000009', name: '처리후보고방식' },
        pfmStat  : { cd: 'SV_0000010', name: '수행상태' }
    });

    edtApp.constant('APP_MSG', {
        insert  : {confirm: '등록하시겠습니까?', success: '등록되었습니다.', error: '등록에 실패하였습니다.'},
        update  : {confirm: '수정하시겠습니까?', success: '수정되었습니다.', error: '수정에 실패하였습니다.'},
        delete  : {confirm: '삭제하시겠습니까?', success: '삭제되었습니다.', error: '삭제에 실패하였습니다.'},
        save    : {confirm: '저장하시겠습니까?', success: '저장되었습니다.', error: '저장에 실패하였습니다.'},
        cancel  : '취소하시겠습니까?',
        valid	: {
            name  : {space: '이름을 입력해주세요.',	 pattern: '한글과 영어, 공백 조합만 가능합니다.'},
            dept  : {space: '부서를 입력해주세요.',	 pattern: '한글과 영어, 숫자, 공백 조합만 가능합니다.'},
            pos	  : {space: '직급을 입력해주세요.',	 pattern: '한글과 영어, 숫자, 공백 조합만 가능합니다.'},
            phone : {space: '번호를 입력해주세요.',	 pattern: '번호형식이 맞지않습니다.(000-0000-0000)'},
            email : {space: '이메일 을 입력해주세요.',	 pattern: '이메일 형식이 맞지않습니다.'},
            addr1 : {space: '기본주소를 입력해주세요.',	 pattern: '한글+영어+숫자+\'@\'+\'-\'+공백 조합만 가능합니다.'},
            addr2 : {space: '상세주소를 입력해주세요.',	 pattern: '한글+영어+숫자+\'@\'+\'-\'+공백 조합만 가능합니다.'},
            company		 : {space: '고객사명을 입력해주세요.',	 pattern: ''},
            salesCompany : {space: '매출처명을 입력해주세요.',	 pattern: ''}
        }
    });

	edtApp.constant('APP_AUTH', {
		ALL         : 'all',        // 전체
		MANAGER     : 'manager',    // 내부서 + 하위부서
		TEAM        : 'team',       // 내부서
		INDIVIDUAL  : 'individual'  // 나
	});
	
	
	edtApp.constant('APP_SA_MODEL', {
		ROW_CHK       : { field: "ROW_CHK"       , type: "boolean", width: "30px" , textAlign: "center", title: "선<br/>택"},
	    NO_ORD        : { field: "NO_ORD"        , type: "string" , width: "100px", textAlign: "center", title: "관리번호"},                                        
	    NO_APVL       : { field: "NO_APVL"       , type: "string" , width: "100px", textAlign: "left"  , title: "결제번호"},
	    NM_MRK        : { field: "NM_MRK"        , type: "string" , width: "100px", textAlign: "center", title: "마켓명"},
	    NO_MRKORD     : { field: "NO_MRKORD"     , type: "string" , width: "100px", textAlign: "center", title: "주문번호"},
	    NO_MRKITEMORD : { field: "NO_MRKITEMORD" , type: "string" , width: "100px", textAlign: "center", title: "상품주문번호"},
	    
	    NO_MRK        : { field: "NO_MRK"        , type: "string" , width: "100px", textAlign: "center"},                        
	    NO_MNGMRK     : { field: "NO_MNGMRK"     , type: "string" , width: "100px", textAlign: "center"},
	    NO_MRKITEM    : { field: "NO_MRKITEM"    , type: "string" , width: "100px", textAlign: "center", title: "마켓상품번호"},
	    NO_MRKREGITEM : { field: "NO_MRKREGITEM" , type: "string" , width: "100px", textAlign: "center", title: "상품번호"},                                                           
	    NM_MRKITEM    : { field: "NM_MRKITEM"    , type: "string" , width: "100px", textAlign: "center", title: "상품명"},
	    NM_MRKOPT     : { field: "NM_MRKOPT"     , type: "string" , width: "100px", textAlign: "left"  , title: "옵션(상품구성)"},
	    
	    AM_ORDSALEPRC : { field: "AM_ORDSALEPRC" , type: "number" , width: "100px", textAlign: "right" , title: "판매가"},                                        
	    AM_PCHSPRC    : { field: "AM_PCHSPRC"    , type: "number" , width: "100px", textAlign: "right" , title: "구입가"},
	    NM_PCHR       : { field: "NM_PCHR"       , type: "string" , width: "100px", textAlign: "center", title: "구매자"},
	    NM_CONS       : { field: "NM_CONS"       , type: "string" , width: "100px", textAlign: "center", title: "수취인"},
	    NO_PCHRPHNE   : { field: "NO_PCHRPHNE"   , type: "string" , width: "100px", textAlign: "center", title: "전화번호"},
	    
	    NO_CONSHDPH   : { field: "NO_CONSHDPH"   , type: "string" , width: "100px", textAlign: "center", title: "전화번호"},
	    DC_PCHREMI    : { field: "DC_PCHREMI"    , type: "string" , width: "100px", textAlign: "left"  , title: "이메일"},    
	    NO_CONSPOST   : { field: "NO_CONSPOST"   , type: "string" , width: "100px", textAlign: "center"},                   
	    DC_CONSNEWADDR: { field: "DC_CONSNEWADDR", type: "string" , width: "100px", textAlign: "left"  , title: "수취인주소"},    
	    DC_PCHRREQCTT : { field: "DC_PCHRREQCTT" , type: "string" , width: "100px", textAlign: "left"  , title: "요청내용"},
	    
	    CD_ORDSTAT    : { field: "CD_ORDSTAT"    , type: "string" , width: "100px", textAlign: "center", title: "주문상태"},    
	    DC_SHPWAY     : { field: "DC_SHPWAY"     , type: "string" , width: "100px", textAlign: "center", title: "배송방법"},    
	    QT_ORD        : { field: "QT_ORD"        , type: "number" , width: "100px", textAlign: "right" , title: "주문수량"},
	    DTS_APVL      : { field: "DTS_APVL"      , type: "string" , width: "100px", textAlign: "center", title: "결제일시"},
	    
	    DTS_ORD       : { field: "DTS_ORD"       , type: "string" , width: "100px", textAlign: "center", title: "주문일시"},
	    YN_CONN       : { field: "YN_CONN"       , type: "string" , width: "100px", textAlign: "center", title: "연동구분"},    
	    DTS_ORDDTRM   : { field: "DTS_ORDDTRM"   , type: "string" , width: "100px", textAlign: "center", title: "주문확정일시"},   
	    AM_ITEMPRC    : { field: "AM_ITEMPRC"    , type: "number" , width: "100px", textAlign: "right" , title: "주문상품단가"},
	    AM_CUSTOM_SALES  : { field: "AM_CUSTOM_SALES"   , type: "number" , width: "100px", textAlign: "right" , title: "판매가 ＋ 배송비 －수수료"},
	    AM_CMS	         : { field: "AM_CMS"         	, type: "number" , width: "100px", textAlign: "right" , title: "수수료"},
	    
	    AM_SHPCOST    : { field: "AM_SHPCOST"    , type: "number" , width: "100px", textAlign: "right" , title: "배송비"},                   
	    CD_CCLHRNKRSN : { field: "CD_CCLHRNKRSN" , type: "string" , width: "100px", textAlign: "left"  },
	    NM_CCLHRNKRSN : { field: "NM_CCLHRNKRSN" , type: "string" , width: "100px", textAlign: "center", title: "취소사유"},
	    QT_CCL        : { field: "QT_CCL"        , type: "number" , width: "100px", textAlign: "right" , title: "취소수량"},
	    DC_CCLCTT     : { field: "DC_CCLCTT"     , type: "string" , width: "100px", textAlign: "left"  },
	    
	    DC_APVLWAY    : { field: "DC_APVLWAY"    , type: "string" , width: "100px", textAlign: "left"  , title: "결제방법"},
	    NO_UPDATE     : { field: "NO_UPDATE"     , type: "string" , width: "100px", textAlign: "center", title: "접수확인자"},
        DTS_CCLREQ    : { field: "DTS_CCLREQ"    , type: "string" , width: "100px", textAlign: "center", title: "취소요청일시"},
        NO_CCLREQ     : { field: "NO_CCLREQ"     , type: "string" , width: "100px", textAlign: "center", title: ""},
        DTS_CCLAPPRRJT: { field: "DTS_CCLAPPRRJT", type: "string" , width: "100px", textAlign: "center", title: "취소 확인일시"},
        CD_CCLSTAT    : { field: "CD_CCLSTAT"    , type: "string" , width: "100px", textAlign: "center", title: "취소상태"},
        
        CD_CCLRJT     : { field: "CD_CCLRJT"     , type: "string" , width: "100px", textAlign: "center"},
        DC_CCLRJTCTT  : { field: "DC_CCLRJTCTT"  , type: "string" , width: "100px", textAlign: "left"  },
        ITF_CHK       : { field: "ITF_CHK"       , type: "string" , width: "100px", textAlign: "center", title: "전송상태"},
        DT_SND        : { field: "DT_SND"        , type: "string" , width: "100px", textAlign: "center", title: "배송일자"},
        CD_SHPSTAT    : { field: "CD_SHPSTAT"    , type: "string" , width: "100px", textAlign: "center", title: "배송상태"},
        
        CD_SHPDLY     : { field: "CD_SHPDLY"     , type: "string" , width: "100px", textAlign: "center"},
        DC_SHPDLYRSN  : { field: "DC_SHPDLYRSN"  , type: "string" , width: "100px", textAlign: "center"},
        DC_CONSOLDADDR: { field: "DC_CONSOLDADDR", type: "string" , width: "100px", textAlign: "left"  , title: "주소2"},
        CD_PARS       : { field: "CD_PARS"       , type: "string" , width: "100px", textAlign: "center", title: "택배사"},
        NO_INVO       : { field: "NO_INVO"       , type: "string" , width: "100px", textAlign: "center", title: "송장번호"},
        
        CD_TKBKRSN    : { field: "CD_TKBKRSN"    , type: "string" , width: "100px", textAlign: "center", title: "반품사유"},
        DTS_TKBKREQ   : { field: "DTS_TKBKREQ"   , type: "string" , width: "100px", textAlign: "center", title: "반품요청일시"},
        DTS_TKBKAPPRRJT: { field: "DTS_TKBKAPPRRJT"   , type: "string" , width: "100px", textAlign: "center", title: "반품처리일시"},
        NO_TKBKAPPRRJT: { field: "NO_TKBKAPPRRJT"   , type: "string" , width: "100px", textAlign: "center", title: "반품처리자"},
        NO_TKBKCPLT   : { field: "NO_TKBKCPLT"   , type: "string" , width: "100px", textAlign: "center", title: "반납상품접수확인자"},
        QT_TKBK       : { field: "QT_TKBK"       , type: "string" , width: "100px", textAlign: "right" , title: "반품수량"},
        
        NO_INSERT     : { field: "NO_INSERT"     , type: "string" , width: "100px", textAlign: "center", title: ""},
        CD_TKBKSTAT   : { field: "CD_TKBKSTAT"   , type: "string" , width: "100px", textAlign: "center", title: "반품상태"},
        NO_TKBKREQ    : { field: "NO_TKBKREQ"    , type: "string" , width: "100px", textAlign: "center", title: ""},
        requesteNo    : { field: "requesteNo"    , type: "string" , width: "100px", textAlign: "center", title: ""},
        mall_no       : { field: "mall_no"       , type: "string" , width: "100px", textAlign: "center", title: "결과 전송 유무"},
        
        DC_TKBKRJTCTT : { field: "DC_TKBKRJTCTT" , type: "string" , width: "100px", textAlign: "center", title: ""},
        CD_TKBKRJT    : { field: "CD_TKBKRJT"    , type: "string" , width: "100px", textAlign: "center", title: ""},
        DTS_TKBKCPLT  : { field: "DTS_TKBKCPLT"	 , type: "string" , width: "100px", textAlign: "center", title: "반납상품접수일자"},
        
        QT_ECHG       : { field: "QT_ECHG"       , type: "string" , width: "100px", textAlign: "right" , title: "교환 요청 수량"},
        NO_CONSPHNE   : { field: "NO_CONSPHNE"   , type: "string" , width: "100px", textAlign: "center", title: "수취인 전화번호"},
        DTS_ECHGREQ   : { field: "DTS_ECHGREQ"   , type: "string" , width: "100px", textAlign: "center", title: "교환요청일시"},
        DTS_ECHGAPPRRJT : { field: "DTS_ECHGAPPRRJT", type: "string" , width: "100px", textAlign: "center", title: "교환상품접수일"},
        NO_ECHGAPPRRJT: { field: "NO_ECHGAPPRRJT", type: "string" , width: "100px", textAlign: "center", title: "교환상품접수자"},
        NO_ECHGCPLT   : { field: "NO_ECHGCPLT"   , type: "string" , width: "100px", textAlign: "center", title: "접수확인자"},
        CD_ECHGSTAT   : { field: "CD_ECHGSTAT"   , type: "string" , width: "100px", textAlign: "center", title: "교환상태"},
        NO_ECHGREQ    : { field: "NO_ECHGREQ"    , type: "string" , width: "100px", textAlign: "center", title: ""},
        CD_ECHGRSN    : { field: "CD_ECHGRSN"    , type: "string" , width: "100px", textAlign: "center", title: ""},
        DC_ECHGRSNCTT : { field: "DC_ECHGRSNCTT" , type: "string" , width: "100px", textAlign: "left"  , title: "교환사유"},
        CD_ECHGRJTRSN : { field: "CD_ECHGRJTRSN" , type: "string" , width: "100px", textAlign: "center", title: ""},
        DC_ECHGRJTCTT : { field: "DC_ECHGRJTCTT" , type: "string" , width: "100px", textAlign: "center", title: ""},
        NO_RECE       : { field: "NO_RECE"       , type: "string" , width: "100px", textAlign: "center", title: ""},
        DTS_RECER     : { field: "DTS_RECER"     , type: "string" , width: "100px", textAlign: "center", title: ""},
        NM_PARS       : { field: "NM_PARS"       , type: "string" , width: "100px", textAlign: "center", title: "택배사"},        
        DC_CCLRSNCTT  : { field: "DC_CCLRSNCTT"  , type: "string" , width: "100px", textAlign: "center", title: "주문취소사유"},
        CD_CCLRSN     : { field: "CD_CCLRSN"     , type: "string" , width: "100px", textAlign: "center", title: "주문취소사유코드"},
        AM_TKBKSHP    : { field: "AM_TKBKSHP"    , type: "number" , width: "100px", textAlign: "right" , title: "반품배송비"},        
        CD_PARS_TKBK  : { field: "CD_PARS_TKBK"  , type: "string" , width: "100px", textAlign: "center", title: "반품택배사"},
        NO_INVO_TKBK  		: { field: "NO_INVO_TKBK"  		 , type: "string" , width: "100px", textAlign: "center", title: "반품송장번호"},   
        DTS_TKBKCPLT_VIEW   : { field: "DTS_TKBKCPLT_VIEW"	 , type: "string" , width: "100px", textAlign: "center", title: "반납상품접수일자"},

        ROW_NUM 	  : { field: "ROW_NUM" 		, type: "number" , width: "50px" , textAlign: "right" , title: "번호"},
        NO_C          : { field: "NO_C"       	, type: "string" , width: "100px", textAlign: "center", title: "문의 가입자번호"},
        DC_INQTITLE   : { field: "DC_INQTITLE"  , type: "string" , width: "150px", textAlign: "left"  , title: "문의제목"},                
        DC_INQCTT     : { field: "DC_INQCTT"  	, type: "string" , width: ""     , textAlign: "left"  , title: "문의내용"},
        DTS_INQREG    : { field: "DTS_INQREG"   , type: "string" , width: "150px", textAlign: "center", title: "문의등록일시"},   
        NM_FILE       : { field: "NM_FILE"  	, type: "string" , width: "100px", textAlign: "center", title: "문의 첨부파일 여부"},
        CD_ANSSTAT    : { field: "CD_ANSSTAT"   , type: "string" , width: "100px" , textAlign: "left" , title: "답변상태"},    
        DC_ANSCTT     : { field: "DC_ANSCTT"    , type: "string" , width: ""     , textAlign: "left"  , title: "답변내용"},  
        DC_HTMLANSCTT : { field: "DC_HTMLANSCTT", type: "string" , width: "100px", textAlign: "left"  , title: "답변내용"},  
        NM_ANS        : { field: "NM_ANS"       , type: "string" , width: "100px", textAlign: "center", title: "답변자"},  
        DTS_ANSREG    : { field: "DTS_ANSREG"   , type: "string" , width: "150px", textAlign: "center", title: "답변등록일시"},   
        YN_DEL		  : { field: "YN_DEL"   	, type: "string" , width: "150px", textAlign: "center", title: ""}	
	});
}());
