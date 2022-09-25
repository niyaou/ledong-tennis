package VO;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.NotEmpty;

import java.io.Serializable;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

/**
 * a intentional match requirement ,which create by user's own means
 * 
 * @author uidq1343
 *
 */
public class LdPrePaidCardVo implements Serializable {
    private static final long serialVersionUID = -128233785762857928L;

    @NotEmpty
    @ApiModelProperty(value = "title card name ")
    private String title;
    public static final String TITLE = "title";

    @NotEmpty
    @ApiModelProperty(value = "title card name ")
    private String createTime;
    public static final String CREATETIME = "createTime";


    @ApiModelProperty(value = "title card name ")
    private String expiredTime;
    public static final String EXPIREDTIME = "expiredTime";

    @ApiModelProperty(value = " card rest count ")
    private String restCount;
    public static final String RESTCOUNT = "restCount";

    @ApiModelProperty(value = "member list ")
    private String[] member;
    public static final String MEMBER = "member";

    @NotEmpty
    @ApiModelProperty(value = "card balance")
    private Integer balance =0;
    public static final String BALANCE = "balance";

    @ApiModelProperty(value = "card balance times")
    private Integer balanceTimes =0;
    public static final String BALANCETIMES = "balanceTimes";

    public Integer getBalanceTimes() {
        return balanceTimes;
    }

    public void setBalanceTimes(Integer balanceTimes) {
        this.balanceTimes = balanceTimes;
    }

    @NotEmpty
    @ApiModelProperty(value = "spending list  ,spend means course time, charge means fee ")
    private List<HashMap<String, Object>> spending= new LinkedList<HashMap<String, Object>> ();
    public static final String SPENDING = "spending";

    @NotEmpty
    @ApiModelProperty(value = "charge list  ,owner means coach , amount means fee ")
    private HashMap<String, Object> charge;
    public static final String CHARGE = "charge";

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String[] getMember() {
        return member;
    }

    public void setMember(String[] member) {
        this.member = member;
    }

    public Integer getBalance() {
        return balance;
    }

    public void setBalance(Integer balance) {
        this.balance = balance;
    }

    public List<HashMap<String, Object>> getSpending() {
        return spending;
    }

    public void setSpending(List<HashMap<String, Object>> spending) {
        this.spending = spending;
    }

    public HashMap<String, Object> getCharge() {
        return charge;
    }

    public void setCharge(HashMap<String, Object> charge) {
        this.charge = charge;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }
}
