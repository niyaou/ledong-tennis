package VO;

import java.io.Serializable;
import java.util.List;

import org.hibernate.validator.constraints.NotEmpty;

import io.swagger.annotations.ApiModelProperty;

/**
 * slam data structure
 * 
 * @author uidq1343
 *
 */
public class SlamVo implements Serializable {
    private static final long serialVersionUID = -824151313652857923L;

    @NotEmpty
    @ApiModelProperty(value = "slam id ")
    private String id;
    public static final String ID = "id";

    @NotEmpty
    @ApiModelProperty(value = "matchTime  ")
    private String matchTime;
    public static final String MATCHTIME = "matchTime";

    @NotEmpty
    @ApiModelProperty(value = "final game id  ")
    private String finalGame;
    public static final String FINALGAME = "finalGame";

    @NotEmpty
    @ApiModelProperty(value = "semi game information  ")
    private List<RoundVo> semi;
    public static final String SEMI = "semi";

    @NotEmpty
    @ApiModelProperty(value = "quarter game information  ")
    private List<RoundVo> quarter;
    public static final String QUARTER = "quarter";

    @ApiModelProperty(value = "appendix game information  ")
    private List<RoundVo> appendix;
    public static final String APPENDIX = "appendix";

    public String getId() {
        return id;
    }

    public String getMatchTime() {
        return matchTime;
    }

    public String getFinalGame() {
        return finalGame;
    }

    public List<RoundVo> getSemi() {
        return semi;
    }

    public List<RoundVo> getQuarter() {
        return quarter;
    }

    public List<RoundVo> getAppendix() {
        return appendix;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setMatchTime(String matchTime) {
        this.matchTime = matchTime;
    }

    public void setFinalGame(String finalGame) {
        this.finalGame = finalGame;
    }

    public void setSemi(List<RoundVo> semi) {
        this.semi = semi;
    }

    public void setQuarter(List<RoundVo> quarter) {
        this.quarter = quarter;
    }

    public void setAppendix(List<RoundVo> appendix) {
        this.appendix = appendix;
    }

}
