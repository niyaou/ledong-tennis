package VO;

import java.io.Serializable;
import java.util.List;

import org.hibernate.validator.constraints.NotEmpty;

import io.swagger.annotations.ApiModelProperty;

/**
 * a intentional match requirement ,which create by user's own means
 * 
 * @author uidq1343
 *
 */
public class GroupVo implements Serializable {
    private static final long serialVersionUID = -824316110052857921L;

    @NotEmpty
    @ApiModelProperty(value = "group id ")
    private String id;
    public static final String ID = "id";

    @NotEmpty
    @ApiModelProperty(value = "members  of group")
    private List<MemberVo> members;
    public static final String MEMBERS = "members";

    @NotEmpty
    @ApiModelProperty(value = "group type  0 : 2 players take part in next round,"
            + " 1 : 1 player take part in next round,and second players take part in appendix matches, "
            + " 2 : 1 player take part in next round, and second players take part in quarter finals whose score is higher in all the groups "
            + " 3 : 1 player take part in next round")
    private Integer type;
    public static final String TYPE = "type";

    @NotEmpty
    @ApiModelProperty(value = "matches  of group")
    private List<MatchPostVo> matches;
    public static final String MATCHES = "matches";

    public String getId() {
        return id;
    }

    public List<MemberVo> getMembers() {
        return members;
    }

    public Integer getType() {
        return type;
    }

    public List<MatchPostVo> getMatches() {
        return matches;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setMembers(List<MemberVo> members) {
        this.members = members;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public void setMatches(List<MatchPostVo> matches) {
        this.matches = matches;
    }

}
