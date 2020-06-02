package ledong.wxapp.constant.enums;

/**
 * 响应码
 * 
 * @author pengdengfu
 *
 */
public enum ResultCodeEnum {

    /** 成功状态码 */
    SUCCESS(0, "成功"),
    USER_LOGIN_ERROR(5,"登录失败"),

    /** 参数错误：10001-19999 */
    PARAM_IS_INVALID(10001, "参数无效"),
    /** 参数为空 */
    PARAM_IS_BLANK(10002, "参数为空"),
    /** 参数类型错误 */
    PARAM_TYPE_BIND_ERROR(10003, "参数类型错误"),
    /** 参数缺失 */
    PARAM_NOT_COMPLETE(10004, "参数缺失"),
    /** token认证失败 */
    TOKEN_PERMSSION_ERROR(10005, "token认证失败"),


    /** 连接超时 */
    ES_TIMEOUT(50030, "连接超时"),
    /** 文件大小参数错误 */



  
    CONFIRMED_MATCH_ERROR(50356, "比赛确认失败"),


    SLAM_DATE_ERROR(50100, "比赛日期格式错误"),


    /** 该接口禁止访问 */
    INTERFACE_FORBID_VISIT(60003, "该接口禁止访问"),
    /** 接口地址无效 */
    INTERFACE_ADDRESS_INVALID(60004, "接口地址无效"),
    /** 接口请求超时 */
    INTERFACE_REQUEST_TIMEOUT(60005, "接口请求超时"),
    /** 接口负载过高 */
    INTERFACE_EXCEED_LOAD(60006, "接口负载过高"),


    ONLY_ONE_INTENTIONAL_MATCH(91001,"只能发布一个比赛"),

    ALREADY_ACCEPTED_MATCH(91002,"已经匹配过该场比赛"),
    ALREADY_POSTED_CHALLENGE(91003,"正在挑战，请先完成比赛"),



    /**  slam */
    SLAM_NOT_EXISTED(32000,"比赛不存在"),
    SLAM_ALREADY_EXISTED(32001,"比赛已存在"),
    SLAM_MEMBER_READY(32002,"比赛已报满"),

    /** 未知错误 */
    UNKOWN_ERROR(90001, "未知错误");

    private Integer code;

    private String message;

    ResultCodeEnum(Integer code, String message) {
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
        for (ResultCodeEnum item : ResultCodeEnum.values()) {
            if (item.name().equals(name)) {
                return item.message;
            }
        }
        return name;
    }

    public static Integer getCode(String name) {
        for (ResultCodeEnum item : ResultCodeEnum.values()) {
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
