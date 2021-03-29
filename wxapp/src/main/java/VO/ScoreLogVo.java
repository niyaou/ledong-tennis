package VO;

import java.io.Serializable;

import org.hibernate.validator.constraints.NotEmpty;

import io.swagger.annotations.ApiModelProperty;

/**
 * score changed log
 * 
 * @author uidq1343
 *
 */
public class ScoreLogVo implements Serializable {
    private static final long serialVersionUID = -8116821230088157928L;

    public static final String SCORE_CHANGED_LOG = "score_changed_log";

    @NotEmpty
    @ApiModelProperty(value = "openId")
    private String openId;
    public static final String OPENID = "openId";

    @NotEmpty
    @ApiModelProperty(value = "score  ")
    private Integer score;
    public static final String SCORE = "score";

    @NotEmpty
    @ApiModelProperty(value = "rankingTime  ")
    private String rankingTime;
    public static final String RANKINGTIME = "rankingTime";

    @NotEmpty
    @ApiModelProperty(value = " ")
    private String description;
    public static final String DESCRIPTION = "description";

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getRankingTime() {
        return rankingTime;
    }

    public void setRankingTime(String rankingTime) {
        this.rankingTime = rankingTime;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
