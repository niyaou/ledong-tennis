package ledong.wxapp.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Optional;

import com.alibaba.fastjson.JSON;

import org.apache.log4j.Logger;
import org.elasticsearch.index.query.QueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import VO.MatchPostVo;
import VO.RankInfoVo;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.utils.DateUtil;

@Configuration
@EnableScheduling
public class MatchesScheduleTask {
    private static Logger logger = Logger.getLogger(MatchesScheduleTask.class);
    @Autowired
    private IRankService rankservice;

    @Autowired
    private MatchServiceImpl matchService;

    // 3.每天2点增加积分池
    // @Scheduled(cron = "3 0 02 * * ?")
    private void configureTasks() {
        logger.info("每天2点增加积分池");
        LinkedList<HashMap<String, Object>> users;
        try {
            users = SearchApi.searchAll(DataSetConstant.USER_RANK_INFORMATION, 1, 5000);
            Optional.ofNullable(users).ifPresent(us -> {
                us.forEach(u -> {
                    RankInfoVo rank = rankservice.getUserRank((String) u.get(RankInfoVo.OPENID));
                    ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();

                    params.add(SearchApi.createMultiFieldsWithSingleValue((String) u.get(RankInfoVo.OPENID),
                            MatchPostVo.HOLDER, MatchPostVo.CHALLENGER));

                    params.add(SearchApi.createSearchByFieldSource(MatchPostVo.RANKED,
                            MatchStatusCodeEnum.MATCH_RANKED_STATUS.getCode()));

                    String time;

                    try {
                        time = DateUtil.getDateTime(DateUtil.getBeforeDate(new Date(), -14));
                        params.add(SearchApi.createSearchByFieldRangeGtSource(MatchPostVo.GAMEDTIME, time));

                        QueryBuilder[] values = new QueryBuilder[8];
                        if (SearchApi.searchByMultiQueriesAndOrders(DataSetConstant.GAME_MATCH_INFORMATION, null, null,
                                null, params.toArray(values)) == null) {
                            int minus = rank.getScore() > 1700 ? 5 : 0;
                            rank.setScore(rank.getScore() - minus);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                    rank.setPoolRemain(rank.getPoolRemain() + 5);
                    rankservice.updateRankInfo(rank);
                });
            });

        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    // 3.每10分钟定时清理过期任务
    // @Scheduled(cron = "5 */10 * * * ?")
    private void matchesClear() {
        logger.info("每10分钟定时清理过期任务");
        String time = DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME);
        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        params.add(SearchApi.createSearchByFieldRangeLteSource(MatchPostVo.ORDERTIME, time, true));
        params.add(SearchApi.createSearchByMultiSource(MatchPostVo.STATUS,
                String.valueOf(MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode()),
                String.valueOf(MatchStatusCodeEnum.MATCH_ACKNOWLEDGED_MATCHING.getCode())));
        QueryBuilder[] values = new QueryBuilder[8];
        LinkedList<HashMap<String, Object>> matches = SearchApi.searchByMultiQueriesAndOrders(
                DataSetConstant.GAME_MATCH_INFORMATION, null, 0, 50, params.toArray(values));
        Optional.ofNullable(matches).ifPresent(us -> {
            us.forEach(u -> {
                String id = (String) u.get(MatchPostVo.ID);
                String session = (String) u.get(MatchPostVo.SESSIONID);
                logger.info("expired match: " + id + "   session:" + session);
                SearchApi.deleteDocument(DataSetConstant.GAME_MATCH_INFORMATION, id);
                SearchApi.deleteDocument(DataSetConstant.SESSION_INFORMATION, session);
            });
        });

    }

}