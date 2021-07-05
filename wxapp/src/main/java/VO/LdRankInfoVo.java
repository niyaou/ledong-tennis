package VO;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.NotEmpty;

import java.io.Serializable;

/**
 * a intentional match requirement ,which create by user's own means
 * 
 * @author uidq1343
 *
 */
public class LdRankInfoVo extends RankInfoVo {
    private static final long serialVersionUID = -821233785352857928L;

    @NotEmpty
    @ApiModelProperty(value = "parent list ")
    private String[] parent;
    public static final String PARENT = "parent";

    @NotEmpty
    @ApiModelProperty(value = "parent list ")
    private Integer clubId=0;//0 pending user, 1 verified user , 2 teenage user , 3 master
    public static final Integer PENDING = 0;
    public static final Integer VERIFIED = 1;
    public static final Integer TEENAGE = 2;
    public static final Integer MASTER = 3;
    public static final Integer SUPER_MASTER = 4;
    public static final String CLUBID = "clubId";

    public Integer getClubId() {
        return clubId;
    }

    public void setClubId(Integer clubId) {
        this.clubId = clubId;
    }

    public String[] getParent() {
        return parent;
    }

    public void setParent(String[] parent) {
        this.parent = parent;
    }
}
