package VO;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.NotEmpty;

import java.io.Serializable;
import java.util.HashMap;

/**
 * 
 * 
 * @author uidq1343
 *
 */
public class LdChargeVo {

    private String openId;
    public static final String OPENID = "openId";

    private String description;
    public static final String DESCRIPTION = "description";

    private String time;
    public static final String TIME = "time";

    private Integer amount;
    public static final String AMOUNT = "amount";

    private Integer times;
    public static final String TIMES = "times";

    private String owner;
    public static final String OWNER = "owner";

    private String course;
    public static final String COURSE = "course";

    public Integer getTimes() {
        return times;
    }

    public void setTimes(Integer times) {
        this.times = times;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

}
