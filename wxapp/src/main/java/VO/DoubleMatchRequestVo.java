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
public class DoubleMatchRequestVo implements Serializable {
    private static final long serialVersionUID = -62366245052857928L;

    public static final String DOUBLEMATCHREQUESTFROM = "DOUBLEMATCHREQUESTFROM";

    @NotEmpty
    @ApiModelProperty(value = "request userName")
    private String userName;
    public static final String USERNAME = "userName";

    @ApiModelProperty(value = "createTime format : yyyy-MM-dd HH:mm:ss")
    private String createTime;
    public static final String CREATETIME = "createTime";



    public String getUserName() {
        return userName;
    }

    public String getCreateTime() {
        return createTime;
    }



    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }



}
