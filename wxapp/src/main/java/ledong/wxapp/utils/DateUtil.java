package ledong.wxapp.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

/**
 * 日期工具类
 * 
 * @author uidq1163
 *
 */
public final class DateUtil {

    /** 日期格式： yyyy-MM-dd HH:mm:ss */
    public static final String FORMAT_DATE_TIME = "yyyy-MM-dd HH:mm:ss";
    /** 日期格式： yyyy-MM-dd HH:mm:ss.SSS */
    public static final String FORMAT_DATE_TIME2 = "yyyy-MM-dd HH:mm:ss.SSS";
    /** 日期格式： yyyy-MM-dd HH:mm:ss:SSS */
    public static final String FORMAT_DATE_TIME3 = "yyyy-MM-dd HH:mm:ss:SSS";
    /** 日期格式： yyyy-MM-dd */
    public static final String FORMAT_DATE = "yyyy-MM-dd";
    /** 日期格式： yyyyMMdd */
    public static final String FORMAT_DATE_NUM = "yyyyMMdd";

    /** 日期格式： yyyyMMddHHMMSS */
    public static final String FORMAT_DATETIME_NUM = "yyyyMMddHHmmss";

    public static final int DAYCOUNT = 86400000;

    /**
     * 字符串转换为日期
     * 
     * @param str 转换日期的字符串
     * @return Date对象，默认格式为（yyyy-MM-dd）
     * @throws ParseException
     */
    public static Date getDate(String str) throws ParseException {
        return getDate(str, null);
    }

    /**
     * 获取当前日期 格式为（yyyy-MM-dd）
     */
    public static String getCurrentDate() {
        SimpleDateFormat df = new SimpleDateFormat(FORMAT_DATE);
        return df.format(new Date());
    }

    /**
     * 获取指定格式的当前时间
     * 
     * @param format
     * @return
     */
    public static String getCurrentDate(String format) {
        SimpleDateFormat df = new SimpleDateFormat(format);
        return df.format(new Date());
    }

    /**
     * 获取当前日期 格式为（yyyyMMdd）
     */
    public static String getCurrentDateNumber() {
        SimpleDateFormat df = new SimpleDateFormat(FORMAT_DATE_NUM);
        return df.format(new Date());
    }

    /**
     * 根据时间戳获取日期 格式为(yyyyMMdd)
     * 
     * @param timeStamp 秒级时间戳
     * @return
     */
    public static String getDateNumberByTimeStamp(String timeStamp) {
        return getDateByTimeStamp(timeStamp, FORMAT_DATE_NUM);
    }

    /**
     * 根据时间戳获取日期
     * 
     * @param timeStamp 秒级时间戳
     * @param format
     * @return
     */
    public static String getDateByTimeStamp(String timeStamp, String format) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
        long lt = new Long(timeStamp);
        Date date = new Date(lt * 1000);
        return simpleDateFormat.format(date);
    }

    /**
     * 字符串转换为日期
     * 
     * @param str 转换日期的字符串
     * @param format 日期格式化字符串
     * @return Date对象，默认格式为（yyyy-MM-dd）
     * @throws ParseException
     */
    public static Date getDate(String str, String format) {
        try {
            return StringUtil.isEmpty(format) ? new SimpleDateFormat(FORMAT_DATE).parse(str)
                    : new SimpleDateFormat(format).parse(str);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }

    /**
     * 日期转换为字符串
     * 
     * @param date 日期对象
     * @return 日期格式字符串
     * @throws ParseException
     */
    public static String getDate(Date date) throws ParseException {
        return getDate(date, null);
    }

    /**
     * 日期转换为字符串
     * 
     * @param date 日期对象
     * @param fomart 日期格式
     * @return String 日期字符串，默认格式为（yyyy-MM-dd）
     * @throws ParseException
     */
    public static String getDate(Date date, String fomart) throws ParseException {
        return date == null ? ""
                : (StringUtil.isEmpty(fomart) ? new SimpleDateFormat(FORMAT_DATE).format(date)
                        : new SimpleDateFormat(fomart).format(date));
    }

    /**
     * 字符串转换为日期
     * 
     * @param str 字符串
     * @return 日期对象格式为（yyyy-MM-dd HH:mm:ss）
     * @throws ParseException
     */
    public static Date getDateTime(String str) throws ParseException {
        return getDate(str, FORMAT_DATE_TIME);
    }

    /**
     * 日期转换为字符串
     * 
     * @param date 日期对象
     * @return 日期字符串格式为（yyyy-MM-dd HH:mm:ss）
     * @throws ParseException
     */
    public static String getDateTime(Date date) throws ParseException {
        return getDate(date, FORMAT_DATE_TIME);
    }

    /**
     * 获取日历日期
     * 
     * @param date 日期
     * @return String 日期格式字符串
     */
    public static String getCalendarData(Date date) {
        String rs = null;
        try {
            if (date == null) {
                return "";
            }

            Calendar now = Calendar.getInstance(TimeZone.getTimeZone("GMT+08:00"));
            now.set(Calendar.HOUR, 0);
            now.set(Calendar.MINUTE, 0);
            now.set(Calendar.SECOND, 0);
            Calendar past = Calendar.getInstance(TimeZone.getTimeZone("GMT+08:00"));
            past.setTime(date);
            now.get(Calendar.DAY_OF_YEAR);
            int days = now.get(Calendar.DAY_OF_YEAR) - past.get(Calendar.DAY_OF_YEAR);
            if (days == 0) {
                rs = getDate(date, "今天 HH:mm");
            } else if (days == 1) {
                rs = getDate(date, "昨天 HH:mm");
            } else {
                rs = getDate(date, FORMAT_DATE);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return rs;
    }

    /**
     * 获取日历日期
     * 
     * @param date 日期
     * @return String 日期格式，今天 hh:mm或者 MM-dd
     */
    public static String getCalendarMonthData(Date date) {
        String rs = null;
        try {
            Calendar now = Calendar.getInstance(TimeZone.getTimeZone("GMT+08:00"));
            now.set(Calendar.HOUR, 0);
            now.set(Calendar.MINUTE, 0);
            now.set(Calendar.SECOND, 0);
            long l = now.getTime().getTime() - date.getTime();
            if (l <= 0) {
                rs = getDate(date, "今天 HH:mm");
            } else if (l < DAYCOUNT) {
                rs = getDate(date, "昨天 HH:mm");
            } else {
                rs = getDate(date, "MM-dd");
            }
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
        return rs;
    }

    /**
     * 获取当前系统日期
     * 
     * @return String 日期字符串
     */
    public static String getSystemDate() {
        return DateFormat.getDateInstance().format(new Date());
    }

    /**
     * 得到当前年
     * 
     * @return 年
     */
    public static int getYear() {
        return new GregorianCalendar().get(Calendar.YEAR);
    }

    /**
     * 得到当前月
     * 
     * @return 月
     */
    public static int getMonth() {
        return new GregorianCalendar().get(Calendar.MONTH) + 1;
    }

    /**
     * 得到当前日
     * 
     * @return 日
     */
    public static int getDay() {
        return new GregorianCalendar().get(Calendar.DAY_OF_MONTH);
    }

    /**
     * 根据时间返回实际年龄
     * 
     * @param 日期
     * @return 计算后的年龄
     */
    public static int getDateForNumber(Date date) {
        return 0;
    }

    /**
     * 计算日期的相差天数
     * 
     * @param smdate
     * @param bdate
     * @return
     * @throws ParseException
     */
    public static Long daysBetween(Date smdate, Date bdate) throws ParseException {
        Calendar cal = Calendar.getInstance();
        cal.setTime(smdate);
        long time1 = cal.getTimeInMillis();
        cal.setTime(bdate);
        long time2 = cal.getTimeInMillis();
        long betweendays = time2 - time1;
        return betweendays;
    }

    /**
     * 计算开始时间和结束时间直到今天的比例
     * 
     * @param smdate 开始时间
     * @param bdate 结束时间
     * @return
     * @throws ParseException
     */
    public static int daysBetweenScale(Date smdate, Date bdate) throws ParseException {
        double dateBetween = DateUtil.daysBetween(smdate, bdate);
        double dateBetween2 = DateUtil.daysBetween(smdate, new Date());
        double timeProcessClass = (dateBetween2 < 0) ? 0.00 : Math.round(dateBetween2 / dateBetween * 100) / 100.00;
        return (int) Math.abs(timeProcessClass * 100);
    }

    public static Date addDateSecond(String str) {
        if (StringUtil.isNotEmpty(str)) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(DateUtil.getDate(str, DateUtil.FORMAT_DATE_TIME));
            calendar.add(Calendar.SECOND, 1);
            Date d2 = calendar.getTime();
            return d2;
        }
        return null;
    }

    /**
     * 比较时间远近
     * @param d1
     * @param d2
     * @return
     */
    public static int compareDate(String d1, String d2) {

        DateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:mm");
        try {
            Date dt1 = df.parse(d1);
            Date dt2 = df.parse(d2);
            if (dt1.getTime() > dt2.getTime()) {
                return 1;
            } else if (dt1.getTime() < dt2.getTime()) {
                return -1;
            } else {
                return 0;
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return 0;
    }

    /**
     * 根据给定的时间向前或者向后推进多少天
     * 
     * @param afterDate
     * @return
     */
    public static Date getBeforeDate(Date afterDate, Integer day) throws Exception {
        GregorianCalendar cal = new GregorianCalendar();
        cal.setTime(afterDate);
        cal.add(Calendar.DATE, day);
        String beforeDateStr = DateUtil.getDate(cal.getTime(), DateUtil.FORMAT_DATE) + " 00:00:00";
        Date beforeDate = DateUtil.getDate(beforeDateStr, DateUtil.FORMAT_DATE_TIME);
        return beforeDate;
    }

    /**
     * 得到本周周一
     * 
     * @return yyyy-MM-dd
     */
    public static Date getMondayOfThisWeek() throws ParseException {
        Calendar c = Calendar.getInstance();
        int dayofweek = c.get(Calendar.DAY_OF_WEEK) - 1;
        if (dayofweek == 0) {
            dayofweek = 7;
        }
        c.add(Calendar.DATE, -dayofweek + 1);
        String d = DateUtil.getDate(c.getTime()) + " 00:00:00";
        return DateUtil.getDate(d, DateUtil.FORMAT_DATE_TIME);
    }

    /**
     * 得到本周周日
     * 
     * @return yyyy-MM-dd
     */
    public static Date getSundayOfThisWeek() throws ParseException {
        Calendar c = Calendar.getInstance();
        int dayofweek = c.get(Calendar.DAY_OF_WEEK) - 1;
        if (dayofweek == 0) {
            dayofweek = 7;
        }
        c.add(Calendar.DATE, -dayofweek + 7);
        String d = DateUtil.getDate(c.getTime()) + " 23:59:59";
        return DateUtil.getDate(d, DateUtil.FORMAT_DATE_TIME);
    }

    
    public static String getDateDiff(Long diff) throws Exception {
        // 输出结果
        StringBuilder builder = new StringBuilder();
        // 一天的毫秒数
        long nd = 1000L * 24 * 60 * 60;
        // 一小时的毫秒数
        long nh = 1000L * 60 * 60;
        // 一分钟的毫秒数
        long nm = 1000L * 60;
        // 一秒钟的毫秒数
        long ns = 1000L;
        long day = 0L;
        long hour = 0L;
        long min = 0L;
        long sec = 0L;
        // 计算差多少天
        day = diff / nd;
        // 计算差多少小时
        hour = diff % nd / nh;
        // 计算差多少分钟
        min = diff % nd % nh / nm;
        // 计算差多少秒
        sec = diff % nd % nh % nm / ns;
        if (day > 0) {
            builder.append(day).append("天");
        }
        if (hour > 0) {
            builder.append(hour).append("小时");
        }
        if (min > 0) {
            builder.append(min).append("分钟");
        }
        if (sec > 0) {
            builder.append(sec).append("秒");
        }
        return builder.toString();
    }

    /**
     * 字符串转换为时间戳
     * 
     * @param str 转换日期的字符串
     * @param dateformat 时间格式
     * @throws ParseException
     */
    public static Long getDateLong(String str, String dateformat) {
        try {
            SimpleDateFormat formatter2 = new SimpleDateFormat(dateformat);
            Date timestamp2 = formatter2.parse(str);
            return timestamp2.getTime();
        } catch (ParseException e1) {
            e1.printStackTrace();
        }
        return null;
    }

    /**
     * 字符串转换为时间戳
     * 
     * @param str 转换日期的字符串 时间格式<br>
     * 默认日期格式： yyyy-MM-dd HH:mm:ss
     * @throws ParseException
     */
    public static Long getDateLong(String str) {
        try {
            SimpleDateFormat formatter2 = new SimpleDateFormat(FORMAT_DATE_TIME);
            Date timestamp2 = formatter2.parse(str);
            return timestamp2.getTime();
        } catch (ParseException e1) {
            e1.printStackTrace();
        }
        return null;
    }

    /**
     * 时间戳转换成时间格式
     * 
     * @param str
     * @return
     */
    public static Date getDateByLong(Long str) {
        try {
            SimpleDateFormat formatter = new SimpleDateFormat(FORMAT_DATE_TIME3);
            String times = formatter.format(str);
            return formatter.parse(times);
        } catch (ParseException e1) {
            e1.printStackTrace();
        }
        return null;
    }

    /**
     * 获取当前时间的时间戳
     * 
     * @return
     */
    public static String getCurrentTimeStamp() {
        String timeStamp = String.valueOf(System.currentTimeMillis() / 1000);
        return timeStamp;
    }

    /**
     * 获取指定时间的时间戳
     * 
     * @return
     */
    public static String getTimeStamp(String time) {
        String timeStamp = String.valueOf(getDateLong(time) / 1000);
        return timeStamp;
    }

    /**
     * 根据指定日期格式获取时间戳
     * 
     * @param time
     * @param format
     * @return
     */
    public static String getTimeStamp(String time, String format) {
        try {
            String timeStamp = String.valueOf(getDateLong(time, format) / 1000);
            return timeStamp;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 查询当前时间的之前一个月
     * 
     * @return
     * @throws ParseException
     */
    public static Date getCurrentTimeBeforeOneMonth() {
        // 过去一月
        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.add(Calendar.MONTH, -1);
        return c.getTime();
    }

    /**
     * 获取指定时间段内每日时间间隔
     * 
     * @param startTime
     * @param endTime
     * @return
     */
    public static ArrayList<ArrayList<String>> getDailyRanges(String startTime, String endTime) {
        try {
            ArrayList<ArrayList<String>> extraDays = new ArrayList<>();

            long st = new Long(getTimeStamp(startTime, FORMAT_DATE));
            long et = new Long(getTimeStamp(endTime, FORMAT_DATE));
            Date date = new Date(st * 1000);
            Calendar d = new GregorianCalendar();
            d.setTime(date);
            int int1000 = 1000;
            while (d.getTimeInMillis() < et * int1000) {
                ArrayList<String> innerDays = new ArrayList<String>();
                innerDays.add(String.valueOf(d.getTimeInMillis() / 1000));
                d.add(Calendar.DAY_OF_YEAR, 1);
                innerDays.add(String.valueOf(d.getTimeInMillis() / 1000));
                extraDays.add(innerDays);
            }
            return extraDays;
        } catch (NumberFormatException e) {
            e.printStackTrace();
            return null;
        } catch (NullPointerException n) {
            n.printStackTrace();
            return null;
        }

    }
}
