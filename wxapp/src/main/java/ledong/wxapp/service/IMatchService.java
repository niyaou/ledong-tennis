package ledong.wxapp.service;

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
     * create a intentional match post data.
     * 
     * @param user
     * @param orderTime
     * @param courtName
     * @param courtGps
     * @return
     */
    public String postIntentionalMatch(String user ,String orderTime,String courtName,String courtGps);


    /**
     * start a challenge match
     * @param holder
     * @param challenger
     * @return
     */
    public String postChallengeMatch(String holder,String challenger);


    /**
     * accept a exist intentional  post match
     * 
     * @param challenger
     * @return
     */
    public String  acceptIntentionalMatch(String parentId,String challenger);


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
}
