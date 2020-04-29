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
public class rankGradeVo implements Serializable {
    private static final long serialVersionUID = -8266321127132867921L;

    @NotEmpty
    @ApiModelProperty(value = "user id , identical to user information id")
    private String id;
    public static final String ID = "id";

    @NotEmpty
    @ApiModelProperty(value = "name  ")
    private String name;
    public static final String NAME = "name";

    @NotEmpty
    @ApiModelProperty(value = "type  0: game grade , 1: tennis technical grade ")
    private Integer type;
    public static final String TYPE = "type";

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }


   

}
