(function () {
    "use strict";

    angular.module("sy.Atrt.controller")
        .controller("sy.AtrtMenuCtrl", ["$scope", "sy.AtrtSvc", "sy.codeSvc", "APP_CODE",
            function ($scope, SyAuthSvc, SyCodeSvc, APP_CODE) {

                // template
                var readColTemplate  = "<div class='edt-tree-view-col-content'>" +
		                "<select title='선택' data-ng-model='row.entity[col.field]'"+
		                    "data-ng-options='auth.CD as auth.NAME for auth in tree.appScope.menuVO.roleCodeList'"+
		                    "data-ng-change=\"tree.appScope.menuVO.changeBuAuth(row, col.field)\">"+
		                "</select></div>",
                    writeColTemplate = "<div class='edt-tree-view-col-content'>" +
                        "<select title='선택' data-ng-model='row.entity[col.field]'"+
                            "data-ng-options='auth.CD as auth.NAME for auth in tree.appScope.menuVO.roleCodeList'"+
                            "data-ng-change=\"tree.appScope.menuVO.changeBuAuth(row, col.field)\">"+
                        "</select></div>";

                var _datas = {};

                /**
                 * menuVO
                 * @type {{select: {CD_G: string}}}
                 */
                var menuVO = $scope.menuVO = {
                    boxTitle : "메뉴정보",
                    select   : {
                        CD_G  : "",
                        NM_G  : ""
                    },
                    roleCodeList : []
                };

                /**
                 * menu tree table options
                 * @type {{data: *, colDefs: *[], primaryName: string, parentName: string, height: number}}
                 */
                menuVO.options = {
                    data    : [],
                    colDefs : [
                        { field : "POS", displayName : "메뉴코드", width : 180 },
                        { field : "NM_M", displayName : "메뉴이름", width : 300, type: "tree" },
                        { field : "CD_ACC", displayName : "접근권한", width : 140, className : "ta-c", colTemplate: readColTemplate },
                        { field : "CD_WRITE", displayName : "등록/수정권한", width: 140, className : "ta-c", colTemplate: writeColTemplate }
                    ],
                    primaryName : "POS",
                    parentName  : "PARENT",
                    height : 352,

                    onRegisterApi : function (treeApi) {
                        menuVO.treeApi = treeApi;
                    }
                };

                /**
                 * 초기 로드시 실행된다.
                 */
                menuVO.initLoad = function () {
                    var self = this;

                    $scope.$on("authMng.menu:inquiry", function ($event, oSelect) {
                        if (!oSelect || !oSelect.CD_G) {
                            return;    
                        }
                        
                        if (self.treeApi.showData && self.treeApi.showData.length > 0) {
                            _datas[self.select.CD_G] = self.treeApi.showData.map(function(menuRow) {
                                return angular.copy(menuRow.entity);
                            });
                        }
                        
                        self.select.CD_G = oSelect.CD_G;
                        self.select.NM_G = oSelect.NM_G;
                        self.boxTitle = "메뉴정보 - "+ self.select.NM_G +" 선택 중";
                        
                        self.inquiry();
                    });

                    $scope.$on("authMng.menu:save", function ($event, postData) {
                        self.save(postData);
                    });


                    SyCodeSvc.getSubcodeList({cd: APP_CODE.role.cd, search: 'all'}).then(function (result) {
                        self.roleCodeList = result.data;
                    });
                };

                /**
                 * 초기화한다.
                 */
                menuVO.init = function () {
                    menuVO.inquiry();
                };

                /**
                 * 선택된 boolean 값을 propagation한다.
                 * @param row
                 * @param field
                 */
                menuVO.toggleProp = function (row, field) {
                    var value = row.entity[field];

                    propChildren(row._children, field, value);
                    propParent(row, field, value);


                    // children 순회
                    function propChildren(aChildren, sField, sValue) {
                        edt.each(aChildren, "_children", function(child) {
                            child.entity[sField] = sValue;
                        });
                    }

                    // parent 순회
                    function propParent(oRow, sField, sValue) {
                        edt.each(oRow, "_parent", function(parent) {

                            var entityValue = parent.entity[sField];

                            if (sValue === "Y") {
                                if (sValue !== entityValue) {
                                    parent.entity[field] = sValue;
                                }
                            } else {
                                var checked = false;
                                edt.each(parent._children, "_children", function(child) {
                                    if (child.entity[sField] !== sValue) {
                                        checked = true;
                                    }
                                });

                                if (!checked) { parent.entity[field] = sValue; }
                            }
                        });
                    }
                };

                /**
                 * 사업권한 변경시 propagation한다.
                 */
                menuVO.changeBuAuth = function (oRow, sField) {
                    var value = oRow.entity[sField];
                    edt.each(oRow._children, "_children", function(child) {
                        child.entity[sField] = value;
                    });

	                edt.each(oRow._parent, "_parent", function(parent) {
		                var i, lng, dChild;

		                if (parent._children) {
			                for (i=0, lng=parent._children.length; i<lng; i++) {
				                dChild = parent._children[i];
				                if (dChild.entity[sField] !== value) {
					                return false;
				                }
			                }
		                }

		                parent.entity[sField] = value;
	                });
                };


                /**
                 * 메뉴권한 검색을 위한 parameter를 생성한다.
                 * @returns {{CD_G: string}}
                 */
                menuVO.makeReqParam = function () {
                    if (this.select.CD_G !== "") {
                        return {
                            CD_G : this.select.CD_G
                        };
                    }

                    return null;
                };

                /**
                 * 메뉴권한 저장을 위한 parameter를 생성한다.
                 * @returns {Array}
                 */
                menuVO.makeSaveParam  = function (postData) {
                    var self = this,
                        data = self.treeApi.showData,
                        saveData = [],
                        menus, key, authData;
                    
                    for (key in _datas) {
                        if (_datas.hasOwnProperty(key)) {
                            menus = _datas[key];
                            
                            if (isDelete(postData, key)) {
                                continue;
                            }

                            angular.forEach(menus, function (menu) {
                                if (menu.CD_G) {
                                    menu.STATE = "U";
                                } 
                                else {
                                    menu.CD_G  = key;
                                    menu.STATE = "I";
                                }
                                
                                saveData.push(menu);
                            });
                        }
                    }
                    
                    function isDelete(datas, key) {
                        datas = datas || [];
                        var filterList = datas.filter(function(data) {
                            return (data.CD_G === key) && (data.STATE === "D"); 
                        });
                        return filterList.length > 0;
                    }

                    return saveData;
                };

                /**
                 * 메뉴권한을 조회한다.
                 */
                menuVO.inquiry = function () {
                    var self = this;
                    
                    SyAuthSvc.getMenuAuthList(self.makeReqParam()).then(function (result) {
                        _datas[self.select.CD_G] = self.options.data = result.data;
                    });
                };

                /**
                 * 메뉴권한을 저장한다.
                 */
                menuVO.save = function (postData) {
                    var self = this,
                        saveParam = self.makeSaveParam(postData);

                    if (saveParam.length>0) {
                        SyAuthSvc.saveMenuAuth(saveParam).then(function (){
                            _datas = {};
                            $scope.$emit("event:autoLoader", true);
                            alert("저장되었습니다.");

                            saveInit();
                            $scope.$emit("admin.auth:init");
                        });
                    } else {
                        _datas = {};
                        $scope.$emit("event:autoLoader", true);
                        alert("저장되었습니다.");

                        saveInit();
                        $scope.$emit("admin.auth:init");
                    }
                    
                    function saveInit() {
                        self.select.CD_G = "";
                        self.select.NM_G = "";
                        self.boxTitle = "메뉴정보";
                        self.options.data = [];
                    }
                };

                /**
                 * 데이터가 존재하는지 판단한다.
                 */
                menuVO.hasShowData = function () {
                    return this.treeApi.showData.length===0;
                };

                /**
                 * 모든 하위노드를 expend 또는 collapse한다.
                 */
                menuVO.toggleAll = function (opened) {
                    this.treeApi.toggleAll(opened);
                };


                menuVO.initLoad();
            }]);
}());