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
public class LdPrePaidCardVo implements Serializable {
    private static final long serialVersionUID = -128233785762857928L;

    @NotEmpty
    @ApiModelProperty(value = "title card name ")
    private String title;
    public static final String TITLE = "title";

    @ApiModelProperty(value = "member list ")
    private String[] member;
    public static final String MEMBER = "member";

    @NotEmpty
    @ApiModelProperty(value = "card balance")
    private Integer balance;
    public static final String BALANCE = "balance";

    @NotEmpty
    @ApiModelProperty(value = "spending list  ,spend means course time, charge means fee ")
    private HashMap<String, Object> spending;
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

    public HashMap<String, Object> getSpending() {
        return spending;
    }

    public void setSpending(HashMap<String, Object> spending) {
        this.spending = spending;
    }

    public HashMap<String, Object> getCharge() {
        return charge;
    }

    public void setCharge(HashMap<String, Object> charge) {
        this.charge = charge;
    }

}
