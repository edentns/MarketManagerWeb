(function () {
    "use strict";

    angular.module("sy.Menu.controller")
        .controller("sy.MenuCtrl", ["$scope", "sy.MenuSvc", "resData", "Page",
            function ($scope, SyMenuSvc, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();

                /**
                 * @type {{boxTitle: string}}
                 * @namespace
                 */
                var syMenuVO = $scope.syMenuVO = {
                    boxTitle : "메뉴관리"
                };

                /**
                 * menu tree table options
                 * @type {{data: Array, colDefs: *[], primaryName: string, parentName: string, height: number, onRegisterApi: Function}}
                 */
                syMenuVO.options = {
                    data    : [],
                    colDefs : [
                        { field : "POS", displayName : "메뉴코드", width : 180 },
                        { field : "NM_M", displayName : "메뉴이름", width : 300, type: "tree" },
                        { field : "ID_CMP", displayName : "URL", width : 300 },
                        { field : "YN_USE", displayName : "사용여부", width : 100, className: "ta-c", filter: "ynUse" },
                        { field : "YN_EXE", displayName : "실행여부", width : 100, className: "ta-c", filter: "ynExe" },
                        { field : "DTS_UPDATE", displayName : "수정일시", width : 140, className: "ta-c" }
                    ],
                    primaryName : "POS",
                    parentName  : "PARENT",
                    height : 352,

                    onRegisterApi : function (treeApi) {
                        syMenuVO.treeApi = treeApi;
                    }
                };

                /**
                 * 초기 로드시 실행된다.
                 */
                syMenuVO.initLoad = function () {
                    var self = this;

                    self.init();
                };

                /**
                 * 초기화한다.
                 */
                syMenuVO.init = function () {
                    this.inquiry();
                };

                /**
                 * 메뉴를 가져오기 위한 parameter를 생성한다.
                 */
                syMenuVO.makeGetParam = function () {

                };

                /**
                 * 메뉴권한을 조회한다.
                 */
                syMenuVO.inquiry = function () {
                    var self = this;
                    SyMenuSvc.getMenuList()
                        .then(function (result) {
                            self.options.data = result.data;
                        });
                };

                /**
                 * 데이터가 존재하는지 판단한다.
                 */
                syMenuVO.hasShowData = function () {
                    return this.treeApi.showData.length===0;
                };

                /**
                 * 모든 하위노드를 expend 또는 collapse한다.
                 */
                syMenuVO.toggleAll = function (opened) {
                    this.treeApi.toggleAll(opened);
                };
                
                syMenuVO.initLoad();
            }]);
}());