/**
 * MODAL - multi 장비 검색(장바구니)
 */
(function () {
	'use strict';

	function EmpModalCtrl ($scope, $q, SyUserListSvc,SydepartSvc, $modalInstance, resolveParam, UtilSvc) {
		var KEY_EMP = 'NO_EMP',
			vm = {
			/**
			 * 선택된 정보를 부모창에 전달하고, 모달팝업창을 닫는다.
			 */
			confirm: function () {
				var self = this,
					selectedItem = self.selectedEmp.grid.rowData;

				if (!selectedItem || selectedItem.length===0) {
					alert('사원을 선택해주세요.');
					return;
				}
				$modalInstance.close(selectedItem);
			},
			/**
			 * 모달창을 닫는다.
			 */
			cancel: function () {
				$modalInstance.dismiss('cancel');
			},
			/**
			 * 초기 로드시 실행된다.
			 */
			initLoad: function () {
				var self = this;
				$q.all([
					SyUserListSvc.getUserList(self.search.getSearchParam()),   // 사원정보
					SydepartSvc.getDepart({search:"all"})   // 부서정보
				]).then(function (res) {
					var defaults = { CD: 0, NAME: '선택'},
						treeData = UtilSvc.grid.getTreeNode({ userData: res[0].data, deptData: res[1].data, primaryKey: 'CD', parentKey: 'MGR_CD' });

					res[1].data.unshift(defaults);
					vm.code.deptList = res[1].data;

					if (resolveParam && resolveParam.empList) { self.selectedEmp.render(angular.copy(resolveParam.empList)); }
					self.emp.render(treeData);
				});
			}
		};

		/**
		 * 공통코드
		 */
		vm.code = {
			deptList: []
		};


		/**
		 * 검색 Component
		 */
		vm.search = {
			dept: 0,    // 검색기준
			keyword: '',  // 검색어
			getSearchParam: function () {
				var self = this,
					rtnParam = {
						searchFlag:'svSearch',
						dept : self.dept ? self.dept : 'all',
						name :self.keyword ? self.keyword : 'all',
						status : 'JOINED'
					};
				return $.param(rtnParam);
			},
			inquiry: function () {
				var self = this;
				SyUserListSvc.getUserList(self.getSearchParam()).then(function (res) {
					var treeData = res.data.length>0 ? UtilSvc.grid.getTreeNode({ userData: res.data, deptData: vm.code.deptList.slice(1), primaryKey: 'CD', parentKey: 'MGR_CD' }) : [];
					vm.emp.render(treeData);
				});
			}
		};


		/**
		 *  그리드
		 */
		vm.emp = {
			render: function (data) {
				var self = this;
				self.grid.rowData = data;
				self.grid.api.onNewRows();
			},
			putCart: function () {
				var selectedRow =vm.emp.grid.selectedRows,
					selectedUser = vm.selectedEmp.grid.rowData,
					cartData = [];

				angular.forEach(selectedRow, function (row) {
					var state = false;
					angular.forEach(selectedUser, function (user) {
						if (row.NO_EMP === user.NO_EMP) { state = true; }
					});
					if (!state) { cartData.push(row); }
				});

				if (cartData.length > 0) { vm.selectedEmp.render(selectedUser.concat(cartData)); }
			}
		};

		vm.emp.grid = {
			columnDefs: [
				{headerName: "조직도", field: "NAME", width: 263,
					cellRenderer: {
						renderer: 'group',
						innerRenderer: function (params) {
							var node = params.node;
							if (node.children) { return '<i class="fa fa-folder-o"></i>'+ params.data.NAME; }
							else { return '<i class="fa fa-user" style="color: rgba(121,185,249,0.7)"></i><span class="ag-small">'+ params.data.NM_POS +'</span>'+ params.data.NM_EMP; }
						},
						checkbox: true
					}
				}
			],
			rowData: null,
			rowSelection: 'multiple',
			groupSelectsChildren: true,
			suppressRowClickSelection: true,
			rowsAlreadyGrouped: true,
			enableSorting: true,
			icons: {
				groupExpanded: '<i class="fa fa-minus-square-o" />',
				groupContracted: '<i class="fa fa-plus-square-o" ></i>'
			}
		};

		/**
		 * 선택된 그리드
		 */
		vm.selectedEmp = {
			render: function (data) {
				var self = this;
				self.grid.rowData = data;
				self.grid.api.onNewRows();
			},
			bindDeleteRow: function (params) {
				params.$scope.rowIndex = params.rowIndex;
				params.$scope.deleteRow = function (data, idx) {
					vm.selectedEmp.grid.rowData.splice(idx, 1);
					vm.selectedEmp.grid.api.onNewRows();
				};

				return '<i class="fa fa-minus-circle red-dark hover-cursor"  ng-click="deleteRow(data, rowIndex)"></i>';
			}
		};
		vm.selectedEmp.grid = {
			rowData: [],
			columnDefs: [
				{headerName: "부서명", field: "NM_DEPT", headerGroup: 'Selected 유저', width: 172 },
				{headerName: "이름", field: "NM_EMP", headerGroup: 'Selected 유저', width: 140 },
				{headerName: "직급", field: "NM_POS", headerGroup: 'Selected 유저', width: 94 },
				{ headerName: '삭제', field: '', headerGroup: 'Selected 유저', width: 80, cellClass: 'ta-c', cellRenderer: vm.selectedEmp.bindDeleteRow }
			],
			suppressCellSelection: true,
			angularCompileRows: true,
			groupHeaders: true,
			enableSorting: true
		};



		$scope.vm = vm;
		vm.initLoad();

		$scope.$on('$destroy', function () {
			delete $scope.vm;
		});
	}
	EmpModalCtrl.$inject = ['$scope','$q', 'sy.userListSvc','sy.departSvc', '$modalInstance', 'resolveParam','UtilSvc'];

	angular
		.module('edtApp.common.modal')
		.controller('modal.searchEmpCtrl', EmpModalCtrl);


}());