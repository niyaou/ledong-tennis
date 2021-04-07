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
    private String parent;
    public static final String PARENT = "parent";

    public String getParent() {
        return parent;
    }

    public void setParent(String parent) {
        this.parent = parent;
    }
}
