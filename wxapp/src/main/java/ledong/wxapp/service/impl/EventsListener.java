package ledong.wxapp.service.impl;

import java.util.Map;
import java.util.concurrent.DelayQueue;

import com.alibaba.fastjson.JSON;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import VO.MatchConfirmEvent;
import VO.MatchPostVo;
import VO.RankInfoVo;
import VO.SlamWinRateEvent;
import VO.WinRateEvent;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.queue.ConfirmedMatchTask;
import ledong.wxapp.queue.MatchConfirmSchedule;
import ledong.wxapp.service.IMatchService;
import ledong.wxapp.service.IRankService;

@Component
public class EventsListener {
    private final static Logger log = Logger.getLogger(EventsListener.class);

    @Autowired
    private IRankService rankService;

    @Autowired
    private IMatchService matchService;

    @Autowired
    private MatchConfirmSchedule matchConfirmSchedule;

    @EventListener
    @Async
    public void handleWinRateEvent(WinRateEvent event) {
        RankInfoVo userVos = event.getUserVo();
        log.info(JSON.toJSONString( userVos));
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {

            e.printStackTrace();
        }
        userVos.setWinRate(rankService.updateWinRate(userVos.getOpenId()));
        rankService.updateRankInfo(userVos);
        log.info(JSON.toJSONString( userVos));
    }


    @EventListener
    @Async
    public void handleSlamWinRateEvent(SlamWinRateEvent event) {
        RankInfoVo userVos = event.getUserVo();
        log.info(JSON.toJSONString( userVos));
        try {
            Thread.sleep(800);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        userVos.setWinRate(rankService.updateWinRate(userVos.getOpenId()));
        // userVos.setSlamWinRate(rankService.updateSlamWinRate(userVos.getOpenId()));
        rankService.updateRankInfo(userVos);
        log.info(JSON.toJSONString( userVos));
    }




    @EventListener
    @Async
    public void handleConfirmEvent(MatchConfirmEvent event) {
        try {
            String matchId = event.getMatchId();
            log.info("输入比分后自动确认:"+matchId);
            Thread.sleep(120000);
          Map<String,Object> vo=  (Map<String, Object>) matchService.getMatchInfos(matchId);
          rankService.updateUserPosition();
         if(vo.get(MatchPostVo.RANKED)==null||!vo.get(MatchPostVo.RANKED).equals(MatchStatusCodeEnum.MATCH_RANKED_STATUS.getCode())){
            matchService.confirmMatch(matchId, vo.get(MatchPostVo.HOLDERACKNOWLEDGED).equals(MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode())?2:1);
         }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }

}