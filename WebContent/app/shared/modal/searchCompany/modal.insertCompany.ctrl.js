(function () {
    "use strict";

  /**
   * @ngdoc function
   * @name
   * modal - 고객사 심플 등록
   */
  angular.module("edtApp.common.modal")
      .controller("modal.insertCompanyCtrl", ["$scope", "$modal", "$modalInstance", "ngTableParams", "$sce", "$filter", "CU.companyInfoSvc", "sy.departSvc", "APP_MSG", "APP_CODE",
          function ($scope, $modal, $modalInstance, ngTableParams, $sce, $filter, CuCompanyInfoSvc, SyDepartSvc, APP_MSG, APP_CODE) {

            var codeVO, insertVO;

            /**
             * ===================================================
             * code를 관리한다.
             * ===================================================
             */
            codeVO = $scope.codeVO = {
              departCodeList: []
            };

            /**
             * 부서코드리스트를 가져온다.
             */
            codeVO.getDepartCodeList = function () {
              var param = {search: "all"};
              SyDepartSvc.getDepart(param).then(function (result) {
                codeVO.departCodeList = result.data;
              });
            };



            /**
             * ===================================================
             * 모달 고객사 등록을 관리한다.
             * ===================================================
             */
            insertVO = $scope.insertVO = {
              param: {
                c_NAME            : "",			// 고객사명
                c_SALES_DEPT_CD   : ""	    // 담당부서
              }
            };

            /**
             * 거래처 등록 parameter를 생성한다.
             * @returns {{c_NAME: string, c_SALES_DEPT_CD: number}}
             */
            insertVO.makeGetParam = function () {
              return {
                c_NAME          : insertVO.param.c_NAME,
                c_SALES_DEPT_CD : (insertVO.param.c_SALES_DEPT_CD === "") ? 0 : insertVO.param.c_SALES_DEPT_CD
              };
            };

              /**
               * 고객사를 등록한다.
               */
              insertVO.doInsert = function () {
                  if ( insertVO.param.c_NAME === "" ) {
                    edt.invalidFocus("insertCompanyInfoName", "고객사명을 입력해주세요.");
                    return;
                  } else {
                    if (!edt.validCorpName(insertVO.param.c_NAME)) {
                      return edt.invalidFocus("insertCompanyInfoName", "한글과 영어, (), \ 조합만 가능합니다.");
                    }
                  }
                  if ( confirm( APP_MSG.insert.confirm ) ) {
                    var param =  insertVO.makeGetParam();
                    CuCompanyInfoSvc.insert( param ).then(function () {
                      alert( APP_MSG.insert.success );
                      $modalInstance.dismiss( "cancel" );
                    });
                  }
              };

              /**
               * 모달창을 닫는다.
               */
              insertVO.doCancle = function () {
                $modalInstance.dismiss( "cancel" );
              };


              // 처음 로드되었을 때 실행된다.
              (function  () {
                  codeVO.getDepartCodeList();
              }());
        }]);

}());