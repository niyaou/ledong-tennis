package ledong.wxapp.service;

import java.util.HashMap;
import java.util.LinkedList;

public interface IMatchService {

    /**
     * required a random match
     * 
     * 
     * first delete user's cache request,
     * 
     * then check whether other random request exist, match a request if existed and
     * satisfied to the stratergy, creating a match post ,set the request owner 's
     * id as holder id whose request created time is earlier, and set the post id to
     * redis with the key identical to the word 'received' addition to holder's id
     * with expired time 6s,return the post id to the user
     * 
     * 
     * if no request existed, or request does not match the stratergy, find a match
     * post which satisfied to the strategy,return to the user
     * 
     * 
     * 
     * besides, update random request key to redis with expired time 6s, and find
     * the key identical to the word 'received' addition to user's id , until random
     * request expired. if any key existed, find the key' s content which is the
     * match post id, return to the user
     * 
     * 
     * 
     * @param user
     * @param courtGps
     * @return request id
     */
    public String requestMatching(String user, String courtGps);


    /**
     * required a random match
     * @param user
     * @return
     */
    public String  requestDoubleMatching(String user);

    /**
     * create a intentional match post data.
     * 
     * @param user
     * @param orderTime
     * @param courtName
     * @param courtGps
     * @return
     */
    public String postIntentionalMatch(String user, String orderTime, String courtName, String courtGps);

    /**
     * get intentional match list by count number
     * 
     * @param count
     * @return
     */
    public Object getIntentionalMatch(Integer count);

    /**
     * 
     * get the list of matched games
     * 
     * @param user
     * @param count
     * @return
     */
    public Object getMatchedList(String user, Integer count);

        /**
     * 
     * get the list of matched games
     * 
     * @param user
     * @param count
     * @return
     */
    public Object getDoubleMatchedList(String user, Integer count);

    /**
     * start a challenge match
     * 
     * @param holder
     * @param challenger
     * @return
     */
    public String postChallengeMatch(String holder, String challenger);

    /**
     * accept a exist intentional post match
     * 
     * @param challenger
     * @return
     */
    public String acceptIntentionalMatch(String parentId, String challenger);

    /**
     * create a match post
     * 
     * create a match post upsert post match to databases,and create a session of
     * this post match,set the session id to post match, also upsert session to
     * databases.
     * 
     * @param parendId
     * @param holder
     * @param challenger
     * @param matchType
     * @param clubMatch
     * @param orderTime
     * @param courtName
     * @param courtGps
     * @return
     */
    public String postMatches(String parendId, String holder, String challenger, int matchType, int clubMatch,
            String orderTime, String courtName, String courtGps);



    public String postDoubleMatches(String parendId, String holder, String challenger, int matchType, int clubMatch,
    String orderTime, String courtName, String courtGps);


    /**
     * create a session
     * 
     * find match in given id,does not create if match not existed.
     * 
     * set session id to match post data
     * 
     * 
     * @param matchId
     * @param holderId
     * @param challengerId
     * @return
     */
    public String attachedMatchSession(String matchId, String holderId, String challengerId);

    /**
     * find a exist intentional matchs
     * 
     * @param postUser return list which post by given user
     * @param exclusiveUser return list which NOT post by given user
     * @return
     */
    public LinkedList<HashMap<String, Object>> getIntentionalMatchs(String postUser, String exclusiveUser);

    /**
     * get list of session dialog context
     * 
     * 
     * @param sessionId
     * @param seconds 0: all context , others : recent seconds context
     * @return
     */
    public Object getSessionContext(String sessionId, int seconds);

    /**
     * 
     * get list of session context
     * 
     * @param sessionId
     * @param holderCount already have quantity
     * @param challengerCount already have quantity
     * @return
     */
    public Object getSessionContextWithQuantity(String sessionId, int holderCount, int challengerCount);

    /**
     * 
     * get the given match infos
     * 
     * @param matchId
     * @return
     */
    public Object getMatchInfos(String matchId);

    
    /**
     * 
     * get the given double match infos
     * 
     * @param matchId
     * @return
     */
    public Object getDoubleMatchInfos(String matchId);

    /**
     * 
     * update match infos
     * 
     * @param matchId
     * @param orderTime
     * @param courtName
     * @param courtGPS
     * @return
     */
    public Object updateMatchInfos(String matchId, String orderTime, String courtName,String courtGPS);


/**
     * 
     * update double match infos
     * 
     * @param matchId
     * @param orderTime
     * @param courtName
     * @param courtGPS
     * @param holder2
     * @param challenger2
     * @return
     */
    public Object updateDoubleMatchInfos(String matchId, String courtName,String courtGPS,String holder2 ,String  challenger2);

    /**
     * update match score 
     * 
     * @param matchId
     * @param holderScore
     * @param challengerScore
     * @return
     */
    public Object updateMatchScore(String matchId, Integer holderScore, Integer challengerScore);

        /**
     * update double match score 
     * 
     * @param matchId
     * @param holderScore
     * @param challengerScore
     * @return
     */
    public Object updateDoubleMatchScore(String matchId, Integer holderScore, Integer challengerScore);



    /**
     * 
     * user confirm match
     * 
     * @param matchId
     * @param type 0: holder, 1: challenger,  2: both
     * @return
     */
    public Object confirmMatch(String matchId, Integer type);

    

    /**
     * 
     * user confirm double match
     * 
     * @param matchId
     * @param type 0: holder, 1: challenger,  2: both
     * @return
     */
    public Object confirmDoubleMatch(String matchId, Integer type);

    /**
     * insert session context
     * 
     * @param sessionId
     * @param context
     * @param type 0: holder context , 1: challenger context
     * @return
     */
    public String insertSessionContext(String sessionId, String context, int type);

    /**
     * 
     * finish the given match ,upload score of this match ,and auto ranking , and
     * cache ranked match to redis
     * 
     * @param matchId
     * @param holderScore
     * @param challengerScore
     * @return
     */
    public String finishMatch(String matchId, int holderScore, int challengerScore);

       /**
     * 
     * finish the given double match ,upload score of this match ,and auto ranking , and
     * cache ranked match to redis
     * 
     * @param matchId
     * @param holderScore
     * @param challengerScore
     * @return
     */
    public String finishDoubleMatch(String matchId, int holderScore, int challengerScore);


    /**
     * finish slam match , set score and status
     * @param slamId
     * @param matchId
     * @param holderScore
     * @param challengerScore
     * @return
     */
    public String finishSlamMatch(String slamId,String matchId,Integer holderScore,Integer challengerScore);

    /**
     * get playing match
     * 
     * @param user
     * @return
     */
    public Object playingMatchInfo(String user);

    /**
     * get currently ranked match
     * 
     * @param user
     * @return
     */
    public Object rankedMatchInfo(String user);


    /**
     * get last match result
     * 
     * @param user
     * @return
     */
    public Object lastMatchResult(String user);



    /**
     * get playing match
     * 
     * @param user
     * @return
     */
    public Object playingDoubleMatchInfo(String user);

    /**
     * get currently ranked match
     * 
     * @param user
     * @return
     */
    public Object rankedDoubleMatchInfo(String user);


    /**
     * get last match result
     * 
     * @param user
     * @return
     */
    public Object lastDoubleMatchResult(String user);


    /**
     * 
     * get near by court
     * 
     * @param gps
     * @return
     */
    public LinkedList<HashMap<String, Object>> nearByCourt(String gps,Integer size);



    /**
     * get user most played court
     * 
     * @param user
     * @return
     */
    public HashMap<String,Object> commonCourt(String user);


    /**
     * delete match and session
     * @param id
     * @return
     */
    public String deleteMatches(String id);



     /**
      * create match by master
      * @param holder
      * @param courtName
      * @param challenger
      * @param courtGPS
      * @return
      */
    public String postSlamMatch(String holder, String courtName,String challenger,String courtGPS);



    /**
     * get started match by master
     * 
     * @return
     */
    public  LinkedList<HashMap<String, Object>>  getStartMatch();
}
