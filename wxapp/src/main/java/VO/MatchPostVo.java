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
public class MatchPostVo implements Serializable {
    private static final long serialVersionUID = -821211110052857928L;

    @NotEmpty
    @ApiModelProperty(value = "post id")
    private String id;
    public static final String ID = "id";

    @ApiModelProperty(value = "parendId ")
    private String parendId;
    public static final String PARENDID = "parendId";

    @NotEmpty
    @ApiModelProperty(value = "holder id")
    private String holder;
    public static final String HOLDER = "holder";
    public static final String HOLDERNAME = "holderName";
    public static final String HOLDERAVATOR = "holderAvator";
    public static final String HOLDERRANKTYPE0 = "holderrankType0";
    @NotEmpty
    @ApiModelProperty(value = "challenger id")
    private String challenger;
    public static final String CHALLENGER = "challenger";
    public static final String CHALLENGERNAME = "challengerName";
    public static final String CHALLENGERAVATOR = "challengerAvator";
    public static final String CHALLENGERRANKTYPE0 = "challengerrankType0";

    @NotEmpty
    @ApiModelProperty(value = "holderAcknowaged , 1000 un-Acknowledged,  1001 Acknowledged ")
    private Integer holderAcknowledged;
    public static final String HOLDERACKNOWLEDGED = "holderAcknowledged";

    @NotEmpty
    @ApiModelProperty(value = "challengerAcknowledged ,1000 un-Acknowledged,  1001 Acknowledged")
    private Integer challengerAcknowledged;
    public static final String CHALLENGERACKNOWLEDGED = "challengerAcknowledged";

    @NotEmpty
    @ApiModelProperty(value = "match post status , 2000 : matching, 2001 : Acknowledged  , 2002 : playing , 2003 : gamed")
    private Integer status;
    public static final String STATUS = "status";

    @NotEmpty
    @ApiModelProperty(value = "match post type , 3000 : intentional pick , 3001 : random ")
    private Integer matchType;
    public static final String MATCHTYPE = "matchType";

    @NotEmpty
    @ApiModelProperty(value = "sessionId")
    private String sessionId;
    public static final String SESSIONID = "sessionId";

    @NotEmpty
    @ApiModelProperty(value = "clubMatch status , 4000 : non-club match, 4001: club match ,4002: slam match")
    private Integer clubMatch;
    public static final String CLUBMATCH = "clubMatch";

    @ApiModelProperty(value = "courtName")
    private String courtName;
    public static final String COURTNAME = "courtName";

    @NotEmpty
    @ApiModelProperty(value = "courtGPS ,format 'Latitude,longitude' ")
    private String courtGPS;
    public static final String COURTGPS = "courtGPS";

    @ApiModelProperty(value = "winner , 5000 : holder wins, 5001: challenger wins")
    private Integer winner;
    public static final String WINNER = "winner";

    @NotEmpty
    @ApiModelProperty(value = "ranked status , 6001 : ranked , 6000 : un-ranked ")
    private Integer ranked;
    public static final String RANKED = "ranked";

    @ApiModelProperty(value = "holderScore ")
    private Integer holderScore;
    public static final String HOLDERSCORE = "holderScore";

    @ApiModelProperty(value = "challengerScore ")
    private Integer challengerScore;
    public static final String CHALLENGERSCORE  = "challengerScore";

    @NotEmpty
    @ApiModelProperty(value = "canceled , 7000: not-canceled , 7001: canceled")
    private Integer canceled = 7000;
    public static final String CANCELED = "canceled";

    @NotEmpty
    @ApiModelProperty(value = "createTime format : yyyy-MM-dd HH:mm:ss")
    private String createTime;
    public static final String CREATETIME = "createTime";

    @ApiModelProperty(value = "orderTime format : yyyy-MM-dd HH:mm:ss")
    private String orderTime;
    public static final String ORDERTIME = "orderTime";

    @ApiModelProperty(value = "playingTime format : yyyy-MM-dd HH:mm:ss")
    private String playingTime;
    public static final String PLAYINGTIME = "playingTime";

    @ApiModelProperty(value = "gamedTime format : yyyy-MM-dd HH:mm:ss")
    private String gamedTime;
    public static final String GAMEDTIME = "gamedTime";

    public String getId() {
        return id;
    }

    public String getParendId() {
        return parendId;
    }

    public String getHolder() {
        return holder;
    }

    public String getChallenger() {
        return challenger;
    }

    public Integer getHolderAcknowledged() {
        return holderAcknowledged;
    }

    public Integer getChallengerAcknowledged() {
        return challengerAcknowledged;
    }

    public void setHolderAcknowledged(Integer holderAcknowledged) {
        this.holderAcknowledged = holderAcknowledged;
    }

    public void setChallengerAcknowledged(Integer challengerAcknowledged) {
        this.challengerAcknowledged = challengerAcknowledged;
    }

    public Integer getStatus() {
        return status;
    }

    public String getSessionId() {
        return sessionId;
    }

    public Integer getClubMatch() {
        return clubMatch;
    }

    public String getCourtName() {
        return courtName;
    }

    public String getCourtGPS() {
        return courtGPS;
    }

    public Integer getWinner() {
        return winner;
    }

    public Integer getRanked() {
        return ranked;
    }

    public Integer getHolderScore() {
        return holderScore;
    }

    public Integer getChallengerScore() {
        return challengerScore;
    }

    public Integer getCanceled() {
        return canceled;
    }

    public String getCreateTime() {
        return createTime;
    }

    public String getPlayingTime() {
        return playingTime;
    }

    public String getGamedTime() {
        return gamedTime;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setParendId(String parendId) {
        this.parendId = parendId;
    }

    public void setHolder(String holder) {
        this.holder = holder;
    }

    public void setChallenger(String challenger) {
        this.challenger = challenger;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getMatchType() {
        return matchType;
    }

    public void setMatchType(Integer matchType) {
        this.matchType = matchType;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public void setClubMatch(Integer clubMatch) {
        this.clubMatch = clubMatch;
    }

    public void setCourtName(String courtName) {
        this.courtName = courtName;
    }

    public void setCourtGPS(String courtGPS) {
        this.courtGPS = courtGPS;
    }

    public void setWinner(Integer winner) {
        this.winner = winner;
    }

    public void setRanked(Integer ranked) {
        this.ranked = ranked;
    }

    public void setHolderScore(Integer holderScore) {
        this.holderScore = holderScore;
    }

    public void setChallengerScore(Integer challengerScore) {
        this.challengerScore = challengerScore;
    }

    public void setCanceled(Integer canceled) {
        this.canceled = canceled;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public void setPlayingTime(String playingTime) {
        this.playingTime = playingTime;
    }

    public void setGamedTime(String gamedTime) {
        this.gamedTime = gamedTime;
    }

    public String getOrderTime() {
        return orderTime;
    }

    public void setOrderTime(String orderTime) {
        this.orderTime = orderTime;
    }

}
