(function () {
    "use strict";

    /**
     * @private
     */
    var edtApp = angular.module("edtApp");

    edtApp.run(["$rootScope", "$cookieStore", "$window", "$location", "$http", "MenuSvc", "$q", "sy.LoginSvc",
        function($rootScope, $cookieStore, $window, $location, $http, MenuSvc, $q, SyLoginSvc) {

            var isLoginPage = function(url) {
                    return url === "/99sy/syLogin" || url === "/99sy/syRePwdReg/:DC_URLCRYTO?:noOwnconf";
                },
                webApp = $rootScope.webApp = {};

            webApp.user = null;
            webApp.loader = { auto: true, isLoader : false };


            // select 기본 연도 생성을 위한 Year 리스트
            $rootScope.basicYearList = edt.makeYearList();

            $rootScope.$on("event:autoLoader", function(e, pBoolean) {
                webApp.loader.auto 	   = pBoolean;
                webApp.loader.isLoader = !pBoolean;
            });

            // Loading bar event
            $rootScope.$on("event:loading", function(e, boolean) {
                webApp.loader.isLoader = boolean;
            });

            // Logout Event
            $rootScope.$on("event:logout", function() {
	            if (!isLoginPage($location.$$path)) {
		            SyLoginSvc.logout().then(function() {
			            clearStorage();
			            $location.url("/99sy/syLogin");
		            });
	            } else {
		            clearStorage();
	            }

	            function clearStorage() {
		            webApp.user     = null;
		            $http.defaults.headers.common.NO_M = "";

		            $window.sessionStorage.clear();
		            $window.localStorage.removeItem("USER");
		            $window.localStorage.removeItem("MENU");
	            }

            });

            // 회의록 검색조건을 유지한다.
            $rootScope.$on("search:meetingList", function(e, param) {
                var NO_M = MenuSvc.getNO_M(param.name);
                $window.sessionStorage.setItem(webApp.user.CD +""+ NO_M, JSON.stringify(param.data));
            });

            // 회의록 검색 리스트 page를 저장한다.
            $rootScope.$on("setParam:meetingListPage", function(e, param) {
                var NO_M = MenuSvc.getNO_M(param.name);
                $window.sessionStorage.setItem(webApp.user.CD +""+ NO_M +"page", param.data);
            });

            // session에 유저정보를 저정한다.
            $rootScope.$on("event:setUser", function(e, user) {
                $window.localStorage.setItem("USER", JSON.stringify(user));
                webApp.user = user;
            });

            // session에 메뉴리스트를 저정한다.
            $rootScope.$on("event:setMenu", function(e, menuList) {
	            $window.localStorage.setItem("MENU", JSON.stringify(menuList));
            });

	        // $http header에 메뉴ID를 저장한다.
            $rootScope.$on("event:setNO_M", function(event, NO_M) {
                $http.defaults.headers.common.NO_M = MenuSvc.getNO_M(NO_M);
            });


	        // route change start
	        $rootScope.$on("$stateChangeStart", function(event, toState){
		        var defer = $q.defer();
		        if (!isLoginPage(toState.url)) {
			        getUser().then(function() {
				        $http.defaults.headers.common.NO_M = MenuSvc.getNO_M(toState.name);
				        defer.resolve();
			        });
		        }

		        return defer.promise;
	        });

	        // route change error
	        $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState){
		        if (!isLoginPage(toState.url)) {
			        getMenu().then(function() {
				        $http.defaults.headers.common.NO_M = MenuSvc.getNO_M(fromState.name);
			        });
		        }
	        });


	        /**
	         * Get user info.
	         * @returns {Promise}
	         */
	        function getUser() {
		        var defer = $q.defer(),
			        user;

		        if (!webApp.user) {
					user = JSON.parse($window.localStorage.getItem("USER"));
			        if (user) {
				        webApp.user = user;
				        MenuSvc.setMenu(JSON.parse($window.localStorage.getItem("MENU")));
				        defer.resolve(webApp.user);
			        } else {
				        SyLoginSvc.getLoginedInfo().then(function(result) {
					        $rootScope.$emit("event:setUser", result.data);
					        $rootScope.$emit("event:setMenu", MenuSvc.setMenu(result.data.MENU_LIST).getMenu());
					        defer.resolve(result.data);
				        });
			        }
		        } else {
					defer.resolve(webApp.user);
		        }

		        return defer.promise;
	        }

	        /**
	         * Get menu.
	         * @returns {Promise}
	         */
	        function getMenu() {
		        var defer = $q.defer();
				if (MenuSvc.getMenu().length === 0) {
			        if (!webApp.user) {
				        getUser().then(function() {
							defer.resolve(MenuSvc.getMenu());
				        });

			        } else {
				        defer.resolve(MenuSvc.getMenu());
			        }
		        }

		        return defer.promise;
	        }
        }
    ]);
}());