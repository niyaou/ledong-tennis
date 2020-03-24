package VO;

import java.io.Serializable;

import org.hibernate.validator.constraints.NotEmpty;

import io.swagger.annotations.ApiModelProperty;

public class UserVo implements Serializable {
    private static final long serialVersionUID = -820211110052857928L;

    @NotEmpty
    @ApiModelProperty(value = "phone")
    private String phone;
    public static final String PHONE = "phone";

    @NotEmpty
    @ApiModelProperty(value = "userName")
    private String userName;
    public static final String USERNAME = "userName";

    @NotEmpty
    @ApiModelProperty(value = "password")
    private String password;
    public static final String PASSWORD = "password";

    @ApiModelProperty(value = "avator")
    private String avator;
    public static final String AVATOR = "avator";

    @NotEmpty
    @ApiModelProperty(value = "nickName")
    private String nickName;
    public static final String NICKNAME = "nickName";

    @NotEmpty
    @ApiModelProperty(value = "clubMember: 1 is member , 0 no member")
    private String clubMember;
    public static final String CLUBMEMBER = "clubMember";

    @ApiModelProperty(value = "account charge remained quantities;rate 1:10")
    private Integer accountRemained;
    public static final String ACCOUNTREMAINED = "accountRemained";

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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public String getClubMember() {
        return clubMember;
    }

    public void setClubMember(String clubMember) {
        this.clubMember = clubMember;
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

}
