package VO;

import java.io.Serializable;

import org.hibernate.validator.constraints.NotEmpty;

import io.swagger.annotations.ApiModelProperty;

public class UserVo implements Serializable {
    private static final long serialVersionUID = -820211110052857928L;

    @NotEmpty
    @ApiModelProperty(value = "ID")
    private String id;
    public static final String ID = "id";

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

    @NotEmpty
    @ApiModelProperty(value = "account charge remain quality ;rate 1:10")
    private Integer accountRemained;
    public static final String ACCOUNTREMAINED = "accountRemained";

    @NotEmpty
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

}
