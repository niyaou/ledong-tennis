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
public class BardgeVo implements Serializable {
    private static final long serialVersionUID = -824311110052857928L;

    @NotEmpty
    @ApiModelProperty(value = "user id , identical to user information id")
    private String id;
    public static final String ID = "id";

    @NotEmpty
    @ApiModelProperty(value = "avator  ")
    private String avator;
    public static final String AVATOR = "avator";

    @NotEmpty
    @ApiModelProperty(value = "bargeName  ")
    private String bargeName;
    public static final String BARGENAME = "bargeName";

    public String getId() {
        return id;
    }

    public String getAvator() {
        return avator;
    }

    public String getBargeName() {
        return bargeName;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setAvator(String avator) {
        this.avator = avator;
    }

    public void setBargeName(String bargeName) {
        this.bargeName = bargeName;
    }

}
