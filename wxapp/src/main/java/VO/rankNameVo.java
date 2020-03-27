package VO;

import java.io.Serializable;

import org.hibernate.validator.constraints.NotEmpty;

import io.swagger.annotations.ApiModelProperty;

/**
 * a intentional match requirement ,which create by user's own means
 * 
 * @author uidq1343
 *
 */
public class rankNameVo implements Serializable {
    private static final long serialVersionUID = -821211127132857928L;

    @NotEmpty
    @ApiModelProperty(value = "user id , identical to user information id")
    private String id;
    public static final String ID = "id";

    @NotEmpty
    @ApiModelProperty(value = "avator  ")
    private String avator;
    public static final String AVATOR = "avator";

    @NotEmpty
    @ApiModelProperty(value = "rankName  ")
    private String rankName;
    public static final String RANKNAME = "rankName";

    @NotEmpty
    @ApiModelProperty(value = "highScore  ")
    private Integer highScore;
    public static final String HIGHSCORE = "highScore";

    @NotEmpty
    @ApiModelProperty(value = "lowScore  ")
    private Integer lowScore;
    public static final String LOWSCORE = "lowScore";

    public String getId() {
        return id;
    }

    public String getAvator() {
        return avator;
    }

    public String getRankName() {
        return rankName;
    }

    public Integer getHighScore() {
        return highScore;
    }

    public Integer getLowScore() {
        return lowScore;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setAvator(String avator) {
        this.avator = avator;
    }

    public void setRankName(String rankName) {
        this.rankName = rankName;
    }

    public void setHighScore(Integer highScore) {
        this.highScore = highScore;
    }

    public void setLowScore(Integer lowScore) {
        this.lowScore = lowScore;
    }

}
