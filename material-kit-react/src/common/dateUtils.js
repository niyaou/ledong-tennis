/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-04-18 12:06:15
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-18 12:06:16
 * @content: edit your page content
 */
/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-02 11:36:47
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-08 11:30:34
 * @content: edit your page content
 */
import moment from 'moment';


export function fileLengthFormat(total, n) {
    var format;
    var len = total / (1024.0);
    if (len > 1000) {
        // return arguments.callee(len, ++n);
        return fileLengthFormat(len, ++n);
    } else {
        switch (n) {
            case 1:
                format = len.toFixed(1) + "KB";
                break;
            case 2:
                format = len.toFixed(1) + "MB";
                break;
            case 3:
                format = len.toFixed(1) + "GB";
                break;
            case 4:
                format = len.toFixed(1) + "TB";
                break;
            default:
                format = 0 + 'KB'
        }
        return format;
    }
}


export function numberFormat(total, n) {
    var format;
    var len = total / (1000.0);
    
    if (len > 1000) {
        // return arguments.callee(len, ++n);
        return fileLengthFormat(len, ++n);
    } else {
        switch (n) {
            case 1:
                format = len.toFixed(1) + "K";
                break;
            case 2:
                format = len.toFixed(1) + "M";
                break;
            case 3:
                format = len.toFixed(1) + "G";
                break;
            case 4:
                format = len.toFixed(1) + "T";
                break;
            default:
                format = 0 + 'K'
        }
        if(total<1000){
            format= total
        }
        return format;
    }
}


export function timeFix() {
    const time = new Date()
    const hour = time.getHours()
    return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
    if (id === '') {
        return
    }
    setTimeout(() => {
        document.body.removeChild(document.getElementById(id))
    }, timeout)
}

/**
 * 获取当前时间yyyymmddhhssmm
 */
export function dateTime() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    const time = year.toString() + month + day + hours + minutes + seconds
    // 拼接
    return time
}


export function format(timestamp, fmt) {
    let time = new Date(timestamp)
    var o = {
        "M+": time.getMonth() + 1,                 //月份 
        "d+": time.getDate(),                    //日 
        "h+": time.getHours(),                   //小时 
        "m+": time.getMinutes(),                 //分 
        "s+": time.getSeconds(),                 //秒 
        "q+": Math.floor((time.getMonth() + 3) / 3), //季度 
        "S": time.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

/**
 *
 */
export function getRecentMonth(moment) {
    const recentMonthArr = [1, 2, 3, 4, 5, 6].map(index => {
        return moment().subtract(index, 'months').format('YYYY-MM')
    })
    return recentMonthArr
}

/**
 * 构造日期数组
 * @param {*} start
 * @param {*} end
 */
export function createdateRange(start, end) {
    const range = moment(end).diff(moment(start), 'days')
    const arr = Array(range + 1).fill(0)
    const recentMonthArr = arr.map((entity, index) => {
        return moment(end).subtract((range - index), 'days').format('YYYY-MM-DD')
    })
    return recentMonthArr
}

/**
 * 缺省日期插值
 * @param {*} data
 * @param {*} range
 */
export function interpolationData(data, range, title) {
    const newData = range.map((day, index) => {
        const length = data.filter(item => {
            return item[title] === day
        }).length
        if (length === 0) {
            const object = {}
            object[title] = day
            const keys = Object.keys(data[0])
            keys.forEach(key => {
                if (key !== title) {
                    object[key] = 0
                }
            })
            return object
        } else {
            return data.filter(item => {
                return item[title] === day
            })[0]
        }
    })
    return newData
}

