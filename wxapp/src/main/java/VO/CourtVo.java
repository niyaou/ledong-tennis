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
public class CourtVo implements Serializable {
    private static final long serialVersionUID = -8243821230052857928L;

    @NotEmpty
    @ApiModelProperty(value = "court id , identical to user information id")
    private String id;
    public static final String ID = "id";

    @NotEmpty
    @ApiModelProperty(value = "avator  ")
    private String avator;
    public static final String AVATOR = "avator";

    @NotEmpty
    @ApiModelProperty(value = "courtName  ")
    private String courtName;
    public static final String COURTNAME = "courtName";

    @NotEmpty
    @ApiModelProperty(value = "player's gps ,format 'Latitude,longitude  ")
    private String location;
    public static final String LOCATION = "location";

    
}
