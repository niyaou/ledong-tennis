package VO;

import java.io.Serializable;

import org.hibernate.validator.constraints.NotEmpty;

import io.swagger.annotations.ApiModelProperty;

/**
 * each member of group
 * 
 * @author uidq1343
 *
 */
public class MemberVo implements Serializable {
    private static final long serialVersionUID = -223581L;

    @NotEmpty
    @ApiModelProperty(value = " member ip ,identical to user openid")
    private String openId;
    public static final String OPENID = "openId";

    @NotEmpty
    @ApiModelProperty(value = "score of members   ")
    private Integer score;
    public static final String SCORE = "score";

    public String getOpenId() {
        return openId;
    }

    public Integer getScore() {
        return score;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

}
