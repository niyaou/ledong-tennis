package ledong.wxapp.service.impl;

import java.util.Map;
import java.util.concurrent.DelayQueue;

import VO.*;
import com.alibaba.fastjson.JSON;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

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
        RankInfoVo[] userVos = event.getUserVo();

        try {
            Thread.sleep(2500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        for (RankInfoVo vo:userVos) {
            vo.setWinRate(rankService.updateWinRate(vo.getOpenId()));
            rankService.updateRankInfo(vo);
        }
        rankService.updateUserPosition();
    }

    @EventListener
    @Async
    public void handleLDWinRateEvent(LDWinRateEvent event) {
        LdRankInfoVo[] userVos = event.getUserVo();

        try {
            Thread.sleep(2500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        for (LdRankInfoVo vo:userVos) {
            vo.setWinRate(rankService.updateLDWinRate(vo.getOpenId()));
            rankService.updateLDRankInfo(vo);
        }
        rankService.updateLDUserPosition();

    }


    @EventListener
    @Async
    public void handleDoubleWinRateEvent(DoubleWinRateEvent event) {
        RankInfoVo userVos = event.getUserVo();
        log.info(JSON.toJSONString(userVos));
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {

            e.printStackTrace();
        }
        userVos.setDoubleWinRate(rankService.updateDoubleWinRate(userVos.getOpenId()));
        rankService.updateRankInfo(userVos);
        rankService.updateUserPosition();
        // log.info(JSON.toJSONString( userVos));
    }

    @EventListener
    @Async
    public void handleSlamWinRateEvent(SlamWinRateEvent event) {
        RankInfoVo[] userVos = event.getUserVo();

        try {
            Thread.sleep(2100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        for (RankInfoVo vo:userVos) {
            vo.setWinRate(rankService.updateWinRate(vo.getOpenId()));
            rankService.updateRankInfo(vo);
        }
        log.info(JSON.toJSONString(userVos));
    }

    @EventListener
    @Async
    public void handleConfirmEvent(MatchConfirmEvent event) {
        try {
            Thread.sleep(2000);
            rankService.updateUserPosition();
            rankService.updateLDUserPosition();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }

}