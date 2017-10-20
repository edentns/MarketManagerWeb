(function () {
	'use strict';

	angular.module('edtApp.common.directive')
		.directive('menuNavigation', ['$window', 'UtilSvc', 'FavoritesSvc', "$q", "$rootScope", "$modal", function ($window, UtilSvc, FavoritesSvc, $q, $rootScope, $modal) {
			return {
				templateUrl: 'app/shared/layout/navigation/navigation.tpl.html',
				restrict: 'AE',
				scope: {
					menuConfig: '='
				},
				link: function (scope) {
					var bFavorites = false;
					
					scope.menuList  = scope.menuConfig.data;
					UtilSvc.getGroup(true).then(function(res) {
						scope.groupList = res;
					});
					
					$('.main-menu').on('click', 'a', function (e) {
						var obj = $(this),
							parents 		= obj.parents('li'),
							li 				= obj.closest('li.dropdown'),
							anotherItems 	= $('.main-menu li').not(parents),
							current, pre, strHref = '';

						anotherItems.find('a').removeClass('active');
						anotherItems.find('a').removeClass('active-parent');
						if (obj.hasClass('dropdown-toggle') || obj.closest('li').find('ul').length === 0) {
							obj.addClass('active-parent');
							current = obj.next();
							if (current.is(':visible')) {
								li.find('ul.dropdown-menu').slideUp('fast');
								li.find('ul.dropdown-menu a').removeClass('active');
							} else {
								anotherItems.find('ul.dropdown-menu').slideUp('fast');
								current.slideDown('fast');
							}
						} else {
							if (li.find('a.dropdown-toggle').hasClass('active-parent')) {
								pre = obj.closest('ul.dropdown-menu');
								pre.find('li.dropdown').not(obj.closest('li')).find('ul.dropdown-menu').slideUp('fast');
							}
						}
						if (obj.hasClass('active') === false) {
							obj.parents('ul.dropdown-menu').find('a').removeClass('active');
							obj.addClass('active');
						}

						if (obj.attr('href') === '#') {
							e.preventDefault();
						}
						else {
							strHref = obj[0].attributes[1].value.substr(0, obj[0].attributes[1].value.indexOf('('))
							$window.localStorage.setItem("recentUrl", JSON.stringify({href: strHref}));
						}
					});
					
					scope.onFavorites = function() {
				        //var defer = $q.defer();
						var param = {
							procedureParam:"USP_SY_02LOGIN03_GET"
						};
						UtilSvc.getList(param).then(function (res) {
							scope.favoritesList = FavoritesSvc.setMenu(res.data.results[0]).getNavigation();
							
							//alert("즐겨찾기 클릭");
						});
						bFavorites = true;
				        //return defer.promise;
					};

					scope.onMenu = function() {
						bFavorites = false;
						//alert("메뉴 클릭");
					};
					
					scope.onSelect = function(kendoEvent) {
						var noMygrp = '',
						    noM     = '';
						
						if(kendoEvent.item && kendoEvent.item.id === '') return;
						
						if(bFavorites) {
							switch(kendoEvent.item.id) { 
							case "changeNm" : 
								var self = this,
								modalInstance = $modal.open({
									options: {
										modal: true,
										resizable: true,
										width: 450,
										visible: false
									},
									templateUrl : "app/shared/modal/mo05ChangeNm/modal.mo05ChangeNm.tpl.html",
			                        controller  : "modal.mo05ChangeNmCtrl",
			                        size        : "sm",
			                        resolve     : {
				                    	resData: ["$stateParams", "$q", "AuthSvc", "sy.AtrtSvc",
											function ($stateParams, $q, AuthSvc) {
												var defer   = $q.defer(),
													resData = {};
												
												// 1. 그룹이면
												if(kendoEvent.target.attributes[2].value === "ROOT") {
													resData.noMygrp = kendoEvent.target.id;
													resData.noM     = '';
												}
												else {
													resData.noMygrp = kendoEvent.target.attributes[2].value;
													resData.noM     = kendoEvent.target.id;
												}
												
												defer.resolve(resData);
												
												return defer.promise;
											}
				                    	]
				                    }
								});
								modalInstance.result.then(function ( result ) {
									scope.onFavorites();
									UtilSvc.getGroup(true).then(function(res) {
										scope.groupList = res;
									});
			                    });
								break;
							case "deleteThis" :
								// 1. 그룹이면
								if(kendoEvent.target.attributes[2].value === "ROOT") {
									noMygrp = kendoEvent.target.id;
								}
								else {
									noMygrp = kendoEvent.target.attributes[2].value;
									noM     = kendoEvent.target.id;
								}
								FavoritesSvc.deleteGrpMenu(noMygrp, noM).then(function(res) {
									if(res.status === 200) {
										alert('삭제완료하였습니다.');
										scope.onFavorites();
										UtilSvc.getGroup(true).then(function(res) {
											scope.groupList = res;
										});
									}
								});
								break;
							default : 
								// 1. 그룹이면
								if(kendoEvent.target.attributes[2].value === "ROOT") {
									noMygrp = kendoEvent.target.id;
								}
								else {
									noMygrp = kendoEvent.target.attributes[2].value;
									noM     = kendoEvent.target.id;
								}
								FavoritesSvc.changeGrpMenu(noMygrp, noM, kendoEvent.item.id).then(function(res) {
									if(res.status === 200) {
										alert('변경완료하였습니다.');
										scope.onFavorites();
										UtilSvc.getGroup(true).then(function(res) {
											scope.groupList = res;
										});
									}
								});
								break;	
							}
						}
						else {
							switch(kendoEvent.item.id) { 
							case "newGroup" : 
								// 팝업 띄워서 그룹 등록// 메뉴를 등록함.
								var self = this,
									modalInstance = $modal.open({
									options: {
										modal: true,
										resizable: true,
										width: 450,
										visible: false
									},
									templateUrl : "app/shared/modal/mo04NewGroupSave/modal.mo04NewGroupSave.tpl.html",
			                        controller  : "modal.mo04NewGroupSaveCtrl",
			                        size        : "sm"
								});
								modalInstance.result.then(function ( result ) {
									UtilSvc.getGroup(true).then(function(res) {
										scope.groupList = res;
									});
			                    });
							break;
							default : 
								FavoritesSvc.saveGrpMenu(kendoEvent.target.id, kendoEvent.target.textContent, kendoEvent.item.id).then(function(res) {
									if(res.status === 200) {
										alert('메뉴저장완료하였습니다.');
									}
								});
							break;
							}
						}
					};
				}
			};
		}])

		.directive('menuNode', ['$compile', '$templateCache', function ($compile, $templateCache) {
			return {
				restrict: 'AE',
				replace: true,
				scope: {
					menuNode: '='
				},
				compile: function () {
					return {
						pre: function (scope, element, attr) {
							var compTemp = $compile($templateCache.get('menuNode/template'))(scope);
							element.append(compTemp);
						}
					};
				}
			};
		}])

		.run(['$templateCache', function ($templateCache) {
			$templateCache.put('menuNode/template',
				'<li ng-repeat="menu in menuNode" ng-class="{\'dropdown\': menu._children.length > 0, opened: menu.active}">' +
					'<a ng-if="menu._children.length == 0" ' +
					   'ui-sref="{{menu.path}}" ' +
					   'title="{{menu.name}}" ' +
					   'ng-class="{\'active-parent active\': menu.active}" ' +
					   'ng-style="{\'padding-left\': menu.depth * 15 +\'px\'}">' +
						'<div class="{{menu.hasMenu}}" id="{{menu.entity.NO_M}}" p-id="{{menu.entity.ID_M_P}}">' +
							'<i class="fa {{menu.className}}"></i>&nbsp;<span>{{menu.name}}</span>' +
						'</div>' +	
					'</a>' +
				    '<a ng-if="menu._children.length > 0" ' +
				       'class="dropdown-toggle" ' +
				       'href="#" ' +
				       'title="{{menu.name}}" ' +
				       'ng-class="{\'active-parent\': menu.active}" ' +
				       'ng-style="{\'padding-left\': menu.depth * 6 +\'px\'}">' +
				       '<i class="fa {{menu.className}}"></i>&nbsp;<span>{{menu.name}}</span></a>' +
					'<ul ng-if="menu._children.length > 0" menu-node="menu._children" class="dropdown-menu"></ul>' +
				'</li>'
			);
		}]);
}());