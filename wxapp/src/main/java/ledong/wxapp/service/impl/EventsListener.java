package ledong.wxapp.service.impl;

import java.util.concurrent.DelayQueue;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import VO.MatchConfirmEvent;
import VO.MatchConfirmEvent1;
import VO.RankInfoVo;
import VO.WinRateEvent;
import ledong.wxapp.queue.ConfirmedMatchTask;
import ledong.wxapp.queue.MatchConfirmSchedule;
import ledong.wxapp.service.IRankService;

@Component
public class EventsListener {
    private final static Logger log = Logger.getLogger(EventsListener.class);

    @Autowired
    private IRankService rankService;

    @Autowired
    private MatchConfirmSchedule matchConfirmSchedule;

    @EventListener
    @Async
    public void handleWinRateEvent(WinRateEvent event) {
        RankInfoVo userVos = event.getUserVo();
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {

            e.printStackTrace();
        }
        userVos.setWinRate(rankService.updateWinRate(userVos.getOpenId()));
        rankService.updateRankInfo(userVos);
    }

    @EventListener
    @Async
    public void handleConfirmEvent(MatchConfirmEvent event) {
        log.info("---------start delay task :" + event.getMatchId());
        matchConfirmSchedule.put(event.getMatchId());
        DelayQueue<ConfirmedMatchTask> que = matchConfirmSchedule.get(event.getMatchId());
        try {
            que.take();
            log.info("---------get delay task expired :" + event.getMatchId());
            if(que.isEmpty()){
                matchConfirmSchedule.clear();
            }
            
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            log.info("---------exception delay task  :" + event.getMatchId());
            e.printStackTrace();
        }

    }

}