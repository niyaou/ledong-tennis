package ledong.wxapp.service;

public interface IMatchService {

    /**
     * required a random match
     * 
     * 
     * first delete user's cache request,
     * 
     * then check whether other random request exist, match a request if existed  and  satisfied to the stratergy,
     * creating a match post ,set the request owner 's id  as  holder id whose request created time is earlier,
     * and set the post id to redis with the key identical to the word 'received' addition to holder's id with expired time 6s,return the post id to the user
     * 
     * 
     * if no request existed, or request does not match the stratergy, find a match post which satisfied to the strategy,return to the user
     * 
     * 
     * 
     * besides, update random request key to redis with expired time 6s,  and find the key identical to the word 'received' addition to user's id ,
     * until random request expired.  if any key existed, find the key' s content which is the match post id, return to the user
     * 
     * 
     * 
     * @param user
     * @param courtGps
     * @return request id
     */
    public String requestMatching(String user, String courtGps);

}
