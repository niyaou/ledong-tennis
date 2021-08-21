package VO;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.NotEmpty;

import java.io.Serializable;
import java.util.HashMap;

/**
 * a intentional match requirement ,which create by user's own means
 * 
 * @author uidq1343
 *
 */
public class LdSpendingVo   {



    private String openId;
    public static final String OPENID = "openId";


    private String description;
    public static final String DESCRIPTION = "description";
    private String time;
    public static final String TIME = "time";

    private Double spend;
    public static final String SPEND = "spend";



    private Integer charge;
    public static final String CHARGE = "charge";


    private Integer timesCharge;
    public static final String TIMESCHARGE = "timesCharge";


    private String course;
    public static final String COURSE = "course";

    public Integer getTimesCharge() {
        return timesCharge;
    }

    public void setTimesCharge(Integer timesCharge) {
        this.timesCharge = timesCharge;
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

    public Double getSpend() {
        return spend;
    }

    public void setSpend(Double spend) {
        this.spend = spend;
    }

    public Integer getCharge() {
        return charge;
    }

    public void setCharge(Integer charge) {
        this.charge = charge;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }
}
