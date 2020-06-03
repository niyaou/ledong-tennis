package VO;

import java.io.Serializable;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import org.hibernate.validator.constraints.NotEmpty;

import io.swagger.annotations.ApiModelProperty;
import ledong.wxapp.utils.DateUtil;

/**
 * slam data structure
 * 
 * @author uidq1343
 *
 */
public class SlamVo implements Serializable {
    private static final long serialVersionUID = -624151313652857923L;

    private static String SLAMKEY="slamKey";
    public static final String SLAM_INFORMATION ="slam_information";

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

    @ApiModelProperty(value = "participated user  ")
    private Set<String> members;
    public static final String MEMBERS = "members";


     @ApiModelProperty(value = " group information  ")
    private Set<GroupVo> groups;
    public static final String GROUPS = "groups";



    public static String getSlamKey(String id){
        return String.format("%s-%s",SLAMKEY, id);
    }

    public static String getSlamId(String date){
        return String.format("%s-%s", SLAMKEY, date);
    }

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

    public Set<String> getMembers() {
        return members;
    }

    public void setMembers(Set<String> members) {
        this.members = members;
    }

    public Set<GroupVo> getGroups() {
        return groups;
    }

    public void setGroups(Set<GroupVo> groups) {
        this.groups = groups;
    }

}
