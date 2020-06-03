package ledong.wxapp.service.impl;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import com.alibaba.fastjson.JSON;

import org.apache.http.util.TextUtils;
import org.apache.log4j.Logger;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import VO.GroupVo;
import VO.MemberVo;
import VO.SlamVo;
import VO.UserVo;
import ledong.wxapp.config.CustomException;
import ledong.wxapp.constant.CommonConstanst;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.constant.enums.ResultCodeEnum;
import ledong.wxapp.redis.RedisUtil;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.service.ISlamService;
import ledong.wxapp.service.IUserService;
import ledong.wxapp.strategy.impl.slam.Base32Generator;
import ledong.wxapp.utils.DateUtil;

@Service
public class SlamServiceImpl implements ISlamService {

    private static Logger logger = Logger.getLogger(SlamServiceImpl.class);

    @Autowired
    private RedisUtil redis;

    @Autowired
    private IRankService iRankService;

    @Autowired
    private IUserService iUserService;

    @Resource
    private ApplicationContext ctx;

    @Override
    public SlamVo exploreSlams(String date) {
        SlamVo slam = null;
        if (TextUtils.isEmpty(date)) {
            LinkedList<HashMap<String, Object>> s = SearchApi.searchByFieldSorted(SlamVo.SLAM_INFORMATION, null, null,
                    SlamVo.MATCHTIME, SortOrder.DESC, 1, 1);
            if (s == null) {
                logger.info("searchByFieldSorted slam to redis  is null");
                return null;
            }
            String matchId = (String) s.getFirst().get(SlamVo.ID);
            try {
                slam = (SlamVo) redis.get(matchId);
                logger.info("getSlamKey slam to redis  is " + slam.getId());
            } catch (Exception e) {
                logger.info("update slam to redis " + JSON.toJSONString(s.getFirst()));
                slam = JSON.parseObject(JSON.toJSONString(s.getFirst()), SlamVo.class);
                redis.set(slam.getId(), slam);
            }
        }
        return slam;
    }

    @Override
    public String createSlam(String date) {
        SlamVo slam = new SlamVo();
        try {
            slam.setId(
                    SlamVo.getSlamId(DateUtil.formatDate(date, DateUtil.FORMAT_DATE_TIME, DateUtil.FORMAT_DATE_NUM)));
            slam.setMatchTime(date);
        } catch (ParseException e) {
            throw new CustomException(ResultCodeEnum.SLAM_DATE_ERROR);
        }
        if (redis.get(slam.getId()) != null) {
            throw new CustomException(ResultCodeEnum.SLAM_ALREADY_EXISTED);
        }

        SearchApi.insertDocument(SlamVo.SLAM_INFORMATION, JSON.toJSONString(slam), slam.getId());
        redis.set(slam.getId(), slam);
        return slam.getId();
    }

    @Override
    public String participateSlam(String openId, String matchId) {
        SlamVo slam = null;
        Set<String> members = null;
        if (SearchApi.searchById(DataSetConstant.USER_INFORMATION, openId) == null) {
            throw new CustomException(ResultCodeEnum.SLAM_PARTICIPATE_ERROR);
        }
        try {
            logger.info("participateSlam slam to  " + SlamVo.getSlamKey(matchId));
            slam = (SlamVo) redis.get(matchId);
            members = slam.getMembers();
            if (members.size() >= 32) {
                throw new CustomException(ResultCodeEnum.SLAM_MEMBER_READY);
            }
        } catch (NullPointerException e) {
            slam = exploreSlams(null);
            if (slam == null || !slam.getId().equals(matchId)) {
                throw new CustomException(ResultCodeEnum.SLAM_NOT_EXISTED);
            } else {
                members = slam.getMembers();
            }
        }
        members = members == null ? new HashSet<String>() : members;

        members.add(openId);
        slam.setMembers(members);
        redis.set(matchId, slam);
        logger.info("redis slam to  " + JSON.toJSONString(slam));
        SearchApi.updateDocument(SlamVo.SLAM_INFORMATION, JSON.toJSONString(slam), slam.getId());
        return matchId;
    }

    @Override
    public Integer generateGroups(String slamId) {
        SlamVo slam = null;
        try {
            slam = (SlamVo) redis.get(slamId);
            logger.info("getSlamKey slam to redis  is " + slam.getId());
        } catch (Exception e) {
            HashMap<String, Object> s = SearchApi.searchById(SlamVo.SLAM_INFORMATION, slamId);
            if (s == null) {
                throw new CustomException(ResultCodeEnum.SLAM_NOT_EXISTED);
            }
            slam = JSON.parseObject(JSON.toJSONString(s), SlamVo.class);
            redis.set(slam.getId(), slam);
        }

        int groupSize = (int) Math.ceil((double) slam.getMembers().size() / 4);
        Set<GroupVo> groups = new HashSet<GroupVo>();
        Set<String> members = slam.getMembers();
        logger.info("group size :" + groupSize);
        LinkedList<MemberVo> m = Base32Generator.createSeeds(members);

        while (groups.size() < groupSize) {
            GroupVo g = new GroupVo();
            List<MemberVo> l = new ArrayList<>();
            l.add(m.removeFirst());
            try {
                l.add(m.removeLast());
                l.add(m.removeLast());
                if (groupSize > 5) {
                    l.add(m.removeLast());
                }
            } catch (Exception e) {
            }
            g.setMembers(l);
            g.setId(String.valueOf(groups.size()+1));
            g.setType(groupSize==4?0:groupSize<7?1:groupSize<8?2:3);
            groups.add(g);
            
        }
        slam.setGroups(groups);
        redis.set(slam.getId(), slam);
        SearchApi.updateDocument(SlamVo.SLAM_INFORMATION, JSON.toJSONString(slam), slam.getId());
        logger.info("group size :" + JSON.toJSONString(groups));
        return groupSize;
    }

    @Override
    public Integer gradingGroupMatches(String slamId) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Integer gradingAppendixMatches(String slamId) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Integer gradingQuarterMatches(String slamId) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Integer gradingSemiMatches(String slamId) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Integer gradingFinalMatch(String slamId) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<Map<String, Object>> getScheduleAndScore(String slamId) {
        // TODO Auto-generated method stub
        return null;
    }

}