package ledong.wxapp.constant.enums;

/**
 * 响应码
 * 
 * @author pengdengfu
 *
 */
public enum GradeCodeEnum {
    BRASS(1000, "青铜"), SILVER(1001, "白银"),
    GOLDEN(1002, "黄金"), DIAMOND(1003, "钻石"), MASTER(1004, "大师"),
    ONEPOINT(2001, "1.0"), ONEANDHALF(2002, "1.5"),
    TWOPOINT(2003, "2.0"), TWOANDHALF(2004, "2.5"),
    THREEPOINT(2005, "3.0"), THREEANDHALF(2006, "3.5"),
    FOURPOINT(2007, "4.0"), FOURANDHALF(2008, "4.5"),

    UNKOWN_ERROR(90001, "未知错误");

    private Integer code;

    private String message;

    GradeCodeEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public Integer getCode() {
        return this.code;
    }

    public String getMessage() {
        return this.message;
    }

    public static String getMessage(String name) {
        for (GradeCodeEnum item : GradeCodeEnum.values()) {
            if (item.name().equals(name)) {
                return item.message;
            }
        }
        return name;
    }

    public static Integer getCode(String name) {
        for (GradeCodeEnum item : GradeCodeEnum.values()) {
            if (item.name().equals(name)) {
                return item.code;
            }
        }
        return null;
    }

    @Override
    public String toString() {
        return this.name();
    }
}
