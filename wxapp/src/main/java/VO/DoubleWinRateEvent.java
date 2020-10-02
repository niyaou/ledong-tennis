package VO;

import org.springframework.context.ApplicationContext;
import org.springframework.context.event.ApplicationContextEvent;

public class DoubleWinRateEvent extends ApplicationContextEvent {

    private static final long serialVersionUID = 1656L;
    private RankInfoVo userVo;

    public DoubleWinRateEvent(ApplicationContext source, RankInfoVo userVo) {
        super(source);
        this.userVo = userVo;
    }

    public RankInfoVo getUserVo() {
        return userVo;
    }

    public void setUserVo(RankInfoVo userVo) {
        this.userVo = userVo;
    }

}