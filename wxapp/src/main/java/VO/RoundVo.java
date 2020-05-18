package VO;

import java.io.Serializable;

import org.hibernate.validator.constraints.NotEmpty;

import io.swagger.annotations.ApiModelProperty;

/**
 * each round matches of slam
 * 
 * @author uidq1343
 *
 */
public class RoundVo implements Serializable {
    private static final long serialVersionUID = -223580L;

    @NotEmpty
    @ApiModelProperty(value = " match id which  player who wins the game will take part in ")
    private String parentId;
    public static final String PARENTID = "parentId";

    @NotEmpty
    @ApiModelProperty(value = "current matchId  ")
    private String matchId;
    public static final String MATCHID = "matchId";

    public String getParentId() {
        return parentId;
    }

    public String getMatchId() {
        return matchId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public void setMatchId(String matchId) {
        this.matchId = matchId;
    }

}
