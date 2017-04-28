(function () {
   "use strict";

    /**
     * @ngdoc function
     * @name sy.Code.controller : sy.CodeSystemCtrl
     * 코드관리 - 시스템코드관리
     */
    angular.module("sy.Code.controller")
        .controller("sy.CodeSystemCtrl", [ "$scope", function ($scope) {
            /**
             * systemVO
             * @namespace
             * @extends code.codeMngCtrl
             * @type {String} NO_MNGCDHD
             * @type {String} CD_CLS 분류코드
             */
            var systemVO = $scope.systemVO = {
                boxTitle : "기초코드",
                NO_MNGCDHD   : "",
                CD_CLS   : ""
            };

            /**
             * 사용자코드 테이블 Option을 세팅한다.
             */
            systemVO.gridOptions = {
                columnDefs : [
                    { field : "NM_DEF", displayName: "구분코드명", width: "100", pinnedLeft: true },
                    { field : "DC_RMK1", displayName: "비고1", width: "100" },
                    { field : "DC_RMK2", displayName: "비고2", width: "100" },
                    { field : "DC_RMK3", displayName: "비고3", width: "100" },
                    { field : "DC_RMK4", displayName: "비고4", width: "100" },
                    { field : "DC_RMK5", displayName: "비고5", width: "100" },
                    { field : "DTS_UPDATE", displayName: "수정일시", width: "120", cellClass: "ta-c" }
                ],
                data : [],
                onRegisterApi: function( gridApi ) {
                    systemVO.gridApi = gridApi;
                }
            };

            /**
             * 시스템코드 초기로드시 실행된다.
             */
            systemVO.initLoad = function () {
                var self = this;

                // 코드분류 row클릭시 정보를 받아 사용자코드를 조회한다.
                $scope.$on( "codeMng.system:inquiry", function ( $event, oEntity, aData ) {

                    self.NO_MNGCDHD = oEntity.NO_MNGCDHD;
                    self.CD_CLS = oEntity.CD_CLS;
                    self.gridOptions.data = aData;
                });
            };

            /**
             * 시스템코드를 조회한다.
             */
            systemVO.inquiry = function () {

            };

            systemVO.initLoad();
        }]);
}());