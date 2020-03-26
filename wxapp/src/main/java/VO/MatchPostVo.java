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

    @NotEmpty
    @ApiModelProperty(value = "parendId ")
    private String parendId;
    public static final String PARENDID = "parendId";

    @NotEmpty
    @ApiModelProperty(value = "holder id")
    private String holder;
    public static final String HOLDER = "holder";

    @NotEmpty
    @ApiModelProperty(value = "challenger id")
    private String challenger;
    public static final String CHALLENGER = "challenger";

    @NotEmpty
    @ApiModelProperty(value = "holderAcknowaged , 0 no-acknowaged,  1 acknowaged ")
    private Integer holderAcknowaged;
    public static final String HOLDERACKNOWAGED = "holderAcknowaged";

    @NotEmpty
    @ApiModelProperty(value = "challengerAcknowaged ,0 no-acknowaged,  1 acknowaged")
    private Integer challengerAcknowaged;
    public static final String CHALLENGERACKNOWAGED = "challengerAcknowaged";

    @NotEmpty
    @ApiModelProperty(value = "match post status , 0 : matching, 1 : playing , 2 : gamed")
    private Integer status;
    public static final String STATUS = "status";

    @NotEmpty
    @ApiModelProperty(value = "match post type , 0 : intentional pick , 1 : random ")
    private Integer matchStatus;
    public static final String MATCHSTATUS = "matchStatus";

    @NotEmpty
    @ApiModelProperty(value = "sessionId")
    private String sessionId;
    public static final String SESSIONID = "id";

    @NotEmpty
    @ApiModelProperty(value = "clubMatch status , 0 : non-club match, 1: club match")
    private Integer clubMatch;
    public static final String CLUBMATCH = "clubMatch";

    @NotEmpty
    @ApiModelProperty(value = "courtName")
    private String courtName;
    public static final String COURTNAME = "courtName";

    @NotEmpty
    @ApiModelProperty(value = "courtGPS ,format 'longitude,Latitude' ")
    private String courtGPS;
    public static final String COURTGPS = "courtGPS";

    @NotEmpty
    @ApiModelProperty(value = "winner , 0 : holder wins, 1: challenger wins")
    private Integer winner;
    public static final String WINNER = "winner";

    @NotEmpty
    @ApiModelProperty(value = "ranked status , 1 : ranked , 0 : un-ranked ")
    private Integer ranked;
    public static final String RANKED = "ranked";

    @NotEmpty
    @ApiModelProperty(value = "winScore ")
    private Integer winScore;
    public static final String WINSCORE = "winScore";

    @NotEmpty
    @ApiModelProperty(value = "loseScore ")
    private Integer loseScore;
    public static final String LOSESCORE = "loseScore";

    @NotEmpty
    @ApiModelProperty(value = "canceled , 0: not-canceled , 1: canceled")
    private Integer canceled;
    public static final String CANCELED = "canceled";

    @ApiModelProperty(value = "createTime format : yyyy-MM-dd HH:mm:ss")
    private String createTime;
    public static final String CREATETIME = "createTime";

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

    public Integer getHolderAcknowaged() {
        return holderAcknowaged;
    }

    public Integer getChallengerAcknowaged() {
        return challengerAcknowaged;
    }

    public Integer getStatus() {
        return status;
    }

    public Integer getMatchStatus() {
        return matchStatus;
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

    public Integer getWinScore() {
        return winScore;
    }

    public Integer getLoseScore() {
        return loseScore;
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

    public void setHolderAcknowaged(Integer holderAcknowaged) {
        this.holderAcknowaged = holderAcknowaged;
    }

    public void setChallengerAcknowaged(Integer challengerAcknowaged) {
        this.challengerAcknowaged = challengerAcknowaged;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public void setMatchStatus(Integer matchStatus) {
        this.matchStatus = matchStatus;
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

    public void setWinScore(Integer winScore) {
        this.winScore = winScore;
    }

    public void setLoseScore(Integer loseScore) {
        this.loseScore = loseScore;
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

}
