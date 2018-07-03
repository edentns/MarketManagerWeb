(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Dashboard.controller : sy.DashboardCtrl
     * 코드관리
     */
    angular.module("sy.Dashboard.controller")
        .controller("sy.DashboardCtrl", ["AuthSvc", "$scope", "$http", "$q", "$log", "sy.DashboardSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "ModalSvc", "$state",   
                                         function (AuthSvc, $scope, $http, $q, $log, MaDashboardSvc, APP_CODE, $timeout, resData, Page, UtilSvc, ModalSvc, $state) {
        		var vm = this;
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            LOCAL_LIST_KEY = 'DASHBOARD-LIST',
		            defaultComponents=[
   		                {
		                	visible     : true,
		                	order       : 1,
		                	name        : 'sy.SaMonthCtrl',
		                	displayName : '주문월현황',
		                	templateURL : 'app/contents/99sy/sy01Dashboard/templates/sy.SaMonth.tpl.html'
		                },
		                {
		                	visible     : true,
		                	order       : 2,
		                	name        : 'sy.MrkSaCntCtrl',
		                	displayName : '마켓별주문현황',
		                	templateURL : 'app/contents/99sy/sy01Dashboard/templates/sy.MrkSaCnt.tpl.html'
		                },
		                {
		                	visible     : true,
		                	order       : 3,
		                	name        : 'sy.SaCntCtrl',
		                	displayName : '주문관련현황',
		                	templateURL : 'app/contents/99sy/sy01Dashboard/templates/sy.SaCnt.tpl.html'
		                }
		            ];

	            vm.allOpen = resData.cmrkOpen && resData.parsOpen;
	            	            
	            vm.sacsCnt = (function(){
	            	var ret = [];
	            	for(var iIndex = 0; iIndex < resData.sacsCnt.length - 1; iIndex++) {
	            		ret[iIndex] = (resData.sacsCnt[iIndex].length > 0)? kendo.toString(resData.sacsCnt[iIndex][0].CNT_ORD,'n0', 'ko-KR'): '0';
	            	}
	            	ret[resData.sacsCnt.length - 1] = (resData.sacsCnt[resData.sacsCnt.length - 1].length > 0)? kendo.toString(resData.sacsCnt[resData.sacsCnt.length - 1][0].CNT_INQ,'n0', 'ko-KR'): '0';
	            	return ret;
	            }());
	            
	            vm.mainComponents = {
            		visible     : true,
                	order       : 1,
                	name        : 'sy.DashNoticeCtrl',
                	displayName : '공지사항',
                	templateURL : 'app/contents/99sy/sy01Dashboard/templates/sy.Notice.tpl.html',
                	open        : resData.mainOpen && vm.allOpen
	            };
	            
	            vm.subComponents = {
            		visible     : true,
                	order       : 1,
                	name        : 'sy.DashQaCtrl',
                	displayName : '묻고답하기',
                	templateURL : 'app/contents/99sy/sy01Dashboard/templates/sy.Qa.tpl.html',
                	open        : resData.subOpen && vm.allOpen
	            };
            
	            vm.broadcast = function() {
	            	$timeout(function() {
	            		$scope.$broadcast('dashboard:query', {
	            			tabName : vm.tab.activeTabNm,
	            			code    : vm.code
	            		});
	            	}, 0);
	            };
	            
	            vm.removeDashboardSetting = function() {
	                var message = '설정된 정보를 초기화 하시겠습니까?';
	                if (confirm(message)) {
	                    UtilSvc.localStorage.removeItem(LOCAL_LIST_KEY);
	                    vm.components = angular.copy(defaultComponents);
	                    vm.broadcast();
	                }
	            };

	            vm.openDashboardSetting = function() {
	                var modalInstance = ModalSvc.openConfirmPopup({
	                    templateUrl : 'app/contents/99sy/sy01Dashboard/templates/sy.DashboardSetting.modal.tpl.html',
	                    controller  : 'sy.DashboardSettingModalCtrl',
	                    resolve: {
	                        payload: function() {
	                            return {
	                                data: vm.components
	                            };
	                        }
	                    }
	                });

	                modalInstance.result.then(function(result) {
	                    vm.components = result;
	                    vm.broadcast();
	                    UtilSvc.localStorage.setItem(LOCAL_LIST_KEY, vm.components);
	                });

	            };

	            vm.maintitle = "시작";
	            vm.userJoinImg = "/assets/img/userJoin.png";
	            
	            vm.markImg = (resData.cmrkOpen)? "/assets/img/markIn.png":"/assets/img/markOut.png";
	            vm.parsImg = (resData.parsOpen)? "/assets/img/parsIn.png":"/assets/img/parsOut.png";
	            vm.saImg = (vm.allOpen)? "/assets/img/saIn.png":"/assets/img/saOut.png";
	            vm.arrowImg = (vm.allOpen)? "/assets/img/arrowIn.png":"/assets/img/arrowOut.png";
	            
	            
	            vm.markmanagerClick = function() {
	            	$state.go('app.syMrk', { kind: null, menu: null });
	            };

	            vm.parsClick = function() {
	            	$state.go('app.syPars', { kind: null, menu: null });
	            };
	            
	            // 2016-08-02
	            // -1-
	            // 마지막으로 선택된 탭 값 불러오기.
	            var activeTabName = UtilSvc.localStorage.getItem('activeTabName') || 'CHART';
	            var tabs = [
	                    ((!!activeTabName) && activeTabName === 'CHART'),
	                    ((!!activeTabName) && activeTabName === 'TABLE')
	                ];

	            vm.tab  = {
	                activeTabNm: activeTabName,
	                tabs: [
	                    { active: tabs[0], name: "CHART" },
	                    { active: tabs[1], name: "TABLE" }
	                ],
	                changeTab: function ($e, tab) {
	                    $e.preventDefault();

	                    var me = this,
	                        lastSelectedTab = '';

	                    if (me.activeTabNm === tab.name) { return; }

	                    me.tabs.forEach(function (o) {
	                        o.active = false;
	                    });
	                    me.activeTabNm = tab.name;
	                    tab.active = true;
	                    
	                    // 2016-08-02
	                    // -1-
	                    // 대쉬보드에서 마지막으로 선택한 탭 이름 저장.
	                    UtilSvc.localStorage.setItem('activeTabName', tab.name);

	                    vm.broadcast();

	                    // 날짜 초기화
	                    //me.initSearchPeriod();
	                    //bigDeal.findBigDeal();  // 글로벌 탭 클릭 시 BIG DEAL은 조회를 해주어야한다.
	                },
	                equalsTabName: function (tabNm) {
	                    return tabNm === this.activeTabNm;
	                }
	            };

	            vm.components   = angular.copy(defaultComponents);
	            
	            vm.changeComponent = function() {
	                vm.components[0].order = 2;
	                vm.components[1].order = 1;
	            };
	            vm.removeComponent = function() {
	                vm.components[0].visible = false;
	            };
	            vm.addComponent = function() {
	                vm.components[0].order = 1;
	                vm.components[1].order = 2;
	                vm.components[0].visible = true;
	                vm.broadcast();
	            };

	            page.bootstrap(function() {
	            	if(vm.allOpen) {
	            		$timeout(function() {
			                vm.broadcast();
			                AuthSvc.isAccess().then(function (result) {
			        		});
		                }, 500);
	            	}
	            });
            }]);
}());