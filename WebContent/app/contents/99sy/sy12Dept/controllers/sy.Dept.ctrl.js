(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.depart.controller : sy.departCtrl
     * 부서관리
     */
    angular.module("sy.Dept.controller", [ 'kendo.directives' ])
        .controller("sy.DeptCtrl", ["$scope", "$q", "sy.CodeSvc", "sy.DeptSvc", "APP_CODE", "resData", "Page", "$state", 'MenuSvc', '$location',
            function ($scope, $q, SyCodeSvc, SyDeptSvc, APP_CODE, resData, Page, $state, MenuSvc, $location) {

	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();

                var NO_M = MenuSvc.getNO_M($state.current.name);
                
                /**
                 * 부서관리
                 * @type {{}}
                 */
                var syDeptVO = $scope.syDeptVO = {
                	parentNum: '',
                    boxTitle: '조직도',
                    /**
                     * 유효성을 체크한다.
                     * @param {array.<{STATE:string, NAME:string, MGR_CD:number, WORK_GROUP:string, YN_TOPDEPT:string}>} deptInfo
                     * @returns {{state: boolean, msg: string}}
                     */
                    isValid : function (deptInfo) {
                        var i, lng, o,
                            deptNmReg = /^[가-힣\w\s_(),&@'#\-:;/*{}[\]<>]{1,32}$/,
                            numCdReg = /^[\d]+$/;

                        for (i=0, lng=deptInfo.length; i<lng; i+=1) {
                        	o = deptInfo[i];
                            if     (!o.NM_DEPT)                                       return { state: false, msg: "[필수] 부서명은 필수 입력값입니다." };
                            else if(!deptNmReg.test(o.NM_DEPT))                       return { state: false, msg: "[형식] 부서명은 유효하지 않은 형식입니다." };
                            else if(!o.CD_OCC)                                        return { state: false, msg: "[필수] 직군은 필수 입력값입니다." };
                            else if(!numCdReg.test(o.CD_OCC))                         return { state: false, msg: "[형식] 직군은 유효하지 않은 형식입니다." };
                        }

                        return { state: true, msg: "체크완료" };
                    },
                    /**
                     * 추가, 수정, 삭제를 위한 parameter를 생성한다.
                     * @param oParam
                     * @returns {{STATE: *, CD: (*|$scope.employeeVO.param.CD|param.CD|resInfo.deptCodeList.CD|.deptCodeList.CD|null), NM_DEPT: (*|$scope.employeeVO.param.NM_DEPT|param.NM_DEPT|resInfo.deptCodeList.NM_DEPT|.deptCodeList.NM_DEPT|$scope.orderVO.ownerInfo.NM_DEPT), NO_HRNKDEPT: (*|$scope.employeeVO.param.NO_HRNKDEPT|param.NO_HRNKDEPT), CD_OCC: (*|$scope.employeeVO.param.CD_OCC|param.CD_OCC), YN_TOPDEPT: (*|string|createdItem.YN_TOPDEPT)}}
                     */
                    makeParam : function (deptInfo) {
                        var rtnParam = {
                            STATE        : deptInfo._state,
                            NM_DEPT      : deptInfo.NM_DEPT,
                            NO_HRNKDEPT  : deptInfo.NO_HRNKDEPT,
                            CD_OCC       : deptInfo.CD_OCC
                        };

                        if (!angular.isUndefined(deptInfo.NO_DEPT)) {
                            rtnParam.NO_DEPT = deptInfo.NO_DEPT;
                        }

                        return [rtnParam];
                    },
                    /**
                     * 부서를 조회한다.
                     */
                    inquiry : function (e) {
                        var self = this;
                        $q.all([
                            SyDeptSvc.getDepart({ search: "all" })
                        ]).then(function (result) {
                            self.data = result[0].data;
                            e.success(self.data);
                        });
                    },
                    saveProcess : function (deptInfo, e) {
                        var self = this,
                            param = self.makeParam(deptInfo),
                            resValid = self.isValid(param),
                            defer = $q.defer();

                        if (!resValid.state) {
                            alert(resValid.msg);
                            defer.reject();
                        } else {
                            SyDeptSvc.save(param).error(function (data, status, headers, config) {
            					console.log("error",data,status,headers,config);
                                defer.resolve();
                                $scope.dataSource.read();
            				}).then(function () {
                                //alert("데이터가 저장되었습니다.");
                                defer.resolve();
                                $scope.dataSource.read();
                            });
                        }
                        return defer.promise;
                    },
                    /**
                     * 데이터를 저장한다.
                     */
                    save : function (models, state, e) {
                        var self = this;
                        for(var i = 0; i < models.length; i++) {
                        	var hd = "SYDE";
                        	hd += fillZero(models[i].HCD,8);
                            var deptInfo = { 
                                _state: state, 
                                NO_DEPT: models[i].NO_DEPT,
                                NM_DEPT: models[i].NM_DEPT, 
                                NO_HRNKDEPT: hd, 
                                CD_OCC: models[i].CD_OCC
                            };
                            if ( !deptInfo['NO_DEPT'] || deptInfo['NO_DEPT'] === "" ) {
                                delete deptInfo['NO_DEPT'];
                            }
                            self.saveProcess(deptInfo, e);
                        }
                    },
                    workGroupDropDownEditor : function (container, options) {
                        $('<input data-bind="value:' + options.field + '"/>')
                            .appendTo(container)
                            .kendoDropDownList({
                                dataTextField: 'NM_DEF',
                                dataValueField: 'CD_DEF',
                                dataSource: resData.workCodeList
                        });
                    }
                };

                $scope.dataSource = new kendo.data.TreeListDataSource({
                    batch: true,
                    transport: {
                        read: function(e) {
                        	syDeptVO.inquiry(e);
                        },
                        create: function(e) {
                            var models = e.data.models;
                            syDeptVO.save(models, 'I', e);
                        },
                        update: function(e) {
                            var models = e.data.models;
                            syDeptVO.save(models, 'U', e);
                        },
                        destroy: function(e) {
                            var models = e.data.models;
                            syDeptVO.save(models, 'D', e);
                        }
                    },
                    schema: {
                        model: {
                            id: 'CD',
                            parentId: 'HCD',
                            fields: {
                            	CD     :     { type: 'number' },
                            	HCD    :     { type: 'number' },
                                NO_DEPT:     { type: 'string', editable: false, nullable: false },
                                NO_HRNKDEPT: { type: 'string', editable: false, nullable: true },
                                NM_DEPT:     { validation: { required: true } },
                                CD_OCC:      { type: 'string', validation: { required: true} },
                                NM_CD_OCC:   { type: 'string', validation: { required: true} },
                                CNT_EMP:     { type: 'number', editable: false, nullable: true }
                            },
                            expanded: true
                        }
                    }
                });
                
                $scope.treelistOptions = {
                    messages: {
                        noRows: "부서가 존재하지 않습니다.",
                        loading: "부서리스트를 가져오는 중...",
                        requestFailed: "요청 부서리스트를 가져오는 중 오류가 발생하였습니다.",
                        retry: "갱신",
                        commands: {
                            create: '등록',
                            createchild: '하위부서추가',
                            edit: '수정',
                            update: '수정',
                            canceledit: '취소',
                            destroy: '삭제'
                        }
                    },
                    columns: [
                        { 
                            field: 'NM_DEPT',
                            title: '부서명',
                            width: '280px',
                            editable: true,
                            expandable: true,
                            template: $('#departTemplate').html(),
                            attributes: { style: "text-align: left" }
                        },
                        { 
                            field: 'CD_OCC',
                            title: '직군',
                            width: '150px',
                            template: $('#workGroupNameTemplate').html(),
                            editor: syDeptVO.workGroupDropDownEditor,
                            attributes: { style: "text-align: center" }
                        },
                        { 
                            field: 'CNT_EMP',
                            title: '직원수',
                            width: '120px',
                            template: $('#cntEmpTemplate').html(),
                            editable: false,
                            attributes: { style: "text-align: right" }
                        },
                        {
                            command: [ "createchild","edit","destroy" ],
                            attributes: { style: "text-align: left" }
                        }
                    ],

                    remove: function(e) {
                        var msg = "삭제시 하위부서가 모두 삭제되며 복구가 불가능합니다.\n삭제하시겠습니까?";
                        if (!confirm(msg)) {
                            e.preventDefault();
                            this.cancelRow();
                        }
                    },

                    collapse: function(e) {
                        // console.log(e.sender);
                        this.cancelRow();
                    },

                    dragend: function(e) {
                        if(!!e) {
                        	$scope.dataSource.sync();
                        }
                    }
                };
                
                function fillZero(n, width) {
                	  n = n + '';
                	  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
                }
            }
        ]);
}());