package ledong.wxapp.constant.enums;

/**
 * 响应码
 * 
 * @author pengdengfu
 *
 */
public enum MatchStatusCodeEnum {
    /**/
    USER_ACKNOWLADGED(1001, "用户已确认"), USER_UN_ACKNOWLADGED(1000, "用户未确认"),
    /**/
    MATCH_MATCHING_STATUS(2000, "比赛等待匹配"), MATCH_ACKNOWLEDGED_MATCHING(2001, "比赛匹配中，等待确认"),
    MATCH_PLAYING_MATCHING(2002, "比赛中"), MATCH_GAMED_MATCHING(2003, "比赛结束"),
    /**/
    MATCH_TYPE_PICK(3000, "指定比赛"), MATCH_TYPE_RANDOM(3001, "随机匹配比赛"),MATCH_TYPE_INTENTIONAL(3002,"发起比赛"),
    /**/
    NON_CLUB_MATCH(4000, "非俱乐部比赛"), CLUB_MATCH(4001, "俱乐部比赛"),
    /* winner type */
    HOLDER_WIN_MATCH(5000, "防守方赢得比赛"), CHALLENGER_WIN_MATCH(5001, "挑战者比赛"),

    /*  */
    MATCH_RANKED_STATUS(6001, "比赛已计分"), MATCH_UNRANKED_STATUS(6000, "比赛未计分"),

    /*  */
    MATCH_CANCELED_STATUS(7001, "比赛已取消"), MATCH_UNCANCELED_STATUS(7000, "比赛未计分"),

    UNKOWN_ERROR(90001, "未知错误");

    private Integer code;

    private String message;

    MatchStatusCodeEnum(Integer code, String message) {
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
        for (MatchStatusCodeEnum item : MatchStatusCodeEnum.values()) {
            if (item.name().equals(name)) {
                return item.message;
            }
        }
        return name;
    }

    public static Integer getCode(String name) {
        for (MatchStatusCodeEnum item : MatchStatusCodeEnum.values()) {
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
