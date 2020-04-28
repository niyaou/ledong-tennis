package VO;

import java.io.Serializable;

import org.hibernate.validator.constraints.NotEmpty;

import io.swagger.annotations.ApiModelProperty;

public class UserVo implements Serializable {
    private static final long serialVersionUID = -820219110052857921L;

    @NotEmpty
    @ApiModelProperty(value = "phone")
    private String phone;
    public static final String PHONE = "phone";

    @NotEmpty
    @ApiModelProperty(value = "openId")
    private String openId;
    public static final String OPENID = "openId";

    @ApiModelProperty(value = "avator")
    private String avator;
    public static final String AVATOR = "avator";

    @NotEmpty
    @ApiModelProperty(value = "nickName")
    private String nickName;
    public static final String NICKNAME = "nickName";

    @NotEmpty
    @ApiModelProperty(value = "club : member of club ,it is blank when user is not the member of any club ")
    private String clubId;
    public static final String CLUBID = "clubId";

    @ApiModelProperty(value = "account charge remained quantities;rate 1:10")
    private Integer accountRemained;
    public static final String ACCOUNTREMAINED = "accountRemained";

    @ApiModelProperty(value = "coach signal ,0: no coach user, 1: coach user ")
    private Integer coach;
    public static final String COACH = "coach";


    @ApiModelProperty(value = "createTime format : yyyy-MM-dd HH:mm:ss")
    private String createTime;
    public static final String CREATETIME = "createTime";

    @ApiModelProperty(value = "lastVisitTime format : yyyy-MM-dd HH:mm:ss")
    private String lastVisitTime;
    public static final String LASTVISITTIME = "lastVisitTime";

    @ApiModelProperty(value = "lastMatchTime format : yyyy-MM-dd HH:mm:ss")
    private String lastMatchTime;
    public static final String LASTMATCHTIME = "lastMatchTime";

    @ApiModelProperty(value = "lastPlayingTime format : yyyy-MM-dd HH:mm:ss")
    private String lastPlayingTime;
    public static final String LASTPLAYINGTIME = "lastPlayingTime";

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvator() {
        return avator;
    }

    public void setAvator(String avator) {
        this.avator = avator;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public Integer getAccountRemained() {
        return accountRemained;
    }

    public void setAccountRemained(Integer accountRemained) {
        this.accountRemained = accountRemained;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getLastVisitTime() {
        return lastVisitTime;
    }

    public void setLastVisitTime(String lastVisitTime) {
        this.lastVisitTime = lastVisitTime;
    }

    public String getLastMatchTime() {
        return lastMatchTime;
    }

    public void setLastMatchTime(String lastMatchTime) {
        this.lastMatchTime = lastMatchTime;
    }

    public String getLastPlayingTime() {
        return lastPlayingTime;
    }

    public void setLastPlayingTime(String lastPlayingTime) {
        this.lastPlayingTime = lastPlayingTime;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public String getClubId() {
        return clubId;
    }

    public void setClubId(String clubId) {
        this.clubId = clubId;
    }

    public Integer getCoach() {
        return coach;
    }

    public void setCoach(Integer coach) {
        this.coach = coach;
    }

}
