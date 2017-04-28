(function () {
    "use strict";

    var today = edt.getToday(),
        todayString = today.y +""+ today.m +""+ today.d;

    /**
     * @typedef {Object} DateGroupOptions
     * @property {String} dateType basic|month|week|full
     * @property {Array} buttonList [prevYear|prevMonth|prevWeek|current|year|nextYear|nextMonth|nextWeek|1st|2nd|3rd|4th|1half|2half|range]
     * @property {String} selected 선택된 버튼 종류. default current
     * @property {{y:String, m:String, d:String}} date
     * @property {Function} change
     */

    /**
     * DateGroup
     * @constructor
     * @param {DateGroupOptions} dateGroupOptions
     */
    var DateGroup = function (dateGroupOptions, scope) {
        var self = this;

        self.$scope = scope;

        self.dateType   = "basic";
        self.buttonList = ["prevMonth", "current", "nextMonth"];
        self.selected   = "current";
        self.isPeriod   = false;
        self.period = {};
        self.cache  = null;
        self.event  = {};
        self.enableInqBtn = false;

        if (angular.isFunction(dateGroupOptions.change)) {
            self.event.change = dateGroupOptions.change;
        }
        delete dateGroupOptions.change;

        if (angular.isFunction(dateGroupOptions.inquiry)) {
            self.enableInqBtn = true;
            self.event.inquiry = dateGroupOptions.inquiry;
        }
        delete dateGroupOptions.inquiry;

        edt.extend(dateGroupOptions, self, false);

        // date
        self.yearLsit  = edt.makeYearList();
        self.monthList = edt.makeMonthList();
        self.startDayList = self._getDayList(self.period.start);
        self.endDayList   = self._getDayList(self.period.end);

        self.compositeList = self._createButton(self.buttonList);
        self.select(self.getBtnData(self.selected));
    };

    DateGroup.prototype = {
        /**
         * 버튼 객체를 생성한다.
         * @param {Array.<string>} buttonList
         * @returns {Array.<DateButton>}
         * @private
         */
        _createButton : function (buttonList) {
            var i, lng, btnType,
                rtnButtonList = [];

            for (i=0, lng=buttonList.length; i<lng; i+=1) {
                btnType = buttonList[i];
                rtnButtonList.push(new DateButton({
                    id     : "button"+(i+1),
                    type   : btnType
                }));
            }

            return rtnButtonList;
        },

        /**
         * 일자 리스트를 가져온다.
         * @param {{y:string, m:string, d:string}} date
         * @returns {Array}
         * @private
         */
        _getDayList : function (date) {
            var d = edt.getLastDate(date.y +""+ date.m, null),
                rtnDayList = [], i;

            for (i=0; i<d; i+=1) {
                rtnDayList[i] = edt.fillSpace( i+1 );
            }

            return rtnDayList;
        },

        /**
         * 일자를 set한다.
         * @param {DateButton} dateBtn
         * @private
         */
        changeButton : function (dateBtn) {
            var self = this,
                dateType = self.dateType,
                period   = self.period,
                stDate = {y:"", m:"", d:""},
                edDate = {y:"", m:"", d:""},
                weekDate = {};

            //self.select(dateBtn);

            switch(dateBtn.type) {
                case "prevYear" :
                    stDate = edt.getPrevDate(todayString, "year", null);
                    edDate = edt.getPrevDate(todayString, "year", null);
                    stDate.m = "01";
                    stDate.d = "01";
                    edDate.m = "12";
                    edDate.d = "31";
                    break;

                case "prevMonth" :
                    stDate = edt.getPrevDate(todayString, "month", null);
                    edDate = edt.getPrevDate(todayString, "month", null);
                    stDate.d = "01";
                    edDate.d = ""+ edt.getLastDate(stDate.y +""+ stDate.m +""+ stDate.d, null);
                    break;

                case "prevWeek" :
                    weekDate = edt.getWeekPeriod(edt.getPrevDate(todayString, "week", null));
                    stDate = weekDate.st;
                    edDate = weekDate.ed;

                    break;

                case "current" :
                	if (dateType === "week") {
                        weekDate = edt.getWeekPeriod({y: today.y, m:today.m, d:today.d, dow:today.dow});
                        stDate = weekDate.st;
                        edDate = weekDate.ed;
                    } else if (dateType === "market") {
                    	stDate.y = edDate.y = today.y;
                        stDate.m = edDate.m = today.m;
                        stDate.d = edDate.d = today.d;
                    } else {
                    	stDate.y = edDate.y = today.y;
                        stDate.m = edDate.m = today.m;
                        stDate.d = "01";
                        edDate.d = ""+ edt.getLastDate(today.y +""+ today.m +""+ today.d, null);
                    }
                    break;

                case "year" :
                    stDate = edt.getPrevDate(todayString, "year", null);
                    edDate = edt.getPrevDate(todayString, "year", null);

                    stDate.y = edDate.y = today.y;
                    stDate.m = "01";
                    stDate.d = "01";

                    edDate.m = "12";
                    edDate.d = "31";
                    break;

                case "nextYear" :
                    stDate = edt.getPrevDate(todayString, "year", null);
                    edDate = edt.getPrevDate(todayString, "year", null);
                    stDate.m = "01";
                    stDate.d = "01";
                    edDate.m = "12";
                    edDate.d = "31";
                    break;

                case "nextMonth" :
                    stDate = edt.getNextDate(todayString, "month", null);
                    edDate = edt.getNextDate(todayString, "month", null);
                    stDate.d = "01";
                    edDate.d = ""+ edt.getLastDate(stDate.y +""+ stDate.m +""+ stDate.d, null);
                    break;

                case "nextWeek" :
                    weekDate = edt.getWeekPeriod(edt.getNextDate(todayString, "week", null));
                    stDate = weekDate.st;
                    edDate = weekDate.ed;
                    break;

                case "1st" :
                    stDate.y = edDate.y = today.y;
                    stDate.m = "01";
                    stDate.d = "01";
                    edDate.m = "03";
                    edDate.d = ""+ edt.getLastDate(stDate.y +""+ edDate.m +""+ stDate.d, null);
                    break;

                case "2nd" :
                    stDate.y = edDate.y = today.y;
                    stDate.m = "04";
                    stDate.d = "01";
                    edDate.m = "06";
                    edDate.d = ""+ edt.getLastDate(stDate.y +""+ edDate.m +""+ stDate.d, null);
                    break;

                case "3rd" :
                    stDate.y = edDate.y = today.y;
                    stDate.m = "07";
                    stDate.d = "01";
                    edDate.m = "09";
                    edDate.d = ""+ edt.getLastDate(stDate.y +""+ edDate.m +""+ stDate.d, null);
                    break;

                case "4th" :
                    stDate.y = edDate.y = today.y;
                    stDate.m = "10";
                    stDate.d = "01";
                    edDate.m = "12";
                    edDate.d = ""+ edt.getLastDate(stDate.y +""+ edDate.m +""+ stDate.d, null);
                    break;

                case "1half" :
                    stDate.y = edDate.y = today.y;
                    stDate.m = "01";
                    stDate.d = "01";
                    edDate.m = "06";
                    edDate.d = ""+ edt.getLastDate(stDate.y +""+ edDate.m +""+ stDate.d, null);
                    break;

                case "2half" :
                    stDate.y = edDate.y = today.y;
                    stDate.m = "07";
                    stDate.d = "01";
                    edDate.m = "12";
                    edDate.d = ""+ edt.getLastDate(stDate.y +""+ edDate.m +""+ stDate.d, null);
                    break;

                case "1Day" :
                    stDate = edDate = period.end;
                    break;

                case "1Week" :
                    edDate = period.end;
                    stDate = edt.getPrevDate(period.end.y+""+period.end.m+period.end.d, "week", null);
                    break;

                case "1Month" :
                    edDate = period.end;
                    stDate = edt.getPrevDate(period.end.y+""+period.end.m+period.end.d, "month", null);
                    break;
                    
                case "range" :
                    stDate = period.start;
                    edDate = period.end;
                    break;
            }

            stDate.label = edt.getDateLabel(stDate);
            edDate.label = edt.getDateLabel(edDate);
            

            self.startDayList = self._getDayList(stDate);
            self.endDayList   = self._getDayList(edDate);

            period.start.y = stDate.y;
            period.start.m = stDate.m;
            period.start.d = stDate.d;
            period.start.label = stDate.label;
            period.end.y   = edDate.y;
            period.end.m   = edDate.m;
            period.end.d   = edDate.d;
            period.end.label = edDate.label;
        },

        /**
         * select 월이 바뀔경우 날짜 리스트를 가져온다.
         * @param kind
         * @param changeDate
         */
        changeMonth : function (kind, changeDate) {
            var lng;
            if (kind === "sm") {
                this.startDayList = this._getDayList(this.period.start);
                lng = this.startDayList.length;

                if (this.dateType === "month") { this.period.start.d = "01"; }
                if (this.period.start.d > lng) { this.period.start.d = ''+ lng; }

            } else if (kind === "em") {
                this.endDayList = this._getDayList(this.period.end);
                lng = ''+ this.endDayList.length;

                if (this.dateType === "month") { this.period.end.d = lng; }
                if (this.period.end.d > lng) { this.period.end.d = lng; }
            }

	        this.change(kind);
        },

	    change: function (kind) {
		    if (this.event.change) {
			    this.event.change();
		    }
		    
		    if(kind === "sm") {
		    	this.period.start.label = edt.getDateLabel(this.period.start);
		    } else if (kind === "em") {
		    	this.period.end.label = edt.getDateLabel(this.period.end);
		    }
	    },

        inquiry: function () {
            if (this.event.inquiry) {
                this.event.inquiry(this.period);
            }
        },

        /**
         * button 객체를 가져온다.
         * @param {string} btnType
         * @returns {DateButton|*}
         */
        getBtnData : function (btnType) {
            var self = this,
                compositeList = self.compositeList,
                i, lng, btn;

            for (i=0, lng=compositeList.length; i<lng; i+=1) {
                btn = compositeList[i];
                if (btn.type === btnType) { return btn; }
            }
        },

        /**
         * 버튼을 선택한다.
         * @param {DateButton} dateBtn
         */
        select : function (dateBtn) {
            if (this.cache) {
                this.unselect();
            }

            this.cache = dateBtn;
            this.selected = dateBtn.type;
            dateBtn.active = true;
            
            this.changeButton(dateBtn);
        },

        /**
         * 버튼 선택을 해제한다.
         */
        unselect : function () {
            this.cache.active = false;
        },

        /**
         * dateType이 range일 경우 범위선택 가능하게 설정한다.
         * @param {string} kind y|m|d
         * @returns {boolean}
         */
        isPeriodDisabled : function (kind) {
        	if (this.dateType==="market") {
        		return false;
        	}
        	
            if (this.cache.type !== "range") {
                return true;
            } else {
            	if (this.dateType==="month" && kind==="d") {
                    return true;
                } else {
                    return false;
                }
            }
        },

        /**
         *
         * @param {object} changeDate
         */
        setPeriod : function ( changeDate ) {
            this.period.start = changeDate.start;
            this.period.end   = changeDate.end;
        }
    };

    /**
     * @typedef {Object} ButtonDataSet
     * @property {string} id
     * @property {string} type
     */

    /**
     * DateButton
     * @param {ButtonDataSet} buttonDataSet
     * @tructor
     */
    var DateButton = function (buttonDataSet) {
        var self = this;
        self.id   = "";
        self.type = "";
        self.active = false;
        self.name = self._getKorTypeName(buttonDataSet.type);

        edt.extend(buttonDataSet, self, false);
    };

    DateButton.prototype = {

        /**
         * button 의 한글이름을 가져온다.
         * @param {string} btnType
         * @returns {string}
         * @private
         */
        _getKorTypeName : function (btnType) {
            var korName = {
                prevYear  : "이전년",
                prevMonth : "이전달",
                prevWeek  : "이전주",
                current   : "현재",
                year      : "연도",
                nextYear  : "다음년",
                nextMonth : "다음달",
                nextWeek  : "다음주",
                "1st"     : "1분기",
                "2nd"     : "2분기",
                "3rd"     : "3분기",
                "4th"     : "4분기",
                "1half"   : "전반기",
                "2half"   : "하반기",
                "1Day"    : "1일",
                "1Week"   : "1주일",
                "1Month"  : "1개월",
                range     : "범위선택"
            };

            return korName[btnType];
        }
    };

    angular.module("edtApp.common.directive")
        .controller("DateSearchGroupController", ["$scope", function ($scope) {
            var self = this;
            self.dateGroup = new DateGroup($scope.dateSearchGroup, $scope);
        }])

        .directive("dateSearchGroup", ["$timeout", function ( $timeout ) {
            return {
                priority    : 0,
                templateUrl : "dateSearchGroup/template",
                restrict    : "AE",
                scope       : {
                    dateSearchGroup : "="
                },
                controller  : "DateSearchGroupController",
                compile     : function () {
                    return {
                        post : function (scope, element, attrs, DateSearchGroupCtrl) {
                            var dateGroup = scope.dateGroup = DateSearchGroupCtrl.dateGroup;

	                        // component의 선택된 버튼이 변경되었을 경우
                            scope.$watch(function () { return dateGroup.selected; }, function (newVal, prevVal) {
                                if (newVal !== prevVal) {
                                    scope.dateSearchGroup.selected = newVal;
                                }
                            }, true);

	                        // 모델의 선택된 버튼의 이름이 변경되었을 경우
                            scope.$watch(function () { return scope.dateSearchGroup.selected; }, function (newVal, prevVal) {
                                if (newVal !== prevVal) {
	                                dateGroup.select( dateGroup.getBtnData( newVal ) );
	                                if (dateGroup.event.change) {
		                                dateGroup.event.change();
	                                }
                                }
                            }, true);

	                        // 모델의 기간이 변경되었을 경우
	                        scope.$watch(function () { return scope.dateSearchGroup.period; }, function ( newVal ) {
		                        dateGroup.period = newVal;
	                        }, true);

	                        // component의 시작기간이 변경되었을 경우
	                        scope.$watch(function () { return dateGroup.period.start; }, function ( newVal ) {
		                        scope.dateSearchGroup.period.start = newVal;
	                        }, true);

	                        // component의 종료기간이 변경되었을 경우
	                        scope.$watch(function () { return dateGroup.period.end; }, function ( newVal ) {
		                        scope.dateSearchGroup.period.end = newVal;
	                        }, true);
                        }
                    };
                }
            };
        }])

	    .run(['$templateCache', function ($templateCache) {
		    $templateCache.put('dateSearchGroup/template',
		        '<div class="date-search-group" role="group">' +
			    '   <div class="date-search-select-group">' +
				'       <select class="form-control" title="시작년 선택" data-ng-options="year+\'년\' for year in dateGroup.yearLsit track by year" data-ng-model="dateGroup.period.start.y"' +
				'           data-ng-disabled="dateGroup.isPeriodDisabled(\'y\')" data-ng-change="dateGroup.change(\'sm\')">' +
				'       </select>' +
				'       <select class="form-control" title="시작월 선택" data-ng-options="month+\'월\' for month in dateGroup.monthList track by month" data-ng-model="dateGroup.period.start.m"' +
				'           data-ng-disabled="dateGroup.isPeriodDisabled(\'m\')" data-ng-change="dateGroup.changeMonth(\'sm\')">' +
		        '       </select>' +
				'       <select class="form-control" title="시작일 선택" data-ng-options="day+\'일\' for day in dateGroup.startDayList track by day" data-ng-model="dateGroup.period.start.d"' +
				'           data-ng-disabled="dateGroup.isPeriodDisabled(\'d\')" data-ng-change="dateGroup.change(\'sm\')">' +
				'       </select><input type="text"  eden-type="kor" class="form-control" data-ng-model="dateGroup.period.start.label" disabled="disabled" style="width:60px"/>' +
				' ~ ' +
				'       <select class="form-control" title="종료년 선택" data-ng-options="year+\'년\' for year in dateGroup.yearLsit track by year" data-ng-model="dateGroup.period.end.y"' +
				'           data-ng-disabled="dateGroup.isPeriodDisabled(\'y\')" data-ng-change="dateGroup.change(\'em\')">' +
				'       </select>' +
				'       <select class="form-control" title="종료월 선택" data-ng-options="month+\'월\' for month in dateGroup.monthList track by month" data-ng-model="dateGroup.period.end.m"' +
				'           data-ng-disabled="dateGroup.isPeriodDisabled(\'m\')" data-ng-change="dateGroup.changeMonth(\'em\')">' +
				'       </select>' +
				'       <select class="form-control" title="종료일 선택" data-ng-options="day+\'일\' for day in dateGroup.endDayList track by day" data-ng-model="dateGroup.period.end.d"' +
				'           data-ng-disabled="dateGroup.isPeriodDisabled(\'d\')" data-ng-change="dateGroup.change(\'em\')">' +
				'       </select><input type="text"  eden-type="kor" class="form-control" data-ng-model="dateGroup.period.end.label" disabled="disabled" style="width:60px"/>' +
				'   </div>' +
			    '   <ul class="date-search-btn-group">' +
				'       <li data-ng-repeat="btn in dateGroup.compositeList track by btn.id" data-ng-class="{\'active\':btn.active}">' +
				'           <button type="button" title="" role="button" data-ng-click="dateGroup.select(btn)">{{btn.name}}</button>' +
			    '       </li>' +
			    '   </ul>' +
                '   <button data-ng-if="dateGroup.enableInqBtn" type="button" class="btn btn-primary btn-search" title="기간검색" data-ng-click="dateGroup.inquiry()">검색</button>' +
				'</div>'
		    );
	    }]);
}());