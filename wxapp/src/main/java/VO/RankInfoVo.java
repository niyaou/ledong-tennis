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
    @ApiModelProperty(value = "user openId , identical to user information openId")
    private String openId;
    public static final String OPENID = "openId";

    @NotEmpty
    @ApiModelProperty(value = "season  ")
    private Integer season;
    public static final String SEASON = "season";

    @NotEmpty
    @ApiModelProperty(value = "score  ")
    private Integer score = 0;
    public static final String SCORE = "score";

    @NotEmpty
    @ApiModelProperty(value = "doubleScore  ")
    private Integer doubleScore = 0;
    public static final String DOUBLESCORE = "doubleScore";

    @NotEmpty
    @ApiModelProperty(value = "clubScore  ")
    private Integer clubScore;
    public static final String CLUBSCORE = "clubScore";

    @ApiModelProperty(value = "winRate  ")
    private Double winRate = 0.0;
    public static final String WINRATE = "winRate";

    @ApiModelProperty(value = "slamWinRate  ")
    private Double slamWinRate = 0.0;
    public static final String SLAMWINRATE = "slamWinRate";

    @ApiModelProperty(value = "doubleWinRate  ")
    private Double doubleWinRate = 0.0;
    public static final String DOUBLEWINRATE = "doubleWinRate";

    @ApiModelProperty(value = "slamScore  ")
    private Integer slamScore;
    public static final String SLAMSCORE = "slamScore";

    @NotEmpty
    @ApiModelProperty(value = "rank type 0 ,means game grade  ")
    private String rankType0;
    public static final String RANKTYPE0 = "rankType0";
    @NotEmpty
    @ApiModelProperty(value = "rank type 1 ,means tennis technical grade   ")
    private String rankType1;
    public static final String RANKTYPE1 = "rankType1";

    @NotEmpty
    @ApiModelProperty(value = "rank type 0 ,means game grade  ")
    private String doubleRankType0;
    public static final String DOUBLERANKTYPE0 = "doubleRankType0";
    @NotEmpty
    @ApiModelProperty(value = "rank type 1 ,means tennis technical grade   ")
    private String doubleRankType1;
    public static final String DOUBLERANKTYPE1 = "doubleRankType1";

    @NotEmpty
    @ApiModelProperty(value = "position  ")
    private Integer position = 0;
    public static final String POSITION = "position";

    @NotEmpty
    @ApiModelProperty(value = "double position  ")
    private Integer doublePosition = 0;
    public static final String DOUBLEPOSITION = "doublePosition";

    @NotEmpty
    @ApiModelProperty(value = "bardge  ")
    private Integer bardge;
    public static final String BARDGE = "bardge";

    @NotEmpty
    @ApiModelProperty(value = "polygen  ")
    private String polygen;
    public static final String POLYGEN = "polygen";

    @NotEmpty
    @ApiModelProperty(value = "poolRemain  ")
    private Integer poolRemain = 0;
    public static final String POOLREMAIN = "poolRemain";

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

    public String getPolygen() {
        return polygen;
    }

    public Integer getPoolRemain() {
        return poolRemain;
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

    public void setPolygen(String polygen) {
        this.polygen = polygen;
    }

    public void setPoolRemain(Integer poolRemain) {
        this.poolRemain = poolRemain;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public String getRankType0() {
        return rankType0;
    }

    public void setRankType0(String rankType0) {
        this.rankType0 = rankType0;
    }

    public String getRankType1() {
        return rankType1;
    }

    public void setRankType1(String rankType1) {
        this.rankType1 = rankType1;
    }

    public Double getWinRate() {
        return winRate;
    }

    public void setWinRate(Double winRate) {
        this.winRate = winRate;
    }

    public Integer getSlamScore() {
        return slamScore;
    }

    public void setSlamScore(Integer slamScore) {
        this.slamScore = slamScore;
    }

    public Double getSlamWinRate() {
        return slamWinRate;
    }

    public void setSlamWinRate(Double slamWinRate) {
        this.slamWinRate = slamWinRate;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public Integer getDoubleScore() {
        return doubleScore;
    }

    public void setDoubleScore(Integer doubleScore) {
        this.doubleScore = doubleScore;
    }

    public String getDoubleRankType0() {
        return doubleRankType0;
    }

    public void setDoubleRankType0(String doubleRankType0) {
        this.doubleRankType0 = doubleRankType0;
    }

    public String getDoubleRankType1() {
        return doubleRankType1;
    }

    public void setDoubleRankType1(String doubleRankType1) {
        this.doubleRankType1 = doubleRankType1;
    }

    public Double getDoubleWinRate() {
        return doubleWinRate;
    }

    public void setDoubleWinRate(Double doubleWinRate) {
        this.doubleWinRate = doubleWinRate;
    }

    public Integer getDoublePosition() {
        return doublePosition;
    }

    public void setDoublePosition(Integer doublePosition) {
        this.doublePosition = doublePosition;
    }

}
