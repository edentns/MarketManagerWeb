(function () {
	'use strict';

	angular.module('edtApp.common.service')
		.factory('MenuSvc', MenuSvc);

	MenuSvc.$inject = ['$rootScope', '$state'];
	function MenuSvc($rootScope, $state) {
		var self = this,
			PK = 'ID_M',
			FK = 'ID_M_P',

			_data = [],
			_compositData = [],

			Node;

		Node = function (menu) {
			var self = this;
			self.entity = menu;

			self._parent = null;
			self._children = [];
			self.depth = 0;
			self.active = false;

			self.name = menu.NM_M;
			self.state = menu.ID_CMP;
			self.path  = self.state +'({ menu: true })';
			self.className = menu.NM_ICON;
			self.seq = menu.SQ_M;
			self.hasMenu   = "hasMenu";
		};

		Node.prototype = {
			// Root인지 판단한다.
			isRoot: function () {
				return this.entity[FK]===null || this.entity[FK]===0;
			},

			// 자식노드가 있는지 판단한다.
			hasChildren: function () {
				return this._children.length>0;
			},

			// 부모노드를 가져온다.
			getParent: function () {
				return this._parent;
			},

			// 자식노드를 리턴한다.
			getChildren: function () {
				return this._children;
			},

			// parent를 설정한다.
			setParent: function (parent) {
				this._parent = parent;
			},

			// 자식노드를 추가한다.
			appendChild: function (node) {
				this._children.push(node);
			}

		};


		return {
			// 전체 메뉴를 가져온다.
			getMenu: function () {
				return _data;
			},

			// MENU ID를 가져온다.
			getNO_M: function(url) {
				var rtnNO_M = '';
				angular.forEach(_data, function (menu) {
					if (menu.ID_CMP === url) { rtnNO_M = menu.NO_M; }
				});
				return rtnNO_M;
			},
			
			// MENU ID를 가져온다.
			getUrl: function(NO_M) {
				var rtnUrl = '';
				angular.forEach(_data, function (menu) {
					if (menu.NO_M === NO_M) { rtnUrl = menu.ID_CMP; }
				});
				return rtnUrl;
			},
			
			// 로그인시 이동시킬 URL을 가져온다.
			getDefaultUrl: function () {
				var self = this,
					navigation = self.getNavigation(),
					rtnUrl = '';

				self.traverseChildren(navigation, function (menu) {
					if (!rtnUrl && !menu.group ) { rtnUrl = menu.state; }
				});

				return rtnUrl;
			},

			// 네비게이션 메뉴를 가져온다.
			getNavigation: function () {
				return _compositData[0].getChildren();
			},

			// 메뉴데이터를 셋한다.
			setMenu: function (menuList) {
				_data = menuList.sort(function (a, b) {
					if (a[PK] > b[PK]) { return 1; }
					else if (a[PK] < b[PK]) { return -1; }
					else { return 0; }
				});
				_compositData = [];

				var self = this,
					keys = {};

				angular.forEach(_data, function (menu) {
					var node = new Node(menu),
						parent;

					keys[node.entity[PK]] = node;

					if (node.isRoot()) {
						node.depth = 0;
						_compositData.push(node);
					} else {
						parent = keys[node.entity[FK]];
						parent.group = true;
						node.depth = parent.depth + 1;
						parent.appendChild(node);
						node.setParent(parent);
					}
				});

				self.sort(_compositData, 'ASC');
				angular.forEach(_compositData, function (menu) {
					if (menu.hasChildren()) { self.sort(menu.getChildren(), 'ASC'); }
				});

				return this;
			},

			// state와 일치하는 메뉴를 선택한다.
			activeMenu: function (state) {
				var self = this;
				self.traverseChildren(_compositData, function (menu) {
					if (menu.state === state) {
						menu.active = true;
						self.traverseParent(menu, function (parent) {
							parent.active = true;
						});
					}
				});
			},

			// 부모메뉴를 순회한다.
			traverseParent: function (node, callback) {
				var self = this,
					parent = node.getParent();

				if (parent) {
					callback(parent);
					if (parent.getParent()) { self.traverseParent(parent, callback); }
				}
			},

			// 자식메뉴를 순회한다.
			traverseChildren: function (data, callback) {
				var self = this;
				angular.forEach(data, function (menu) {
					callback(menu);
					if (menu.hasChildren()) { self.traverseChildren(menu.getChildren(), callback); }
				});
			},

			// 메뉴를 정렬한다.
			sort: function (data, sortType) {
				sortType = sortType.toUpperCase();

				switch(sortType) {
					case 'ASC':
						data.sort(function (a, b) {
							if (a.seq > b.seq) { return 1; }
							else if (a.seq < b.seq) { return -1; }
							else { return 0; }
						});
						break;

					case 'DESC':
						data.sort(function (a, b) {
							if (a.seq < b.seq) { return 1; }
							else if (a.seq > b.seq) { return -1; }
							else { return 0; }
						});
						break;
				}


			}

		};
	}



}());
