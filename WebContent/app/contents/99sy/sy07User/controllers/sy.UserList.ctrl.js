(function () {
    "use strict";

    /**
     * 유저관리 - 리스트
     * @name sy.User.controller : sy.UserListCtrl
     */
    angular.module("sy.User.controller")
        .controller("sy.UserListCtrl", ["$state", "$scope", "ngTableParams", "$sce", "$filter", "sy.UserListSvc", "sy.CodeSvc", "APP_CODE", "sy.deptSvc", "resData", "Page",
            function ($state, $scope, ngTableParams, $sce, $filter, UserListSvc, SyCodeSvc, APP_CODE, SyDepartSvc, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();

                // [syUserVO]
                var vo = $scope.syUserVO = {
                    boxTitle : "검색",
                    total: 0,
                    data: [],
                    departCodeList: [],
                    positionCodeList: [],
                    search: {depart: "", position: "", name: "", state: "JOINED"}
                };
                vo.tbl = {
                    columns: [
                        {field: "CD"          , visible: true, title: "사원번호" },
                        {field: "NAME"        , visible: true, title: "성명"    },
                        {field: "DEPT_NAME"   , visible: true, title: "부서"    },
                        {field: "POS_NAME"    , visible: true, title: "직급"    },
                        {field: "BIRTH_D"     , visible: true, title: "생년월일"  },
                        {field: "EMAIL"       , visible: true, title: "E-mail"},
                        {field: "PHONE_INNER" , visible: true, title: "내선번호"  },
                        {field: "PHONE_MOBILE", visible: true, title: "휴대폰번호" },
                        {field: "ROLE_NAME"   , visible: true, title: "권한"    },
                        {field: "STATUS"      , visible: true, title: "상태"    }
                    ],
                    tableParams: new ngTableParams({
                        page: 1,
                        count: 10,
                        isShowSelectLength: false,
                        sorting: {
                            CREATE_DT: "desc"
                        }
                    }, {
                        total: vo.data.length,
                        getData: function($defer, params) {
                            var orderedData = params.sorting() ? $filter("orderBy")(vo.data, params.orderBy()) : vo.data;
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    })
                };
                vo.init = function () {// 초기로드시 실행된다.
                    vo.getDepart({search: "all"});
                    vo.getSubcodeList({cd: APP_CODE.position.cd, search: "all"});
                    vo.doInquiry();
                };
                vo.initSearch = function () {// 검색조건을 초기화한다.
                    vo.search.depart = "";
                    vo.search.position = "";
                    vo.search.name = "";
                    vo.search.state = "JOINED";
                    vo.doInquiry();
                };
                vo.doReload = function (data) {// 테이블 데이터를 갱신하다.
                    vo.tbl.tableParams.settings({data: data});
                    vo.tbl.tableParams.page(1);
                    vo.tbl.tableParams.reload();
                };
                vo.doInquiry = function () {// 검새조건에 해당하는 유저 정보를 가져온다.
                    var param = {
                        dept    : !vo.search.depart     ? "all" : vo.search.depart,
                        pos     : !vo.search.position   ? "all" : vo.search.position,
                        name    : !vo.search.name       ? "all" : vo.search.name,
                        status  :  vo.search.state
                    };
                    UserListSvc.getUserList(UserListSvc.makeGetUserParam(param)).then(function ( result ) {
                        vo.total = result.data.length;
                        vo.data = result.data;
                        vo.doReload(result.data);
                    });
                };
                
                /**
                 * 직급 코드를 가져온다.
                 * @param param
                 */
                vo.getSubcodeList = function (param) {
                    var self = this;
                    SyCodeSvc.getSubcodeList(param).then(function (result) {
                        self.positionCodeList = result.data;

                    });
                };

                /**
                 * 부서코드를 가져온다.
                 */
                vo.getDepart = function (param) {
                    var self = this;
                    SyDepartSvc.getDepart(param)
                        .then(function (result) {
                            self.departCodeList = result.data;
                        });
                };

                vo.moveInsertPage = function () {// 사원등록페이지로 이동한다.
                    $state.go('app.syUser', { kind: 'insert', menu: null, ids: null });
                };
                vo.moveDetailPage = function (info) {// 사원 수정,상세페이지로 이동한다.
                    $state.go('app.syUser', { kind: 'detail', menu: null, ids: info.CD });
                };

                vo.init();
            }
        ]);
}());