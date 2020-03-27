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
public class RankInfoVo implements Serializable {
    private static final long serialVersionUID = -821211115352857928L;

    @NotEmpty
    @ApiModelProperty(value = "user id , identical to user information id")
    private String id;
    public static final String ID = "id";

    @NotEmpty
    @ApiModelProperty(value = "season  ")
    private Integer season;
    public static final String SEASON = "season";

    @NotEmpty
    @ApiModelProperty(value = "score  ")
    private Integer score;
    public static final String SCORE = "score";

    @NotEmpty
    @ApiModelProperty(value = "clubScore  ")
    private Integer clubScore;
    public static final String CLUBSCORE = "clubScore";

    @NotEmpty
    @ApiModelProperty(value = "bardge  ")
    private Integer bardge;
    public static final String BARDGE = "bardge";

    @NotEmpty
    @ApiModelProperty(value = "polygen  ")
    private Integer polygen;
    public static final String POLYGEN = "polygen";

    @NotEmpty
    @ApiModelProperty(value = "poolRemain  ")
    private Integer poolRemain;
    public static final String POOLREMAIN = "poolRemain";

    public String getId() {
        return id;
    }

    public Integer getSeason() {
        return season;
    }

    public Integer getScore() {
        return score;
    }

    public Integer getClubScore() {
        return clubScore;
    }

    public Integer getBardge() {
        return bardge;
    }

    public Integer getPolygen() {
        return polygen;
    }

    public Integer getPoolRemain() {
        return poolRemain;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setSeason(Integer season) {
        this.season = season;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public void setClubScore(Integer clubScore) {
        this.clubScore = clubScore;
    }

    public void setBardge(Integer bardge) {
        this.bardge = bardge;
    }

    public void setPolygen(Integer polygen) {
        this.polygen = polygen;
    }

    public void setPoolRemain(Integer poolRemain) {
        this.poolRemain = poolRemain;
    }

}
