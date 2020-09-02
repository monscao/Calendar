//初始化页面
(function() {
    this.nowDate = new Date();
    this.nowYear = this.nowDate.getFullYear();
    this.nowMonth = this.nowDate.getMonth() + 1;
    this.render();
})()

//渲染函数
function render() {
    //渲染年份下拉框数据
    var currentYear = (new Date()).getFullYear();
    for(var i = 2017; i < currentYear; i ++) {
        $("#yearsSelector").append('<option value=' + i + '>' + i + '</option>');
    }
    $("#yearsSelector").append('<option value=' + currentYear + '>' + currentYear + '</option>')

    //渲染月份选择器表格
    for(var m = 0; m < 4; m ++) {
        $("#dateSelector").append('<tr></tr>');
        for(var n = 1; n < 4; n ++) {
        $("#dateSelector tr").eq(m).append('<td class="select-td"  month="' + (m*3 + n) + '">' +  (m*3 + n) + '月</td>');
        }
    }

    //隐藏日期选择框
    $(".date-content").hide();
    if(this.selectorStatus = "opened") {
        this.selectorStatus = "closed";
        $("#arrowDown").removeClass("arrow-top");
    }

    //添加点击事件监听器
    document.addEventListener("mousedown", function(e) {
        var target = e.target || e.srcElement;
        var tdClass = target.getAttribute("class");
        while (target != document) {
            target = target.parentNode;
        }

        $("#calendarTable td").removeClass("period-oneday");
        $("#calendarTable td").removeClass("period-begin");
        $("#calendarTable td").removeClass("period-between");
        $("#calendarTable td").removeClass("period-end");

        $("#calendarTable .period-box").hide();
        $(".task-container").removeClass("select-back");

        if((tdClass != "select-td") && (tdClass != "current-butt") && (tdClass != "years-selector") && (target == document)) {
            $(".date-content").hide();
            if(this.selectorStatus = "opened") {
                this.selectorStatus = "closed";
                $("#arrowDown").removeClass("arrow-top");
            }
        }
    }, false);

    //设置选中月背景色
    $("#dateSelector tr td").eq(this.nowMonth - 1).addClass("selected-month");

    //设置年份选择器的值
    $("#yearsSelector").val(this.nowYear);

    // 设置顶部标题栏中的 年、月信息
    var dateString = this.getDateString(this.nowDate);
    var titleStr = dateString.substr(0, 4) + "年" + dateString.substr(4,2) + "月";
    $("#calendarTitle").text(titleStr);

    //设置表格
    //trCount表示显示的日期行数(有些月份只用五行就可以完全显示)
    var trCount = (data.length == 35) ? 5 : 6;
    for(var i = 0; i < trCount; i ++) {
        $("#calendarTable").append('<tr style="border-bottom: 1px dashed #E4EDED; height: 36px"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr class="task-content" style="border-bottom: 1px dashed #E4EDED; height: 76px; vertical-align: baseline;"><th style="padding: 10px 0"></th><th style="padding: 10px 0"></th><th style="padding: 10px 0"></th><th style="padding: 10px 0"></th><th style="padding: 10px 0"></th><th style="padding: 10px 0"></th><th style="padding: 10px 0"></th></tr>');
    }
    // 设置表格中的日期数据
    var dateTds = $("#calendarTable td");
    var firstDay = new Date(this.nowYear, this.nowMonth - 1, 1);  // 当前月第一天
    for(var i = 0; i < dateTds.length; i ++) {
        var tableFirstDay = (new Date(this.nowYear, this.nowMonth - 1, 2 - firstDay.getDay())).getDate();
        var theDay = new Date(this.nowYear, this.nowMonth - 1, i + 2 - firstDay.getDay());
        if(firstDay.getDay() == 0) {
            theDay = new Date(this.nowYear, this.nowMonth - 1, i - 5 - firstDay.getDay());
        }
        var theDayString = this.getDateString(theDay);
        var theFormatDate = moment(theDay).format('YYYY-MM-DD');
        if(data[i].Holiday == "1") {
            dateTds[i].innerHTML = theDay.getDate() + "<span style='font-size: 14px; font-weight: 400 !important;'>" + "&nbsp&nbsp&nbsp&nbsp" + data[i].HolidayName + "</span>";
        } else {
            dateTds[i].innerHTML = theDay.getDate() + "<span style='font-size: 14px; font-weight: 400 !important;'>" + "&nbsp&nbsp&nbsp&nbsp" + this.getLunarCalendarTime(theFormatDate) + "</span>";
        }
        dateTds[i].setAttribute('data', theDayString);
        if (theDayString.substr(0, 6) == this.getDateString(firstDay).substr(0, 6)) { // 当前月
            if(data[i].Holiday == "1") {  //判断是否是节假日
                dateTds[i].className = "holiday-day";
                dateTds[i].innerHTML += "<span style='font-size: 14px; font-weight: 400 !important;'>（休）</span>"
            } else if(data[i].Holiday == "2") {
                dateTds[i].className = "holiday-day";
                dateTds[i].innerHTML += "<span style='font-size: 14px; font-weight: 400 !important;'>（班）</span>"
            } else {

            }
        } else {
            dateTds[i].className = "other-month"; // 其他月
            if(data[i].Holiday == "1") {  //判断是否是节假日
                dateTds[i].innerHTML += "<span style='font-size: 14px; font-weight: 400 !important;'>（休）</span>"
            } else if(data[i].Holiday == "2") {
                dateTds[i].innerHTML += "<span style='font-size: 14px; font-weight: 400 !important;'>（班）</span>"
            } else {

            }
        }
    }

    //填充表格中的任务数据
    var taskThs = $(".task-content th");
    for(var m = 0; m < taskThs.length; m ++) {
        var taskList = data[m].TaskInfos;
        var currentTh = $(".task-content th").eq(m);
        if(taskList.length > 0){
            for(var n = 0; n < taskList.length; n ++) {
                if (taskList[n].OverdueDay > 0) {
                    currentTh[0].innerHTML += '<div class="task-container"><span style="color: #FF7E00; display: inline-block; float: left;"><img src="assets/images/user_yellow.png"></img>' + taskList[n].ChargeName +
                        '</span><span style="font-weight: 400; width: 84%; display: inline-block; white-space: normal; margin-left: 5px;">' + taskList[n].TaskName +
                        '<div class="over-time" style="width: 78px; height: 22px; display: inline-block; margin-left: 5px; text-align: center;">逾期' + taskList[n].OverdueDay + '天</div>' +
                        '</span><div class="period-box"><span class="task-title">任务时间</span><span class="period-content">' + taskList[n].StartTime + ' ~ ' + taskList[n].EndTime + '</span></div></div>'
                } else if (taskList[n].OverdueDay == 0 || taskList[n].OverdueDay == -1) {
                    currentTh[0].innerHTML += '<div class="task-container"><span style="display: inline-block;"><span style="color: #00A189; display: inline-block; float: left;"><img src="assets/images/user_green.png"></img>' + taskList[n].ChargeName +
                        '</span><span style="font-weight: 400; width: 84%; display: inline-block; white-space: normal; margin-left: 5px;">' + taskList[n].TaskName +
                        '</span></span><div class="period-box"><span class="task-title">任务时间</span><span class="period-content">' + taskList[n].StartTime + ' ~ ' + taskList[n].EndTime + '</span></div></div>'
                } else {
                    currentTh[0].innerHTML += '<div class="task-container"><span style="color: #00A189; display: inline-block; float: left;"><img src="assets/images/user_green.png"></img>' + taskList[n].ChargeName +
                        '</span><span style="font-weight: 400; width: 84%; display: inline-block; white-space: normal; margin-left: 5px;">' + taskList[n].TaskName +
                        '<div class="task-finished" style="width: 60px; height: 22px; text-align: center;">已完成</div>' +
                        '</span><div class="period-box"><span class="task-title">任务时间</span><span class="period-content">' + taskList[n].StartTime + ' ~ ' + taskList[n].EndTime + '</span></div><div>'
                }
                currentTh[0].children[n].setAttribute('taskId', n);
                currentTh[0].children[n].setAttribute('thId', m);
            }
        }
    }
    //隐藏任务周期框
    $("#calendarTable .period-box").hide();
}

// 日期转化为字符串， 4位年+2位月+2位日
function getDateString(date) {
    var thisYear = date.getFullYear();
    var thisMonth = date.getMonth() + 1;// 月从0开始计数
    var thisDay = date.getDate();
    thisMonth = (thisMonth > 9) ? ("" + thisMonth) : ("0" + thisMonth);
    thisDay = (thisDay > 9) ? ("" + thisDay) : ("0" + thisDay);
    return thisYear + thisMonth + thisDay;
}

//打开日期选择框
function showSelect() {
    this.selectorStatus = "opened";
    $("#arrowDown").addClass("arrow-top");
    $(".date-content").show();
}

//切换月份
// function switchMonth(e) {
//     var date = this.nowDate;
//     var nextMonth = $(e.currentTarget).attr("month");
//     $("#dateSelector tr td").removeClass("selected-month");
//     $(e.currentTarget).addClass("selected-month");
//     this.nowDate = new Date(date.getFullYear(), nextMonth - 1, 1);
//     this.render();
// }
$("#dateSelector tr td").click(function(e) {
    var date = this.nowDate;
    var nextMonth = $(e.currentTarget).attr("month");
    $("#dateSelector tr td").removeClass("selected-month");
    $(e.currentTarget).addClass("selected-month");
    this.nowDate = new Date(date.getFullYear(), nextMonth - 1, 1);
    this.render();
})

//切换到当前月份
function switchCurrentMonth() {
    var nowadaysMonth = (new Date()).getMonth();
    var nowadaysYear = (new Date()).getFullYear();
    this.nowDate = new Date(nowadaysYear, nowadaysMonth, 1);
    this.render();
}

//切换年份
function changeYears() {
    this.selectedYear = $("#yearsSelector").val();
    this.nowDate = new Date(this.selectedYear, 0, 1);
    this.render();
}

//查看任务周期
$(".task-container").click(function(e) {

    //清除其他容器样式
    $("#calendarTable td").removeClass("period-oneday");
    $("#calendarTable td").removeClass("period-begin");
    $("#calendarTable td").removeClass("period-between");
    $("#calendarTable td").removeClass("period-end");

    //当前点击的容器属性
    var thId = parseInt($(e.currentTarget).attr("thId"));
    var taskId = parseInt($(e.currentTarget).attr("taskId"));

    //对应容器的任务信息
    var tdContent = data[thId].TaskInfos;
    var taskContent = tdContent[taskId];

    //开始时间、结束时间、日历第一天时间、日历最后一天时间
    var beginDate = taskContent.StartTime;
    var endDate = taskContent.EndTime;
    var firstDay = data[0].Date;
    var lastDay = data[data.length - 1].Date;

    //开始结束时间相差的时间差
    var yersOfDifference = parseInt(endDate.slice(0, 4)) - parseInt(beginDate.slice(0, 4));
    var monthsOfDifference = parseInt(endDate.slice(5, 7)) - parseInt(beginDate.slice(5, 7));
    var daysOfDifference = parseInt(endDate.slice(8)) - parseInt(beginDate.slice(8));

    //显示弹出框
    $(e.currentTarget).find(".period-box").show();

    //添加样式
    $(e.currentTarget).addClass("select-back");

    if(yersOfDifference > 0 || monthsOfDifference > 1) {

        //当周期大于一年或者大于一个月
        for (var i = thId + 1; i < data.length - 1; i++) {
            $("#calendarTable td").eq(i).addClass("period-between");
        }
        $("#calendarTable td").eq(thId).addClass("period-begin");
        $("#calendarTable td:last").addClass("period-end");
    } else if (monthsOfDifference == 1) {

        //当周期相差一个月
        if (parseInt(beginDate.slice(5, 7)) < this.nowMonth) {

            //当开始时间在上一个月(本月显示范围内)
            var diffBegin = parseInt(beginDate.slice(8)) - parseInt(firstDay.slice(8));
            var beginMonth = parseInt(firstDay.slice(5, 7));
            var beginMonthLastDay = (new Date(this.nowYear, beginMonth, 0)).getDay();
            for (var i = diffBegin + 1; i < parseInt(endDate.slice(8)) + beginMonthLastDay - 1; i++) {
                $("#calendarTable td").eq(i).addClass("period-between");
            }
            $("#calendarTable td").eq(thId).addClass("period-begin");
            $("#calendarTable td").eq(parseInt(endDate.slice(8)) + beginMonthLastDay - 1).addClass("period-end");
        } else {

            //当开始时间在这个月以及下个月(本月显示范围内)
            var diffEnd = parseInt(endDate.slice(8)) - parseInt(lastDay.slice(8));
            if (diffEnd > 0) {

                //当结束时间超出本月显示范围
                for (var i = thId + 1; i < data.length; i++) {
                    $("#calendarTable td").eq(i).addClass("period-between");
                }
                $("#calendarTable td").eq(thId).addClass("period-begin");
            } else {

                //当结束时间在本月显示范围
                for (var i = thId + 1; i < data.length - 1 + diffEnd; i++) {
                    $("#calendarTable td").eq(i).addClass("period-between");
                }
                $("#calendarTable td").eq(thId).addClass("period-begin");
                $("#calendarTable td").eq(data.length - 1 + diffEnd).addClass("period-end");
            }
        }
    } else if (daysOfDifference == 0) {

        //当开始时间和结束时间在同一天
        $("#calendarTable td").eq(thId).addClass("period-oneday");
    } else {

        //当开始时间和结束时间均在本月之内
        for (var i = thId + 1; i < thId + daysOfDifference; i++) {
            $("#calendarTable td").eq(i).addClass("period-between");
        }
        $("#calendarTable td").eq(thId).addClass("period-begin");
        $("#calendarTable td").eq(thId + daysOfDifference).addClass("period-end");
    }
})

//农历转换 传入格式为(YYYY-MM-DD)
function getLunarCalendarTime(time) {
    var CalendarData = new Array(100);
    var madd = new Array(12);
    var tgString = "甲乙丙丁戊己庚辛壬癸";
    var dzString = "子丑寅卯辰巳午未申酉戌亥";
    var numString = "一二三四五六七八九十";
    var monString = "正二三四五六七八九十冬腊";
    var weekString = "日一二三四五六";
    var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
    var cYear, cMonth, cDay, TheDate;
    CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);
    madd[0] = 0;
    madd[1] = 31;
    madd[2] = 59;
    madd[3] = 90;
    madd[4] = 120;
    madd[5] = 151;
    madd[6] = 181;
    madd[7] = 212;
    madd[8] = 243;
    madd[9] = 273;
    madd[10] = 304;
    madd[11] = 334;

    function GetBit(m, n) {
        return (m >> n) & 1;
    }
    function e2c() {
        TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
        var total, m, n, k;
        var isEnd = false;
        var tmp = TheDate.getYear();
        if (tmp < 1900) {
            tmp += 1900;
        }
        total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;

        if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
            total++;
        }
        for (m = 0; ; m++) {
            k = (CalendarData[m] < 0xfff) ? 11 : 12;
            for (n = k; n >= 0; n--) {
                if (total <= 29 + GetBit(CalendarData[m], n)) {
                    isEnd = true; break;
                }
                total = total - 29 - GetBit(CalendarData[m], n);
            }
            if (isEnd) break;
        }
        cYear = 1921 + m;
        cMonth = k - n + 1;
        cDay = total;
        if (k == 12) {
            if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
                cMonth = 1 - cMonth;
            }
            if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
                cMonth--;
            }
        }
    }

    function GetcDateString() {
        var tmp = "";
        // tmp += tgString.charAt((cYear - 4) % 10);
        // tmp += dzString.charAt((cYear - 4) % 12);
        // tmp += "(";
        // tmp += sx.charAt((cYear - 4) % 12);
        // tmp += ")年 ";
        // if (cMonth < 1) {
        //     tmp += "(闰)";
        //     tmp += monString.charAt(-cMonth - 1);
        // } else {
        //     tmp += monString.charAt(cMonth - 1);
        // }
        // tmp += "月";
        tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? ((cDay == 20) ? "廿十" : "廿") : "三十"));
        if (cDay % 10 != 0 || cDay == 10) {
            tmp += numString.charAt((cDay - 1) % 10);
        }
        return tmp;
    }

    function GetLunarDay(solarYear, solarMonth, solarDay) {
        //solarYear = solarYear<1900?(1900+solarYear):solarYear;
        if (solarYear < 1921 || solarYear > 2020) {
            return "";
        } else {
            solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
            e2c(solarYear, solarMonth, solarDay);
            return GetcDateString();
        }
    }

    var YY = moment(new Date(time)).format('yyyy');
    var MM = moment(new Date(time)).format('MM');
    var DD = moment(new Date(time)).format('DD');

    return GetLunarDay(YY, MM, DD)
}
