package ledong.wxapp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ledong.wxapp.redis.RedisUtil;
import ledong.wxapp.service.IMatchService;

@Service
public class MatchServiceImpl implements IMatchService {

    @Autowired
    private RedisUtil redis;


    @Override
    public String requestMatching(String user, String courtGps) {
        
        


        return null;
    }

}
