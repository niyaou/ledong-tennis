package ledong.wxapp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import VO.RankInfoVo;
import VO.WinRateEvent;
import ledong.wxapp.service.IRankService;

@Component
public class WinRateListener {


    @Autowired
    private IRankService rankService;


    @EventListener 
    @Async
	public void handleDemoEvent(WinRateEvent event) {
        RankInfoVo userVos = event.getUserVo();
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {

            e.printStackTrace();
        }
        userVos.setWinRate(rankService.updateWinRate(userVos.getOpenId()));
        rankService. updateRankInfo(userVos);
	}
}