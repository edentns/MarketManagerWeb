(function () {
    'use strict';

    var edtApp = angular.module('edtApp');

    edtApp.constant('APP_CONFIG', {
        bsCd    : '00000',
		domain  : '/MarketManagerServer', // 운영
        version : 'V 0.0.1',
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
}());
