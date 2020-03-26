package VO;

import java.io.Serializable;

import org.hibernate.validator.constraints.NotEmpty;

import io.swagger.annotations.ApiModelProperty;

/**
 * templately request for random match
 * 
 * @author uidq1343
 *
 */
public class MatchRequestVo implements Serializable {
    private static final long serialVersionUID = -120211110052857928L;

    @NotEmpty
    @ApiModelProperty(value = "request userName")
    private String userName;
    public static final String USERNAME = "userName";

    @ApiModelProperty(value = "createTime format : yyyy-MM-dd HH:mm:ss")
    private String createTime;
    public static final String CREATETIME = "createTime";

    @ApiModelProperty(value = "LOCATION")
    private String location;
    public static final String LOCATION = "courtGPS";

    public String getUserName() {
        return userName;
    }

    public String getCreateTime() {
        return createTime;
    }

    public String getLocation() {
        return location;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public void setLocation(String location) {
        this.location = location;
    }

}
