package VO;

import org.springframework.context.ApplicationContext;
import org.springframework.context.event.ApplicationContextEvent;

public class LDWinRateEvent extends ApplicationContextEvent {

    private static final long serialVersionUID = 1656L;
    private LdRankInfoVo[] userVo;

    public LDWinRateEvent(ApplicationContext source, LdRankInfoVo ...userVo) {
        super(source);
        this.userVo = userVo;
    }

    public LdRankInfoVo[] getUserVo() {
        return userVo;
    }

    public void setUserVo(LdRankInfoVo ...userVo) {
        this.userVo = userVo;
    }

}