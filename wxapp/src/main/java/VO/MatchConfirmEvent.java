package VO;

import org.springframework.context.ApplicationContext;
import org.springframework.context.event.ApplicationContextEvent;

public class MatchConfirmEvent extends ApplicationContextEvent {

    private static final long serialVersionUID = 1656L;
    private String matchId;

    public MatchConfirmEvent(ApplicationContext source, String matchId) {
        super(source);
        this.matchId = matchId;
    }

    public String getMatchId() {
        return matchId;
    }

    public void setMatchId(String matchId) {
        this.matchId = matchId;
    }



}