package ledong.wxapp.config;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Optional;

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
import ledong.wxapp.service.impl.MatchServiceImpl;
import ledong.wxapp.utils.DateUtil;

@Configuration
@EnableScheduling
public class MatchesScheduleTask {

    @Autowired
    private IRankService rankservice;

    @Autowired
    private MatchServiceImpl matchService;

    // 3.添加定时任务
    @Scheduled(cron = "3 0 02 * * ?")
    private void configureTasks2() {
        System.err.println("每隔2分钟执行静态定时任务时间: " + LocalDateTime.now());
        LinkedList<HashMap<String, Object>> users;
        try {
            users = SearchApi.searchAll(DataSetConstant.USER_RANK_INFORMATION, 1, 5000);
            Optional.ofNullable(users).ifPresent(us -> {
                us.forEach(u -> {
                    RankInfoVo rank = rankservice.getUserRank((String) u.get(RankInfoVo.OPENID));
                    ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();

                    params.add(SearchApi.createMultiFieldsWithSingleValue((String) u.get(RankInfoVo.OPENID),
                            MatchPostVo.HOLDER, MatchPostVo.CHALLENGER));

                    params.add(SearchApi.createSearchByFieldSource(MatchPostVo.STATUS,
                            MatchStatusCodeEnum.MATCH_RANKED_STATUS.getCode()));

                    String time;

                    try {
                        time = DateUtil.getDateTime(DateUtil.getBeforeDate(new Date(), 14));
                        params.add(SearchApi.createSearchByFieldRangeGtSource(MatchPostVo.ORDERTIME, time));
            
                        QueryBuilder[] values = new QueryBuilder[8];
                        if(    SearchApi.searchByMultiQueriesAndOrders(DataSetConstant.GAME_MATCH_INFORMATION,null,null,null,params.toArray(values))!=null){
                            rank.setPoolRemain(rank.getPoolRemain() -20);
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

}