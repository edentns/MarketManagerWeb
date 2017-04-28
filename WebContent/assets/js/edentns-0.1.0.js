(function (window) {
    "use strict";

    var slice 	 = [].slice,
        toString = {}.toString;

    /**
     * @namespace edt
     * @type {{extend: Function, id: Function, className: Function, tagName: Function, name: Function, query: Function, makeId: Function}}
     */
    var edt = {
        /**
         * 객체를 복사한다.
         * @param target
         * @param destination
         * @param depth
         * @returns {*|{}}
         */
        extend : function (target, destination, depth) {
            destination = destination || {};
            depth = depth || false;

            var self = this,
                key;

            for (key in target) {
                if (target.hasOwnProperty(key)) {
                    if (typeof target[key] === "object") {
                        if (depth) {
                            destination[key] = (toString.call(target[key]) === "[object Array]") ? [] : {};
                            self.extend(target[key], destination[key]);
                        } else {
                            destination[key] = target[key];
                        }

                    } else {
                        destination[key] = target[key];
                    }
                }
            }
            return destination;
        },

        /**
         * id를 가진 element를 가져온다.
         * @param {string} query query selector
         * @returns {element}
         */
        id: function (query) {
            query = ""+ query;
            return document.getElementById(query);
        },

        /**
         * class를 가진 element를 가져온다.
         * @param {string} query query selector
         * @returns {Array<element>}
         */
        className: function (query) {
            query = ""+ query;
            return slice.call(document.getElementsByClassName(query));
        },

        /**
         * tag를 가진 element를 가져온다.
         * @param {string} query query selector
         * @returns {Array<element>}
         */
        tagName: function (query) {
            query = ""+ query;
            return slice.call(document.getElementsByClassName(query));
        },

        /**
         * name을 가진 element를 가져온다.
         * @param {string} query query selector
         * @returns {Array<element>}
         */
        name: function (query) {
            query = ""+ query;
            return slice.call(document.getElementsByClassName(query));
        },

        /**
         * selectory와 일치하는 element를 가져온다.
         * @param {string} query query selector
         * @returns {Array<element>}
         */
        query: function (query) {
            query = ""+ query;
            return slice.call(document.querySelectorAll(query));
        },

        /**
         * id를 생성한다.
         * @param {number} num
         * @returns {number}
         */
        makeId : function (num) {
            return new Date().getTime() + num;
        }
    };


    edt.extend({
        constant : {
            /**
             * key code
             */
            keymap : {
                tab      : 9,
                strg     : 17,
                ctrl     : 17,
                ctrlright: 18,
                ctrlr    : 18,
                shift    : 16,
                return   : 13,
                enter    : 13,
                backspace: 8,
                bcksp    : 8,
                alt      : 18,
                altr     : 17,
                altright : 17,
                space    : 32,
                win      : 91,
                mac      : 91,
                fn       : null,
                up       : 38,
                down     : 40,
                left     : 37,
                right    : 39,
                esc      : 27,
                del      : 46,
                f1       : 112,
                f2       : 113,
                f3       : 114,
                f4       : 115,
                f5       : 116,
                f6       : 117,
                f7       : 118,
                f8       : 119,
                f9       : 120,
                f10      : 121,
                f11      : 122,
                f12      : 123
            },

            /**
             * ascii code
             */
            asc : {
                eng : 65
            },

            /**
             * element
             */
            element : {
                scrollWidth : 17
            }
        }
    }, edt, true);


// dom
    edt.extend({
        /**
         * element의 value를 선택한다.
         * @param {element} elem
         */
        selectValue : function (elem) {
            if (this.isValid(elem)) {
                elem.select();
            }
        },

        /**
         * get client width(width padding)
         * @param {element} elem
         * @returns {number}
         */
        getClientWidth : function (elem) {
            return elem.clientWidth;
        },

        /**
         * get client height(width padding)
         * @param {element} elem
         * @returns {number}
         */
        getClientHeight : function (elem) {
            return elem.clientHeight;
        },

        /**
         * get offset width(width padding, border, scrollbar)
         * @param {element} elem
         * @returns {number}
         */
        getOffsetWidth : function (elem) {
            return elem.offsetWidth;
        },

        /**
         * get offset height(width padding, border, scrollbar)
         * @param {element} elem
         * @returns {number}
         */
        getOffsetHeight : function (elem) {
            return elem.offsetHeight;
        },

        /**
         * get scroll top
         * @param {element} elem
         * @returns {number}
         */
        getScrollTop : function (elem) {
            return elem.scrollTop;
        },

        /**
         * get scroll width
         * @param {element} elem
         * @returns {number}
         */
        getScrollLeft : function (elem) {
            return elem.scrollLeft;
        }
    }, edt, true);


// valid
    edt.extend({
        /**
         * object인지 판단한다.
         * @param {*} obj
         * @returns {boolean}
         */
        isObject : function (obj) {
            return typeof obj === "object";
        },

        /**
         * 입력받은 데이터가 유효한지 확인하다.
         * @param {*} obj
         * @returns {boolean}
         */
        isValid: function (obj) {
            return obj!==undefined && obj!=="";
        },

        /**
         * 입력받은 데이터가 문자인지 확인한다.
         */
        isString : function (obj) {
            return typeof obj === "string";
        },

        /**
         * 입력받은 데이터가 숫자인지 확인하다.
         * @param {*} obj
         * @returns {boolean}
         */
        isNumber: function (obj) {
            return typeof obj==="number" && isFinite(obj);
        },

        /**
         * array인지 판단한다.
         * @param obj
         * @returns {boolean}
         */
        isArray : function (obj) {
            if (Array.isArray) {
                return Array.isArray(obj);
            } else {
                return toString.call(obj) === "[object Array]";
            }
        },

        /**
         * function 인지 판단한다.
         * @param obj
         * @returns {boolean}
         */
        isFunction : function (obj) {
            return toString.call(obj) === "[object Function]";
        },

        /**
         * 입력바은 데이터에 해당 문자열이 존재하는지 체크한다.
         * @param {string} data
         * @param {string} val 찾을 문자열
         */
        hasValue: function (data, val) {
            data = ""+data;
            return data.indexOf(val) > -1;
        }
    }, edt, true);


    // util
    edt.extend({
        /**
         * prototype을 이용하여 부모객체를 상속받는다.
         * @param {object} parent 상속받을 prototype
         * @param {object} source 생성된 Object에 추가될 instance
         * @returns {object}
         */
        create: function (parent, source ) {
            function Child() {}
            Child.prototype = parent;
            var childObj = new Child();
            for ( var el in source ) {
                if ( source.hasOwnProperty( el ) ) {
                    childObj[el] = source[el];
                }
            }
            return childObj;
        },

        each : function (data, key, fCallback) {
            var i, lng, o, res;

            if (arguments.length===2 && this.isFunction(key)) {
                fCallback = key;
                for (i=0, lng=data.length; i<lng; i+=1) {
                    o = data[i];
                    res = fCallback(o, i);
	                if (res === false) { return false; }
                }

            } else {
                this.traverseChildren(data, key, fCallback);
            }
        },

        traverseChildren : function (data, key, fCallback) {
            var i, lng, o, res;
            if (this.isArray(data)) {
                for (i=0, lng=data.length; i<lng; i+=1) {
                    o = data[i];

                    res = fCallback(o);
	                if (res === false) { return false; }
                    if (this.isArray(o[key]) && o[key].length>0) { this.traverseChildren(o[key], key, fCallback); }
                }

            } else {
                if (data) {
	                res = fCallback(data);
	                if (res === false) { return false; }

                    o = data[key];
                    if (o) {
                        this.traverseChildren(o, key, fCallback);
                    }
                }
            }
        },

        getKeyValue: function  (data, key, pos) {
            switch (pos) {
                case 'node': return data.data[key];
                case 'value': return data[key].value;
                default: return data[key];
            }
        },

        getNotEqualData: function (dataList, compareDataList, key, option) {
            var compare = function (po) {
                    var state = false,
                        pos = {
                            data1: '',
                            data2: ''
                        },
                        j, lng2, o2;

                    if (pos) { angular.extend(pos, option); }

                    for (j=0, lng2=compareDataList.length; j<lng2; j+=1) {
                        o2 = compareDataList[j];
                        if (edt.getKeyValue(po, key, pos.data1) === edt.getKeyValue(o2, key, pos.data2)) { return true; }
                    }
                    return state;
                },
                rtnData = [],
                i, lng1, o1;

            for (i=0, lng1=dataList.length; i<lng1; i+=1) {
                o1 = dataList[i];
                if (!compare(o1)) { rtnData.push(o1); }
            }

            return rtnData;
        },

        /**
         * 리스트에서 일치하는 객체 하나를 반환한다.
         * @param {array} list
         * @param {string} key
         * @param {string} val
         * @returns {object|null}
         */
        findOne : function (list, key, val) {
            var i, lng, o=null;
            for (i=0, lng=list.length; i<lng; i+=1) {
                o = list[i];
                if (o[key] === val) {return o;}
            }
            return null;
        },

	    /**
	     * 리스트에 일치하는 객체를 모두 반환한다.
	     * @param {Array} data
	     * @param {string} key
	     * @param {*} val
	     * @returns {Array}
	     */
	    findAll : function (data, key, val) {
		    if (!Array.isArray(data)) { return []; }

		    var i, lng, findList = [];
		    for (i=0, lng=data.length; i<lng; i+=1) {
				if (data[i][key] === val) { findList.push(data[i]); }
		    }

		    return findList;
	    },

        /**
         * 배열을 sorting한다.
         * @param {array} pData sorting할 데이터
         * @param {string} pField 비교할 Field
         * @param {string} pSort sorting 기준(ASC | DESC)
         * @returns {array}
         */
        sort : function (pData, pField, pSort) {
            if (!pData || pData.length===0 || !pField ) {
                return pData;
            }

            pSort = ( pSort ) ? pSort.toUpperCase() : "ASC";
            pData.sort(function ( a, b) {
                var val1 = ""+ a[ pField],
                    val2 = ""+ b[ pField ];

                if ( pSort === "ASC" ) {
                    if ( val1 > val2 ) {
                        return 1;
                    } else if ( val1 < val2 ) {
                        return -1;
                    } else {
                        return 0;
                    }
                } else if ( pSort === "DESC" ) {
                    if ( val1 < val2 ) {
                        return 1;
                    } else if ( val1 > val2 ) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
            });

            return pData;
        },

        /**
         * 자릿수가 부족할 때 원하는 문자로 빈자리를 채운다.
         * @param {string} word 자릿수를 채울 문자
         * @param {number} num default 자릿수는 2자리
         * @param {string} char default로 채울 문자는 '0'
         * @param {string} direction default 방향은 front(앞쪽)에 붙는다.
         * @returns {string}
         */
        fillSpace: function (word, num, char, direction) {
            word = ""+ word;
            num = num || 2;
            char = char || "0";
            direction = direction || "front";

            while (word.length < num) {
                if (direction === "front") { word = char + word; }
                else { word = word + char; }
            }
            return word;
        },

        /**
         * 원하는 소수점자리에서 버림한다.
         * @param {number|string} num
         * @param {number} digit
         * @returns {string}
         * @example
         * edt.mathFloor(1345.229, 2); => expect: 1345.22
         */
        mathFloor: function (num, digit) {
            num = ""+ num;
            var commaIdx = num.indexOf("."),
                numLng = num.length,
                pow = Math.pow( 10, digit);

            if (commaIdx > -1) {
                if (numLng - (commaIdx+1) < digit) {
                    num = this.formatPriceFloat(num, digit);

                } else {
                    num = Math.floor(num * pow) / pow;
                    if ( String(num).indexOf(".") > -1 ) {
                        num = this.formatPriceFloat(num, digit);
                    } else {
                        num = this.formatPrice(num) +"."+ this.fillSpace("", digit, "0", "back");
                    }
                }
            } else {
                num = this.formatPrice(num) +"."+ this.fillSpace("", digit, "0", "back");
            }

            return num;
        },

        /**
         * 원하는 소수점자리에서 올림한다.
         * @param {number} num
         * @param {number} digit
         * @example
         * edt.mathFloor(1345.221, 2); => expect: 1345.23
         */
        mathCeil: function (num, digit) {
            var pow = Math.pow( 10, digit );
            num = Math.ceil(num * pow) / pow;

            return num;
        },


	    /**
	     * 단일 배열의 max와 min 값을 구한다.
	     * @param {array} data 데이터
	     * @returns {{max: number, min: number}}
	     */
	    getMaxMin: function (data) {
		    var max = 0,
			    min = 0;

		    if (Array.isArray(data) && data.length > 0) {
			    max = data.reduce(function (current, next) {
				    return current > next ? current : next;
			    });
			    min = data.reduce(function (current, next) {
				    return current < next ? current : next;
			    });
		    }

		    return { max: max, min: min };
	    }
    }, edt, true);

// format
    edt.extend({
        /**
         * 3자리마다 ,를 찍는다.
         * @param {string|number} price
         * @returns {string}
         * @example
         * edt.formatPrice(3323); => expect: '3,323'
         */
        formatPrice: function (price) {
            price = ""+ price;
            var reg = /(^[+-]?\d+)(\d{3})/;
            while (reg.test(price)){
                price = price.replace(reg, "$1" + "," + "$2");
            }
            return price;
        },

        /**
         * 실수를 포멧팅한다.
         * @param {string|number} num
         * @param {number} digit
         * @returns {string}
         */
        formatPriceFloat: function (num, digit) {
            var splitArr = (""+num).split(".");

            digit = digit || splitArr[1].length;

            splitArr[0] = this.formatPrice(splitArr[0]);
            splitArr[1] = this.fillSpace(splitArr[1], digit, "0", "back");
            return num = splitArr.join(".");
        }
    }, edt);


// date
    edt.extend({
        /**
         * 오늘 날짜를 구한다.
         * @returns {{y:string, m:string, d:string, dow:number, quarter:number}}
         */
        getToday : function () {
            var date = new Date(),

                y = ""+ date.getFullYear(),
                m = this.fillSpace(date.getMonth()+1),
                d = this.fillSpace(date.getDate()),
                quarter = ((m/3)+0.9) >> 0;

            return {
                y: y,
                m: m,
                d: d,
                dow: date.getDay(),
                quarter: quarter
            };
        },

        /**
         * 현재 분기 이름을 구한다.
         * @param {number} month
         * @param {string} type abb|kor
         * @returns {string}
         */
        getQuarterName : function (month, type) {
            month = Number(month);
            if (!edt.isNumber(month)) {
                throw new Error("This type is no number.");
            }

            var kor = ["1분기", "2분기", "3분기", "4분기"],
                abb = ["1st", "2nd", "3rd", "4th"];

            switch(type) {
                case "abb" :
                    return abb[month-1];
                case "kor" :
                    return kor[month-1];
                default :
                    return abb[month-1];
            }
        },

        /**
         * 두날짜의 차이 일을 구한다.
         * @param {string|date} stDate
         * @param {string|date} edDate
         * @returns {number}
         */
        getDitcDay : function (stDate, edDate) {
            var dayValue = 1000*60*60*24,
                dStart = new Date(stDate),
                dEnd = new Date(edDate);

            return Math.round((dEnd-dStart)/dayValue);
        },

        /**
         * 두날짜의 차이 월을 구한다.
         * @param {string|date} stDate
         * @param {string|date} edDate
         * @returns {number}
         */
        getDitcMonth : function (stDate, edDate) {
            var monthValue = 1000*60*60*24*30,
                dStart = new Date(stDate),
                dEnd = new Date(edDate);

            return Math.round((dEnd-dStart)/monthValue);
        },

        /**
         * 두날짜의 차이 년을 구한다.
         * @param {string|date} stDate
         * @param {string|date} edDate
         * @returns {number}
         */
        getDitcYear : function (stDate, edDate) {
            var yearValue = 1000*60*60*24*30*12,
                dStart = new Date(stDate),
                dEnd = new Date(edDate);

            return Math.round((dEnd-dStart)/yearValue);

        },

        /**
         * 날짜가 유효한지 판단한다.
         * @param {(string|date)} stDate
         * @param {(string|date)} edDate
         * @returns {number}
         */
        getDitcValid : function (stDate, edDate) {
            var dStart = new Date(stDate),
                dEnd = new Date(edDate);

            return (dEnd-dStart)>=0;
        },

        /**
         * 해당 년월의 마지막 일자를 구한다.
         * @param {string} date
         * @param {string=} char
         * @returns {boolean}
         */
        getLastDate: function (date, char) {
            var lng = date.length,
                splitArr, year, month;

            if (char) {
                splitArr = date.split(char);
                year  = splitArr[0];
                month = splitArr[1];
            } else {
                if (date.indexOf("-") === -1) {
                    year  = date.substring(0,4);
                    month = date.substring(4,6);
                } else {
                    splitArr = date.split("-");
                    year  = splitArr[0];
                    month = splitArr[1];
                }
            }

            return new Date(new Date(year, month, 1) - 86400000).getDate();
        },

        /**
         * 이전 날짜를 구한다.
         * @param {string} date
         * @param {string|number} term
         * @param {(string)} char
         * @returns {{y:string, m:string, d:string, dow:number}}
         */
        getPrevDate : function (date, term, char) {
            var curDate = this.getObjectDate(date, char),
                changeDate = new Date(),
                compositeDate, lastDate;

            if (this.isString(term)) {
                switch (term) {
                    case "day" :
                        changeDate.setFullYear(curDate.y, curDate.m-1, curDate.d-1);
                        break;

                    case "week" :
                        changeDate.setFullYear(curDate.y, curDate.m-1, curDate.d-7);
                        break;

                    case "month" :
                        if (curDate.m-1 === 0) {
                            curDate.y = String(curDate.y-1);
                            curDate.m = "12";
                        } else { curDate.m = this.fillSpace(curDate.m-1); }
                        compositeDate = curDate.y +""+ curDate.m+ "" +curDate.d;

                        lastDate = this.getLastDate(compositeDate, char);
                        if (lastDate < Number(curDate.d)) { curDate.d = lastDate; }

                        changeDate.setFullYear(curDate.y, curDate.m-1, Number(curDate.d));
                        break;

                    case "year" :
                        lastDate = this.getLastDate((curDate.y-1)+""+curDate.m+""+curDate.d, char);
                        if (lastDate < Number(curDate.d)) { curDate.d = lastDate; }

                        changeDate.setFullYear(curDate.y-1, curDate.m-1, curDate.d);
                        break;
                }

            } else {
                changeDate.setFullYear(curDate.y, curDate.m-1, curDate.d-term);
            }

            return {
                y : String(changeDate.getFullYear()),
                m : this.fillSpace(changeDate.getMonth()+1),
                d : this.fillSpace(changeDate.getDate()),
                dow : changeDate.getDay()
            }
        },

        /**
         * 다음 날짜를 구한다.
         * @param {string} date
         * @param {string|number} term
         * @param {(string)} char
         * @returns {{y:string, m:string, d:string, dow:number}}
         */
        getNextDate : function (date, term, char) {
            var curDate = this.getObjectDate(date, char),
                changeDate = new Date(),
                compositeDate, lastDate;

            if (this.isString(term)) {
                switch (term) {
                    case "day" :
                        changeDate.setFullYear(curDate.y, curDate.m-1, Number(curDate.d)+1);
                        break;

                    case "week" :
                        changeDate.setFullYear(curDate.y, curDate.m-1, Number(curDate.d)+7);
                        break;

                    case "month" :
                        if (Number(curDate.m)+1 === 13) {
                            curDate.y = String(Number(curDate.y)+1);
                            curDate.m = "01";
                        } else { curDate.m = this.fillSpace(Number(curDate.m)+1); }
                        compositeDate = curDate.y +""+ curDate.m+ "" +curDate.d;

                        lastDate = this.getLastDate(compositeDate, char);
                        if (lastDate < Number(curDate.d)) { curDate.d = lastDate; }

                        changeDate.setFullYear(curDate.y, curDate.m-1, curDate.d);
                        break;

                    case "year" :
                        lastDate = this.getLastDate((Number(curDate.y)+1)+""+curDate.m+""+curDate.d, char);
                        if (lastDate < Number(curDate.d)) { curDate.d = lastDate; }

                        changeDate.setFullYear(Number(curDate.y)+1, curDate.m-1, curDate.d);
                        break;
                }

            } else {
                changeDate.setFullYear(curDate.y, curDate.m-1, curDate.d-term);
            }

            return {
                y : String(changeDate.getFullYear()),
                m : this.fillSpace(changeDate.getMonth()+1),
                d : this.fillSpace(changeDate.getDate()),
                dow : changeDate.getDay()
            };
        },

        /**
         * week기간을 구한다.
         * @param {{y:string, m:string, d:string, dow:number}} dateDataSet
         * @returns {{st:{y:string, m:string, d:string}, ed:{y:string, m:string, d:string}}}
         */
        getWeekPeriod : function (dateDataSet) {
            var stDate = new Date(dateDataSet.y, dateDataSet.m-1, dateDataSet.d-dateDataSet.dow),
                edDate = new Date(dateDataSet.y, dateDataSet.m-1, Number(dateDataSet.d)+(6-dateDataSet.dow));

            return {
                st : {
                    y : String(stDate.getFullYear()),
                    m : this.fillSpace(stDate.getMonth()+1),
                    d : this.fillSpace(stDate.getDate())
                },
                ed : {
                    y : String(edDate.getFullYear()),
                    m : this.fillSpace(edDate.getMonth()+1),
                    d : this.fillSpace(edDate.getDate())
                }
            };
        },
        
        /**
         * 현재 날짜를 object타입으로 구한다.
         * @param {string} date
         * @param {string} char
         * @returns {{y: string, m: string, d: string}}
         */
        getObjectDate : function (date, char) {
            var split = [];
            if (char) {
                split = date.split(char);

            } else {
                if (date.indexOf("-") === -1) {
                    split[0] = date.substring(0,4);
                    split[1] = date.substring(4,6);
                    split[2] = date.substring(6,8);
                } else {
                    split = date.split("-");
                }
            }
            return {y: split[0], m: split[1], d: split[2]};
        },
        
        /**
         * 날짜의 요일을 구한다.
         * @param {string} date
         * @returns {'월요일'}
         */
        getDateLabel : function (date) {
        	var week       = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'),
                inDate = new Date();
        	inDate.setFullYear(date.y, date.m-1, date.d);
        	var todayLabel = week[inDate.getDay()]; 
        	return todayLabel; 
        }
    }, edt);

    window.edt = edt;

}(window));