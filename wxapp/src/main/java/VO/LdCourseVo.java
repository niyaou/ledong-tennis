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
public class LdCourseVo implements Serializable {
    private static final long serialVersionUID = -128233785762857928L;

    @NotEmpty
    @ApiModelProperty(value = "course start time ")
    private String start;
    public static final String START = "start";

    @NotEmpty
    @ApiModelProperty(value = "course end time ")
    private String end;
    public static final String END = "end";

    @NotEmpty
    @ApiModelProperty(value = "coach id ")
    private String coach;
    public static final String COACH = "coach";

    @ApiModelProperty(value = "student member list ")
    private String[] member;
    public static final String MEMBER = "member";

    @NotEmpty
    @ApiModelProperty(value = "course spendingTime  ")
    private Double spendingTime;
    public static final String SPENDINGTIME = "spendingTime";

    @NotEmpty
    @ApiModelProperty(value = "course earned  ")
    private Integer earned;
    public static final String EARNED = "earned";
    @NotEmpty
    @ApiModelProperty(value = "experience course  1:yes ,2: no  ")
    private Integer experience;
    public static final String EXPERIENCE = "experience";

    @NotEmpty
    @ApiModelProperty(value = "course courtSpend  ")
    private Integer courtSpend;
    public static final String COURTSPEND = "courtSpend";

    @NotEmpty
    @ApiModelProperty(value = "course coachSpend  ")
    private Integer coachSpend;
    public static final String COACHSPEND = "coachSpend";

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getEnd() {
        return end;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    public String getCoach() {
        return coach;
    }

    public void setCoach(String coach) {
        this.coach = coach;
    }

    public String[] getMember() {
        return member;
    }

    public void setMember(String[] member) {
        this.member = member;
    }

    public Double getSpendingTime() {
        return spendingTime;
    }

    public void setSpendingTime(Double spendingTime) {
        this.spendingTime = spendingTime;
    }

    public Integer getEarned() {
        return earned;
    }

    public void setEarned(Integer earned) {
        this.earned = earned;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public Integer getCourtSpend() {
        return courtSpend;
    }

    public void setCourtSpend(Integer courtSpend) {
        this.courtSpend = courtSpend;
    }

    public Integer getCoachSpend() {
        return coachSpend;
    }

    public void setCoachSpend(Integer coachSpend) {
        this.coachSpend = coachSpend;
    }

}
