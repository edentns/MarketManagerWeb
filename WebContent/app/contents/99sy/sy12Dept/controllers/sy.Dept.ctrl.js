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
                    boxTitle: '조직도',
                    /**
                     * 유효성을 체크한다.
                     * @param {array.<{STATE:string, NAME:string, MGR_CD:number, WORK_GROUP:string, YN_TOPDEPT:string}>} deptInfo
                     * @returns {{state: boolean, msg: string}}
                     */
                    isValid : function (deptInfo) {
                        var i, lng, o,
                            deptNmReg = /^[가-힣\w\s_(),&@'#\-:;/*{}[\]<>]{1,32}$/,
                            numCdReg = /^[\d]+$/,
                            topDeptEnum = ["YES", "NO"];

                        for (i=0, lng=deptInfo.length; i<lng; i+=1) {
                        	o = deptInfo[i];
                            if     (!o.NAME)                                     return { state: false, msg: "[필수] 부서명은 필수 입력값입니다." };
                            else if(!deptNmReg.test(o.NAME))                     return { state: false, msg: "[형식] 부서명은 유효하지 않은 형식입니다." };
                            else if(o.STATE !== "D" && !o.MGR_CD)                return { state: false, msg: "[필수] 상위부서는 필수 입력값입니다." };
                            else if(o.STATE !== "D" && !numCdReg.test(o.MGR_CD)) return { state: false, msg: "[형식] 상위부서는 유효하지 않은 형식입니다." };
                            else if(!o.WORK_GROUP)                               return { state: false, msg: "[필수] 직군은 필수 입력값입니다." };
                            else if(!numCdReg.test(o.WORK_GROUP))                return { state: false, msg: "[형식] 직군은 유효하지 않은 형식입니다." };
                            else if(topDeptEnum.indexOf(o.YN_TOPDEPT) === -1 && 
                            		!numCdReg.test(o.WORK_GROUP))                return { state: false, msg: "[형식] 상위부서는 여부는  [YES, NO]만 가능합니다." };
                        }

                        return { state: true, msg: "체크완료" };
                    },
                    /**
                     * 추가, 수정, 삭제를 위한 parameter를 생성한다.
                     * @param oParam
                     * @returns {{STATE: *, CD: (*|$scope.employeeVO.param.CD|param.CD|resInfo.deptCodeList.CD|.deptCodeList.CD|null), NAME: (*|$scope.employeeVO.param.NAME|param.NAME|resInfo.deptCodeList.NAME|.deptCodeList.NAME|$scope.orderVO.ownerInfo.NAME), MGR_CD: (*|$scope.employeeVO.param.MGR_CD|param.MGR_CD), WORK_GROUP: (*|$scope.employeeVO.param.WORK_GROUP|param.WORK_GROUP), YN_TOPDEPT: (*|string|createdItem.YN_TOPDEPT)}}
                     */
                    makeParam : function (deptInfo) {
                        var rtnParam = {
                            STATE      : deptInfo._state,
                            NAME       : deptInfo.NAME,
                            MGR_CD     : Number(deptInfo.MGR_CD),
                            WORK_GROUP : Number(deptInfo.WORK_GROUP),
                            YN_TOPDEPT : deptInfo.YN_TOPDEPT
                        };

                        if (!angular.isUndefined(deptInfo.CD)) {
                            rtnParam.CD = deptInfo.CD;
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
                            var deptInfo = { 
                                _state: state, 
                                CD: models[i].CD,
                                NAME: models[i].NAME, 
                                MGR_CD: models[i].MGR_CD, 
                                WORK_GROUP: models[i].WORK_GROUP, 
                                YN_TOPDEPT: models[i].YN_TOPDEPT || 'NO'
                            };
                            if ( !deptInfo['CD'] || deptInfo['CD'] === "" ) {
                                delete deptInfo['CD'];
                            }
                            self.saveProcess(deptInfo, e);
                        }
                    },
                    topDeptCheckboxEditor : function (container, options) {
                        var checkbox = $('<input type="checkbox" data-bind="value:' + options.field + '" value="NO" />');
                        if(options.model[options.field] === 'YES') checkbox.attr('checked', 'checked');
                        else                                       checkbox.removeAttr('checked');
                        checkbox.appendTo(container);
                        checkbox.click(function(e) {
                            if(checkbox.is(':checked')) checkbox.val('YES');
                            else                        checkbox.val('NO');
                        });
                    },
                    workGroupDropDownEditor : function (container, options) {
                        $('<input data-bind="value:' + options.field + '"/>')
                            .appendTo(container)
                            .kendoDropDownList({
                                dataTextField: 'NAME',
                                dataValueField: 'CD',
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
                            parentId: 'MGR_CD',
                            fields: {
                                CD: { type: 'number', editable: false, nullable: false },
                                MGR_CD: { type: 'number', editable: false, nullable: true },
                                NAME: { validation: { required: true } },
                                YN_TOPDEPT: { type: 'string', validation: { required: true } },
                                WORK_GROUP: { type: 'number', validation: { required: true, min: 0 } },
                                WORK_GROUP_NAME: { type: 'string', validation: { required: true} },
                                CNT_EMP: { type: 'number', editable: false, nullable: true }
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
                            destroy: '삭제',
                            excel: '엑셀 내보내기',
                            pdf: 'PDF 내보내기'
                        }
                    },
                    columns: [
                        { 
                            field: 'NAME',
                            title: '부서명',
                            width: '280px',
                            editable: true,
                            expandable: true,
                            template: $('#departTemplate').html(),
                            attributes: { style: "text-align: left" }
                        },
                        { 
                            field: 'WORK_GROUP',
                            title: '직군',
                            width: '150px',
                            template: $('#workGroupNameTemplate').html(),
                            editor: syDeptVO.workGroupDropDownEditor,
                            attributes: { style: "text-align: center" }
                        },
                        { 
                            field: 'YN_TOPDEPT',
                            title: '상위부서여부',
                            width: '120px',
                            template: $('#topDeptTemplate').html(),
                            editor: syDeptVO.topDeptCheckboxEditor,
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
            }
        ]);
}());