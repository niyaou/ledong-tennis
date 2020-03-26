package VO;

import java.io.Serializable;

import org.hibernate.validator.constraints.NotEmpty;

import io.swagger.annotations.ApiModelProperty;

/**
 * this dataset is the structure of a session which created by challenger and
 * holder to discuss about a match
 * 
 * @author uidq1343
 *
 */
public class SessionVo implements Serializable {
    private static final long serialVersionUID = -820211310052857928L;

    @NotEmpty
    @ApiModelProperty(value = "post id")
    private String id;
    public static final String ID = "id";

    @NotEmpty
    @ApiModelProperty(value = "matchId ")
    private String matchId;
    public static final String MATCHID = "matchId";

    @NotEmpty
    @ApiModelProperty(value = "holder id")
    private String holderId;
    public static final String HOLDERID = "holderId";

    @NotEmpty
    @ApiModelProperty(value = "challenger id")
    private String challenger;
    public static final String CHALLENGER = "challenger";

    @ApiModelProperty(value = " holder dialog Context ")
    private dialogDetail[] holderContext;
    public static final String HOLDERCONTEXT = "holderContext";

    @ApiModelProperty(value = " challenger dialog Context ")
    private dialogDetail[] challengerContext;
    public static final String CHALLENGERCONTEXT = "challengerContext";

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMatchId() {
        return matchId;
    }

    public void setMatchId(String matchId) {
        this.matchId = matchId;
    }

    public String getHolderId() {
        return holderId;
    }

    public void setHolderId(String holderId) {
        this.holderId = holderId;
    }

    public String getChallenger() {
        return challenger;
    }

    public void setChallenger(String challenger) {
        this.challenger = challenger;
    }

    public dialogDetail[] getHolderContext() {
        return holderContext;
    }

    public void setHolderContext(dialogDetail[] holderContext) {
        this.holderContext = holderContext;
    }

    public dialogDetail[] getChallengerContext() {
        return challengerContext;
    }

    public void setChallengerContext(dialogDetail[] challengerContext) {
        this.challengerContext = challengerContext;
    }

    class dialogDetail {
        @ApiModelProperty(value = "postTime format : yyyy-MM-dd HH:mm:ss")
        private String postTime;
        public static final String POSTTIME = "postTime";

        @ApiModelProperty(value = "dialog context ")
        private String context;
        public static final String CONTEXT = "context";
    }
}
