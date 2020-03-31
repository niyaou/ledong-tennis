package ledong.wxapp.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.util.StringUtils;

import ledong.wxapp.constant.CommonConstanst;

/**
 * 字符串工具类
 * 
 * @author uidq1343
 */
public final class StringUtil {

    /**
     * 过滤所有以<开头以>结尾的标签
     */
    private final static String REGXPFORHTML = "<([^>]*)>";
    private final static String DOT = ".";
    private final static String SLASH = "/";

    private StringUtil() {

    }

    /**
     * @param s
     * @return
     */
    public static String trim(String s) {
        return s == null ? s
                : s.trim().replaceAll("&nbsp;*", "").replaceAll("[　*| *]*", "").replaceAll("[　*| *]*$", "");
    }

    /**
     * 判断字符串是否为null
     * 
     * @param s 需要非空判断的字符串
     * @return 为空返回true,否则返回false
     */
    public static boolean isEmpty(String s) {
        return s == null ? true : "".equals(s.trim());
    }

    /**
     * 判断不为null
     * 
     * @param s
     * @return
     */
    public static boolean isNotEmpty(String s) {
        return !isEmpty(s);
    }

    /**
     * 
     * 基本功能：过滤所有以"<"开头以">"结尾的标签
     * <p>
     * 
     * @param str
     * @return String
     */
    public static String filterHtml(String str) {
        Pattern pattern = Pattern.compile(REGXPFORHTML);
        Matcher matcher = pattern.matcher(str);
        StringBuffer sb = new StringBuffer();
        boolean result1 = matcher.find();
        while (result1) {
            matcher.appendReplacement(sb, "");
            result1 = matcher.find();
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    /**
     * @param strtemp 要截取的字符串
     * @param width 保留的字节长度
     * @param ellipsis 替代超长部分的字符串
     * @return
     */
    public static String abbreviate(String strtemp, int width, String ellipsis) {
        if (isEmpty(strtemp)) {
            return "";
        }
        String[] strs = strtemp.split("<br/>");
        String[] strsTemp = new String[strs.length];
        for (int i = 0; i < strs.length; i++) {
            String str = strs[i];
            // byte length
            int d = 0;
            // char length
            int n = 0;
            for (; n < str.length(); n++) {
                d = str.charAt(n) > 256 ? d + 2 : d + 1;
                if (d > width) {
                    break;
                }
            }
            if (d > width) {
                strsTemp[i] = str.substring(0, n > 0 ? n : 0) + ellipsis;
                break;
            } else {
                strsTemp[i] = str.substring(0, n);
            }
            width -= d;
        }
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < strsTemp.length; i++) {
            String o = strsTemp[i];
            if (!isEmpty(o)) {
                builder.append(o == null ? "null" : o.toString());
                if (i != strs.length - 1) {
                    builder.append("<br />");
                }
            }
        }
        return builder.toString();
    }

    /**
     * 去掉字符串中的特殊字符
     * 
     * @param specStr 特殊字符
     * @param paramStr 要处理的字符串
     * @return
     */
    public static String strReplace(String specStr, String paramStr) {
        if (StringUtil.isEmpty(paramStr)) {
            return "";
        }
        String[] badStrs = specStr.split("\\|");
        for (int i = 0; i < badStrs.length; i++) {
            paramStr = paramStr.replaceAll(badStrs[i], "");
        }
        return paramStr;
    }

    /**
     * 获取文件名称和后缀
     * 
     * @param str 文件名称
     * @return reString[0] 文件真实名称 reString[1] 文件后缀名
     */
    public static String[] getFileRealName(String str) {
        String[] reString = new String[2];
        if (StringUtils.isEmpty(str)) {
            if (str.contains(CommonConstanst.POINT)) {
                reString[0] = str.substring(0, str.lastIndexOf(CommonConstanst.POINT));
                reString[1] = str.substring(str.lastIndexOf(CommonConstanst.POINT) + 1);
            } else {
                reString[0] = str;
                reString[1] = "";
            }
        } else {
            reString[0] = "";
            reString[1] = "";
        }
        return reString;
    }

    /**
     * Description: 处理转义字符%和_，
     * 
     * @param str
     * @return
     */
    public static String escapeStr(String str) {
        String temp = "";
        if (isNotEmpty(str)) {
            for (int i = 0; i < str.length(); i++) {
                if (str.charAt(i) == '%' || str.charAt(i) == '_' || str.charAt(i) == '?') {
                    temp += "\\" + str.charAt(i);
                } else {
                    temp += str.charAt(i);
                }
            }
        }
        return temp;
    }

    /**
     * 判断文本是否包含指定内容
     * 
     * @param str
     * @param content
     * @return
     */
    public static boolean containsContent(String str, String content) {
        if (StringUtils.hasText(str) && StringUtils.hasText(content)) {
            return str.contains(content);
        }
        return false;
    }

    /**
     * 获取文件不带后缀名的字符串
     * 
     * @param filename
     * @return
     */
    public static String getFileNameWithoutPrefix(String filename) {
        if (isEmpty(filename) || filename.indexOf(DOT) < 1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("/") + 1, filename.lastIndexOf("."));
    }

    /**
     * 获取文件后缀名
     * 
     * @param filename
     * @return
     */
    public static String getPrefixFileName(String filename) {
        if (isEmpty(filename) || filename.indexOf(DOT) < 1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1, filename.length());
    }

    /**
     * 获取文件路径 包含最后一个/
     * 
     * @param filename
     * @return
     */
    public static String getFileFolder(String filename) {
        if (isEmpty(filename) || filename.indexOf(SLASH) < 0) {
            return "";
        }
        if (filename.indexOf(SLASH) == 1) {
            return SLASH;
        }
        return filename.substring(0, filename.lastIndexOf(SLASH) + 1);
    }

    /**
     * 组合文件路径
     * 
     * @param path
     * @param name
     * @param prefix
     * @return
     */
    public String combiningFileNameAndPath(String path, String name, String prefix) {
        if (path == null || name == null || prefix == null) {
            return null;
        }
        return new StringBuffer(path).append(name).append(".").append(prefix).toString();
    }

    /**
     * 生成特定的user-key
     * 
     * @param user
     * @return
     */
    public static String combiningSpecifiedUserKey(String user, String appendex) {
        String combine = String.format("[%s]", user);
        if (isNotEmpty(appendex)) {
            combine = String.format("%s-%s", user, appendex);
        }
        return combine;

    }

}
